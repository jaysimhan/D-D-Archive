import {readFileSync,writeFileSync} from 'node:fs';
import {SRD_MAGIC_ITEMS} from '../src/data/srd-magic-items';
import {WEAPONS,ARMOR} from '../src/data/srd-equipment';
import {WEAPON_PRICES,ARMOR_PRICES,ADVENTURING_GEAR_CATALOGUE,TOOL_CATALOGUE,MOUNTS_AND_VEHICLES} from '../src/data/srd-equipment-catalogue';
const root='tmp/edition-research/';
const read=(file:string)=>JSON.parse(readFileSync(root+file+'.json','utf8'));
const docs:any[]=read('live-before'); const srd=read('srd-2024-sections');
const oldMagic:any[]=read('legacy-magic-items'), oldGear:any[]=read('legacy-equipment');
const byId=new Map(docs.map(d=>[d._id,d]));
const changes=new Map<string,any>(); const creates=new Map<string,any>(); const audit:any[]=[];
const norm=(s:string)=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9+]/g,'');
const slug=(s:string)=>s.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const ref=(id:string,key=id)=>({_type:'reference',_ref:id,_key:key});
const refs=[ref('ruleset.srd-2014','srd-2014'),ref('86642d23-c52d-4577-adc1-214aab0f43e9','srd-2024')];
const shortText=(s:string)=>s.replace(/\s+/g,' ').trim();
const compareText=(s:string)=>s.toLowerCase().replace(/[’]/g,"'").replace(/[\s\u00ad]+/g,' ').trim();
function find(type:string,name:string){return [...docs,...creates.values()].filter(d=>d._type===type&&norm(d.name)===norm(name));}
function set(doc:any,patch:any,reason:string){
 if(creates.has(doc._id)){Object.assign(creates.get(doc._id),patch);return;}
 const op=changes.get(doc._id)||{id:doc._id,revision:doc._rev,set:{},reasons:[]};Object.assign(op.set,patch);op.reasons.push(reason);changes.set(doc._id,op);
}
function create(type:string,name:string,fields:any){const id=`${type}-srd-${slug(name)}`;if(byId.has(id)||creates.has(id))throw Error(`ID collision: ${id}`);const d={_id:id,_type:type,name,slug:{_type:'slug',current:docs.some(d=>d._type===type&&d.slug?.current===slug(name))?`srd-${slug(name)}`:slug(name)},source:'Official',sourceBook:'System Reference Document 5.1 / 5.2.1',edition:'Both',version:1,isHomebrew:false,rulesets:refs,...fields};creates.set(id,d);return d;}
function upsert(type:string,name:string,fields:any,reason:string){const matches=find(type,name);if(matches.length>1){audit.push({type,name,status:'existing duplicate entries preserved'});return undefined;}if(matches.length){set(matches[0],fields,reason);return matches[0];}return create(type,name,fields);}
function editions(old:any,current:any){
 if(old&&current){const same=JSON.stringify(old)===JSON.stringify(current);return same?{...current,sameForBoth:true}:{...current,sameForBoth:false,rules2014:old,rules2024:current};}
 const year=old?'2014':'2024';return {...(old||current),sameForBoth:true,edition:year,rulesets:[refs[year==='2014'?0:1]]};
}
// Repair missing reference targets used throughout the existing catalogue.
if(!byId.has(refs[0]._ref))creates.set(refs[0]._ref,{_id:refs[0]._ref,_type:'ruleset',name:'D&D 5e (2014)',key:{_type:'slug',current:'srd-2014'},description:'2014 fifth edition rules (SRD 5.1).'});
for(const name of ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation']){
 const id=`magicSchool.${name.toLowerCase()}`;
 if(docs.some(d=>d._type==='magicSchool'&&norm(d.name)===norm(name)))continue;
 if(!byId.has(id))creates.set(id,{_id:id,_type:'magicSchool',name,slug:{_type:'slug',current:name.toLowerCase()},description:`The ${name.toLowerCase()} school of magic.`,rulesets:refs});
}
// All subclasses use shared mechanics and are available in both editions by owner request.
for(const d of docs.filter(d=>d._type==='subclass'))set(d,{rulesets:refs,edition:'Both',sameForBoth:true},'Owner policy: shared subclasses in both editions');
// Spells: source data uses lowercase component codes in 2024. Preserve the
// custom class lists added by the archive, but not the other edition's core lists.
const modernSpells=JSON.parse(readFileSync('tmp/spells-current.json','utf8'));
const oldSpells=JSON.parse(readFileSync('tmp/spells-legacy.json','utf8'));
const importer=readFileSync('studio/migrations/sync-srd-spells.ts','utf8');
const aliases=Object.fromEntries([...importer.matchAll(/^ {2}(\w+): \['([^']+)'\],$/gm)].map(m=>[m[1],m[2]]));
const coreClasses=new Set(['barbarian','bard','cleric','druid','fighter','monk','paladin','ranger','rogue','sorcerer','warlock','wizard']);
const components=(list:string[],material?:string)=>{const l=list.map(x=>x.toLowerCase());return {verbal:l.includes('v'),somatic:l.includes('s'),material:l.includes('m'),materialDescription:material||''};};
for(const s of modernSpells){
 const matches=docs.filter(d=>d._type==='spell'&&(norm(d.name)===norm(s.name)||norm(d.name)===aliases[norm(s.name)]));
 if(matches.length>1){audit.push({type:'spell',name:s.name,status:'existing duplicates preserved'});continue;}
 const d=matches[0]; if(d?.isHomebrew)continue;
 const old=oldSpells.find((o:any)=>norm(o.name)===norm(s.name)||norm(o.name)===aliases[norm(s.name)]);
 const extras=(d?.classes||[]).filter((c:string)=>!coreClasses.has(c));
 const modern={description:s.description,higherLevels:s.higherLevelSlot||s.cantripUpgrade||'',level:s.level,school:ref(docs.find(d=>d._type==='magicSchool'&&norm(d.name)===norm(s.school))?._id||`magicSchool.${s.school.toLowerCase()}`),legacySchoolName:s.school[0].toUpperCase()+s.school.slice(1),castingTime:s.castingTime||({action:'1 action',bonusAction:'1 bonus action',reaction:'1 reaction'} as any)[s.actionType]||s.actionType,range:s.range,duration:s.duration,concentration:s.concentration===true,ritual:s.ritual===true,components:components(s.components||[],s.material),classes:[...new Set([...s.classes.map((c:string)=>c.toLowerCase()),...extras])].sort()};
 const legacy=old?{description:old.desc.join('\n\n'),higherLevels:(old.higher_level||[]).join('\n\n'),level:old.level,school:ref(docs.find(d=>d._type==='magicSchool'&&norm(d.name)===norm(old.school.name))?._id||`magicSchool.${old.school.index}`),legacySchoolName:old.school.name,castingTime:old.casting_time,range:old.range,duration:old.duration,concentration:old.concentration,ritual:old.ritual,components:components(old.components,old.material),classes:[...new Set([...old.classes.map((c:any)=>c.index),...extras])].sort()}:undefined;
 const fields={...editions(legacy,modern),versionNotes:'Descriptions and mechanics checked against SRD 5.1 and SRD 5.2.1. Extra archive class spell lists retained.'};
 if(d)set(d,fields,'SRD spells and component correction');else create('spell',s.name,fields);
}
// Magic items: full official SRD entries, including tables and subtypes.
const magicAliases:Record<string,string>={dragonorb:'orbofdragonkind',mysteriousdeck:'deckofmanythings',ironbands:'ironbandsofbinding',potionsofhealing:'potionofhealing'};
const validMagic=srd.magicItems.filter((s:any)=>/^(Armor|Weapon|Wondrous Item|Potion|Ring|Rod|Staff|Wand|Scroll)\b/.test(s.description));
const magicFields=(name:string,description:string,rarity?:string)=>{
 const header=shortText(description).split(/(?<=\))\s+(?=[A-Z])|\n/)[0];
 const type=description.match(/^(Armor|Weapon|Wondrous Item|Potion|Ring|Rod|Staff|Wand|Scroll)/)?.[1]||'Wondrous Item';
 const category=type==='Scroll'?'Scroll':type;
 const r=rarity&&rarity!=='Varies'?rarity:header.match(/\b(Very Rare|Legendary|Uncommon|Common|Rare|Artifact)\b/i)?.[1];
 return {description,type:category,itemCategory:category,magical:true,requiresAttunement:/requires attunement/i.test(description.split(/\n/).slice(0,4).join(' ')),...(r?{rarity:r.replace(/\b\w/g,x=>x.toUpperCase())}:{}),properties:[]};
};
for(const s of validMagic){
 const n=norm(s.name),old=oldMagic.find(o=>!o.variant&&(norm(o.name)===n||norm(o.name)===magicAliases[n]));
 const matches=[...find('item',s.name),...(old&&norm(old.name)!==n?find('item',old.name):[])];
 if(matches.length>1){audit.push({type:'item',name:s.name,status:'existing duplicate entries preserved'});continue;}
 const modern=magicFields(s.name,s.description);
 const legacy=old?magicFields(old.name,old.desc.join('\n\n'),old.rarity.name):undefined;
 // Exact same text modulo case/whitespace/punctuation typography is sufficient
 // evidence for a shared entry; differing wording stays edition-specific.
 const verifiedUnchanged=new Set(['Adamantine Armor','Amulet of Health','Cloak of Protection','Gauntlets of Ogre Power','Headband of Intellect','Goggles of Night','Ring of Protection','Ring of Swimming']);
 if(legacy&&(compareText(legacy.description)===compareText(modern.description)||verifiedUnchanged.has(s.name)))legacy.description=modern.description;
 const fields={...editions(legacy,modern),versionNotes:`SRD 5.2.1 p. ${s.page}${old?'; compared with SRD 5.1.':'; introduced in this SRD catalogue.'}`};
 if(matches[0])set(matches[0],fields,'Official SRD magic item descriptions');else create('item',s.name,fields);
}
// Preserve older SRD magic items not represented by a modern entry; do not
// create subtype duplicates for a parent that already documents the variants.
for(const old of oldMagic.filter(o=>!o.variant)){
 if(validMagic.some((s:any)=>norm(s.name)===norm(old.name)||magicAliases[norm(s.name)]===norm(old.name)))continue;
 upsert('item',old.name,editions(magicFields(old.name,old.desc.join('\n\n'),old.rarity.name),undefined),'SRD 5.1-only magic item');
}
// Mundane equipment. Every entry gets a useful description as well as prices,
// weight, weapon damage or armor class where the SRD defines those mechanics.
const gearAliases:Record<string,string>={acid:'acidvial',alchemistsfire:'alchemistsfireflask',antitoxin:'antitoxinvial',ballbearings:'ballbearingsbagof1000',caltrops:'caltropsbagof20',chain:'chain10feet',holywater:'holywaterflask',ink:'ink1ouncebottle',ladder:'ladder10foot',mirror:'mirrorsteel',oil:'oilflask',paper:'paperonesheet',parchment:'parchmentonesheet',perfume:'perfumevial',poisonbasic:'poisonbasicvial',pole:'pole10foot',rations:'rations1day',rope:'ropehempen50feet',spikesiron:'spikesiron10',tent:'tenttwoperson'};
function gearLegacy(o:any,description?:string){
 const type=o.weapon_category?'Weapon':o.armor_category?'Armor':o.tool_category?'Tool':'Adventuring Gear';
 const damage=o.damage?.damage_dice?.match(/^(\d+)d(\d+)$/);
 return {description:description||(o.desc||[]).join('\n\n')||`${o.name}. ${o.equipment_category.name}. Cost: ${o.cost.quantity} ${o.cost.unit}.${o.weight!==undefined?` Weight: ${o.weight} lb.`:''}`,type,itemCategory:type==='Adventuring Gear'?'Gear':type,magical:false,requiresAttunement:false,cost:{amount:o.cost.quantity,currency:o.cost.unit},...(o.weight!==undefined?{weight:o.weight}:{}),properties:(o.properties||[]).map((p:any)=>p.name),...(damage?{damage:{diceCount:+damage[1],diceType:`d${damage[2]}`,damageType:o.damage.damage_type.name}}:{}),...(o.armor_class?{armorClass:{base:o.armor_class.base,dexterityModifier:o.armor_class.dex_bonus?(o.armor_class.max_bonus===2?'max2':'full'):'none',stealthDisadvantage:o.stealth_disadvantage===true}}:{})};
}
const processedGear=new Set<string>();
for(const s of srd.equipment.filter((s:any)=>s.name!=='Speed')){
 const name=s.name.replace(/\s*\([^)]*\)\s*$/,'').replace(/[’]/g,"'");
 if(name==='Potion of Healing'||name==='Spell Scroll')continue;
 const key=norm(name); const old=oldGear.find(o=>norm(o.name)===key||norm(o.name)===gearAliases[key]);
 const catalogue=[...ADVENTURING_GEAR_CATALOGUE,...TOOL_CATALOGUE].find(c=>norm(c.name)===key);
 const price=s.name.match(/\(([\d,]+) (CP|SP|GP)\)/);const type=s.page<=94&&(s.description.startsWith('Ability:')||TOOL_CATALOGUE.some(c=>norm(c.name)===key))?'Tool':'Adventuring Gear';
 const modern={description:s.description,type,itemCategory:type==='Tool'?'Tool':'Gear',magical:false,requiresAttunement:false,properties:[],...(price?{cost:{amount:+price[1].replace(/,/g,''),currency:price[2].toLowerCase()}}:{}),...(catalogue?.weight!==undefined?{weight:catalogue.weight}:old?.weight!==undefined?{weight:old.weight}:{})};
 const fields=editions(old?gearLegacy(old):undefined,modern);
 const matches=[...find('item',name),...(old&&norm(old.name)!==key?find('item',old.name):[])];
 if(matches.length>1){audit.push({type:'item',name,status:'existing duplicate entries preserved'});continue;}
 if(matches[0])set(matches[0],fields,'SRD equipment descriptions');else create('item',name,fields);
 if(old)processedGear.add(old.index);
}
for(const w of WEAPONS){
 const old=oldGear.find(o=>norm(o.name)===norm(w.name)||norm(o.name)===norm(w.name.split(' ').reverse().join(' ')));
 const price=WEAPON_PRICES[w.name];if(!price)continue;
 const properties=['finesse','light','heavy','twoHanded','reach','loading','thrown'].filter(k=>(w as any)[k]).map(k=>k==='twoHanded'?'Two-Handed':k[0].toUpperCase()+k.slice(1));
 if(w.range)properties.push(`Range (${w.range.join('/')})`);if(w.versatile)properties.push(`Versatile (${w.versatile})`);
 const dice=w.damage.match(/^(\d+)d(\d+)$/);
 const modern={description:`${w.category} ${w.kind.toLowerCase()} weapon. Damage: ${w.damage||'none'} ${w.damageType}. ${properties.join('; ')}.${w.mastery?` Mastery: ${w.mastery}.`:''}`,type:'Weapon',itemCategory:'Weapon',magical:false,requiresAttunement:false,cost:{amount:price.cost[0],currency:price.cost[1]},weight:price.weight,properties,...(dice?{damage:{diceCount:+dice[1],diceType:`d${dice[2]}`,damageType:w.damageType}}:{})};
 // Net is an adventuring item in 2024 and was handled above.
 if(w.name==='Net')continue;
 upsert('item',w.name,editions(old?gearLegacy(old):undefined,modern),'SRD weapon statistics');if(old)processedGear.add(old.index);
}
for(const a of ARMOR){
 const old=oldGear.find(o=>norm(o.name)===norm(a.name));const price=ARMOR_PRICES[a.name];if(!old||!price)continue;
 const legacy=gearLegacy(old);const modern={...legacy,cost:{amount:price.cost[0],currency:price.cost[1]},weight:price.weight};
 // Core armor AC, weight and prices are unchanged in the two SRDs.
 upsert('item',a.name,editions(legacy,modern),'Compared core armor statistics');processedGear.add(old.index);
}
for(const c of [...TOOL_CATALOGUE,...MOUNTS_AND_VEHICLES]){
 const old=oldGear.find(o=>norm(o.name)===norm(c.name));
 const existing=find('item',c.name)[0];
 if(existing&&!creates.has(existing._id)&&changes.has(existing._id))continue;
 if(existing&&creates.has(existing._id)&&existing.edition!=='2014')continue;
 const type='kind' in c?'Tool':'Adventuring Gear';
 const description=c.description+('speed' in c&&c.speed?` Speed: ${c.speed}.`:'')+('capacity' in c&&c.capacity?` Carrying capacity: ${c.capacity}.`:'');
 const modern={description,type,itemCategory:type==='Tool'?'Tool':'Gear',magical:false,requiresAttunement:false,properties:[],cost:{amount:c.cost[0],currency:c.cost[1]},...(c.weight!==undefined?{weight:c.weight}:{})};
 if(existing)set(existing,editions(old?gearLegacy(old):undefined,modern),'SRD tool and vehicle catalogue');else create('item',c.name,editions(old?gearLegacy(old):undefined,modern));
 if(old)processedGear.add(old.index);
}
for(const o of oldGear){
 if(processedGear.has(o.index)||find('item',o.name).length)continue;
 // Includes the older equipment variants, mounts, vehicles and trade goods.
 upsert('item',o.name,editions(gearLegacy(o),undefined),'Additional SRD 5.1 equipment');
}
// Complete core class feature lists. A feature shared by the editions remains
// one document, and class-level arrays select the relevant features.
const legacyFeatures:any[]=read('legacy-features');
const legacyClasses:any[]=read('legacy-classes');
for(const [classId,modernFeatures] of Object.entries(srd.classes) as [string,any[]][]){
 const cls=docs.find(d=>d._type==='class'&&d.slug?.current===classId);if(!cls)continue;
 const old=legacyFeatures.filter(f=>f.class?.index===classId&&!f.subclass&&!f.parent);
 const nameKey=(name:string)=>norm(name.replace(/\s*\([^)]*\)\s*$/,''));
 const oldGroups=new Map<string,any[]>();
 for(const f of old){const key=nameKey(f.name);oldGroups.set(key,[...(oldGroups.get(key)||[]),f]);}
 const modernGroups=new Map<string,any[]>();
 for(const f of modernFeatures){const key=nameKey(f.name);modernGroups.set(key,[...(modernGroups.get(key)||[]),f]);}
 const oldRefs:any[]=[],modernRefs:any[]=[];
 const owned=(cls.features||[]).map((r:any)=>byId.get(r._ref)).filter(Boolean);
 for(const key of new Set([...oldGroups.keys(),...modernGroups.keys()])){
  const a=oldGroups.get(key),b=modernGroups.get(key);const name=b?.[0].name||a![0].name;
  const legacy=a?{description:[...new Set(a.map(f=>f.desc.join('\n\n')))].join('\n\n'),acquiredAtLevel:Math.min(...a.map(f=>f.level))}:undefined;
  const modern=b?{description:b.map(f=>f.description).join('\n\n'),acquiredAtLevel:Math.min(...b.map(f=>f.level))}:undefined;
  // Empty API spellcasting summaries are supplemented from class-specific rules.
  if(legacy&&key==='spellcasting'){
   const casting=legacyClasses.find(c=>c.index===classId)?.spellcasting;
   if(casting?.info)legacy.description=casting.info.map((i:any)=>`${i.name}\n${i.desc.join('\n\n')}`).join('\n\n');
  }
  const candidates=owned.filter((f:any)=>nameKey(f.name)===key);
  let feature:any;
  const fields=editions(legacy,modern);
  if(candidates.length===1){feature=candidates[0];set(feature,fields,'Core class feature comparison');}
  else if(candidates.length>1){
   // Existing duplicate features remain intact; reuse them without adding another.
   if(a)oldRefs.push(...candidates.map((f:any)=>ref(f._id)));
   if(b)modernRefs.push(...candidates.map((f:any)=>ref(f._id)));
   continue;
  }else feature=create('feature',`${cls.name}: ${name}`,{...fields,name,slug:{_type:'slug',current:`${classId}-${slug(name)}`}});
  if(a)oldRefs.push(ref(feature._id));if(b)modernRefs.push(ref(feature._id));
 }
 const progression=(features:any[],year:string)=>Array.from({length:20},(_,i)=>{
  const level=i+1;const resources=[];
  if(classId==='monk')resources.push({_key:'martial-arts',name:'Martial Arts',value:year==='2014'?(level<5?'1d4':level<11?'1d6':level<17?'1d8':'1d10'):(level<5?'1d6':level<11?'1d8':level<17?'1d10':'1d12')});
  return {_key:`level-${level}`,level,proficiencyBonus:2+Math.floor(i/4),featureNames:[...new Set(features.filter(f=>f.level===level).map(f=>f.name))],resources};
 });
 set(cls,{sameForBoth:false,rules2014:{...(cls.rules2014||{}),features:oldRefs,progression:progression(old,'2014')},rules2024:{...(cls.rules2024||{}),features:modernRefs,progression:progression(modernFeatures,'2024')},versionNotes:'Core class features compared against SRD 5.1 and SRD 5.2.1. Subclasses remain shared in both editions by owner request.'},'Complete core class progression');
}
// Every Origin feat grants exactly its printed benefits, not a blanket +1 ASI.
const oldOrigin:Record<string,string>={
 'Magic Initiate':'Choose Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard. Learn two cantrips and one level-1 spell from that class. You may cast the level-1 spell once at its lowest level, regaining this use after a long rest. Use the spellcasting ability associated with the chosen class.',
 'Skilled':'Gain proficiency in any combination of three skills or tools.',
 'Savage Attacker':'Once on each of your turns, reroll the damage dice of a melee weapon attack and use either total.',
 'Tough':'Your hit point maximum increases by twice your character level when you take this feat. It increases by 2 for each subsequent level.',
 'Healer':'Using a healer’s kit to stabilize a dying creature also restores 1 hit point. As an action, spend one kit use to heal a creature for 1d6 + 4 + its maximum number of Hit Dice. A creature can receive this healing once per short or long rest.',
 'Tavern Brawler':'Increase Strength or Constitution by 1 (maximum 20). Gain proficiency with improvised weapons and use a d4 for unarmed damage. After hitting with an unarmed strike or improvised weapon on your turn, you may attempt to grapple the target as a bonus action.',
 'Lucky':'You have three luck points per long rest. Spend one to roll an additional d20 for an attack, ability check, or saving throw and choose the die used, or use a luck point when attacked to choose between the attacker’s roll and your extra die.'
};
const originModern:Record<string,string>={
 'Healer':'As a Utilize action, spend one use of a Healer’s Kit on a creature within 5 feet. That creature may spend one Hit Point Die; roll it and restore that result plus your Proficiency Bonus. When you roll healing dice for this benefit or a spell, reroll any 1 and use the new result.',
 'Tough':oldOrigin.Tough,
 'Lucky':'You have Luck Points equal to your Proficiency Bonus, restored on a Long Rest. Spend one after a D20 Test roll to gain Advantage, or when a creature rolls an attack against you to impose Disadvantage.',
 'Crafter':'Gain proficiency with three Artisan’s Tools. Receive a 20 percent discount on nonmagical purchases. After a Long Rest, you can use a proficient tool to make an eligible item from the Fast Crafting table; it lasts until your next Long Rest.',
 'Musician':'Gain proficiency with three Musical Instruments. At the end of a Short or Long Rest, play a proficient instrument to give Heroic Inspiration to a number of allies up to your Proficiency Bonus.',
 'Tavern Brawler':'Your Unarmed Strike damage can be 1d4 plus Strength. Reroll a damage die showing 1 for your Unarmed Strike and use the new result. Gain proficiency with improvised weapons. Once per turn, an Unarmed Strike hit during your Attack action can push the target 5 feet.'
};
// Keep both existing Alert documents, while correcting their edition routing.
for(const [id,year] of [['feat-alert','2014'],['feat-alert-2024','2024']]){
 const d=byId.get(id);if(d)set(d,{edition:year,rulesets:[refs[year==='2014'?0:1]],sameForBoth:true},'Preserve existing Alert pair and route each to its edition');
}
const seedModule=await import('../studio/migrations/data/feats-2024-phb');
const featSeeds=seedModule.FEATS_2024;
for(const seed of featSeeds){
 const matches=find('feat',seed.name);if(matches.length>1){audit.push({type:'feat',name:seed.name,status:'existing duplicate entries preserved'});continue;}
 const source=srd.feats.find((s:any)=>s.name===seed.name);
 const origin=seed.category==='Origin';
 const fixed=seed.ability?.fixed; const flexible=seed.ability&&!fixed?{amount:seed.ability.amount||1,options:seed.ability.flex||[],maxPerAbility:seed.ability.maxPerAbility||1}:undefined;
 const description=source?.description||originModern[seed.name]||seed.description;
 const modern={description,featCategory:seed.category,prerequisites:{level:seed.level??(seed.category==='General'?4:seed.category==='Epic Boon'?19:1),...(seed.prereqAbility?{abilityScore:seed.prereqAbility}:{}),...(seed.prereqFeatures?{features:seed.prereqFeatures}:{})},benefits:{features:[description],...(!origin&&fixed?{abilityScoreIncrease:fixed}:{}),...(!origin&&flexible?{flexibleAbilityIncrease:flexible}:{})}};
 // Only replace existing non-Origin entries when the full SRD source exists.
 if(matches.length&&!source&&!origin)continue;
 let legacy:any;
 if(oldOrigin[seed.name])legacy={description:oldOrigin[seed.name],featCategory:'General',prerequisites:{level:1},benefits:{features:[oldOrigin[seed.name]]}};
 if(seed.name==='Tavern Brawler'&&legacy)legacy.benefits.flexibleAbilityIncrease={amount:1,options:['STR','CON'],maxPerAbility:1};
 if(seed.name==='Grappler'){
  const f=read('legacy-feats')[0];legacy={description:f.desc.join('\n\n'),featCategory:'General',prerequisites:{level:1,abilityScore:{STR:13}},benefits:{features:f.desc}};
 }
 // Existing non-SRD legacy entries are not overwritten by an invented legacy counterpart.
 const fields=editions(legacy,modern);
 if(seed.name==='Magic Initiate'){
  const grant=(level:number,count:number)=>({_key:`magic-initiate-${level}`,_type:'featureGrant',grantType:'Spell Slot',slotLevel:level,slotCount:count,resetCondition:'Long Rest'});
  Object.assign(fields,{grants:[grant(0,2),grant(1,1)]});
 }
 if(matches[0])set(matches[0],fields,'Verified feat descriptions and removal of unprinted Origin ASIs');else create('feat',seed.name,fields);
}
// All sixteen 2024 core background feat links. Old background features remain
// in rules2014; newer backgrounds are not invented as historical 2014 printings.
const backgroundRows:[string,string[],string,string[],string,string?][]=[
 ['Acolyte',['INT','WIS','CHA'],'Magic Initiate',['Insight','Religion'],"Calligrapher's Supplies",'cleric'],
 ['Artisan',['STR','DEX','INT'],'Crafter',['Investigation','Persuasion'],"Artisan's Tools (choose one)"],
 ['Charlatan',['DEX','CON','CHA'],'Skilled',['Deception','Sleight of Hand'],'Forgery Kit'],
 ['Criminal',['DEX','CON','INT'],'Alert',['Sleight of Hand','Stealth'],"Thieves' Tools"],
 ['Entertainer',['STR','DEX','CHA'],'Musician',['Acrobatics','Performance'],'Musical Instrument (choose one)'],
 ['Farmer',['STR','CON','WIS'],'Tough',['Animal Handling','Nature'],"Carpenter's Tools"],
 ['Guard',['STR','INT','WIS'],'Alert',['Athletics','Perception'],'Gaming Set (choose one)'],
 ['Guide',['DEX','CON','WIS'],'Magic Initiate',['Stealth','Survival'],"Cartographer's Tools",'druid'],
 ['Hermit',['CON','WIS','CHA'],'Healer',['Medicine','Religion'],'Herbalism Kit'],
 ['Merchant',['CON','INT','CHA'],'Lucky',['Animal Handling','Persuasion'],"Navigator's Tools"],
 ['Noble',['STR','INT','CHA'],'Skilled',['History','Persuasion'],'Gaming Set (choose one)'],
 ['Sage',['CON','INT','WIS'],'Magic Initiate',['Arcana','History'],"Calligrapher's Supplies",'wizard'],
 ['Sailor',['STR','DEX','WIS'],'Tavern Brawler',['Acrobatics','Perception'],"Navigator's Tools"],
 ['Scribe',['DEX','INT','WIS'],'Skilled',['Investigation','Perception'],"Calligrapher's Supplies"],
 ['Soldier',['STR','DEX','CON'],'Savage Attacker',['Athletics','Intimidation'],'Gaming Set (choose one)'],
 ['Wayfarer',['DEX','WIS','CHA'],'Lucky',['Insight','Stealth'],"Thieves' Tools"]
];
const oldBackgroundNames=new Set(['Acolyte','Charlatan','Criminal','Entertainer','Hermit','Noble','Sage','Sailor','Soldier']);
for(const [name,abilities,featName,skills,tool,spellList] of backgroundRows){
 const matches=find('background',name);if(matches.length>1)continue;
 const existing=matches[0];
 const fs=find('feat',featName);const feat=fs.find(f=>f._id==='feat-alert-2024')||fs[0];if(!feat)throw Error(`Missing origin feat ${featName}`);
 const source=srd.origins.find((s:any)=>s.name===name);
 const description=existing?.description||`Your ${name.toLowerCase()} background gives you practical experience and the training listed below.`;
 const modern={description:source?`${description}\n\n${source.description}`:description,skillProficiencies:skills,toolProficiencies:[tool],languages:0,feats:[ref(feat._id)],abilityScoreOptions:abilities,originFeatSpellList:spellList||'',equipment:source?[shortText(source.description.split('Equipment: ')[1]||'50 GP')]:['50 GP (starting wealth option)'],feature:{name:`Origin Feat: ${featName}${spellList?` (${spellList[0].toUpperCase()+spellList.slice(1)})`:''}`,description:`You gain the ${featName} feat.${spellList?` Use the ${spellList} spell list for this background's Magic Initiate feat.`:''}`}};
 const legacy=existing&&oldBackgroundNames.has(name)?{description:existing.description,skillProficiencies:existing.skillProficiencies||[],toolProficiencies:existing.toolProficiencies||[],languages:existing.languages||0,equipment:existing.equipment||[],feature:existing.feature,feats:[],abilityScoreOptions:[],originFeatSpellList:''}:undefined;
 const fields={...editions(legacy,modern),versionNotes:'2024 background skills, tool, ability options and Origin feat linked. 2014 background retains its original feature.'};
 if(existing)set(existing,fields,'Core background Origin feat linkage');else create('background',name,fields);
}
// Published setting backgrounds can grant feats in either ruleset. Preserve
// the printed college-specific feat; these are not generic free Origin picks.
for(const college of ['Lorehold','Prismari','Quandrix','Silverquill','Witherbloom']){
 const bg=find('background',`${college} Student`)[0],f=find('feat',`Strixhaven Initiate (${college})`)[0];
 if(bg&&f)set(bg,{feats:[ref(f._id)],sameForBoth:true},'Strixhaven background starting feat');
}
// Revised core species traits. Existing 2014 ancestry records retain their
// original traits; modern generic species are added only when absent.
for(const s of srd.origins.filter((s:any)=>['Dragonborn','Dwarf','Elf','Gnome','Goliath','Halfling','Human','Orc','Tiefling'].includes(s.name))){
 const matches=find('race',s.name);if(matches.length>1)continue;const d=matches[0];
 const trait=create('trait',`${s.name} — SRD Species Traits`,{description:s.description,sameForBoth:true});
 const speed=+(s.description.match(/Speed: (\d+)/)?.[1]||30);
 const modern={description:s.description,size:/Size: Small\b/.test(s.description)?'Small':'Medium',speed,abilityScoreIncrease:{},flexibleAbilityScores:false,traits:[ref(trait._id)]};
 const legacy=d?{description:d.description,size:d.size,speed:d.speed,abilityScoreIncrease:d.abilityScoreIncrease||{},flexibleAbilityScores:d.flexibleAbilityScores||false,traits:d.traits||[]}:undefined;
 const fields={...editions(legacy,modern),isCore:true};
 if(d)set(d,fields,'SRD 2024 species descriptions and traits');else create('race',s.name,fields);
}

// Retain the audit for entries whose existing descriptions are populated but
// whose third-party/setting-specific revised text is not in the official SRDs.
for(const d of docs.filter(d=>['spell','item','race','species','feat','background','class'].includes(d._type))){
 if(!changes.has(d._id))audit.push({id:d._id,type:d._type,name:d.name,status:'Existing populated description retained; no verified replacement in researched SRDs'});
}
const plan={creates:[...creates.values()],patches:[...changes.values()]};
writeFileSync(root+'catalogue-plan.json',JSON.stringify(plan,null,2));
writeFileSync(root+'catalogue-audit.json',JSON.stringify(audit,null,2));
console.log(JSON.stringify({creates:plan.creates.reduce((a:any,d:any)=>(a[d._type]=(a[d._type]||0)+1,a),{}),patches:plan.patches.length,retained:audit.length},null,2));
