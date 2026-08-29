/**
 * Stamps `isCore` on every race/species document.
 *
 * Until now the character creator's "non-core" toggle filtered on `source`, which meant
 * "published by Wizards of the Coast" — so Owlin, Plasmoid, Thri-kreen and every other
 * setting-book ancestry counted as core. `isCore` makes the distinction explicit and
 * independent of provenance: the Player's Handbook line-up plus its long-standing
 * subraces are core, everything else is not, whoever published it.
 *
 * Variants that live inside a parent document rather than as documents of their own
 * (Aasimar Protector/Scourge/Fallen, the dragonborn ancestries, the tiefling bloodlines,
 * Variant Human, the legacy vs. Monsters of the Multiverse cuts of Aarakocra and Yuan-ti)
 * are covered by marking their parent.
 *
 * Usage:
 *   npm run set:core-ancestries          # dry run
 *   npm run set:core-ancestries:apply    # write
 */

import { getCliClient } from 'sanity/cli'

const client = getCliClient({ apiVersion: '2026-08-18' })
const APPLY = process.argv.includes('--apply')
const VERBOSE = process.argv.includes('--verbose')
const BATCH_SIZE = 100

/** Keyed by slug, grouped the way the ancestry list reads. */
const CORE_SLUGS = new Set([
    'aarakocra',
    'aasimar',
    'autognome',
    'bugbear',
    'changeling',
    'dhampir',
    'dragonborn',

    // Dwarf
    'hill-dwarf',
    'mountain-dwarf',
    'duergar',

    // Elf
    'high-elf',
    'wood-elf',
    'drow',
    'eladrin',
    'shadar-kai',
    'sea-elf',
    'astral-elf',

    // Genasi
    'genasi-air',
    'genasi-earth',
    'genasi-fire',
    'genasi-water',

    // Gnome
    'forest-gnome',
    'rock-gnome',
    'deep-gnome',

    'goblin',
    'goliath',
    'hobgoblin',

    // Half-Elf
    'half-elf',
    'half-elf-high-variant',

    'half-orc',

    // Halfling
    'lightfoot-halfling',
    'stout-halfling',
    'ghostwise-halfling',

    'human',
    'orc',
    'owlin',
    'tabaxi',
    'tiefling',
    'tortle',
    'warforged',

    // Yuan-ti: the legacy Pureblood and the Monsters of the Multiverse cut are separate documents.
    'yuan-ti',
    'yuan-ti-pureblood',
])

/** Named in the core list but absent from the dataset; reported so the gap stays visible. */
const NAMED_BUT_ABSENT: Array<[string, string]> = [
    ['Half-Elf (Wood Elf Descent)', 'only Standard and High Elf Descent exist as documents'],
    ['Half-Elf (Drow Descent)', 'only Standard and High Elf Descent exist as documents'],
]

type Doc = { _id: string; _type: string; name: string; slug?: string; isCore?: boolean; source?: string }

async function run() {
    const docs = await client.fetch<Doc[]>(
        '*[_type in ["race", "species"] && !(_id in path("drafts.**"))]{_id, _type, name, "slug": slug.current, isCore, source} | order(name asc)',
    )

    const changes = docs
        .map((doc) => ({ doc, next: CORE_SLUGS.has(doc.slug || '') }))
        .filter(({ doc, next }) => doc.isCore !== next)

    const seen = new Set(docs.map((doc) => doc.slug).filter(Boolean))
    const unmatched = [...CORE_SLUGS].filter((slug) => !seen.has(slug))

    const core = docs.filter((doc) => CORE_SLUGS.has(doc.slug || ''))
    console.log(`${docs.length} ancestry document(s): ${core.length} core, ${docs.length - core.length} non-core.`)

    // The interesting fallout: WotC-published ancestries that the old source filter treated as core.
    const demoted = docs.filter((doc) => doc.source === 'Official' && !CORE_SLUGS.has(doc.slug || ''))
    if (demoted.length) {
        console.log(`\n${demoted.length} Official ancestry/ancestries are non-core and will no longer show with the toggle off:`)
        console.log(`  ${demoted.map((doc) => doc.name).join(', ')}`)
    }

    if (unmatched.length) {
        console.log(`\n${unmatched.length} core slug(s) matched no document: ${unmatched.join(', ')}`)
    }

    if (NAMED_BUT_ABSENT.length) {
        console.log('\nNamed in the core list but not present as documents:')
        for (const [name, note] of NAMED_BUT_ABSENT) console.log(`  ${name} — ${note}`)
    }

    if (VERBOSE) {
        console.log('\nPer-document changes:')
        for (const { doc, next } of changes) {
            console.log(`  ${doc.name} (${doc.slug}): ${doc.isCore ?? 'unset'} -> ${next}`)
        }
    }

    console.log(`\n${APPLY ? 'Applying' : 'Would apply'} ${changes.length} change(s).`)

    let transaction = client.transaction()
    let batched = 0
    for (const { doc, next } of changes) {
        transaction.patch(doc._id, (patch) => patch.set({ isCore: next }))
        batched += 1
        if (batched === BATCH_SIZE) {
            if (APPLY) await transaction.commit()
            transaction = client.transaction()
            batched = 0
        }
    }
    if (APPLY && batched > 0) await transaction.commit()

    console.log(
        APPLY
            ? 'Core classification complete.'
            : 'Dry run complete; no data was changed. Re-run with --verbose for the full list.',
    )
}

run().catch((error) => {
    console.error('Core classification migration failed:', error)
    process.exit(1)
})
