import {getCliClient} from 'sanity/cli'
import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const client=getCliClient({apiVersion:'2024-01-01'})
const folder=resolve(process.cwd(),'../tmp/edition-research')
const plan=JSON.parse(readFileSync(resolve(folder,'catalogue-plan.json'),'utf8'))
async function run(){
 console.log(`Prepared ${plan.creates.length} new records and ${plan.patches.length} updates.`)
 if(!process.argv.includes('--apply'))return
 // Check every revision before writes; reject concurrent edits and require
 // a fresh plan for later runs rather than silently overwriting changes.
 const ids=plan.patches.map((p:any)=>p.id)
 const latest=await client.fetch('*[_id in $ids]{_id,_rev}',{ids})
 const revisions=new Map(latest.map((d:any)=>[d._id,d._rev]))
 for(const p of plan.patches)if(revisions.get(p.id)!==p.revision)throw Error(`Catalogue changed since snapshot: ${p.id}; rebuild the plan.`)
 // New objects reference one another, so create them in one atomic transaction.
 let tx=client.transaction()
 for(const d of plan.creates)tx=tx.create(d)
 if(plan.creates.length)await tx.commit()
 const committed:string[]=[]
 for(let i=0;i<plan.patches.length;i+=35){
  let batch=client.transaction()
  for(const p of plan.patches.slice(i,i+35))batch=batch.patch(p.id,pb=>pb.ifRevisionId(p.revision).set(p.set))
  await batch.commit()
  committed.push(...plan.patches.slice(i,i+35).map((p:any)=>p.id))
  writeFileSync(resolve(folder,'apply-progress.json'),JSON.stringify({created:plan.creates.map((d:any)=>d._id),patched:committed},null,2))
 }
 console.log(`Applied ${plan.creates.length} creates and ${committed.length} revision-guarded updates.`)
}
run().catch(error=>{console.error(error.message);process.exitCode=1})
