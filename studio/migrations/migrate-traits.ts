/**
 * Migration script to extract traits from race data and create trait documents
 * 
 * Usage:
 * 1. Navigate to the studio directory: cd studio
 * 2. Run: npx sanity exec migrations/migrate-traits.ts --with-user-token
 */

import { createClient } from '@sanity/client';

// Import data from source files
import { RACES } from '../../src/data/races';

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: 'production',
    useCdn: false,
    token: process.env.SANITY_AUTH_TOKEN,
    apiVersion: '2024-01-01',
});

// Helper to create a valid Sanity ID from a string
function toSanityId(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Helper to create a transaction for batch operations
async function batchCreate(documents: unknown[], batchSize = 100) {
    for (let i = 0; i < documents.length; i += batchSize) {
        const batch = documents.slice(i, i + batchSize);
        const transaction = client.transaction();

        for (const doc of batch) {
            transaction.createOrReplace(doc as Parameters<typeof transaction.createOrReplace>[0]);
        }

        await transaction.commit();
        console.log(`  Imported ${Math.min(i + batchSize, documents.length)}/${documents.length}`);
    }
}

interface TraitData {
    name: string;
    description: string;
}

interface UniqueTraitInfo {
    description: string;
    raceNames: string[];
}

// ===== EXTRACT AND DEDUPLICATE TRAITS =====
function extractUniqueTraits(): Map<string, UniqueTraitInfo> {
    const traitMap = new Map<string, UniqueTraitInfo>();

    for (const race of RACES) {
        if (!race.traits) continue;

        for (const trait of race.traits) {
            const traitData = typeof trait === 'string'
                ? { name: trait, description: '' }
                : trait as TraitData;

            const existingTrait = traitMap.get(traitData.name);
            if (existingTrait) {
                // Trait already exists, add race to list
                existingTrait.raceNames.push(race.name);
                // Keep the longer description
                if (traitData.description.length > existingTrait.description.length) {
                    existingTrait.description = traitData.description;
                }
            } else {
                // New trait
                traitMap.set(traitData.name, {
                    description: traitData.description,
                    raceNames: [race.name],
                });
            }
        }
    }

    return traitMap;
}

// ===== MIGRATE TRAITS =====
async function migrateTraits() {
    console.log('\n🏷️ Extracting and Migrating Traits...');

    const uniqueTraits = extractUniqueTraits();
    console.log(`  Found ${uniqueTraits.size} unique traits from ${RACES.length} races`);

    const documents = Array.from(uniqueTraits.entries()).map(([name, info]) => ({
        _id: `trait-${toSanityId(name)}`,
        _type: 'trait',
        name: name,
        slug: { _type: 'slug', current: toSanityId(name) },
        description: info.description || `Trait found in: ${info.raceNames.slice(0, 3).join(', ')}${info.raceNames.length > 3 ? '...' : ''}`,
        tags: ['race'],
        level: 1,
        source: 'Official',
        edition: 'Both',
        version: 1,
    }));

    await batchCreate(documents);
    console.log(`✅ Created ${documents.length} trait documents`);

    // Print some stats
    const multiRaceTraits = Array.from(uniqueTraits.entries())
        .filter(([, info]) => info.raceNames.length > 1)
        .sort((a, b) => b[1].raceNames.length - a[1].raceNames.length);

    console.log('\n📊 Most common traits (shared by multiple races):');
    for (const [name, info] of multiRaceTraits.slice(0, 10)) {
        console.log(`  - ${name}: ${info.raceNames.length} races`);
    }
}

// ===== UPDATE RACES WITH TRAIT REFERENCES =====
async function updateRacesWithTraitRefs() {
    console.log('\n🔗 Updating races with trait references...');

    for (const race of RACES) {
        if (!race.traits || race.traits.length === 0) continue;

        const traitRefs = race.traits.map((trait) => {
            const traitData = typeof trait === 'string' ? { name: trait } : trait as TraitData;
            return {
                _type: 'reference',
                _ref: `trait-${toSanityId(traitData.name)}`,
                _key: `ref-${toSanityId(traitData.name)}`,
            };
        });

        try {
            await client
                .patch(`race-${toSanityId(race.id)}`)
                .set({ traits: traitRefs })
                .commit();
        } catch (error) {
            console.log(`  ⚠️ Could not update race ${race.name}: ${(error as Error).message}`);
        }
    }

    console.log(`✅ Updated race trait references`);
}

// ===== MAIN MIGRATION =====
async function runMigration() {
    console.log('🚀 Starting Trait Migration...');
    console.log('='.repeat(50));

    try {
        await migrateTraits();
        await updateRacesWithTraitRefs();

        console.log('\n' + '='.repeat(50));
        console.log('🎉 Trait migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
