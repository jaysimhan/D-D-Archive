import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createClient} from '@sanity/client';
import {editionQuery} from '../src/lib/ruleset-query';
const c=createClient({projectId:'ylk0tk34',dataset:'production',apiVersion:'2024-01-01',useCdn:false});
const plan=JSON.parse(readFileSync('tmp/edition-research/catalogue-plan.json','utf8'));
const ids=[...plan.creates.map((d:any)=>d._id),...plan.patches.map((p:any)=>p.id)];
const docs=await c.fetch('*[_id in $ids]',{ids});const db=new Map<string,any>(docs.map((d:any)=>[d._id,d]));
assert.equal(db.size,ids.length);
for(const d of plan.creates){const current=db.get(d._id);for(const [k,v] of Object.entries(d))assert.deepEqual(current[k],v,`${d._id}.${k}`);}
for(const p of plan.patches){const current=db.get(p.id);for(const [k,v] of Object.entries(p.set))assert.deepEqual(current[k],v,`${p.id}.${k}`);}
for(const edition of ['2014','2024']){
 const params={edition,rulesetKey:`srd-${edition}`};
 const q=editionQuery(`{"subclasses":count(*[_type=="subclass"]),"fighter":*[_type=="class" && slug.current=="fighter"]{features[]->{name,description}},"sage":*[_type=="background" && name=="Sage"]{feats[]->{name},originFeatSpellList},"fireball":*[_type=="spell" && name=="Fireball"]{components},"items":count(*[_type=="item"])}`,edition);
 const result=await c.fetch(q,params);assert.equal(result.subclasses,224);assert.equal(result.sage[0].feats.length,edition==='2024'?1:0);assert.equal(result.fireball[0].components.verbal,true);assert.equal(result.fireball[0].components.material,true);
 assert.equal(result.fighter[0].features.some((f:any)=>f.name==='Tactical Mind'),edition==='2024');
 console.log(edition,`items=${result.items}, subclasses=${result.subclasses}, class and background routing verified`);
}
writeFileSync('tmp/edition-research/live-verified.json',JSON.stringify({verifiedAt:new Date().toISOString(),creates:plan.creates.length,patches:plan.patches.length},null,2));
console.log(`Live records exactly match all ${ids.length} prepared document writes.`);
