/**
 * Script to check all race documents for unknown fields (fields not in schema).
 * 
 * Usage: npx sanity exec migrations/check-unknown-fields.ts --with-user-token
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

// Whitelist of known fields from schema + system fields
const KNOWN_FIELDS = new Set([
    // System
    '_id', '_type', '_createdAt', '_updatedAt', '_rev', '_key',
    // Common
    'name', 'slug', 'description', 'image', 'source', 'edition', 'version',
    // Race specific
    'flexibleAbilityScores', 'abilityScoreIncrease',
    'size', 'speed',
    'traits', 'proficiencies', 'languages',
    'spells', 'subraces'
]);

async function check() {
    console.log('🔍 Scanning races for unknown fields...\n');

    const races = await client.fetch(`*[_type == "race"]`);
    console.log(`Found ${races.length} races.`);

    let foundAny = false;

    for (const race of races) {
        const unknownFields: string[] = [];

        for (const key of Object.keys(race)) {
            if (!KNOWN_FIELDS.has(key)) {
                unknownFields.push(key);
            }
        }

        if (unknownFields.length > 0) {
            foundAny = true;
            console.log(`⚠️  ${race.name} (${race.slug?.current || race._id}):`);
            unknownFields.forEach(field => console.log(`   - ${field}`));
        }
    }

    if (!foundAny) {
        console.log('\n✅ No unknown fields found in any race documents.');
    } else {
        console.log('\n❌ Found unknown fields. You may need to unset them.');
    }
}

check().catch(console.error);
