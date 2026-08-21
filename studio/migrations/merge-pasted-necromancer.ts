import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
const ref = (id: string, key = id) => ({ _type: 'reference', _key: key, _ref: id })
type ExistingFeature = { _key: string; _ref: string; level: number }
type FeatureSeed = { level: number; name: string; description: string }

// The supplied Charisma/Occult Necromancer is distinct from Valda's
// Intelligence/Grave Ambition class. Only compatible mechanics are added, and
// the alternate Occults use unique IDs so they cannot overwrite Valda paths.
const additions: FeatureSeed[] = [
  { level: 3, name: 'Soul Harvest', description: 'At the end of your turn, if you or an undead under your control killed at least one creature during that turn, regain hit points equal to your Necromancer level. Healing beyond your hit point maximum becomes temporary hit points equal to the excess.' },
  { level: 5, name: 'Spontaneous Unburial', description: 'Learn animate dead without counting it against your spells known or prepared. You may cast it as an action and do not require a corpse or pile of bones; a skeleton or zombie claws up from the ground and begins acting on your next turn. The spell still requires an appropriate spell slot.' },
  { level: 7, name: 'Animate Major Undead', description: 'Once per long rest, animate the corpse of a Huge or smaller beast, humanoid, or monstrosity of CR 3 or lower. It retains its normal abilities and attacks but loses resistances, immunities, legendary actions, and special senses, then gains the immunities and vulnerabilities of a skeleton or zombie. Command it as animate dead and control only one major undead at a time. The CR limit becomes 6 at level 11 and 9 at level 15; at level 15 it lasts until reduced to 0 hit points. You may use this feature to renew control of an existing major undead.' },
  { level: 14, name: 'Ritualistic Unburial', description: 'You may cast animate dead as a ritual.' },
  { level: 18, name: 'Macabre', description: 'You cease aging and become immune to poison damage, disease, exhaustion, and the frightened and poisoned conditions. You have advantage on Charisma checks made when interacting with undead.' },
  { level: 20, name: 'Séance', description: 'As a bonus action, target an undead creature you can see within 30 feet. It makes a Wisdom save against your Necromancer spell save DC. On a failure, it obeys your commands for 24 hours or until you use Séance again.' },
  { level: 20, name: 'Grim Harvest (Variant Capstone)', description: 'Once per short or long rest when an enemy dies within 60 feet, use your reaction to make it erupt. Chosen creatures within 10 feet make Constitution saves, taking 8d6 necrotic damage on failure or half on success. If this kills a creature, trigger one secondary 4d6 eruption from a slain target; if that kills another, trigger one final 2d6 eruption that deals no damage on a successful save. Undead you control in an eruption heal for half the necrotic damage dealt. This is an optional replacement for Séance.' },
]

