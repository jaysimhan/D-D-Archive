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
  [1, 2, '—', '—', ['Mortal Burden', 'Ordained Death']], [2, 2, '1st', '2', ['Spellcasting', 'Sainted Reprisal', 'Mark of the Herald']],
  [3, 2, '1st', '3', ['Divine Healing', 'Torment']], [4, 2, '1st', '3', ['Ability Score Improvement']],
  [5, 3, '2nd', '6', ['Extra Attack']], [6, 3, '2nd', '6', ['Mortal Burden feature']],
  [7, 3, '2nd', '7', ['Respite']], [8, 3, '2nd', '7', ['Ability Score Improvement']],
  [9, 4, '3rd', '9', ['—']], [10, 4, '3rd', '9', ['Undying Conviction']],
  [11, 4, '3rd', '10', ['Torment improvement']], [12, 4, '3rd', '10', ['Ability Score Improvement']],
  [13, 5, '4th', '11', ['—']], [14, 5, '4th', '11', ['Mortal Burden feature']],
  [15, 5, '4th', '12', ['March Unto Destiny']], [16, 5, '4th', '12', ['Ability Score Improvement']],
  [17, 6, '5th', '14', ['—']], [18, 6, '5th', '14', ['Mortal Burden feature']],
  [19, 6, '5th', '15', ['Ability Score Improvement']], [20, 6, '5th', '15', ['Final Martyrdom']],
]
const progression = progressionRows.map(([level, proficiencyBonus, maxSpellLevel, spellUses, featureNames]) => ({
  _type: 'classProgressionRow', _key: `martyr-level-${level}`, level, proficiencyBonus,
  resources: [
    { _type: 'object', _key: 'max-spell-level', name: 'Max Spell Level', value: maxSpellLevel },
    { _type: 'object', _key: 'spell-uses', name: 'Spell Uses', value: spellUses },
  ], featureNames,
}))

