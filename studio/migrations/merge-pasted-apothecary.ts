import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]
type ExistingFeature = { _key: string; _ref: string; level: number }
type FeatureSeed = { level: number; name: string; description: string }

// Reinforce the published Apothecary's medical identity without importing the
// supplied class's competing Studies, bombs, or pseudo-spell effects.
const additions: FeatureSeed[] = [
  {
    level: 1,
    name: 'Medical Savant',
    description: 'You need only half the normal time and gold to create a potion of healing of any rarity. Choose either the herbalism kit or Medicine; whenever you make a check with the chosen proficiency, double your proficiency bonus.',
  },
  {
    level: 2,
    name: 'Ranged Healer',
    description: 'As an action, throw any potion of healing at a creature within 15 feet (long range 30 feet), making a Dexterity-based ranged attack. On a hit, the creature regains hit points as though it consumed the potion. At 10th level, the range becomes 30/90 feet and every other creature within 5 feet of the target regains hit points equal to half the potion’s healing roll.',
  },
  {
    level: 6,
    name: 'Restorative Formulas',
    description: 'Spend 8 hours and 25 gp of materials to craft a restoration potion that ends one condition chosen when crafted: blinded, deafened, paralyzed, or stunned. At 11th level, you may add at least 50 gp of diamond dust to instead end petrification, reduce exhaustion by 1 for every 50 gp of dust added, or restore a creature’s hit point maximum.',
  },
  {
    level: 15,
    name: 'Superior Healing',
    description: 'When you spend the normal time and gold to create a potion of healing, double the number of healing dice it rolls. Static bonuses are unchanged; for example, 2d4 + 2 becomes 4d4 + 2.',
  },
  {
    level: 17,
    name: 'Regenerative Formula',
    description: 'Spend 750 gp and 3 workweeks to craft a potion of regeneration. For 1 minute after drinking it, a creature regains 5d8 + your Intelligence modifier hit points at the start of each turn. The potion also regenerates a missing body part no larger than an eye, hand, foot, one-quarter of an arm, or one-eighth of a leg.',
  },
  {
    level: 20,
    name: 'Ultimate Potions',
    description: 'Potions of healing and greater potions of healing you make restore the maximum possible result instead of rolling. The duration of every potion you make is doubled.',
  },
]

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

async function run() {
  const current = await client.fetch<{
    source: string
    sourceBook?: string
    isHomebrew: boolean
    isSpellcaster: boolean
    subclassIds: string[]
    features: ExistingFeature[]
  }>(`*[_id == "class-apothecary"][0]{
    source, sourceBook, isHomebrew, isSpellcaster,
    "subclassIds": subclasses[]._ref,
    "features": features[]{_key, _ref, "level": @->acquiredAtLevel}
  }`)

  if (!current || current.sourceBook !== "Sebastian Crowe's Guide to Drakkenheim" || current.isHomebrew || !current.isSpellcaster) {
    throw new Error(`Refusing to merge into an unexpected Apothecary record: ${JSON.stringify(current)}`)
  }

  let tx = client.transaction()
  const addedRefs = additions.map((seed, index) => {
    const slug = slugify(seed.name)
    const id = `feature-apothecary-supplement-${seed.level}-${slug}`
    tx = tx.createOrReplace({
      _id: id,
      _type: 'feature',
      name: seed.name,
      slug: { _type: 'slug', current: `apothecary-supplement-${seed.level}-${slug}` },
      acquiredAtLevel: seed.level,
      description: seed.description,
      rulesets: RULESETS,
      isHomebrew: true,
      versionNotes: 'Supplemental healing feature adapted from the Apothecary specification supplied by the archive owner.',
    } as any)
    return { _type: 'reference', _key: `supplement-${seed.level}-${index}-${slug}`, _ref: id, level: seed.level }
  })

  const retainedRefs = current.features
    .filter((feature) => !feature._ref.startsWith('feature-apothecary-supplement-'))
    .map((feature) => ({ _type: 'reference', _key: feature._key, _ref: feature._ref, level: feature.level }))
  const mergedRefs = [...retainedRefs, ...addedRefs]
    .sort((left, right) => left.level - right.level)
    .map(({ level: _level, ...reference }) => reference)

  tx = tx.patch('class-apothecary', (patch) => patch.set({
    features: mergedRefs,
    versionNotes: 'Retains the Sebastian Crowe’s Guide to Drakkenheim Apothecary and its four Occult Practices. Added six owner-supplied healing and potion-craft features without changing its chassis, spellcasting, source, or subclasses.',
  }))

  if (!APPLY) {
    console.log(`Dry run: retain ${retainedRefs.length} original features and add ${additions.length} complementary healing features.`)
    return
  }

  const result = await tx.commit({ visibility: 'sync' })
  const audit = await client.fetch<any>(`*[_id == "class-apothecary"][0]{
    source, sourceBook, isHomebrew, isSpellcaster,
    "featureCount": count(features),
    "supplementCount": count(features[@->_id match "feature-apothecary-supplement-*"]),
    "brokenRefs": count(features[!defined(@->._id)]),
    "subclassIds": subclasses[]._ref
  }`)
  const expectedSubclassIds = ['subclass-alienist', 'subclass-chemist', 'subclass-exorcist', 'subclass-pathogenist'].sort().join(',')
  if (audit.source !== 'Unofficial' || audit.sourceBook !== "Sebastian Crowe's Guide to Drakkenheim" || audit.isHomebrew || !audit.isSpellcaster || audit.featureCount !== retainedRefs.length + additions.length || audit.supplementCount !== additions.length || audit.brokenRefs || [...audit.subclassIds].sort().join(',') !== expectedSubclassIds) {
    throw new Error(`Apothecary additive-merge audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Applied ${result.results.length} mutations. Verification: ${JSON.stringify(audit)}`)
}

run().catch((error) => { console.error(error); process.exit(1) })
