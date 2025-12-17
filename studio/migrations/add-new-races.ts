/**
 * Comprehensive migration script to add new races to Sanity
 * 
 * This script:
 * 1. Creates race documents with all metadata
 * 2. Links races to existing trait documents (run add-missing-traits.ts first!)
 * 3. Sets up proficiency rules for skill proficiencies
 * 
 * Races included:
 * - Harengon, Owlin, Minotaur
 * - Shifter (Beasthide, Longtooth, Swiftstride, Wildhunt)
 * - Kalashtar, Fairy, Eladrin, Deep Gnome, Duergar
 * 
 * Usage:
 * 1. First run: npx sanity exec migrations/add-missing-traits.ts --with-user-token
 * 2. Then run: npx sanity exec migrations/add-new-races.ts --with-user-token
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

// ===== RACE DEFINITIONS =====
interface RaceDefinition {
    id: string;
    name: string;
    description: string;
    source: string;
    edition: string;
    abilityScoreIncrease: Record<string, number>;
    flexibleAbilityScores?: boolean;
    size: string;
    speed: number;
    languages: string[];
    subraces?: string[];
    traitNames: string[];
    proficiencies: Array<{ type: string; mode: string; count?: number; options: string[] }>;
    racialKnownSpells?: Array<{
        level: number;
        spellId: string;
        abilityScore: string;
        type: string;
        name?: string;
    }>;
}

const NEW_RACES: RaceDefinition[] = [
    // ===== DWARVES =====
    {
        id: 'hill-dwarf',
        name: 'Hill Dwarf',
        description: 'As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience. The gold dwarves of Faerûn in their mighty southern kingdom are hill dwarves, as are the exiled Neidar and the debased Klar of Krynn in the Dragonlance setting.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { CON: 2, WIS: 1 },
        size: 'Medium',
        speed: 25,
        languages: ['Common', 'Dwarvish'],
        traitNames: ['Darkvision', 'Dwarven Resilience', 'Dwarven Combat Training', 'Stonecunning', 'Dwarven Toughness'],
        proficiencies: [
            { type: 'weapon', mode: 'fixed', options: ['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer'] },
        ],
    },
    {
        id: 'mountain-dwarf',
        name: 'Mountain Dwarf',
        description: 'As a mountain dwarf, you are strong and hardy, accustomed to a difficult life in rugged terrain. You are probably on the tall side (for a dwarf), and tend toward lighter coloration. The shield dwarves of northern Faerûn, as well as the ruling Hylar clan and the noble Daewar clan of Dragonlance, are mountain dwarves.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { CON: 2, STR: 2 },
        size: 'Medium',
        speed: 25,
        languages: ['Common', 'Dwarvish'],
        traitNames: ['Darkvision', 'Dwarven Resilience', 'Dwarven Combat Training', 'Stonecunning', 'Dwarven Armor Training'],
        proficiencies: [
            { type: 'weapon', mode: 'fixed', options: ['Battleaxe', 'Handaxe', 'Light Hammer', 'Warhammer'] },
            { type: 'armor', mode: 'fixed', options: ['Light Armor', 'Medium Armor'] },
        ],
    },
    // ===== ELVES =====
    {
        id: 'high-elf',
        name: 'High Elf',
        description: 'As a high elf, you have a keen mind and a mastery of at least the basics of magic. In many of the worlds of D&D, there are two kinds of high elves. One type is haughty and reclusive, believing themselves to be superior to non-elves and even other elves. The other type is more common and more friendly, and often encountered among humans and other races.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, INT: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Elvish'],
        traitNames: ['Darkvision', 'Fey Ancestry', 'Trance', 'Keen Senses', 'Elf Weapon Training', 'Cantrip', 'Extra Language'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
            { type: 'weapon', mode: 'fixed', options: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'] },
        ],
    },
    {
        id: 'wood-elf',
        name: 'Wood Elf',
        description: 'As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests. This category includes the wild elves (grugach) of Greyhawk and the Kagonesti of Dragonlance, as well as the races called wood elves in Greyhawk and the Forgotten Realms.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, WIS: 1 },
        size: 'Medium',
        speed: 35,
        languages: ['Common', 'Elvish'],
        traitNames: ['Darkvision', 'Fey Ancestry', 'Trance', 'Keen Senses', 'Elf Weapon Training', 'Fleet of Foot', 'Mask of the Wild'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
            { type: 'weapon', mode: 'fixed', options: ['Longsword', 'Shortsword', 'Shortbow', 'Longbow'] },
        ],
    },
    {
        id: 'dark-elf',
        name: 'Dark Elf (Drow)',
        description: 'Descended from an earlier subrace of dark-skinned elves, the drow were banished from the surface world for following the goddess Lolth down the path to evil and corruption. Now they have built their own civilization in the depths of the Underdark, patterned after the Way of Lolth.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, CHA: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Elvish'],
        traitNames: ['Superior Darkvision', 'Fey Ancestry', 'Trance', 'Keen Senses', 'Sunlight Sensitivity', 'Drow Magic', 'Drow Weapon Training'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
            { type: 'weapon', mode: 'fixed', options: ['Rapier', 'Shortsword', 'Hand Crossbow'] },
        ],
        racialKnownSpells: [
            { level: 1, spellId: 'dancing-lights', abilityScore: 'CHA', type: 'at-will' },
            { level: 3, spellId: 'faerie-fire', abilityScore: 'CHA', type: '1/day' },
            { level: 5, spellId: 'darkness', abilityScore: 'CHA', type: '1/day' },
        ],
    },
    {
        id: 'sea-elf',
        name: 'Sea Elf',
        description: 'Sea elves fell in love with the wild beauty of the ocean in the earliest days of the multiverse. While other elves traveled from realm to realm, the sea elves navigated the deepest currents and explored the waters across a hundred worlds.',
        source: "Mordenkainen's Tome of Foes",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, CON: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Elvish', 'Aquan'],
        traitNames: ['Darkvision', 'Fey Ancestry', 'Trance', 'Keen Senses', 'Sea Elf Training', 'Child of the Sea', 'Friend of the Sea'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
            { type: 'weapon', mode: 'fixed', options: ['Spear', 'Trident', 'Light Crossbow', 'Net'] },
        ],
    },
    {
        id: 'shadar-kai',
        name: 'Shadar-kai',
        description: 'Sworn to the Raven Queen\'s service, the mysterious shadar-kai venture into the Material Plane from the Shadowfell to advance her will. Once they were fey like the rest of their elven kin, and now they exist in a state between life and death.',
        source: "Mordenkainen's Tome of Foes",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, CON: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Elvish'],
        traitNames: ['Darkvision', 'Fey Ancestry', 'Trance', 'Keen Senses', 'Necrotic Resistance', 'Blessing of the Raven Queen'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
        ],
    },
    // ===== GNOMES =====
    {
        id: 'forest-gnome',
        name: 'Forest Gnome',
        description: 'As a forest gnome, you have a natural knack for illusion and inherent quickness and stealth. In the worlds of D&D, forest gnomes are rare and secretive. They gather in hidden communities in sylvan forests, using illusions and trickery to conceal themselves from threats.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { INT: 2, DEX: 1 },
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Gnomish'],
        traitNames: ['Darkvision', 'Gnome Cunning', 'Natural Illusionist', 'Speak with Small Beasts'],
        proficiencies: [],
        racialKnownSpells: [
            { level: 1, spellId: 'minor-illusion', abilityScore: 'INT', type: 'at-will' },
        ],
    },
    {
        id: 'rock-gnome',
        name: 'Rock Gnome',
        description: 'As a rock gnome, you have a natural inventiveness and hardiness beyond that of other gnomes. Most gnomes in the worlds of D&D are rock gnomes, including the tinker gnomes of the Dragonlance setting.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { INT: 2, CON: 1 },
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Gnomish'],
        traitNames: ['Darkvision', 'Gnome Cunning', "Artificer's Lore", 'Tinker'],
        proficiencies: [
            { type: 'tool', mode: 'fixed', options: ["Tinker's tools"] },
        ],
    },
    // ===== HALFLINGS =====
    {
        id: 'lightfoot-halfling',
        name: 'Lightfoot Halfling',
        description: 'As a lightfoot halfling, you can easily hide from notice, even using other people as cover. You are inclined to be affable and get along well with others. Lightfoots are more prone to wanderlust than other halflings, and often dwell alongside other races or take up a nomadic life.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, CHA: 1 },
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Halfling'],
        traitNames: ['Lucky', 'Brave', 'Halfling Nimbleness', 'Naturally Stealthy'],
        proficiencies: [],
    },
    {
        id: 'stout-halfling',
        name: 'Stout Halfling',
        description: 'As a stout halfling, you are hardier than average and have some resistance to poison. Some say that stouts have dwarven blood. In the Forgotten Realms, these halflings are called stronghearts, and they are most common in the south.',
        source: "Player's Handbook",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, CON: 1 },
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Halfling'],
        traitNames: ['Lucky', 'Brave', 'Halfling Nimbleness', 'Stout Resilience'],
        proficiencies: [],
    },
    {
        id: 'ghostwise-halfling',
        name: 'Ghostwise Halfling',
        description: 'Ghostwise halflings trace their ancestry back to a war among halfling tribes that sent their ancestors into flight from Luiren. Ghostwise halflings are the rarest of the hin, found only in the Chondalwood and a few other isolated forests.',
        source: "Sword Coast Adventurer's Guide",
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, WIS: 1 },
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Halfling'],
        traitNames: ['Lucky', 'Brave', 'Halfling Nimbleness', 'Silent Speech'],
        proficiencies: [],
    },
    // ===== PREVIOUSLY ADDED RACES =====
    {
        id: 'harengon',
        name: 'Harengon',
        description: 'Harengons are bipedal, rabbitlike humanoids who originated in the Feywild. They embody the youthful, exuberant energy of spring, and their powerful legs allow them to leap great distances.',
        source: 'The Wild Beyond the Witchlight',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Hare-Trigger', 'Leporine Senses', 'Lucky Footwork', 'Rabbit Hop'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
        ],
    },
    {
        id: 'owlin',
        name: 'Owlin',
        description: 'Owlins are owl-like humanoids who hail from the Feywild. Covered in soft feathers, they have large wings that allow them to fly silently through the night sky.',
        source: 'Strixhaven: A Curriculum of Chaos',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Darkvision', 'Flight', 'Silent Feathers'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Stealth'] },
        ],
    },
    {
        id: 'minotaur',
        name: 'Minotaur',
        description: 'Minotaurs are barrel-chested humanoids with heads resembling those of bulls. Powerful and fierce, minotaurs are known for their strength in battle and their natural sense of direction.',
        source: "Guildmasters' Guide to Ravnica",
        edition: '5e',
        abilityScoreIncrease: { STR: 2, CON: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Minotaur'],
        traitNames: ['Horns', 'Goring Rush', 'Hammering Horns', 'Labyrinthine Recall', 'Imposing Presence'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Intimidation', 'Persuasion'] },
        ],
    },
    {
        id: 'shifter-beasthide',
        name: 'Shifter (Beasthide)',
        description: 'Beasthide shifters are typically tough and aggressive, drawing on the bear or boar within them to enhance their physical resilience.',
        source: 'Eberron: Rising from the Last War',
        edition: '5e',
        abilityScoreIncrease: { CON: 2, STR: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Darkvision', 'Shifting', 'Beasthide Shifting Feature', 'Natural Athlete'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Athletics'] },
        ],
    },
    {
        id: 'shifter-longtooth',
        name: 'Shifter (Longtooth)',
        description: 'Longtooth shifters are fierce and aggressive, using their elongated fangs to tear at their foes.',
        source: 'Eberron: Rising from the Last War',
        edition: '5e',
        abilityScoreIncrease: { STR: 2, DEX: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Darkvision', 'Shifting', 'Longtooth Shifting Feature', 'Fierce'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Intimidation'] },
        ],
    },
    {
        id: 'shifter-swiftstride',
        name: 'Shifter (Swiftstride)',
        description: 'Swiftstride shifters are graceful and quick, able to dash away from danger with preternatural speed.',
        source: 'Eberron: Rising from the Last War',
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, CHA: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Darkvision', 'Shifting', 'Swiftstride Shifting Feature', 'Graceful'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Acrobatics'] },
        ],
    },
    {
        id: 'shifter-wildhunt',
        name: 'Shifter (Wildhunt)',
        description: 'Wildhunt shifters are sharp and insightful, able to detect threats before they strike.',
        source: 'Eberron: Rising from the Last War',
        edition: '5e',
        abilityScoreIncrease: { WIS: 2, DEX: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Darkvision', 'Shifting', 'Wildhunt Shifting Feature', 'Natural Tracker'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Survival'] },
        ],
    },
    {
        id: 'kalashtar',
        name: 'Kalashtar',
        description: 'The kalashtar are a compound race created from the union of humanity and renegade spirits from the plane of dreams — spirits called quori.',
        source: 'Eberron: Rising from the Last War',
        edition: '5e',
        abilityScoreIncrease: { WIS: 2, CHA: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Quori'],
        traitNames: ['Dual Mind', 'Mental Discipline', 'Mind Link', 'Severed from Dreams'],
        proficiencies: [],
    },
    {
        id: 'fairy',
        name: 'Fairy',
        description: 'Fairies are a wee folk that originated in the Feywild. They are deeply magical beings infused with the magic of the Feywild.',
        source: 'The Wild Beyond the Witchlight',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Small',
        speed: 30,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Fairy Magic', 'Flight'],
        proficiencies: [],
        racialKnownSpells: [
            { level: 1, spellId: 'druidcraft', abilityScore: 'CHA', type: 'at-will' },
            { level: 3, spellId: 'faerie-fire', abilityScore: 'CHA', type: '1/day' },
            { level: 5, spellId: 'enlarge-reduce', abilityScore: 'CHA', type: '1/day' },
        ],
    },
    {
        id: 'eladrin',
        name: 'Eladrin',
        description: 'Eladrin are elves native to the Feywild, a realm of beauty, unpredictable emotion, and boundless magic. Their state of being reflects the season they embody.',
        source: 'Mordenkainen Presents: Monsters of the Multiverse',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Elvish'],
        traitNames: ['Darkvision', 'Fey Ancestry', 'Fey Step', 'Trance'],
        proficiencies: [],
    },
    {
        id: 'deep-gnome',
        name: 'Deep Gnome (Svirfneblin)',
        description: 'Deep gnomes, or svirfneblin, are gnomes who live in the Underdark. They are known for their stealth, cleverness, and ability to blend in with rocky terrain.',
        source: 'Mordenkainen Presents: Monsters of the Multiverse',
        edition: '5e',
        abilityScoreIncrease: { INT: 2, DEX: 1 },
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Gnomish', 'Undercommon'],
        traitNames: ['Superior Darkvision', 'Gnome Cunning', 'Stone Camouflage', 'Svirfneblin Magic'],
        proficiencies: [],
        racialKnownSpells: [
            { level: 3, spellId: 'disguise-self', abilityScore: 'INT', type: '1/day' },
            { level: 5, spellId: 'nondetection', abilityScore: 'INT', type: '1/day' },
        ],
    },
    {
        id: 'duergar',
        name: 'Duergar (Gray Dwarf)',
        description: 'Duergar are gray dwarves who live in the Underdark. Descended from dwarves captured by mind flayers, they were transformed by cruel experiments and psionic influence.',
        source: 'Mordenkainen Presents: Monsters of the Multiverse',
        edition: '5e',
        abilityScoreIncrease: { CON: 2, STR: 1 },
        size: 'Medium',
        speed: 25,
        languages: ['Common', 'Dwarvish', 'Undercommon'],
        traitNames: ['Superior Darkvision', 'Duergar Resilience', 'Dwarven Resilience', 'Duergar Magic', 'Psionic Fortitude'],
        proficiencies: [],
        racialKnownSpells: [
            { level: 3, spellId: 'enlarge-reduce', abilityScore: 'INT', type: '1/day', name: 'Enlarge (self only)' },
            { level: 5, spellId: 'invisibility', abilityScore: 'INT', type: '1/day', name: 'Invisibility (self only)' },
        ],
    },
    // ===== NEW RACES (Batch 2) =====
    {
        id: 'autognome',
        name: 'Autognome',
        description: 'Autognomes are mechanical beings created by rock gnomes. Sometimes these creations gain a spark of life and become autonomous, developing a sense of self and setting out to forge their own path.',
        source: 'Spelljammer: Adventures in Space',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Small',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Armored Casing', 'Built for Success', 'Mechanical Nature', "Sentry's Rest", 'Specialized Design', 'True Life'],
        proficiencies: [
            { type: 'tool', mode: 'choice', count: 2, options: ["Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies", "Carpenter's tools", "Cartographer's tools", "Cobbler's tools", "Cook's utensils", "Glassblower's tools", "Jeweler's tools", "Leatherworker's tools", "Mason's tools", "Painter's supplies", "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools", "Woodcarver's tools"] },
        ],
    },
    {
        id: 'giff',
        name: 'Giff',
        description: 'Giff are hippo-headed humanoids of impressive size who hail from the far reaches of Wildspace. They are renowned as fierce warriors and mercenaries with an affinity for firearms and explosives.',
        source: 'Spelljammer: Adventures in Space',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Astral Spark', 'Firearms Mastery', 'Hippo Build'],
        proficiencies: [],
    },
    {
        id: 'grung',
        name: 'Grung',
        description: 'Grungs are aggressive, frog-like humanoids found in rain forests and jungles. They are fiercely territorial and use their toxic skin to defend themselves and their territory.',
        source: 'One Grung Above',
        edition: '5e',
        abilityScoreIncrease: { DEX: 2, CON: 1 },
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Grung'],
        traitNames: ['Amphibious', 'Poison Immunity', 'Poisonous Skin', 'Standing Leap', 'Water Dependency', 'Arboreal Alertness'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
        ],
    },
    {
        id: 'hadozee',
        name: 'Hadozee',
        description: 'Hadozees are monkey-like humanoids with wing-like membranes that allow them to glide. Originally created by a wizard to be servants and soldiers, they eventually won their freedom and now travel the stars as explorers and adventurers.',
        source: 'Spelljammer: Adventures in Space',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Dexterous Feet', 'Glide', 'Hadozee Resilience'],
        proficiencies: [],
    },
    {
        id: 'kender',
        name: 'Kender',
        description: 'Kender are small, fearless humanoids from the world of Krynn. Characterized by their insatiable curiosity and immunity to fear, they often find themselves in dangerous situations due to their tendency to "handle" interesting objects they encounter.',
        source: 'Dragonlance: Shadow of the Dragon Queen',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Small',
        speed: 30,
        languages: ['Common', 'Kenderspeak'],
        traitNames: ['Fearless', 'Kender Aptitude', 'Taunt'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Insight', 'Investigation', 'Sleight of Hand', 'Stealth', 'Survival'] },
        ],
    },
    {
        id: 'locathah',
        name: 'Locathah',
        description: 'Locathah are resilient and proud fish-folk who dwell in warm coastal waters. Though they can survive on land for a time, they require regular immersion in water to thrive.',
        source: 'Locathah Rising',
        edition: '5e',
        abilityScoreIncrease: { STR: 2, DEX: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Aquan'],
        traitNames: ['Natural Armor', 'Observant and Athletic', 'Leviathan Will', 'Limited Amphibiousness'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Athletics', 'Perception'] },
        ],
    },
    {
        id: 'simic-hybrid',
        name: 'Simic Hybrid',
        description: 'Simic hybrids are humanoids whose bodies have been magically enhanced by the Simic Combine, incorporating animal characteristics to create superior beings. These adaptations can include fins, claws, or other features.',
        source: "Guildmasters' Guide to Ravnica",
        edition: '5e',
        abilityScoreIncrease: { CON: 2 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Elvish'],
        traitNames: ['Darkvision', 'Animal Enhancement'],
        proficiencies: [],
    },
    {
        id: 'thri-kreen',
        name: 'Thri-kreen',
        description: 'Thri-kreen are insect-like humanoids with four arms and a chitinous carapace. They are telepathic hunters who do not require sleep and can change the color of their exoskeleton to blend with their surroundings.',
        source: 'Spelljammer: Adventures in Space',
        edition: '5e',
        abilityScoreIncrease: {},
        flexibleAbilityScores: true,
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Thri-kreen'],
        traitNames: ['Chameleon Carapace', 'Darkvision', 'Secondary Arms', 'Sleepless', 'Thri-kreen Telepathy'],
        proficiencies: [],
    },
    {
        id: 'vedalken',
        name: 'Vedalken',
        description: 'Vedalkens are tall, slender, blue-skinned humanoids known for their analytical minds and tireless pursuit of perfection. They approach problems methodically and value logic above emotion.',
        source: "Guildmasters' Guide to Ravnica",
        edition: '5e',
        abilityScoreIncrease: { INT: 2, WIS: 1 },
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Vedalken'],
        traitNames: ['Vedalken Dispassion', 'Tireless Precision', 'Partially Amphibious'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Arcana', 'History', 'Investigation', 'Medicine', 'Performance', 'Sleight of Hand'] },
            { type: 'tool', mode: 'choice', count: 1, options: ["Alchemist's supplies", "Brewer's supplies", "Calligrapher's supplies", "Carpenter's tools", "Cartographer's tools", "Cobbler's tools", "Cook's utensils", "Glassblower's tools", "Jeweler's tools", "Leatherworker's tools", "Mason's tools", "Painter's supplies", "Potter's tools", "Smith's tools", "Tinker's tools", "Weaver's tools", "Woodcarver's tools"] },
        ],
    },
    {
        id: 'verdan',
        name: 'Verdan',
        description: 'Verdans are a goblinoid race created by chaos magic. They are highly adaptable creatures who undergo physical changes as they mature, growing from Small to Medium size around 5th level.',
        source: 'Acquisitions Incorporated',
        edition: '5e',
        abilityScoreIncrease: { CHA: 2, CON: 1 },
        size: 'Small',
        speed: 30,
        languages: ['Common', 'Goblin'],
        traitNames: ['Black Blood Healing', 'Limited Telepathy', 'Persuasive', 'Telepathic Insight'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Persuasion'] },
        ],
    },
];

async function migrateRaces() {
    console.log('🧝 Migrating Races to Sanity...\n');

    // First, get all existing traits for linking
    const allTraits = await client.fetch(`*[_type == "trait"]{_id, name}`);
    const traitMap = new Map(allTraits.map((t: { _id: string; name: string }) => [t.name.toLowerCase(), t._id]));
    console.log(`Found ${allTraits.length} existing traits for linking\n`);

    const transaction = client.transaction();

    for (const race of NEW_RACES) {
        // Build trait references
        const traitRefs = race.traitNames
            .map((traitName) => {
                const traitId = traitMap.get(traitName.toLowerCase());
                if (traitId) {
                    return {
                        _type: 'reference',
                        _ref: traitId,
                        _key: toSanityId(traitName),
                    };
                } else {
                    console.log(`  ⚠️ Trait not found: ${traitName} (for ${race.name})`);
                    return null;
                }
            })
            .filter(Boolean);

        // Build proficiency rules
        const proficiencyRules = race.proficiencies.map((prof, idx) => ({
            _key: `prof-${idx}`,
            _type: 'proficiencyRule',
            type: prof.type,
            mode: prof.mode,
            count: prof.mode === 'choice' ? prof.count || 1 : undefined,
            skillOptions: prof.type === 'skill' ? prof.options : undefined,
            toolOptions: prof.type === 'tool' ? prof.options : undefined,
            languageOptions: prof.type === 'language' ? prof.options : undefined,
        }));

        // Build racial known spells
        const racialSpells = race.racialKnownSpells?.map((spell, idx) => ({
            _key: `known-spell-${idx}`,
            level: spell.level,
            spellId: spell.spellId,
            abilityScore: spell.abilityScore,
            type: spell.type,
            spellName: spell.name,
        }));

        const doc = {
            _id: `race-${toSanityId(race.id)}`,
            _type: 'race',
            name: race.name,
            slug: { _type: 'slug', current: race.id },
            description: race.description,
            source: race.source,
            edition: race.edition,
            version: 1,
            abilityScoreIncrease: race.abilityScoreIncrease,
            flexibleAbilityScores: race.flexibleAbilityScores || false,
            size: race.size,
            speed: race.speed,
            languages: race.languages,
            subraces: race.subraces,
            traits: traitRefs,
            proficiencies: proficiencyRules.length > 0 ? proficiencyRules : undefined,
            racialKnownSpells: racialSpells,
        };

        transaction.createOrReplace(doc as Parameters<typeof transaction.createOrReplace>[0]);
        console.log(`  ✓ ${race.name}: ${traitRefs.length} traits, ${proficiencyRules.length} proficiencies`);
    }

    console.log('\nCommitting to Sanity...');
    await transaction.commit();
    console.log(`\n✅ Successfully migrated ${NEW_RACES.length} races!`);
}

async function run() {
    console.log('🚀 New Race Migration');
    console.log('='.repeat(50) + '\n');

    try {
        await migrateRaces();
        console.log('\n' + '='.repeat(50));
        console.log('🎉 Migration complete!');
        console.log('\nNote: Make sure you ran add-missing-traits.ts first to create trait documents.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

run();
