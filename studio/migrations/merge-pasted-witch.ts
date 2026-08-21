import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

const progressionRows: Array<[number, number, string, string, string, string, string[]]> = [
  [1, 2, '2', '4', '2', '2', ['Hexes', 'Spellcasting', "Witch's Curse"]],
  [2, 2, '3', '4', '3', '3', ['Cackle', 'Familiar']],
  [3, 2, '3', '4', '4', '4/2', ["Witch's Craft"]],
  [4, 2, '3', '5', '5', '4/3', ['Ability Score Improvement']],
  [5, 3, '4', '5', '6', '4/3/2', ['Insidious Spell']],
  [6, 3, '4', '5', '7', '4/3/3', ['Craft feature']],
  [7, 3, '4', '5', '8', '4/3/3/1', ['Improved Familiar']],
  [8, 3, '4', '5', '9', '4/3/3/2', ['Ability Score Improvement']],
  [9, 4, '5', '5', '10', '4/3/3/3/1', ['Dying Curse']],
  [10, 4, '5', '6', '11', '4/3/3/3/2', ['Craft feature']],
  [11, 4, '5', '6', '12', '4/3/3/3/2/1', ['Grand Hex']],
  [12, 4, '5', '6', '12', '4/3/3/3/2/1', ['Ability Score Improvement']],
  [13, 5, '6', '6', '13', '4/3/3/3/2/1/1', ['Grand Hex']],
  [14, 5, '6', '6', '13', '4/3/3/3/2/1/1', ['Craft feature']],
  [15, 5, '6', '6', '14', '4/3/3/3/2/1/1/1', ['Grand Hex']],
  [16, 5, '6', '6', '14', '4/3/3/3/2/1/1/1', ['Ability Score Improvement']],
  [17, 6, '7', '6', '15', '4/3/3/3/2/1/1/1/1', ['—']],
  [18, 6, '7', '6', '15', '4/3/3/3/3/1/1/1/1', ['Grand Hex']],
  [19, 6, '7', '6', '15', '4/3/3/3/3/2/1/1/1', ['Ability Score Improvement']],
  [20, 6, '7', '6', '15', '4/3/3/3/3/2/2/1/1', ['Hexmaster']],
]
const progression = progressionRows.map(([level, proficiencyBonus, hexes, cantrips, spells, slots, featureNames]) => ({
  _type: 'classProgressionRow', _key: `witch-level-${level}`, level, proficiencyBonus,
  resources: [
    { _type: 'object', _key: 'hexes-known', name: 'Hexes Known', value: hexes },
    { _type: 'object', _key: 'cantrips-known', name: 'Cantrips Known', value: cantrips },
    { _type: 'object', _key: 'spells-known', name: 'Spells Known', value: spells },
    { _type: 'object', _key: 'spell-slots', name: 'Spell Slots (1st–9th)', value: slots },
  ], featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Spellcasting', description: 'Charisma is your spellcasting ability for Witch spells (save DC 8 + proficiency bonus + Charisma modifier; spell attack proficiency bonus + Charisma modifier). You know and cast spells using the Witch progression table, regain slots after a long rest, and may replace one known spell whenever you gain a Witch level. You may cast known Witch rituals as rituals and use an arcane focus.' },
  { level: 1, name: "Witch's Curse", description: 'Choose the lasting curse that fuels your magic. Burned grants fire resistance and produce flame without counting against cantrips known. Drowned grants air and water breathing and a swimming speed equal to walking speed. Hideous grants Intimidation proficiency and can frighten one visible Humanoid until your next turn ends when initiative is rolled on a failed Wisdom save. Hollow grants temporary hit points equal to Charisma modifier + Witch level when you or your familiar reduces a hostile creature to 0 hit points. Loveless grants immunity to being charmed. Possessed grants an extra known Witch spell at levels 1, 4, 8, and 12.' },
  { level: 1, name: 'Hexes', description: 'Learn two hexes at level 1 and additional choices as shown in the Witch table; replace one whenever you gain a Witch level. Hexes use your spell attack bonus and save DC and require verbal or somatic components. A duration hex uses concentration, but you may concentrate on one hex and one spell simultaneously with one Constitution save for both. Choices: Abate denies reactions on a failed Charisma save. Apathy makes a target temporarily indifferent to one hostile creature. Beckon Familiar casts find familiar as an action once per minute. Bleeding adds 1d4 each time the target takes damage. Charm briefly charms. Dire Familiar doubles your Witch level as added current and maximum familiar hit points and adds Charisma to its damage for 1 minute. Disorient subtracts 1d6 from attacks. Doomward leaves an ally at 1 hit point once per rest. Duplicity gives an odd-or-even chance for an attack to hit an illusory double. Evil Eye frightens. Fortune grants an ally advantage on saves. Go Unseen makes you and your familiar invisible through your next turn, once per minute. Hobble reduces speed to 10 feet and can make a flier fall. Mire creates 30-foot-radius difficult terrain ignored by you and your familiar. Misfortune turns natural 20s into 1s. Obfuscate creates 20-foot-radius heavy fog. Pox poisons a nearby target. Ruin lowers AC by 3, minimum 10. Slumber briefly knocks an eligible target unconscious. Tremors can knock nearby grounded creatures prone. Ward reduces each instance of damage to an ally by 3. Hexes count as 0-level magic and cease in antimagic.' },
  { level: 2, name: 'Cackle', description: 'As a bonus action with a verbal component, extend a hex on which you concentrate by 1 round for each affected target within 60 feet.' },
  { level: 2, name: 'Familiar', description: 'Learn find familiar, cast it as a ritual without material components, and do not count it against spells known. Its turn occurs immediately before or after yours. Once per turn as an action or bonus action, command it to use its reaction to attack. It can deliver your spells even when their range is not touch. Available special forms include pet rock, pseudodragon, and sprite. It uses your spell attack bonus for attacks, adds your proficiency bonus to AC, saves, and damage, and adds twice your Witch level to its hit point maximum.' },
  { level: 3, name: "Witch's Craft", description: 'Choose a magical Craft, granting features at levels 3, 6, 10, and 14. Craft-granted hexes and Craft Spells do not count against your hexes or spells known. The archive retains the Black, Blood, Green, Purple, Red, Steel, and White Magic Craft tracks.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability score by 2 or two scores by 1, to a maximum of 20. You gain this feature again at levels 8, 12, 16, and 19.' },
  { level: 5, name: 'Insidious Spell', description: 'When a Witch spell affects a hostile creature that is the sole target of your hex, it has disadvantage on its first saving throw against that spell.' },
  { level: 7, name: 'Improved Familiar', description: 'Your familiar’s attacks count as magical for overcoming resistance and immunity. You may also choose a brass dragon wyrmling that cannot use its breath weapon, a fright, or a grep as its form.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability score by 2 or two scores by 1, to a maximum of 20.' },
  { level: 9, name: 'Dying Curse', description: 'Once per long rest when a creature reduces you to 0 hit points without killing you outright, curse it for up to 24 hours. It has disadvantage on attacks, checks, and saves. If you regain consciousness or remove curse targets it, the curse ends after its next turn.' },
  { level: 11, name: 'Grand Hex', description: 'Learn one Grand Hex at levels 11, 13, 15, and 18. Cauldron grants alchemy points equal to half Witch level and brews listed temporary potions in 10 minutes. Coven inducts up to two spellcasters, granting nearby members shared spells and one shared slot of each level 1–5. Dual Hex makes single-target hexes affect two creatures. Forceful Personality raises Charisma by 2 and its maximum to 22. Possession lets your spirit control an eligible Large or smaller creature for up to 1 hour once per long rest. War Hex lets a bonus-action cantrip follow a single-target hex against the same target. Witch’s Broom enchants one held mundane object for a 60-foot flying speed while lightly armored and shieldless. Witch’s Hut animates a structure within a 15-foot cube, links its entrance to a magnificent mansion, and can teleport it 60 feet once per long rest.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability score by 2 or two scores by 1, to a maximum of 20.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability score by 2 or two scores by 1, to a maximum of 20.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability score by 2 or two scores by 1, to a maximum of 20.' },
  { level: 20, name: 'Hexmaster', description: 'Creatures have disadvantage on saving throws against your hexes.' },
]

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(seed: FeatureSeed, index: number) {
  const slug = slugify(seed.name)
  const id = `feature-witch-${seed.level}-${slug}`
  return { document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `witch-${seed.level}-${slug}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false, versionNotes: 'Restored from the matching Witch specification supplied by the archive owner.' }, reference: ref(id, `${seed.level}-${slug}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-witch"][0]{source,sourceBook,isHomebrew,isSpellcaster,spellcaster,spellcastingAbility,hitDie,"subclassIds":subclasses[]._ref}`)
  const expectedIds = ['subclass-black-magic', 'subclass-blood-magic', 'subclass-green-magic', 'subclass-purple-magic', 'subclass-red-magic', 'subclass-steel-magic', 'subclass-white-magic']
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== 'Kobold Press / Mage Hand Press' || current.isHomebrew || !current.isSpellcaster || current.spellcaster !== 'full' || current.spellcastingAbility !== 'CHA' || current.hitDie !== 8 || [...current.subclassIds].sort().join(',') !== [...expectedIds].sort().join(',')) throw new Error(`Refusing to merge into an unexpected Witch record: ${JSON.stringify(current)}`)

  let tx = client.transaction()
  const featureRefs = coreFeatures.map((seed, index) => { const built = featureDocument(seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
  tx = tx.patch('class-witch', (patch) => patch.set({
    description: 'A full Charisma spellcaster afflicted by a sinister curse and able to turn that darkness outward through hexes, manipulative spells, and an exceptionally powerful familiar.',
    hitDie: 8, primaryAbility: ['CHA', 'CON'], savingThrows: ['WIS', 'CHA'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'witch-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor'] },
      { _type: 'proficiencyRule', _key: 'witch-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Blowguns', 'Shortswords', 'Whips'] },
      { _type: 'proficiencyRule', _key: 'witch-tools', type: 'tool', mode: 'fixed', toolOptions: ["Alchemist's Supplies", "Poisoner's Kit"] },
      { _type: 'proficiencyRule', _key: 'witch-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Nature', 'Persuasion', 'Religion'] },
    ],
    startingEquipment: ['A whip and blowgun; or a light crossbow and 20 bolts; or any simple weapon', 'A component pouch or arcane focus', 'A scholar’s pack or dungeoneer’s pack', 'Leather armor, any simple weapon, and a dagger'],
    isSpellcaster: true, spellcaster: 'full', spellcastingAbility: 'CHA', spellLists: ['witch'], features: featureRefs, progression, subclassLevel: 3,
    source: 'Unofficial', sourceBook: 'Kobold Press / Mage Hand Press', edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Complete matching Witch chassis, spell progression, six curses, 22 hex choices, familiar rules, eight grand hex choices, and capstone restored. Seven existing Craft tracks retained because the supplied excerpt only summarizes Craft themes and does not provide their mechanics.',
  }).unset(['spells']))

  if (!APPLY) { console.log(`Dry run: replace 4 abbreviated core features with ${coreFeatures.length} complete features, add ${progression.length} progression rows, and retain all 7 Craft tracks.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-witch"][0]{sourceBook,isHomebrew,isSpellcaster,spellcaster,spellcastingAbility,hitDie,primaryAbility,savingThrows,"featureCount":count(features),"progressionCount":count(progression),"subclassCount":count(subclasses),"brokenRefs":count(features[!defined(@->._id)])+count(subclasses[!defined(@->._id)]),"levels":progression[].level,"hexes":progression[].resources[name=="Hexes Known"][0].value,"slots":progression[].resources[name=="Spell Slots (1st–9th)"][0].value}`)
  if (audit.sourceBook !== 'Kobold Press / Mage Hand Press' || audit.isHomebrew || !audit.isSpellcaster || audit.spellcaster !== 'full' || audit.spellcastingAbility !== 'CHA' || audit.hitDie !== 8 || audit.primaryAbility.join(',') !== 'CHA,CON' || audit.savingThrows.join(',') !== 'WIS,CHA' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.subclassCount !== 7 || audit.brokenRefs || audit.levels.join(',') !== progressionRows.map((row) => row[0]).join(',') || audit.hexes.join(',') !== progressionRows.map((row) => row[2]).join(',') || audit.slots.join(',') !== progressionRows.map((row) => row[5]).join(',')) throw new Error(`Witch merge audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
