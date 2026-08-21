import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type FeatureSeed = { level: number; name: string; description: string }

const progressionRows: Array<[number, number, string, string[]]> = [
  [1, 2, '1st', ['Expertise', 'Ritualist']], [2, 2, '1st', ['Myths and Legends', 'Rushed Incantation']],
  [3, 2, '2nd', ['Occult Specialization']], [4, 2, '2nd', ['Ability Score Improvement']],
  [5, 3, '3rd', ['Exploit Weakness']], [6, 3, '3rd', ['Expertise', 'Occult Specialization feature']],
  [7, 3, '4th', ['Opportunistic Piety']], [8, 3, '4th', ['Ability Score Improvement']],
  [9, 4, '5th', ['Supernatural Resolve']], [10, 4, '5th', ['Occult Specialization feature']],
  [11, 4, '6th', ['Finisher']], [12, 4, '6th', ['Ability Score Improvement']],
  [13, 5, '6th', ['Enigma Arcane']], [14, 5, '6th', ['Occult Specialization feature']],
  [15, 5, '6th', ['Enigma Arcane improvement']], [16, 5, '6th', ['Ability Score Improvement']],
  [17, 6, '6th', ['Enigma Arcane improvement']], [18, 6, '6th', ['Exorcist']],
  [19, 6, '6th', ['Ability Score Improvement']], [20, 6, '6th', ['Spellbinder']],
]
const progression = progressionRows.map(([level, proficiencyBonus, ritualLevel, featureNames]) => ({
  _type: 'classProgressionRow', _key: `investigator-level-${level}`, level, proficiencyBonus,
  resources: [{ _type: 'object', _key: 'ritual-level', name: 'Ritual Level', value: ritualLevel }], featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Expertise', description: 'Choose two skill proficiencies and double your proficiency bonus for checks using them. At Investigator level 6, choose two more proficiencies for this benefit.' },
  { level: 1, name: 'Ritualist', description: 'Your grimoire begins with four 1st-level ritual spells chosen from any class lists. You can cast its spells only as rituals unless another feature permits otherwise. Each Investigator level adds one eligible spell from the Investigator Rituals list for free; found rituals on that list can be transcribed in 2 hours and for 50 GP per spell level. The Ritual Level table limits additions. Investigator bonus rituals count as having the ritual tag. Intelligence is your spellcasting ability and the grimoire is required unless a feature says otherwise.' },
  { level: 2, name: 'Myths and Legends', description: 'You have advantage on Intelligence checks made to research creatures, spells, and ancient or secret lore.' },
  { level: 2, name: 'Rushed Incantation', description: 'Perform a grimoire ritual with a normal casting time of 1 action as a bonus action. Components worth no more than 100 GP are waived. Uses equal your Intelligence modifier (minimum one), plus one additional use at levels 5, 9, 13, and 17; all uses return after a long rest.' },
  { level: 3, name: 'Occult Specialization', description: 'Choose Antiquarian, Archivist, Detective, Exterminator, Inquisitor, Medium, Occultist, or Spy. It grants features at Investigator levels 3, 6, 10, and 14.' },
  { level: 3, name: 'Trinkets', description: 'Your specialization grants supernatural trinket options. After using a trinket, you cannot use another until a short or long rest. You gain a second use at level 5, a third at level 11, and a fourth at level 17.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 5, name: 'Exploit Weakness', description: 'Once on each of your turns when a weapon attack hits, treat the creature as vulnerable to that weapon damage. Double only the weapon dice and ability modifier, not damage from spells or other features. That attack and all other attacks against the creature until your next turn count as magical for bypassing resistance and immunity.' },
  { level: 7, name: 'Opportunistic Piety', description: 'Once per short or long rest, choose one effect. Banish casts banishment without a slot and deals radiant damage equal to your level when a fey, fiend, or undead fails. Miracle Healing restores twice your Investigator level in hit points to a touched willing non-undead, non-construct. Warding marks a nearby creature for 1 minute so aberrations, celestials, fey, fiends, and undead take 1d12 radiant damage when touching it or hitting it in melee.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 9, name: 'Supernatural Resolve', description: 'You cannot be possessed or charmed, and you gain resistance to psychic and necrotic damage.' },
  { level: 11, name: 'Finisher', description: 'When you take the Attack action and hit with a weapon, deal an extra 2d8 damage. If the target is below half its hit point maximum, deal 4d8 instead.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 13, name: 'Enigma Arcane', description: 'Once per long rest, cast one of mirage arcane, plane shift, reverse gravity, sequester, or teleport without a slot. At level 15, separately cast one of antimagic field, glibness, maze, or mind blank once per long rest. At level 17, separately cast astral projection, gate, or weird once per long rest.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 18, name: 'Exorcist', description: 'Cast protection from evil and good without a spell slot or spell components.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 20, name: 'Spellbinder', description: 'Choose five grimoire rituals with a normal casting time of 1 action. Cast them as bonus actions without using Rushed Incantation or holding your grimoire, and waive components worth no more than 100 GP.' },
]

const specializations: Record<string, { name: string; description: string; isSpellcaster?: boolean; features: FeatureSeed[] }> = {
  'subclass-antiquarian': { name: 'Antiquarian', description: 'A collector and historian whose magical trinkets, relics, and artifacts provide a tool for every supernatural threat.', features: [
    { level: 3, name: 'Artifact Historian', description: 'Add identify to your grimoire and never require material components to cast it.' },
    { level: 3, name: 'Antiquarian Trinkets', description: 'Hateful Arrowhead casts scorching ray or ray of enfeeblement; Mirrored Prism casts self-only blur or mirror image; Razortooth Bandages casts cure wounds or inflict wounds at the class table’s Ritual Level. Each is cast once without slots or components through your Trinkets feature.' },
    { level: 6, name: 'Relics', description: 'Once per short or long rest, use one relic: Antediluvian Dynamo casts fireball or lightning bolt; Lich’s Deathmask casts counterspell or dispel magic; Mortal Coil casts animate dead or revivify, with prior undead servants collapsing when animate dead is used again.' },
    { level: 10, name: 'Magic Item Collection', description: 'Keep one chosen item in an extradimensional vault, changing it after a long rest: carpet of flying, cloak of the bat, flame tongue, gauntlets of ogre power, instant fortress, ring of regeneration, ring of telekinesis, sun blade, or wand of wonder.' },
    { level: 14, name: 'Phylactery', description: 'Your always-attuned phylactery does not count against attunement and has 5 charges, regaining 1d4 + 1 at dawn. Spend 1 for 2nd-level false life or to regain a Trinket use, 2 as a reaction to remain at 1 hit point, or 3 for a melee spell attack dealing 5d6 necrotic and healing you by the damage dealt.' },
  ] },
  'subclass-archivist': { name: 'Archivist', description: 'An academic master who replaces piles of occult trinkets with encyclopedic research, specialized theses, and exact magical recall.', features: [
    { level: 3, name: 'Archaic Scroll', description: 'Perform one ritual with Rushed Incantation without expending one of that feature’s uses; recharge follows the class Trinkets feature.' },
    { level: 3, name: 'Thesis', description: 'Choose Corpus, Ignis, Mortis, or Regis. Corpus grants jump/longstrider, alter self/heat metal, gaseous form/meld into stone. Ignis grants burning hands/shatter, gust of wind/scorching ray, call lightning/wind wall. Mortis grants bane/false life, blindness-deafness/darkness, revivify/vampiric touch. Regis grants charm person/hideous laughter, enthrall/suggestion, dispel magic/hypnotic pattern. Spells enter your grimoire as their tiers become available and may be cast as an action by spending Rushed Incantation.' },
    { level: 6, name: 'Erudite Spell', description: 'When your spell forces a saving throw, impose disadvantage on one target’s first save. Recharge after a short or long rest.' },
    { level: 10, name: 'Encyclopedic Expertise', description: 'Automatically identify recorded spells as they are cast, investigated magical effects, their responsible magic items, or the monsters that produced them. Utterly unique or unrecorded phenomena remain unidentified.' },
    { level: 14, name: 'Eidetic Memory', description: 'Copy any ritual you witness into your grimoire. Once per long rest, within 1 minute of seeing a spell of 5th level or lower with a 1-action casting time and no expensive components, spend a Rushed Incantation use and your action to duplicate it without a slot.' },
  ] },
  'subclass-detective': { name: 'Detective', description: 'A master of clues, conspiracies, interrogation, and predictive deduction who insists every mystery has an explanation.', features: [
    { level: 3, name: 'Investigator’s Hunch', description: 'After at least 10 minutes examining documents and arranging clues, make an Intelligence check with advantage.' },
    { level: 3, name: 'Detective Trinkets', description: 'Glass Medallion casts self-only invisibility, Fogstone Periapt casts misty step, and Skeleton’s Key casts knock. Each is a bonus action without slots or components through Trinkets.' },
    { level: 6, name: 'Predictive Intuition', description: 'As a bonus action, examine a visible creature within 30 feet. Add 1d4 to your next attack against it before your next turn, or subtract 1d4 from its next attack against you in that period.' },
    { level: 10, name: 'Interrogator’s Instinct', description: 'When you hear a creature speak, detect whether it is charmed, possessed, or enchanted to speak unwillingly. You have advantage on checks to identify a lie.' },
    { level: 14, name: 'Power of Deduction', description: 'As an action, study a visible creature within 30 feet. For 1 minute, gain advantage on Intelligence and Charisma checks involving it and on attacks against it. Recharge after a short or long rest.' },
  ] },
  'subclass-exterminator': { name: 'Exterminator', description: 'A relentless monster slayer trained to destroy aberrations, fiends, undead, lycanthropes, and every other creature stalking the night.', features: [
    { level: 3, name: 'Bonus Proficiencies', description: 'Gain proficiency with martial weapons and medium armor.' },
    { level: 3, name: 'Exterminator Trinkets', description: 'Consecrated Whetstone casts magic weapon as a bonus action; Gilded Dragon Scale grants resistance to one chosen damage type for 1 minute as a bonus action; Wyverntooth Necklace adds 2d6 acid damage after a melee hit as a bonus action. Uses follow Trinkets.' },
    { level: 6, name: 'Monster Slayer', description: 'After taking the Attack action, make one weapon attack as a bonus action. Uses equal your Intelligence modifier (minimum one) per short or long rest.' },
    { level: 10, name: 'Silvered Edge', description: 'A creature damaged by your weapon cannot regain hit points until your next turn. A creature you reduce to 0 cannot rise as undead or return to life for 7 days.' },
    { level: 14, name: 'Killer Instinct', description: 'Use Exploit Weakness twice on your turn, but no more than once against the same target.' },
  ] },
  'subclass-inquisitor': { name: 'Inquisitor', description: 'A sanctioned hunter of heresy and demons who wields divine tools without allowing conventional righteousness to impede the mission.', features: [
    { level: 3, name: 'Inquisitor Training', description: 'Gain medium armor proficiency and Religion proficiency; double your proficiency bonus on Religion checks.' },
    { level: 3, name: 'Inquisitor Trinkets', description: 'Alabaster Balm casts lesser restoration as a bonus action. Hallowed Chalice creates a flask of holy water lasting 24 hours and holds five uses. Reliquary of Doubt casts detect thoughts as a bonus action but senses only thoughts linked to negative emotions. Uses follow Trinkets except the chalice’s stated charges.' },
    { level: 6, name: 'Divine Strike', description: 'Once per turn when a weapon attack hits, deal an extra 1d6 radiant damage.' },
    { level: 10, name: 'Rote Piety', description: 'Use Opportunistic Piety three times, regaining all uses after a short or long rest.' },
    { level: 14, name: 'Excommunication', description: 'Once per long rest as an action, a visible creature within 60 feet makes your choice of Constitution or Wisdom save. On failure it is marked for 1 minute, cannot regain hit points or gain advantage on attacks or checks, and takes 2d6 radiant damage whenever it takes an action.' },
  ] },
  'subclass-medium': { name: 'Medium', description: 'A conduit between living and dead who uses foretellings, séances, and divinations to draw investigative clues from beyond mortality.', features: [
    { level: 3, name: 'Foretelling', description: 'After a long rest, roll and record two d20s. Before an attack, save, or check by a visible creature, replace it with one recorded result, at most once per turn. Spend a Rushed Incantation use and an action for another roll, holding at most three. Unused rolls vanish after your next long rest.' },
    { level: 3, name: 'Medium Trinkets', description: 'Dead Ringer casts speak with dead as an action for one question. Heptagonal Spectacles casts see invisibility as a bonus action. Lucent Mirror phases you for up to 1 minute, granting movement through creatures and objects and resistance to all damage until you take damage. Uses follow Trinkets.' },
    { level: 6, name: 'Forewarning Presence', description: 'Reroll one attack roll or ability check and use the new result. Recharge after a short or long rest.' },
    { level: 10, name: 'Whispers from Beyond', description: 'Once per long rest, receive a one-word GM hint about your best action, a fruitful investigation, or another useful direction.' },
    { level: 14, name: 'Third Eye', description: 'Once per long rest, cast true seeing as a bonus action without a slot or components.' },
  ] },
  'subclass-occultist': { name: 'Occultist', description: 'A magical specialist who fights vampires, demons, lycanthropes, and aberrations by borrowing the forbidden power of warlocks.', isSpellcaster: true, features: [
    { level: 3, name: 'Rune Keeper Eyeglass', description: 'As a bonus action, read all writing for 1 hour. Recharge follows Trinkets.' },
    { level: 3, name: 'Pact Magic', description: 'Use Intelligence for Warlock spells. At level 3 learn two cantrips, two 1st-level spells, and gain one 1st-level slot. Slots become two at level 5 and recover after a short or long rest. Slot level becomes 2nd at level 7, 3rd at 13, and 4th at 19. Gain a third cantrip at level 10; spells known rise to 3 at level 5, 4 at 7, 5 at 9, 6 at 11, 7 at 13, 8 at 16, 9 at 17, 10 at 19, and 11 at 20.' },
    { level: 6, name: 'Eldritch Ruin', description: 'When using Exploit Weakness, cast a cantrip as a bonus action instead of dealing the feature’s additional damage.' },
    { level: 10, name: 'Eyes of Another World', description: 'See invisible and Ethereal creatures and objects, perceive the original form of shapechangers and magically altered creatures, and immediately detect possession.' },
    { level: 14, name: 'Maleficium', description: 'Once per short or long rest when using Exploit Weakness, cast bestow curse on the target as a bonus action without a slot or components; it has disadvantage on its save.' },
  ] },
  'subclass-spy': { name: 'Spy', description: 'An expert in infiltration, disguise, deception, sabotage, and sudden violence who extracts secrets before anyone suspects danger.', features: [
    { level: 3, name: 'Bravado', description: 'Gain Deception proficiency and double your proficiency bonus on Deception checks.' },
    { level: 3, name: 'Spy Trinkets', description: 'Glass Dust makes you invisible until your next turn or until damaged. Horn-Rimmed Glasses casts disguise self. Martini Glass casts charm person. Each activates as a bonus action without slots or components through Trinkets.' },
    { level: 6, name: 'Cloak and Dagger', description: 'When attacking a surprised creature or one that has not yet acted in combat, maximize the weapon’s damage die.' },
    { level: 10, name: 'Shaken Not Stirred', description: 'Once per long rest, reroll a failed Deception or Persuasion check and use the new result.' },
    { level: 14, name: 'Body Double', description: 'Once per long rest when you reduce a humanoid to 0 hit points, or as an action touching a humanoid corpse dead no longer than 1 day, assume its appearance as disguise self and make its corpse, blood, clothing, and other evidence invisible for 8 hours.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false, versionNotes: 'Restored from the matching Valda’s Spire Investigator specification supplied by the archive owner.' }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-investigator"][0]{source, sourceBook, isHomebrew, hitDie, "subclassIds": subclasses[]._ref}`)
  const expectedIds = Object.keys(specializations).sort().join(',')
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew || current.hitDie !== 8 || [...current.subclassIds].sort().join(',') !== expectedIds) throw new Error(`Refusing to merge into an unexpected Investigator record: ${JSON.stringify(current)}`)

  let tx = client.transaction()
  const classRefs = coreFeatures.map((seed, index) => { const built = featureDocument('investigator', seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
  for (const [subclassId, specialization] of Object.entries(specializations)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = specialization.features.map((seed, index) => { const built = featureDocument(owner, seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
    tx = tx.patch(subclassId, (patch) => patch.set({
      name: specialization.name, slug: { _type: 'slug', current: owner }, parentClassId: 'investigator', parentClass: ref('class-investigator', 'investigator'),
      description: specialization.description, features: featureRefs, source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS,
      isHomebrew: false, isSpellcaster: Boolean(specialization.isSpellcaster),
      ...(specialization.isSpellcaster ? { magicType: 'Pact Magic (Warlock List)', magicAbility: 'Intelligence', magicDescription: 'Intelligence-based Pact Magic with slots restored after a short or long rest.' } : {}),
      versionNotes: 'Generic placeholder mechanics replaced with the matching supplied Occult Specialization progression.',
    }).unset(specialization.isSpellcaster ? [] : ['magicType', 'magicAbility', 'magicDescription', 'spells']))
  }

  tx = tx.patch('class-investigator', (patch) => patch.set({
    description: 'A supernatural detective and monster slayer who investigates occult threats, compiles forbidden rituals in a grimoire, and uses specialized trinkets, deduction, magic, and violence to contain malevolent outsiders.',
    hitDie: 8, primaryAbility: ['INT', 'DEX'], savingThrows: ['DEX', 'INT'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'investigator-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor'] },
      { _type: 'proficiencyRule', _key: 'investigator-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Hand Crossbow', 'Heavy Crossbow', 'Longsword', 'Rapier', 'Shortsword'] },
      { _type: 'proficiencyRule', _key: 'investigator-tools', type: 'tool', mode: 'choice', count: 1, toolOptions: ['Dice set', 'Dragonchess set', 'Playing card set', 'Three-Dragon Ante set'], description: 'Choose one gaming set' },
      { _type: 'proficiencyRule', _key: 'investigator-skills', type: 'skill', mode: 'choice', count: 3, skillOptions: ['Arcana', 'Athletics', 'Deception', 'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Persuasion', 'Stealth', 'Sleight of Hand', 'Religion'] },
    ],
    startingEquipment: ['Leather armor', 'A dagger and either a longsword or rapier', 'A heavy crossbow and 20 bolts or a hand crossbow and 20 bolts', 'A dungeoneer’s pack or one kit you are proficient with', 'A grimoire and material component pouch'],
    isSpellcaster: true, spellcaster: 'special', spellcastingAbility: 'INT', spellLists: ['investigator'],
    features: classRefs, progression, subclassLevel: 3, subclasses: Object.keys(specializations).map((id) => ref(id, id.replace(/^subclass-/, ''))),
    source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Full matching ritualist chassis, Ritual Level table, core features, and all eight supplied Occult Specializations restored.',
  }).unset(['spells']))

  if (!APPLY) { console.log(`Dry run: ${coreFeatures.length} core features, ${Object.values(specializations).flatMap((item) => item.features).length} specialization features, and ${progression.length} progression rows ready.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const ids = Object.keys(specializations)
  const audit = await client.fetch<any>(`*[_id == "class-investigator"][0]{sourceBook, isHomebrew, isSpellcaster, spellcaster, spellcastingAbility, hitDie, primaryAbility, savingThrows, "featureCount": count(features), "progressionCount": count(progression), "subclassCount": count(subclasses), "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]), "ritualLevels": progression[].resources[name == "Ritual Level"][0].value, "specializations": *[_id in [${ids.map((id) => `"${id}"`).join(',')}]] | order(_id asc) {_id, isHomebrew, isSpellcaster, "featureCount": count(features), "brokenRefs": count(features[!defined(@->._id)])}}`)
  if (audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || !audit.isSpellcaster || audit.spellcaster !== 'special' || audit.spellcastingAbility !== 'INT' || audit.hitDie !== 8 || audit.primaryAbility.join(',') !== 'INT,DEX' || audit.savingThrows.join(',') !== 'DEX,INT' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.subclassCount !== 8 || audit.brokenRefs || audit.ritualLevels.join(',') !== progressionRows.map((row) => row[2]).join(',') || audit.specializations.length !== 8 || audit.specializations.some((item: any) => item.isHomebrew || item.featureCount !== specializations[item._id].features.length || item.brokenRefs || item.isSpellcaster !== Boolean(specializations[item._id].isSpellcaster))) throw new Error(`Investigator audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
