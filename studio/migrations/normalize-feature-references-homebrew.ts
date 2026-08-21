import { getCliClient } from 'sanity/cli'

// Raw perspective is essential here: publish-blocking validation also includes drafts.
const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const BATCH_SIZE = 200
const OWNER_TYPES = ['class', 'subclass']
const SOURCED_CONTENT_TYPES = ['background', 'class', 'feat', 'item', 'monster', 'race', 'spell', 'subclass', 'trait']

type Reference = { _type: 'reference'; _key: string; _ref: string }
type InlineFeature = {
  _type?: string
  _key?: string
  name?: string
  description?: string
  level?: number
  acquiredAtLevel?: number
}
type Owner = {
  _id: string
  _type: 'class' | 'subclass'
  name: string
  source: string
  rulesets: Reference[]
  ruleset?: Omit<Reference, '_key'>
  features: Array<Reference | InlineFeature>
}
type SourcedDocument = { _id: string; source: string; isHomebrew?: boolean }
type FeatureDocument = { _id: string; isHomebrew?: boolean }

const isReference = (entry: Reference | InlineFeature): entry is Reference =>
  entry?._type === 'reference' && typeof (entry as Reference)._ref === 'string'

const idPart = (value: string) => value
  .toLowerCase()
  .replace(/^drafts\./, '')
  .replace(/[^a-z0-9_-]+/g, '-')
  .replace(/(^-|-$)/g, '')

const slugPart = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

async function commit(tx: ReturnType<typeof client.transaction>, mutations: number) {
  if (APPLY && mutations > 0) await tx.commit({ visibility: 'sync' })
}

async function migrateInlineFeatures(owners: Owner[]) {
  let tx = client.transaction()
  let mutations = 0
  let created = 0
  let patchedOwners = 0

  for (const owner of owners) {
    const inlineCount = owner.features.filter((entry) => !isReference(entry)).length
    if (!inlineCount) continue

    // Keep every owner conversion atomic: feature documents and their references are
    // committed together, so Studio never sees a half-migrated progression track.
    if (mutations > 0 && mutations + inlineCount + 1 > BATCH_SIZE) {
      await commit(tx, mutations)
      tx = client.transaction()
      mutations = 0
    }

    const refs = owner.features.map((entry, index): Reference => {
      if (isReference(entry)) return entry
      const level = entry.acquiredAtLevel ?? entry.level
      if (!entry.name || !entry.description || !level) {
        throw new Error(`${owner._id} has an incomplete inline feature at index ${index}`)
      }
      const key = entry._key || `legacy-${index}`
      const featureId = `feature-${idPart(owner._id)}-${idPart(key)}`
      tx = tx.createOrReplace({
        _id: featureId,
        _type: 'feature',
        name: entry.name,
        slug: { _type: 'slug', current: `${slugPart(owner.name)}-${slugPart(entry.name)}-${index + 1}`.slice(0, 96) },
        description: entry.description,
        acquiredAtLevel: level,
        rulesets: owner.rulesets,
        ruleset: owner.ruleset,
        isHomebrew: owner.source === 'Homebrew',
        versionNotes: `Migrated losslessly from the legacy inline ${owner._type} progression on ${owner.name}.`,
      } as any)
      mutations += 1
      created += 1
      return { _type: 'reference', _key: key, _ref: featureId }
    })

    tx = tx.patch(owner._id, (patch) => patch.set({ features: refs }))
    mutations += 1
    patchedOwners += 1
  }

  await commit(tx, mutations)
  return { created, patchedOwners }
}

async function normalizeHomebrewFlags(sourceDocs: SourcedDocument[], featureDocs: FeatureDocument[]) {
  const patches = [
    ...sourceDocs
      .map((doc) => ({ _id: doc._id, expected: doc.source === 'Homebrew', actual: doc.isHomebrew }))
      .filter(({ expected, actual }) => actual !== expected),
    ...featureDocs
      .map((doc) => ({ _id: doc._id, expected: doc.isHomebrew === true, actual: doc.isHomebrew }))
      .filter(({ actual }) => actual === undefined),
  ]

  let applied = 0
  for (let start = 0; start < patches.length; start += BATCH_SIZE) {
    let tx = client.transaction()
    const batch = patches.slice(start, start + BATCH_SIZE)
    for (const { _id, expected } of batch) {
      tx = tx.patch(_id, (patch) => patch.set({ isHomebrew: expected }))
    }
    await commit(tx, batch.length)
    applied += batch.length
  }
  return applied
}

async function audit() {
  return client.fetch<{
    inlineFeatures: number
    brokenFeatureReferences: number
    missingFeatureFields: number
    missingHomebrewFlags: number
    incorrectHomebrewFlags: number
  }>(`{
    "inlineFeatures": count(*[_type in $ownerTypes].features[_type != "reference"]),
    "brokenFeatureReferences": count(*[_type in $ownerTypes].features[_type == "reference" && !defined(@->._id)]),
    "missingFeatureFields": count(*[_type == "feature" && (!defined(name) || name == "" || !defined(description) || description == "" || !defined(acquiredAtLevel) || count(rulesets) == 0)]),
    "missingHomebrewFlags": count(*[_type in $contentTypes && !defined(isHomebrew)]),
    "incorrectHomebrewFlags": count(*[_type in $sourcedTypes && ((source == "Homebrew" && isHomebrew != true) || (source != "Homebrew" && isHomebrew != false))])
  }`, {
    ownerTypes: OWNER_TYPES,
    contentTypes: [...SOURCED_CONTENT_TYPES, 'feature'],
    sourcedTypes: SOURCED_CONTENT_TYPES,
  })
}

async function run() {
  const [owners, sourceDocs, featureDocs] = await Promise.all([
    client.fetch<Owner[]>('*[_type in $types]{_id, _type, name, source, rulesets, ruleset, features}', { types: OWNER_TYPES }),
    client.fetch<SourcedDocument[]>('*[_type in $types]{_id, source, isHomebrew}', { types: SOURCED_CONTENT_TYPES }),
    client.fetch<FeatureDocument[]>('*[_type == "feature"]{_id, isHomebrew}'),
  ])
  const inlineFeatures = owners.reduce((sum, owner) => sum + owner.features.filter((entry) => !isReference(entry)).length, 0)
  const ownersToPatch = owners.filter((owner) => owner.features.some((entry) => !isReference(entry))).length
  const homebrewPatches = sourceDocs.filter((doc) => doc.isHomebrew !== (doc.source === 'Homebrew')).length
    + featureDocs.filter((doc) => doc.isHomebrew === undefined).length

  if (!APPLY) {
    console.log(`Dry run: ${inlineFeatures} inline features on ${ownersToPatch} owners; ${homebrewPatches} existing homebrew flags to normalize.`)
    return
  }

  const featureResult = await migrateInlineFeatures(owners)
  const flagPatches = await normalizeHomebrewFlags(sourceDocs, featureDocs)
  const result = await audit()
  if (Object.values(result).some((count) => count !== 0)) {
    throw new Error(`Post-migration audit failed: ${JSON.stringify(result)}`)
  }
  console.log(`Created ${featureResult.created} feature documents, converted ${featureResult.patchedOwners} progression tracks, and normalized ${flagPatches} existing homebrew flags.`)
  console.log(`Verification: ${JSON.stringify(result)}`)
}

run().catch((error) => {
  console.error('Feature/homebrew normalization failed:', error)
  process.exit(1)
})
