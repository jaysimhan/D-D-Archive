import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')

// Structured from Wizards' CC-BY-4.0 SRD 5.2.1. The gist revision is pinned so
// an upstream edit cannot silently change a future migration run.
const SOURCE_URL = 'https://api.github.com/gists/4b67869f962e3adaa3d0f7e5ca8f4912/0f701d23e146b27b26ee2523953edfbf67d43a22'
const SOURCE_FILE = 'srd-5.2-spells.json'
const SOURCE_2014_URL = 'https://raw.githubusercontent.com/5e-bits/5e-database/bfd3db4bcc31699cce703b46feb9af3f0ff08999/src/2014/en/5e-SRD-Spells.json'

// The SRD uses generic names for a few spells whose existing archive records
// use their familiar Player's Handbook names. Treat them as the same spell.
const SOURCE_NAME_ALIASES: Record<string, string[]> = {
  arcanehand: ['bigbyshand'],
  arcanesword: ['mordenkainenssword'],
  befuddlement: ['feeblemind'],
  blacktentacles: ['evardsblacktentacles'],
  faithfulhound: ['mordenkainensfaithfulhound'],
  floatingdisk: ['tensersfloatingdisk'],
  freezingsphere: ['otilukesfreezingsphere'],
  hideouslaughter: ['tashashideouslaughter'],
  instantsummons: ['drawmijsinstantsummons'],
  irresistibledance: ['ottosirresistibledance'],
  magnificentmansion: ['mordenkainensmagnificentmansion'],
  privatesanctum: ['mordenkainensprivatesanctum'],
  resilientsphere: ['otilukesresilientsphere'],
  secretchest: ['leomundssecretchest'],
  telepathicbond: ['rarystelepathicbond'],
  tinyhut: ['leomundstinyhut'],
  shiningsmite: ['brandingsmite'],
}

// Official non-SRD spells already in the archive that were missing their class
// lists. These are unions of their published 2014 and 2024 class availability.
const SUPPLEMENTAL_CLASS_LINKS: Record<string, string[]> = {
  beastbond: ['druid', 'ranger'],
  causefear: ['warlock', 'wizard'],
  dragonsbreath: ['sorcerer', 'wizard'],
  dustdevil: ['druid', 'sorcerer', 'wizard'],
  earthbind: ['druid', 'sorcerer', 'warlock', 'wizard'],
  snillocssnowballswarm: ['sorcerer', 'wizard'],
  tashashideouslaughter: ['bard', 'warlock', 'wizard'],
  tashasmindwhip: ['sorcerer', 'wizard'],
  wardingwind: ['bard', 'druid', 'sorcerer', 'wizard'],
}

type SourceSpell = {
  name: string
  level: number
  school: string
  classes: string[]
  actionType?: string
  castingTime?: string
  concentration?: boolean
  ritual?: boolean
  range: string
  components?: string[]
  material?: string
  duration: string
  description: string
  higherLevelSlot?: string
  cantripUpgrade?: string
}

type SourceSpell2014 = {
  name: string
  classes: Array<{ index: string }>
}

type Reference = { _type: 'reference'; _key?: string; _ref: string }

type SpellDocument = {
  _id: string
  name: string
  slug?: string
  level?: number
  schoolId?: string
  schoolName?: string
  legacySchoolName?: string
  classes?: string[]
  edition?: string
  rulesets?: Reference[]
  subclasses?: Reference[]
}

type SubclassDocument = {
  _id: string
  name: string
  slug?: string
  spellRefs: string[]
}