const coreFeatures: FeatureSeed[] = [
  { level: 1, name: 'Mortal Burden', description: 'Choose the Burden of Atonement, Discord, the End, Mercy, Rebirth, Revolution, Truth, or Tyranny. Your Burden grants features at levels 1, 6, 14, and 18 and always-prepared Burden spells at its listed levels.' },
  { level: 1, name: 'Ordained Death', description: 'You must accumulate five failed death saves to die. A spell whose sole effect returns you to life, but not undeath, requires no material components when cast on you.' },
  { level: 2, name: 'Spellcasting', description: 'Create spell slots by losing hit points: 5 for 1st level, 10 for 2nd, 20 for 3rd, 30 for 4th, and 45 for 5th. This loss cannot be reduced, avoided, or trigger concentration saves. Casting also expends one Spell Use from the class table; uses return after a long rest. Prepare Wisdom modifier + half your Martyr level spells, minimum one, up to the maximum spell level shown. Burden spells are always prepared. You cannot regain hit points from your own spells. Wisdom is your spellcasting ability and a holy symbol is your focus.' },
  { level: 2, name: 'Mark of the Herald', description: 'Your divine cause manifests as a visible mark or stigmata. You have advantage on checks made to convince creatures to assist your holy cause.' },
  { level: 2, name: 'Sainted Reprisal', description: 'When a visible creature within 5 feet hits you with a melee attack, use your reaction to deal 1d6 necrotic or radiant damage. Damage becomes 2d6 at level 5, 3d6 at 11, and 4d6 at 17.' },
  { level: 3, name: 'Divine Healing', description: 'As an action, spend up to your proficiency bonus in Hit Dice and regain hit points as though finishing a short rest.' },
  { level: 3, name: 'Torment', description: 'Once per turn when your melee weapon attack hits, lose 5 hit points to deal 10 additional necrotic or radiant damage. At level 11, you may lose 10 hit points for 20 additional damage. This loss cannot be reduced and does not trigger concentration saves.' },
  { level: 4, name: 'Ability Score Improvement', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 5, name: 'Extra Attack', description: 'Attack twice instead of once whenever you take the Attack action.' },
  { level: 7, name: 'Respite', description: 'Regain all spent Hit Dice after a long rest instead of half.' },
  { level: 8, name: 'Ability Score Improvement (8th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 10, name: 'Undying Conviction', description: 'Once per long rest, when reduced to 0 hit points without being killed outright, remain at 1 hit point instead.' },
  { level: 12, name: 'Ability Score Improvement (12th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 15, name: 'March Unto Destiny', description: 'You no longer need to eat or drink and cannot be paralyzed, petrified, or stunned.' },
  { level: 16, name: 'Ability Score Improvement (16th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 19, name: 'Ability Score Improvement (19th Level)', description: 'Increase one ability by 2 or two abilities by 1, to a maximum of 20.' },
  { level: 20, name: 'Final Martyrdom', description: 'As an action, become immune to all damage for 10 minutes; you cannot be blinded, charmed, deafened, exhausted, frightened, incapacitated, poisoned, restrained, or unconscious, and have advantage on all checks, attacks, and saves. During this time cast wish once without a slot or hit-point cost, ignoring its non-duplication Strength loss and necrotic stress. When the duration ends you die, preventable only by divine intervention, and cannot return to life.' },
]

const burdens: Record<string, { name: string; description: string; features: FeatureSeed[] }> = {
  'subclass-burden-of-atonement': { name: 'Burden of Atonement', description: 'Given an undeserved second chance, you must undo your past evils and seek redemption before your final sacrifice.', features: [
    { level: 1, name: 'Atonement Burden Spells', description: 'Always prepare cure wounds and sanctuary at level 3; calm emotions and lesser restoration at 5; remove curse and speak with dead at 9; death ward and fire shield at 13; greater restoration and mass cure wounds at 17.' },
    { level: 1, name: 'Bonus Proficiencies and Self-Sacrifice', description: 'Gain heavy armor proficiency. Once per short or long rest, when a visible creature attacks another target within 5 feet of you, use your reaction to make yourself the target instead.' },
    { level: 6, name: 'Blooded Reprieve', description: 'When Torment helps reduce a hostile creature to 0 hit points, lose no hit points from Torment.' },
    { level: 14, name: 'Draw Aggression', description: 'As a bonus action until your next turn, chosen hostile creatures within 5 feet that see you have disadvantage against creatures other than you and advantage against you.' },
    { level: 18, name: 'Sin Eater', description: 'As an action, transfer from willing creatures within 60 feet to yourself one effect each: exhaustion, disease or poison, a curse and cursed-item attunement, ability-score reduction, hit-point-maximum reduction, or blinded, charmed, deafened, paralyzed, petrified, or poisoned. Each retains its original duration and treats you as the original target.' },
  ] },
  'subclass-burden-of-discord': { name: 'Burden of Discord', description: 'Chosen to disrupt the status quo, you sow chaos, destruction, and strife according to a capricious divine design.', features: [
    { level: 1, name: 'Discord Burden Spells', description: 'Always prepare hideous laughter and inflict wounds at level 3; knock and shatter at 5; lightning bolt and stinking cloud at 9; confusion and polymorph at 13; animate objects and passwall at 17.' },
    { level: 1, name: 'Discord Cantrips and Havoc!', description: 'Learn shocking grasp, thaumaturgy, and one Cleric cantrip using Wisdom without hit-point cost. Once per short or long rest after a melee hit, roll d10: swap places; both take 3d6 lightning; compel the target to voice thoughts; cast darkness on it; become briefly invisible; ignite it for recurring 1d4 fire; reduce its AC by 3 for a turn; knock it prone; cause a distant 20-foot explosion for 8d6 fire; or roll twice.' },
    { level: 6, name: 'Blooded Reprieve', description: 'When Torment helps reduce a hostile creature to 0 hit points, lose no hit points from Torment.' },
    { level: 14, name: 'Coin of Chaos', description: 'When a visible creature makes an attack, check, or save, flip your coin for +4 on heads or +1 on tails. The GM then holds it and may use it on an NPC or monster roll before returning it. You regain the coin after a long rest.' },
    { level: 18, name: 'Pandemonium', description: 'Use Havoc! whenever you make an attack roll or cast a spell targeting a hostile creature, without resting between uses.' },
  ] },
  'subclass-burden-of-the-end': { name: 'Burden of the End', description: 'Forewarned of a great cataclysm, you wield ancient prophetic magic and sacrifice yourself to forestall the apocalypse.', features: [
    { level: 1, name: 'End Burden Spells', description: 'Always prepare guiding bolt and protection from evil and good at level 3; blindness-deafness and darkness at 5; call lightning and counterspell at 9; blight and control water at 13; flame strike and insect plague at 17.' },
    { level: 1, name: 'End Cantrips and Herald of the End', description: 'Learn sacred flame, thaumaturgy, and one Cleric cantrip using Wisdom without hit-point cost. Once per short or long rest when a Martyr spell deals damage, reroll all its damage dice and keep the new rolls.' },
    { level: 6, name: 'Sacrosanct Spell', description: 'When casting at its lowest level a spell with a casting time of at least 1 minute or whose sole effect restores hit points, lose no hit points, though it still consumes a Spell Use.' },
    { level: 14, name: 'Embrace the Inevitable', description: 'Once per turn when a Martyr spell of 1st level or higher calls for a save, lose additional hit points equal to half its casting cost to impose disadvantage on the target’s first save.' },
    { level: 18, name: 'Halt Apocalypse', description: 'Once per long rest at the end of your turn, immediately take another turn.' },
  ] },
  'subclass-burden-of-mercy': { name: 'Burden of Mercy', description: 'You bear the suffering of the world to heal the sick, drive out possession, and offer hope in the darkest times.', features: [
    { level: 1, name: 'Mercy Burden Spells', description: 'Always prepare healing word and sanctuary at level 3; enhance ability and lesser restoration at 5; remove curse and revivify at 9; death ward and freedom of movement at 13; mass healing word and raise dead at 17.' },
    { level: 1, name: 'Mercy Cantrips and Balm', description: 'Learn spare the dying, thaumaturgy, and one Cleric cantrip using Wisdom without hit-point cost. Once per short or long rest as a bonus action, restore 1 hit point to a creature within 60 feet or remove blinded, deafened, or poisoned from a willing touched creature.' },
    { level: 6, name: 'Sacrosanct Spell', description: 'When casting at its lowest level a spell with a casting time of at least 1 minute or whose sole effect restores hit points, lose no hit points, though it still consumes a Spell Use.' },
    { level: 14, name: 'Shared Respite', description: 'When Divine Healing spends Hit Dice, one willing creature within 60 feet also heals by the highest Hit Die result + your Constitution modifier.' },
    { level: 18, name: 'Anointed Healer', description: 'Whenever you restore a creature’s hit points, add your Martyr level. Each creature can receive this extra healing once per your long rest.' },
  ] },
  'subclass-burden-of-rebirth': { name: 'Burden of Rebirth', description: 'You protect devastated wild places and surrender your life so nature can regenerate what war, industry, or catastrophe destroyed.', features: [
    { level: 1, name: 'Rebirth Burden Spells', description: 'Always prepare entangle and goodberry at level 3; pass without trace and spike growth at 5; plant growth and speak with plants at 9; conjure woodland beings and hallucinatory terrain at 13; awaken and reincarnate at 17.' },
    { level: 1, name: 'Rebirth Cantrips and Friend of the Forest', description: 'Learn druidcraft, shillelagh, and one Druid cantrip using Wisdom without hit-point cost. Once per short or long rest, cast speak with animals without hit-point loss and gain advantage on Charisma checks against beasts for its duration.' },
    { level: 6, name: 'Sacrosanct Spell', description: 'When casting at its lowest level a spell with a casting time of at least 1 minute or whose sole effect restores hit points, lose no hit points, though it still consumes a Spell Use.' },
    { level: 14, name: 'Verdant Resilience', description: 'Once per short or long rest as a bonus action, regenerate for 1 minute: immediately and at each turn’s start regain your Wisdom modifier in hit points and resist bludgeoning, piercing, and slashing damage, but cannot cast Martyr spells. End it early as a bonus action.' },
    { level: 18, name: 'Turn of the Wheel', description: 'Once per long rest, cast reincarnate without materials or hit-point loss, choose the resulting race, and optionally target yourself. If you die without Final Martyrdom, return after 24 hours as if reincarnated, choosing your race; this self-return recharges after 100 days.' },
  ] },
  'subclass-burden-of-revolution': { name: 'Burden of Revolution', description: 'Called to overthrow tyrants and liberate the oppressed, you lead rebellion with sword, divine resolve, and an unyielding banner.', features: [
    { level: 1, name: 'Revolution Burden Spells', description: 'Always prepare command and heroism at level 3; hold person and magic weapon at 5; haste and pillar of salt at 9; stoneskin and wall of fire at 13; hold monster and telepathic bond at 17.' },
    { level: 1, name: 'Bonus Proficiencies and Bulwark of Rebellion', description: 'Gain heavy armor proficiency. Once per short or long rest as a bonus action, gain temporary hit points equal to 1d10 + your Martyr level for 1 hour.' },
    { level: 6, name: 'Blooded Reprieve', description: 'When Torment helps reduce a hostile creature to 0 hit points, lose no hit points from Torment.' },
    { level: 14, name: 'Unyielding Banner', description: 'You and friendly creatures within 10 feet add your Wisdom modifier to Initiative and are immune to being charmed or frightened.' },
    { level: 18, name: 'Kingslayer', description: 'When you reduce a hostile creature to 0 hit points, either end all its spells and effects; frighten lower-CR allied creatures within 120 feet on a failed Wisdom save for 1 minute; or use a bonus action to move 15 feet and make another melee attack.' },
  ] },
  'subclass-burden-of-truth': { name: 'Burden of Truth', description: 'A divine prophet charged with exposing deception, revealing terrible truths, and winning hearts away from corrupt influences.', features: [
    { level: 1, name: 'Truth Burden Spells', description: 'Always prepare charm person and identify at level 3; augury and detect thoughts at 5; sending and speak with dead at 9; divination and freedom of movement at 13; legend lore and scrying at 17.' },
    { level: 1, name: 'Moral Erudition and Maxim of Truth', description: 'Use Wisdom instead of Charisma on Persuasion checks, and others naturally sense when you speak truthfully. Once per short or long rest as a bonus action, cast a self-centered, 5-foot-radius zone of truth for 1 minute using your Martyr save DC.' },
    { level: 6, name: 'Sacrosanct Spell', description: 'When casting at its lowest level a spell with a casting time of at least 1 minute or whose sole effect restores hit points, lose no hit points, though it still consumes a Spell Use.' },
    { level: 14, name: 'Foretold Escape', description: 'When a visible attacker rolls against you, use your reaction to impose disadvantage.' },
    { level: 18, name: 'Eyes of Prophecy', description: 'Once per long rest, replace one of your attack rolls, ability checks, or saving throws with a 20.' },
  ] },
  'subclass-burden-of-tyranny': { name: 'Burden of Tyranny', description: 'Sent by malevolent gods to conquer kingdoms and spread misery, you demand bloodshed, obedience, and absolute fealty.', features: [
    { level: 1, name: 'Tyranny Burden Spells', description: 'Always prepare bane and command at level 3; find steed and hold person at 5; bestow curse and fear at 9; banishment and dominate beast at 13; dominate person and geas at 17.' },
    { level: 1, name: 'Bonus Proficiencies and Diabolic Ultimatum', description: 'Gain heavy armor proficiency. Once per short or long rest, a creature within 60 feet that sees you makes a Wisdom save; on failure it chooses to be charmed or frightened by you for up to 1 minute, repeating the save at each turn’s end.' },
    { level: 6, name: 'Blooded Reprieve', description: 'When Torment helps reduce a hostile creature to 0 hit points, lose no hit points from Torment.' },
    { level: 14, name: 'Crush Resistance', description: 'Once per turn after a melee hit, gain 1d8 temporary hit points. If that hit reduces a charmed or allied humanoid to 0, gain 3d8 instead. These temporary hit points last 1 minute.' },
    { level: 18, name: 'Totalitarian', description: 'Once per long rest, cast dominate person without hit-point loss or a Spell Use. Whenever you cast it, the target has disadvantage on its save and does not repeat the save when damaged.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: false, versionNotes: 'Restored from the matching Valda’s Spire Martyr PDF supplied by the archive owner.' }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-martyr"][0]{source, sourceBook, isHomebrew, hitDie, "subclassIds": subclasses[]._ref}`)
  const existingIds = ['subclass-burden-of-atonement', 'subclass-burden-of-discord', 'subclass-burden-of-mercy', 'subclass-burden-of-revolution', 'subclass-burden-of-truth', 'subclass-burden-of-tyranny'].sort().join(',')
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew || current.hitDie !== 12 || [...current.subclassIds].sort().join(',') !== existingIds) throw new Error(`Refusing to merge into an unexpected Martyr record: ${JSON.stringify(current)}`)

  let tx = client.transaction()
  const classRefs = coreFeatures.map((seed, index) => { const built = featureDocument('martyr', seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
  for (const [subclassId, burden] of Object.entries(burdens)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = burden.features.map((seed, index) => { const built = featureDocument(owner, seed, index); tx = tx.createOrReplace(built.document as any); return built.reference })
    const document = { name: burden.name, slug: { _type: 'slug', current: owner }, parentClassId: 'martyr', parentClass: ref('class-martyr', 'martyr'), description: burden.description, features: featureRefs, source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false, isSpellcaster: false, versionNotes: 'Generic placeholder mechanics replaced with the matching Mortal Burden progression from the supplied PDF.' }
    tx = current.subclassIds.includes(subclassId) ? tx.patch(subclassId, (patch) => patch.set(document)) : tx.createOrReplace({ _id: subclassId, _type: 'subclass', version: 1, ...document } as any)
  }

  tx = tx.patch('class-martyr', (patch) => patch.set({
    description: 'A divine champion predestined to die for a great cause. A Martyr turns mortal suffering into spellcasting power, divine reprisal, healing, and devastating attacks while marching inexorably toward a final glorious sacrifice.',
    hitDie: 12, primaryAbility: ['CON', 'WIS'], savingThrows: ['STR', 'WIS'],
    proficiencies: [
      { _type: 'proficiencyRule', _key: 'martyr-armor', type: 'armor', mode: 'fixed', armorOptions: ['Light Armor', 'Medium Armor', 'Shields'] },
      { _type: 'proficiencyRule', _key: 'martyr-weapons', type: 'weapon', mode: 'fixed', weaponOptions: ['Simple Weapons', 'Martial Weapons'] },
      { _type: 'proficiencyRule', _key: 'martyr-skills', type: 'skill', mode: 'choice', count: 2, skillOptions: ['Athletics', 'History', 'Insight', 'Intimidation', 'Medicine', 'Persuasion', 'Religion'] },
    ],
    startingEquipment: ['A martial weapon and shield or two martial weapons', 'Scale mail or chain mail if proficient', 'A light crossbow and 20 bolts or any simple weapon', 'A priest’s pack or explorer’s pack', 'A holy symbol'],
    isSpellcaster: true, spellcaster: 'half', spellcastingAbility: 'WIS', spellLists: ['martyr'], features: classRefs, progression, subclassLevel: 1,
    subclasses: Object.keys(burdens).map((id) => ref(id, id.replace(/^subclass-/, ''))), source: 'Unofficial', sourceBook: "Valda's Spire of Secrets", edition: 'Both', rulesets: RULESETS, isHomebrew: false,
    versionNotes: 'Full matching Martyr chassis, hit-point spellcasting, Spell Uses table, core features, and all eight Mortal Burdens restored from the supplied PDF.',
  }).unset(['spells']))

  if (!APPLY) { console.log(`Dry run: ${coreFeatures.length} core features, ${Object.values(burdens).flatMap((item) => item.features).length} Burden features, ${progression.length} progression rows, and 2 missing Burdens ready.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const ids = Object.keys(burdens)
  const audit = await client.fetch<any>(`*[_id == "class-martyr"][0]{sourceBook, isHomebrew, isSpellcaster, spellcaster, spellcastingAbility, hitDie, primaryAbility, savingThrows, "featureCount": count(features), "progressionCount": count(progression), "subclassCount": count(subclasses), "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]), "spellUses": progression[].resources[name == "Spell Uses"][0].value, "burdens": *[_id in [${ids.map((id) => `"${id}"`).join(',')}]] | order(_id asc) {_id, isHomebrew, "featureCount": count(features), "brokenRefs": count(features[!defined(@->._id)])}}`)
  if (audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || !audit.isSpellcaster || audit.spellcaster !== 'half' || audit.spellcastingAbility !== 'WIS' || audit.hitDie !== 12 || audit.primaryAbility.join(',') !== 'CON,WIS' || audit.savingThrows.join(',') !== 'STR,WIS' || audit.featureCount !== coreFeatures.length || audit.progressionCount !== 20 || audit.subclassCount !== 8 || audit.brokenRefs || audit.spellUses.join(',') !== progressionRows.map((row) => row[3]).join(',') || audit.burdens.length !== 8 || audit.burdens.some((item: any) => item.isHomebrew || item.featureCount !== burdens[item._id].features.length || item.brokenRefs)) throw new Error(`Martyr audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
