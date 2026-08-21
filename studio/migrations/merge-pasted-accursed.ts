import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

const progressionRows: Array<[number, number, string, string, string, string, string, string, string[]]> = [
  [1, 2, '—', '—', '—', '—', '—', '—', ['Accursed Affliction', 'Jinx']],
  [2, 2, '3', '2', '—', '—', '—', '—', ['Spellcasting', 'Curse Control', 'Malediction Metamorphosis']],
  [3, 2, '4', '3', '—', '—', '—', '—', ['Accursed Affliction feature', 'Fell Attunement']],
  [4, 2, '4', '3', '—', '—', '—', '—', ['Ability Score Improvement']],
  [5, 3, '6', '4', '2', '—', '—', '—', ['Accursed Affliction feature']],
  [6, 3, '6', '4', '2', '—', '—', '—', ['Possessive Curse']],
  [7, 3, '7', '4', '3', '—', '—', '—', ['Blundering Jinx']],
  [8, 3, '7', '4', '3', '—', '—', '—', ['Ability Score Improvement']],
  [9, 4, '9', '4', '3', '2', '—', '—', ['—']],
  [10, 4, '9', '4', '3', '2', '—', '—', ['Malediction Malignance']],
  [11, 4, '10', '4', '3', '3', '—', '—', ['Accursed Affliction feature']],
  [12, 4, '10', '4', '3', '3', '—', '—', ['Ability Score Improvement']],
  [13, 5, '12', '4', '3', '3', '1', '—', ['—']],
  [14, 5, '12', '4', '3', '3', '1', '—', ['Anathema Arcane']],
  [15, 5, '13', '4', '3', '3', '2', '—', ['Accursed Affliction feature']],
  [16, 5, '13', '4', '3', '3', '2', '—', ['Ability Score Improvement']],
  [17, 6, '15', '4', '3', '3', '3', '1', ['—']],
  [18, 6, '15', '4', '3', '3', '3', '1', ['Malediction Metastasis']],
  [19, 6, '16', '4', '3', '3', '3', '2', ['Ability Score Improvement']],
  [20, 6, '16', '4', '3', '3', '3', '2', ['Accursed Affliction feature', 'Anathema Arcane improvement']],
]
const progression = progressionRows.map(([level, proficiencyBonus, known, first, second, third, fourth, fifth, featureNames]) => ({
  _type: 'classProgressionRow', _key: `accursed-level-${level}`, level, proficiencyBonus,
  resources: [
    { _type: 'object', _key: 'spells-known', name: 'Spells Known', value: known },
    { _type: 'object', _key: 'slots-1', name: '1st-level Slots', value: first },
    { _type: 'object', _key: 'slots-2', name: '2nd-level Slots', value: second },
    { _type: 'object', _key: 'slots-3', name: '3rd-level Slots', value: third },
    { _type: 'object', _key: 'slots-4', name: '4th-level Slots', value: fourth },
    { _type: 'object', _key: 'slots-5', name: '5th-level Slots', value: fifth },
  ], featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Accursed Affliction', description: 'Choose the Curse of Lycanthropy, Misfortune, Possession, the Armament, or Vampirism. It grants features at Accursed levels 1, 3, 5, 11, 15, and 20, curse spells, and defined ailments. Remove curse and similar effects cannot remove it. Choose Intelligence, Wisdom, or Charisma as your curse ability; your curse save DC is 8 + proficiency bonus + that ability modifier.' },
  { level: 1, name: 'Jinx', description: 'As an action, touch a creature and choose an ability. It makes a Wisdom save; on a failure, it has disadvantage on the next ability check using that ability within 1 minute. You may contest its passive Perception with Sleight of Hand to conceal the source. The effect ends if you use Jinx again, lose concentration, or dispel magic or remove curse affects the target.' },
  { level: 2, name: 'Spellcasting', description: 'Cast Accursed spells using the class table, regaining all slots after a long rest. At 2nd level you know your affliction spell and two 1st-level Accursed spells. New and replacement spells must be of a level for which you have slots. Your chosen curse ability is your spellcasting ability. Choose arcane foci, druidic foci, or holy symbols as your spellcasting focus type.' },
  { level: 2, name: 'Curse Control', description: 'Spend a spell slot to control ailments. Afflict: as an action, a visible creature within 30 feet makes a Wisdom save or suffers one of your ailments, repeating the save as an action. Suppress: as a bonus action, suppress any of your ailments. Duration is 1 minute with a 1st-level slot, 10 minutes with 2nd, 1 hour with 3rd, 8 hours with 4th, or 24 hours with 5th level or higher.' },
  { level: 2, name: 'Malediction Metamorphosis', description: 'Choose one evolution: Enshrouding Imprecation grants Stealth advantage in dim light or darkness; Fecund Affliction grants one slot-free 1-minute Afflict per short or long rest; Hostile Bane adds your curse modifier as necrotic damage to one hit each turn; Protective Hex substitutes the curse modifier for Dexterity in AC; Swift Jinx makes Jinx a bonus action.' },
  { level: 3, name: 'Fell Attunement', description: 'As an action, sense until the end of your next turn the location and type of aberrations, fiends, shapechangers, and undead within 60 feet not behind total cover. You also locate cursed objects and active or recently cast Accursed or Warlock spells there. Use this 1 + your curse ability modifier times per long rest.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 6, name: 'Possessive Curse', description: 'You are immune to curses other than your Accursed Affliction; your hit point maximum cannot be reduced against your will; you cannot be possessed against your will; and curses on objects you touch or attune to do not affect you.' },
  { level: 7, name: 'Blundering Jinx', description: 'When a creature fails against Jinx, you may instead give it disadvantage on its next attack roll using the chosen ability within 1 minute.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 10, name: 'Malediction Malignance', description: 'Choose another Metamorphosis or an advanced evolution: Consolidating Jinx hinders a repeat target’s save; Deadly Bane applies on every hit; Hex Armor reduces incoming damage by half proficiency; Muffling Imprecation removes verbal components in darkness; Transferring Affliction lets you ignore an ailment you transfer.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 14, name: 'Anathema Arcane', description: 'Your 15-foot aura can Negate a spell targeting you as a reaction with a curse ability check against DC 10 + twice the spell level, or Stifle a spell effect or magic item for 1 minute as an action. Item DCs are 12 common, 15 uncommon, 18 rare, 21 very rare, 24 legendary, and 30 artifact. Uses equal your curse modifier per long rest. At level 20 the aura becomes 30 feet and refreshes on a short or long rest.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
  { level: 18, name: 'Malediction Metastasis', description: 'Choose a third eligible evolution. Ultimate options can improve stealth and supernatural sight, extend Jinx to saves or two targets, empower attacks and reactions, allow evolutions to change after rests, multiply or intensify Afflict, or grant reactive defenses. Prerequisites from earlier Maledictions still apply.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability score by 2 or two ability scores by 1, to a maximum of 20.' },
]

const afflictions: Record<string, { name: string; description: string; features: FeatureSeed[] }> = {
  'subclass-curse-of-lycanthropy': { name: 'Curse of Lycanthropy', description: 'Master an ancient beast curse by sculpting your body into controlled mammalian forms while enduring silver vulnerability and unnatural hunger.', features: [
    { level: 1, name: 'Lycanthropy Ailments and Enhanced Senses', description: 'You are vulnerable to silvered-weapon damage and need two pounds of food daily or gain exhaustion. Gain Perception proficiency and advantage on checks relying on hearing or smell.' },
    { level: 1, name: 'Minor Shift', description: 'You count as a shapechanger and form a proficient natural weapon dealing 1d4 bludgeoning, piercing, or slashing damage. After attacking with it, attack again as a bonus action. The die becomes d6 at level 5, d8 at 11, d10 at 17, and counts as magical from level 6.' },
    { level: 2, name: 'Lycanthropy Curse Spells', description: 'Learn longstrider at level 2, alter self at 5, haste at 9, freedom of movement at 13, and far step at 17 as Accursed spells included in Spells Known.' },
    { level: 3, name: 'Scent Memory', description: 'A successful smell-based Perception or Survival check tells you whether you have scented a creature before and identifies a known creature smelled within the last year, unless its form is unrecognized.' },
    { level: 3, name: 'Hybrid Shift', description: 'As an action, transform for 1 minute. Make natural-weapon attacks as a bonus action and heal half your Accursed level at each turn’s start unless recently struck by silver. Recharge after a short or long rest, or spend a 3rd-level-or-higher slot.' },
    { level: 5, name: 'Extra Attack', description: 'Attack twice whenever you take the Attack action.' },
    { level: 11, name: 'Sustained Shift', description: 'Maintain one chosen trait: increased speed and jumps, temporary 30-foot echolocation blindsight, climb speed, prolonged breath holding, darkvision and improved sight, or swim speed.' },
    { level: 15, name: 'Major Shift', description: 'Cast alter self at will without a slot or concentration, including changing your basic shape into another mammal of your size.' },
    { level: 20, name: 'Master of Form', description: 'Use your shift features as a bonus action. Hybrid Shift has unlimited uses and grants resistance to nonmagical, nonsilvered weapon damage.' },
  ] },
  'subclass-curse-of-misfortune': { name: 'Curse of Misfortune', description: 'Redirect a supernatural shroud of bad luck until you can manipulate the fate of everyone around you.', features: [
    { level: 1, name: 'Misfortune Ailments', description: 'After resting or rolling initiative, a shroud gives disadvantage on Strength-, Dexterity-, and Constitution-based checks and saves and on attacks; after one such roll you may dismiss or restore it. Critical hits against you roll one additional damage die.' },
    { level: 1, name: 'Jinxing Shroud and Fortune Twist', description: 'While shrouded, Jinx reaches 30 feet and conceals you as its source. When you fail an attack, check, or save, use your reaction to reroll; that roll type cannot be rerolled again until you first fail another roll of the same type.' },
    { level: 2, name: 'Misfortune Curse Spells', description: 'Learn bane at level 2, enhance ability at 5, bestow curse at 9, confusion at 13, and skill empowerment at 17 as Accursed spells included in Spells Known.' },
    { level: 3, name: 'Unfortunate Accident and Cheating Shroud', description: 'Before a Jinx save once per turn, add force damage on failure: 1d8, rising to 2d8 at level 5, 3d8 at 11, and 4d8 at 17. While shrouded, use a reaction to give advantage or disadvantage on a visible creature’s game-of-chance check within 30 feet.' },
    { level: 5, name: 'Unavoidable Accident', description: 'A target succeeding against Unfortunate Accident still takes half its damage but suffers no Jinx effect.' },
    { level: 11, name: 'Shared Misfortune', description: 'While shrouded, use your reaction before a creature within 30 feet makes an attack or check to impose disadvantage.' },
    { level: 15, name: 'Luck Twist', description: 'While shrouded, use your reaction before a creature within 30 feet makes an attack or save to grant advantage.' },
    { level: 20, name: 'Sovereign of Fate', description: 'Gain a special reaction on every other creature’s turn, usable only for Shared Misfortune or Luck Twist and not on a turn when you use your normal reaction.' },
  ] },
  'subclass-curse-of-possession': { name: 'Curse of Possession', description: 'Turn a hostile haunting into a partnership by sharing your body and power with a spirit that has unfinished business.', features: [
    { level: 1, name: 'Possession Ailments', description: 'Undead-detection effects perceive you as undead. In a cold climate or after recent cold damage, you have disadvantage on attacks and Strength-, Dexterity-, and Constitution-based checks.' },
    { level: 1, name: 'Spirit Companion', description: 'Create a Small or Medium 1-hit-point spirit with darkvision, Ethereal sight, incorporeal immunities, a 10-foot fly speed, AC 10 + curse modifier, and a Charisma-based 1d6 necrotic withering touch. It shares your initiative and proficiency bonus, retreats into you instead of taking damage, improves with your ASIs, and follows your commands.' },
    { level: 2, name: 'Possession Curse Spells', description: 'Learn catapult at level 2, spiritual weapon at 5, blink at 9, blight at 13, and cone of cold at 17 as Accursed spells included in Spells Known.' },
    { level: 3, name: 'Chill of the Afterlife and Apparition Alacrity', description: 'Once per turn, your or the spirit’s melee hit adds 1d6 cold damage, rising to 2d6 at level 11 and 3d6 at 17. Command it to Dash, Disengage, or Dodge as a bonus action.' },
    { level: 5, name: 'Body & Spirit', description: 'With your Attack action, command one spirit touch attack. You may cast spells from the spirit’s position.' },
    { level: 11, name: 'Wail of the Grave', description: 'Once per short or long rest, chosen hearing creatures within 30 feet make a Constitution save against 4d8 psychic damage, half on success. Affected creatures with hit points no greater than your Accursed level drop to 0. Undead, constructs, and fear-immune creatures are unaffected.' },
    { level: 15, name: 'Mutual Possession', description: 'Once per short or long rest, the spirit forces an adjacent humanoid to make a Charisma save or be possessed for 1 minute, retaining its mental traits while using the body’s other statistics. Resistance or release grants immunity until your next long rest.' },
    { level: 20, name: 'Spectral Champion', description: 'The spirit flies 30 feet and may possess any non-construct, non-undead creature indefinitely. Once per short or long rest, use your reaction when reduced to 0 or killed outright to recall it and return with 1 hit point.' },
  ] },
  'subclass-curse-of-the-armament': { name: 'Curse of the Armament', description: 'Embrace a cursed melee weapon that cannot leave you, then reshape it and feed it the magic of other weapons.', features: [
    { level: 1, name: 'Armament Ailments and Acolyte of Arms', description: 'You have disadvantage with weapons other than your curse weapon and cannot unattune from it. Gain martial melee proficiency and designate a non-heavy melee weapon that counts as magical against resistance and immunity; its curse transfers if destroyed.' },
    { level: 1, name: 'Clinging Curse', description: 'If the curse weapon moves more than 20 feet away, it reappears in your space. It gains thrown (20/60) and returns after every thrown attack.' },
    { level: 2, name: 'Armament Curse Spells', description: 'Learn wrathful smite at level 2, magic weapon at 5, elemental weapon at 9, staggering smite at 13, and steel wind strike at 17 as Accursed spells included in Spells Known.' },
    { level: 3, name: 'Blade Bond', description: 'Use the curse weapon as your spellcasting focus and reshape it into another melee weapon during a short or long rest.' },
    { level: 5, name: 'Extra Attack and Voracious Weapon', description: 'Attack twice with the Attack action. Feed one attuned magic melee weapon to the curse weapon, which gains its properties until it consumes another, attunement ends, or you make it regurgitate the item.' },
    { level: 11, name: 'Fighting Style', description: 'Choose Defense, Dueling, Great Weapon Fighting, Protection, or Throwing for your curse weapon, granting the listed AC, damage, reroll, interception, or ranged benefits.' },
    { level: 11, name: 'Reciprocal Relationship', description: 'After the curse weapon hits a creature or object, use your reaction to teleport beside it. Uses equal your curse ability modifier per long rest.' },
    { level: 15, name: 'Curse Combination', description: 'After taking the Attack or Cast a Spell action, make one curse-weapon attack as a bonus action.' },
    { level: 20, name: 'Bloodthirsty Blade and Ravenous Weapon', description: 'A critical hit or reduction to 0 grants another curse-weapon attack in the same action. The weapon may hold two consumed magic weapons at once, using only the higher of overlapping numerical bonuses.' },
  ] },
  'subclass-curse-of-vampirism': { name: 'Curse of Vampirism', description: 'Reclaim your will from vampirism while retaining predatory physiology and command over stolen life force.', features: [
    { level: 1, name: 'Vampirism Ailments', description: 'Direct sunlight hinders attacks and sight-based Perception. Healing that normally excludes undead restores only half as many hit points to you.' },
    { level: 1, name: 'Vampiric Physiology and Scion’s Education', description: 'Gain darkvision, necrotic resistance, no mirror reflection, and a Dexterity-compatible 1d6 bite. Gain longsword, rapier, and longbow proficiency plus one listed skill, tool, instrument, or language option.' },
    { level: 2, name: 'Vampirism Curse Spells', description: 'Learn charm person at level 2, spider climb at 5, gaseous form at 9, dominate beast at 13, and dominate person at 17 as Accursed spells included in Spells Known.' },
    { level: 3, name: 'Draining Bite', description: 'Against a grappled, willing, incapacitated, or restrained creature, add 1d6 necrotic bite damage, reduce its maximum hit points by that amount, and heal half. Damage becomes 2d6 at level 5, 3d6 at 11, and 4d6 at 17; undead and constructs are immune.' },
    { level: 3, name: 'Sanguine Glamour', description: 'Attempt to charm an adjacent, visible, nonhostile humanoid while concentrating, maintaining it with actions for up to 1 hour. Harm ends it; afterward the target recognizes the attempt and is immune until your next long rest.' },
    { level: 5, name: 'Vampiric Strike', description: 'A successful grapple during your Attack action permits a bite as part of it. An Attack action containing only non-bite attacks gains one additional non-bite attack.' },
    { level: 11, name: 'Crimson Strength', description: 'Gain advantage on Athletics checks to grapple and climb difficult surfaces, including ceilings, without a check.' },
    { level: 15, name: 'Caller of Beasts', description: 'Learn conjure animals. Once per long rest, cast it without a slot or concentration to summon only swarms of bats, swarms of rats, or wolves.' },
    { level: 20, name: 'Sanguine Ascension', description: 'Gain a fly speed equal to walking speed and heal half the necrotic damage dealt to non-undead, non-construct creatures. Sanguine Glamour can affect any adjacent non-construct, non-undead creature and last indefinitely.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false, versionNotes: 'Expanded from the matching owner-supplied Accursed specification.' }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-accursed"][0]{source, sourceBook, isHomebrew, hitDie, "subclassIds": subclasses[]._ref}`)
  const existingIds = ['subclass-curse-of-animation', 'subclass-curse-of-lycanthropy', 'subclass-curse-of-the-armament', 'subclass-curse-of-the-fiend'].sort().join(',')
  if (!current || current.source !== 'Unofficial' || current.sourceBook != null || current.isHomebrew || current.hitDie !== 10 || [...current.subclassIds].sort().join(',') !== existingIds) throw new Error(`Refusing to merge into an unexpected Accursed record: ${JSON.stringify(current)}`)

  let tx = client.transaction()
  const classRefs = coreFeatures.map((seed, index) => { const built = featureDocument('accursed', seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
  for (const [subclassId, affliction] of Object.entries(afflictions)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = affliction.features.map((seed, index) => { const built = featureDocument(owner, seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
    const document = { name: affliction.name, slug: { _type: 'slug', current: owner }, parentClassId: 'accursed', parentClass: ref('class-accursed', 'accursed'), description: affliction.description, features: featureRefs, source: 'Unofficial', edition: 'Both', rulesets: RULESETS, isHomebrew: false, isSpellcaster: false, versionNotes: 'Matching affliction progression restored from the owner-supplied Accursed specification.' }
    tx = current.subclassIds.includes(subclassId) ? tx.patch(subclassId, (patch) => patch.set(document).unset(['sourceBook'])) : tx.createOrReplace({ _id: subclassId, _type: 'subclass', version: 1, ...document } as any)
  }

  const subclassIds = ['subclass-curse-of-animation', ...Object.keys(afflictions), 'subclass-curse-of-the-fiend']
  tx = tx.patch('class-accursed', (patch) => patch.set({
    description: 'A person who has conquered a permanent magical curse and learned to channel its power while managing its lingering ailments. Accurseds may master their affliction through study, meditation, faith, bargaining, or sheer force of will.',
    hitDie: 10, primaryAbility: ['INT', 'WIS', 'CHA'], savingThrows: ['WIS', 'CHA'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'accursed-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor'] },
      { _type: 'proficiencyRule', _key: 'accursed-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Hand Crossbow', 'Simple Firearms', 'Magnum'] },
      { _type: 'proficiencyRule', _key: 'accursed-save-wis', type: 'savingThrow', mode: 'fixed', options: ['WIS'], description: 'Wisdom' },
      { _type: 'proficiencyRule', _key: 'accursed-save-choice', type: 'savingThrow', mode: 'choice', count: 1, options: ['INT', 'CHA'], description: 'Choose Intelligence or Charisma' },
      { _type: 'proficiencyRule', _key: 'accursed-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Arcana', 'Deception', 'Insight', 'Intimidation', 'Investigation', 'Yog-Sothothery', 'Survival'] },
    ],
    isSpellcaster: true, spellcaster: 'half', spellcastingAbility: 'CHA', spellLists: ['accursed'], features: classRefs, progression, subclassLevel: 1,
    subclasses: subclassIds.map((id) => ref(id, id.replace(/^subclass-/, ''))), source: 'Unofficial', edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Full matching Accursed chassis, half-caster table, core features, and five supplied Afflictions restored. Charisma is the structured fallback; Accursed Affliction permits Intelligence, Wisdom, or Charisma. Unique Animation and Fiend archive variants retained.',
  }).unset(['sourceBook', 'startingEquipment']))

  if (!APPLY) { console.log(`Dry run: ${coreFeatures.length} core features, ${Object.values(afflictions).flatMap((item) => item.features).length} supplied affliction features, 20 progression rows, and 2 unique archive afflictions retained.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const managedIds = Object.keys(afflictions)
  const audit = await client.fetch<any>(`*[_id == "class-accursed"][0]{source, sourceBook, isHomebrew, isSpellcaster, spellcaster, spellcastingAbility, hitDie, savingThrows, "featureCount": count(features), "progressionCount": count(progression), "subclassCount": count(subclasses), "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]), "managed": *[_id in [${managedIds.map((id) => `"${id}"`).join(',')}]] | order(_id asc) {_id, isHomebrew, "featureCount": count(features), "brokenRefs": count(features[!defined(@->._id)])}}`)
  if (audit.source !== 'Unofficial' || audit.sourceBook != null || audit.isHomebrew || !audit.isSpellcaster || audit.spellcaster !== 'half' || audit.spellcastingAbility !== 'CHA' || audit.hitDie !== 10 || audit.savingThrows.join(',') !== 'WIS,CHA' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.subclassCount !== 7 || audit.brokenRefs || audit.managed.length !== managedIds.length || audit.managed.some((item: any) => item.isHomebrew || item.featureCount !== afflictions[item._id].features.length || item.brokenRefs)) throw new Error(`Accursed merge audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
