import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
type ExistingFeature = { _key: string; _ref: string; level: number }
type FeatureSeed = { level: number; name: string; description: string }

// The supplied Adept uses D&D 3.5-era spellcasting, base attack bonuses, saves,
// familiars, and shapeshifting. Preserve the Esper Genesis psionic class and
// import only mechanics that can function without replacing its identity.
const additions: FeatureSeed[] = [
  {
    level: 1,
    name: 'Mystic Armor',
    description: 'While you are wearing no armor and wielding no shield, your Armor Class equals 10 + your Dexterity modifier + your Charisma modifier. You lose this benefit while incapacitated. If another feature gives you a different way to calculate your Armor Class, you choose which calculation to use; their benefits do not combine.',
  },
  {
    level: 3,
    name: 'Mystic Insight',
    description: 'Your psionic intuition reveals patterns that ordinary study overlooks. When you make an Intelligence (Arcana) check to identify or understand a psionic power, esper effect, or supernatural anomaly, you can use Charisma in place of Intelligence. In addition, once per long rest, after making an Arcana, History, Nature, or Religion check but before the outcome is determined, you can add your Charisma modifier to the roll.',
  },
]

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

async function run() {
  const current = await client.fetch<{
    source: string
    sourceBook?: string
    isHomebrew: boolean
    isSpellcaster: boolean
    primaryAbility: string[]
    savingThrows: string[]
    subclassIds: string[]
    features: ExistingFeature[]
  }>(`*[_id == "class-adept"][0]{
    source, sourceBook, isHomebrew, isSpellcaster, primaryAbility, savingThrows,
    "subclassIds": subclasses[]._ref,
    "features": features[]{_key, _ref, "level": @->acquiredAtLevel}
  }`)

  const expectedSubclassIds = ['subclass-animota', 'subclass-battlemind', 'subclass-dreamshaper'].sort().join(',')
  const abilities = [...(current?.primaryAbility ?? [])].sort().join(',')
  const saves = [...(current?.savingThrows ?? [])].sort().join(',')
  if (!current || current.source !== 'Unofficial' || current.sourceBook !== 'Esper Genesis Core Manual' || current.isHomebrew || current.isSpellcaster || abilities !== 'CHA,WIS' || saves !== 'CHA,WIS' || [...current.subclassIds].sort().join(',') !== expectedSubclassIds) {
    throw new Error(`Refusing to merge into an unexpected Adept record: ${JSON.stringify(current)}`)
  }

  let tx = client.transaction()
  const addedRefs = additions.map((seed, index) => {
    const slug = slugify(seed.name)
    const id = `feature-adept-supplement-${seed.level}-${slug}`
    tx = tx.createOrReplace({
      _id: id,
      _type: 'feature',
      name: seed.name,
      slug: { _type: 'slug', current: `adept-supplement-${seed.level}-${slug}` },
      acquiredAtLevel: seed.level,
      description: seed.description,
      rulesets: RULESETS,
      isHomebrew: true,
      versionNotes: 'Compatible psionic mechanic adapted from the alternate D&D 3.5-style Adept supplied by the archive owner.',
    } as any)
    return { _type: 'reference', _key: `supplement-${seed.level}-${index}-${slug}`, _ref: id, level: seed.level }
  })

  const retainedRefs = current.features
    .filter((feature) => !feature._ref.startsWith('feature-adept-supplement-'))
    .map((feature) => ({ _type: 'reference', _key: feature._key, _ref: feature._ref, level: feature.level }))
  const mergedRefs = [...retainedRefs, ...addedRefs]
    .sort((left, right) => left.level - right.level)
    .map(({ level: _level, ...reference }) => reference)

  tx = tx.patch('class-adept', (patch) => patch.set({
    features: mergedRefs,
    versionNotes: 'Retains the Esper Genesis Core Manual Adept, its psionic identity, and the Animota, Battlemind, and Dreamshaper paradigms. Added only the compatible owner-supplied Mystic Armor and Mystic Insight mechanics.',
  }))

  if (!APPLY) {
    console.log(`Dry run: retain ${retainedRefs.length} original features and add ${additions.length} compatible Adept features.`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-adept"][0]{
    source, sourceBook, isHomebrew, isSpellcaster, primaryAbility, savingThrows,
    "featureCount": count(features),
    "supplementCount": count(features[@->_id match "feature-adept-supplement-*"]),
    "brokenRefs": count(features[!defined(@->._id)]),
    "subclassIds": subclasses[]._ref
  }`)
  if (audit.source !== 'Unofficial' || audit.sourceBook !== 'Esper Genesis Core Manual' || audit.isHomebrew || audit.isSpellcaster || [...audit.primaryAbility].sort().join(',') !== 'CHA,WIS' || [...audit.savingThrows].sort().join(',') !== 'CHA,WIS' || audit.featureCount !== retainedRefs.length + additions.length || audit.supplementCount !== additions.length || audit.brokenRefs || [...audit.subclassIds].sort().join(',') !== expectedSubclassIds) {
    throw new Error(`Adept additive-merge audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