const slugify = (value: string) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const normalizeName = (value: string) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[’']/g, '')
  .replace(/[^a-z0-9]/g, '')

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

function reference(id: string, key = id): Reference {
  return { _type: 'reference', _key: key, _ref: id }
}

function castingTime(spell: SourceSpell): string {
  if (spell.castingTime) return spell.castingTime
  const values: Record<string, string> = {
    action: '1 action',
    bonusAction: '1 bonus action',
    reaction: '1 reaction',
  }
  return values[spell.actionType || ''] || spell.actionType || '1 action'
}

async function loadSources(): Promise<{ current: SourceSpell[]; legacy: SourceSpell2014[] }> {
  const [currentResponse, legacyResponse] = await Promise.all([
    fetch(SOURCE_URL, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'dnd-archive-spell-sync' },
    }),
    fetch(SOURCE_2014_URL, { headers: { 'User-Agent': 'dnd-archive-spell-sync' } }),
  ])
  if (!currentResponse.ok) throw new Error(`Could not load SRD 5.2.1 spell source: HTTP ${currentResponse.status}`)
  if (!legacyResponse.ok) throw new Error(`Could not load SRD 5.1 spell source: HTTP ${legacyResponse.status}`)
  const gist = await currentResponse.json() as { files?: Record<string, { content?: string; truncated?: boolean }> }
  const file = gist.files?.[SOURCE_FILE]
  if (!file?.content || file.truncated) throw new Error(`The pinned source file ${SOURCE_FILE} is unavailable or truncated.`)
  const current = JSON.parse(file.content) as SourceSpell[]
  const legacy = await legacyResponse.json() as SourceSpell2014[]
  if (current.length !== 339) throw new Error(`Expected 339 SRD 5.2.1 spells; received ${current.length}.`)
  if (legacy.length !== 319) throw new Error(`Expected 319 SRD 5.1 spells; received ${legacy.length}.`)
  return { current, legacy }
}

