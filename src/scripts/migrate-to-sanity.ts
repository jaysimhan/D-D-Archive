/**
 * Migration script to import all D&D data to Sanity
 * 
 * This script reads the hardcoded TypeScript data and creates
 * Sanity documents via the Sanity client.
 * 
 * Usage from project root:
 * 1. First install dependencies: npm install tsx
 * 2. Run: npx tsx src/scripts/migrate-to-sanity.ts
 * 
 * You'll need a Sanity token with write access.
 * Get one from: https://www.sanity.io/manage/project/ylk0tk34/api
 * Set it as environment variable: export SANITY_TOKEN=your-token
 */

import 'dotenv/config';
import { createClient } from '@sanity/client';

// Import all the data
import { CLASSES } from '../data/classes';
import { RACES } from '../data/races';
import { BACKGROUNDS } from '../data/backgrounds';
import { SPELLS } from '../data/spells';
import { FEATS } from '../data/feats';
import { ITEMS } from '../data/items';
import { SUBCLASSES } from '../data/subclasses';

// Setup Sanity client
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_TOKEN || process.env.SANITY_AUTH_TOKEN;
// Use production dataset as per the token permissions
const dataset = 'production';

if (!token) {
    console.error('❌ Missing Sanity token environment variable');
    console.error('Set SANITY_API_WRITE_TOKEN in your .env file');
    console.error('Get a token from: https://www.sanity.io/manage/project/ylk0tk34/api');
    process.exit(1);
}

console.log(`Using dataset: ${dataset}`);

