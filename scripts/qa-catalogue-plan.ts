import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {editionQuery} from '../src/lib/ruleset-query';
const require=createRequire(import.meta.url);const {parse,evaluate}=require('../studio/node_modules/groq-js');
const path='tmp/edition-research/';const read=(file:string)=>JSON.parse(readFileSync(path+file+'.json','utf8'));
const before=read('live-before'),plan=read('catalogue-plan');
const db=new Map<string,any>(before.map((d:any)=>[d._id,d]));
for(const d of plan.creates){assert.ok(!db.has(d._id),`Existing ID ${d._id}`);db.set(d._id,d);}
for(const p of plan.patches){const d=db.get(p.id);assert.equal(d._rev,p.revision);db.set(p.id,{...d,...p.set});}
const dataset=[...db.values()];
async function query(q:string,edition:string){return (await evaluate(parse(editionQuery(q,edition)),{dataset,params:{edition,rulesetKey:`srd-${edition}`}})).get();}
// Require every newly introduced reference to resolve. Existing unresolved
// archive references are audited separately and must not block this plan.
function checkRefs(value:any,path:string){if(!value||typeof value!=='object')return;if(value._ref)assert.ok(db.has(value._ref)||value._ref.startsWith('image-'),`Dangling ${path}: ${value._ref}`);for(const [k,v] of Object.entries(value))checkRefs(v,path+'.'+k);}
for(const d of plan.creates)checkRefs(d,d._id);
for(const p of plan.patches)checkRefs(p.set,p.id);
const slugOwners=new Map<string,string>();
for(const d of before)if(d.slug?.current)slugOwners.set(d._type+':'+d.slug.current,d._id);
for(const d of plan.creates)if(d.slug?.current){const key=d._type+':'+d.slug.current;assert.ok(!slugOwners.has(key),`Slug collision ${key}`);slugOwners.set(key,d._id);}
for(const d of plan.creates.filter((d:any)=>!['ruleset'].includes(d._type)))assert.ok(d.description?.trim(),`Missing description ${d._id}`);
const fireball=(await query('*[_type=="spell" && name=="Fireball"]{components,classes}','2024'))[0];
assert.equal(fireball.components.verbal,true);assert.equal(fireball.components.somatic,true);assert.equal(fireball.components.material,true);assert.ok(fireball.classes.includes('warmage'));
const subtypeCounts=await Promise.all(['2014','2024'].map(e=>query('*[_type=="subclass"]{_id}',e)));assert.equal(subtypeCounts[0].length,224);assert.equal(subtypeCounts[1].length,224);
for(const year of ['2014','2024']){
 const classes=await query('*[_type=="class" && slug.current in ["fighter","monk","wizard"]]{name,features[]->{name,"level":acquiredAtLevel,description}}',year);
 for(const c of classes){assert.ok(c.features.length>=5,c.name);assert.ok(c.features.every((f:any)=>f?.description?.length>0),c.name);}
 const sage=(await query('*[_type=="background" && name=="Sage"]{feature,originFeatSpellList,feats[]->{name,benefits}}',year))[0];
 assert.equal(sage.feats.length,year==='2024'?1:0);
 if(year==='2024'){assert.equal(sage.originFeatSpellList,'wizard');assert.equal(sage.feats[0].benefits.flexibleAbilityIncrease,undefined);}
 const alert=await query('*[_type=="feat" && name=="Alert"]{description}',year);assert.equal(alert.length,1);
}
const fighter14=(await query('*[_type=="class" && slug.current=="fighter"]{features[]->{name,description}}','2014'))[0];
const fighter24=(await query('*[_type=="class" && slug.current=="fighter"]{features[]->{name,description}}','2024'))[0];
assert.ok(!fighter14.features.some((f:any)=>f.name==='Tactical Mind'));assert.ok(fighter24.features.some((f:any)=>f.name==='Tactical Mind'));
const items24=await query('*[_type=="item"]{_id,description}','2024');assert.ok(items24.length>300);
console.log(`Plan checks passed: ${plan.creates.length} new documents, ${plan.patches.length} patches; resolved references, unique slugs, component flags, shared subclasses, class features and background feat routing.`);
