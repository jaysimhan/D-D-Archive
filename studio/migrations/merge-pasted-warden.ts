import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

const progressionRows: Array<[number, number, string[]]> = [
  [1, 2, ["Sentinel's Stand", "Warden's Grasp"]],
  [2, 2, ['Fighting Style', "Warden's Mark"]],
  [3, 2, ["Champion's Call", "Warden's Resolve"]],
  [4, 2, ['Ability Score Improvement', 'Font of Life']],
  [5, 3, ['Extra Attack']], [6, 3, ["Champion's Call feature"]],
  [7, 3, ["Sentinel's Step"]], [8, 3, ['Ability Score Improvement']],
  [9, 4, ['Undying']], [10, 4, ['Interrupt']], [11, 4, ["Warden's Mark improvement"]],
  [12, 4, ['Ability Score Improvement']], [13, 5, ["Champion's Call feature"]],
  [14, 5, ["Warden's Grasp improvement"]], [15, 5, ['Font of Life improvement']],
  [16, 5, ['Ability Score Improvement']], [17, 6, ["Warden's Resolve improvement"]],
  [18, 6, ["Sentinel's Soul"]], [19, 6, ['Ability Score Improvement']],
  [20, 6, ["Champion's Call feature"]],
]
const progression = progressionRows.map(([level, proficiencyBonus, featureNames]) => ({
  _type: 'classProgressionRow', _key: `warden-level-${level}`, level, proficiencyBonus, resources: [], featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: "Sentinel's Stand", description: 'Choose one defense. Armor Proficiency grants heavy armor proficiency. Primal Toughness increases your hit point maximum by 1 + Constitution modifier and by 1 whenever you gain another Warden level. Stalwart Spirit grants proficiency in one saving throw of your choice.' },
  { level: 1, name: "Warden's Grasp", description: 'As a bonus action, become immobile until your next turn begins. Each chosen Large or smaller creature within 5 feet cannot willingly move away unless it first Disengages. The range becomes 10 feet at level 14.' },
  { level: 2, name: 'Fighting Style', description: 'Choose one style. Crippling reduces a creature’s speed by 10 feet after your melee hit and prevents Dash until its turn ends. Great Weapon Fighting rerolls 1s and 2s on damage dice for two-handed or versatile melee weapons used with two hands. Protection uses your reaction while wielding a weapon or shield to impose disadvantage on an attack against another target within 5 feet. Titan Fighting grants +2 to melee attack rolls against Large or larger creatures.' },
  { level: 2, name: "Warden's Mark", description: 'As a bonus action, mark a visible creature within 30 feet for 1 minute, until you mark another creature, or until you become incapacitated or die. While within 5 feet of you, it has disadvantage on attacks that do not target you. At level 11, whenever you take the Attack action, make one additional attack against your marked creature.' },
  { level: 3, name: "Champion's Call", description: 'Answer the call of Bloodwrath Guardian, Grey Watchman, Nightgaunt, Soulblood Shaman, Stoneheart Defender, Storm Sentinel, or Verdant Protector. It grants features at levels 3, 6, 13, and 20.' },
  { level: 3, name: "Warden's Resolve", description: 'While below half your hit point maximum, gain resistance to bludgeoning, piercing, and slashing damage. At level 17, this becomes resistance to all damage except psychic.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20. You gain this feature again at levels 8, 12, 16, and 19.' },
  { level: 4, name: 'Font of Life', description: 'As an action, end one disease or one blinded, charmed, deafened, frightened, paralyzed, or poisoned condition affecting you, even if that condition would normally prevent the action. Recharge after a short or long rest. At level 15, once per day when used, restore your hit points to half maximum if lower.' },
  { level: 5, name: 'Extra Attack', description: 'Attack twice instead of once whenever you take the Attack action.' },
  { level: 7, name: "Sentinel's Step", description: 'Choose one adaptation. Earthstrength doubles carrying capacity and grants advantage against being unwillingly pushed or knocked prone. Thundering Charge increases speed by 30 feet during your first combat round and grants advantage on your first melee weapon attack. Wildblood prevents surprise while conscious and adds +5 to passive Perception and Investigation.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 9, name: 'Undying', description: 'When reduced to 0 hit points without being killed outright, drop to 1 hit point instead. Recharge after a long rest.' },
  { level: 10, name: 'Interrupt', description: 'When a creature within 5 feet makes a melee attack against you, use your reaction after that attack to make it perform one fewer attack than normal during that turn.' },
  { level: 11, name: "Warden's Mark Improvement", description: 'Whenever you take the Attack action on your turn, make one additional attack against a creature you have marked.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 14, name: "Warden's Grasp Improvement", description: "The radius of Warden's Grasp increases from 5 feet to 10 feet." },
  { level: 15, name: 'Font of Life Improvement', description: 'Once per day when you use Font of Life, restore your hit points to half your maximum if they are lower.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 17, name: "Warden's Resolve Improvement", description: 'While below half your hit point maximum, gain resistance to all damage except psychic damage.' },
  { level: 18, name: "Sentinel's Soul", description: 'Choose one transformation. Ageless Guardian grants immunity to poison and disease, removes the need for food and water and age-related frailty, prevents magical aging, and grants advantage on Dexterity saves. Eyes of the Mountain grants 15-foot tremorsense, detects hidden or invisible creatures within 30 feet, and grants advantage on Constitution saves. Impenetrable Mind prevents thought reading and the charmed and frightened conditions and grants advantage on Wisdom saves.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
]

const calls: Record<string, { name: string; description: string; isSpellcaster?: boolean; magicType?: string; magicAbility?: string; magicDescription?: string; features: FeatureSeed[] }> = {
  'subclass-bloodwrath-guardian': { name: 'Bloodwrath Guardian', description: 'A ferocious guardian of wild creatures who channels the Primal Beast through a dangerous predatory trance.', features: [
    { level: 3, name: 'Feral Trance', description: 'As a bonus action once per short or long rest, enter a 1-minute trance. Gain advantage on Strength checks and saves, +10 speed, and advantage on Strength-based melee attacks against your marked creature, but attacks against you have advantage. It ends if unconscious or if your turn ends without attacking a hostile creature since your last turn or taking damage.' },
    { level: 6, name: "Predator's Scent", description: 'Your marked creature remains marked for up to 24 hours even outside your sight. While it is marked and on your plane, you know its direction and distance.' },
    { level: 13, name: 'Evasion', description: 'When an effect allows a Dexterity save for half damage, take no damage on a success and half on a failure.' },
    { level: 20, name: 'Form of the Primal Beast', description: 'As an action once per long rest, transform for 1 minute. Gain Feral Trance benefits and temporary hit points equal to twice your Warden level. Melee hits can inflict bleeding wounds on creatures other than constructs, oozes, and undead, up to your proficiency bonus in wounds. Each wound costs 1d8 hit points at turn start, prevents healing while present, and can be staunched with an action.' },
  ] },
  'subclass-grey-watchman': { name: 'Grey Watchman', description: 'A rigorously trained sentry who protects walls, keeps, and settlements with maneuvers and impeccable defensive discipline.', features: [
    { level: 3, name: 'Battle Tactics', description: 'Gain two d8 Battle Dice, restored after a short or long rest or when rolling initiative. The pool becomes 3d8 at level 7, 3d10 at level 13, and 4d10 at level 19. Once per turn, spend one die on a maneuver; save DC = 8 + proficiency bonus + Strength or Dexterity modifier. Bull Rush enhances a shove after a 10-foot charge and can push 10 feet. Bulwark subtracts the die from the next damage dealt by a creature you hit. Cleave moves you 15 feet and grants another melee attack after a critical hit or reducing a hostile creature to 0. Heelcutter adds the die to an opportunity attack and can reduce speed to 0. Reckless Assault grants attack advantage but attacks against you gain advantage. Staggering Strike can incapacitate a humanoid until your next turn on a failed Constitution save.' },
    { level: 3, name: 'Hold the Line', description: "When using Warden's Grasp, each chosen creature other than you in its area gains +1 AC and +1 to saving throws until your next turn begins while it remains there." },
    { level: 6, name: 'Fortification Expert', description: 'Gain advantage on checks to erect defensive fortifications, inspect walls or defenses for weak points and entrances, or climb constructed walls. Treat three-quarters cover as full cover.' },
    { level: 13, name: 'Mettle', description: 'When an effect permits a Constitution save for half damage, take no damage on a success and half on a failure.' },
    { level: 20, name: 'Unbreakable Sentinel', description: 'As an action once per long rest, transform for 1 minute. Gain +2 AC, regain one Battle Die whenever you hit a marked creature, and take one additional reaction each round, though never more than one reaction on the same turn.' },
  ] },
  'subclass-nightgaunt': { name: 'Nightgaunt', description: 'A grim living champion of peaceful undead who hunts their persecutors beneath the moon and carries the shadow of death.', features: [
    { level: 3, name: 'Darkvision', description: 'Gain 60-foot darkvision, or extend existing darkvision by 30 feet. At level 13, see through magical as well as nonmagical darkness.' },
    { level: 3, name: 'Marked for Death', description: 'When a melee weapon attack damages your marked creature and its remaining hit points are lower than the damage dealt by that attack, it drops to 0 hit points.' },
    { level: 6, name: 'Undead Empathy', description: 'When an undead tries to attack you, it makes a Wisdom save against DC 8 + proficiency bonus + Constitution modifier. On failure the attack misses; if its Intelligence is 4 or lower, it becomes friendly to you and your allies.' },
    { level: 13, name: 'Evasion', description: 'When an effect permits a Dexterity save for half damage, take no damage on a success and half on a failure.' },
    { level: 20, name: 'Gravelord', description: 'As an action once per long rest, become deathly for 1 minute. Gain immunity to poison damage and the poisoned condition, use Undying up to three times even if already expended, and once per turn add 4d6 necrotic damage to a melee weapon hit and gain equal temporary hit points until your next turn.' },
  ] },
  'subclass-soulblood-shaman': { name: 'Soulblood Shaman', description: 'An ancestral spirit-speaker who safeguards descendants and burial places through druidic evocation and transmutation.', isSpellcaster: true, magicType: 'Druid Spell Slots (One-Third Caster)', magicAbility: 'Wisdom', magicDescription: 'Learns druid cantrips and spells, primarily evocation or transmutation, and regains spell slots after a long rest.', features: [
    { level: 3, name: 'Spellcasting', description: 'Use Wisdom for druid spells (save DC 8 + proficiency bonus + Wisdom modifier; spell attack proficiency bonus + Wisdom modifier). Learn 2 cantrips at level 3 and a third at 10. Spells known/slots by Warden level: 3rd 3 known, 2 first-level; 4th 4, 3; 5th–6th 4, 3; 7th 5, 3/2; 8th 6, 4/2; 9th 6, 4/2; 10th 7, 4/3; 11th 8, 4/3; 12th 8, 4/3; 13th 9, 4/3/3; 14th–15th 10, 4/3/3; 16th–18th 11, 4/3/3; 19th 12, 4/3/3/1; 20th 13, 4/3/3/1. Two of the first three spells and later choices must be evocation or transmutation, except unrestricted spells learned at levels 3, 8, 14, and 20. Replace one known spell on gaining a Warden level under the same restriction.' },
    { level: 3, name: 'Soulblood', description: 'As a reaction when a creature within 5 feet damages you, mark that creature.' },
    { level: 6, name: 'Whispers of Beyond', description: 'Spend 1 minute contemplating an Intelligence or Wisdom check to consult ancestral spirits and gain advantage when they would possess relevant guidance.' },
    { level: 13, name: 'Spell Resistance', description: 'Gain advantage on saving throws against spells.' },
    { level: 20, name: 'Ethereal Watcher', description: 'As an action once per long rest, transform for 1 minute. Become ethereal as a bonus action. Return as a bonus action when casting a spell or using Warden’s Mark or Grasp; chosen creatures within 10 feet take 4d10 force damage. Cast known 1st- and 2nd-level druid spells without expending slots during the transformation.' },
  ] },
  'subclass-stoneheart-defender': { name: 'Stoneheart Defender', description: 'An immovable mountain guardian who roots into stone, shatters the earth, and finally becomes a walking fortress.', features: [
    { level: 3, name: 'Roots of Rock', description: "When using Warden's Grasp, gain +2 AC until your next turn begins. Until you move, hostile effects cannot shove or push you unless you allow it; you have advantage against being knocked prone, cannot slip or fall from ledges, and are immune to fly, levitate, and telekinesis." },
    { level: 6, name: 'Earthshatter', description: "Use Warden's Grasp as an action; affected creatures make a Strength save (DC 8 + proficiency bonus + Strength modifier) or fall prone. Uses equal your Strength modifier per long rest." },
    { level: 13, name: 'Mettle', description: 'When an effect permits a Constitution save for half damage, take no damage on a success and half on a failure.' },
    { level: 20, name: 'Immortal Mountain', description: 'As an action once per long rest, encase yourself in stone for 1 minute. Reduce bludgeoning, piercing, and slashing damage by 5, gain Roots of Rock throughout, and optionally leave a 5-foot-wide trail of difficult terrain wherever you move.' },
  ] },
  'subclass-storm-sentinel': { name: 'Storm Sentinel', description: 'A coastal champion who protects sailors and villages by wielding thunder, lightning, and the fury of the open sky.', features: [
    { level: 3, name: 'Flash from Above', description: 'While under the open sky, use an action to conjure a harmless but impressive lightning bolt or peal of thunder, even without clouds.' },
    { level: 3, name: 'Thunderblast', description: 'Whenever you hit your marked creature with a melee weapon attack, each chosen creature within 5 feet of it takes 1d8 lightning damage.' },
    { level: 6, name: 'Static Burst', description: "When using Warden's Grasp as a bonus action, affected creatures cannot take reactions until your next turn begins." },
    { level: 13, name: 'Evasion', description: 'When an effect permits a Dexterity save for half damage, take no damage on a success and half on a failure.' },
    { level: 20, name: 'Stormlord', description: 'Gain a flying speed equal to your walking speed. Once per long rest as an action, empower yourself for 1 minute: double your flying speed and cast call lightning as a bonus action without a slot (save DC 8 + proficiency bonus + Constitution modifier), calling subsequent bolts as bonus actions.' },
  ] },
  'subclass-verdant-protector': { name: 'Verdant Protector', description: 'A defender of forests and green life who binds foes with living terrain and assumes the form of an ancient oak sentinel.', features: [
    { level: 3, name: 'Green Mark', description: 'While your marked creature is within 30 feet, the ground on which it walks becomes difficult terrain for it.' },
    { level: 6, name: 'Verdant Skin', description: 'Gain Stealth proficiency if you lack it. As an action, draw vines and leaves around yourself; until you move, gain advantage on Stealth checks to hide among vegetation.' },
    { level: 13, name: 'Mettle', description: 'When an effect permits a Constitution save for half damage, take no damage on a success and half on a failure.' },
    { level: 20, name: 'Form of the Oak Sentinel', description: "As an action once per long rest, transform for 1 minute. Your AC becomes 20 if lower, your attacks gain reach if they lack it, and you may use Warden's Grasp as an action to make a separate attack against every affected creature." },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const slug = slugify(seed.name)
  const id = `feature-${owner}-${seed.level}-${slug}`
  return { document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `${owner}-${seed.level}-${slug}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false, versionNotes: 'Restored from the matching Valda’s Spire Warden specification supplied by the archive owner.' }, reference: ref(id, `${seed.level}-${slug}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-warden"][0]{source,sourceBook,isHomebrew,hitDie,"subclassIds":subclasses[]._ref}`)
  const ids = Object.keys(calls)
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew || current.hitDie !== 10 || [...current.subclassIds].sort().join(',') !== [...ids].sort().join(',')) throw new Error(`Refusing to merge into an unexpected Warden record: ${JSON.stringify(current)}`)

  let tx = client.transaction()
  const classRefs = coreFeatures.map((seed, index) => { const built = featureDocument('warden', seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
  for (const [subclassId, call] of Object.entries(calls)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = call.features.map((seed, index) => { const built = featureDocument(owner, seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
    tx = tx.patch(subclassId, (patch) => patch.set({
      name: call.name, slug: { _type: 'slug', current: owner }, parentClassId: 'warden', parentClass: ref('class-warden', 'warden'), description: call.description,
      features: featureRefs, source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false, isSpellcaster: Boolean(call.isSpellcaster),
      ...(call.isSpellcaster ? { magicType: call.magicType, magicAbility: call.magicAbility, magicDescription: call.magicDescription } : {}),
      versionNotes: 'Generic placeholder mechanics replaced with the matching Champion’s Call progression from the supplied Warden text.',
    }).unset(call.isSpellcaster ? ['spells'] : ['magicType', 'magicAbility', 'magicDescription', 'spells']))
  }
  tx = tx.patch('class-warden', (patch) => patch.set({
    description: 'A vigilant primal guardian and unbreakable defender of the weak. Wardens anchor a battlefield with marks and grasping presence, draw extraordinary resilience from the wild, and answer a binding Champion’s Call.',
    hitDie: 10, primaryAbility: ['CON', 'STR'], savingThrows: ['STR', 'CON'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'warden-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor', 'Shields'] },
      { _type: 'proficiencyRule', _key: 'warden-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Martial Weapons'] },
      { _type: 'proficiencyRule', _key: 'warden-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Animal Handling', 'Athletics', 'Nature', 'Perception', 'Survival'] },
    ],
    startingEquipment: ['A shield and any martial weapon', 'A chain shirt; or leather armor and a spear; or chain mail if proficient', 'Two light hammers or any simple melee weapon', 'A dungeoneer’s pack or explorer’s pack'],
    isSpellcaster: false, spellcaster: 'none', features: classRefs, progression, subclassLevel: 3, subclasses: ids.map((id) => ref(id, id.replace(/^subclass-/, ''))),
    source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Restored from the matching supplied Warden text: complete 1–20 class progression and authentic mechanics for all seven Champion’s Calls.',
  }).unset(['spellcastingAbility', 'spellLists', 'spells']))

  if (!APPLY) { console.log(`Dry run: ${coreFeatures.length} core features, ${Object.values(calls).flatMap((call) => call.features).length} Champion’s Call features, and ${progression.length} progression rows.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-warden"][0]{sourceBook,isHomebrew,isSpellcaster,spellcaster,hitDie,primaryAbility,savingThrows,"featureCount":count(features),"progressionCount":count(progression),"subclassCount":count(subclasses),"brokenRefs":count(features[!defined(@->._id)])+count(subclasses[!defined(@->._id)]),"levels":progression[].level,"calls":*[_id in [${ids.map((id) => `"${id}"`).join(',')}]]|order(_id asc){_id,isHomebrew,isSpellcaster,"featureCount":count(features),"brokenRefs":count(features[!defined(@->._id)])}}`)
  if (audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || audit.isSpellcaster || audit.spellcaster !== 'none' || audit.hitDie !== 10 || audit.primaryAbility.join(',') !== 'CON,STR' || audit.savingThrows.join(',') !== 'STR,CON' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.subclassCount !== 7 || audit.brokenRefs || audit.levels.join(',') !== progressionRows.map((row) => row[0]).join(',') || audit.calls.length !== 7 || audit.calls.some((call: any) => call.isHomebrew || call.isSpellcaster !== Boolean(calls[call._id].isSpellcaster) || call.featureCount !== calls[call._id].features.length || call.brokenRefs)) throw new Error(`Warden merge audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
