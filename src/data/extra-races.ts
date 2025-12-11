import { Race } from "../types/dnd-types";

export const extraRaces: Race[] = [
    // ===== OFFICIAL EXPANSION RACES =====
    {
        id: "warforged",
        name: "Warforged",
        description: "Created as soldiers for the Last War, warforged are artificial lifeforms built from wood and metal. Though they are constructs, they have much in common with living creatures, including emotions and social bonds.",
        source: "Eberron: Rising from the Last War",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CON: 2 }, // +1 Free choice handled during creation or noted
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Flexible Ability Score", description: "Increase one other ability score by 1." },
            { name: "Constructed Resilience", description: "Advantage on saves vs poison; resistance to poison; don't need to eat, drink, or breathe; immune to disease; don't sleep." },
            { name: "Sentry's Rest", description: "You enter a motionless, conscious state for 6 hours instead of sleeping." },
            { name: "Integrated Protection", description: "+1 to Armor Class; armor must be incorporated into your body." },
            { name: "Specialized Design", description: "One skill proficiency and one tool proficiency of your choice." }
        ],
        languages: ["Common"]
    },
    {
        id: "leonin",
        name: "Leonin",
        description: "Nomadic lion-folk of Theros, leonin are typically proud and self-reliant, living in the Oreskos plains.",
        source: "Mythic Odysseys of Theros",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CON: 2, STR: 1 },
        size: "Medium",
        speed: 35,
        traits: [
            { name: "Claws", description: "1d4 + Str slashing unarmed strike." },
            { name: "Hunter's Instincts", description: "Proficiency in Athletics, Intimidation, Perception, or Survival." },
            { name: "Daunting Roar", description: "Bonus action fear effect (Con save) 10ft radius." },
            { name: "Darkvision", description: "60 ft." }
        ],
        languages: ["Common", "Leonin"]
    },
    {
        id: "satyr",
        name: "Satyr",
        description: "Satyrs are fey creatures known for their raucous revelry and love of music. They resemble humans with the legs and horns of goats.",
        source: "Mythic Odysseys of Theros",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CHA: 2, DEX: 1 },
        size: "Medium",
        speed: 35,
        traits: [
            { name: "Ram", description: "1d4 + Str bludgeoning unarmed strike." },
            { name: "Magic Resistance", description: "Advantage on saves against spells and other magical effects." },
            { name: "Mirthful Leaps", description: "add d8 to jump distance." },
            { name: "Reveler", description: "Proficiency in Performance and Persuasion, and one instrument." }
        ],
        languages: ["Common", "Sylvan"]
    },
    {
        id: "loxodon",
        name: "Loxodon",
        description: "Loxodons are humanoids with the heads of elephants. They are known for their wisdom, patience, and loyalty.",
        source: "Guildmasters' Guide to Ravnica",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CON: 2, WIS: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Powerful Build", description: "Count as one size larger for carry/lift." },
            { name: "Loxodon Serenity", description: "Advantage on saves vs charmed/frightened." },
            { name: "Natural Armor", description: "AC = 12 + Con modifier." },
            { name: "Trunk", description: "Can grapple, lift, use objects with trunk (reach 5ft)." },
            { name: "Keen Smell", description: "Advantage on Perception/Survival/Investigation checks involving smell." }
        ],
        languages: ["Common", "Loxodon"]
    },
    {
        id: "feral-tiefling",
        name: "Feral Tiefling",
        description: "A variant of tieflings with a more bestial nature, prioritizing agility over charisma.",
        source: "Sword Coast Adventurer's Guide",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { DEX: 2, INT: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Darkvision", description: "60 ft." },
            { name: "Hellish Resistance", description: "Resistance to fire damage." },
            { name: "Infernal Legacy", description: "Thaumaturgy cantrip; Hellish Rebuke at 3rd; Darkness at 5th." }
        ],
        languages: ["Common", "Infernal"]
    },
    {
        id: "tortle",
        name: "Tortle",
        description: "Tortles are turtle-like humanoids with massive shells. They live simple, adventurous lives.",
        source: "The Tortle Package",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { STR: 2, WIS: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Claws", description: "1d4 + Str slashing unarmed strike." },
            { name: "Hold Breath", description: "Hold breath for 1 hour." },
            { name: "Natural Armor", description: "Base AC 17 (Dex doesn't affect). Cannot wear armor." },
            { name: "Shell Defense", description: "Action to withdraw into shell (+4 AC, prone, restrained)." },
            { name: "Survival Instinct", description: "Proficiency in Survival." }
        ],
        languages: ["Common", "Aquan"]
    },

    // ===== ONE-SHOT WONDERS RACES =====
    {
        id: "tarandus",
        name: "Tarandus",
        description: "Scholarly reindeer humanoids with a knack for history and navigation.",
        source: "One-Shot Wonders",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { INT: 2, STR: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Guiding Light", description: "Cast Light cantrip (nose source)." },
            { name: "Antler Defense", description: "+1 to AC when not using shield." },
            { name: "Hooves", description: "1d4 + Str bludgeoning unarmed strike." },
            { name: "Student of History", description: "Proficiency in History." },
            { name: "Born to Navigate", description: "Proficiency in Navigator's tools; always know north." }
        ],
        languages: ["Common", "Elvish"]
    },
    {
        id: "canisar",
        name: "Canisar",
        description: "Playful and agile snow fox humanoids adapted to cold climates.",
        source: "One-Shot Wonders",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { DEX: 2, CHA: 1 },
        size: "Medium", // Can opt to be Small
        speed: 35,
        traits: [
            { name: "Size Choice", description: "You are Small or Medium (your choice)." },
            { name: "Darkvision", description: "60 ft." },
            { name: "Keen Senses", description: "Proficiency in Perception." },
            { name: "Cold Adaptation", description: "Resistance to Cold damage." },
            { name: "Pounce", description: "If you move 20ft straight and hit, target must succeed Str save or prone." }
        ],
        languages: ["Common", "Sylvan"]
    },
    {
        id: "hederan",
        name: "Hederan",
        description: "Solitary plant-like humanoids who protect the natural world.",
        source: "One-Shot Wonders",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { WIS: 2, CON: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Photosynthesis", description: "Don't need to eat if you spend 4 hours in sunlight." },
            { name: "Life in the Outdoors", description: "Proficiency in Survival and Nature." },
            { name: "Natural Armor", description: "AC 13 + Dex (max 2)." },
            { name: "Plant Speak", description: "Can cast Speak with Plants once per long rest." }
        ],
        languages: ["Common", "Sylvan"]
    },
    {
        id: "snowborn",
        name: "Snowborn",
        description: "Enchanted constructs made of living snow, curious and resilient.",
        source: "One-Shot Wonders",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CHA: 2, CON: 1 },
        size: "Small", // Typically small for snowborn constructs in this lore
        speed: 30,
        traits: [
            { name: "Chilled Anatomy", description: "Immunity to Cold damage; Vulnerability to Fire." },
            { name: "Amorphous Snow", description: "Squeeze through 1 inch gaps." },
            { name: "Construct Nature", description: "Don't eat, drink, breathe, sleep." },
            { name: "Flash of Frost", description: "Reaction to deal 1d6 cold to attacker within 5ft." }
        ],
        languages: ["Common", "Primordial"]
    },

    // ===== LORWYN RACES =====
    {
        id: "boggart",
        name: "Boggart",
        description: "Lorwyn's goblins; mischievous, prone to chaotic pranks, and communally focused.",
        source: "Lorwyn (Homebrew)",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { DEX: 2, CON: 1 },
        size: "Small",
        speed: 30,
        traits: [
            { name: "Darkvision", description: "60 ft." },
            { name: "Nimble Escape", description: "Disengage or Hide as bonus action." },
            { name: "Auntie's Favor", description: "Proficiency in one skill: Sleight of Hand, Stealth, or Survival." }
        ],
        languages: ["Common", "Goblin"]
    },
    {
        id: "lorwyn-faerie",
        name: "Faerie (Lorwyn)",
        description: "Tiny, insect-winged pranksters who live briefly and vibrantly.",
        source: "Lorwyn (Homebrew)",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { DEX: 2, CHA: 1 },
        size: "Tiny",
        speed: 10,
        traits: [
            { name: "Flight", description: "Fly speed 30 ft." },
            { name: "Fey Ancestry", description: "Adv vs charm, no sleep magic." },
            { name: "Pester", description: "Can cast Faerie Fire once per long rest." }
        ],
        languages: ["Common", "Sylvan"]
    },
    {
        id: "flamekin",
        name: "Flamekin",
        description: "Beings of living rock and fire, passionate and volatile.",
        source: "Lorwyn (Homebrew)",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CHA: 2, DEX: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Inner Flame", description: "Produce Flame cantrip. Cha is spellcasting ability." },
            { name: "Living Fire", description: "Resistance to Fire damage." },
            { name: "Darkvision", description: "60 ft." }
        ],
        languages: ["Common", "Ignan"]
    },
    {
        id: "kithkin",
        name: "Kithkin",
        description: "Highly communal halfling-like folk bound by the Thoughtweft.",
        source: "Lorwyn (Homebrew)",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { WIS: 2, DEX: 1 },
        size: "Small",
        speed: 25,
        traits: [
            { name: "Thoughtweft", description: "Advantage on attacks if an ally is within 5ft." },
            { name: "Halfling Luck", description: "Reroll 1s on d20." },
            { name: "Brave", description: "Advantage vs Frightened." }
        ],
        languages: ["Common", "Kithkin"]
    },
    {
        id: "lorwyn-changeling",
        name: "Changeling (Lorwyn)",
        description: "Shapeshifters who wear many masks but keep their blue-tinged skin in true form.",
        source: "Lorwyn (Homebrew)",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CHA: 2, INT: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Shapechanger", description: "Change appearance as an action." },
            { name: "Instinctive Adaptation", description: "Proficiency in Deception and Insight." }
        ],
        languages: ["Common"]
    },
    {
        id: "rimekin",
        name: "Rimekin",
        description: "Frost-touched variants of the Flamekin, reserved and enduring.",
        source: "Lorwyn (Homebrew)",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { CON: 2, WIS: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Frost Aura", description: "Resistance to Cold damage." },
            { name: "Chill Touch", description: "Know the Chill Touch cantrip." },
            { name: "Ice Walk", description: "Ignore difficult terrain composed of ice or snow." }
        ],
        languages: ["Common", "Aquan"]
    },
    {
        id: "merrow-lorwyn",
        name: "Merrow (Lorwyn)",
        description: "Aquatic merchants and guides of the Lorwyn waterways.",
        source: "Lorwyn (Homebrew)",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { INT: 2, DEX: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Amphibious", description: "Breathe air and water." },
            { name: "Swim Speed", description: "40 ft." },
            { name: "Mercantile Lore", description: "Proficiency in Persuasion and Navigator's Tools." }
        ],
        languages: ["Common", "Merfolk"]
    },
    {
        id: "bearfolk",
        name: "Bearfolk",
        description: "Hulking, bear-like humanoids who guard the deep forests.",
        source: "Homebrew",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { STR: 2, CON: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Powerful Build", description: "Count as one size larger for carry/lift." },
            { name: "Bite", description: "1d6 + Str piercing damage unarmed strike." },
            { name: "Thick Fur", description: "Natural Armor: AC = 12 + Con modifier." },
            { name: "Keen Smell", description: "Advantage on Perception checks involving smell." }
        ],
        languages: ["Common", "Sylvan"]
    },
    {
        id: "plasmoid",
        name: "Plasmoid",
        description: "Plasmoids are amorphous beings with no typical shape. In the presence of other folk, they often adopt a humanoid shape, but their true form is an amorphous blob.",
        source: "Spelljammer: Adventures in Space",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { STR: 2, CON: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Amorphous", description: "You can squeeze through a space as narrow as 1 inch wide, provided you are wearing and carrying nothing. Advantage on grapple escape." },
            { name: "Darkvision", description: "60 ft." },
            { name: "Hold Breath", description: "1 hour." },
            { name: "Natural Resilience", description: "Resistance to acid and poison damage; advantage on saves vs poison." },
            { name: "Shape Self", description: "Reshape body, extrude pseudopod (10ft reach for manipulation)." }
        ],
        languages: ["Common"]
    },
    {
        id: "astral-elf",
        name: "Astral Elf",
        description: "An elf who has journeyed to the Astral Plane, often dwelling there for eons. They have a connection to the gods of the multiverse.",
        source: "Spelljammer: Adventures in Space",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { DEX: 1, CHA: 1, INT: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Astral Fire", description: "You know one of the following cantrips: dancing lights, light, or sacred flame. You can change it when you finish a long rest. Intelligence, Wisdom, or Charisma is your spellcasting ability for it (choose when you select this race)." },
            { name: "Darkvision", description: "60 ft." },
            { name: "Fey Ancestry", description: "Advantage on saves vs charm, magic can't put you to sleep." },
            { name: "Keen Senses", description: "Proficiency in Perception." },
            { name: "Starlight Step", description: "Bonus action teleport 30 ft. PB/long rest." },
            { name: "Astral Trance", description: "Finish long rest in 4 hours." }
        ],
        racialSpellChoices: [
            {
                choose: 1,
                list: ["dancing-lights", "light", "sacred-flame"],
                name: "Astral Fire Cantrip",
                school: "Evocation"
            }
        ],
        languages: ["Common", "Elvish"]
    },
    {
        id: "kobold",
        name: "Kobold",
        description: "Small reptilian humanoids with a knack for traps and specialized skills.",
        source: "Mordenkainen Presents: Monsters of the Multiverse",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { DEX: 2, STR: 2 },
        size: "Small",
        speed: 30,
        traits: [
            { name: "Draconic Cry", description: "Bonus action to give advantage on attacks against enemies within 10 ft of you. PB/long rest." },
            { name: "Kobold Legacy (Draconic Sorcery)", description: "You know one cantrip from the sorcerer spell list. INT, WIS, or CHA is your spellcasting ability." },
            { name: "Darkvision", description: "60 ft." }
        ],
        racialSpellChoices: [
            {
                choose: 1,
                list: ["cantrip:sorcerer"],
                name: "Kobold Draconic Sorcery"
            }
        ],
        languages: ["Common", "Draconic"]
    },
    {
        id: "githyanki",
        name: "Githyanki",
        description: "Astral warriors with a bond to red dragons.",
        source: "Mordenkainen Presents: Monsters of the Multiverse",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { STR: 2, INT: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Decadent Mastery", description: "You learn one language and one skill proficiency or tool proficiency." },
            { name: "Martial Prodigy", description: "Proficiency with light/medium armor, shortswords, longswords, greatswords." },
            { name: "Githyanki Psionics", description: "Mage Hand (invisible) at 1st, Jump at 3rd, Misty Step at 5th." }
        ],
        racialKnownSpells: [
            { level: 1, spellId: "mage-hand", abilityScore: "INT", type: "at-will", name: "Mage Hand (Invisible)" },
            { level: 3, spellId: "jump", abilityScore: "INT", type: "1/day" },
            { level: 5, spellId: "misty-step", abilityScore: "INT", type: "1/day" }
        ],
        languages: ["Common", "Gith"]
    },
    {
        id: "githzerai",
        name: "Githzerai",
        description: "Monastic ascetics from Limbo who hone their minds to a razor's edge.",
        source: "Mordenkainen Presents: Monsters of the Multiverse",
        edition: "5e",
        version: 1,
        abilityScoreIncrease: { WIS: 2, INT: 1 },
        size: "Medium",
        speed: 30,
        traits: [
            { name: "Mental Discipline", description: "Advantage on saves vs charm and fright." },
            { name: "Githzerai Psionics", description: "Mage Hand (invisible) at 1st, Shield at 3rd, Detect Thoughts at 5th." }
        ],
        racialKnownSpells: [
            { level: 1, spellId: "mage-hand", abilityScore: "WIS", type: "at-will", name: "Mage Hand (Invisible)" },
            { level: 3, spellId: "shield", abilityScore: "WIS", type: "1/day" },
            { level: 5, spellId: "detect-thoughts", abilityScore: "WIS", type: "1/day" }
        ],
        languages: ["Common", "Gith"]
    }
];
