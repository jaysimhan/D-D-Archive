import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

// `add-monster-hunter-class.ts` seeded a summarised Monster Hunter - Monster Grimoire,
// Grave Strike, Steel Mind, and four "Guild" subclasses described by playstyle ("the
// Brute option", "Tank / Frontline Striker") rather than by rules text. None of it
// appears in the class the archive owner supplied, and the guild features lean on base
// features the real class does not have. The supplied class has no subclasses at all:
// its choice axis is Fighting Style, re-selectable after every long rest, plus Advanced
// Prey at 10th. So the guilds are retired rather than repurposed.
const RETIRED_SUBCLASS_IDS = [
  'subclass-carver-guild',
  'subclass-devourer-guild',
  'subclass-occultist-guild',
  'subclass-trapper-guild',
]

// Feature documents owned by this class or its retired guilds. Both spellings are
// covered: the ids this script writes, and the ones
// `normalize-feature-references-homebrew.ts` derives from the owning document id.
const FEATURE_ID_PREFIXES = [
  'feature-monster-hunter-',
  'feature-class-monster-hunter-',
  ...RETIRED_SUBCLASS_IDS.flatMap((id) => [`feature-${id}-`, `feature-${id.replace(/^subclass-/, '')}-`]),
]

// The six Fighting Style options and their 15th-level upgrades, transcribed from the
// supplied class. Kept as constants because both features list the same six styles.
const FIGHTING_STYLES = [
  'Archery: you gain a +2 bonus to attack rolls you make with ranged weapons.',
  'Defense: while you are wearing armor, you gain a +1 bonus to AC.',
  'Dueling: when you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.',
  'Great Weapon Fighting: when you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.',
  'Protection: when a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.',
  'Two-Weapon Fighting: when you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.',
].join(' ')

const IMPROVED_FIGHTING_STYLES = [
  'Archery: you fire two arrows per shot.',
  'Defense: the AC bonus increases to +3, and adjacent allies also gain the benefit.',
  'Dueling: you double your ability modifier when determining damage.',
  'Great Weapon Fighting: you are able to use larger weapons. Double the weapon die for large weapons and triple it for huge weapons. If you use a huge weapon, you attack at disadvantage and creatures have advantage to attack you.',
  'Protection: you have unlimited use of your reaction to impose disadvantage on attack rolls targeting an adjacent ally. You also provide an AC bonus equal to your shield bonus.',
  'Two-Weapon Fighting: you may wield regular-sized two-handed weapons in each hand. The versatile two-handed benefit also applies.',
].join(' ')

// The CR clause is repeated almost verbatim across five recipes in the supplied text.
const CR_SCALING = "If the creature's CR is 5 or greater, you may invest another harvested part to increase the item's potential. Each additional part invested grants a +1 bonus to attack and damage rolls at CR 5 and again at CR 15, and increases the damage die if the creature's CR is 10 or greater and again at CR 20."

