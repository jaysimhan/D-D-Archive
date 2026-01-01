/**
 * Migration script to add Monster Hunter class and subclasses to Sanity
 * 
 * This is an UNOFFICIAL class for D&D 5e (2014 edition)
 * 
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/add-monster-hunter-class.ts --with-user-token
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

// ===== MONSTER HUNTER CLASS =====
const MONSTER_HUNTER_CLASS = {
    _id: 'class-monster-hunter',
    _type: 'class',
    name: 'Monster Hunter',
    slug: { _type: 'slug', current: 'monster-hunter' },
    description: 'Specialized professionals who track and slay supernatural threats using intellect, martial prowess, and specific lore. They are neither rangers of the wild nor soldiers of war, but learned exterminators.',
    source: 'Unofficial',
    edition: '2014',
    version: 1,
    hitDie: 10,
    primaryAbility: ['STR', 'DEX', 'INT'],
    savingThrows: ['STR', 'DEX'],
    subclassLevel: 3,
    isSpellcaster: false,
    proficiencies: [
        {
            _key: 'prof-armor-1',
            _type: 'proficiencyRule',
            type: 'armor',
            mode: 'fixed',
            armorOptions: ['Light Armor', 'Medium Armor', 'Shields'],
        },
        {
            _key: 'prof-weapon-1',
            _type: 'proficiencyRule',
            type: 'weapon',
            mode: 'fixed',
            weaponOptions: ['Simple Weapons', 'Martial Weapons'],
        },
        {
            _key: 'prof-skill-1',
            _type: 'proficiencyRule',
            type: 'skill',
            mode: 'choice',
            count: 2,
            skillOptions: ['Athletics', 'History', 'Investigation', 'Medicine', 'Nature', 'Perception', 'Religion', 'Survival'],
        },
    ],
    features: [
        {
            _key: 'feature-1',
            level: 1,
            name: 'Monster Grimoire',
            description: 'You choose specific creature types (e.g., Undead, Fiends) to specialize in. You gain proficiency (or double proficiency) on Intelligence/Wisdom checks regarding them. Later, you gain combat bonuses against them.',
        },
        {
            _key: 'feature-2',
            level: 2,
            name: "Hunter's Instincts",
            description: "As a bonus action, make an Investigation check (DC = 5 + CR) to learn a creature's Immunities, Resistances, Vulnerabilities, or Type.",
        },
        {
            _key: 'feature-3',
            level: 2,
            name: 'Fighting Style',
            description: 'Choose a standard martial fighting style (Archery, Dueling, Great Weapon Fighting, Two-Weapon Fighting).',
        },
        {
            _key: 'feature-4',
            level: 4,
            name: 'Ability Score Improvement',
            description: 'You can increase one ability score by 2, or two ability scores by 1. You cannot increase an ability score above 20.',
        },
        {
            _key: 'feature-5',
            level: 5,
            name: 'Extra Attack',
            description: 'You can attack twice, instead of once, whenever you take the Attack action on your turn.',
        },
        {
            _key: 'feature-6',
            level: 5,
            name: 'Grave Strike',
            description: 'When you hit with an attack, you can expend a use to deal extra damage equal to 1d8 × your Intelligence Modifier. You can use this a number of times equal to your Intelligence modifier per long rest.',
        },
        {
            _key: 'feature-7',
            level: 8,
            name: 'Ability Score Improvement',
            description: 'You can increase one ability score by 2, or two ability scores by 1. You cannot increase an ability score above 20.',
        },
        {
            _key: 'feature-8',
            level: 9,
            name: 'Steel Mind',
            description: 'Also called Knowledgeable Defense. You gain Advantage on Int/Wis/Cha saves against your Grimoire monsters, or can use Int saves in place of others against them.',
        },
        {
            _key: 'feature-9',
            level: 12,
            name: 'Ability Score Improvement',
            description: 'You can increase one ability score by 2, or two ability scores by 1. You cannot increase an ability score above 20.',
        },
        {
            _key: 'feature-10',
            level: 16,
            name: 'Ability Score Improvement',
            description: 'You can increase one ability score by 2, or two ability scores by 1. You cannot increase an ability score above 20.',
        },
        {
            _key: 'feature-11',
            level: 19,
            name: 'Ability Score Improvement',
            description: 'You can increase one ability score by 2, or two ability scores by 1. You cannot increase an ability score above 20.',
        },
    ],
};

// ===== SUBCLASSES =====
const SUBCLASSES = [
    // ===== THE CARVER GUILD =====
    {
        _id: 'subclass-carver-guild',
        _type: 'subclass',
        name: 'The Carver Guild',
        slug: { _type: 'slug', current: 'carver-guild' },
        parentClassId: 'monster-hunter',
        description: 'The "Brute" option. For hunters who rely on raw power, heavy armor, and close-range dominance. Playstyle: Tank / Frontline Striker.',
        source: 'Unofficial',
        edition: '2014',
        version: 1,
        isSpellcaster: false,
        proficiencies: [
            {
                _key: 'prof-armor-1',
                _type: 'proficiencyRule',
                type: 'armor',
                mode: 'fixed',
                armorOptions: ['Heavy Armor'],
            },
        ],
        features: [
            {
                _key: 'feature-1',
                level: 3,
                name: 'Bonus Proficiency',
                description: 'You gain proficiency with Heavy Armor.',
            },
            {
                _key: 'feature-2',
                level: 3,
                name: 'Close Quarters Combat',
                description: 'When you hit a creature with a melee attack, you can "mark" them. If they are adjacent to you, they have disadvantage on attacks against anyone but you.',
            },
            {
                _key: 'feature-3',
                level: 3,
                name: 'True Grit',
                description: 'You are immune to the Frightened condition from creatures in your Monster Grimoire.',
            },
            {
                _key: 'feature-4',
                level: 7,
                name: 'Improved Salvage',
                description: 'You harvest double the loot/reagents from slain monsters and have advantage on the checks to do so.',
            },
            {
                _key: 'feature-5',
                level: 10,
                name: 'Grave Riposte',
                description: 'If a marked creature misses you or attacks someone else, you can use your Reaction to make a melee attack (or Grave Strike) against them.',
            },
            {
                _key: 'feature-6',
                level: 15,
                name: 'Terror of Terrors',
                description: 'When you use Grave Strike, the target must make a Wisdom save or be Frightened of you.',
            },
        ],
    },
    // ===== THE DEVOURER GUILD =====
    {
        _id: 'subclass-devourer-guild',
        _type: 'subclass',
        name: 'The Devourer Guild',
        slug: { _type: 'slug', current: 'devourer-guild' },
        parentClassId: 'monster-hunter',
        description: 'The "Mutant" option (Witcher-style). They consume monster organs to gain temporary buffs, risking toxicity. Playstyle: High Risk / Versatile Buffer.',
        source: 'Unofficial',
        edition: '2014',
        version: 1,
        isSpellcaster: false,
        proficiencies: [
            {
                _key: 'prof-tool-1',
                _type: 'proficiencyRule',
                type: 'tool',
                mode: 'fixed',
                toolOptions: ["Alchemist's Supplies", "Cook's Utensils"],
            },
        ],
        features: [
            {
                _key: 'feature-1',
                level: 3,
                name: 'Transmuting Metabolism',
                description: 'You can harvest "portions" (organs) from dead monsters. As a bonus action, you consume one to gain a buff based on the creature type (e.g., Dragon = Fly speed; Troll/Beast = Regeneration; Fiend = Magic Resistance). You can safely eat 1 + Con Mod portions; eating more causes Exhaustion.',
            },
            {
                _key: 'feature-2',
                level: 3,
                name: 'Alchemical Gastronomy',
                description: "You gain proficiency with Alchemist's Supplies and Cooking Utensils.",
            },
            {
                _key: 'feature-3',
                level: 7,
                name: 'Metabolized Constitution',
                description: 'You gain Advantage on saves vs. Poison and Resistance to Poison damage (or Immunity if you already have resistance).',
            },
            {
                _key: 'feature-4',
                level: 10,
                name: 'Adrenaline Rush',
                description: 'Your toxicity limit increases (can eat 2 + Con Mod portions) or you gain speed/strength buffs when consuming portions.',
            },
        ],
    },
    // ===== THE OCCULTIST GUILD =====
    {
        _id: 'subclass-occultist-guild',
        _type: 'subclass',
        name: 'The Occultist Guild',
        slug: { _type: 'slug', current: 'occultist-guild' },
        parentClassId: 'monster-hunter',
        description: 'The "Gish" option. Hunters who fight magic with magic, specializing in killing spellcasters. Playstyle: Anti-Mage / 1/3 Caster. Uses Intelligence for spellcasting (Wizard spell list, limited schools).',
        source: 'Unofficial',
        edition: '2014',
        version: 1,
        isSpellcaster: true,
        magicType: 'Spell Slots (Wizard List)',
        magicAbility: 'Intelligence',
        magicDescription: 'You gain spellcasting progression similar to Eldritch Knight, using Intelligence as your spellcasting ability and the Wizard spell list.',
        proficiencies: [
            {
                _key: 'prof-skill-1',
                _type: 'proficiencyRule',
                type: 'skill',
                mode: 'fixed',
                skillOptions: ['Arcana'],
            },
        ],
        features: [
            {
                _key: 'feature-1',
                level: 3,
                name: 'Pact Magic',
                description: 'You learn cantrips and gain spell slots (progression similar to Eldritch Knight).',
            },
            {
                _key: 'feature-2',
                level: 3,
                name: 'Acolyte of the Occult',
                description: 'You gain proficiency in the Arcana skill and access to Detect Magic or Identify as rituals.',
            },
            {
                _key: 'feature-3',
                level: 7,
                name: 'Arcane Interference',
                description: 'You gain benefits when damaging concentrating enemies or can use reactions to disrupt teleportation/casting (similar to Mage Slayer).',
            },
            {
                _key: 'feature-4',
                level: 10,
                name: 'Occult Knowledge',
                description: 'You can cast any spell you have prepared as a Ritual if it has the tag, and you learn extra rituals from any class list.',
            },
        ],
    },
    // ===== THE TRAPPER GUILD =====
    {
        _id: 'subclass-trapper-guild',
        _type: 'subclass',
        name: 'The Trapper Guild',
        slug: { _type: 'slug', current: 'trapper-guild' },
        parentClassId: 'monster-hunter',
        description: 'The "Tactician" option. Uses gadgets, bombs, and preparation to control the battlefield. Playstyle: Controller / Utility.',
        source: 'Unofficial',
        edition: '2014',
        version: 1,
        isSpellcaster: false,
        proficiencies: [
            {
                _key: 'prof-tool-1',
                _type: 'proficiencyRule',
                type: 'tool',
                mode: 'fixed',
                toolOptions: ["Thieves' Tools", "Tinker's Tools"],
            },
        ],
        features: [
            {
                _key: 'feature-1',
                level: 3,
                name: 'Trapper Gadgets',
                description: 'You learn to craft special items. You can create 2 per long rest for free. Examples include: Elemental Ammo (adds elemental damage to attacks), Silver Bomb (negates resistances of supernatural creatures in an area), Scorpion Anchor (restrains flying or fleeing enemies), Push Plate (reactive armor that knocks attackers back).',
            },
            {
                _key: 'feature-2',
                level: 3,
                name: 'Sneaky and Crafty',
                description: "You gain proficiency with Thieves' Tools and Tinker's Tools (or Expertise if already proficient).",
            },
            {
                _key: 'feature-3',
                level: 7,
                name: "Ambusher's Advantage",
                description: "You have Advantage on initiative rolls and on attacks against creatures that haven't acted yet.",
            },
            {
                _key: 'feature-4',
                level: 15,
                name: 'Monster-Hide Armor',
                description: 'You can craft custom masterwork armor from monster parts that grants permanent resistances or AC bonuses.',
            },
        ],
    },
];

async function migrateMonsterHunter() {
    console.log('⚔️ Adding Monster Hunter class to Sanity...\n');

    const transaction = client.transaction();

    // Create subclasses first
    for (const subclass of SUBCLASSES) {
        transaction.createOrReplace(subclass as Parameters<typeof transaction.createOrReplace>[0]);
        console.log(`  ✓ Subclass: ${subclass.name}`);
    }

    // Create the class with references to subclasses
    const classWithRefs = {
        ...MONSTER_HUNTER_CLASS,
        subclasses: SUBCLASSES.map((sc) => ({
            _type: 'reference',
            _ref: sc._id,
            _key: toSanityId(sc.name),
        })),
    };

    transaction.createOrReplace(classWithRefs as Parameters<typeof transaction.createOrReplace>[0]);
    console.log(`  ✓ Class: ${MONSTER_HUNTER_CLASS.name}`);

    console.log('\nCommitting to Sanity...');
    await transaction.commit();
    console.log('\n✅ Successfully added Monster Hunter class with 4 subclasses!');
}

async function run() {
    console.log('🚀 Monster Hunter Class Migration (Unofficial 2014 Edition)');
    console.log('='.repeat(50) + '\n');

    try {
        await migrateMonsterHunter();
        console.log('\n' + '='.repeat(50));
        console.log('🎉 Migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

run();
