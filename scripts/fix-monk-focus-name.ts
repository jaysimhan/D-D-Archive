/**
 * Names the Monk's level 2 resource feature for each ruleset.
 *
 * The 2024 Monk links `feature-monk-2-monk-s-focus`, which carries both
 * editions' text as `rules2014`/`rules2024` overlays but only one name. That
 * name was set to "Ki", so a 2024 sheet listed Ki where the Handbook has
 * Monk's Focus. This writes the name into each overlay: Ki for 2014, Monk's
 * Focus for 2024.
 *
 * Usage:  npx tsx scripts/fix-monk-focus-name.ts            (dry run)
 *         npx tsx scripts/fix-monk-focus-name.ts --apply    (write)
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
    projectId: process.env.SANITY_API_PROJECT_ID || 'ylk0tk34',
    dataset: process.env.SANITY_API_DATASET || 'production',
    token: process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
});

const FEATURE_ID = 'feature-monk-2-monk-s-focus';
const NAMES = { 'rules2014.name': 'Ki', 'rules2024.name': 'Monk’s Focus' };

/** The Monk's Ki/Focus feature names as a sheet of that edition reads them. */
const EDITION_NAMES = `*[_id == "class-monk"][0]{
    ...select($edition == "2014" => rules2014, $edition == "2024" => rules2024, {})
}.features[]{
    "name": @->{
        ...,
        ...select(
            coalesce(sameForBoth, false) == false && $edition == "2014" => rules2014,
            coalesce(sameForBoth, false) == false && $edition == "2024" => rules2024,
            {}
        )
    }.name
}.name`;

async function report() {
    for (const edition of ['2014', '2024']) {
        const names = (await client.fetch<string[]>(EDITION_NAMES, { edition })).filter(
            (name) => /\bki\b|focus/i.test(name),
        );
        console.log(`  ${edition}: ${names.join(', ') || '(none)'}`);
    }
}

async function main() {
    const apply = process.argv.includes('--apply');
    const feature = await client.getDocument(FEATURE_ID);
    if (!feature) throw new Error(`${FEATURE_ID} not found`);

    console.log(`${FEATURE_ID} is named "${feature.name}"; overlays name it`, {
        2014: feature.rules2014?.name ?? '(unset)',
        2024: feature.rules2024?.name ?? '(unset)',
    });
    console.log('Before:');
    await report();

    if (!apply) {
        console.log('\nDry run. Would set', NAMES, '\nRun with --apply to write.');
        return;
    }

    await client.patch(FEATURE_ID).ifRevisionId(feature._rev).set(NAMES).commit();
    console.log('After:');
    await report();
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
