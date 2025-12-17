
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as vm from 'vm';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const projectId = process.env.SANITY_API_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_API_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration. Please check .env file.');
    console.error({ projectId, dataset, token: token ? '***' : 'missing' });
    process.exit(1);
}

const client = createClient({
    projectId,
    dataset,
    token,
    useCdn: false,
    apiVersion: '2024-01-01',
});

const DATA_DIR = path.resolve(process.cwd(), 'src/data');

// Helper to load TS data files without compiling them
function loadMockData(relativePath: string) {
    const filePath = path.isAbsolute(relativePath) ? relativePath : path.resolve(process.cwd(), relativePath);
    if (!fs.existsSync(filePath)) {
        return {};
    }
    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Remove imports (handling multi-line)
    content = content.replace(/import\s+[\s\S]*?\s+from\s+['"].*?['"];?/g, '');
    // Remove export { ... } blocks
    content = content.replace(/export\s*\{[\s\S]*?\};?/g, '');

    // 2. Transform "export const X = " to "exports.X = "
    // And strip type annotations like ": Spell[]" or ": Background[]"
    const transformedContent = content
        .replace(/export const (\w+)\s*:?\s*[\w\[\]]*\s*=/g, 'exports.$1 =');

    const sandbox = { exports: {} as any };
    vm.createContext(sandbox);

    try {
        vm.runInContext(transformedContent, sandbox);
        return sandbox.exports;
    } catch (e) {
        console.error(`Error parsing ${relativePath}:`, e);
        throw e;
    }
}

async function migrateClasses() {
    console.log('Migrating Classes...');
    const { CLASSES } = loadMockData(path.join(DATA_DIR, 'classes.ts'));
    if (!CLASSES) {
        console.log('No CLASSES found.');
        return;
    }
    console.log(`Found ${CLASSES.length} classes.`);

    for (const cls of CLASSES) {
        const docId = `class-${cls.id}`;
        const exists = await client.getDocument(docId);

        if (!exists) {
            console.log(`Creating Class: ${cls.name} (${cls.id})`);
            await client.createOrReplace({
                _id: docId,
                _type: 'class',
                name: cls.name,
                slug: { _type: 'slug', current: cls.id },
                description: cls.description,
                hitDie: cls.hitDie,
                primaryAbility: cls.primaryAbility,
                savingThrows: cls.savingThrows,
                spellcaster: cls.spellcaster === true ? 'full' : (cls.spellcaster || 'none'),
                spellcastingAbility: cls.spellcastingAbility,
                source: cls.source || 'Official',
                edition: cls.edition || '5e',
                version: cls.version || 1,
                features: cls.features?.map((f: any) => ({
                    _type: 'classFeature',
                    _key: `${f.level}-${f.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
                    level: f.level,
                    name: f.name,
                    description: f.description
                }))
            });
        } else {
            console.log(`Class ${cls.name} already exists. Skipping.`);
        }
    }
}

async function migrateSubclasses() {
    console.log('Migrating Subclasses...');
    const { SUBCLASSES } = loadMockData(path.join(DATA_DIR, 'subclasses.ts'));
    if (!SUBCLASSES) {
        console.log('No SUBCLASSES found.');
        return;
    }
    console.log(`Found ${SUBCLASSES.length} subclasses.`);

    for (const sub of SUBCLASSES) {
        const slug = sub.id;
        const docId = `subclass-${slug}`;
        const exists = await client.getDocument(docId);

        if (!exists) {
            console.log(`Creating Subclass: ${sub.name} (${sub.id}) for ${sub.parentClassId}`);
            await client.createOrReplace({
                _id: docId,
                _type: 'subclass',
                name: sub.name,
                slug: { _type: 'slug', current: sub.id },
                parentClassId: sub.parentClassId,
                description: sub.description,
                source: sub.source || 'Official',
                edition: sub.edition || '5e',
                version: sub.version || 1,
                magicType: sub.magicType,
                magicAbility: sub.magicAbility,
                magicDescription: sub.magicDescription,
                spellcaster: sub.spellcaster === true,
                features: sub.features?.map((f: any) => ({
                    _type: 'subclassFeature',
                    _key: `${f.level || 1}-${f.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`,
                    level: f.level || 1,
                    name: f.name,
                    description: f.description
                }))
            });
        } else {
            console.log(`Subclass ${sub.name} already exists. Skipping.`);
        }
    }
}

async function migrateRaces() {
    console.log('Migrating Races...');
    const { RACES } = loadMockData(path.join(DATA_DIR, 'races.ts'));

    // Hardcoded SUBRACES to avoid parsing issues
    const SUBRACES = [
        {
            id: "high-elf",
            parentRaceId: "elf",
            name: "High Elf",
            description: "As a high elf, you have a keen mind and a mastery of at least the basics of magic.",
            source: "Official",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: { INT: 1 },
            traits: [
                { name: "Elf Weapon Training", description: "Proficiency with longsword, shortsword, shortbow, longbow" },
                { name: "Cantrip", description: "One wizard cantrip of your choice" },
                { name: "Extra Language", description: "One additional language" },
            ],
            racialSpellChoices: [
                {
                    choose: 1,
                    list: ["cantrip:wizard"],
                    name: "High Elf Cantrip"
                }
            ]
        },
        {
            id: "wood-elf",
            parentRaceId: "elf",
            name: "Wood Elf",
            description: "As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests.",
            source: "Official",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: { WIS: 1 },
            traits: [
                { name: "Elf Weapon Training", description: "Proficiency with longsword, shortsword, shortbow, longbow" },
                { name: "Fleet of Foot", description: "Base speed 35 ft." },
                { name: "Mask of the Wild", description: "Hide in light natural phenomena" },
            ]
        },
        {
            id: "drow",
            parentRaceId: "elf",
            name: "Drow (Dark Elf)",
            description: "Descended from an earlier subrace of dark-skinned elves, the drow were banished from the surface world for following the goddess Lolth down the path to evil and corruption.",
            source: "Official",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: { CHA: 1 },
            traits: [
                { name: "Superior Darkvision", description: "120 ft." },
                { name: "Sunlight Sensitivity", description: "Disadvantage in bright light" },
                { name: "Drow Magic", description: "Dancing lights cantrip, faerie fire, darkness" },
                { name: "Drow Weapon Training", description: "Proficiency with rapiers, shortswords, and hand crossbows" },
            ]
        },
        {
            id: "hill-dwarf",
            parentRaceId: "dwarf",
            name: "Hill Dwarf",
            description: "As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.",
            source: "Official",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: { WIS: 1 },
            traits: [{ name: "Dwarven Toughness", description: "+1 HP per level" }]
        },
        {
            id: "mountain-dwarf",
            parentRaceId: "dwarf",
            name: "Mountain Dwarf",
            description: "As a mountain dwarf, you're strong and hardy, accustomed to a difficult life in rugged terrain.",
            source: "Official",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: { STR: 2 },
            traits: [{ name: "Dwarven Armor Training", description: "Proficiency with light and medium armor" }]
        },
        {
            id: "lightfoot-halfling",
            parentRaceId: "halfling",
            name: "Lightfoot Halfling",
            description: "As a lightfoot halfling, you can easily hide from notice, even using other people as cover.",
            source: "Official",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: { CHA: 1 },
            traits: [{ name: "Naturally Stealthy", description: "Hide behind creatures one size larger" }]
        },
        {
            id: "stout-halfling",
            parentRaceId: "halfling",
            name: "Stout Halfling",
            description: "As a stout halfling, you're hardier than average and have some resistance to poison.",
            source: "Official",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: { CON: 1 },
            traits: [{ name: "Stout Resilience", description: "Advantage on saves against poison, resistance to poison damage" }]
        },
        {
            id: "half-elf-standard",
            parentRaceId: "half-elf",
            name: "Half-Elf (Standard)",
            description: "The most common versatility of half-elves.",
            source: "Player's Handbook",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: {},
            traits: [
                { name: "Skill Versatility", description: "You gain proficiency in two skills of your choice." }
            ]
        },
        {
            id: "half-elf-high-variant",
            parentRaceId: "half-elf",
            name: "Half-Elf (High Elf Descent)",
            description: "Some half-elves have a stronger connection to their high elf heritage.",
            source: "SCAG / PHB",
            edition: "Both",
            version: 1,
            abilityScoreIncrease: {},
            traits: [
                { name: "High Elf Descent", description: "You know one wizard cantrip of your choice. Intelligence is your spellcasting ability for it." }
            ],
            racialSpellChoices: [
                {
                    choose: 1,
                    list: ["cantrip:wizard"],
                    name: "High Elf Descent"
                }
            ]
        }
    ];

    let allRaces = RACES || [];
    if (SUBRACES) {
        console.log(`Found ${SUBRACES.length} subraces to migrate as races.`);
        allRaces = [...allRaces, ...SUBRACES];
    }

    if (allRaces.length === 0) {
        console.log('No RACES found.');
        return;
    }
    console.log(`Found ${allRaces.length} total races.`);

    for (const race of allRaces) {
        // Handle ID: subraces might clash if not careful, but usually unique ids
        const docId = `race-${race.id}`;
        try {
            const exists = await client.getDocument(docId);
            if (exists) {
                console.log(`Race ${race.name} already exists. Skipping.`);
                continue;
            }
        } catch (e) { }

        console.log(`Creating Race: ${race.name} (${race.id})`);

        // 1. Process Traits
        const traitRefs = [];
        if (race.traits) {
            for (const trait of race.traits) {
                const traitSlug = trait.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                const traitId = `trait-${traitSlug}`;

                // Create trait if missing
                try {
                    await client.createOrReplace({
                        _id: traitId,
                        _type: 'trait',
                        name: trait.name,
                        description: trait.description,
                        slug: { _type: 'slug', current: traitSlug }
                    });
                } catch (e) { console.error('Trait error', e); }

                traitRefs.push({
                    _type: 'reference',
                    _key: traitSlug,
                    _ref: traitId
                });
            }
        }

        // 2. Process Spells
        const spellGrants = [];
        if (race.racialKnownSpells) {
            for (const spell of race.racialKnownSpells) {
                // Assuming spellId is the slug or ID mostly
                // Spell IDs in mock are like 'produce-flame'
                const spellRefId = `spell-${spell.spellId}`;
                // We use weak ref because spells might not be migrated yet

                spellGrants.push({
                    _key: `spell-${spell.spellId}`,
                    _type: 'spellGrant',
                    name: spell.name || spell.spellId,
                    mode: 'fixed',
                    level: spell.level || 0, // default to cantrip if missing
                    ability: spell.abilityScore,
                    recharge: (spell.type === '1/day' ? 'day' : spell.type) || 'day',
                    specificSpells: [{
                        _type: 'reference',
                        _weak: true,
                        _ref: spellRefId,
                        _key: spellRefId
                    }]
                });
            }
        }

        // 3. Create Race
        try {
            await client.createOrReplace({
                _id: docId,
                _type: 'race',
                name: race.name,
                slug: { _type: 'slug', current: race.id },
                description: race.description,
                source: race.source || 'Official',
                edition: race.edition || '5e',
                version: race.version || 1,
                size: race.size,
                speed: race.speed,
                abilityScoreIncrease: race.abilityScoreIncrease,
                languages: race.languages,
                traits: traitRefs,
                spells: spellGrants.length > 0 ? spellGrants : undefined,
            });
        } catch (err: any) {
            console.error(`Failed to create race ${race.name}:`, err.message);
        }
    }
}

async function migrateSpells() {
    console.log('Migrating Spells...');
    const { SPELLS } = loadMockData(path.join(DATA_DIR, 'spells.ts'));
    if (!SPELLS) {
        console.log('No SPELLS found.');
        return;
    }
    console.log(`Found ${SPELLS.length} spells.`);

    for (const spell of SPELLS) {
        const docId = `spell-${spell.id}`;
        try {
            const existing = await client.getDocument(docId);
            if (existing) {
                console.log(`Spell ${spell.name} already exists. Skipping.`);
                continue;
            }
        } catch (e) { }

        const doc = {
            _id: docId,
            _type: 'spell',
            name: spell.name,
            slug: { _type: 'slug', current: spell.id },
            level: spell.level,
            school: spell.school,
            castingTime: spell.castingTime,
            range: spell.range,
            components: {
                verbal: spell.components?.verbal || false,
                somatic: spell.components?.somatic || false,
                material: spell.components?.material || false,
                materialDescription: typeof spell.components?.material === 'string' ? spell.components.material : undefined
            },
            duration: spell.duration,
            concentration: spell.concentration || false,
            ritual: spell.ritual || false,
            description: spell.description,
            higherLevels: spell.higherLevels,
            classes: spell.classes,
            source: spell.source || 'Official',
            edition: spell.edition,
            version: spell.version
        };

        try {
            await client.createOrReplace(doc);
            console.log(`Migrated spell: ${spell.name}`);
        } catch (err: any) {
            console.error(`Failed to migrate spell ${spell.name}:`, err.message);
        }
    }
}

async function migrateBackgrounds() {
    console.log('Migrating Backgrounds...');
    const { BACKGROUNDS } = loadMockData(path.join(DATA_DIR, 'backgrounds.ts'));
    if (!BACKGROUNDS) {
        console.log('No BACKGROUNDS found.');
        return;
    }
    console.log(`Found ${BACKGROUNDS.length} backgrounds.`);

    for (const bg of BACKGROUNDS) {
        const docId = `background-${bg.id}`;
        try {
            const existing = await client.getDocument(docId);
            if (existing) {
                console.log(`Background ${bg.name} already exists. Skipping.`);
                continue;
            }
        } catch (e) { }

        const doc = {
            _id: docId,
            _type: 'background',
            name: bg.name,
            slug: { _type: 'slug', current: bg.id },
            description: bg.description,
            skillProficiencies: bg.skillProficiencies,
            toolProficiencies: bg.toolProficiencies,
            languages: bg.languages,
            equipment: bg.equipment,
            feature: bg.feature ? {
                name: bg.feature.name,
                description: bg.feature.description
            } : undefined,
            source: bg.source || 'Official',
            edition: bg.edition,
            version: bg.version
        };

        try {
            await client.createOrReplace(doc);
            console.log(`Migrated background: ${bg.name}`);
        } catch (err: any) {
            console.error(`Failed to migrate background ${bg.name}:`, err.message);
        }
    }
}

async function migrateFeats() {
    console.log('Migrating Feats...');
    const { FEATS } = loadMockData(path.join(DATA_DIR, 'feats.ts'));
    if (!FEATS) {
        console.log('No FEATS found.');
        return;
    }
    console.log(`Found ${FEATS.length} feats.`);

    for (const feat of FEATS) {
        const idBase = feat.id.startsWith('feat-') ? feat.id : `feat-${feat.id}`;
        const docId = idBase;

        try {
            const existing = await client.getDocument(docId);
            if (existing) {
                console.log(`Feat ${feat.name} already exists. Skipping.`);
                continue;
            }
        } catch (e) { }

        const doc = {
            _id: docId,
            _type: 'feat',
            name: feat.name,
            slug: { _type: 'slug', current: feat.id },
            description: feat.description,
            benefits: feat.benefits ? {
                abilityScoreIncrease: feat.benefits.abilityScoreIncrease,
                features: feat.benefits.features
            } : undefined,
            prerequisites: feat.prerequisites,
            source: feat.source || 'Official',
            edition: feat.edition,
            version: feat.version
        };

        try {
            await client.createOrReplace(doc);
            console.log(`Migrated feat: ${feat.name}`);
        } catch (err: any) {
            console.error(`Failed to migrate feat ${feat.name}:`, err.message);
        }
    }
}

async function migrateItems() {
    console.log('Migrating Items...');
    const { ITEMS } = loadMockData(path.join(DATA_DIR, 'items.ts'));
    if (!ITEMS) {
        console.log('No ITEMS found.');
        return;
    }
    console.log(`Found ${ITEMS.length} items.`);

    for (const item of ITEMS) {
        const docId = `item-${item.id}`;
        try {
            const existing = await client.getDocument(docId);
            if (existing) {
                console.log(`Item ${item.name} already exists. Skipping.`);
                continue;
            }
        } catch (e) { }

        const doc = {
            _id: docId,
            _type: 'item',
            name: item.name,
            slug: { _type: 'slug', current: item.id },
            type: item.type,
            rarity: item.rarity,
            description: item.description,
            requiresAttunement: item.requiresAttunement,
            cost: item.cost,
            weight: item.weight,
            properties: item.properties,
            magical: item.magical,
            source: item.source || 'Official',
            edition: item.edition,
            version: item.version
        };

        try {
            await client.createOrReplace(doc);
            console.log(`Migrated item: ${item.name}`);
        } catch (err: any) {
            console.error(`Failed to migrate item ${item.name}:`, err.message);
        }
    }
}

async function startMigration() {
    console.log('Starting all migrations...');
    try {
        await migrateClasses();
        await migrateSubclasses();
        // Races include Subraces
        await migrateRaces();
        await migrateSpells();
        await migrateBackgrounds();
        await migrateFeats();
        await migrateItems();
        console.log('All migrations completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

startMigration();