const occults: Record<string, { name: string; description: string; features: FeatureSeed[] }> = {
  'subclass-occult-keeper': { name: 'Occult of the Keeper', description: 'An anatomical scholar who studies death to delay it, heal terrible wounds, and refuse mortality when it becomes inconvenient.', features: [
    { level: 3, name: 'Life on Demand', description: 'Once per short or long rest as an action, a touched creature may spend Hit Dice up to your spellcasting modifier (minimum one) to heal. From Necromancer level 5 it adds Constitution to each die’s healing; from level 10 you may use this twice per rest.' },
    { level: 6, name: 'Expanded Intellect', description: 'Learn spare the dying. Add cure wounds, lesser restoration, beacon of hope, feign death, revivify, death ward, greater restoration, resurrection, and mass heal to the Necromancer spells available to you.' },
    { level: 10, name: 'Aura of Wellbeing', description: 'When an allied creature begins its turn within 10 feet of you while below half its hit point maximum, it regains hit points equal to your proficiency bonus.' },
    { level: 14, name: 'Refusal', description: 'Once per short or long rest, when you or a creature within 5 feet that you can touch drops to 0 hit points, use your reaction to leave it at 1 hit point instead.' },
  ] },
  'subclass-occult-reaper': { name: 'Occult of the Reaper', description: 'A wielder of raw negative energy who harvests souls for spells and embodies the draining presence of death itself.', features: [
    { level: 3, name: 'Death’s Knowledge', description: 'Add inflict wounds, revivify, speak with dead, commune with dead, raise dead, resurrection, and true resurrection to the Necromancer spells available to you. At Necromancer level 5, choose three spells from any class list and add them to your Necromancer options.' },
    { level: 6, name: 'Improved Soul Harvest', description: 'Store souls claimed through Soul Harvest up to your Necromancer level. Spend two souls per spell level to recover an expended slot of 3rd level or lower. When a spell damages a creature, spend any number of stored souls to add that much necrotic damage.' },
    { level: 10, name: 'Necrosis Spellcasting', description: 'Your necromancy spells deal an extra 1d8 necrotic damage. Undead have disadvantage on saves against your spells and class features.' },
    { level: 14, name: 'Grim', description: 'A 5-foot aura drains creatures ending their turns within it. They make a Constitution save or lose hit points equal to your currently stored souls; you regain half the hit points lost, rounded up.' },
  ] },
  'subclass-occult-undertaker': { name: 'Occult of the Undertaker', description: 'A professional corpse-handler whose fortified skeletons and zombies outlast and overpower ordinary summoned dead.', features: [
    { level: 3, name: 'Unholy Resistance', description: 'Gain resistance to necrotic damage and immunity to involuntary hit point maximum reduction. From Necromancer level 5, undead under your control gain the same benefits.' },
    { level: 6, name: 'Improved Animate Undead', description: 'Skeletons and zombies you raise add your proficiency bonus to their hit points and melee attack rolls. Whenever a spell, feature, or item raises undead, raise one additional skeleton or zombie.' },
    { level: 10, name: 'Undead Resolve', description: 'Undead under your control have advantage on Wisdom saves against Turn Undead, and undead you raise add your proficiency bonus to Armor Class.' },
    { level: 14, name: 'Lord of the Undead', description: 'Undead you control lose all damage vulnerabilities and gain additional hit points equal to your Necromancer level.' },
  ] },
  'subclass-occult-witch-doctor': { name: 'Occult of the Witch Doctor', description: 'A corpse-channeler who turns the dead into wells of negative energy, trading expendable minions for healing, control, and destructive auras.', features: [
    { level: 3, name: 'Spirit Wells', description: 'As an action, turn a touched corpse into a 10-foot-radius well for 1 minute; it can no longer be revived, animated, or reused. Know two wells, increasing to four at level 5, six at 11, and eight at 17; uses equal your spellcasting modifier (minimum one) per long rest. Blindness blinds chosen creatures inside. Darkness emanates darkness. Ruin reduces chosen creatures’ AC by 2. Protection grants allies +2 AC. Profane adds 1d10 necrotic to the first damage a creature takes in the well, scaling to 2d10 at level 5, 3d10 at 11, and 4d10 at 17. From level 5, Suffering damages chosen creatures by your spellcasting modifier at turn end and Silence blocks all sound and verbal spell components. From level 11, Blood heals allies by your modifier at turn end, Misfortune gives chosen creatures disadvantage on magical saves, and Fortitude gives allies advantage on magical saves.' },
    { level: 6, name: 'Bloodbag Army', description: 'As an action, destroy an undead you control within 30 feet and transfer its remaining life force to an ally within 30 feet. The ally regains hit points equal to the undead’s former hit points and gains advantage on its next save, attack, or check before its next turn ends.' },
    { level: 10, name: 'Life Leech and Walking Wells', description: 'Once per short or long rest as a bonus action, emit a 30-foot aura for 1 minute. Non-exempt creatures starting there make Constitution saves, taking 1d4 necrotic damage on failure while you heal by the damage dealt. You may also turn an undead you control into a mobile Spirit Well without destroying it; an undead can carry only one well.' },
    { level: 14, name: 'Necrotic Pulse', description: 'After a spell damages a creature, use a bonus action to deal another 1d6 + half your Necromancer level necrotic damage to it. Use this three times per short or long rest.' },
  ] },
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
function featureDocument(owner: string, seed: FeatureSeed, index: number, homebrew: boolean) {
  const id = `feature-${owner}-${seed.level}-${slugify(seed.name)}`
  return { document: { _id: id, _type: 'feature', name: seed.name, slug: { _type: 'slug', current: `${owner}-${seed.level}-${slugify(seed.name)}`.slice(0, 96) }, acquiredAtLevel: seed.level, description: seed.description, rulesets: RULESETS, isHomebrew: homebrew, versionNotes: 'Compatible mechanic adapted from the alternate Charisma-based Necromancer supplied by the archive owner.' }, reference: ref(id, `${seed.level}-${slugify(seed.name)}-${index}`) }
}

async function run() {
  const current = await client.fetch<any>(`*[_id == "class-necromancer"][0]{source, sourceBook, isHomebrew, isSpellcaster, spellcaster, spellcastingAbility, hitDie, "subclassIds": subclasses[]._ref, "features": features[]{_key, _ref, "level": @->acquiredAtLevel}}`)
  const existingIds = ['subclass-blood-ascendant', 'subclass-death-knight', 'subclass-overlord', 'subclass-pale-master', 'subclass-pharaoh', 'subclass-plague-lord', 'subclass-reanimator', 'subclass-reaper'].sort().join(',')
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== "Valda's Spire of Secrets" || current.isHomebrew || !current.isSpellcaster || current.spellcaster !== 'full' || current.spellcastingAbility !== 'INT' || current.hitDie !== 6 || [...current.subclassIds].sort().join(',') !== existingIds) throw new Error(`Refusing to merge into an unexpected Necromancer record: ${JSON.stringify(current)}`)

  let tx = client.transaction()
  const addedRefs = additions.map((seed, index) => {
    const built = featureDocument('necromancer-supplement', seed, index, true)
    tx = tx.createOrReplace(built.document as any)
    return { ...built.reference, level: seed.level }
  })
  const retainedRefs = (current.features as ExistingFeature[]).filter((item) => !item._ref.startsWith('feature-necromancer-supplement-')).map((item) => ({ _type: 'reference', _key: item._key, _ref: item._ref, level: item.level }))
  const classRefs = [...retainedRefs, ...addedRefs].sort((a, b) => a.level - b.level).map(({ level: _level, ...reference }) => reference)

  for (const [subclassId, occult] of Object.entries(occults)) {
    const owner = subclassId.replace(/^subclass-/, '')
    const featureRefs = occult.features.map((seed, index) => { const built = featureDocument(owner, seed, index, true); tx = tx.createOrReplace(built.document as any); return built.reference })
    tx = tx.createOrReplace({
      _id: subclassId, _type: 'subclass', version: 1, name: occult.name, slug: { _type: 'slug', current: owner },
      parentClassId: 'necromancer', parentClass: ref('class-necromancer', 'necromancer'), description: occult.description,
      features: featureRefs, source: 'Unofficial', sourceBook: 'Owner-supplied alternate Necromancer', edition: 'Both', rulesets: RULESETS,
      isHomebrew: true, isSpellcaster: false,
      versionNotes: 'Alternate level-2 Occult adapted to the live Valda Necromancer’s level-3 Grave Ambition entry without replacing any Valda subclass.',
    } as any)
  }
  const allSubclassIds = [...current.subclassIds, ...Object.keys(occults)]
  tx = tx.patch('class-necromancer', (patch) => patch.set({
    features: classRefs, subclasses: allSubclassIds.map((id: string) => ref(id, id.replace(/^subclass-/, ''))),
    versionNotes: 'Retains the Valda’s Spire Intelligence-based Necromancer and eight Grave Ambitions. Adds compatible death/animation features and four owner-supplied alternate Occults as protected homebrew adaptations.',
  }))

  if (!APPLY) { console.log(`Dry run: retain ${retainedRefs.length} Valda core features and 8 Grave Ambitions; add ${additions.length} supplemental features and ${Object.keys(occults).length} alternate Occults.`); return }
  const result = await tx.commit({ visibility: 'sync' })
  const occultIds = Object.keys(occults)
  const audit = await client.fetch<any>(`*[_id == "class-necromancer"][0]{sourceBook, isHomebrew, spellcaster, spellcastingAbility, "featureCount": count(features), "supplementCount": count(features[@->_id match "feature-necromancer-supplement-*"]), "subclassCount": count(subclasses), "brokenRefs": count(features[!defined(@->._id)]) + count(subclasses[!defined(@->._id)]), "occults": *[_id in [${occultIds.map((id) => `"${id}"`).join(',')}]] | order(_id asc) {_id, isHomebrew, "featureCount": count(features), "brokenRefs": count(features[!defined(@->._id)])}}`)
  if (audit.sourceBook !== "Valda's Spire of Secrets" || audit.isHomebrew || audit.spellcaster !== 'full' || audit.spellcastingAbility !== 'INT' || audit.featureCount !== retainedRefs.length + additions.length || audit.supplementCount !== additions.length || audit.subclassCount !== 12 || audit.brokenRefs || audit.occults.length !== 4 || audit.occults.some((item: any) => !item.isHomebrew || item.featureCount !== occults[item._id].features.length || item.brokenRefs)) throw new Error(`Necromancer additive-merge audit failed: ${JSON.stringify(audit)}`)
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
