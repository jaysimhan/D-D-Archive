/**
 * Joins the line breaks a PDF copy left in the Archive's text.
 *
 * Most descriptions were pasted from the Handbook's two-column layout, so a
 * newline ends every printed line: "the reduction equals 1d10 plus\nyour
 * Dexterity modifier". Every place that shows them breaks there too, leaving
 * a ragged half-width column with empty space to its right.
 *
 * A line is joined to the next when it is a wrap, not a break: it is long
 * enough to have run into the column edge and does not end a sentence, and
 * neither side is a list item, a table cell or a heading. Blank-line
 * paragraphs, bullets, headings ("Origin Feat", "Wondrous Item, Rare
 * (Requires Attunement)") and class tables keep their breaks.
 *
 * Every multi-line string in every document is read — descriptions, their
 * rules2014/rules2024 overlays, feat benefits, block text — drafts included,
 * so publishing one cannot bring the breaks back.
 *
 * Usage:  npx tsx scripts/reflow-hard-wrapped-text.ts            (dry run)
 *         npx tsx scripts/reflow-hard-wrapped-text.ts --apply    (write)
 *
 * Both write every change, before and after, to tmp/ first; --apply's copy is
 * the backup to restore from.
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
    projectId: process.env.SANITY_API_PROJECT_ID || 'ylk0tk34',
    dataset: process.env.SANITY_API_DATASET || 'production',
    token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

/** Shorter than this, a line ended by choice — a heading — not at the column edge. */
const MIN_WRAPPED_LENGTH = 35;

/** Ends a sentence or a clause the next line should not run on from. */
const TERMINAL = /[.!?:;]["'”’)\]]*$/;
/** A bullet or numbered item starts here. */
const LIST_ITEM = /^([•\-*–—▪●]|\d+[.)]\s|\(?[a-z]\)\s)/;
/** Columns laid out with tabs, pipes or runs of spaces. */
const COLUMNS = /\||\s{3,}|\S\t/;
/** A table cell on a line of its own: "2", "+3", "1d6", "5 GP", "—". */
const TABLE_CELL =
    /^([+\-–—−]?\d[\d,/]*(d\d+)?( ?[+×x] ?\d+)?( ?(GP|SP|CP|EP|PP|lb\.?|ft\.?|feet|days?|hours?))?|[—–-]|\d+(st|nd|rd|th))$/i;

function isCell(line: string | undefined) {
    return line !== undefined && TABLE_CELL.test(line.trim());
}

function isWrap(lines: string[], index: number) {
    const before = lines[index - 2];
    const prev = lines[index - 1].trim();
    const next = lines[index].trim();
    if (!prev || !next) return false;
    if (prev.length < MIN_WRAPPED_LENGTH || TERMINAL.test(prev)) return false;
    // A bullet is written "•\t text"; that tab is not a column.
    const prevText = prev.replace(/^[•\-*–—▪●]\s+/, '');
    if (LIST_ITEM.test(next) || COLUMNS.test(next) || COLUMNS.test(prevText)) return false;
    // A table row, read across: its cells sit either side.
    if (isCell(next) || isCell(before) || isCell(lines[index + 1])) return false;
    // "Wondrous Item, Rare (Requires Attunement)" heads an item; the text starts below.
    if (prev.endsWith(')') && /^[A-Z]/.test(next)) return false;
    return true;
}

export function reflow(text: string) {
    return text
        .split(/(\n[ \t]*\n+)/)
        .map((part, index) => {
            if (index % 2) return part; // a paragraph break, kept as written
            const lines = part.split('\n');
            let out = lines[0];
            for (let i = 1; i < lines.length; i++) {
                if (!isWrap(lines, i)) {
                    out += '\n' + lines[i];
                    continue;
                }
                const hyphenated = /[a-z]-$/.test(out) && /^[a-z]/.test(lines[i].trim());
                out = out.trimEnd() + (hyphenated ? '' : ' ') + lines[i].trim();
            }
            return out;
        })
        .join('');
}

type Change = { id: string; path: string; before: string; after: string };

/** Every multi-line string in a document that reflows differently, by patch path. */
function changesIn(doc: Record<string, unknown>): Change[] {
    const changes: Change[] = [];
    const walk = (value: unknown, at: string) => {
        if (typeof value === 'string') {
            if (!value.includes('\n')) return;
            const after = reflow(value);
            if (after !== value) changes.push({ id: doc._id as string, path: at, before: value, after });
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => walk(item, `${at}[${index}]`));
        } else if (value && typeof value === 'object') {
            for (const [key, item] of Object.entries(value)) {
                if (key.startsWith('_') || key === 'slug') continue;
                walk(item, at ? `${at}.${key}` : key);
            }
        }
    };
    walk(doc, '');
    return changes;
}

async function allDocuments() {
    const docs: Record<string, unknown>[] = [];
    let last = '';
    for (;;) {
        const page = await client.fetch<Record<string, unknown>[]>(
            `*[_id > $last] | order(_id) [0...500]`,
            { last },
        );
        if (!page.length) return docs;
        docs.push(...page);
        last = page[page.length - 1]._id as string;
    }
}

async function main() {
    const apply = process.argv.includes('--apply');
    const docs = await allDocuments();
    const byDoc = new Map<string, { rev: string; changes: Change[] }>();
    for (const doc of docs) {
        const changes = changesIn(doc);
        if (changes.length) byDoc.set(doc._id as string, { rev: doc._rev as string, changes });
    }

    const all = [...byDoc.values()].flatMap((entry) => entry.changes);
    const byType: Record<string, number> = {};
    for (const doc of docs) {
        if (byDoc.has(doc._id as string)) byType[doc._type as string] = (byType[doc._type as string] ?? 0) + 1;
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const out = path.resolve('tmp', `reflow-${apply ? 'backup' : 'preview'}-${stamp}.json`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(all, null, 2));

    console.log(`${docs.length} documents read; ${byDoc.size} to change, ${all.length} fields.`);
    console.log('By type:', byType);
    console.log(`Every change, before and after: ${out}`);

    if (!apply) {
        console.log('\nDry run. Run with --apply to write.');
        return;
    }

    const ids = [...byDoc.keys()];
    for (let start = 0; start < ids.length; start += 50) {
        const transaction = client.transaction();
        for (const id of ids.slice(start, start + 50)) {
            const { rev, changes } = byDoc.get(id)!;
            transaction.patch(id, (patch) =>
                patch
                    .ifRevisionId(rev)
                    .set(Object.fromEntries(changes.map((change) => [change.path, change.after]))),
            );
        }
        await transaction.commit({ visibility: 'async' });
        console.log(`  ${Math.min(start + 50, ids.length)}/${ids.length}`);
    }
    console.log('Done.');
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
