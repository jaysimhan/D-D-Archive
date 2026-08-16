/**
 * Ranked, typo-tolerant text matching for the archive search.
 *
 * The whole corpus (~1,450 documents) is already loaded client-side, so scoring
 * every candidate on each keystroke is cheap — no search index or service is
 * needed at this size. Matching is ordered so that a name hit always outranks a
 * description hit, which plain substring filtering could not express.
 */

/** Higher is better. Gaps leave room for tie-breakers. */
const SCORE = {
    exactName: 1000,
    namePrefix: 800,
    nameWordPrefix: 700,
    nameContains: 600,
    nameFuzzy: 420,
    allTokensInName: 380,
    descriptionPhrase: 220,
    allTokensAnywhere: 120,
} as const;

export interface PreparedQuery {
    text: string;
    tokens: string[];
}

/** Lowercase, strip accents, and reduce punctuation and hyphens to spaces. */
function normalize(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

/** Returns null for an empty query, meaning "no text filter". */
export function prepareQuery(query: string | undefined | null): PreparedQuery | null {
    const text = normalize(query ?? '');
    if (!text) return null;
    return { text, tokens: text.split(' ').filter(Boolean) };
}

/**
 * Typos tolerated, scaled to word length. Deliberately tight: allowing two
 * edits on a 7-letter word makes "stealth" match "health".
 */
function allowedEdits(length: number): number {
    if (length <= 3) return 0;
    if (length <= 7) return 1;
    return 2;
}

/**
 * Damerau-Levenshtein (optimal string alignment), abandoned as soon as it
 * cannot come in under `max`. Counting an adjacent swap as one edit is what
 * catches the common real typo — "fierball" for "fireball".
 */
function withinEditDistance(a: string, b: string, max: number): boolean {
    if (max <= 0) return a === b;
    if (Math.abs(a.length - b.length) > max) return false;
    if (a === b) return true;

    const width = b.length + 1;
    let twoAgo: number[] = new Array<number>(width).fill(0);
    let previous = Array.from({ length: width }, (_, i) => i);

    for (let i = 1; i <= a.length; i++) {
        const current = new Array<number>(width);
        current[0] = i;
        let rowBest = current[0];

        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            let value = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                value = Math.min(value, twoAgo[j - 2] + 1);
            }
            current[j] = value;
            if (value < rowBest) rowBest = value;
        }

        if (rowBest > max) return false;
        twoAgo = previous;
        previous = current;
    }

    return previous[b.length] <= max;
}

/**
 * Score one record against a prepared query. `name` carries the most weight;
 * everything in `body` (description, parent class, …) is secondary.
 * Returns 0 when nothing matches, so callers can drop the record.
 */
export function matchScore(
    query: PreparedQuery,
    name: string,
    ...body: (string | undefined | null)[]
): number {
    const normalizedName = normalize(name ?? '');
    const nameWords = normalizedName.split(' ').filter(Boolean);
    const normalizedBody = normalize(body.filter(Boolean).join(' '));

    let score = 0;

    if (normalizedName === query.text) {
        score = SCORE.exactName;
    } else if (normalizedName.startsWith(query.text)) {
        score = SCORE.namePrefix;
    } else if (nameWords.some((word) => word.startsWith(query.text))) {
        score = SCORE.nameWordPrefix;
    } else if (normalizedName.includes(query.text)) {
        score = SCORE.nameContains;
    } else if (query.tokens.every((token) => normalizedName.includes(token))) {
        score = SCORE.allTokensInName;
    } else if (
        // Every token must land on some word of the name. Requiring all of them
        // keeps "magic missle" on target instead of matching anything magical.
        query.tokens.every((token) =>
            nameWords.some((word) => withinEditDistance(word, token, allowedEdits(token.length))),
        )
    ) {
        score = SCORE.nameFuzzy;
    } else if (normalizedBody.includes(query.text)) {
        score = SCORE.descriptionPhrase;
    } else if (
        query.tokens.length > 1 &&
        query.tokens.every((token) => normalizedBody.includes(token))
    ) {
        score = SCORE.allTokensAnywhere;
    }

    if (!score) return 0;

    // Among equally-tiered hits, prefer the tighter name: "Ice Knife" should
    // come before "Investiture of Ice" for the query "ice".
    return score - Math.min(normalizedName.length, 80) / 100;
}
