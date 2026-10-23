import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { editionQuery } from '../src/lib/ruleset-query';
import { editionsDiffer } from '../src/components/library/edition-content';
import { noteMap } from '../src/components/character-sheet/entry-notes';
const require = createRequire(import.meta.url);
const { parse, evaluate } = require('../studio/node_modules/groq-js');
const dataset = [
  {_id: 'a', _type:'spell', name:'A', edition:'Both', sameForBoth:false, level:1, classes:['wizard'], rules2014:{_type:'rules2014',description:'old', level:0, classes:['cleric'], concentration:false}, rules2024:{description:'new', level:2}},
  {_id: 'b', _type:'spell', name:'B', edition:'2014'},
  {_id: 'c', _type:'spell', name:'C', edition:'Both', sameForBoth:true, description:'shared', rules2014:{description:'ignored'}},
  {_id: 'f', _type:'feature', name:'Feature', description:'base', sameForBoth:false, rules2014:{description:'old feature'}},
  {_id: 'class', _type:'class', name:'Class', features:[{_ref:'f',_type:'reference'}]},
];
async function run(q:string, edition:string) {
 return (await evaluate(parse(editionQuery(q,edition)), {dataset,params:{edition,rulesetKey:`srd-${edition}`}})).get();
}
const old = await run('*[_type == "spell"]{name,description,level,concentration}', '2014');
assert.equal(old[0].description,'old'); assert.equal(old[0].level,0); assert.equal(old[0].concentration,false); assert.equal(old[2].description,'shared');
assert.equal((await run('*[_type == "spell"]{name}', '2024')).length,2);
assert.equal((await run('*[_type == "spell" && "cleric" in classes]{name}', '2014')).length,1);
assert.equal((await run('*[_type == "class"]{features[]{"description": @->description}}','2014'))[0].features[0].description,'old feature');
assert.equal((await run('*[_type == "class"]{features[]->{name,description}}','2014'))[0].features[0].description,'old feature');
assert.equal(editionsDiffer({description:'same',rules2014:{description:'old'}},{description:'same',rules2014:{description:'different'}}),false);
assert.equal(editionsDiffer({description:'old'},{description:'new'}),true);
assert.equal(editionsDiffer({description:'same',damage:{diceCount:1}},{description:'same',damage:{diceCount:2}}),true);
assert.equal(editionsDiffer(undefined,{description:'one edition only'}),false);
const oldClass = (await run('*[_type == "class"]{features[]->{name,description}}','2014'))[0];
const newClass = (await run('*[_type == "class"]{features[]->{name,description}}','2024'))[0];
assert.equal(editionsDiffer(oldClass,newClass),true,'Referenced class feature changes must enable the library switch');
assert.equal(noteMap(oldClass.features,[{name:'Feature',description:'saved 2024 text'}]).feature,'old feature');
assert.equal(noteMap(newClass.features,[{name:'Feature',description:'saved 2014 text'}]).feature,'base');
console.log('Edition resolution: availability, descriptions, mechanics, false/zero, class lists, shared content and references passed.');
// Parse every production catalogue/sheet projection after transformation.
const { readFileSync } = await import('node:fs');
for (const path of ['src/hooks/useSanityData.ts','src/hooks/useSheetSuggestions.ts']) {
 const source = readFileSync(path,'utf8');
 for (const match of source.matchAll(/`([^`]*(?:\*\[)[^`]*)`/g)) {
  const query = match[1].replace(/\$\{rulesetFilter\(ruleset\)\}/g,'');
  if (query.includes('${')) continue;
  parse(editionQuery(query,'2014'));
 }
}
console.log('All catalogue and sheet queries parse after edition resolution.');
