import { getCliClient } from 'sanity/cli'
import {
  PUBLISHER_MAP,
  OFFICIAL_BY_NAME,
  THIRD_PARTY_BOOK_BY_NAME,
  NEEDS_REVIEW,
  type Classification,
  type SourceValue,
} from './data/source-classification'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')
const VERBOSE = process.argv.includes('--verbose')
/** NEEDS_REVIEW entries are held back until someone confirms them against the book.
 *  Confirm one by deleting its NEEDS_REVIEW row, or release the whole set with this flag. */
const INCLUDE_REVIEW = process.argv.includes('--include-review')
const BATCH_SIZE = 100

const ENUM: SourceValue[] = ['Official', 'Unofficial', 'Homebrew']
const isEnum = (value: string): value is SourceValue => (ENUM as string[]).includes(value)

type Doc = { _id: string; _type: string; name: string; source: string; sourceBook?: string }
type Change = { doc: Doc; next: Classification; reason: string }

async function run() {
  // Traits carry no provenance of their own; they inherit from the race that grants them.
  // Resolve races first so trait decisions can follow.
  const docs = await client.fetch<Doc[]>(
    '*[defined(source) && !(_id in path("drafts.**"))]{_id, _type, name, source, sourceBook}',
  )
  const traitOwners = await client.fetch<Array<{ _id: string; races: string[] }>>(
    '*[_type == "trait" && !(_id in path("drafts.**"))]{_id, "races": *[_type == "race" && references(^._id)].name}',
  )
  const ownerRaces = new Map(traitOwners.map(({ _id, races }) => [_id, races]))

  /** A trait has no provenance of its own, so it takes the book of the race that grants it. */
  const inheritedTraitBook = (doc: Doc): { book?: string; official: boolean } => {
    const races = ownerRaces.get(doc._id) || []
    const officialRace = races.find((race) => OFFICIAL_BY_NAME.race?.[race])
    if (officialRace) return { book: OFFICIAL_BY_NAME.race[officialRace], official: true }
    return { book: races.map((race) => THIRD_PARTY_BOOK_BY_NAME.race?.[race]).find(Boolean), official: false }
  }

  const classify = (doc: Doc): Classification | null => {
    // 1. The source string already names a book or publisher.
    const mapped = PUBLISHER_MAP[doc.source]
    if (mapped) return mapped

    // 2. Enum value that is semantically correct already, or user homebrew.
    if (doc.source === 'Homebrew') return { source: 'Homebrew' }
    if (doc.source === 'Official') {
      const book = OFFICIAL_BY_NAME[doc._type]?.[doc.name]
        ?? (doc._type === 'trait' ? inheritedTraitBook(doc).book : undefined)
      return book ? { source: 'Official', sourceBook: book } : { source: 'Official' }
    }

    // 3. Unofficial: the bucket that conflated "not WotC" with "not in the SRD import".
    if (doc.source === 'Unofficial') {
      const book = OFFICIAL_BY_NAME[doc._type]?.[doc.name]
      if (book) return { source: 'Official', sourceBook: book }

      if (doc._type === 'trait') {
        const { book: inherited, official } = inheritedTraitBook(doc)
        return { source: official ? 'Official' : 'Unofficial', ...(inherited ? { sourceBook: inherited } : {}) }
      }

      const thirdParty = THIRD_PARTY_BOOK_BY_NAME[doc._type]?.[doc.name]
      return thirdParty ? { source: 'Unofficial', sourceBook: thirdParty } : { source: 'Unofficial' }
    }

    return null
  }

  const held = new Set(NEEDS_REVIEW.map(([type, name]) => `${type}:${name}`))
  const changes: Change[] = []
  const withheld: Change[] = []
  const unhandled: Doc[] = []

  for (const doc of docs) {
    const next = classify(doc)
    if (!next) {
      unhandled.push(doc)
      continue
    }
    const sourceChanged = next.source !== doc.source
    const bookChanged = Boolean(next.sourceBook) && next.sourceBook !== doc.sourceBook
    if (!sourceChanged && !bookChanged) continue

    const reason = !isEnum(doc.source)
      ? 'book name moved out of source'
      : sourceChanged
        ? `reclassified ${doc.source} -> ${next.source}`
        : 'attribution recorded'
    const change = { doc, next, reason }
    if (!INCLUDE_REVIEW && held.has(`${doc._type}:${doc.name}`)) withheld.push(change)
    else changes.push(change)
  }

  if (unhandled.length) {
    for (const doc of unhandled.slice(0, 20)) {
      console.error(`Unhandled: ${doc._type} "${doc.name}" has source ${JSON.stringify(doc.source)}.`)
    }
    throw new Error(`${unhandled.length} document(s) have a source value with no rule; add them to source-classification.ts.`)
  }

  const promoted = changes.filter(({ doc, next }) => doc.source === 'Unofficial' && next.source === 'Official')
  const demoted = changes.filter(({ doc, next }) => doc.source === 'Official' && next.source === 'Unofficial')
  const relabelled = changes.filter(({ doc }) => !isEnum(doc.source))

  const byType = new Map<string, number>()
  for (const { doc } of changes) byType.set(doc._type, (byType.get(doc._type) || 0) + 1)

  console.log(`Scanned ${docs.length} documents with a source field.\n`)
  console.log('Changes by type:')
  for (const [type, count] of Array.from(byType).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${type.padEnd(12)}${count}`)
  }
  console.log(`\n  ${String(relabelled.length).padStart(4)} book/publisher names moved from source -> sourceBook`)
  console.log(`  ${String(promoted.length).padStart(4)} Unofficial -> Official (WotC content that was filtered as third-party)`)
  console.log(`  ${String(demoted.length).padStart(4)} Official -> Unofficial`)

  if (promoted.length) {
    console.log('\nPromoted to Official:')
    const grouped = new Map<string, string[]>()
    for (const { doc } of promoted) {
      if (!grouped.has(doc._type)) grouped.set(doc._type, [])
      grouped.get(doc._type)!.push(doc.name)
    }
    for (const [type, names] of Array.from(grouped).sort(([a], [b]) => a.localeCompare(b))) {
      console.log(`  ${type} (${names.length}): ${names.sort().join(', ')}`)
    }
  }

  if (VERBOSE) {
    console.log('\nEvery change:')
    for (const { doc, next, reason } of changes) {
      const book = next.sourceBook ? ` [${next.sourceBook}]` : ''
      console.log(`  ${doc._type.padEnd(11)} ${doc.name.padEnd(34)} ${doc.source} -> ${next.source}${book}  (${reason})`)
    }
  }

  if (NEEDS_REVIEW.length) {
    console.log(`\nWorth confirming against the book${INCLUDE_REVIEW ? ' (released by --include-review)' : ''}:`)
    for (const [type, name, note] of NEEDS_REVIEW) {
      const doc = docs.find((d) => d._type === type && d.name === name)
      if (!doc) {
        console.log(`  ${type} "${name}" -> NOT FOUND IN DATASET: ${note}`)
        continue
      }
      const landing = classify(doc)?.source ?? '?'
      const wouldChange = withheld.some((c) => c.doc._id === doc._id)
      const state = INCLUDE_REVIEW ? 'applied' : wouldChange ? 'HELD (would change)' : 'no change either way'
      console.log(`  ${type} "${name}" ${doc.source} -> ${landing} [${state}]: ${note}`)
    }
  }

  if (withheld.length) {
    console.log(`\n${withheld.length} change(s) held back pending review; re-run with --include-review to apply them too.`)
  }

  console.log(`\n${APPLY ? 'Applying' : 'Would apply'} ${changes.length} change(s).`)

  let transaction = client.transaction()
  let batched = 0
  for (const { doc, next } of changes) {
    transaction.patch(doc._id, (patch) => {
      const set: Record<string, string> = { source: next.source }
      if (next.sourceBook) set.sourceBook = next.sourceBook
      return patch.set(set)
    })
    batched += 1
    if (batched === BATCH_SIZE) {
      if (APPLY) await transaction.commit()
      transaction = client.transaction()
      batched = 0
    }
  }
  if (APPLY && batched > 0) await transaction.commit()

  console.log(APPLY ? 'Source labelling complete.' : 'Dry run complete; no data was changed. Re-run with --verbose for the full list.')
}

run().catch((error) => {
  console.error('Source labelling migration failed:', error)
  process.exit(1)
})
