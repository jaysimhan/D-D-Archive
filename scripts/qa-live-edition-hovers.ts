import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { editionQuery } from '../src/lib/ruleset-query';
import { editionsDiffer } from '../src/components/library/edition-content';
const client = createClient({projectId:'ylk0tk34',dataset:'production',apiVersion:'2024-01-01',useCdn:false});
const source = readFileSync('src/hooks/useSheetSuggestions.ts','utf8');
function query(name: string) {
  const match = source.match(new RegExp('const '+name+' = `([\\s\\S]*?)`;'));
  assert.ok(match, `Missing production query ${name}`);
  return match[1];
}
const result = await Promise.all(['2014','2024'].map(async edition => {
  const params = {edition,rulesetKey:`srd-${edition}`};
  const [suggestions,spells,items] = await Promise.all([
    client.fetch(editionQuery(query('QUERY'),edition),params),
    client.fetch(editionQuery(query('SPELLS_QUERY'),edition),params),
    client.fetch(editionQuery('*[_type=="item" && name=="Greatsword"]{description,damage,properties}',edition),params),
  ]);
  const alert = suggestions.feats.find((f:any)=>f.name==='Alert');
  const cure = spells.find((s:any)=>s.name==='Cure Wounds');
  const fighter = suggestions.classes.find((c:any)=>c.name==='Fighter');
  assert.ok(alert?.description && cure?.description && fighter?.features?.length);
  assert.equal(fighter.features.some((f:any)=>f.name==='Tactical Mind'),edition==='2024');
  return {alert,cure,fighter,item:items[0]};
}));
for (const key of ['alert','cure','fighter','item'] as const) assert.ok(editionsDiffer(result[0][key],result[1][key]),`${key} editions should differ`);
assert.match(result[0].alert.description,/\+5/);
assert.match(result[1].alert.description,/proficiency/i);
console.log('Live production hover queries: Alert, Cure Wounds, Fighter features and Greatsword differ correctly between 5e and 5.5e.');
