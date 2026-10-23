import { readFileSync, writeFileSync } from 'node:fs';
const read = (name: string) => JSON.parse(readFileSync(`tmp/${name}.json`, 'utf8'));
const docs = read('edition-audit-source');
const current = read('spells-current');
const legacy = read('spells-legacy');
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
// Use the aliases already maintained by the archive's pinned SRD importer.
const importer = readFileSync('studio/migrations/sync-srd-spells.ts', 'utf8');
const aliases = Object.fromEntries([...importer.matchAll(/^ {2}(\w+): \['([^']+)'\],$/gm)].map(m => [m[1], m[2]]));
const patches: any[] = [], audit: any[] = [];
for (const doc of docs.filter((d: any) => ['spell','item','race','species','feat','class'].includes(d._type))) {
 const name = normalize(doc.name);
 const duplicate = docs.some((d:any) => d._id !== doc._id && d._type === doc._type && normalize(d.name.replace(/\s*\((2014|2024|legacy)\)\s*$/i,'')) === normalize(doc.name.replace(/\s*\((2014|2024|legacy)\)\s*$/i,'')));
 let status = duplicate ? 'existing duplicates preserved' : 'needs verified edition sources';
 if (!duplicate && doc._type === 'spell' && !doc.isHomebrew && doc.source !== 'Homebrew') {
  const modern = current.find((s:any) => normalize(s.name) === name || aliases[normalize(s.name)] === name);
  const old = legacy.find((s:any) => normalize(s.name) === name || (modern && aliases[normalize(modern.name)] === normalize(s.name)));
  if (modern && old) {
   const components = (list:string[], material?:string) => ({verbal:list.includes('V'), somatic:list.includes('S'), material:list.includes('M'), materialDescription:material || ''});
   const rules2014 = {description:old.desc.join('\n\n'), higherLevels:(old.higher_level || []).join('\n\n'), level:old.level, castingTime:old.casting_time, range:old.range, duration:old.duration, concentration:old.concentration, ritual:old.ritual, components:components(old.components,old.material), classes:old.classes.map((c:any)=>c.index)};
   const rules2024 = {description:modern.description, higherLevels:modern.higherLevelSlot || modern.cantripUpgrade || '', level:modern.level, castingTime:modern.castingTime || ({action:'1 action',bonusAction:'1 bonus action',reaction:'1 reaction'} as any)[modern.actionType] || modern.actionType, range:modern.range, duration:modern.duration, concentration:modern.concentration === true, ritual:modern.ritual === true, components:components(modern.components || [],modern.material), classes:modern.classes.map((c:string)=>c.toLowerCase())};
   // School is a reference: resolve each edition to an existing school only.
   let missingSchool = false;
   for (const [variant, school] of [[rules2014,old.school.name],[rules2024,modern.school]] as const) {
    const existing = docs.find((d:any)=>d._type === 'magicSchool' && normalize(d.name) === normalize(school));
    const existingSpell = docs.find((d:any)=>d._type === 'spell' && normalize(d.legacySchoolName || '') === normalize(school) && d.school?._ref);
    const ref = existing?._id || existingSpell?.school?._ref;
    if (ref) Object.assign(variant,{school:{_type:'reference',_ref:ref},legacySchoolName:school});
    else if (normalize(old.school.name) !== normalize(modern.school)) missingSchool = true;
   }
   if (!missingSchool) {
    const same = JSON.stringify(rules2014) === JSON.stringify(rules2024);
    // Do not replace an editor's reviewed overrides on reruns.
    if (doc.sameForBoth === undefined && !doc.rules2014 && !doc.rules2024) patches.push({id:doc._id,revision:doc._rev,set:same ? {...rules2024,sameForBoth:true} : {sameForBoth:false,rules2014,rules2024}});
    status = 'verified against pinned SRD spell sources';
   } else status = 'needs school reference repair';
  }
 }
 audit.push({id:doc._id,type:doc._type,name:doc.name,status});
}
writeFileSync('tmp/edition-content-plan.json',JSON.stringify(patches,null,2));
writeFileSync('tmp/edition-content-audit.json',JSON.stringify(audit,null,2));
console.log(JSON.stringify({patches:patches.length,status:audit.reduce((a:any,d:any)=>(a[d.status]=(a[d.status]||0)+1,a),{})},null,2));
