/**
 * Generate NDJSON files for Sanity import
 * 
 * Usage:
 * 1. Run: npx tsx src/scripts/generate-ndjson.ts
 * 2. Import: cd studio && npx sanity dataset import ../ndjson-export/all-data.ndjson production
 */

import * as fs from 'fs';
import * as path from 'path';

// Import all the data
import { combinedClasses } from '../data/mock-classes';
import { species } from '../data/mock-races';
import { extraRaces } from '../data/extra-races';
import { mockBackgrounds } from '../data/mock-backgrounds';
import { expandedSpells } from '../data/expanded-spells';
import { MOCK_FEATS } from '../data/mock-feats';
import { expandedFeats } from '../data/expanded-feats';
import { mockItems } from '../data/mock-items';
import { expandedItems } from '../data/expanded-items';
import { mockSubclasses } from '../data/mock-subclasses';

// Helper to create a valid Sanity ID from a string
function toSanityId(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Create output directory
const outputDir = path.join(process.cwd(), 'ndjson-export');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const allDocuments: unknown[] = [];

// ===== CLASSES =====
console.log('📚 Processing Classes...');
const classDocuments = combinedClasses.map((cls) => ({
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
    features: cls.features?.map((f, idx) => ({
        _key: `feature-${idx}`,
        level: f.level,
        name: f.name,
        description: f.description,
    })),
    subclasses: cls.subclasses,
}));
allDocuments.push(...classDocuments);
console.log(`  ${classDocuments.length} classes`);

// ===== SUBCLASSES =====
console.log('📖 Processing Subclasses...');
const subclassDocuments = mockSubclasses.map((sub, idx) => ({
    _id: `subclass-${toSanityId(sub.id)}-${idx}`,
    _type: 'subclass',
    name: sub.name,
    slug: { _type: 'slug', current: sub.id },
    parentClassId: sub.parentClassId,
    description: sub.description,
    source: sub.source || 'Official',
    edition: sub.edition || 'Both',
    version: sub.version || 1,
    features: sub.features?.map((f, fidx) => ({
        _key: `feature-${fidx}`,
        level: f.level,
        name: f.name,
        description: f.description,
    })),
}));
allDocuments.push(...subclassDocuments);
console.log(`  ${subclassDocuments.length} subclasses`);

// ===== RACES =====
console.log('🧝 Processing Races...');
const allRaces = [...species, ...extraRaces];
const seenRaceIds = new Set<string>();
const uniqueRaces = allRaces.filter((race) => {
    if (seenRaceIds.has(race.id)) return false;
    seenRaceIds.add(race.id);
    return true;
});

const raceDocuments = uniqueRaces.map((race, idx) => ({
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
    traits: race.traits?.map((t, tidx) => ({
        _key: `trait-${tidx}`,
        name: typeof t === 'string' ? t : t.name,
        description: typeof t === 'string' ? '' : t.description,
    })),
    languages: race.languages,
    subraces: race.subraces,
    racialSpellChoices: race.racialSpellChoices?.map((choice, cidx) => ({
        _key: `spell-choice-${cidx}`,
        choose: choice.choose,
        name: choice.name,
        list: choice.list,
        school: choice.school,
        level: choice.level,
    })),
    racialKnownSpells: race.racialKnownSpells?.map((spell, sidx) => ({
        _key: `known-spell-${sidx}`,
        level: spell.level,
        spellId: spell.spellId,
        abilityScore: spell.abilityScore,
        type: spell.type,
        spellName: spell.name,
    })),
}));
allDocuments.push(...raceDocuments);
console.log(`  ${raceDocuments.length} races`);

// ===== BACKGROUNDS =====
console.log('🎭 Processing Backgrounds...');
const backgroundDocuments = mockBackgrounds.map((bg) => ({
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
allDocuments.push(...backgroundDocuments);
console.log(`  ${backgroundDocuments.length} backgrounds`);

// ===== SPELLS =====
console.log('✨ Processing Spells...');
const spellDocuments = expandedSpells.map((spell, idx) => ({
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
allDocuments.push(...spellDocuments);
console.log(`  ${spellDocuments.length} spells`);

// ===== FEATS =====
console.log('⚔️ Processing Feats...');
const allFeats = [...MOCK_FEATS, ...expandedFeats];
const seenFeatIds = new Set<string>();
const uniqueFeats = allFeats.filter((feat) => {
    if (seenFeatIds.has(feat.id)) return false;
    seenFeatIds.add(feat.id);
    return true;
});

const featDocuments = uniqueFeats.map((feat, idx) => ({
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
allDocuments.push(...featDocuments);
console.log(`  ${featDocuments.length} feats`);

// ===== ITEMS =====
console.log('🗡️ Processing Items...');
const allItems = [...mockItems, ...expandedItems];
const seenItemIds = new Set<string>();
const uniqueItems = allItems.filter((item) => {
    if (seenItemIds.has(item.id)) return false;
    seenItemIds.add(item.id);
    return true;
});

const itemDocuments = uniqueItems.map((item, idx) => ({
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
allDocuments.push(...itemDocuments);
console.log(`  ${itemDocuments.length} items`);

// Write NDJSON file
console.log('\n📝 Writing NDJSON file...');
const ndjsonContent = allDocuments.map(doc => JSON.stringify(doc)).join('\n');
const outputPath = path.join(outputDir, 'all-data.ndjson');
fs.writeFileSync(outputPath, ndjsonContent);

console.log(`\n✅ Export complete!`);
console.log(`   Total documents: ${allDocuments.length}`);
console.log(`   Output file: ${outputPath}`);
console.log(`\n📥 To import into Sanity:`);
console.log(`   cd studio && npx sanity dataset import ../ndjson-export/all-data.ndjson production`);
