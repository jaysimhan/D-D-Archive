import { Race, Subrace } from "../types/dnd-types";

// Comprehensive race database with SRD and common races
export const expandedRaces: Race[] = [
  {
    id: "human",
    name: "Human",
    description:
      "Humans are the most adaptable and ambitious people among the common races. They have widely varying tastes, morals, and customs in the many different lands where they have settled.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Extra Language", description: "You speak, read, and write one extra language of your choice." },
      { name: "Versatile", description: "Humans are adaptable and have different customs." }
    ],
    languages: ["Common", "One additional language of your choice"],
  },
  {
    id: "elf",
    name: "Elf",
    description:
      "Elves are a magical people of otherworldly grace, living in the world but not entirely part of it. They live in places of ethereal beauty, in the midst of ancient forests or in silvery spires glittering with faerie light.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 2 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Keen Senses", description: "Proficiency in Perception" },
      { name: "Fey Ancestry", description: "Advantage against being charmed, magic can't put you to sleep" },
      { name: "Trance", description: "4 hours instead of 8 for long rest" },
    ],
    languages: ["Common", "Elvish"],
    subraces: ["high-elf", "wood-elf", "drow"],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    description:
      "Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal. Though they stand well under 5 feet tall, dwarves are so broad and compact that they can weigh as much as a human.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 2 },
    size: "Medium",
    speed: 25,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Dwarven Resilience", description: "Advantage on saving throws against poison" },
      { name: "Dwarven Combat Training", description: "Proficiency with battleaxe, handaxe, light hammer, warhammer" },
      { name: "Tool Proficiency", description: "One artisan's tool of your choice" },
      { name: "Stonecunning", description: "Add double proficiency to History checks related to stone" },
    ],
    languages: ["Common", "Dwarvish"],
    subraces: ["hill-dwarf", "mountain-dwarf", "duergar"],
  },
  {
    id: "halfling",
    name: "Halfling",
    description:
      "The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense. They are inclined to be affable and get along well with others.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 2 },
    size: "Small",
    speed: 25,
    traits: [
      { name: "Lucky", description: "Reroll 1s on d20 rolls" },
      { name: "Brave", description: "Advantage on saving throws against being frightened" },
      { name: "Halfling Nimbleness", description: "Move through space of larger creatures" },
    ],
    languages: ["Common", "Halfling"],
    subraces: ["lightfoot-halfling", "stout-halfling"],
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    description:
      "Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension. Shaped by draconic gods or the dragons themselves, dragonborn originally hatched from dragon eggs as a unique race.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Draconic Ancestry", description: "Choose a dragon type" },
      { name: "Breath Weapon", description: "Exhale destructive energy" },
      { name: "Damage Resistance", description: "Resistance to your draconic ancestry damage type" },
    ],
    languages: ["Common", "Draconic"],
  },
  {
    id: "gnome",
    name: "Gnome",
    description:
      "A gnome's energy and enthusiasm for living shines through every inch of his or her tiny body. Gnomes average slightly over 3 feet tall and weigh 40 to 45 pounds. Their tan or brown faces are usually adorned with broad smiles.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 2 },
    size: "Small",
    speed: 25,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Gnome Cunning", description: "Advantage on INT, WIS, CHA saves against magic" },
    ],
    languages: ["Common", "Gnomish"],
    subraces: ["forest-gnome", "rock-gnome"],
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    description:
      "Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of their elf and human parents: human curiosity, inventiveness, and ambition tempered by the refined senses, love of nature, and artistic tastes of the elves.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Fey Ancestry", description: "Advantage on saving throws against being charmed, and magic can't put you to sleep." },
      { name: "Skill Versatility", description: "Proficiency in two skills of your choice" },
      { name: "Ability Score Increase", description: "Two different ability scores increase by 1" },
    ],
    languages: ["Common", "Elvish", "One additional language"],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    description:
      "Whether united under the leadership of a mighty warlock or having fought to a standstill after years of conflict, orc and human tribes sometimes form alliances, joining forces into a larger horde to the terror of civilized lands nearby.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2, CON: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Menacing", description: "Proficiency in Intimidation" },
      { name: "Relentless Endurance", description: "Drop to 1 HP instead of 0, once per long rest" },
      { name: "Savage Attacks", description: "Extra damage die on critical hits" },
    ],
    languages: ["Common", "Orc"],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    description:
      "To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling. Tieflings are derived from human bloodlines, and in the broadest possible sense, they still look human.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2, INT: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Hellish Resistance", description: "Resistance to fire damage" },
      { name: "Infernal Legacy", description: "Know thaumaturgy cantrip, cast hellish rebuke and darkness" },
    ],
    languages: ["Common", "Infernal"],
  },
  {
    id: "goliath",
    name: "Goliath",
    description:
      "At the highest mountain peaks dwell the reclusive goliaths, wandering a bleak realm of rock, wind, and cold. Their bodies look as if they are carved from mountain stone and give them great physical power.",
    source: "Official",
    edition: "2024",
    version: 1,
    abilityScoreIncrease: { STR: 2, CON: 1 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Natural Athlete", description: "Proficiency in Athletics" },
      { name: "Stone's Endurance", description: "Reduce damage taken once per short rest" },
      { name: "Powerful Build", description: "Count as one size larger for carry capacity" },
      { name: "Mountain Born", description: "Acclimated to high altitude and cold climate" },
    ],
    languages: ["Common", "Giant"],
  },
  {
    id: "aasimar",
    name: "Aasimar",
    description:
      "Aasimar bear within their souls the light of the heavens. They are descended from humans with a touch of the power of Mount Celestia, the divine realm of many lawful good deities.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2 },
    size: "Medium",
    speed: 30,
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Celestial Resistance", description: "Resistance to necrotic and radiant damage" },
      { name: "Healing Hands", description: "Heal HP equal to your level" },
      { name: "Light Bearer", description: "Know the light cantrip" },
    ],
    languages: ["Common", "Celestial"],
    subraces: ["protector-aasimar", "scourge-aasimar", "fallen-aasimar"],
  },
  {
    id: "genasi",
    name: "Genasi",
    description:
      "Those who think of other planes at all consider them remote, distant realms, but planar influence can be felt throughout the world. Genasi are one example of such influence, mortals who are infused with elemental power.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 2 },
    size: "Medium",
    speed: 30,
    traits: [{ name: "Elemental Heritage", description: "You are descended from creatures of the elemental planes." }],
    languages: ["Common", "Primordial"],
    subraces: ["air-genasi", "earth-genasi", "fire-genasi", "water-genasi"],
  },
];