const client = createClient({
    projectId: 'ylk0tk34',
    dataset: dataset,
    useCdn: false,
    token: token,
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
async function batchCreate(documents: unknown[], batchSize = 50) {
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

// ===== MIGRATE CLASSES =====
async function migrateClasses() {
    console.log('\n📚 Migrating Classes...');

    const documents = CLASSES.map((cls) => ({
        _id: `class-${toSanityId(cls.id)}`,
        _type: 'class',
        name: cls.name,
        slug: { _type: 'slug', current: cls.id },
        description: cls.description,
        source: cls.source || 'Official',
        edition: cls.edition || 'Both',
        version: cls.version || 1,
        hitDie: cls.hitDie,
        primaryAbility: cls.primaryAbility,
        savingThrows: cls.savingThrows,
        spellcaster: cls.spellcaster || 'none',
        spellcastingAbility: cls.spellcastingAbility,
        features: cls.features?.map((f: any, idx: number) => ({
            _key: `feature-${idx}`,
            level: f.level,
            name: f.name,
            description: f.description,
        })),
        subclasses: cls.subclasses,
    }));

    await batchCreate(documents);
    console.log(`✅ Migrated ${documents.length} classes`);
}

// ===== MIGRATE SUBCLASSES =====
async function migrateSubclasses() {
    console.log('\n📖 Migrating Subclasses...');

    const documents = SUBCLASSES.map((sub: any, idx: number) => ({
        _id: `subclass-${toSanityId(sub.id)}-${idx}`,
        _type: 'subclass',
        name: sub.name,
        slug: { _type: 'slug', current: sub.id },
        parentClassId: sub.parentClassId,
        description: sub.description,
        source: sub.source || 'Official',
        edition: sub.edition || 'Both',
        version: sub.version || 1,
        features: sub.features?.map((f: any, fidx: number) => ({
            _key: `feature-${fidx}`,
            level: f.level,
            name: f.name,
            description: f.description,
        })),
    }));

    await batchCreate(documents);
    console.log(`✅ Migrated ${documents.length} subclasses`);
}

// ===== MIGRATE RACES =====
async function migrateRaces() {
    console.log('\n🧝 Migrating Races...');

    // Combine and deduplicate races
    const allRaces = RACES;
    const seenIds = new Set<string>();
    const uniqueRaces = allRaces.filter((race: any) => {
        if (seenIds.has(race.id)) return false;
        seenIds.add(race.id);
        return true;
    });

    const documents = uniqueRaces.map((race: any, idx: number) => ({
        _id: `race-${toSanityId(race.id)}-${idx}`,
        _type: 'race',
        name: race.name,
        slug: { _type: 'slug', current: race.id },
        description: race.description,
        source: race.source || 'Official',
        edition: race.edition || 'Both',
        version: race.version || 1,
        abilityScoreIncrease: race.abilityScoreIncrease,
        size: race.size,
        speed: race.speed,
        traits: race.traits?.map((t: any, tidx: number) => ({
            _key: `trait-${tidx}`,
            name: typeof t === 'string' ? t : t.name,
            description: typeof t === 'string' ? '' : t.description,
        })),
        languages: race.languages,
        subraces: race.subraces,
        racialSpellChoices: race.racialSpellChoices?.map((choice: any, cidx: number) => ({
            _key: `spell-choice-${cidx}`,
            choose: choice.choose,
            name: choice.name,
            list: choice.list,
            school: choice.school,
            level: choice.level,
        })),
        racialKnownSpells: race.racialKnownSpells?.map((spell: any, sidx: number) => ({
            _key: `known-spell-${sidx}`,
            level: spell.level,
            spellId: spell.spellId,
            abilityScore: spell.abilityScore,
            type: spell.type,
            spellName: spell.name,
        })),
    }));

    await batchCreate(documents);
    console.log(`✅ Migrated ${documents.length} races`);
}

// ===== MIGRATE BACKGROUNDS =====
async function migrateBackgrounds() {
    console.log('\n🎭 Migrating Backgrounds...');

    const documents = BACKGROUNDS.map((bg: any) => ({
        _id: `background-${toSanityId(bg.id)}`,
        _type: 'background',
        name: bg.name,
        slug: { _type: 'slug', current: bg.id },
        description: bg.description,
        source: bg.source || 'Official',
        edition: bg.edition || 'Both',
        version: bg.version || 1,
        skillProficiencies: bg.skillProficiencies,
        toolProficiencies: bg.toolProficiencies,
        languages: bg.languages,
        equipment: bg.equipment,
        feature: bg.feature,
    }));

    await batchCreate(documents);
    console.log(`✅ Migrated ${documents.length} backgrounds`);
}

// ===== MIGRATE SPELLS =====
async function migrateSpells() {
    console.log('\n✨ Migrating Spells...');

    // Use expanded spells which includes most spells
    const documents = SPELLS.map((spell: any, idx: number) => ({
        _id: `spell-${toSanityId(spell.id)}-${idx}`,
        _type: 'spell',
        name: spell.name,
        slug: { _type: 'slug', current: spell.id },
        level: spell.level,
        school: spell.school,
        castingTime: spell.castingTime,
        range: spell.range,
        components: spell.components,
        duration: spell.duration,
        concentration: spell.concentration || false,
        ritual: spell.ritual || false,
        description: spell.description,
        higherLevels: spell.higherLevels,
        classes: spell.classes,
        source: spell.source || 'Official',
        edition: spell.edition || 'Both',
        version: spell.version || 1,
    }));

    await batchCreate(documents);
    console.log(`✅ Migrated ${documents.length} spells`);
}

// ===== MIGRATE FEATS =====
async function migrateFeats() {
    console.log('\n⚔️ Migrating Feats...');

    // Combine and deduplicate feats
    const allFeats = FEATS;
    const seenIds = new Set<string>();
    const uniqueFeats = allFeats.filter((feat: any) => {
        if (seenIds.has(feat.id)) return false;
        seenIds.add(feat.id);
        return true;
    });

    const documents = uniqueFeats.map((feat: any, idx: number) => ({
        _id: `feat-${toSanityId(feat.id)}-${idx}`,
        _type: 'feat',
        name: feat.name,
        slug: { _type: 'slug', current: feat.id },
        description: feat.description,
        source: feat.source || 'Official',
        edition: feat.edition || 'Both',
        version: feat.version || 1,
        prerequisites: feat.prerequisites,
        benefits: feat.benefits,
    }));

    await batchCreate(documents);
    console.log(`✅ Migrated ${documents.length} feats`);
}

// ===== MIGRATE ITEMS =====
async function migrateItems() {
    console.log('\n🗡️ Migrating Items...');

    // Combine and deduplicate items
    const allItems = ITEMS;
    const seenIds = new Set<string>();
    const uniqueItems = allItems.filter((item: any) => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
    });

    const documents = uniqueItems.map((item: any, idx: number) => ({
        _id: `item-${toSanityId(item.id)}-${idx}`,
        _type: 'item',
        name: item.name,
        slug: { _type: 'slug', current: item.id },
        type: item.type,
        description: item.description,
        magical: item.magical,
        rarity: item.rarity,
        requiresAttunement: item.requiresAttunement,
        cost: item.cost,
        weight: item.weight,
        properties: item.properties,
        source: item.source || 'Official',
        edition: item.edition || 'Both',
        version: item.version || 1,
    }));

    await batchCreate(documents);
    console.log(`✅ Migrated ${documents.length} items`);
}

// ===== MAIN MIGRATION =====
async function runMigration() {
    console.log('🚀 Starting D&D Data Migration to Sanity...');
    console.log('='.repeat(50));

    try {
        await migrateClasses();
        await migrateSubclasses();
        await migrateRaces();
        await migrateBackgrounds();
        await migrateSpells();
        await migrateFeats();
        await migrateItems();

        console.log('\n' + '='.repeat(50));
        console.log('🎉 Migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
