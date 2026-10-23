import {getCliClient} from 'sanity/cli'
const client=getCliClient({apiVersion:'2024-01-01'})
// Original concise summaries of the publisher's public preview (under 200 words):
// https://www.dndbeyond.com/posts/2112-choose-your-dragonmark-28-new-feats-that-explore
async function run(){
 const docs=await client.fetch('*[_id in path("**") && !(_id in path("drafts.**")) && _type in ["feat","background","ruleset"]]')
 const ruleset=docs.find((d:any)=>d._type==='ruleset' && d.key?.current==='srd-2024')
 if(!ruleset)throw Error('2024 ruleset missing')
 const records=[{
  name:'Mark of Storm',slug:'mark-of-storm',featCategory:'Dragonmark',
  description:'Requires an Eberron campaign and no other Dragonmark feat. Add 1d4 to Acrobatics and Navigator’s Tools checks; resist Lightning damage. Learn Thunderclap. At character level 3, always prepare Gust of Wind; cast it free once per Long Rest or with spell slots. Choose Intelligence, Wisdom, or Charisma for these spells. With Spellcasting or Pact Magic, expand that class’s spell list: level 1—Feather Fall, Fog Cloud; level 2—Levitate, Shatter; level 3—Sleet Storm, Wind Wall; level 4—Conjure Minor Elementals, Control Water; level 5—Conjure Elemental.',
  prerequisites:{level:1,features:['Eberron campaign','Cannot have another Dragonmark feat']},
 },{
  name:'Greater Mark of Storm',slug:'greater-mark-of-storm',featCategory:'General',
  description:'Requires level 4 and Mark of Storm. Increase one ability by 1, up to 20. Your Mark of Storm check bonus uses 1d6 instead of 1d4. Casting its free Gust of Wind also gives you a 60-foot Fly Speed for that spell’s duration.',
  prerequisites:{level:4,features:['Mark of Storm']},benefits:{flexibleAbilityIncrease:{amount:1,maxPerAbility:1,options:['STR','DEX','CON','INT','WIS','CHA']}}
 }]
 let tx=client.transaction();let count=0
 let storm=docs.find((d:any)=>d._type==='feat' && d.name==='Mark of Storm')?._id
 for(const r of records){
  if(docs.some((d:any)=>d._type==='feat' && d.name===r.name))continue
  const id=`feat-${r.slug}`;if(r.name==='Mark of Storm')storm=id
  tx=tx.create({_id:id,_type:'feat',...r,slug:{_type:'slug',current:r.slug},source:'Official',sourceBook:'Eberron: Forge of the Artificer',edition:'2024',isHomebrew:false,sameForBoth:false,rulesets:[{_type:'reference',_key:'2024',_ref:ruleset._id}]});count++
 }
 const background=docs.find((d:any)=>d._type==='background' && d.name==='House Lyrandar Heir')
 if(background && storm && !background.feats?.length)tx=tx.patch(background._id,p=>p.ifRevisionId(background._rev).set({feats:[{_type:'reference',_key:'storm',_ref:storm}]}))
 if(!process.argv.includes('--apply')){console.log(`${count} new feats prepared.`);return}
 await tx.commit()
 const actual=await client.fetch('*[_type=="feat" && name in $names]{name,description}',{names:records.map(r=>r.name)})
 for(const r of records)if(!actual.some((d:any)=>d.name===r.name && d.description===r.description))throw Error(`Verify ${r.name}`)
 console.log(`Verified ${count} new feats and House Lyrandar background link.`)
}
run().catch(e=>{console.error(e.message);process.exitCode=1})