async function run() {
  const [sources, rulesets, schools, classes, existing, subclasses] = await Promise.all([
    loadSources(),
    client.fetch<Array<{ _id: string; key: string }>>(
      '*[_type == "ruleset" && key.current in ["srd-2014", "srd-2024"]]{_id, "key": key.current}',
    ),
    client.fetch<Array<{ _id: string; name: string }>>('*[_type == "magicSchool"]{_id, name}'),
    client.fetch<Array<{ _id: string; id: string }>>('*[_type == "class" && defined(slug.current)]{_id, "id": slug.current}'),
    client.fetch<SpellDocument[]>(`*[_type == "spell"]{
      _id, name, "slug": slug.current, level, "schoolId": school._ref,
      "schoolName": coalesce(school->name, legacySchoolName), legacySchoolName,
      classes, edition, rulesets, subclasses
    }`),
    client.fetch<SubclassDocument[]>(`*[_type == "subclass"]{
      _id, name, "slug": slug.current,
      "spellRefs": array::unique(spells[].specificSpells[]._ref)
    }`),
  ])
  const sourceSpells = sources.current
  const legacyClassesByName = new Map(
    sources.legacy.map((spell) => [normalizeName(spell.name), spell.classes.map(({ index }) => index)]),
  )
  const legacyClassesFor = (sourceName: string) => {
    const key = normalizeName(sourceName)
    return unique([key, ...(SOURCE_NAME_ALIASES[key] || [])]
      .flatMap((candidate) => legacyClassesByName.get(candidate) || []))
  }
  const missingFromCurrent = sources.legacy.filter((spell) =>
    !sourceSpells.some((current) => {
      const currentKey = normalizeName(current.name)
      const legacyKey = normalizeName(spell.name)
      return currentKey === legacyKey || (SOURCE_NAME_ALIASES[currentKey] || []).includes(legacyKey)
    }),
  )
  if (missingFromCurrent.length) {
    throw new Error(`SRD 5.1 spells missing from SRD 5.2.1 source: ${missingFromCurrent.map(({ name }) => name).join(', ')}`)
  }

  const rulesetIds = new Map(rulesets.map(({ _id, key }) => [key, _id]))
  if (!rulesetIds.has('srd-2014') || !rulesetIds.has('srd-2024')) {
    throw new Error('Both srd-2014 and srd-2024 ruleset documents are required.')
  }
  const requiredRulesets = ['srd-2014', 'srd-2024'].map((key) => reference(rulesetIds.get(key)!, key))

  const schoolIds = new Map(schools.map(({ _id, name }) => [name.toLowerCase(), _id]))
  const classIds = new Map(classes.map(({ id }) => [id.toLowerCase(), id]))
  const sourceDuplicateNames = sourceSpells.filter((spell, index) =>
    sourceSpells.findIndex((candidate) => normalizeName(candidate.name) === normalizeName(spell.name)) !== index,
  )
  if (sourceDuplicateNames.length) {
    throw new Error(`Duplicate source spell names: ${sourceDuplicateNames.map(({ name }) => name).join(', ')}`)
  }

  const bySlug = new Map<string, SpellDocument>()
  const byName = new Map<string, SpellDocument>()
  const duplicateExisting: string[] = []
  for (const spell of existing) {
    if (spell.slug && bySlug.has(spell.slug)) duplicateExisting.push(spell.slug)
    if (spell.slug) bySlug.set(spell.slug, spell)
    const nameKey = normalizeName(spell.name)
    if (byName.has(nameKey)) duplicateExisting.push(spell.name)
    byName.set(nameKey, spell)
  }
  if (duplicateExisting.length) {
    throw new Error(`Existing duplicate spells must be reviewed before syncing: ${unique(duplicateExisting).join(', ')}`)
  }

  const findExisting = (sourceName: string) => {
    const key = normalizeName(sourceName)
    const aliases = SOURCE_NAME_ALIASES[key] || []
    return bySlug.get(slugify(sourceName)) || byName.get(key) || aliases.map((alias) => byName.get(alias)).find(Boolean)
  }

  const subclassRefsBySpell = new Map<string, Reference[]>()
  let danglingSubclassRefs = 0
  for (const subclass of subclasses) {
    for (const spellId of subclass.spellRefs || []) {
      if (!existing.some(({ _id }) => _id === spellId)) {
        danglingSubclassRefs += 1
        console.warn(`DANGLING subclass grant: ${subclass.name} -> ${spellId}`)
        continue
      }
      const refs = subclassRefsBySpell.get(spellId) || []
      refs.push(reference(subclass._id, subclass.slug || subclass._id))
      subclassRefsBySpell.set(spellId, refs)
    }
  }

  let creates = 0
  let patches = 0
  let classLinksAdded = 0
  let schoolCorrections = 0
  let subclassLinksAdded = 0
  let levelConflicts = 0
  const missingNames: string[] = []
  let transaction = client.transaction()
  let pending = 0

  const commitBatch = async () => {
    if (!APPLY || pending === 0) return
    await transaction.commit()
    transaction = client.transaction()
    pending = 0
  }

  for (const source of sourceSpells) {
    const slug = slugify(source.name)
    const current = findExisting(source.name)
    const sourceSchoolId = schoolIds.get(source.school.toLowerCase())
    if (!sourceSchoolId) throw new Error(`Unknown school in source: ${source.school} (${source.name})`)
    const officialClasses = unique([
      ...source.classes,
      ...legacyClassesFor(source.name),
      ...(current ? SUPPLEMENTAL_CLASS_LINKS[normalizeName(current.name)] || [] : []),
    ]).map((value) => {
      const id = classIds.get(value.toLowerCase())
      if (!id) throw new Error(`Missing class document for ${value} (${source.name})`)
      return id
    })

    if (!current) {
      const id = `spell-${slug}`
      if (existing.some(({ _id }) => _id === id)) throw new Error(`Document ID collision: ${id}`)
      const components = (source.components || []).map((value) => value.toLowerCase())
      const document = {
        _id: id,
        _type: 'spell',
        name: source.name,
        slug: { _type: 'slug', current: slug },
        level: source.level,
        school: reference(sourceSchoolId),
        legacySchoolName: source.school.charAt(0).toUpperCase() + source.school.slice(1).toLowerCase(),
        castingTime: castingTime(source),
        range: source.range,
        components: {
          verbal: components.includes('v'),
          somatic: components.includes('s'),
          material: components.includes('m'),
          ...(source.material ? { materialDescription: source.material } : {}),
        },
        duration: source.duration,
        concentration: source.concentration === true,
        ritual: source.ritual === true,
        description: source.description,
        ...((source.higherLevelSlot || source.cantripUpgrade)
          ? { higherLevels: source.higherLevelSlot || source.cantripUpgrade }
          : {}),
        classes: unique(officialClasses),
        source: 'Official',
        edition: 'Both',
        version: 1,
        rulesets: requiredRulesets,
        isHomebrew: false,
        versionNotes: 'SRD 5.2.1 spell; enabled for both archive rulesets by request.',
      }
      console.log(`CREATE ${source.name}`)
      missingNames.push(source.name)
      creates += 1
      if (APPLY) transaction.createIfNotExists(document)
      pending += 1
    } else {
      const patch: Record<string, unknown> = {}
      const currentClasses = current.classes || []
      const normalizedExistingClasses = currentClasses.map((value) => classIds.get(value.toLowerCase()) || value.toLowerCase())
      const nextClasses = unique([...normalizedExistingClasses, ...officialClasses])
      if (JSON.stringify(nextClasses) !== JSON.stringify(currentClasses)) {
        patch.classes = nextClasses
        classLinksAdded += nextClasses.length - unique(normalizedExistingClasses).length
      }

      const nextRulesets = [...(current.rulesets || [])]
      for (const required of requiredRulesets) {
        if (!nextRulesets.some(({ _ref }) => _ref === required._ref)) nextRulesets.push(required)
      }
      if (nextRulesets.length !== (current.rulesets || []).length) patch.rulesets = nextRulesets
      if (current.edition !== 'Both') patch.edition = 'Both'

      if (current.schoolId !== sourceSchoolId) {
        patch.school = reference(sourceSchoolId)
        if (current.schoolName) patch.legacySchoolName = current.schoolName
        schoolCorrections += 1
      } else if (!current.legacySchoolName) {
        patch.legacySchoolName = source.school.charAt(0).toUpperCase() + source.school.slice(1).toLowerCase()
      }
      if (current.level !== undefined && current.level !== source.level) {
        levelConflicts += 1
        console.warn(`LEVEL CONFLICT preserved: ${current.name} archive=${current.level}, SRD=${source.level}`)
      }

      const derivedSubclassRefs = subclassRefsBySpell.get(current._id) || []
      const nextSubclassRefs = [...(current.subclasses || [])]
      for (const derived of derivedSubclassRefs) {
        if (!nextSubclassRefs.some(({ _ref }) => _ref === derived._ref)) {
          nextSubclassRefs.push(derived)
          subclassLinksAdded += 1
        }
      }
      if (nextSubclassRefs.length !== (current.subclasses || []).length) patch.subclasses = nextSubclassRefs

      if (Object.keys(patch).length) {
        console.log(`PATCH  ${current.name}: ${Object.keys(patch).join(', ')}`)
        patches += 1
        if (APPLY) transaction.patch(current._id, (builder) => builder.set(patch))
        pending += 1
      }
    }
    if (pending >= 100) await commitBatch()
  }

  // Reverse links also apply to non-SRD/homebrew spells already granted by a subclass.
  for (const current of existing) {
    if (sourceSpells.some((source) => findExisting(source.name)?._id === current._id)) continue
    const derived = subclassRefsBySpell.get(current._id) || []
    const next = [...(current.subclasses || [])]
    for (const item of derived) {
      if (!next.some(({ _ref }) => _ref === item._ref)) {
        next.push(item)
        subclassLinksAdded += 1
      }
    }
    const patch: Record<string, unknown> = {}
    if (next.length !== (current.subclasses || []).length) patch.subclasses = next

    const supplementalClasses = SUPPLEMENTAL_CLASS_LINKS[normalizeName(current.name)] || []
    if (supplementalClasses.length) {
      const currentClasses = current.classes || []
      const normalizedExistingClasses = currentClasses.map((value) => classIds.get(value.toLowerCase()) || value.toLowerCase())
      const nextClasses = unique([...normalizedExistingClasses, ...supplementalClasses])
      if (JSON.stringify(nextClasses) !== JSON.stringify(currentClasses)) {
        patch.classes = nextClasses
        classLinksAdded += nextClasses.length - unique(normalizedExistingClasses).length
      }
    }

    if (Object.keys(patch).length) {
      console.log(`PATCH  ${current.name}: ${Object.keys(patch).join(', ')}`)
      patches += 1
      if (APPLY) transaction.patch(current._id, (builder) => builder.set(patch))
      pending += 1
    }
    if (pending >= 100) await commitBatch()
  }
  await commitBatch()

  console.log('\nSpell sync summary')
  console.log(`Source catalogs: ${sources.legacy.length} SRD 5.1 / ${sourceSpells.length} SRD 5.2.1`)
  console.log(`Existing spells before sync: ${existing.length}`)
  console.log(`Missing spells ${APPLY ? 'created' : 'to create'}: ${creates}`)
  console.log(`Existing spells ${APPLY ? 'patched' : 'to patch'}: ${patches}`)
  console.log(`Official class links added: ${classLinksAdded}`)
  console.log(`School links corrected (old name preserved): ${schoolCorrections}`)
  console.log(`Subclass reverse links added: ${subclassLinksAdded}`)
  console.log(`Level conflicts preserved for review: ${levelConflicts}`)
  console.log(`Dangling subclass grants: ${danglingSubclassRefs}`)
  if (missingNames.length) console.log(`Missing catalog entries: ${missingNames.join(', ')}`)
  console.log(APPLY ? 'Sync complete. No documents or fields were deleted.' : 'Dry run complete. No data was changed.')
}

run().catch((error) => {
  console.error('SRD spell sync failed:', error)
  process.exit(1)
})
