import {getCliClient} from 'sanity/cli'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const client=getCliClient({apiVersion:'2024-01-01'})
const normalize=(s:string)=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]/g,'')
async function run(){
 if(process.argv.includes('--verify')){
  const plan=JSON.parse(readFileSync(resolve(process.cwd(),'../tmp/edition-research/background-feat-plan.json'),'utf8'))
  const actual=await client.fetch('*[_id in $ids]{_id,feats,originFeatSpellList}',{ids:plan.patches.map((p:any)=>p.id)})
  for(const p of plan.patches){const d=actual.find((x:any)=>x._id===p.id);if(d?.feats?.[0]?._ref!==p.set.feats[0]._ref || (d.originFeatSpellList??null)!==(p.set.originFeatSpellList??null))throw Error(`Verification failed: ${p.id}`)}
  console.log(`Verified ${plan.patches.length} background links.`);return
 }
 const docs=await client.fetch('*[_id in path("**") && !(_id in path("drafts.**")) && _type in ["background","feat"]]')
 const feats=docs.filter((d:any)=>d._type==='feat')
 const patches:any[]=[];const unresolved:any[]=[]
 for(const b of docs.filter((d:any)=>d._type==='background')){
  // Only link explicit grants already stated by this record. Choice grants
  // and edition-specific overrides need separate editorial handling.
  if(b.feats?.length || b.rules2024?.feats || b.rules2014?.feats)continue
  const match=b.feature?.description?.match(/^You gain the (.+?) feat as part of this background\./)
  if(!match)continue
  const spellList=match[1].match(/^Magic Initiate \((Cleric|Druid|Wizard)\)$/i)?.[1]?.toLowerCase()
  const name=spellList?'Magic Initiate':match[1]
  const candidates=feats.filter((f:any)=>normalize(f.name)===normalize(name))
  const feat=candidates.find((f:any)=>f.edition==='2024') || (candidates.length===1?candidates[0]:undefined)
  if(!feat){unresolved.push({background:b.name,feat:name,reason:candidates.length?'Ambiguous existing records':'Missing feat; verified source needed'});continue}
  patches.push({id:b._id,revision:b._rev,set:{feats:[{_type:'reference',_key:'background-feat',_ref:feat._id}],...(spellList?{originFeatSpellList:spellList}:{})}})
 }
 const plan={patches,unresolved}
 writeFileSync(resolve(process.cwd(),'../tmp/edition-research/background-feat-plan.json'),JSON.stringify(plan,null,2))
 console.log(`${patches.length} explicit background feat grants; ${unresolved.length} unresolved.`)
 if(!process.argv.includes('--apply'))return
 let tx=client.transaction()
 for(const p of patches)tx=tx.patch(p.id,pb=>pb.ifRevisionId(p.revision).set(p.set))
 if(patches.length)await tx.commit()
 const actual=await client.fetch('*[_id in $ids]{_id,feats,originFeatSpellList}',{ids:patches.map(p=>p.id)})
 for(const p of patches){const d=actual.find((x:any)=>x._id===p.id);if(d?.feats?.[0]?._ref!==p.set.feats[0]._ref || (d.originFeatSpellList??null)!==(p.set.originFeatSpellList??null))throw Error(`Verification failed: ${p.id}`)}
 console.log(`Verified ${patches.length} background links.`)
}
run().catch(e=>{console.error(e.message);process.exitCode=1})
