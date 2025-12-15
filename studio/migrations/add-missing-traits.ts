/**
 * Script to add missing traits based on wikidot reference and link them to races
 * 
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/add-missing-traits.ts --with-user-token
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

// Missing traits based on wikidot/D&D Beyond reference
const MISSING_TRAITS = [
    // Dragonborn
    {
        name: 'Draconic Ancestry',
        description: 'You are distantly related to a particular kind of dragon. Choose a type of dragon from the Draconic Ancestry table; this determines the damage and area of your breath weapon, and the type of resistance you gain.',
        tags: ['race'],
    },
    // Dwarf
    {
        name: 'Dwarven Combat Training',
        description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.',
        tags: ['race'],
    },
    {
        name: 'Tool Proficiency',
        description: "You gain proficiency with the artisan's tools of your choice: smith's tools, brewer's supplies, or mason's tools.",
        tags: ['race'],
    },
    // Bugbear
    {
        name: 'Long-Limbed',
        description: 'When you make a melee attack on your turn, your reach for it is 5 feet greater than normal.',
        tags: ['race'],
    },
    {
        name: 'Sneaky',
        description: 'You are proficient in the Stealth skill.',
        tags: ['race'],
    },
    // Aarakocra
    {
        name: 'Wind Caller',
        description: 'Starting at 3rd level, you can cast the gust of wind spell with this trait, without requiring a material component. Once you cast the spell with this trait, you cannot do so again until you finish a long rest. You can also cast the spell using any spell slots you have of 2nd level or higher. Intelligence, Wisdom, or Charisma is your spellcasting ability for it when you cast it with this trait (choose when you select this race).',
        tags: ['race'],
    },
    // Aasimar
    {
        name: 'Celestial Revelation',
        description: "When you reach 3rd level, choose one of the revelation options below. Thereafter, you can use a bonus action to unleash the celestial energy within yourself, gaining the benefits of that revelation. Your transformation lasts for 1 minute or until you end it as a bonus action. Once you transform, you can't do so again until you finish a long rest.",
        tags: ['race'],
    },
    // Elf subraces
    {
        name: 'Elf Weapon Training',
        description: 'You have proficiency with the longsword, shortsword, shortbow, and longbow.',
        tags: ['race'],
    },
    {
        name: 'Cantrip',
        description: 'You know one cantrip of your choice from the wizard spell list. Intelligence is your spellcasting ability for it.',
        tags: ['race'],
    },
    {
        name: 'Extra Language',
        description: 'You can speak, read, and write one extra language of your choice.',
        tags: ['race'],
    },
    {
        name: 'Fleet of Foot',
        description: 'Your base walking speed increases to 35 feet.',
        tags: ['race'],
    },
    {
        name: 'Mask of the Wild',
        description: 'You can attempt to hide even when you are only lightly obscured by foliage, heavy rain, falling snow, mist, and other natural phenomena.',
        tags: ['race'],
    },
    // Drow traits
    {
        name: 'Superior Darkvision',
        description: 'Your darkvision has a radius of 120 feet.',
        tags: ['race'],
    },
    {
        name: 'Sunlight Sensitivity',
        description: 'You have disadvantage on attack rolls and on Wisdom (Perception) checks that rely on sight when you, the target of your attack, or whatever you are trying to perceive is in direct sunlight.',
        tags: ['race'],
    },
    {
        name: 'Drow Magic',
        description: 'You know the dancing lights cantrip. When you reach 3rd level, you can cast the faerie fire spell once with this trait; you regain the ability to cast it when you finish a long rest. When you reach 5th level, you can also cast the darkness spell once with this trait; you regain the ability to cast it when you finish a long rest. Charisma is your spellcasting ability for these spells.',
        tags: ['race'],
    },
    {
        name: 'Drow Weapon Training',
        description: 'You have proficiency with rapiers, shortswords, and hand crossbows.',
        tags: ['race'],
    },
    // Dwarf subraces
    {
        name: 'Dwarven Toughness',
        description: 'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.',
        tags: ['race'],
    },
    {
        name: 'Dwarven Armor Training',
        description: 'You have proficiency with light and medium armor.',
        tags: ['race'],
    },
    // Gnome subraces
    {
        name: 'Artificer\'s Lore',
        description: 'Whenever you make an Intelligence (History) check related to magic items, alchemical objects, or technological devices, you can add twice your proficiency bonus, instead of any proficiency bonus you normally apply.',
        tags: ['race'],
    },
    {
        name: 'Tinker',
        description: "Using tinker's tools, you can spend 1 hour and 10 gp worth of materials to construct a Tiny clockwork device (AC 5, 1 hp). The device ceases to function after 24 hours unless you spend 1 hour repairing it.",
        tags: ['race'],
    },
    {
        name: 'Natural Illusionist',
        description: 'You know the minor illusion cantrip. Intelligence is your spellcasting ability for it.',
        tags: ['race'],
    },
    {
        name: 'Speak with Small Beasts',
        description: 'Through sounds and gestures, you can communicate simple ideas with Small or smaller beasts.',
        tags: ['race'],
    },
    // Halfling
    {
        name: 'Lucky',
        description: 'When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.',
        tags: ['race'],
    },
    {
        name: 'Halfling Nimbleness',
        description: "You can move through the space of any creature that is of a size larger than yours.",
        tags: ['race'],
    },
    // Halfling subraces
    {
        name: 'Naturally Stealthy',
        description: 'You can attempt to hide even when you are obscured only by a creature that is at least one size larger than you.',
        tags: ['race'],
    },
    {
        name: 'Stout Resilience',
        description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.',
        tags: ['race'],
    },
    // Half-Elf
    {
        name: 'Skill Versatility',
        description: 'You gain proficiency in two skills of your choice.',
        tags: ['race'],
    },
    // Half-Orc
    {
        name: 'Menacing',
        description: 'You gain proficiency in the Intimidation skill.',
        tags: ['race'],
    },
    {
        name: 'Relentless Endurance',
        description: "When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. You can't use this feature again until you finish a long rest.",
        tags: ['race'],
    },
    {
        name: 'Savage Attacks',
        description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage of the critical hit.',
        tags: ['race'],
    },
    // Human
    {
        name: 'Skill Proficiency',
        description: 'You gain proficiency in one skill of your choice.',
        tags: ['race'],
    },
    {
        name: 'Feat',
        description: 'You gain one feat of your choice.',
        tags: ['race'],
    },
    // Tiefling
    {
        name: 'Hellish Resistance',
        description: 'You have resistance to fire damage.',
        tags: ['race'],
    },
    {
        name: 'Infernal Legacy',
        description: 'You know the thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait; you regain the ability to cast it when you finish a long rest. When you reach 5th level, you can also cast the darkness spell once with this trait; you regain the ability to cast it when you finish a long rest. Charisma is your spellcasting ability for these spells.',
        tags: ['race'],
    },
    // Goliath
    {
        name: "Stone's Endurance",
        description: "You can focus yourself to occasionally shrug off injury. When you take damage, you can use your reaction to roll a d12. Add your Constitution modifier to the number rolled, and reduce the damage by that total. After you use this trait, you can't use it again until you finish a short or long rest.",
        tags: ['race'],
    },
    {
        name: 'Mountain Born',
        description: "You have resistance to cold damage. You're also acclimated to high altitude, including elevations above 20,000 feet.",
        tags: ['race'],
    },
    // Tabaxi
    {
        name: 'Feline Agility',
        description: "Your reflexes and agility allow you to move with a burst of speed. When you move on your turn in combat, you can double your speed until the end of the turn. Once you use this trait, you can't use it again until you move 0 feet on one of your turns.",
        tags: ['race'],
    },
    // Kenku
    {
        name: 'Expert Duplication',
        description: "When you copy writing or craftwork produced by yourself or someone else, you have advantage on any ability checks you make to produce an exact duplicate.",
        tags: ['race'],
    },
    {
        name: 'Mimicry',
        description: "You can accurately mimic sounds you have heard, including voices. A creature that hears the sounds you make can tell they are imitations with a successful Wisdom (Insight) check opposed by your Charisma (Deception) check.",
        tags: ['race'],
    },
    // Lizardfolk
    {
        name: 'Cunning Artisan',
        description: "As part of a short rest, you can harvest bone and hide from a slain beast, construct, dragon, monstrosity, or plant creature of size Small or larger to create one of the following items: a shield, a club, a javelin, or 1d4 darts or blowgun needles.",
        tags: ['race'],
    },
    {
        name: "Hungry Jaws",
        description: "In battle, you can throw yourself into a vicious feeding frenzy. As a bonus action, you can make a special attack with your bite. If the attack hits, it deals its normal damage, and you gain temporary hit points equal to your Constitution modifier (minimum of 1). You can't use this trait again until you finish a short or long rest.",
        tags: ['race'],
    },
    // Tortle
    {
        name: 'Shell Defense',
        description: "You can withdraw into your shell as an action. Until you emerge, you gain a +4 bonus to AC, and you have advantage on Strength and Constitution saving throws. While in your shell, you are prone, your speed is 0 and can't increase, you have disadvantage on Dexterity saving throws, you can't take reactions, and the only action you can take is a bonus action to emerge from your shell.",
        tags: ['race'],
    },
    {
        name: 'Survival Instinct',
        description: 'You gain proficiency in the Survival skill.',
        tags: ['race'],
    },
    // Triton
    {
        name: 'Control Air and Water',
        description: 'You can cast fog cloud with this trait. Starting at 3rd level, you can cast gust of wind with it, and starting at 5th level, you can also cast wall of water with it. Once you cast a spell with this trait, you can\'t cast that spell with it again until you finish a long rest. Charisma is your spellcasting ability for these spells.',
        tags: ['race'],
    },
    {
        name: 'Emissary of the Sea',
        description: 'Aquatic beasts have an extraordinary affinity with your people. You can communicate simple ideas with beasts that can breathe water. They can understand the meaning of your words, though you have no special ability to understand them in return.',
        tags: ['race'],
    },
    {
        name: 'Guardian of the Depths',
        description: 'Adapted to even the most extreme ocean depths, you have resistance to cold damage.',
        tags: ['race'],
    },
    // Firbolg updated
    {
        name: 'Firbolg Magic',
        description: 'You can cast detect magic and disguise self with this trait, using Wisdom as your spellcasting ability for them. Once you cast either spell, you can\'t cast it again with this trait until you finish a short or long rest.',
        tags: ['race'],
    },
    // Warforged
    {
        name: 'Constructed Resilience',
        description: "You were created to have remarkable fortitude, represented by the following benefits: You have advantage on saving throws against being poisoned, and you have resistance to poison damage. You don't need to eat, drink, or breathe. You are immune to disease. You don't need to sleep, and magic can't put you to sleep.",
        tags: ['race'],
    },
    {
        name: 'Sentry\'s Rest',
        description: "When you take a long rest, you must spend at least six hours in an inactive, motionless state, rather than sleeping. In this state, you appear inert, but it doesn't render you unconscious, and you can see and hear as normal.",
        tags: ['race'],
    },
    {
        name: 'Integrated Protection',
        description: "Your body has built-in defensive layers, which can be enhanced with armor. You gain a +1 bonus to Armor Class. You can don only armor with which you have proficiency.",
        tags: ['race'],
    },
    {
        name: 'Specialized Design',
        description: "You gain one skill proficiency and one tool proficiency of your choice.",
        tags: ['race'],
    },
];

async function addMissingTraits() {
    console.log('🔍 Checking for existing traits...');

    // Get existing traits
    const existingTraits = await client.fetch(`*[_type == "trait"]{name}`);
    const existingNames = new Set(existingTraits.map((t: { name: string }) => t.name.toLowerCase()));

    // Filter to only new traits
    const newTraits = MISSING_TRAITS.filter(t => !existingNames.has(t.name.toLowerCase()));

    console.log(`Found ${existingTraits.length} existing traits`);
    console.log(`Adding ${newTraits.length} new traits\n`);

    if (newTraits.length === 0) {
        console.log('No new traits to add!');
        return;
    }

    const documents = newTraits.map(trait => ({
        _id: `trait-${toSanityId(trait.name)}`,
        _type: 'trait',
        name: trait.name,
        slug: { _type: 'slug', current: toSanityId(trait.name) },
        description: trait.description,
        tags: trait.tags,
        level: 1,
        source: 'Official',
        edition: 'Both',
        version: 1,
    }));

    // Batch create
    const transaction = client.transaction();
    for (const doc of documents) {
        transaction.createOrReplace(doc);
    }
    await transaction.commit();

    console.log(`✅ Created ${documents.length} new traits:`);
    for (const trait of newTraits) {
        console.log(`  - ${trait.name}`);
    }
}

async function run() {
    console.log('🚀 Adding Missing Race Traits');
    console.log('='.repeat(50));

    try {
        await addMissingTraits();
        console.log('\n🎉 Done!');
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
}

run();
