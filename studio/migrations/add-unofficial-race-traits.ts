/**
 * Migration script to add traits for unofficial D&D 2024 races
 * 
 * Usage:
 * cd studio
 * SANITY_AUTH_TOKEN=xxx npx sanity exec migrations/add-unofficial-race-traits.ts --with-user-token
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

// Traits for unofficial 2024 races
const UNOFFICIAL_TRAITS = [
    // ===== ACCURSED =====
    {
        name: 'Curse Heritage',
        description: 'The traits vary entirely based on the specific curse (e.g., Curse of the Armament, Curse of the Plague), determining ability score increases and special powers.',
        tags: ['race'],
    },
    // ===== ARISEN =====
    {
        name: 'Magical Fortification',
        description: 'You have advantage on saving throws against spells and magical effects.',
        tags: ['race'],
    },
    {
        name: 'Artificial Form',
        description: 'You do not need to eat, drink, breathe, or sleep.',
        tags: ['race'],
    },
    {
        name: 'Inured to the Elements',
        description: 'You have resistance to necrotic and poison damage.',
        tags: ['race'],
    },
    {
        name: 'Unnatural Healer',
        description: 'You can manipulate your own life force to heal or bolster your defenses.',
        tags: ['race'],
    },
    // ===== ASHBORN =====
    {
        name: 'Ashen Legacy',
        description: 'You know the minor illusion cantrip.',
        tags: ['race'],
    },
    {
        name: 'Fiendish Fortune',
        description: 'You can re-roll a 1 on an attack roll, saving throw, or ability check (similar to Halfling Luck).',
        tags: ['race'],
    },
    {
        name: 'Scorpion Sting',
        description: 'You have a natural weapon attack (tail) that deals piercing damage plus poison.',
        tags: ['race'],
    },
    // ===== AZUREBORN =====
    {
        name: 'Azure Legacy',
        description: 'You know the guidance cantrip.',
        tags: ['race'],
    },
    {
        name: 'Winds of Magic',
        description: 'You have a flying speed equal to your walking speed.',
        tags: ['race'],
    },
    {
        name: 'Glimpse Fate',
        description: 'You can cast augury without a spell slot (starting at level 3).',
        tags: ['race'],
    },
    // ===== BOGBORN =====
    {
        name: 'Bog Bulk',
        description: 'You have advantage on checks to end the grappled condition; powerful build.',
        tags: ['race'],
    },
    {
        name: 'Regeneration',
        description: 'You can spend a Hit Die as a bonus action to heal yourself during combat.',
        tags: ['race'],
    },
    {
        name: 'Guiding Bond',
        description: 'You can help allies navigate difficult terrain.',
        tags: ['race'],
    },
    // ===== CERVAN =====
    {
        name: 'Surge of Vigor',
        description: 'If an attack deals over half your current HP in damage, you can use a reaction to immediately heal.',
        tags: ['race'],
    },
    {
        name: 'Practical',
        description: 'You gain proficiency in one artisan\'s tool or skill related to survival/crafting.',
        tags: ['race'],
    },
    // ===== CNIDARAN =====
    {
        name: 'Transparent',
        description: 'You have advantage on Stealth checks while submerged in water.',
        tags: ['race'],
    },
    {
        name: 'Nematocyst',
        description: 'You can deliver a stinging shock with your unarmed strikes.',
        tags: ['race'],
    },
    {
        name: 'Shimmerskin',
        description: 'Your skin can flash with light to distract or blind foes.',
        tags: ['race'],
    },
    // ===== CURSEBORN =====
    {
        name: 'Cursed Claws',
        description: 'You possess natural claws that deal slashing damage.',
        tags: ['race'],
    },
    {
        name: 'Grey Balance',
        description: 'You have a connection to the curse "The Grey," allowing you to hex foes to give them disadvantage.',
        tags: ['race'],
    },
    {
        name: 'Lupine Sense',
        description: 'You have advantage on Perception checks relying on hearing or smell.',
        tags: ['race'],
    },
    // ===== CYCLOPIAN =====
    {
        name: 'Knowledge Seeker',
        description: 'You have proficiency in History or Arcana.',
        tags: ['race'],
    },
    {
        name: 'Top Shelf',
        description: 'You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.',
        tags: ['race'],
    },
    {
        name: 'Savant of Secrets',
        description: 'You can identify spells being cast or magic items more easily.',
        tags: ['race'],
    },
    {
        name: 'Thought for Food',
        description: 'You can consume written knowledge (books/scrolls) to sustain yourself instead of food.',
        tags: ['race'],
    },
    // ===== DARA =====
    {
        name: 'Create Talisman',
        description: 'You can craft paper charms that store minor magical effects or protections.',
        tags: ['race'],
    },
    {
        name: 'Sacred Revelation',
        description: 'You gain glimpses of insight, allowing you to add a bonus to skill checks.',
        tags: ['race'],
    },
    {
        name: 'Impart Knowledge',
        description: 'You can help an ally, granting them proficiency in a skill you know for a short time.',
        tags: ['race'],
    },
    // ===== DARAKHUL =====
    {
        name: 'Hunger for Flesh',
        description: 'You must consume raw meat to gain the benefits of a Long Rest.',
        tags: ['race'],
    },
    {
        name: 'Undead Vitality',
        description: 'You don\'t breathe and are immune to disease and poison.',
        tags: ['race'],
    },
    {
        name: 'Powerful Jaw',
        description: 'You have a bite attack that deals piercing damage.',
        tags: ['race'],
    },
    // ===== DEEPBORN =====
    {
        name: 'Eldritch Gibbering',
        description: 'You can unleash a stream of unintelligible sounds to distract or frighten enemies.',
        tags: ['race'],
    },
    {
        name: 'Endless Hunger',
        description: 'You can consume almost any organic matter to sustain yourself.',
        tags: ['race'],
    },
    // ===== DISEMBODIED =====
    {
        name: 'Fade Away',
        description: 'You can use a bonus action to become invisible until the start of your next turn or until you attack/cast a spell.',
        tags: ['race'],
    },
    {
        name: 'Planar Outcast',
        description: 'You can sense portals or rifts to other planes.',
        tags: ['race'],
    },
    {
        name: 'Arcane Origins',
        description: 'You know a cantrip (usually prestidigitation or thaumaturgy) from your time in the magical city.',
        tags: ['race'],
    },
    {
        name: 'Ethereal Strike',
        description: 'Your attacks can bypass some forms of cover or magical defense (e.g., Shield spell).',
        tags: ['race'],
    },
    // ===== DOWNCAST =====
    {
        name: 'Divine Sangromancy',
        description: 'You can sacrifice your own hit points to heal others or empower your spells.',
        tags: ['race'],
    },
    {
        name: 'Touch of Life',
        description: 'You can cast cure wounds once per long rest (mechanics vary by subrace).',
        tags: ['race'],
    },
    {
        name: 'Meditative Rest',
        description: 'You require less sleep than normal humans (4 hours).',
        tags: ['race'],
    },
    {
        name: 'Moved by Faith',
        description: 'You have proficiency in Insight or Religion.',
        tags: ['race'],
    },
    // ===== DREAMER =====
    {
        name: 'Dreamwalking',
        description: 'While asleep, your consciousness can drift and observe your surroundings.',
        tags: ['race'],
    },
    {
        name: 'Power Nap',
        description: 'You gain the benefits of a Short Rest in half the time (30 minutes).',
        tags: ['race'],
    },
    {
        name: 'Stalwart Reserves',
        description: 'When you are reduced to 0 hit points, you can drop to 1 instead (once per long rest).',
        tags: ['race'],
    },
    {
        name: 'Quick Initiative',
        description: 'You add your proficiency bonus to initiative rolls.',
        tags: ['race'],
    },
    // ===== ERINA =====
    {
        name: 'Spines',
        description: 'Enemies who grapple or hit you with unarmed strikes take piercing damage.',
        tags: ['race'],
    },
    {
        name: 'Digger',
        description: 'You have a burrowing speed of 20 ft. (cannot burrow through stone).',
        tags: ['race'],
    },
    {
        name: 'Hardy',
        description: 'You have resistance to poison damage.',
        tags: ['race'],
    },
    // ===== ETHEREAN =====
    {
        name: 'Misty Sight',
        description: 'You can see into the Ethereal Plane up to 60 feet.',
        tags: ['race'],
    },
    {
        name: 'Veil Shift',
        description: 'As a bonus action, you can step into the Ethereal Plane until the start of your next turn.',
        tags: ['race'],
    },
    // ===== GALLUS =====
    {
        name: 'Wing Flap',
        description: 'You can use a bonus action to propel yourself upward or backward.',
        tags: ['race'],
    },
    {
        name: 'Communal',
        description: 'You can use the Help action as a bonus action.',
        tags: ['race'],
    },
    {
        name: 'Militia Training',
        description: 'You have proficiency with simple weapons and light armor.',
        tags: ['race'],
    },
    // ===== GELETON =====
    {
        name: 'Amorphous',
        description: 'You can move through a space as narrow as 1 inch wide without squeezing.',
        tags: ['race'],
    },
    {
        name: 'Symbiotic Fortitude',
        description: 'You have resistance to acid damage.',
        tags: ['race'],
    },
    {
        name: 'Limited Blindsight',
        description: 'You have blindsight out to 30 feet (blind beyond this radius).',
        tags: ['race'],
    },
    {
        name: 'Wakeful',
        description: 'You do not sleep, remaining semi-conscious during long rests.',
        tags: ['race'],
    },
    // ===== GEPPETTIN =====
    {
        name: 'Construct Nature',
        description: 'You do not need to eat, drink, or breathe. You are immune to disease.',
        tags: ['race'],
    },
    {
        name: 'Handcrafted Quality',
        description: 'You have natural armor (AC = 11 + Dex) due to your rigid body.',
        tags: ['race'],
    },
    {
        name: 'False Appearance',
        description: 'While you remain motionless, you are indistinguishable from an ordinary doll.',
        tags: ['race'],
    },
    // ===== GNARLBORN =====
    {
        name: 'Deep Roots',
        description: 'You have advantage on saving throws against being knocked prone or moved against your will.',
        tags: ['race'],
    },
    {
        name: 'Elderwood Whispers',
        description: 'You can communicate with plants.',
        tags: ['race'],
    },
    {
        name: 'Grasping Branches',
        description: 'Your long limbs give you a longer reach for melee attacks.',
        tags: ['race'],
    },
    {
        name: 'Bark Armor',
        description: 'Your bark-like skin provides a base AC of 16 (you cannot wear armor).',
        tags: ['race'],
    },
    // ===== GOBBOC =====
    {
        name: 'Coward\'s Creed',
        description: 'You gain a burst of speed when you are frightened or use the Dash action away from enemies.',
        tags: ['race'],
    },
    {
        name: 'Feathered',
        description: 'You have a slow fall ability (cannot fly, but glide safely).',
        tags: ['race'],
    },
    {
        name: 'Headless Chicken',
        description: 'When reduced to 0 hit points, you can move and act for one turn before falling unconscious.',
        tags: ['race'],
    },
    // ===== GOLYNN =====
    {
        name: 'Tremorsense',
        description: 'You can detect vibrations in the ground within 10 feet.',
        tags: ['race'],
    },
    {
        name: 'Shovel Talons',
        description: 'Your claws are natural weapons and grant a burrow speed through loose earth.',
        tags: ['race'],
    },
    {
        name: 'Drill Dervish',
        description: 'If you move at least 10 feet burrowing, your next attack deals extra damage.',
        tags: ['race'],
    },
    // ===== GRAVEBORN =====
    {
        name: 'Devour Corpse',
        description: 'You can consume a corpse to regain hit points or gain temporary hit points.',
        tags: ['race'],
    },
    {
        name: 'Frozen Waste',
        description: 'You have resistance to cold damage (or necrotic, depending on subrace).',
        tags: ['race'],
    },
    {
        name: 'Infused Drakkonite',
        description: 'Your body is infused with a magical mineral that grants natural armor.',
        tags: ['race'],
    },
    // ===== GRUDGEL =====
    {
        name: 'Battlefield Control',
        description: 'When you hit a creature with an attack, you can reduce their speed or shove them.',
        tags: ['race'],
    },
    {
        name: 'Centered',
        description: 'You have advantage on saving throws against being frightened.',
        tags: ['race'],
    },
    {
        name: 'Tireless',
        description: 'You can ignore the effects of one level of exhaustion.',
        tags: ['race'],
    },
    // ===== HARVESTBORN =====
    {
        name: 'Jack-O-Lantern',
        description: 'You can detach your head or use it to emit a frightening light/gaze attack.',
        tags: ['race'],
    },
    {
        name: 'Gift of the Green',
        description: 'You know a druid cantrip (e.g., druidcraft or shillelagh).',
        tags: ['race'],
    },
    {
        name: 'Watchful Rest',
        description: 'You remain fully conscious during long rests.',
        tags: ['race'],
    },
    // ===== HEDGE =====
    {
        name: 'Spiny Quills',
        description: 'When curled up, melee attackers take damage when they hit you.',
        tags: ['race'],
    },
    {
        name: 'Curl Up',
        description: 'You can use an action to curl into a ball, increasing your AC significantly but limiting movement.',
        tags: ['race'],
    },
    {
        name: 'Natural Burrowers',
        description: 'You have a burrow speed through soil.',
        tags: ['race'],
    },
    {
        name: 'Speak with Bugs',
        description: 'You can communicate with small beasts (insects/worms).',
        tags: ['race'],
    },
    // ===== JERBEEN =====
    {
        name: 'Team Tactics',
        description: 'You can use the Help action as a bonus action.',
        tags: ['race'],
    },
    {
        name: 'Take Heart',
        description: 'You have advantage on saving throws against being frightened.',
        tags: ['race'],
    },
    {
        name: 'Nimbleness',
        description: 'You can move through the space of any creature that is of a size larger than yours.',
        tags: ['race'],
    },
    // ===== LANESHI =====
    {
        name: 'Psychic Spirit',
        description: 'You have resistance to psychic damage.',
        tags: ['race'],
    },
    {
        name: 'Animal Friend',
        description: 'You can communicate with beasts that have a swimming speed.',
        tags: ['race'],
    },
    {
        name: 'Awakened Mind',
        description: 'You can telepathically speak to creatures within 30 feet.',
        tags: ['race'],
    },
    // ===== LUMA =====
    {
        name: 'Touched',
        description: 'You know one cantrip from the Sorcerer spell list.',
        tags: ['race'],
    },
    {
        name: 'Fated',
        description: 'When you roll a 1 on an attack, save, or check, you can re-roll the die (once per short rest).',
        tags: ['race'],
    },
    // ===== MANDRAKE =====
    {
        name: 'Plant Nature',
        description: 'You are considered a plant type creature (vulnerable to fire, resistant to poison).',
        tags: ['race'],
    },
    {
        name: 'Root Magic',
        description: 'You know the shillelagh or thorn whip cantrip.',
        tags: ['race'],
    },
    {
        name: 'Entangling Vines',
        description: 'You can use your reaction to grapple a creature that hits you with a melee attack.',
        tags: ['race'],
    },
    {
        name: 'Natural Connection',
        description: 'You have proficiency in Nature or Survival.',
        tags: ['race'],
    },
    // ===== MAPACH =====
    {
        name: 'Scroungecraft',
        description: 'You can craft temporary items from scrap (like arrows or simple tools) during a short rest.',
        tags: ['race'],
    },
    {
        name: 'Resilience',
        description: 'You have resistance to poison damage and advantage on saves against poison.',
        tags: ['race'],
    },
    {
        name: 'Skulker',
        description: 'You have advantage on Stealth checks.',
        tags: ['race'],
    },
    // ===== NAKUDAMA =====
    {
        name: 'Prehensile Tongue',
        description: 'You can use your tongue to grapple targets or objects up to 15 feet away.',
        tags: ['race'],
    },
    {
        name: 'Latching Tongue',
        description: 'You can use your tongue to pull yourself toward a surface or object.',
        tags: ['race'],
    },
    // ===== OGRESH =====
    {
        name: 'Commanding Insight',
        description: 'You can use a bonus action to give an ally advantage on their next attack.',
        tags: ['race'],
    },
    {
        name: 'Calculating Listener',
        description: 'You gain insight into a creature\'s stats or emotional state after listening to them speak.',
        tags: ['race'],
    },
    {
        name: 'Environmental Awareness',
        description: 'You have proficiency in Perception or Insight.',
        tags: ['race'],
    },
    // ===== PLAGUEBORN =====
    {
        name: 'Born in Filth',
        description: 'You are immune to disease and have resistance to poison damage.',
        tags: ['race'],
    },
    {
        name: 'Infected Cunning',
        description: 'You can apply poison to your weapons as a bonus action (or gain advantage on checks to hide/deceive).',
        tags: ['race'],
    },
    {
        name: 'Plague Bearer',
        description: 'You can cast ray of sickness or a similar disease-based spell once per long rest.',
        tags: ['race'],
    },
    // ===== QUICKSTEP =====
    {
        name: 'Nimble',
        description: 'You can move through the space of any creature that is of a size larger than yours.',
        tags: ['race'],
    },
    {
        name: 'Startling Speed',
        description: 'Your base walking speed is exceptionally high (50 ft.).',
        tags: ['race'],
    },
    {
        name: 'Evasion',
        description: 'You take no damage on successful Dex saves against area effects.',
        tags: ['race'],
    },
    // ===== RAKIN =====
    {
        name: 'Urban Scavenger',
        description: 'You have proficiency in Investigation or Sleight of Hand.',
        tags: ['race'],
    },
    {
        name: 'Agile',
        description: 'You can take the Disengage or Hide action as a bonus action.',
        tags: ['race'],
    },
    // ===== RATATOSK =====
    {
        name: 'Grounded Celestial',
        description: 'You are a celestial type, but bound to the material plane.',
        tags: ['race'],
    },
    {
        name: 'Sharp Tusks',
        description: 'You have a bite attack that deals piercing damage.',
        tags: ['race'],
    },
    {
        name: 'Telepathic',
        description: 'You can communicate telepathically with any creature within 30 feet.',
        tags: ['race'],
    },
    // ===== RELICBORN =====
    {
        name: 'Dance of Death',
        description: 'Perform a dance to gain advantage on attacks or temporary HP.',
        tags: ['race'],
    },
    {
        name: 'Eternal Party',
        description: 'You do not need to sleep, only revel (light activity) for 4 hours for a long rest.',
        tags: ['race'],
    },
    {
        name: 'Moment of Remembrance',
        description: 'Use a reaction to help an ally succeed on a failed roll by adding a d4.',
        tags: ['race'],
    },
    {
        name: 'Soul of Revelry',
        description: 'You have proficiency in Performance or a musical instrument.',
        tags: ['race'],
    },
    // ===== SATARRE =====
    {
        name: 'Carrier of Rot',
        description: 'You are immune to disease and have resistance to necrotic damage.',
        tags: ['race'],
    },
    {
        name: 'Keeper of Secrets',
        description: 'You have proficiency in Arcana or History; you can cast detect thoughts once per day.',
        tags: ['race'],
    },
    {
        name: 'A Friend to Death',
        description: 'You have advantage on death saving throws.',
        tags: ['race'],
    },
    // ===== SHADE =====
    {
        name: 'Ghostly Flesh',
        description: 'You have resistance to necrotic and poison damage.',
        tags: ['race'],
    },
    {
        name: 'Life Drain',
        description: 'You can deal necrotic damage with a touch and heal yourself.',
        tags: ['race'],
    },
    {
        name: 'Imperfect Undeath',
        description: 'You are humanoid, but you appear undead and can be detected by Paladin senses.',
        tags: ['race'],
    },
    {
        name: 'Living Origin',
        description: 'You retain the size and speed of your former race.',
        tags: ['race'],
    },
    // ===== SILKBORN =====
    {
        name: 'Spider Climb',
        description: 'You can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.',
        tags: ['race'],
    },
    {
        name: 'Webbing',
        description: 'You can cast web or create a small web trap once per short rest.',
        tags: ['race'],
    },
    {
        name: 'Bejeweled Carapace',
        description: 'You have natural armor (AC 13 + Dex).',
        tags: ['race'],
    },
    // ===== STONEBORN =====
    {
        name: 'Silver Bulwark',
        description: 'You have resistance to non-magical slashing damage (or similar physical resistance).',
        tags: ['race'],
    },
    {
        name: 'Watchful Senses',
        description: 'You don\'t need to sleep and remain conscious during rests (petrified state).',
        tags: ['race'],
    },
    {
        name: 'Argent Gleam',
        description: 'You can emit light or flash to blind enemies.',
        tags: ['race'],
    },
    // ===== THREADBORN =====
    {
        name: 'Ball-jointed',
        description: 'You have resistance to bludgeoning damage and damage from falling.',
        tags: ['race'],
    },
    {
        name: 'Innocent Mind',
        description: 'You have advantage on Wisdom saving throws against magic.',
        tags: ['race'],
    },
    {
        name: 'Sewn Nature',
        description: 'You are a construct type; you don\'t eat, breathe, or sleep.',
        tags: ['race'],
    },
    {
        name: 'You\'ve Got a Friend',
        description: 'You can cast heroism or sanctuary on an ally once per long rest.',
        tags: ['race'],
    },
    // ===== WECHSELKIND =====
    {
        name: 'Faerie Glamour',
        description: 'You can cast disguise self to appear as the child you replaced.',
        tags: ['race'],
    },
    {
        name: 'Childish Agility',
        description: 'You have proficiency in Acrobatics and Sleight of Hand.',
        tags: ['race'],
    },
    {
        name: 'Creature Cover',
        description: 'You can hide behind a creature that is at least one size larger than you.',
        tags: ['race'],
    },
    // ===== WULVEN =====
    {
        name: 'Hunter\'s Instinct',
        description: 'You have proficiency in Survival or Perception.',
        tags: ['race'],
    },
    {
        name: 'Natural Attack (Claws)',
        description: 'Your claws are natural weapons dealing slashing damage.',
        tags: ['race'],
    },
    {
        name: 'Pack Hunter',
        description: 'You have advantage on an attack roll against a creature if at least one of your allies is within 5 feet of the creature.',
        tags: ['race'],
    },
    {
        name: 'Burst of Speed',
        description: 'You can move double your speed as a bonus action once per short rest.',
        tags: ['race'],
    },
    // ===== KEEN SENSES (shared) =====
    {
        name: 'Keen Senses',
        description: 'You have proficiency in Perception.',
        tags: ['race'],
    },
    // ===== POWERFUL BUILD (shared) =====
    {
        name: 'Powerful Build',
        description: 'You count as one size larger when determining your carrying capacity and the weight you can push, drag, or lift.',
        tags: ['race'],
    },
];

async function addUnofficialTraits() {
    console.log('🔍 Checking for existing traits...');

    // Get existing traits
    const existingTraits = await client.fetch(`*[_type == "trait"]{name}`);
    const existingNames = new Set(existingTraits.map((t: { name: string }) => t.name.toLowerCase()));

    // Filter to only new traits
    const newTraits = UNOFFICIAL_TRAITS.filter(t => !existingNames.has(t.name.toLowerCase()));

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
        source: 'Unofficial',
        edition: '2024',
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
    console.log('🚀 Adding Unofficial Race Traits (2024 Edition)');
    console.log('='.repeat(50));

    try {
        await addUnofficialTraits();
        console.log('\n🎉 Done!');
    } catch (error) {
        console.error('❌ Failed:', error);
        process.exit(1);
    }
}

run();
