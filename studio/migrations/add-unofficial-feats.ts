/**
 * Migration script to add unofficial 2024 feats to Sanity
 *
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/add-unofficial-feats.ts --with-user-token
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

interface FeatDef {
    name: string;
    description: string;
    prereqLevel?: number;
    prereqText?: string;
    features: string[];
    asiText?: string; // Text description of ASI since schema supports fixed only usually
}

const FEATS: FeatDef[] = [
    {
        name: 'Adept of the Black Robes',
        description: 'You have dedicated yourself to the Moon of Nuitari and its magic.',
        prereqLevel: 4,
        features: ['Life Channel (Use Hit Dice to empower spells)', 'Spells: 2nd-level Enchantment or Necromancy spell'],
    },
    {
        name: 'Adept of the Red Robes',
        description: 'You have dedicated yourself to the Moon of Lunitari and its magic.',
        prereqLevel: 4,
        features: ['Magical Balance (Treat a roll of 9 or lower on an attack/check as a 10)', 'Spells: 2nd-level Evocation or Transmutation spell'],
    },
    {
        name: 'Adept of the White Robes',
        description: 'You have dedicated yourself to the Moon of Solinari and its magic.',
        prereqLevel: 4,
        features: ['Protective Ward (Reaction to reduce damage to self or ally)', 'Spells: 2nd-level Abjuration or Divination spell'],
    },
    {
        name: 'Agent of Order',
        description: 'You have traveled the planes and absorbed the essence of absolute order.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, Wisdom, or Charisma',
        features: ['Stasis Strike (Deal force damage or Restrain target on hit)'],
    },
    {
        name: 'Archery',
        description: 'You have mastered the art of ranged combat.',
        prereqLevel: 1,
        features: ['+2 bonus to attack rolls with ranged weapons'],
    },
    {
        name: 'Artificer Initiate',
        description: 'You have learned some of an artificer’s inventiveness.',
        prereqLevel: 1,
        features: ['Cast 1st-level spell once without slot', 'Spells: 1 Artificer Cantrip, 1 1st-level Artificer Spell'],
    },
    {
        name: 'Baleful Scion',
        description: 'You channel the cosmic forces of evil to drain your foes.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, or Charisma',
        features: ['Grasp of Avarice (Deal necrotic damage and regain HP)'],
    },
    {
        name: 'Blind Fighting',
        description: 'You have learned to fight without relying on your eyes.',
        prereqLevel: 1,
        features: ['Blindsight (10 ft)'],
    },
    {
        name: 'Bloodlust',
        description: 'A thirst for vitality drives you in battle.',
        prereqLevel: 1,
        asiText: '+1 Strength, Dexterity, or Constitution',
        features: ['Powerful Recovery', 'Sanguine Feast'],
    },
    {
        name: 'Bomber',
        description: 'You are an expert with alchemical explosives.',
        prereqLevel: 1,
        asiText: '+1 Dexterity',
        features: ['Far Lobber', 'Long Shots'],
    },
    {
        name: 'Bountiful Luck',
        description: 'Your people have extraordinary luck, which you have learned to lend to your companions.',
        prereqLevel: 1,
        features: ['Reaction to allow ally to reroll a 1'],
    },
    {
        name: 'Cartomancer',
        description: 'You channel your magic through a deck of cards.',
        prereqLevel: 4,
        features: ['Hidden Ace (Imbue spell into card for bonus action cast)'],
    },
    {
        name: 'Charger',
        description: 'You have trained to charge headlong into battle.',
        prereqLevel: 1,
        features: ['Bonus action attack/shove after Dashing', '+5 damage or push 10ft'],
    },
    {
        name: 'Chef',
        description: 'You gain mastery in the culinary arts.',
        prereqLevel: 1,
        asiText: '+1 Constitution or Wisdom',
        features: ['Restorative Food (Extra healing on short rest)', 'Bolstering Treats (Temp HP)'],
    },
    {
        name: 'Child of the Sun',
        description: 'You carry the light of the sun within you.',
        prereqLevel: 1,
        features: ['Eyes of Eirdu', 'Spells: Faerie Fire'],
    },
    {
        name: 'Cloying Mists',
        description: 'Mist clings to you, obscuring you from foes.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Spells: Fog Cloud (Always prepared)'],
    },
    {
        name: 'Cohort of Chaos',
        description: 'The chaotic energy of the planes infuses your actions.',
        prereqLevel: 4,
        asiText: '+1 Dexterity, Constitution, or Charisma',
        features: ['Chaotic Flare (Random magical effect on Crit or nat 1)'],
    },
    {
        name: 'Cold Caster',
        description: 'You have mastered the magic of frost.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Spells: Ray of Frost, Frostbite'],
    },
    {
        name: 'Crafter',
        description: 'You are a master of making things quickly and cheaply.',
        prereqLevel: 1,
        features: ['Discount on nonmagical items', 'Fast Crafting'],
    },
    {
        name: 'Crusher',
        description: 'You are an expert at bludgeoning foes.',
        prereqLevel: 1,
        asiText: '+1 Strength or Constitution',
        features: ['Move creature 5ft on hit', 'Advantage against creature on Crit'],
    },
    {
        name: 'Cult of the Dragon Initiate',
        description: 'You have joined the ranks of the dragon cultists.',
        prereqLevel: 1,
        features: ["Dragon's Tongue", "Dragon's Terror", 'Inspired by Fear'],
    },
    {
        name: 'Defense',
        description: 'You are trained in defensive maneuvers while wearing armor.',
        prereqLevel: 1,
        features: ['+1 bonus to AC while wearing armor'],
    },
    {
        name: 'Delicious Pain',
        description: 'You find strength in suffering.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Gain temporary Resistance to Bludgeoning, Piercing, and Slashing'],
    },
    {
        name: 'Divinely Favored',
        description: 'A god has chosen you to carry a spark of their power.',
        prereqLevel: 1,
        features: ['Augury (via holy symbol)', 'Spells: 1 Cantrip and 1 1st-level spell'],
    },
    {
        name: 'Dragon Fear',
        description: 'You can channel your draconic heritage to terrify your enemies.',
        prereqLevel: 1,
        asiText: '+1 Strength, Constitution, or Charisma',
        features: ['Expend Breath Weapon uses to roar and frighten foes'],
    },
    {
        name: 'Dragon Hide',
        description: 'You manifest scales and claws reminiscent of your draconic ancestors.',
        prereqLevel: 1,
        asiText: '+1 Strength, Constitution, or Charisma',
        features: ['Natural Armor (13 + Dex)', 'Retractable Claws (1d4 + Str slashing)'],
    },
    {
        name: 'Dragonscarred',
        description: 'You have survived the wrath of a dragon and lived to tell the tale.',
        prereqLevel: 1,
        features: ['Specialized defenses/tactics against dragons'],
    },
    {
        name: 'Drow High Magic',
        description: 'You have learned more of the magic typical of dark elves.',
        prereqLevel: 1,
        features: ['Spells: Detect Magic, Levitate, Dispel Magic'],
    },
    {
        name: 'Dueling',
        description: 'You fight with a single one-handed weapon with deadly efficiency.',
        prereqLevel: 1,
        features: ['+2 damage when wielding one melee weapon in one hand'],
    },
    {
        name: 'Dungeon Delver',
        description: 'You are alert to the hidden traps and secret doors found in dungeons.',
        prereqLevel: 1,
        features: ['Advantage to find secret doors/traps', 'Resistance to trap damage', 'Search fast'],
    },
    {
        name: 'Durable',
        description: 'You are hardy and resilient.',
        prereqLevel: 1,
        asiText: '+1 Constitution',
        features: ['Minimum HP regained from Hit Dice is 2x Con mod'],
    },
    {
        name: 'Dwarven Fortitude',
        description: 'You have the blood of dwarf heroes flowing in your veins.',
        prereqLevel: 1,
        asiText: '+1 Constitution',
        features: ['Spend Hit Die to heal when taking the Dodge action'],
    },
    {
        name: 'Eldritch Adept',
        description: 'You have studied forbidden eldritch lore.',
        prereqLevel: 1,
        features: ['Learn one Warlock Invocation'],
    },
    {
        name: 'Ember of the Fire Giant',
        description: 'You have manifested the fiery power of giants.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, or Wisdom',
        features: ['Fire Resistance', 'Searing Ignition (AoE blind/damage)'],
    },
    {
        name: 'Emerald Enclave Fledgling',
        description: 'You are a new initiate of the Emerald Enclave.',
        prereqLevel: 1,
        features: ['Tag Team', 'Spells: Speak with Animals'],
    },
    {
        name: 'Enclave Magic',
        description: 'You have learned the nature magic of the Enclave.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Friend to Animals', 'Two Hearts, One Mind'],
    },
    {
        name: 'Fade Away',
        description: 'Your people are clever at hiding when threatened.',
        prereqLevel: 1,
        asiText: '+1 Dexterity or Intelligence',
        features: ['Reaction to turn Invisible after taking damage'],
    },
    {
        name: 'Fairy Trickster',
        description: 'You have learned the tricky ways of the fey.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Faerie Trod Trotter', 'Flustering Strike'],
    },
    {
        name: 'Fey Teleportation',
        description: 'You have studied the lore of the high elves to unlock fey power.',
        prereqLevel: 1,
        asiText: '+1 Intelligence or Charisma',
        features: ['Spells: Misty Step'],
    },
    {
        name: 'Fighting Initiate',
        description: 'You have trained in martial combat.',
        prereqLevel: 1,
        features: ['Learn one Fighting Style option'],
    },
    {
        name: 'Flames of Phlegethos',
        description: 'You can call on hellfire to serve your commands.',
        prereqLevel: 1,
        asiText: '+1 Intelligence or Charisma',
        features: ['Reroll 1s on fire damage', 'Wreath of flames deals damage to attackers'],
    },
    {
        name: 'Fury of the Frost Giant',
        description: 'You channel the icy might of frost giants.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, or Wisdom',
        features: ['Cold Resistance', 'Frigid Retaliation (Reaction to frighten)'],
    },
    {
        name: 'Genie Magic',
        description: 'You have been touched by the magic of the genies.',
        prereqLevel: 1,
        features: ['Genie-themed magic abilities'],
    },
    {
        name: 'Gift of the Chromatic Dragon',
        description: 'You manifest power from chromatic dragons.',
        prereqLevel: 1,
        features: ['Chromatic Infusion (Elemental damage on weapon)', 'Reactive Resistance'],
    },
    {
        name: 'Gift of the Gem Dragon',
        description: 'You manifest power from gem dragons.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Telekinetic Reprisal (Reaction to damage and push attacker)'],
    },
    {
        name: 'Gift of the Metallic Dragon',
        description: 'You manifest power from metallic dragons.',
        prereqLevel: 1,
        features: ['Protective Wings (Reaction to boost AC)', 'Spells: Cure Wounds'],
    },
    {
        name: 'Grappler',
        description: 'You’ve developed the skills necessary to hold your own in close-quarters grappling.',
        prereqLevel: 1,
        features: ['Advantage on attacks vs creature you grapple', 'Pin creature (Restrained)'],
    },
    {
        name: 'Great Weapon Fighting',
        description: 'You are effective with heavy weapons.',
        prereqLevel: 1,
        features: ['Reroll 1s and 2s on damage dice for two-handed weapons'],
    },
    {
        name: 'Greater Aberrant Mark',
        description: 'Your aberrant dragonmark has grown in power.',
        prereqLevel: 1,
        asiText: '+1 Constitution',
        features: ['Improved Fortitude', 'Mark of Inspiration'],
    },
    {
        name: 'Guile of the Cloud Giant',
        description: 'You have the elusive magic of cloud giants.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, or Charisma',
        features: ['Cloudy Escape (Reaction to resist damage and teleport)'],
    },
    {
        name: 'Gunner',
        description: 'You have a quick hand and keen eye when employing firearms.',
        prereqLevel: 1,
        asiText: '+1 Dexterity',
        features: ['Ignore Loading property', 'No disadvantage on ranged attacks in melee'],
    },
    {
        name: 'Harper Agent',
        description: 'You are an agent of the Harpers.',
        prereqLevel: 1,
        features: ['Distracting Melody'],
    },
    {
        name: 'Harper Teamwork',
        description: 'You work seamlessly with your Harper allies.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Withering Wordplay', 'Inspiring Willpower'],
    },
    {
        name: 'Heavy Armor Master',
        description: 'You can use your heavy armor to deflect strikes that would kill others.',
        prereqLevel: 1,
        asiText: '+1 Strength',
        features: ['Reduce nonmagical B/P/S damage by 3'],
    },
    {
        name: 'Infernal Constitution',
        description: 'Fiendish blood makes you resilient.',
        prereqLevel: 1,
        asiText: '+1 Constitution',
        features: ['Cold and Poison Resistance', 'Advantage on saves vs Poison'],
    },
    {
        name: 'Initiate of High Sorcery',
        description: 'You have begun your training in the magic of the Towers of High Sorcery.',
        prereqLevel: 1,
        features: ['Spells: 1 Wizard Cantrip, 2 1st-level spells'],
    },
    {
        name: 'Interception',
        description: 'You can intercept attacks meant for others.',
        prereqLevel: 1,
        features: ['Reaction to reduce damage to ally by 1d10 + PB'],
    },
    {
        name: 'Keenness of the Stone Giant',
        description: 'You manifest the earth magic of stone giants.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, or Wisdom',
        features: ['Stone Throw (Magical ranged attack)', 'Darkvision 60ft'],
    },
    {
        name: 'Knight of the Crown',
        description: 'You are a Knight of Solamnia, dedicated to the order of the Crown.',
        prereqLevel: 4,
        asiText: '+1 Strength, Dexterity, or Constitution',
        features: ['Commanding Rally (Bonus action to grant ally an attack)'],
    },
    {
        name: 'Knight of the Rose',
        description: 'You are a Knight of Solamnia, dedicated to the order of the Rose.',
        prereqLevel: 4,
        asiText: '+1 Constitution, Wisdom, or Charisma',
        features: ['Bolstering Rally (Bonus action to grant Temp HP)'],
    },
    {
        name: 'Knight of the Sword',
        description: 'You are a Knight of Solamnia, dedicated to the order of the Sword.',
        prereqLevel: 4,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Demoralizing Strike (Fear effect on hit)'],
    },
    {
        name: 'Light Bringer',
        description: 'You are a beacon of light in the darkness.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Heal in the sunlight', 'Spells: Light'],
    },
    {
        name: 'Lightly Armored',
        description: 'You have trained to master the use of light armor.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Gain Light Armor proficiency'],
    },
    {
        name: 'Linguist',
        description: 'You have studied languages and codes.',
        prereqLevel: 1,
        asiText: '+1 Intelligence',
        features: ['Create written ciphers'],
    },
    {
        name: 'Lordly Resolve',
        description: 'You have the presence of a leader.',
        prereqLevel: 1,
        asiText: '+1 Strength or Charisma',
        features: ['Standard Bearer'],
    },
    {
        name: 'Lords’ Alliance Agent',
        description: 'You act on behalf of the Lords\' Alliance.',
        prereqLevel: 1,
        features: ['Inspiring Strike', 'Reassert Honor'],
    },
    {
        name: 'Love Bites',
        description: 'You have a seductive and dangerous nature.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Charm creatures'],
    },
    {
        name: 'Mage Slayer',
        description: 'You have practiced techniques useful in melee combat against spellcasters.',
        prereqLevel: 1,
        features: ['Reaction attack when spell cast nearby', 'Disadvantage on enemy concentration', 'Advantage on spell saves vs close caster'],
    },
    {
        name: 'Mark of Detection',
        description: 'You manifest a Dragonmark of Detection.',
        prereqLevel: 1,
        features: ['Deductive Intuition (d4 bonus to Investigation/Insight)', 'Spells: Detect Magic, Detect Poison and Disease'],
    },
    {
        name: 'Martial Adept',
        description: 'You have martial training that allows you to perform special combat maneuvers.',
        prereqLevel: 1,
        features: ['1 Superiority Die (d6)', '2 Maneuvers'],
    },
    {
        name: 'Martial Weapon Training',
        description: 'You have practiced extensively with martial weapons.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Gain Martial Weapons proficiency'],
    },
    {
        name: 'Medium Armor Master',
        description: 'You have practiced moving in medium armor.',
        prereqLevel: 1,
        features: ['No Disadvantage on Stealth', 'Max Dex bonus to AC becomes +3'],
    },
    {
        name: 'Metamagic Adept',
        description: 'You have learned how to exert your will on your spells to alter how they function.',
        prereqLevel: 1,
        features: ['2 Sorcery Points', '2 Metamagic Options'],
    },
    {
        name: 'Mounted Combatant',
        description: 'You are a dangerous foe to face while mounted.',
        prereqLevel: 1,
        features: ['Advantage on attacks vs smaller unmounted foes', 'Redirect attacks to self', 'Evasion for mount'],
    },
    {
        name: 'Musician',
        description: 'You know how to entertain and inspire.',
        prereqLevel: 1,
        features: ['Inspiring Song (Grant Heroic Inspiration)'],
    },
    {
        name: 'Mythal Touched',
        description: 'You have been exposed to a Mythal\'s magic.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Mythal Ward'],
    },
    {
        name: 'Orcish Fury',
        description: 'Your fury burns tirelessly.',
        prereqLevel: 1,
        asiText: '+1 Strength or Constitution',
        features: ['Extra damage die once per rest', 'Reaction attack on Relentless Endurance'],
    },
    {
        name: 'Order\'s Resilience',
        description: 'You have the stoic resilience of the order.',
        prereqLevel: 1,
        asiText: '+1 Strength, Wisdom, or Charisma',
        features: ['Resurge', 'Stronger Together'],
    },
    {
        name: 'Outlands Envoy',
        description: 'You are used to navigating the contradictory nature of the Outlands.',
        prereqLevel: 4,
        asiText: '+1 to any ability score',
        features: ['Spells: Misty Step, Tongues'],
    },
    {
        name: 'Piercer',
        description: 'You have achieved a penetrating precision in combat.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Reroll one piercing damage die', 'Extra die on Crit'],
    },
    {
        name: 'Planar Wanderer',
        description: 'You can sense and draw on the energy of planar portals.',
        prereqLevel: 4,
        features: ['Planar Adaptation (Resistance)', 'Portal Cracker (Detect portals)'],
    },
    {
        name: 'Poisoner',
        description: 'You can prepare and delivery deadly poisons.',
        prereqLevel: 1,
        features: ['Ignore poison resistance', 'Apply poison as Bonus Action'],
    },
    {
        name: 'Prodigy',
        description: 'You have a knack for learning new things.',
        prereqLevel: 1,
        features: ['Expertise in one skill'],
    },
    {
        name: 'Protection',
        description: 'You sacrifice your own defense to protect others.',
        prereqLevel: 1,
        features: ['Reaction to impose disadvantage on attack against ally'],
    },
    {
        name: 'Purple Dragon Commandant',
        description: 'You are a leader among the Purple Dragon Knights.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Encourage Ally', 'Last Stand'],
    },
    {
        name: 'Purple Dragon Rook',
        description: 'You are a recruit of the Purple Dragons.',
        prereqLevel: 1,
        features: ['Entreat', 'Rallying Cry'],
    },
    {
        name: 'Putrefy',
        description: 'You carry a touch of decay.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Poison creatures capabilities'],
    },
    {
        name: 'Rebuke',
        description: 'You can punish those who strike you.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Inflict Prone on creatures'],
    },
    {
        name: 'Revenant Blade',
        description: 'You are a master of the double-bladed scimitar.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Double-bladed scimitar has Finesse', '+1 AC while wielding'],
    },
    {
        name: 'Righteous Heritor',
        description: 'You have inherited the power of the Upper Planes.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, or Charisma',
        features: ['Soothe Pain (Reaction to reduce damage)'],
    },
    {
        name: 'Rune Shaper',
        description: 'You have studied the runecraft of giants.',
        prereqLevel: 1,
        features: ['Rune Magic (Inscribe runes to cast spells)', 'Spells: Comprehend Languages'],
    },
    {
        name: 'Scion of the Outer Planes',
        description: 'You are influenced by the energy of the Outer Planes.',
        prereqLevel: 1,
        features: ['Resistance to a specific damage type', 'Spells: 1 Cantrip'],
    },
    {
        name: 'Second Chance',
        description: 'Fortune favors you when someone tries to strike you.',
        prereqLevel: 1,
        asiText: '+1 Dexterity, Constitution, or Charisma',
        features: ['Reaction to force enemy to reroll attack'],
    },
    {
        name: 'Shadowmoor Hexer',
        description: 'You wield the dark magic of the Shadowmoor.',
        prereqLevel: 1,
        features: ['Curse Magic', 'Spells: Hex'],
    },
    {
        name: 'Shield Master',
        description: 'You use shields not just for protection but also for offense.',
        prereqLevel: 1,
        features: ['Shield Bash (Bonus Action shove)', 'Add Shield AC to Dex saves', 'Evasion-like reaction'],
    },
    {
        name: 'Skill Expert',
        description: 'You have honed your proficiency with particular skills.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Expertise in one skill'],
    },
    {
        name: 'Skilled',
        description: 'You have an exceptionally broad learning.',
        prereqLevel: 1,
        features: ['Gain 3 Skills or Tools'],
    },
    {
        name: 'Slasher',
        description: 'You’ve learned where to cut to have the greatest results.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Reduce target speed on hit', 'Disadvantage to target on Crit'],
    },
    {
        name: 'Soul of the Storm Giant',
        description: 'You manifest the tempestuous power of storm giants.',
        prereqLevel: 4,
        asiText: '+1 Strength, Wisdom, or Charisma',
        features: ['Lightning/Thunder Resistance', 'Maelstrom Aura (Reaction push)'],
    },
    {
        name: 'Speedy',
        description: 'You are exceptionally fast and agile.',
        prereqLevel: 4,
        asiText: '+1 Dexterity or Constitution',
        features: ['+10 Speed', 'Dash ignores difficult terrain', 'Disadvantage on opportunity attacks vs you'],
    },
    {
        name: 'Spellfire Adept',
        description: 'You have learned to control spellfire.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Fueled Spellfire', 'Searing Spellfire'],
    },
    {
        name: 'Spellfire Spark',
        description: 'You possess a latent spark of spellfire.',
        prereqLevel: 1,
        features: ['Magic Absorption', 'Spellfire Flame'],
    },
    {
        name: 'Squat Nimbleness',
        description: 'You are uncommonly nimble for your race.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['+5 Walking Speed', 'Advantage to escape grapple'],
    },
    {
        name: 'Squire of Solamnia',
        description: 'You have trained in the martial traditions of the Solamnic Knights.',
        prereqLevel: 1,
        features: ['Precise Strike (Advantage on attacks)', 'Mounted Combat buff'],
    },
    {
        name: 'Street Justice',
        description: 'You learned to fight on the streets.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Headlock', 'Sturdy Knot', 'Tough Talk'],
    },
    {
        name: 'Strike of the Giants',
        description: 'You have absorbed primeval giant magic into your attacks.',
        prereqLevel: 1,
        features: ['Elemental strike effects (Fire, Frost, Storm, etc.)'],
    },
    {
        name: 'Svirfneblin Magic',
        description: 'You have inherited the innate spellcasting ability of your ancestors.',
        prereqLevel: 1,
        features: ['Spells: Nondetection, Blindness/Deafness, Blur, Disguise Self'],
    },
    {
        name: 'Telepathic',
        description: 'You awaken the ability to mentally connect with others.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Telepathy 60ft', 'Spells: Detect Thoughts'],
    },
    {
        name: 'Thrown Weapon Fighting',
        description: 'You are skilled in throwing weapons.',
        prereqLevel: 1,
        features: ['Draw weapon as part of attack', '+2 damage with thrown weapons'],
    },
    {
        name: 'Tireless Reveler',
        description: 'You can party all night and fight all day.',
        prereqLevel: 1,
        features: ['Gain Heroic Inspiration'],
    },
    {
        name: 'Treacherous Allure',
        description: 'Your beauty is a trap.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Advantage on attacks against Charmed creatures', 'Spells: Charm Person'],
    },
    {
        name: 'Two-Weapon Fighting',
        description: 'You master fighting with two weapons.',
        prereqLevel: 1,
        features: ['Add ability modifier to off-hand attack damage'],
    },
    {
        name: 'Tyro of the Gauntlet',
        description: 'You are a recruit of the Order of the Gauntlet.',
        prereqLevel: 1,
        features: ['Stand as One', 'Vigilant'],
    },
    {
        name: 'Unarmed Fighting',
        description: 'You are skilled in unarmed combat.',
        prereqLevel: 1,
        features: ['Unarmed strikes deal d6 (d8 if empty handed) + Str damage', 'Grapple damage'],
    },
    {
        name: 'Vampire Hunter',
        description: 'You have dedicated your life to hunting the undead.',
        prereqLevel: 1,
        features: ['Advantage on escaping Grapples', 'Mitigate Necrotic damage'],
    },
    {
        name: 'Vampire Touched',
        description: 'You have been touched by vampiric darkness.',
        prereqLevel: 1,
        asiText: '+1 Intelligence, Wisdom, or Charisma',
        features: ['Spider Climb', 'Spells: Vampiric Touch/Misty Step'],
    },
    {
        name: 'Vampire\'s Plaything',
        description: 'You survived being the toy of a vampire.',
        prereqLevel: 1,
        features: ['Bonus Action Dash/Disengage', 'Create Healing Potions'],
    },
    {
        name: 'Vigor of the Hill Giant',
        description: 'You possess the resilience of hill giants.',
        prereqLevel: 4,
        asiText: '+1 Strength, Constitution, or Wisdom',
        features: ['Iron Stomach (Heal when poisoned/etc)', 'Bulwark (Reaction to reduce damage)', 'Cannot be knocked prone'],
    },
    {
        name: 'Weapon Master',
        description: 'You have practiced extensively with a variety of weapons.',
        prereqLevel: 1,
        asiText: '+1 Strength or Dexterity',
        features: ['Gain 4 Weapon proficiencies'],
    },
    {
        name: 'Wood Elf Magic',
        description: 'You learn the magic of the primeval woods.',
        prereqLevel: 1,
        features: ['Spells: 1 Druid Cantrip, Longstrider, Pass Without Trace'],
    },
    {
        name: 'Zhentarim Ruffian',
        description: 'You are a thug for the Zhentarim.',
        prereqLevel: 1,
        features: ['Exploit Opening', 'Family First'],
    },
    {
        name: 'Zhentarim Tactics',
        description: 'You fight with the ruthless tactics of the Zhentarim.',
        prereqLevel: 1,
        asiText: '+1 to any ability score',
        features: ['Retaliate', 'Versatile Merc'],
    },
];


async function migrateFeats() {
    console.log('⚔️ Adding unofficial 2024 feats to Sanity...\n');

    const transaction = client.transaction();

    // Check for existing feats to avoid duplicates
    // Since we're using createOrReplace with deterministic IDs, duplication is handled automatically
    // IDs will be `feat-<slug>`

    let count = 0;
    for (const feat of FEATS) {
        const docId = `feat-${toSanityId(feat.name)}`;

        // Build description. Append ASI textual info if present.
        let desc = feat.description;
        if (feat.asiText) {
            desc += `\n\nAbility Score Increase: ${feat.asiText}`;
        }
        // Append features info to description if it's simple
        // Or we can map to the definitions.benefits.features array
        // The request had 'Features' bullet points.

        const doc = {
            _id: docId,
            _type: 'feat',
            name: feat.name,
            slug: { _type: 'slug', current: toSanityId(feat.name) },
            description: desc,
            source: 'Unofficial',
            edition: '2024',
            version: 1,
            prerequisites: {
                level: feat.prereqLevel,
            },
            benefits: {
                features: feat.features,
                // We leave abilityScoreIncrease empty here as it's complex choice-based
                // We leave spells empty as specific IDs are needed, but we put them in features text
            },
        };

        transaction.createOrReplace(doc as Parameters<typeof transaction.createOrReplace>[0]);
        count++;
    }

    console.log(`Prepared ${count} feats for migration...`);
    console.log('\nCommitting to Sanity...');
    await transaction.commit();
    console.log(`\n✅ Successfully added ${count} unofficial feats!`);
}

async function run() {
    console.log('🚀 Unofficial Feats Migration (2024 Edition)');
    console.log('='.repeat(50) + '\n');

    try {
        await migrateFeats();
        console.log('\n' + '='.repeat(50));
        console.log('🎉 Migration complete!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

run();
