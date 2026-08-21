import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

const progressionRows: Array<[number, number, string, string, string[]]> = [
  [1, 2, '—', '—', ['Born Leader', 'Fighting Style']],
  [2, 2, '—', 'Cohort feature', ['Cohort']],
  [3, 2, '2d8', '—', ['Banner', 'War Tactics']],
  [4, 2, '2d8', '—', ['Ability Score Improvement']],
  [5, 3, '2d8', '—', ['Blitz']],
  [6, 3, '3d8', 'Cohort feature', ['Cohort feature']],
  [7, 3, '3d8', '—', ['Banner feature']],
  [8, 3, '3d8', '—', ['Ability Score Improvement']],
  [9, 4, '3d8', '—', ['Advanced Tactics']],
  [10, 4, '3d10', 'Cohort feature', ['Cohort feature']],
  [11, 4, '3d10', '—', ['Coordinated Strike']],
  [12, 4, '3d10', '—', ['Ability Score Improvement']],
  [13, 5, '3d10', '—', ['Banner feature']],
  [14, 5, '4d10', 'Cohort feature', ['Cohort feature']],
  [15, 5, '4d10', '—', ['Lead by Example']],
  [16, 5, '4d10', '—', ['Ability Score Improvement']],
  [17, 6, '4d10', '—', ['Banner feature']],
  [18, 6, '4d12', 'Cohort feature', ['Cohort feature']],
  [19, 6, '4d12', '—', ['Ability Score Improvement']],
  [20, 6, '4d12', '—', ['Warlord']],
]
const progression = progressionRows.map(([level, proficiencyBonus, battleDice, cohortFeature, featureNames]) => ({
  _type: 'classProgressionRow', _key: `captain-level-${level}`, level, proficiencyBonus,
  resources: [
    { _type: 'object', _key: 'battle-dice', name: 'Battle Dice', value: battleDice },
    { _type: 'object', _key: 'cohort-feature', name: 'Cohort Feature', value: cohortFeature },
  ],
  featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Born Leader', description: 'You have advantage on Charisma (Persuasion) checks made to convince someone to let you take charge of a situation or to give orders during danger. You may use Charisma instead of Intelligence for checks related to planning, strategy, or tactics.' },
  { level: 1, name: 'Fighting Style', description: 'Choose Archery (+2 to ranged weapon attack rolls), Defense (+1 AC while armored), Dueling (+2 damage while wielding a one-handed melee weapon and no other weapons), or Protection (while wielding a shield, use your reaction to impose disadvantage when a visible creature attacks another target within 5 feet).' },
  { level: 2, name: 'Cohort', description: 'After an 8-hour initiation, one eligible companion becomes your loyal cohort; available archetypes in this specification are Abbot, Berserker, Champion, Construct, Cultist, Hunter, Mage, Stalker, Templar, and Undead. You control its turn immediately before or after yours, while it acts independently if you are absent or incapacitated. You can have only one cohort; initiating another ends the prior bond. It gains new archetype abilities at Captain levels 2, 6, 10, 14, and 18, gains a Hit Die for every Captain level after 2nd, shares your proficiency bonus, and receives its own improvements whenever you gain Ability Score Improvement.' },
  { level: 3, name: 'Banner', description: 'Adopt Dragon, Eagle, Jolly Roger, Lion, Ram, Raven, or Turtle Banner. Your Banner grants features at levels 3, 7, 13, and 17.' },
  { level: 3, name: 'War Tactics', description: 'Gain the Battle Dice shown in the Captain progression table. They refresh after a short or long rest or whenever you roll initiative. Maneuver save DC = 8 + proficiency bonus + Charisma modifier. Brace: as a bonus action, spend a die so allies within 30 feet who see or hear you add it to saves until the end of your next turn. Rally: as a bonus action, spend a die to heal a visible or audible ally within 60 feet by the roll + Charisma modifier, but not from 0 hit points. Staggering Strike: as a bonus action when making a weapon attack, spend a die; on a hit, a humanoid target makes a Constitution save or is incapacitated until your next turn.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20. Your cohort also improves one score by 2 or two scores by 1.' },
  { level: 5, name: 'Blitz', description: 'As a bonus action, direct your cohort or a friendly creature within 60 feet that can see or hear you to use its reaction to move up to its speed or make one weapon attack.' },
  { level: 6, name: 'Cohort Feature (6th Level)', description: 'Your cohort gains its archetype’s 6th-level improvement, and your Battle Dice pool becomes 3d8.' },
  { level: 7, name: 'Banner Feature (7th Level)', description: 'You gain the 7th-level feature of your Banner.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20. Your cohort improves as well.' },
  { level: 9, name: 'Advanced Tactics', description: 'Brace also adds the Battle Die to allies’ ability checks until your next turn. Rally also grants temporary hit points equal to your Captain level. Staggering Strike adds the Battle Die to the triggering attack’s damage.' },
  { level: 10, name: 'Cohort Feature (10th Level)', description: 'Your cohort gains its archetype’s 10th-level improvement, and your Battle Dice become 3d10.' },
  { level: 11, name: 'Coordinated Strike', description: 'When you attack a creature your cohort has hit since the end of your last turn, your hit deals an additional 2d8 damage.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20. Your cohort improves as well.' },
  { level: 13, name: 'Banner Feature (13th Level)', description: 'You gain the 13th-level feature of your Banner.' },
  { level: 14, name: 'Cohort Feature (14th Level)', description: 'Your cohort gains its archetype’s 14th-level improvement, and your Battle Dice pool becomes 4d10.' },
  { level: 15, name: 'Lead by Example', description: 'When you roll a 20 on an attack, ability check, or saving throw, each friendly creature within 30 feet has advantage on the same type of roll made before your next turn.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20. Your cohort improves as well.' },
  { level: 17, name: 'Banner Feature (17th Level)', description: 'You gain the 17th-level feature of your Banner.' },
  { level: 18, name: 'Cohort Feature (18th Level)', description: 'Your cohort gains its archetype’s 18th-level improvement, and your Battle Dice become 4d12.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20. Your cohort improves as well.' },
  { level: 20, name: 'Warlord', description: 'When a friendly creature you can see within 30 feet misses an attack against a creature in its range, turn the miss into a hit. Alternatively, when it fails a saving throw, treat its d20 as a 20. Recharge after a short or long rest.' },
]

const banners: Record<string, { name: string; slug: string; description: string; features: FeatureSeed[] }> = {
  'subclass-dragon-banner': { name: 'Dragon Banner', slug: 'dragon-banner', description: 'Formidable warriors whose lethal maneuvers let them personally turn the tide of battle.', features: [
    { level: 3, name: 'Bonus Battle Die', description: 'Your total number of Battle Dice increases by one.' },
    { level: 3, name: 'Maneuver: Cleave', description: 'When you reduce a hostile creature to 0 hit points or score a critical hit with a melee weapon attack on your turn, spend a Battle Die to move up to 15 feet and make another melee weapon attack, adding the die to its damage.' },
    { level: 7, name: 'Maneuver: Wade into Battle', description: 'Spend a Battle Die to take both Dash and Disengage as a bonus action.' },
    { level: 13, name: 'Maneuver: Fury Attack', description: 'When taking the Attack action, spend a Battle Die as a bonus action to make up to three melee weapon attacks instead of one, each against a different creature.' },
    { level: 17, name: 'Vicious Focus', description: 'Reducing a hostile creature to 0 hit points or scoring a melee critical begins a 1-minute focus in which melee attacks crit on 19–20. Each further kill or critical expands the range to 18–20, then 17–20, then 16–20. Falling unconscious ends it.' },
  ] },
  'subclass-eagle-banner': { name: 'Eagle Banner', slug: 'eagle-banner', description: 'Masters of speed and ranged combat who dominate both distant and close-range shooting.', features: [
    { level: 3, name: 'Maneuver: Eagle Shot', description: 'When making a ranged weapon attack, use a bonus action and spend a Battle Die to add it to the attack roll before the outcome is declared.' },
    { level: 7, name: 'Vantage Point', description: 'Gain a climbing speed equal to your speed. At half speed, climb difficult surfaces such as vertical walls without an ability check.' },
    { level: 13, name: 'Close-Quarters Shooting', description: 'Being within 5 feet of a hostile creature no longer imposes disadvantage on your ranged attacks or those of friendly creatures within 15 feet.' },
    { level: 17, name: 'Scatter Shot', description: 'As an action, make a separate ranged weapon attack against each chosen creature in a 15-foot cone. If only one creature is targeted, add one extra weapon damage die on a hit.' },
  ] },
  'subclass-jolly-roger-banner': { name: 'Jolly Roger Banner', slug: 'jolly-roger-banner', description: 'A pirate commander who uses tricky swordplay and coordinates an entire crew.', features: [
    { level: 3, name: 'Maneuver: Parrying Stance', description: 'When taking the Attack action with a finesse weapon, spend a Battle Die as a bonus action to make one additional attack, adding the die instead of your ability modifier to its damage.' },
    { level: 7, name: 'Tricky Footwork', description: 'When you hit a creature of your size or smaller with a melee attack on your turn, you may switch places without provoking opportunity attacks.' },
    { level: 13, name: 'Unfair Play', description: 'You and your cohort may take Use an Object, Hide, or make a shove attempt as a bonus action. You have advantage on Athletics checks to push a creature out of a boat.' },
    { level: 17, name: 'All Hands on Deck', description: 'As an action, direct each friendly creature within 60 feet that sees or hears you to use its reaction for an action you choose other than Attack, Cast a Spell, Dodge, or Use a Magic Item.' },
  ] },
  'subclass-lion-banner': { name: 'Lion Banner', slug: 'lion-banner', description: 'Gallant mounted leaders who inspire courage and answer harm with decisive counterattacks.', features: [
    { level: 3, name: 'Maneuver: Lion’s Challenge', description: 'As a bonus action when your weapon attack hits, spend a Battle Die to give the target disadvantage on attacks against anyone other than you until your next turn.' },
    { level: 7, name: 'Saddle Sure', description: 'You have advantage on saves against falling from a mount, land on your feet unless incapacitated, mount or dismount for 5 feet of movement, and may redirect an attack against your mount to yourself.' },
    { level: 13, name: 'Reposition', description: 'When initiative is rolled, you and up to three chosen friendly creatures may each move up to 20 feet.' },
    { level: 17, name: 'Lion’s Gambit', description: 'When a creature within 5 feet damages you, use your reaction to make a melee weapon attack against it and add half your level to the damage. Use three times per short or long rest.' },
  ] },
  'subclass-ram-banner': { name: 'Ram Banner', slug: 'ram-banner', description: 'Forceful commanders who shove enemies out of formation and exploit prone targets.', features: [
    { level: 3, name: 'Maneuver: Bull Rush', description: 'After moving at least 10 feet straight and making a melee weapon attack, use a bonus action and spend a Battle Die to shove the target, adding the die to Athletics and pushing 10 feet on success.' },
    { level: 7, name: 'Surefooted', description: 'Ignore nonmagical difficult terrain.' },
    { level: 13, name: 'Lock Horns', description: 'When you shove a creature into an ally, that ally may use its reaction to attack the shoved creature.' },
    { level: 17, name: 'And Stay Down', description: 'When a creature stands from prone within your reach, you may make an opportunity attack against it.' },
  ] },
  'subclass-raven-banner': { name: 'Raven Banner', slug: 'raven-banner', description: 'Clandestine leaders who rely on stealth, ambush, and unfair fights.', features: [
    { level: 3, name: 'Maneuver: Flanking Strike', description: 'When you hit with a finesse or light weapon while an ally is within 5 feet of the target, spend a Battle Die to add it and half your level to the damage.' },
    { level: 3, name: 'Maneuver: Effortless Dodge', description: 'As a bonus action, spend a Battle Die to Dodge. You cannot use this while wearing medium or heavy armor.' },
    { level: 7, name: 'Covert', description: 'When discovered while hidden by a successful Perception check, reattempt Stealth to silently reposition and remain unnoticed. Recharge after a short or long rest.' },
    { level: 13, name: 'Strike First, Strike Last', description: 'When a visible creature takes the Attack action, use your reaction to move up to your speed toward it without provoking opportunity attacks and make one attack against it. Recharge after a long rest.' },
    { level: 17, name: 'Guerrilla Warfare', description: 'You have advantage against creatures that have not acted. Once per turn when you hit during the first round, add two Battle Dice to damage without expending them.' },
  ] },
  'subclass-turtle-banner': { name: 'Turtle Banner', slug: 'turtle-banner', description: 'Defensive strategists who protect nearby allies and survive prolonged battles.', features: [
    { level: 3, name: 'Bonus Proficiencies', description: 'Gain proficiency with heavy armor.' },
    { level: 3, name: 'Maneuver: Iron Shell', description: 'As a bonus action, spend a Battle Die to fortify a visible ally within 60 feet that can see you. It gains AC equal to half the roll, rounded down (minimum 1), against the next attack within 1 minute.' },
    { level: 7, name: 'Slow and Steady', description: 'Your speed cannot be slowed, and you cannot be knocked prone or moved against your will.' },
    { level: 13, name: 'Shield Wall', description: 'For allied creatures of your size or smaller within 5 feet, you count as half cover against effects passing through your space.' },
    { level: 17, name: 'Unbreakable', description: 'Gain 20 armor points. As a reaction when hit by a melee weapon attack, spend any number to add them to AC against that attack, potentially causing it to miss. Recover all after a long rest.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { document: {
    _id: id, _type: 'feature', name: seed.name,
    slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) },
    acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Expanded from the matching Valda’s Spire Captain specification supplied by the archive owner.',
  }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-captain"][0]{source, sourceBook, isHomebrew, "subclassIds": subclasses[]._ref}`)
  const existingIds = ['subclass-dragon-banner', 'subclass-eagle-banner', 'subclass-lion-banner', 'subclass-ram-banner', 'subclass-raven-banner', 'subclass-turtle-banner'].sort()
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew || [...current.subclassIds].sort().join(',') !== existingIds.join(',')) {
    throw new Error(`Refusing to merge into an unexpected Captain record: ${JSON.stringify(current)}`)
  }

  let tx = client.transaction()
  const classRefs = coreFeatures.map((seed, index) => { const result = featureDocument('captain', seed, index); tx = tx.createOrReplace(result.document as any); return result.reference })
  for (const [subclassId, banner] of Object.entries(banners)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = banner.features.map((seed, index) => { const result = featureDocument(owner, seed, index); tx = tx.createOrReplace(result.document as any); return result.reference })
    const document = {
      name: banner.name, slug: { _type: 'slug', current: banner.slug }, parentClassId: 'captain', parentClass: ref('class-captain', 'captain'),
      description: banner.description, features: featureRefs, source: 'Unofficial', sourceBook: "Valda's Spire of Secrets",
      edition: 'Both', rulesets: RULESETS, isHomebrew: false,
      versionNotes: 'Placeholder mechanics replaced with the matching Valda’s Spire Banner progression supplied by the archive owner.',
    }
    tx = subclassId === 'subclass-jolly-roger-banner'
      ? tx.createOrReplace({ _id: subclassId, _type: 'subclass', version: 1, isSpellcaster: false, ...document } as any)
      : tx.patch(subclassId, (patch) => patch.set(document))
  }

  tx = tx.patch('class-captain', (patch) => patch.set({
    description: 'A decisive leader and battlefield strategist who directs allies with battle-tested maneuvers while fighting beside a loyal cohort. Captains win through coordination, preparation, and the ideals represented by their chosen Banner.',
    hitDie: 8, primaryAbility: ['STR', 'CHA'], savingThrows: ['CON', 'CHA'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'captain-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor', 'Shields'] },
      { _type: 'proficiencyRule', _key: 'captain-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Martial Weapons'] },
      { _type: 'proficiencyRule', _key: 'captain-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Animal Handling', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Perception', 'Persuasion'] },
    ],
    isSpellcaster: false, spellcaster: 'none', features: classRefs, progression, subclassLevel: 3,
    subclasses: Object.entries(banners).map(([id, banner]) => ref(id, banner.slug)),
    startingEquipment: ['Scale mail or leather armor', 'A dagger and a warhammer, longsword, or any simple weapon', 'A light crossbow and 20 bolts, shortbow and 20 arrows, or 5 javelins', 'An embroidered standard and an explorer’s pack or one kit you are proficient with'],
    source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Expanded from the matching Valda’s Spire Captain specification: full class, Battle Dice/Cohort table, authentic Banner tracks, and missing Jolly Roger Banner added.',
  }).unset(['spellcastingAbility', 'spellLists', 'spells']))

  if (!APPLY) { console.log(`Dry run: ${coreFeatures.length} core features, ${Object.values(banners).flatMap((banner) => banner.features).length} Banner features, and ${progression.length} progression rows ready.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const bannerIds = Object.keys(banners)
  const audit = await client.fetch<any>(`*[_id == "class-captain"][0]{
    sourceBook, isHomebrew, isSpellcaster, hitDie, savingThrows, "featureCount": count(features), "progressionCount": count(progression),
    "battleDice": progression[].resources[name == "Battle Dice"][0].value, "cohortValues": progression[].resources[name == "Cohort Feature"][0].value,
    "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]),
    "banners": *[_id in [${bannerIds.map((id) => `"${id}"`).join(',')}]] | order(_id asc) {_id, sourceBook, isHomebrew, "featureCount": count(features), "brokenRefs": count(features[!defined(@->._id)])}
  }`)
  const expectedBattleDice = progressionRows.map((row) => row[2]).join(',')
  if (audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || audit.isSpellcaster || audit.hitDie !== 8 || audit.savingThrows.join(',') !== 'CON,CHA' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.battleDice.join(',') !== expectedBattleDice || audit.brokenRefs || audit.banners.length !== 7 || audit.banners.some((banner: any) => banner.sourceBook !== "Valda's Spire of Secrets" || banner.isHomebrew || banner.featureCount !== banners[banner._id].features.length || banner.brokenRefs)) {
    throw new Error(`Captain audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