export const expandedSubraces: Subrace[] = [
  // Elf Subraces
  {
    id: "high-elf",
    parentRaceId: "elf",
    name: "High Elf",
    description:
      "As a high elf, you have a keen mind and a mastery of at least the basics of magic. In many fantasy gaming worlds, there are two kinds of high elves.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1 },
    traits: [
      { name: "Elf Weapon Training", description: "Proficiency with longsword, shortsword, shortbow, longbow" },
      { name: "Cantrip", description: "One wizard cantrip of your choice" },
      { name: "Extra Language", description: "One additional language" },
    ],
  },
  {
    id: "wood-elf",
    parentRaceId: "elf",
    name: "Wood Elf",
    description:
      "As a wood elf, you have keen senses and intuition, and your fleet feet carry you quickly and stealthily through your native forests.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: [
      { name: "Elf Weapon Training", description: "Proficiency with longsword, shortsword, shortbow, longbow" },
      { name: "Fleet of Foot", description: "Base speed 35 ft." },
      { name: "Mask of the Wild", description: "Hide in light natural phenomena" },
    ],
  },
  {
    id: "drow",
    parentRaceId: "elf",
    name: "Drow (Dark Elf)",
    description:
      "Descended from an earlier subrace of dark-skinned elves, the drow were banished from the surface world for following the goddess Lolth down the path to evil and corruption.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 1 },
    traits: [
      { name: "Superior Darkvision", description: "120 ft." },
      { name: "Sunlight Sensitivity", description: "Disadvantage in bright light" },
      { name: "Drow Magic", description: "Dancing lights cantrip, faerie fire, darkness" },
      { name: "Drow Weapon Training", description: "Proficiency with rapiers, shortswords, and hand crossbows" },
    ],
    racialKnownSpells: [
      { level: 0, spellId: "dancing-lights", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "faerie-fire", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "darkness", abilityScore: "CHA", type: "1/day" }
    ],
  },

  // Dwarf Subraces
  {
    id: "hill-dwarf",
    parentRaceId: "dwarf",
    name: "Hill Dwarf",
    description:
      "As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: [{ name: "Dwarven Toughness", description: "+1 HP per level" }],
  },
  {
    id: "mountain-dwarf",
    parentRaceId: "dwarf",
    name: "Mountain Dwarf",
    description:
      "As a mountain dwarf, you're strong and hardy, accustomed to a difficult life in rugged terrain.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2 },
    traits: [{ name: "Dwarven Armor Training", description: "Proficiency with light and medium armor" }],
  },
  {
    id: "duergar",
    parentRaceId: "dwarf",
    name: "Duergar (Gray Dwarf)",
    description: "As a duergar, you are a master of sneaking and ambushing, with magic to aid you.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2 },
    traits: [
      { name: "Superior Darkvision", description: "120 ft." },
      { name: "Duergar Resilience", description: "Advantage on saves vs illusion, charm, paralysis" },
      { name: "Duergar Magic", description: "Invisibility and Enlarge/Reduce" },
      { name: "Sunlight Sensitivity", description: "Disadvantage in direct sunlight" }
    ],
    racialKnownSpells: [
      { level: 3, spellId: "enlarge-reduce", abilityScore: "INT", type: "1/day" },
      { level: 5, spellId: "invisibility", abilityScore: "INT", type: "1/day" }
    ]
  },

  // Tiefling Subraces
  {
    id: "tiefling-asmodeus",
    parentRaceId: "tiefling",
    name: "Bloodline of Asmodeus",
    description: "The most common lineage, linked to the ruler of the Nine Hells.",
    source: "PHB",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1, CHA: 2 },
    traits: [
      { name: "Infernal Legacy", description: "Thaumaturgy, Hellish Rebuke, Darkness" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "thaumaturgy", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "hellish-rebuke", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "darkness", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-baalzebul",
    parentRaceId: "tiefling",
    name: "Bloodline of Baalzebul",
    description: "Linked to the Lord of Flies, imparting a talent for corruption.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Maladomini", description: "Thaumaturgy, Ray of Sickness, Crown of Madness" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "thaumaturgy", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "ray-of-sickness", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "crown-of-madness", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-dispater",
    parentRaceId: "tiefling",
    name: "Bloodline of Dispater",
    description: "Linked to the Iron City, granting stealth and deception.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Dis", description: "Thaumaturgy, Disguise Self, Detect Thoughts" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "thaumaturgy", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "disguise-self", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "detect-thoughts", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-fierna",
    parentRaceId: "tiefling",
    name: "Bloodline of Fierna",
    description: "Linked to Phlegethos, granting mastery over emotion.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Phlegethos", description: "Friends, Charm Person, Suggestion" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "friends", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "charm-person", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "suggestion", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-glasya",
    parentRaceId: "tiefling",
    name: "Bloodline of Glasya",
    description: "Linked to Malbolge, granting criminal magic.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Malbolge", description: "Minor Illusion, Disguise Self, Invisibility" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "minor-illusion", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "disguise-self", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "invisibility", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-levistus",
    parentRaceId: "tiefling",
    name: "Bloodline of Levistus",
    description: "Linked to Stygia, granting ice magic.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Stygia", description: "Ray of Frost, Armor of Agathys, Darkness" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "ray-of-frost", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "armor-of-agathys", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "darkness", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-mammon",
    parentRaceId: "tiefling",
    name: "Bloodline of Mammon",
    description: "Linked to Minauros, granting utility magic.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Minauros", description: "Mage Hand, Tenser's Floating Disk, Arcane Lock" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "mage-hand", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "tensers-floating-disk", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "arcane-lock", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-mephistopheles",
    parentRaceId: "tiefling",
    name: "Bloodline of Mephistopheles",
    description: "Linked to Cania, granting hellfire magic.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Cania", description: "Mage Hand, Burning Hands, Flame Blade" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "mage-hand", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "burning-hands", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "flame-blade", abilityScore: "CHA", type: "1/day" }
    ]
  },
  {
    id: "tiefling-zariel",
    parentRaceId: "tiefling",
    name: "Bloodline of Zariel",
    description: "Linked to Avernus, granting martial magic.",
    source: "MToF",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1, CHA: 2 },
    traits: [
      { name: "Legacy of Avernus", description: "Thaumaturgy, Searing Smite, Branding Smite" }
    ],
    racialKnownSpells: [
      { level: 0, spellId: "thaumaturgy", abilityScore: "CHA", type: "at-will" },
      { level: 3, spellId: "searing-smite", abilityScore: "CHA", type: "1/day" },
      { level: 5, spellId: "branding-smite", abilityScore: "CHA", type: "1/day" }
    ]
  },

  // Halfling Subraces
  {
    id: "lightfoot-halfling",
    parentRaceId: "halfling",
    name: "Lightfoot Halfling",
    description:
      "As a lightfoot halfling, you can easily hide from notice, even using other people as cover.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 1 },
    traits: [{ name: "Naturally Stealthy", description: "Hide behind creatures one size larger" }],
  },
  {
    id: "stout-halfling",
    parentRaceId: "halfling",
    name: "Stout Halfling",
    description:
      "As a stout halfling, you're hardier than average and have some resistance to poison.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 1 },
    traits: [{ name: "Stout Resilience", description: "Advantage on saves against poison, resistance to poison damage" }],
  },

  // Gnome Subraces
  {
    id: "forest-gnome",
    parentRaceId: "gnome",
    name: "Forest Gnome",
    description:
      "As a forest gnome, you have a natural knack for illusion and inherent quickness and stealth.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 1 },
    traits: [
      { name: "Natural Illusionist", description: "Minor illusion cantrip" },
      { name: "Speak with Small Beasts", description: "Communicate simple ideas with small animals" },
    ],
  },
  {
    id: "rock-gnome",
    parentRaceId: "gnome",
    name: "Rock Gnome",
    description:
      "As a rock gnome, you have a natural inventiveness and hardiness beyond that of other gnomes.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 1 },
    traits: [
      { name: "Artificer's Lore", description: "Add double proficiency to History checks related to magic items, alchemical objects, or tech devices" },
      { name: "Tinker", description: "Create tiny clockwork devices" },
    ],
  },

  // Genasi Subraces
  {
    id: "air-genasi",
    parentRaceId: "genasi",
    name: "Air Genasi",
    description:
      "As an air genasi, you are descended from the djinn. As changeable as the weather, your moods shift from calm to wild and violent with little warning.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 1 },
    traits: [
      { name: "Unending Breath", description: "Can hold breath indefinitely" },
      { name: "Mingle with the Wind", description: "Cast levitate once per long rest" },
    ],
  },
  {
    id: "earth-genasi",
    parentRaceId: "genasi",
    name: "Earth Genasi",
    description:
      "As an earth genasi, you are descended from the cruel and greedy dao. You possess the power of stone.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1 },
    traits: [
      { name: "Earth Walk", description: "Move across difficult terrain made of earth or stone without extra movement" },
      { name: "Merge with Stone", description: "Cast pass without trace once per long rest" },
    ],
  },
  {
    id: "fire-genasi",
    parentRaceId: "genasi",
    name: "Fire Genasi",
    description:
      "As a fire genasi, you have inherited the volatile mood and keen mind of the efreet.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1 },
    traits: [
      { name: "Darkvision", description: "60 ft." },
      { name: "Fire Resistance", description: "Resistance to fire damage" },
      { name: "Reach to the Blaze", description: "Produce flame cantrip, burning hands once per long rest" },
    ],
  },
  {
    id: "water-genasi",
    parentRaceId: "genasi",
    name: "Water Genasi",
    description:
      "The lapping of waves, the spray of sea foam on the wind, the ocean depths—all of these things call to your heart.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: [
      { name: "Acid Resistance", description: "Resistance to acid damage" },
      { name: "Amphibious", description: "Breathe air and water" },
      { name: "Swim", description: "30 ft. swim speed" },
      { name: "Call to the Wave", description: "Shape water cantrip, create or destroy water once per long rest" },
    ],
  },

  // Aasimar Subraces
  {
    id: "protector-aasimar",
    parentRaceId: "aasimar",
    name: "Protector Aasimar",
    description:
      "Protector aasimar are charged by the powers of good to guard the weak, to strike at evil wherever it arises, and to stand vigilant against the darkness.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { WIS: 1 },
    traits: [
      { name: "Radiant Soul", description: "Once per long rest, sprout wings and fly 30 ft., deal extra radiant damage" },
    ],
  },
  {
    id: "scourge-aasimar",
    parentRaceId: "aasimar",
    name: "Scourge Aasimar",
    description:
      "Scourge aasimar are imbued with a divine energy that blazes intensely within them. It feeds a powerful desire to destroy evil.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 1 },
    traits: [
      { name: "Radiant Consumption", description: "Once per long rest, emit radiant light dealing damage to nearby creatures and yourself" },
    ],
  },
  {
    id: "fallen-aasimar",
    parentRaceId: "aasimar",
    name: "Fallen Aasimar",
    description:
      "An aasimar who was touched by dark powers as a youth or who turns to evil in early adulthood can become one of the fallen.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1 },
    traits: [
      { name: "Necrotic Shroud", description: "Once per long rest, frighten nearby creatures and deal extra necrotic damage" },
    ],
  },
];
