import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
type ExistingFeature = { _key: string; _ref: string; level: number }
type FeatureSeed = { level: number; name: string; description: string }

// The supplied Blood Mage is a different homebrew design. Only its compatible
// core cost-and-consequence loop is added to the Haigo Dungeoncrafts class.
const additions: FeatureSeed[] = [
  {
    level: 1,
    name: 'Blood Magic: Vital Cost',
    description: 'When you cast a Blood Mage spell of 1st level or higher, you may fuel it with your own vitality. The hit point cost is 4 for a 1st-level spell, 8 for 2nd, 12 for 3rd, 16 for 4th, 20 for 5th, 25 for 6th, 30 for 7th, 35 for 8th, and 40 for 9th. This loss comes from your actual hit points and ignores temporary hit points and wards. You cannot cast this way if the cost would reduce you to 0 hit points. A spell of 6th level or higher can be cast through this feature only once per spell level, with each expended level becoming available again after a long rest. This feature uses the class’s existing Constitution-based spellcasting and does not replace Arcane Blood Mass.',
  },
  {
    level: 1,
    name: 'Corruption',
    description: 'Whenever Blood Magic: Vital Cost spends your hit points, gain Corruption equal to half the hit points spent, rounded down, to a maximum equal to your hit point maximum. Magical healing first removes an equal amount of Corruption; only excess healing restores hit points. Remove all Corruption after a long rest or 2d10 Corruption after a short rest. An effect that removes a curse removes 5d10 Corruption. Nonmagical healing and healing granted by Blood Mage spells or class features bypass Corruption and restore hit points normally.',
  },
]

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

async function run() {
  const current = await client.fetch<{
    source: string
    sourceBook?: string
    isHomebrew: boolean
    isSpellcaster: boolean
    spellcastingAbility: string
    subclassIds: string[]
    features: ExistingFeature[]
  }>(`*[_id == "class-blood-mage"][0]{
    source, sourceBook, isHomebrew, isSpellcaster, spellcastingAbility,
    "subclassIds": subclasses[]._ref,
    "features": features[]{_key, _ref, "level": @->acquiredAtLevel}
  }`)

  const expectedSubclassIds = ['subclass-haemomancer', 'subclass-sacrificial-preserver', 'subclass-sanguine-supplementer'].sort().join(',')
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== 'Haigo Dungeoncrafts' || current.isHomebrew || !current.isSpellcaster || current.spellcastingAbility !== 'CON' || [...current.subclassIds].sort().join(',') !== expectedSubclassIds) {
    throw new Error(`Refusing to merge into an unexpected Blood Mage record: ${JSON.stringify(current)}`)
  }

  let tx = client.transaction()
  const addedRefs = additions.map((seed, index) => {
    const slug = slugify(seed.name)
    const id = `feature-blood-mage-supplement-${seed.level}-${slug}`
    tx = tx.createOrReplace({
      _id: id,
      _type: 'feature',
      name: seed.name,
      slug: { _type: 'slug', current: `blood-mage-supplement-${seed.level}-${slug}`.slice(0, 96) },
      acquiredAtLevel: seed.level,
      description: seed.description,
      rulesets: RULESETS,
      isHomebrew: true,
      versionNotes: 'Compatible cost-and-corruption mechanic adapted from the alternate Blood Mage supplied by the archive owner.',
    } as any)
    return { _type: 'reference', _key: `supplement-${seed.level}-${index}-${slug}`, _ref: id, level: seed.level }
  })

  const retainedRefs = current.features
    .filter((feature) => !feature._ref.startsWith('feature-blood-mage-supplement-'))
    .map((feature) => ({ _type: 'reference', _key: feature._key, _ref: feature._ref, level: feature.level }))
  const mergedRefs = [...retainedRefs, ...addedRefs]
    .sort((left, right) => left.level - right.level)
    .map(({ level: _level, ...reference }) => reference)

  tx = tx.patch('class-blood-mage', (patch) => patch.set({
    features: mergedRefs,
    versionNotes: 'Retains the Haigo Dungeoncrafts Blood Mage, Constitution spellcasting, and its three original subclasses. Added only the compatible owner-supplied vital-cost and Corruption mechanics.',
  }))

  if (!APPLY) {
    console.log(`Dry run: retain ${retainedRefs.length} original features and add ${additions.length} compatible Blood Mage features.`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-blood-mage"][0]{
    source, sourceBook, isHomebrew, isSpellcaster, spellcastingAbility,
    "featureCount": count(features),
    "supplementCount": count(features[@->_id match "feature-blood-mage-supplement-*"]),
    "brokenRefs": count(features[!defined(@->._id)]),
    "subclassIds": subclasses[]._ref
  }`)
  if (audit.source !== 'Unofficial' || audit.sourceBook !== 'Haigo Dungeoncrafts' || audit.isHomebrew || !audit.isSpellcaster || audit.spellcastingAbility !== 'CON' || audit.featureCount !== retainedRefs.length + additions.length || audit.supplementCount !== additions.length || audit.brokenRefs || [...audit.subclassIds].sort().join(',') !== expectedSubclassIds) {
    throw new Error(`Blood Mage additive-merge audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