const CRAFTING_RECIPES = [
  `Essence Potion (consumable; requires alchemist's supplies proficiency and 1 harvested part). The most common concoction a monster hunter makes. When created from the bodily fluids of a creature, the potion grants one of that creature's damage resistances, condition immunities, or senses for 1 hour. You may only pick one if the creature lists more than one in a category.`,
  `Slayer Ammunition (consumable; requires woodcarver's tools and 1 harvested part or 1 fused part). You create arrows, bolts, and throwing darts tipped with the creature's lethal defenses. Five pieces of ammunition are made per harvested part, and they count as a single set when determining how much you can carry. The tips deal an extra 1d6 damage of the creature's damage type. The fused variant is the same except that it deals 2d6 damage based on the multiple creatures' damage types. ${CR_SCALING} The ammunition is expended when used.`,
  `Branded Melee Weapons (requires woodcarver's tools and 4 harvested parts). The best part of fighting monsters is using their powers against them. You can create any melee weapon with an additional 1d6 damage die of the creature's damage type. ${CR_SCALING}`,
  `Hybrid Melee Weapons (requires woodcarver's tools and 2 fused monster parts). Sometimes when fighting monsters they adapt, and so do you. You can create any melee weapon with an additional 1d10 damage die based on the multiple creatures' damage types. ${CR_SCALING}`,
  `Bone Bow (requires woodcarver's tools and 4 harvested parts from a creature of Large size or larger). This bow is carved from a large bone of the creature you slew. Its short range is increased by 20 feet and its long range by 60 feet. A short bow made this way has a 1d8 damage die, a longbow 1d10, and the custom Great Bow 1d12. You may use your Strength modifier for attack and damage instead of Dexterity. ${CR_SCALING} Great Bow: damage 1d12 piercing; properties ammunition, heavy, range, two-handed; range 220/660.`,
  `Hybrid Bow (requires woodcarver's tools and 2 fused parts from a creature of Large size or larger). As the Bone Bow, but its short range is increased by 40 feet and its long range by 80 feet. A short bow made this way has a 1d10 damage die, a longbow 1d12, and the custom Great Bow 3d6. You may use your Strength modifier for attack and damage instead of Dexterity. ${CR_SCALING} Great Bow: damage 3d6 piercing; properties ammunition, heavy, range, two-handed; range 240/680.`,
  `Monstercraft Armor and Shield (requires leatherworker's tools and harvested parts: 4 for a shield, 6 for light armor, 8 for medium armor, 10 for heavy armor). These are armor and shields made from the hides of creatures you have slain. You can craft any type of armor from their hides, and the armor is considered one category lighter for the purposes of proficiency. The armor grants you advantage on saves against the creature's damage resistances, and grants damage resistance against the creature's damage immunities. If the creature's CR is 10 or greater, you may invest another harvested part to increase the armor's potential; each additional part invested grants a +1 bonus to AC at CR 10, 15, and 20. This armor requires attunement.`,
  `Wolfskin Cloak (requires leatherworker's tools and 5 harvested parts). You can use the hide of a monster to craft a cloak. This cloak grants you one specific benefit if the creature has resistance, immunity, avoidance, displacement, spell resistance, or anything else defensive in nature. This cloak requires attunement.`,
].join(' ')

const SPECIALTY_RECIPES = [
  `Dragon Elixir (consumable; requires alchemist's supplies proficiency and 1 harvested part from a dragon). Brewed from the concentrated blood of a dragon, the elixir grants you advantage on Strength checks if brewed from a chromatic dragon or Charisma checks if brewed from a metallic dragon, plus an additional effect based on its color. The effects last for 24 hours. Black: darkvision out to a range of 120 feet. Blue: you can mimic the sounds of animals or creatures, which requires a Wisdom saving throw to discern the trick. Brass: speak with animals at will. Bronze: water breathing at will. Copper: spider climb at will. Gold: polymorph once during the elixir's duration, lasting for the duration of the elixir. Green: suggestion once during the elixir's duration, lasting for the duration of the elixir. Red: dragon's breath once during the elixir's duration, lasting for the duration of the elixir. Silver: a flying speed of 20 feet. White: you can move across and climb icy surfaces without needing to make an ability check, and you ignore difficult terrain composed of ice or snow.`,
  `Oil of Petrification (requires alchemist's supplies proficiency and 1 harvested part from a creature with petrifying abilities). You concoct an oil that petrifies a target hit by it. You can hurl the vial containing the oil at a target within 20 feet, making a ranged weapon attack. On a hit, the target begins to turn to stone and is restrained. The target makes a Constitution saving throw against the original DC at the end of each of its turns. On a success, the effect ends. On a failure, the target is petrified until freed by the greater restoration spell or other magic.`,
  `Gorgon Armor (requires smith's tools proficiency and 10 harvested parts from a gorgon). This armor is made from the organic metal skin of a gorgon. It counts as full plate armor but gives you a +1 bonus to AC, and you gain immunity to petrification while wearing it. Wearing this armor requires attunement.`,
  `Mummified Head of Petrification (requires alchemist's supplies and 1 harvested part: the head of a medusa or basilisk). The head can be embalmed and preserved, allowing you to uncover its eyes and direct its gaze toward a creature within 30 feet as an action. That creature must succeed on a Constitution saving throw or be incapacitated until the end of its turn.`,
  `Grick Armor (requires leatherworker's tools and 6 harvested parts from a grick). This is leather armor. While wearing it, you have resistance to slashing, piercing, and bludgeoning damage from nonmagical weapons. In addition, you have advantage on Dexterity (Stealth) checks to hide in rocky terrain. This armor requires attunement.`,
  `Manticore Tail Crossbow (requires smith's tools, leatherworker's tools, and 4 harvested parts from a manticore's tail). You make a semi-organic crossbow from the tail of a manticore, embalmed and linked to a mechanism. It counts as a light crossbow, but you can fire 24 shots with it without needing to reload. After the 24th shot, you cannot use it again until the next dawn.`,
  `Bulette Hide (requires leatherworker's tools and 8 harvested parts from a bulette). You make hide armor from the hide of a bulette. It counts as half plate +2. In addition, it reduces up to 10 points of falling damage and gives you tremorsense out to a range of 10 feet. This armor requires attunement.`,
  `Everything Else. Anything can be found in the world, and with the right mindset anything can be made. Ask your DM to make something new and exciting from the monsters you have slain.`,
].join(' ')

