/**
 * Script to link existing races in Sanity with trait references
 * 
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/link-race-traits.ts --with-user-token
 */

import { createClient } from '@sanity/client';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

function toSanityId(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

interface SanityRace {
    _id: string;
    name: string;
    traits?: Array<{ name: string; description: string; _key: string }>;
}

interface SanityTrait {
    _id: string;
    name: string;
}

async function linkRaceTraits() {
    console.log('🔗 Linking existing races with trait references...\n');

    // Get all races from Sanity that have inline traits
    const races: SanityRace[] = await client.fetch(`*[_type == "race" && defined(traits)]{ _id, name, traits }`);
    console.log(`Found ${races.length} races with traits in Sanity\n`);

    if (races.length === 0) {
        console.log('No races found. Run migrate-all.ts first to create races.');
        return;
    }

    // Get all trait documents
    const traits: SanityTrait[] = await client.fetch(`*[_type == "trait"]{ _id, name }`);
    const traitMap = new Map(traits.map(t => [t.name.toLowerCase(), t._id]));
    console.log(`Found ${traits.length} trait documents\n`);

    let updated = 0;
    let skipped = 0;

    for (const race of races) {
        if (!race.traits || race.traits.length === 0) continue;

        const traitRefs = [];
        for (const inlineTrait of race.traits) {
            const traitId = traitMap.get(inlineTrait.name.toLowerCase());
            if (traitId) {
                traitRefs.push({
                    _type: 'reference',
                    _ref: traitId,
                    _key: `ref-${toSanityId(inlineTrait.name)}`,
                });
            } else {
                console.log(`  ⚠️ No trait found for "${inlineTrait.name}" in race ${race.name}`);
            }
        }

        if (traitRefs.length > 0) {
            try {
                // Update race: set traits to references (replacing inline objects)
                await client
                    .patch(race._id)
                    .set({ traits: traitRefs })
                    .commit();
                console.log(`✅ ${race.name}: linked ${traitRefs.length} traits`);
                updated++;
            } catch (error) {
                console.log(`❌ Failed to update ${race.name}: ${(error as Error).message}`);
            }
        } else {
            skipped++;
        }
    }

    console.log(`\n✅ Updated ${updated} races, skipped ${skipped}`);
}

async function run() {
    console.log('🚀 Starting Race-Trait Linking...');
    console.log('='.repeat(50));

    try {
        await linkRaceTraits();
        console.log('\n🎉 Done!');
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
}

run();
