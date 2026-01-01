/**
 * Migration script to add unofficial D&D 2024 races to Sanity
 * 
 * This script:
 * 1. Creates race documents with all metadata
 * 2. Links races to existing trait documents (run add-unofficial-race-traits.ts first!)
 * 3. Sets up proficiency rules for skill proficiencies
 * 
 * Usage:
 * 1. First run: npx sanity exec migrations/add-unofficial-race-traits.ts --with-user-token
 * 2. Then run: npx sanity exec migrations/add-unofficial-races.ts --with-user-token
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
    size: string;
    speed: number;
    languages: string[];
    traitNames: string[];
    proficiencies: Array<{ type: string; mode: string; count?: number; options: string[] }>;
    isSpellcaster?: boolean;
    swimSpeed?: number;
    climbSpeed?: number;
    burrowSpeed?: number;
    flySpeed?: number;
}

const UNOFFICIAL_RACES: RaceDefinition[] = [
    // ===== ACCURSED =====
    {
        id: 'accursed',
        name: 'Accursed',
        description: 'Beings afflicted by a curse that has fundamentally changed their nature, effectively becoming a heritage unto themselves.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Curse Heritage', 'Darkvision'],
        proficiencies: [],
    },
    // ===== ARISEN =====
    {
        id: 'arisen',
        name: 'Arisen',
        description: 'Undead who have retained their sentience and free will, often appearing as mummified or preserved corpses.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Magical Fortification', 'Artificial Form', 'Inured to the Elements', 'Unnatural Healer'],
        proficiencies: [],
    },
    // ===== ASHBORN =====
    {
        id: 'ashborn',
        name: 'Ashborn',
        description: 'An imp-like species native to the volcanic province of Chernabos, born from fire and ash.',
        size: 'Small',
        speed: 30,
        languages: ['Common', 'Ignan'],
        traitNames: ['Ashen Legacy', 'Fiendish Fortune', 'Scorpion Sting', 'Darkvision'],
        proficiencies: [],
        isSpellcaster: true,
    },
    // ===== AZUREBORN =====
    {
        id: 'azureborn',
        name: 'Azureborn',
        description: 'A harpy-like species native to Astramar, possessing bird-like features and a connection to the wind.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Auran'],
        traitNames: ['Azure Legacy', 'Winds of Magic', 'Glimpse Fate'],
        proficiencies: [],
        isSpellcaster: true,
        flySpeed: 30,
    },
    // ===== BOGBORN =====
    {
        id: 'bogborn',
        name: 'Bogborn',
        description: 'A troll-like species native to Zulrogg, rising from the still, dark waters of the swamp.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Giant'],
        traitNames: ['Bog Bulk', 'Regeneration', 'Guiding Bond', 'Keen Senses'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
        ],
    },
    // ===== CERVAN =====
    {
        id: 'cervan',
        name: 'Cervan',
        description: 'Deer-like folk who make their homes in small, intimate villages. They are practical and hardy survivors.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Surge of Vigor', 'Practical'],
        proficiencies: [],
    },
    // ===== CNIDARAN =====
    {
        id: 'cnidaran',
        name: 'Cnidaran',
        description: 'Jellyfish-folk who are enraptured by wanderlust and ocean currents. They are translucent and fluid.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Aquan'],
        traitNames: ['Amphibious', 'Transparent', 'Nematocyst', 'Shimmerskin'],
        proficiencies: [],
        swimSpeed: 30,
    },
    // ===== CURSEBORN =====
    {
        id: 'curseborn',
        name: 'Curseborn',
        description: 'A werewolf-like species native to Edwardia, often emerging from the cursed fog.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Cursed Claws', 'Grey Balance', 'Lupine Sense', 'Darkvision'],
        proficiencies: [],
    },
    // ===== CYCLOPIAN =====
    {
        id: 'cyclopian',
        name: 'Cyclopian',
        description: 'One-eyed kin to giants, known for their pursuit of knowledge and secrets.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Giant'],
        traitNames: ['Knowledge Seeker', 'Top Shelf', 'Savant of Secrets', 'Thought for Food'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['History', 'Arcana'] },
        ],
    },
    // ===== DARA =====
    {
        id: 'dara',
        name: 'Dara',
        description: 'Wanderers and chroniclers who seek out knowledge and observe the world, often carrying scrolls or journals.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Create Talisman', 'Sacred Revelation', 'Impart Knowledge'],
        proficiencies: [],
    },
    // ===== DARAKHUL =====
    {
        id: 'darakhul',
        name: 'Darakhul',
        description: 'Intelligent ghouls who have carved out a civilization in the Shadow Realm.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Undercommon'],
        traitNames: ['Hunger for Flesh', 'Undead Vitality', 'Powerful Jaw', 'Sunlight Sensitivity'],
        proficiencies: [],
    },
    // ===== DEEPBORN =====
    {
        id: 'deepborn',
        name: 'Deepborn',
        description: 'A fish-like species native to Olmarsh, often associated with eldritch depths.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Deep Speech'],
        traitNames: ['Eldritch Gibbering', 'Endless Hunger', 'Amphibious', 'Darkvision'],
        proficiencies: [],
        swimSpeed: 30,
    },
    // ===== DISEMBODIED =====
    {
        id: 'disembodied',
        name: 'Disembodied',
        description: 'Creatures trapped between worlds with a tenuous grasp on the Material Plane.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Deep Speech'],
        traitNames: ['Fade Away', 'Planar Outcast', 'Arcane Origins', 'Ethereal Strike'],
        proficiencies: [],
        isSpellcaster: true,
    },
    // ===== DOWNCAST =====
    {
        id: 'downcast',
        name: 'Downcast',
        description: 'Mortal descendants of fallen celestials who retain a spark of divine power.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Celestial'],
        traitNames: ['Divine Sangromancy', 'Touch of Life', 'Meditative Rest', 'Moved by Faith'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Insight', 'Religion'] },
        ],
        isSpellcaster: true,
    },
    // ===== DREAMER =====
    {
        id: 'dreamer',
        name: 'Dreamer',
        description: 'People who spent a long time in the Ethereal Plane or a dream state, now shaped by their slumber.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Dreamwalking', 'Power Nap', 'Stalwart Reserves', 'Quick Initiative'],
        proficiencies: [],
    },
    // ===== ERINA =====
    {
        id: 'erina',
        name: 'Erina',
        description: 'Small, bipedal hedgehog-folk who love burrowing and foraging.',
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Spines', 'Digger', 'Keen Senses', 'Hardy'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Perception'] },
        ],
        burrowSpeed: 20,
    },
    // ===== ETHEREAN =====
    {
        id: 'etherean',
        name: 'Etherean',
        description: 'Grey-skinned humanoids native to the Border Ethereal who value decency and community.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Misty Sight', 'Veil Shift', 'Planar Outcast'],
        proficiencies: [],
    },
    // ===== GALLUS =====
    {
        id: 'gallus',
        name: 'Gallus',
        description: 'Birdfolk resembling chickens, grouse, or pheasants. They are communal and value nature.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Glide', 'Wing Flap', 'Communal', 'Militia Training'],
        proficiencies: [],
    },
    // ===== GELETON =====
    {
        id: 'geleton',
        name: 'Geleton',
        description: 'A symbiotic fusion of an ooze and a reanimated skeleton, given a second chance at life.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Amorphous', 'Symbiotic Fortitude', 'Limited Blindsight', 'Wakeful'],
        proficiencies: [],
    },
    // ===== GEPPETTIN =====
    {
        id: 'geppettin',
        name: 'Geppettin',
        description: 'Sentient constructs resembling dolls or marionettes, brought to life by magic.',
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Gnomish'],
        traitNames: ['Construct Nature', 'Handcrafted Quality', 'False Appearance'],
        proficiencies: [],
    },
    // ===== GNARLBORN =====
    {
        id: 'gnarlborn',
        name: 'Gnarlborn',
        description: 'A tree-like species sprouting from the twisted soil of dark forests.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Deep Roots', 'Elderwood Whispers', 'Grasping Branches', 'Bark Armor'],
        proficiencies: [],
    },
    // ===== GOBBOC =====
    {
        id: 'gobboc',
        name: 'Gobboc',
        description: 'Chicken-folk who are skittish but surprisingly resilient.',
        size: 'Small',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Coward\'s Creed', 'Feathered', 'Headless Chicken'],
        proficiencies: [],
    },
    // ===== GOLYNN =====
    {
        id: 'golynn',
        name: 'Golynn',
        description: 'Mole or badger-like wanderers who are excellent diggers and natural adventurers.',
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Terran'],
        traitNames: ['Tremorsense', 'Shovel Talons', 'Drill Dervish', 'Powerful Build'],
        proficiencies: [],
        burrowSpeed: 15,
    },
    // ===== GRAVEBORN =====
    {
        id: 'graveborn',
        name: 'Graveborn',
        description: 'A ghoul-like species native to Syndramas, infused with necrotic energy.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Undercommon'],
        traitNames: ['Devour Corpse', 'Frozen Waste', 'Infused Drakkonite', 'Darkvision'],
        proficiencies: [],
    },
    // ===== GRUDGEL =====
    {
        id: 'grudgel',
        name: 'Grudgel',
        description: 'Strong, brutish wanderers with a fascination for crafting and magic, often acting as enforcers.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Dwarvish'],
        traitNames: ['Battlefield Control', 'Powerful Build', 'Centered', 'Tireless'],
        proficiencies: [],
    },
    // ===== HARVESTBORN =====
    {
        id: 'harvestborn',
        name: 'Harvestborn',
        description: 'Scarecrow-like beings brought to life, native to Enoch.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Construct Nature', 'Jack-O-Lantern', 'Gift of the Green', 'Watchful Rest'],
        proficiencies: [],
        isSpellcaster: true,
    },
    // ===== HEDGE =====
    {
        id: 'hedge',
        name: 'Hedge',
        description: 'Hedgehog-folk who are diplomatic, kind, and empathetic. They curl into balls for defense.',
        size: 'Small',
        speed: 25,
        languages: ['Common'],
        traitNames: ['Spiny Quills', 'Curl Up', 'Natural Burrowers', 'Speak with Bugs'],
        proficiencies: [],
    },
    // ===== JERBEEN =====
    {
        id: 'jerbeen',
        name: 'Jerbeen',
        description: 'Mouse-like folk who are small but brave, known for their teamwork and agility.',
        size: 'Small',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Standing Leap', 'Team Tactics', 'Take Heart', 'Nimbleness'],
        proficiencies: [],
    },
    // ===== LANESHI =====
    {
        id: 'laneshi',
        name: 'Laneshi',
        description: 'Aquatic humanoids from a society deeply connected to the dualities of life and death.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Aquan'],
        traitNames: ['Amphibious', 'Psychic Spirit', 'Animal Friend', 'Awakened Mind'],
        proficiencies: [],
        swimSpeed: 30,
    },
    // ===== LUMA =====
    {
        id: 'luma',
        name: 'Luma',
        description: 'Birdfolk resembling doves or pigeons. They are often touched by fate or magic and are socially eccentric.',
        size: 'Small',
        speed: 25,
        languages: ['Common'],
        traitNames: ['Glide', 'Touched', 'Fated', 'Wing Flap'],
        proficiencies: [],
        isSpellcaster: true,
    },
    // ===== MANDRAKE =====
    {
        id: 'mandrake',
        name: 'Mandrake',
        description: 'Plant-folk emissaries that bridge the gap between flora and fauna.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Plant Nature', 'Root Magic', 'Entangling Vines', 'Natural Connection'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Nature', 'Survival'] },
        ],
        isSpellcaster: true,
    },
    // ===== MAPACH =====
    {
        id: 'mapach',
        name: 'Mapach',
        description: 'Raccoon-like folk who are crafty, resilient, and skilled at scavenging and crafting.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Scroungecraft', 'Resilience', 'Skulker', 'Darkvision'],
        proficiencies: [],
        climbSpeed: 20,
    },
    // ===== NAKUDAMA =====
    {
        id: 'nakudama',
        name: 'Nakudama',
        description: 'Fun-loving, amphibious frog-folk who live for food, music, and comfort.',
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Aquan'],
        traitNames: ['Amphibious', 'Prehensile Tongue', 'Standing Leap', 'Latching Tongue'],
        proficiencies: [],
        swimSpeed: 30,
    },
    // ===== OGRESH =====
    {
        id: 'ogresh',
        name: 'Ogresh',
        description: 'Large, solitary beings known for their wisdom and listening skills. They often serve as advisors.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Giant'],
        traitNames: ['Commanding Insight', 'Calculating Listener', 'Powerful Build', 'Environmental Awareness'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Perception', 'Insight'] },
        ],
    },
    // ===== PLAGUEBORN =====
    {
        id: 'plagueborn',
        name: 'Plagueborn',
        description: 'Rat-like species who are survivors of disease and filth.',
        size: 'Small',
        speed: 30,
        languages: ['Common', 'Undercommon'],
        traitNames: ['Born in Filth', 'Infected Cunning', 'Plague Bearer', 'Darkvision'],
        proficiencies: [],
        isSpellcaster: true,
    },
    // ===== QUICKSTEP =====
    {
        id: 'quickstep',
        name: 'Quickstep',
        description: 'Small, speedy fey folk who love duels, sabotage, and finery.',
        size: 'Small',
        speed: 50,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Nimble', 'Startling Speed', 'Evasion', 'Fey Ancestry'],
        proficiencies: [],
    },
    // ===== RAKIN =====
    {
        id: 'rakin',
        name: 'Rakin',
        description: 'Raccoon-folk known for their ingeniousness and tendency to get into trouble.',
        size: 'Small',
        speed: 30,
        languages: ['Common', 'Undercommon'],
        traitNames: ['Urban Scavenger', 'Agile', 'Darkvision'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Investigation', 'Sleight of Hand'] },
        ],
        climbSpeed: 30,
    },
    // ===== RATATOSK =====
    {
        id: 'ratatosk',
        name: 'Ratatosk',
        description: 'Squirrel-like celestials who guard the World Tree and fight corruption.',
        size: 'Small',
        speed: 30,
        languages: ['Common', 'Celestial'],
        traitNames: ['Grounded Celestial', 'Sharp Tusks', 'Telepathic', 'Darkvision'],
        proficiencies: [],
        climbSpeed: 30,
    },
    // ===== RELICBORN =====
    {
        id: 'relicborn',
        name: 'Relicborn',
        description: 'Skeleton-like species emerging from tombs to celebrate life.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Undercommon'],
        traitNames: ['Dance of Death', 'Eternal Party', 'Moment of Remembrance', 'Soul of Revelry'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Performance'] },
        ],
    },
    // ===== SATARRE =====
    {
        id: 'satarre',
        name: 'Satarre',
        description: 'Dark, wise creatures often serving cults or warning against them. Known as "Children of the Rot".',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Carrier of Rot', 'Keeper of Secrets', 'A Friend to Death', 'Darkvision'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Arcana', 'History'] },
        ],
        isSpellcaster: true,
    },
    // ===== SHADE =====
    {
        id: 'shade',
        name: 'Shade',
        description: 'Echoes of souls left behind, existing as semi-corporeal beings.',
        size: 'Medium',
        speed: 30,
        languages: ['Common'],
        traitNames: ['Ghostly Flesh', 'Life Drain', 'Imperfect Undeath', 'Living Origin'],
        proficiencies: [],
    },
    // ===== SILKBORN =====
    {
        id: 'silkborn',
        name: 'Silkborn',
        description: 'Spider-like species from subterranean provinces, often adorned with jewels.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Undercommon'],
        traitNames: ['Spider Climb', 'Webbing', 'Bejeweled Carapace', 'Darkvision'],
        proficiencies: [],
        climbSpeed: 30,
    },
    // ===== STONEBORN =====
    {
        id: 'stoneborn',
        name: 'Stoneborn',
        description: 'Gargoyle-like species carved from stone, vigilant and durable.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Terran'],
        traitNames: ['Natural Armor', 'Silver Bulwark', 'Watchful Senses', 'Argent Gleam'],
        proficiencies: [],
    },
    // ===== THREADBORN =====
    {
        id: 'threadborn',
        name: 'Threadborn',
        description: 'Doll-like species stitched together with magic and innocence.',
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Ball-jointed', 'Innocent Mind', 'Sewn Nature', 'You\'ve Got a Friend'],
        proficiencies: [],
        isSpellcaster: true,
    },
    // ===== WECHSELKIND =====
    {
        id: 'wechselkind',
        name: 'Wechselkind',
        description: 'Constructs made of wood, clay, and ceramic, crafted to look like human children and swapped with them by fey.',
        size: 'Small',
        speed: 25,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Artificial Form', 'Faerie Glamour', 'Childish Agility', 'Creature Cover'],
        proficiencies: [
            { type: 'skill', mode: 'fixed', options: ['Acrobatics', 'Sleight of Hand'] },
        ],
        isSpellcaster: true,
    },
    // ===== WULVEN =====
    {
        id: 'wulven',
        name: 'Wulven',
        description: 'Humanoids cursed with a wolf-like form, channeling bestial instincts.',
        size: 'Medium',
        speed: 30,
        languages: ['Common', 'Sylvan'],
        traitNames: ['Hunter\'s Instinct', 'Natural Attack (Claws)', 'Pack Hunter', 'Burst of Speed'],
        proficiencies: [
            { type: 'skill', mode: 'choice', count: 1, options: ['Survival', 'Perception'] },
        ],
    },
];

async function migrateRaces() {
    console.log('🧝 Migrating Unofficial Races to Sanity...\n');

    // First, get all existing traits for linking
    const allTraits = await client.fetch(`*[_type == "trait"]{_id, name}`);
    const traitMap = new Map(allTraits.map((t: { _id: string; name: string }) => [t.name.toLowerCase(), t._id]));
    console.log(`Found ${allTraits.length} existing traits for linking\n`);

    const transaction = client.transaction();

    for (const race of UNOFFICIAL_RACES) {
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

        const doc = {
            _id: `race-${toSanityId(race.id)}`,
            _type: 'race',
            name: race.name,
            slug: { _type: 'slug', current: race.id },
            description: race.description,
            source: 'Unofficial',
            edition: '2024',
            version: 1,
            abilityScoreIncrease: {},
            flexibleAbilityScores: true,
            size: race.size,
            speed: race.speed,
            languages: race.languages,
            traits: traitRefs,
            proficiencies: proficiencyRules.length > 0 ? proficiencyRules : undefined,
            isSpellcaster: race.isSpellcaster || false,
        };

        transaction.createOrReplace(doc as Parameters<typeof transaction.createOrReplace>[0]);
        console.log(`  ✓ ${race.name}: ${traitRefs.length} traits, ${proficiencyRules.length} proficiencies`);
    }

    console.log('\nCommitting to Sanity...');
    await transaction.commit();
    console.log(`\n✅ Successfully migrated ${UNOFFICIAL_RACES.length} races!`);
}

async function run() {
    console.log('🚀 Unofficial Race Migration (2024 Edition)');
    console.log('='.repeat(50) + '\n');

    try {
        await migrateRaces();
        console.log('\n' + '='.repeat(50));
        console.log('🎉 Migration complete!');
        console.log('\nNote: Make sure you ran add-unofficial-race-traits.ts first to create trait documents.');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

run();
