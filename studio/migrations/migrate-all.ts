/**
 * Migration script to import all D&D data to Sanity
 * 
 * Usage:
 * 1. Navigate to the studio directory: cd studio
 * 2. Run: npx sanity exec migrations/migrate-all.ts --with-user-token
 */

import { createClient } from '@sanity/client';

// Import data from source files (these are relative to the studio folder)
import { combinedClasses } from '../../src/data/mock-classes';
import { species } from '../../src/data/mock-races';
import { mockBackgrounds } from '../../src/data/mock-backgrounds';
import { expandedSpells } from '../../src/data/expanded-spells';
import { MOCK_FEATS } from '../../src/data/mock-feats';
import { expandedFeats } from '../../src/data/expanded-feats';
import { mockItems } from '../../src/data/mock-items';
import { expandedItems } from '../../src/data/expanded-items';
import { mockSubclasses } from '../../src/data/mock-subclasses';
import { extraRaces } from '../../src/data/extra-races';

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

// ===== MIGRATE CLASSES =====
async function migrateClasses() {
    console.log('\\n📚 Migrating Classes...');

    const documents = combinedClasses.map((cls) => ({
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
        features: cls.features?.map((f) => ({
            _key: `feature-${toSanityId(f.name)}-${f.level}`,
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
    console.log('\\n📖 Migrating Subclasses...');

    const documents = mockSubclasses.map((sub) => ({
        _id: `subclass-${toSanityId(sub.id)}`,
        _type: 'subclass',
        name: sub.name,
        slug: { _type: 'slug', current: sub.id },
        parentClassId: sub.parentClassId,
        description: sub.description,
        source: sub.source || 'Official',
        edition: sub.edition || 'Both',
        version: sub.version || 1,
        features: sub.features?.map((f) => ({
            _key: `feature-${toSanityId(f.name)}-${f.level}`,
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
    console.log('\\n🧝 Migrating Races...');

    // Combine and deduplicate races
    const allRaces = [...species, ...extraRaces];
    const seenIds = new Set<string>();
    const uniqueRaces = allRaces.filter((race) => {
        if (seenIds.has(race.id)) return false;
        seenIds.add(race.id);
        return true;
    });

    const documents = uniqueRaces.map((race) => ({
        _id: `race-${toSanityId(race.id)}`,
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
        traits: race.traits?.map((t, idx) => ({
            _key: `trait-${idx}`,
            name: typeof t === 'string' ? t : t.name,
            description: typeof t === 'string' ? '' : t.description,
        })),
        languages: race.languages,
        subraces: race.subraces,
        racialSpellChoices: race.racialSpellChoices?.map((choice, idx) => ({
            _key: `spell-choice-${idx}`,
            choose: choice.choose,
            name: choice.name,
            list: choice.list,
            school: choice.school,
            level: choice.level,
        })),
        racialKnownSpells: race.racialKnownSpells?.map((spell, idx) => ({
            _key: `known-spell-${idx}`,
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
    console.log('\\n🎭 Migrating Backgrounds...');

    const documents = mockBackgrounds.map((bg) => ({
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
    console.log('\\n✨ Migrating Spells...');

    // Use expanded spells which includes most spells
    const documents = expandedSpells.map((spell) => ({
        _id: `spell-${toSanityId(spell.id)}`,
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
    console.log('\\n⚔️ Migrating Feats...');

    // Combine and deduplicate feats
    const allFeats = [...MOCK_FEATS, ...expandedFeats];
    const seenIds = new Set<string>();
    const uniqueFeats = allFeats.filter((feat) => {
        if (seenIds.has(feat.id)) return false;
        seenIds.add(feat.id);
        return true;
    });

    const documents = uniqueFeats.map((feat) => ({
        _id: `feat-${toSanityId(feat.id)}`,
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
    console.log('\\n🗡️ Migrating Items...');

    // Combine and deduplicate items
    const allItems = [...mockItems, ...expandedItems];
    const seenIds = new Set<string>();
    const uniqueItems = allItems.filter((item) => {
        if (seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
    });

    const documents = uniqueItems.map((item) => ({
        _id: `item-${toSanityId(item.id)}`,
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

        console.log('\\n' + '='.repeat(50));
        console.log('🎉 Migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigration();
