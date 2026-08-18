import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')

const contentTypes = [
  'background', 'class', 'feat', 'feature', 'item', 'magicSchool', 'monster',
  'race', 'species', 'spell', 'subclass', 'trait', 'weaponMastery', 'weaponProperty',
]

type Candidate = {
  _id: string
  _type: string
  name?: string
  edition?: string
  legacyKey?: string
}

function inferredKeys(document: Candidate): string[] {
  if (document.legacyKey === 'srd-2014') return ['srd-2014']
  if (document.legacyKey === 'srd-2024') return ['srd-2024']
  if (document.edition === '2014') return ['srd-2014']
  if (document.edition === '2024') return ['srd-2024']
  if (document.edition === 'Both' || document.edition === '5e') return ['srd-2014', 'srd-2024']
  // Shared vocabulary predates the edition metadata. Schools and ordinary
  // weapon properties exist in both rulesets; Weapon Mastery is a 2024 rule.
  if (document._type === 'magicSchool' || document._type === 'weaponProperty') {
    return ['srd-2014', 'srd-2024']
  }
  if (document._type === 'weaponMastery') return ['srd-2024']
  return []
}

async function migrate() {
  const rulesets = await client.fetch<Array<{ _id: string; key: string }>>(
    '*[_type == "ruleset" && key.current in ["srd-2014", "srd-2024"]]{_id, "key": key.current}',
  )
  const references = new Map(rulesets.map(({ _id, key }) => [key, _id]))

  const definitions = [
    { key: 'srd-2014', name: 'D&D 5e (2014)', description: '2014 fifth-edition rules (SRD 5.1).' },
    { key: 'srd-2024', name: 'D&D 5e (2024)', description: '2024 revised fifth-edition rules (SRD 5.2).' },
  ]
  for (const definition of definitions) {
    if (references.has(definition.key)) continue
    const id = `ruleset.${definition.key}`
    console.log(`${APPLY ? 'Creating' : 'Would create'} missing ruleset: ${definition.name}`)
    if (APPLY) {
      await client.createIfNotExists({
        _id: id,
        _type: 'ruleset',
        name: definition.name,
        key: { _type: 'slug', current: definition.key },
        description: definition.description,
      })
    }
    references.set(definition.key, id)
  }

  const documents = await client.fetch<Candidate[]>(
    `*[_type in $types && !defined(rulesets[0])]{
      _id, _type, name, edition, "legacyKey": ruleset->key.current
    }`,
    { types: contentTypes },
  )

  const migratable = documents
    .map((document) => ({ document, keys: inferredKeys(document) }))
    .filter(({ keys }) => keys.length > 0)
  const ambiguous = documents.filter((document) => inferredKeys(document).length === 0)

  console.log(`${APPLY ? 'Applying' : 'Dry run:'} ${migratable.length} documents can receive Rulesets.`)
  console.log(`${ambiguous.length} documents need a manual Rulesets choice; they will not be changed.`)
  for (const document of ambiguous) {
    console.log(`MANUAL: ${document._type} ${document.name || document._id}`)
  }

  let transaction = client.transaction()
  let pending = 0
  for (const { document, keys } of migratable) {
    console.log(`${document._type} ${document.name || document._id}: ${keys.join(' + ')}`)
    if (!APPLY) continue

    transaction.patch(document._id, (patch) =>
      patch.setIfMissing({
        rulesets: keys.map((key) => ({
          _type: 'reference',
          _key: key,
          _ref: references.get(key)!,
        })),
      }),
    )
    pending += 1
    if (pending === 100) {
      await transaction.commit()
      transaction = client.transaction()
      pending = 0
    }
  }
  if (APPLY && pending > 0) await transaction.commit()

  if (!APPLY) console.log('No data was changed. Re-run with --apply after reviewing this list.')
  else console.log('Migration complete. No fields, documents, or image assets were removed.')
}

migrate().catch((error) => {
  console.error('Ruleset migration failed:', error)
  process.exit(1)
})