const ASI = 'You can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you cannot increase an ability score above 20 using this feature.'

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Fighting Style', description: `A readied hunter knows how to approach any situation. After a long rest you may adopt one fighting style to match your needs. You cannot take a Fighting Style option more than once, even if you later get to choose again. ${FIGHTING_STYLES}` },
  { level: 1, name: 'Behemoth Slayer', description: 'Beginning at 1st level, you have advantage on Wisdom (Survival) checks to track giants, monstrosities, beasts, and dragons, as well as on Intelligence checks to recall information about them.' },
  { level: 2, name: 'Harvesting and Crafting', description: `Starting at 2nd level, you learn how to harvest a monster's body parts to craft equipment. Each type of creature grants you benefits depending on its type and traits. Use the creature's Hit Die to determine how much may be harvested. You may have up to double your proficiency bonus of consumable items actively on you, along with your permanent crafted items. To craft an item you need specific tools and a number of harvested creature parts, as shown in the crafting recipes below. In addition, you can replace your crafted items whenever you finish a long rest. Crafting recipes: ${CRAFTING_RECIPES} Specialties: ${SPECIALTY_RECIPES}` },
  // The supplied text heads this feature "Spot Weaknesses" but labels the table column
  // and the 2nd-level row "Spot Weakness". The archive uses the feature heading for both.
  { level: 2, name: 'Spot Weaknesses', description: 'Beginning at 2nd level, you can use your bonus action to detect the weak spot of monsters. As a bonus action, choose a creature within 60 feet. All attacks made by you against that creature for the next minute deal additional damage equal to 1d4. The additional damage increases as you gain levels in this class, as shown in the Spot Weaknesses column of the Monster Hunter table.' },
  { level: 3, name: 'Rustic Cook', description: "Starting at 3rd level, you learn how to prepare special meals that not only prepare your body for a long hunt, but can also give you some of the properties of the monster you have slain. You need your cook's utensils to use this feature. Over the course of a long rest, you can prepare a meal using parts of your prey. The meal can restore Hit Dice a creature has spent, up to a maximum equal to your proficiency bonus. In addition, the meal can provide those who participate in the feast one of the prey's traits for 8 hours. The benefit may be an increase to hit points based on the meal's Hit Die, a stat bonus based on the meal's highest modifier, a higher walking speed, a special movement speed, or a skill bonus. A creature may only have one benefit at a time; if it eats another meal during the duration, the new meal's benefit replaces the old one." },
  { level: 4, name: 'Ability Score Improvement', description: ASI },
  { level: 4, name: 'Monster Smithing', description: 'Starting at 4th level, you have learned to merge the properties of the monsters you slay into powerful hybrid materials. Over the course of a crafting session, you may combine two harvested parts from different creature types to forge a hybrid material such as "Fiendbone Alloy" or "Draconic Hide", which grants you the properties of both monster parts. Hybrid equipment always counts as magical for the purpose of overcoming resistance and immunity to nonmagical attacks and damage. You can maintain a number of active hybrid items equal to your proficiency bonus, and they count against your limit of crafted items. Hybrid recipes that call for fused parts, such as Hybrid Melee Weapons and the Hybrid Bow, become available to you through this feature.' },
  { level: 5, name: 'Extra Attack', description: 'Beginning at 5th level, you can attack twice, instead of once, whenever you take the Attack action on your turn.' },
  { level: 6, name: 'Behemoth Slayer Improvement', description: 'At 6th level, you have advantage on Wisdom (Insight) checks and Dexterity saving throws against giants, monstrosities, beasts, and dragons.' },
  { level: 7, name: 'Dodge Roll', description: 'Beginning at 7th level, you are able to move out of harm\'s way for a brief moment. As a reaction when you are about to take damage, you may instead take no damage and move up to 5 feet away without provoking opportunity attacks. You may do this a number of times equal to your Dexterity modifier (minimum once) per short or long rest.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: ASI },
  { level: 10, name: 'Advanced Prey', description: 'At 10th level, you can choose one additional prey to hunt. Choose one of the following creature types: oozes, fiends, undead, or aberrations. You gain the benefits of the Behemoth Slayer feature against the chosen creature type.' },
  { level: 11, name: 'Rush of Adrenaline', description: 'Beginning at 11th level, you are able to exert more effort at a steep cost. Once per turn as a reaction you may gain an extra turn. At the end of the extra turn you gain one level of exhaustion. You may do this a number of times equal to your proficiency bonus per long rest.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: ASI },
  { level: 14, name: 'Veteran Hunter', description: 'Starting at 14th level, whenever you make an attack roll, skill check, or saving throw that adds your proficiency bonus, you can add twice your proficiency bonus instead. In addition, whenever you are hit by an attack, you can add your proficiency bonus to your AC until the end of your turn. You can use this feature three times, and you regain all expended uses when you finish a short or long rest.' },
  { level: 15, name: 'Improved Fighting Style', description: `Starting at 15th level, you have mastered the numerous arts of fighting throughout your adventure. Your fighting styles are improved as follows. ${IMPROVED_FIGHTING_STYLES}` },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: ASI },
  { level: 18, name: 'Mortal Strike', description: 'Starting at 18th level, whenever you fight beasts, dragons, giants, monstrosities, or your additional prey, the first attack you make on each of your turns is made with advantage. Additionally, you roll an extra Spot Weaknesses die for damage on a hit.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: ASI },
  { level: 20, name: 'Legendary Slayer', description: 'Beginning at 20th level, add +4 to two of the following scores: Strength, Dexterity, or Constitution, to a maximum of 24.' },
]

// [level, proficiency bonus, Spot Weaknesses die, feature names] - transcribed from the
// Monster Hunter table. Levels 9, 13, and 17 print "-" in the Features column.
const progressionRows: Array<[number, number, string, string[]]> = [
  [1, 2, '—', ['Fighting Style', 'Behemoth Slayer']],
  [2, 2, '1d4', ['Harvesting and Crafting', 'Spot Weaknesses']],
  [3, 2, '1d4', ['Rustic Cook']],
  [4, 2, '1d4', ['Ability Score Improvement', 'Monster Smithing']],
  [5, 3, '1d6', ['Extra Attack']],
  [6, 3, '1d6', ['Behemoth Slayer Improvement']],
  [7, 3, '1d6', ['Dodge Roll']],
  [8, 3, '1d6', ['Ability Score Improvement']],
  [9, 4, '1d8', ['—']],
  [10, 4, '1d8', ['Advanced Prey']],
  [11, 4, '1d8', ['Rush of Adrenaline']],
  [12, 4, '1d8', ['Ability Score Improvement']],
  [13, 5, '1d10', ['—']],
  [14, 5, '1d10', ['Veteran Hunter']],
  [15, 5, '1d10', ['Improved Fighting Style']],
  [16, 5, '1d10', ['Ability Score Improvement']],
  [17, 6, '1d12', ['—']],
  [18, 6, '1d12', ['Mortal Strike']],
  [19, 6, '1d12', ['Ability Score Improvement']],
  [20, 6, '1d12', ['Legendary Slayer']],
]
const progression = progressionRows.map(([level, proficiencyBonus, spotWeaknesses, featureNames]) => ({
  _type: 'classProgressionRow', _key: `monster-hunter-level-${level}`, level, proficiencyBonus,
  resources: [{ _type: 'object', _key: 'spot-weaknesses', name: 'Spot Weaknesses', value: spotWeaknesses }],
  featureNames,
}))

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { id, document: {
    _id: id, _type: 'feature', name: seed.name,
    slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) },
    acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Transcribed from the Monster Hunter class text supplied by the archive owner.',
  }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-monster-hunter"][0]{
    source, sourceBook, isHomebrew, hitDie, savingThrows, "subclassIds": subclasses[]._ref
  }`)
  if (!current) throw new Error('No class-monster-hunter document found')
  const saves = [...(current.savingThrows ?? [])].sort().join(',')
  if (current.source !== 'Unofficial' || current.sourceBook || current.isHomebrew || current.hitDie !== 10 || saves !== 'DEX,STR') {
    throw new Error(`Refusing to merge into an unexpected Monster Hunter record: ${JSON.stringify(current)}`)
  }
  const unexpected = (current.subclassIds ?? []).filter((id: string) => !RETIRED_SUBCLASS_IDS.includes(id))
  if (unexpected.length) throw new Error(`Monster Hunter has unexpected subclasses: ${unexpected.join(', ')}`)

  // A draft of the class would keep its own copy of the guild references, and the
  // commit would fail on reference integrity when the guilds are deleted. Patching
  // only the published document cannot fix that, so ask for the draft to be resolved.
  const classDraft = await client.fetch<string | null>(`*[_id == "drafts.class-monster-hunter"][0]._id`)
  if (classDraft) {
    throw new Error('A draft of class-monster-hunter exists. Publish or discard it in the Studio first, then re-run: this script patches the published document only.')
  }

  // Retiring the guilds deletes their documents, which Sanity refuses while anything
  // still points at them - a saved character's `classes[].subclassRef`, most likely.
  // Report that here rather than failing halfway through the commit. The class itself
  // and the guilds' own drafts are expected referrers, so they are not counted.
  const baseId = (id: string) => id.replace(/^drafts\./, '')
  const expectedReferrers = new Set([...RETIRED_SUBCLASS_IDS, 'class-monster-hunter'])
  const inbound: Array<{ _id: string; _type: string }> = await client.fetch(
    `*[references($ids)]{_id, _type}`,
    { ids: RETIRED_SUBCLASS_IDS },
  )
  const blockers = (inbound ?? []).filter((doc) => !expectedReferrers.has(baseId(doc._id)))
  if (blockers.length) {
    throw new Error(`Cannot retire the invented guild subclasses; these documents still reference them: ${blockers.map((doc) => `${doc._id} (${doc._type})`).join(', ')}`)
  }

  // Feature documents this class and its retired guilds own, whether they are still
  // referenced or were left behind by `normalize-feature-references-homebrew.ts`.
  const priorRefs: string[] = await client.fetch(
    `array::unique(coalesce(*[_id == "class-monster-hunter"][0].features[]._ref, []) + coalesce(*[_id in $ids].features[]._ref, []))`,
    { ids: RETIRED_SUBCLASS_IDS },
  )
  const ownedIds: string[] = await client.fetch(
    `*[_type == "feature" && _id match $patterns]._id`,
    { patterns: FEATURE_ID_PREFIXES.map((prefix) => `${prefix}*`) },
  )
  // `match` tokenizes, so it over-matches; the prefix test below is the real gate.
  const candidates = new Set<string>([
    ...(priorRefs ?? []),
    ...(ownedIds ?? []).filter((id) => FEATURE_ID_PREFIXES.some((prefix) => baseId(id).startsWith(prefix))),
  ])

  let tx = client.transaction()
  const newIds = new Set<string>()
  const classRefs = coreFeatures.map((seed, index) => {
    const result = featureDocument('monster-hunter', seed, index)
    newIds.add(result.id)
    tx = tx.createOrReplace(result.document as any)
    return result.reference
  })

  tx = tx.patch('class-monster-hunter', (patch) => patch.set({
    description: 'Monster hunters come from a long line of slayers, a secret order founded to protect the world from supernatural danger. Their duties run from cataloguing the creatures of the night to killing them, and they harvest what they kill: a hunter reads a monster for its weak spot, then renders its parts into potions, branded weapons, bone bows, and monstercraft armor. For a descendant of the order there are few choices - you either hunt, or you become the hunted.',
    hitDie: 10, primaryAbility: ['STR', 'DEX', 'INT'], savingThrows: ['STR', 'DEX'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'monster-hunter-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor', 'Shields'] },
      { _type: 'proficiencyRule', _key: 'monster-hunter-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Martial Weapons'] },
      { _type: 'proficiencyRule', _key: 'monster-hunter-tools', type: 'tool', mode: 'fixed', toolOptions: ["Cook's utensils"] },
      { _type: 'proficiencyRule', _key: 'monster-hunter-tool-choice', type: 'tool', mode: 'choice', count: 1, description: "one artisan's tool or kit of the hunter's trade", toolOptions: ["Alchemist's supplies", "Poisoner's kit", "Woodcarver's tools", "Leatherworker's tools"] },
      { _type: 'proficiencyRule', _key: 'monster-hunter-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Acrobatics', 'Arcana', 'Athletics', 'History', 'Insight', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Stealth', 'Survival'] },
    ],
    isSpellcaster: false, spellcaster: 'none', features: classRefs, progression, subclasses: [],
    startingEquipment: [
      'Leather armor or hide armor',
      'A martial weapon and a shield; or two martial weapons',
      'An explorer’s pack or a dungeoneer’s pack',
      'If you use starting wealth instead, you have 4d4 × 10 gp in funds',
    ],
    source: 'Unofficial', edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Rebuilt from the Monster Hunter class text supplied by the archive owner: full chassis, all 20 levels of class features, the Spot Weaknesses die table, and the harvesting/crafting recipe catalogue including the Specialties. The class has no subclasses in the supplied text, so the four invented "Guild" subclasses from the earlier summarised seed are retired. Obvious typos in the source text were corrected; mechanics are unchanged.',
  }).unset(['spellcastingAbility', 'spellLists', 'spells', 'subclassLevel']))

  // Delete each guild's draft alongside its published document, or the draft survives
  // as an orphan the Studio still lists.
  const retired = RETIRED_SUBCLASS_IDS.flatMap((id) => [id, `drafts.${id}`])
  for (const id of retired) tx = tx.delete(id)
  const stale = [...candidates].filter((id) => !newIds.has(id)).sort()
  for (const id of stale) tx = tx.delete(id)

  if (!APPLY) {
    console.log(`Dry run: ${coreFeatures.length} class features, ${progression.length} progression rows, no subclasses.`)
    console.log(`Would retire ${RETIRED_SUBCLASS_IDS.length} invented subclasses: ${RETIRED_SUBCLASS_IDS.join(', ')}`)
    console.log(`Would delete ${stale.length} superseded feature docs: ${stale.join(', ') || '(none)'}`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-monster-hunter"][0]{
    source, sourceBook, isHomebrew, isSpellcaster, hitDie, savingThrows, primaryAbility, startingEquipment, subclassLevel,
    "featureCount": count(features), "progressionCount": count(progression),
    "levels": progression[].level,
    "spotWeaknesses": progression[].resources[name == "Spot Weaknesses"][0].value,
    "brokenRefs": count(features[!defined(@->._id)]),
    "subclassCount": count(subclasses),
    "orphanSubclasses": count(*[_type == "subclass" && (parentClassId == "monster-hunter" || parentClass._ref == "class-monster-hunter")]),
    "survivingRetired": count(*[_id in $retired])
  }`, { retired })

  const problems: string[] = []
  if (audit.source !== 'Unofficial' || audit.sourceBook || audit.isHomebrew || audit.isSpellcaster) problems.push('source/flags')
  if (audit.hitDie !== 10 || audit.savingThrows?.join(',') !== 'STR,DEX') problems.push('hitDie/saves')
  if (audit.primaryAbility?.join(',') !== 'STR,DEX,INT') problems.push('primaryAbility')
  if (audit.featureCount !== coreFeatures.length) problems.push(`featureCount=${audit.featureCount}`)
  if (audit.progressionCount !== 20 || audit.levels?.join(',') !== progressionRows.map((r) => r[0]).join(',')) problems.push('progression')
  if (audit.spotWeaknesses?.join(',') !== progressionRows.map((r) => r[2]).join(',')) problems.push('spotWeaknesses')
  if (audit.startingEquipment?.length !== 4) problems.push('startingEquipment')
  if (audit.brokenRefs) problems.push(`brokenRefs=${audit.brokenRefs}`)
  if (audit.subclassCount) problems.push(`subclassCount=${audit.subclassCount}`)
  if (audit.orphanSubclasses) problems.push(`orphanSubclasses=${audit.orphanSubclasses}`)
  if (audit.survivingRetired) problems.push(`survivingRetired=${audit.survivingRetired}`)
  if (audit.subclassLevel) problems.push(`subclassLevel=${audit.subclassLevel}`)
  if (problems.length) throw new Error(`Monster Hunter audit failed: ${problems.join('; ')} :: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations (retired ${RETIRED_SUBCLASS_IDS.length} invented subclasses, deleted ${stale.length} superseded features). Verification OK.`)
}

run().catch((error) => { console.error(error); process.exit(1) })
