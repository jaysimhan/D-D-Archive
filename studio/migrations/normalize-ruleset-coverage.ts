import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-21' }).withConfig({ perspective: 'raw' })
const APPLY = process.argv.includes('--apply')
const BATCH_SIZE = 200

const CONTENT_TYPES = [
  'background', 'class', 'feat', 'feature', 'item', 'magicSchool', 'monster',
  'race', 'spell', 'species', 'subclass', 'trait', 'weaponMastery', 'weaponProperty',
]
const BOTH_RULESETS = [
  { _type: 'reference', _key: 'srd-2014', _ref: 'ruleset.srd-2014' },
  { _type: 'reference', _key: 'srd-2024', _ref: '86642d23-c52d-4577-adc1-214aab0f43e9' },
]

type Document = {
  _id: string
  rulesets?: Array<{ _ref?: string }>
  ruleset?: { _ref?: string }
  edition?: string
}

const hasBoth = (rulesets?: Array<{ _ref?: string }>) => {
  const ids = new Set((rulesets || []).map(({ _ref }) => _ref))
  return ids.size === 2 && BOTH_RULESETS.every(({ _ref }) => ids.has(_ref))
}

async function run() {
  const documents = await client.fetch<Document[]>(
    '*[_type in $types]{_id, rulesets, ruleset, edition}',
    { types: CONTENT_TYPES },
  )
  const changes = documents.filter((doc) => !hasBoth(doc.rulesets) || doc.ruleset || (doc.edition && doc.edition !== 'Both'))
  console.log(`Ruleset normalization: ${documents.length} content documents scanned; ${changes.length} require updates.`)
  if (!APPLY) return console.log('Dry run complete; add --apply to commit.')

  for (let start = 0; start < changes.length; start += BATCH_SIZE) {
    let tx = client.transaction()
    for (const doc of changes.slice(start, start + BATCH_SIZE)) {
      tx = tx.patch(doc._id, (patch) => {
        const set: Record<string, unknown> = { rulesets: BOTH_RULESETS }
        if (doc.edition) set.edition = 'Both'
        return patch.set(set).unset(['ruleset'])
      })
    }
    await tx.commit({ visibility: 'sync' })
  }

  const audit = await client.fetch<{
    total: number
    notBoth: number
    singular: number
    nonBothEdition: number
    brokenReferences: number
  }>(`{
    "total": count(*[_type in $types]),
    "notBoth": count(*[_type in $types && count(rulesets) != 2]),
    "singular": count(*[_type in $types && defined(ruleset)]),
    "nonBothEdition": count(*[_type in $types && defined(edition) && edition != "Both"]),
    "brokenReferences": count(*[_type in $types].rulesets[!defined(@->._id)])
  }`, { types: CONTENT_TYPES })
  if (audit.notBoth || audit.singular || audit.nonBothEdition || audit.brokenReferences) {
    throw new Error(`Ruleset normalization audit failed: ${JSON.stringify(audit)}`)
  }
  console.log(`Ruleset normalization complete: ${JSON.stringify(audit)}`)
}

run().catch((error) => {
  console.error('Ruleset normalization failed:', error)
  process.exit(1)
})
