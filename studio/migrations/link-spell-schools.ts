import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')

const SCHOOL_DEFINITIONS = [
  ['Abjuration', 'Protective magic that wards, negates, and banishes.'],
  ['Conjuration', 'Magic that summons, creates, and transports creatures or objects.'],
  ['Divination', 'Magic that reveals information, hidden knowledge, and possible futures.'],
  ['Enchantment', 'Magic that influences minds, emotions, and behavior.'],
  ['Evocation', 'Magic that creates and controls energy and elemental forces.'],
  ['Illusion', 'Magic that deceives the senses and disguises reality.'],
  ['Necromancy', 'Magic that manipulates life force, death, and undeath.'],
  ['Transmutation', 'Magic that changes the properties of creatures, objects, or matter.'],
] as const

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

async function run() {
  const rulesets = await client.fetch<Array<{ _id: string; key: string }>>(
    '*[_type == "ruleset" && key.current in ["srd-2014", "srd-2024"]]{_id, "key": key.current}',
  )
  const rulesetRefs = rulesets.map(({ _id, key }) => ({ _type: 'reference', _key: key, _ref: _id }))
  if (rulesetRefs.length !== 2) throw new Error('Both srd-2014 and srd-2024 ruleset documents are required.')

  const existingSchools = await client.fetch<Array<{ _id: string; name: string }>>(
    '*[_type == "magicSchool"]{_id, name}',
  )
  const schoolIds = new Map(existingSchools.map(({ _id, name }) => [name.toLowerCase(), _id]))

  for (const [name, description] of SCHOOL_DEFINITIONS) {
    const key = name.toLowerCase()
    if (schoolIds.has(key)) continue
    const id = `magicSchool.${slugify(name)}`
    console.log(`${APPLY ? 'Creating' : 'Would create'} school: ${name}`)
    if (APPLY) {
      await client.createIfNotExists({
        _id: id,
        _type: 'magicSchool',
        name,
        slug: { _type: 'slug', current: slugify(name) },
        description,
        rulesets: rulesetRefs,
      })
    }
    schoolIds.set(key, id)
  }

  const spells = await client.fetch<Array<{ _id: string; name: string; school: string }>>(
    '*[_type == "spell" && defined(school) && school._type != "reference"]{_id, name, school}',
  )
  const unknown = spells.filter(({ school }) => !schoolIds.has(school.toLowerCase()))
  if (unknown.length) {
    throw new Error(`Unknown school names: ${Array.from(new Set(unknown.map(({ school }) => school))).join(', ')}`)
  }
  console.log(`${APPLY ? 'Linking' : 'Would link'} ${spells.length} spells to school documents.`)

  let transaction = client.transaction()
  let pending = 0
  for (const spell of spells) {
    transaction.patch(spell._id, (patch) => patch
      .setIfMissing({ legacySchoolName: spell.school })
      .set({ school: { _type: 'reference', _ref: schoolIds.get(spell.school.toLowerCase())! } }))
    pending += 1
    if (pending === 100) {
      if (APPLY) await transaction.commit()
      transaction = client.transaction()
      pending = 0
    }
  }
  if (APPLY && pending > 0) await transaction.commit()

  const grantDocuments = await client.fetch<Array<{
    _id: string
    _type: string
    name?: string
    grants: Array<{
      _key: string
      grantType?: string
      schoolRestriction?: { _ref?: string }
      schoolRestrictions?: Array<{ _ref?: string }>
    }>
  }>>(
    '*[_type in ["feat", "species", "class", "item"] && count(grants[grantType == "Spell Slot"]) > 0]{_id, _type, name, grants}',
  )

  let migratedGrants = 0
  for (const document of grantDocuments) {
    const nextGrants = document.grants.map((grant) => {
      if (grant.grantType !== 'Spell Slot' || grant.schoolRestrictions?.length) return grant
      const refs = document._type === 'feat' && document.name === 'Fey Touched'
        ? ['divination', 'enchantment'].map((name) => schoolIds.get(name)!)
        : grant.schoolRestriction?._ref
          ? [grant.schoolRestriction._ref]
          : []
      if (!refs.length) return grant
      migratedGrants += 1
      return {
        ...grant,
        schoolRestrictions: refs.map((ref) => ({ _type: 'reference', _key: ref, _ref: ref })),
      }
    })
    if (JSON.stringify(nextGrants) === JSON.stringify(document.grants)) continue
    console.log(`${APPLY ? 'Updating' : 'Would update'} restrictions: ${document._type} ${document.name || document._id}`)
    if (APPLY) await client.patch(document._id).set({ grants: nextGrants }).commit()
  }

  console.log(`${migratedGrants} spell-choice grants ${APPLY ? 'were' : 'would be'} migrated.`)
  console.log(APPLY ? 'School linking complete; original school text is preserved.' : 'Dry run complete; no data was changed.')
}

run().catch((error) => {
  console.error('Spell-school migration failed:', error)
  process.exit(1)
})
