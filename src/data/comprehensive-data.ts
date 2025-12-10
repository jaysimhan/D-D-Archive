import {
  Race,
  Subrace,
  Class,
  Subclass,
  Background,
  Spell,
  Feat,
  Item,
} from "../types/dnd-types";

// ========================================
// COMPREHENSIVE RACE DATABASE (SRD)
// ========================================

export const comprehensiveRaces: Race[] = [
  {
    id: "dwarf",
    name: "Dwarf",
    description:
      "Bold and hardy, dwarves are known as skilled warriors, miners, and workers of stone and metal.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CON: 2 },
    size: "Medium",
    speed: 25,
    traits: [
      "Darkvision",
      "Dwarven Resilience",
      "Dwarven Combat Training",
      "Stonecunning",
    ],
    languages: ["Common", "Dwarvish"],
    subraces: ["hill-dwarf", "mountain-dwarf"],
  },
  {
    id: "elf",
    name: "Elf",
    description:
      "Elves are a magical people of otherworldly grace, living in the world but not entirely part of it.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 2 },
    size: "Medium",
    speed: 30,
    traits: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance"],
    languages: ["Common", "Elvish"],
    subraces: ["high-elf", "wood-elf", "dark-elf"],
  },
  {
    id: "halfling",
    name: "Halfling",
    description:
      "The diminutive halflings survive in a world full of larger creatures by avoiding notice or, barring that, avoiding offense.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { DEX: 2 },
    size: "Small",
    speed: 25,
    traits: ["Lucky", "Brave", "Halfling Nimbleness"],
    languages: ["Common", "Halfling"],
    subraces: ["lightfoot-halfling", "stout-halfling"],
  },
  {
    id: "human",
    name: "Human",
    description:
      "Humans are the most adaptable and ambitious people among the common races. Whatever drives them, humans are the innovators, the achievers, and the pioneers of the worlds.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: ["Extra Language"],
    languages: ["Common"],
  },
  {
    id: "dragonborn",
    name: "Dragonborn",
    description:
      "Born of dragons, as their name proclaims, the dragonborn walk proudly through a world that greets them with fearful incomprehension.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2, CHA: 1 },
    size: "Medium",
    speed: 30,
    traits: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"],
    languages: ["Common", "Draconic"],
  },
  {
    id: "gnome",
    name: "Gnome",
    description:
      "A gnome's energy and enthusiasm for living shines through every inch of their tiny body.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 2 },
    size: "Small",
    speed: 25,
    traits: ["Darkvision", "Gnome Cunning"],
    languages: ["Common", "Gnomish"],
    subraces: ["forest-gnome", "rock-gnome"],
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    description:
      "Walking in two worlds but truly belonging to neither, half-elves combine what some say are the best qualities of both races.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2 },
    size: "Medium",
    speed: 30,
    traits: [
      "Darkvision",
      "Fey Ancestry",
      "Skill Versatility",
      "Ability Score Increase (Choose 2)",
    ],
    languages: ["Common", "Elvish"],
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    description:
      "Whether united under the leadership of a mighty warlock or having fought to a standstill after years of conflict, orc and human tribes sometimes form alliances.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { STR: 2, CON: 1 },
    size: "Medium",
    speed: 30,
    traits: ["Darkvision", "Menacing", "Relentless Endurance", "Savage Attacks"],
    languages: ["Common", "Orc"],
  },
  {
    id: "tiefling",
    name: "Tiefling",
    description:
      "To be greeted with stares and whispers, to suffer violence and insult on the street, to see mistrust and fear in every eye: this is the lot of the tiefling.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 2, INT: 1 },
    size: "Medium",
    speed: 30,
    traits: ["Darkvision", "Hellish Resistance", "Infernal Legacy"],
    languages: ["Common", "Infernal"],
  },
];

export const comprehensiveSubraces: Subrace[] = [
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
    traits: ["Dwarven Toughness"],
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
    traits: ["Dwarven Armor Training"],
  },
  {
    id: "high-elf",
    parentRaceId: "elf",
    name: "High Elf",
    description:
      "As a high elf, you have a keen mind and a mastery of at least the basics of magic.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1 },
    traits: ["Elf Weapon Training", "Cantrip", "Extra Language"],
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
    traits: ["Elf Weapon Training", "Fleet of Foot", "Mask of the Wild"],
  },
  {
    id: "dark-elf",
    parentRaceId: "elf",
    name: "Dark Elf (Drow)",
    description:
      "Descended from an earlier subrace of dark-skinned elves, the drow were banished from the surface world for following the goddess Lolth down the path to evil and corruption.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { CHA: 1 },
    traits: [
      "Superior Darkvision",
      "Sunlight Sensitivity",
      "Drow Magic",
      "Drow Weapon Training",
    ],
  },
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
    traits: ["Naturally Stealthy"],
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
    traits: ["Stout Resilience"],
  },
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
    traits: ["Natural Illusionist", "Speak with Small Beasts"],
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
    traits: ["Artificer's Lore", "Tinker"],
  },
];

// ========================================
// COMPREHENSIVE CLASS DATABASE (SRD)
// ========================================

export const comprehensiveClasses: Class[] = [
  {
    id: "barbarian",
    name: "Barbarian",
    description:
      "A fierce warrior of primitive background who can enter a battle rage.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 12,
    primaryAbility: ["STR"],
    savingThrows: ["STR", "CON"],
    features: [
      { level: 1, name: "Rage", description: "Enter a battle rage." },
      {
        level: 1,
        name: "Unarmored Defense",
        description: "Add CON modifier to AC when not wearing armor.",
      },
      { level: 2, name: "Reckless Attack", description: "Attack with advantage." },
      { level: 2, name: "Danger Sense", description: "Advantage on DEX saves." },
      { level: 3, name: "Primal Path", description: "Choose your subclass." },
      { level: 5, name: "Extra Attack", description: "Attack twice per action." },
      { level: 5, name: "Fast Movement", description: "Speed increases by 10ft." },
      {
        level: 7,
        name: "Feral Instinct",
        description: "Advantage on initiative.",
      },
      {
        level: 9,
        name: "Brutal Critical",
        description: "Extra damage die on critical hit.",
      },
      {
        level: 11,
        name: "Relentless Rage",
        description: "Keep fighting at 0 HP during rage.",
      },
    ],
    subclasses: ["berserker", "totem-warrior"],
  },
  {
    id: "bard",
    name: "Bard",
    description:
      "An inspiring magician whose power echoes the music of creation.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 8,
    primaryAbility: ["CHA"],
    savingThrows: ["DEX", "CHA"],
    spellcaster: "full",
    spellcastingAbility: "CHA",
    features: [
      {
        level: 1,
        name: "Spellcasting",
        description: "Cast bard spells using Charisma.",
      },
      {
        level: 1,
        name: "Bardic Inspiration",
        description: "Inspire allies with a d6 bonus.",
      },
      {
        level: 2,
        name: "Jack of All Trades",
        description: "Add half proficiency to all ability checks.",
      },
      {
        level: 2,
        name: "Song of Rest",
        description: "Allies heal extra HP during short rest.",
      },
      { level: 3, name: "Bard College", description: "Choose your subclass." },
      { level: 3, name: "Expertise", description: "Double proficiency in 2 skills." },
      {
        level: 5,
        name: "Font of Inspiration",
        description: "Regain inspiration on short rest.",
      },
      {
        level: 6,
        name: "Countercharm",
        description: "Grant advantage against charm/fear.",
      },
      { level: 10, name: "Magical Secrets", description: "Learn spells from any class." },
    ],
    subclasses: ["college-of-lore", "college-of-valor"],
  },
  {
    id: "cleric",
    name: "Cleric",
    description:
      "A priestly champion who wields divine magic in service of a higher power.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 8,
    primaryAbility: ["WIS"],
    savingThrows: ["WIS", "CHA"],
    spellcaster: "full",
    spellcastingAbility: "WIS",
    features: [
      {
        level: 1,
        name: "Spellcasting",
        description: "Cast cleric spells using Wisdom.",
      },
      { level: 1, name: "Divine Domain", description: "Choose your subclass." },
      {
        level: 2,
        name: "Channel Divinity",
        description: "Channel divine energy for various effects.",
      },
      {
        level: 5,
        name: "Destroy Undead",
        description: "Turn Undead can destroy low CR undead.",
      },
      {
        level: 10,
        name: "Divine Intervention",
        description: "Ask your deity to intervene.",
      },
    ],
    subclasses: ["life-domain", "light-domain", "war-domain"],
  },
  {
    id: "druid",
    name: "Druid",
    description:
      "A priest of the Old Faith, wielding the powers of nature and adopting animal forms.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 8,
    primaryAbility: ["WIS"],
    savingThrows: ["INT", "WIS"],
    spellcaster: "full",
    spellcastingAbility: "WIS",
    features: [
      {
        level: 1,
        name: "Spellcasting",
        description: "Cast druid spells using Wisdom.",
      },
      { level: 1, name: "Druidic", description: "Know the Druidic language." },
      { level: 2, name: "Wild Shape", description: "Transform into beasts." },
      { level: 2, name: "Druid Circle", description: "Choose your subclass." },
      {
        level: 18,
        name: "Timeless Body",
        description: "Age 1 year per 10 years.",
      },
      { level: 18, name: "Beast Spells", description: "Cast spells in Wild Shape." },
    ],
    subclasses: ["circle-of-the-land", "circle-of-the-moon"],
  },
  {
    id: "fighter",
    name: "Fighter",
    description:
      "A master of martial combat, skilled with a variety of weapons and armor.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 10,
    primaryAbility: ["STR", "DEX"],
    savingThrows: ["STR", "CON"],
    features: [
      {
        level: 1,
        name: "Fighting Style",
        description: "Choose a combat specialization.",
      },
      {
        level: 1,
        name: "Second Wind",
        description: "Regain HP as a bonus action.",
      },
      { level: 2, name: "Action Surge", description: "Take an extra action." },
      {
        level: 3,
        name: "Martial Archetype",
        description: "Choose your subclass.",
      },
      { level: 5, name: "Extra Attack", description: "Attack twice per action." },
      {
        level: 9,
        name: "Indomitable",
        description: "Reroll a failed saving throw.",
      },
    ],
    subclasses: ["champion", "battle-master", "eldritch-knight"],
  },
  {
    id: "monk",
    name: "Monk",
    description:
      "A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 8,
    primaryAbility: ["DEX", "WIS"],
    savingThrows: ["STR", "DEX"],
    features: [
      {
        level: 1,
        name: "Unarmored Defense",
        description: "Add WIS modifier to AC when not wearing armor.",
      },
      {
        level: 1,
        name: "Martial Arts",
        description: "Use DEX for unarmed strikes and monk weapons.",
      },
      { level: 2, name: "Ki", description: "Spend Ki points for special abilities." },
      {
        level: 2,
        name: "Unarmored Movement",
        description: "Speed increases while unarmored.",
      },
      {
        level: 3,
        name: "Monastic Tradition",
        description: "Choose your subclass.",
      },
      {
        level: 3,
        name: "Deflect Missiles",
        description: "Reduce ranged damage and throw back.",
      },
      { level: 4, name: "Slow Fall", description: "Reduce falling damage." },
      { level: 5, name: "Extra Attack", description: "Attack twice per action." },
      {
        level: 5,
        name: "Stunning Strike",
        description: "Stun enemies with Ki-fueled strikes.",
      },
    ],
    subclasses: ["way-of-the-open-hand", "way-of-shadow"],
  },
  {
    id: "paladin",
    name: "Paladin",
    description:
      "A holy warrior bound to a sacred oath, wielding divine magic and martial prowess.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 10,
    primaryAbility: ["STR", "CHA"],
    savingThrows: ["WIS", "CHA"],
    spellcaster: "half",
    spellcastingAbility: "CHA",
    features: [
      { level: 1, name: "Divine Sense", description: "Detect celestials and fiends." },
      {
        level: 1,
        name: "Lay on Hands",
        description: "Heal with a pool of HP.",
      },
      {
        level: 2,
        name: "Fighting Style",
        description: "Choose a combat specialization.",
      },
      {
        level: 2,
        name: "Spellcasting",
        description: "Cast paladin spells using Charisma.",
      },
      {
        level: 2,
        name: "Divine Smite",
        description: "Expend spell slots for extra radiant damage.",
      },
      { level: 3, name: "Sacred Oath", description: "Choose your subclass." },
      {
        level: 3,
        name: "Divine Health",
        description: "Immune to disease.",
      },
      { level: 5, name: "Extra Attack", description: "Attack twice per action." },
      {
        level: 6,
        name: "Aura of Protection",
        description: "Add CHA to saving throws for nearby allies.",
      },
    ],
    subclasses: ["oath-of-devotion", "oath-of-the-ancients", "oath-of-vengeance"],
  },
  {
    id: "ranger",
    name: "Ranger",
    description:
      "A warrior who uses martial prowess and nature magic to combat threats on the edges of civilization.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 10,
    primaryAbility: ["DEX", "WIS"],
    savingThrows: ["STR", "DEX"],
    spellcaster: "half",
    spellcastingAbility: "WIS",
    features: [
      {
        level: 1,
        name: "Favored Enemy",
        description: "Advantage on tracking specific creature types.",
      },
      {
        level: 1,
        name: "Natural Explorer",
        description: "Expertise in specific terrain types.",
      },
      {
        level: 2,
        name: "Fighting Style",
        description: "Choose a combat specialization.",
      },
      {
        level: 2,
        name: "Spellcasting",
        description: "Cast ranger spells using Wisdom.",
      },
      {
        level: 3,
        name: "Ranger Archetype",
        description: "Choose your subclass.",
      },
      {
        level: 3,
        name: "Primeval Awareness",
        description: "Sense creature types nearby.",
      },
      { level: 5, name: "Extra Attack", description: "Attack twice per action." },
    ],
    subclasses: ["hunter", "beast-master"],
  },
  {
    id: "rogue",
    name: "Rogue",
    description:
      "A scoundrel who uses stealth and trickery to overcome obstacles and enemies.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 8,
    primaryAbility: ["DEX"],
    savingThrows: ["DEX", "INT"],
    features: [
      { level: 1, name: "Expertise", description: "Double proficiency in 2 skills." },
      {
        level: 1,
        name: "Sneak Attack",
        description: "Deal extra damage with advantage.",
      },
      {
        level: 1,
        name: "Thieves' Cant",
        description: "Secret language of thieves.",
      },
      {
        level: 2,
        name: "Cunning Action",
        description: "Dash, Disengage, or Hide as bonus action.",
      },
      { level: 3, name: "Roguish Archetype", description: "Choose your subclass." },
      {
        level: 5,
        name: "Uncanny Dodge",
        description: "Halve damage from one attack.",
      },
      { level: 7, name: "Evasion", description: "Take no damage on successful DEX saves." },
    ],
    subclasses: ["thief", "assassin", "arcane-trickster"],
  },
  {
    id: "sorcerer",
    name: "Sorcerer",
    description:
      "A spellcaster who draws on inherent magic from a gift or bloodline.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 6,
    primaryAbility: ["CHA"],
    savingThrows: ["CON", "CHA"],
    spellcaster: "full",
    spellcastingAbility: "CHA",
    features: [
      {
        level: 1,
        name: "Spellcasting",
        description: "Cast sorcerer spells using Charisma.",
      },
      {
        level: 1,
        name: "Sorcerous Origin",
        description: "Choose your subclass.",
      },
      {
        level: 2,
        name: "Font of Magic",
        description: "Create and convert spell slots using sorcery points.",
      },
      {
        level: 3,
        name: "Metamagic",
        description: "Modify spells using sorcery points.",
      },
      {
        level: 20,
        name: "Sorcerous Restoration",
        description: "Regain 4 sorcery points on short rest.",
      },
    ],
    subclasses: ["draconic-bloodline", "wild-magic"],
  },
  {
    id: "warlock",
    name: "Warlock",
    description:
      "A wielder of magic derived from a bargain with an extraplanar entity.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 8,
    primaryAbility: ["CHA"],
    savingThrows: ["WIS", "CHA"],
    spellcaster: "third",
    spellcastingAbility: "CHA",
    features: [
      {
        level: 1,
        name: "Otherworldly Patron",
        description: "Choose your subclass.",
      },
      {
        level: 1,
        name: "Pact Magic",
        description: "Cast spells using unique warlock spell slots.",
      },
      {
        level: 2,
        name: "Eldritch Invocations",
        description: "Choose magical abilities granted by your patron.",
      },
      {
        level: 3,
        name: "Pact Boon",
        description: "Receive a special gift from your patron.",
      },
      {
        level: 11,
        name: "Mystic Arcanum",
        description: "Learn high-level spells.",
      },
    ],
    subclasses: ["the-fiend", "the-archfey", "the-great-old-one"],
  },
  {
    id: "wizard",
    name: "Wizard",
    description:
      "A scholarly magic-user capable of manipulating the structures of reality.",
    source: "Official",
    edition: "Both",
    version: 1,
    hitDie: 6,
    primaryAbility: ["INT"],
    savingThrows: ["INT", "WIS"],
    spellcaster: "full",
    spellcastingAbility: "INT",
    features: [
      {
        level: 1,
        name: "Spellcasting",
        description: "Cast wizard spells using Intelligence.",
      },
      {
        level: 1,
        name: "Arcane Recovery",
        description: "Recover spell slots on short rest.",
      },
      {
        level: 2,
        name: "Arcane Tradition",
        description: "Choose your subclass.",
      },
      {
        level: 18,
        name: "Spell Mastery",
        description: "Cast a 1st and 2nd level spell at will.",
      },
      {
        level: 20,
        name: "Signature Spells",
        description: "Always have two 3rd level spells prepared.",
      },
    ],
    subclasses: ["school-of-evocation", "school-of-abjuration"],
  },
  {
    id: "artificer",
    name: "Artificer",
    description:
      "A master of invention and artifice, using ingenuity and magic to unlock extraordinary capabilities in objects.",
    source: "Official",
    edition: "2024",
    version: 1,
    hitDie: 8,
    primaryAbility: ["INT"],
    savingThrows: ["CON", "INT"],
    spellcaster: "half",
    spellcastingAbility: "INT",
    features: [
      {
        level: 1,
        name: "Magical Tinkering",
        description: "Imbue objects with minor magical properties.",
      },
      {
        level: 1,
        name: "Spellcasting",
        description: "Cast artificer spells using Intelligence.",
      },
      {
        level: 2,
        name: "Infuse Item",
        description: "Imbue items with magical infusions.",
      },
      {
        level: 3,
        name: "Artificer Specialist",
        description: "Choose your subclass.",
      },
      {
        level: 6,
        name: "Tool Expertise",
        description: "Double proficiency with all tools.",
      },
    ],
    subclasses: ["alchemist", "armorer", "artillerist"],
  },
];

// ========================================
// COMPREHENSIVE SUBCLASS DATABASE (SRD)
// ========================================

export const comprehensiveSubclasses: Subclass[] = [
  // Barbarian Subclasses
  {
    id: "berserker",
    parentClassId: "barbarian",
    name: "Path of the Berserker",
    description:
      "For some barbarians, rage is a means to an end—that end being violence.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Frenzy",
        description: "Make an extra attack as a bonus action while raging.",
      },
      {
        level: 6,
        name: "Mindless Rage",
        description: "Can't be charmed or frightened while raging.",
      },
      {
        level: 10,
        name: "Intimidating Presence",
        description: "Frighten enemies with your presence.",
      },
    ],
  },
  {
    id: "totem-warrior",
    parentClassId: "barbarian",
    name: "Path of the Totem Warrior",
    description: "The totem warrior bonds with animal spirits for guidance.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Totem Spirit",
        description: "Choose a totem animal for special abilities.",
      },
      {
        level: 6,
        name: "Aspect of the Beast",
        description: "Gain animal-like senses.",
      },
      {
        level: 10,
        name: "Spirit Walker",
        description: "Cast Commune with Nature as a ritual.",
      },
    ],
  },

  // Bard Subclasses
  {
    id: "college-of-lore",
    parentClassId: "bard",
    name: "College of Lore",
    description:
      "Bards of the College of Lore know something about most things, collecting bits of knowledge.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Bonus Proficiencies",
        description: "Gain 3 skill proficiencies.",
      },
      {
        level: 3,
        name: "Cutting Words",
        description: "Use Bardic Inspiration to reduce enemy rolls.",
      },
      {
        level: 6,
        name: "Additional Magical Secrets",
        description: "Learn 2 spells from any class.",
      },
    ],
  },
  {
    id: "college-of-valor",
    parentClassId: "bard",
    name: "College of Valor",
    description:
      "Bards of the College of Valor are daring skalds whose tales keep alive the memory of great heroes.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Bonus Proficiencies",
        description: "Gain armor and weapon proficiencies.",
      },
      {
        level: 3,
        name: "Combat Inspiration",
        description: "Bardic Inspiration can be used for damage or AC.",
      },
      { level: 6, name: "Extra Attack", description: "Attack twice per action." },
    ],
  },

  // Cleric Subclasses
  {
    id: "life-domain",
    parentClassId: "cleric",
    name: "Life Domain",
    description:
      "The Life domain focuses on the vibrant positive energy that sustains all life.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Disciple of Life",
        description: "Healing spells restore extra HP.",
      },
      {
        level: 1,
        name: "Bonus Proficiency",
        description: "Gain heavy armor proficiency.",
      },
      {
        level: 2,
        name: "Channel Divinity: Preserve Life",
        description: "Restore HP to wounded creatures.",
      },
    ],
  },
  {
    id: "light-domain",
    parentClassId: "cleric",
    name: "Light Domain",
    description:
      "Gods of light promote ideals of rebirth and renewal, truth, vigilance, and beauty.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Bonus Cantrip",
        description: "Learn the Light cantrip.",
      },
      {
        level: 1,
        name: "Warding Flare",
        description: "Impose disadvantage on attacks against you.",
      },
      {
        level: 2,
        name: "Channel Divinity: Radiance of the Dawn",
        description: "Deal radiant damage to nearby enemies.",
      },
    ],
  },
  {
    id: "war-domain",
    parentClassId: "cleric",
    name: "War Domain",
    description:
      "War gods see violence as a necessary part of maintaining the structure of the cosmos.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Bonus Proficiencies",
        description: "Gain heavy armor and martial weapon proficiency.",
      },
      {
        level: 1,
        name: "War Priest",
        description: "Make an extra weapon attack as a bonus action.",
      },
      {
        level: 2,
        name: "Channel Divinity: Guided Strike",
        description: "Gain +10 to an attack roll.",
      },
    ],
  },

  // Druid Subclasses
  {
    id: "circle-of-the-land",
    parentClassId: "druid",
    name: "Circle of the Land",
    description:
      "The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Bonus Cantrip",
        description: "Learn one additional druid cantrip.",
      },
      {
        level: 2,
        name: "Natural Recovery",
        description: "Recover spell slots during short rest.",
      },
      {
        level: 3,
        name: "Circle Spells",
        description: "Gain additional spells based on terrain.",
      },
    ],
  },
  {
    id: "circle-of-the-moon",
    parentClassId: "druid",
    name: "Circle of the Moon",
    description:
      "Druids of the Circle of the Moon are fierce guardians of the wilds.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Combat Wild Shape",
        description: "Use Wild Shape as a bonus action and transform into higher CR beasts.",
      },
      {
        level: 2,
        name: "Circle Forms",
        description: "Access more powerful beast forms.",
      },
      {
        level: 6,
        name: "Primal Strike",
        description: "Attacks count as magical in beast form.",
      },
    ],
  },

  // Fighter Subclasses
  {
    id: "champion",
    parentClassId: "fighter",
    name: "Champion",
    description:
      "The Champion focuses on developing raw physical power honed to deadly perfection.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Improved Critical",
        description: "Critical hits on 19-20.",
      },
      {
        level: 7,
        name: "Remarkable Athlete",
        description: "Add half proficiency to STR, DEX, CON checks.",
      },
      {
        level: 10,
        name: "Additional Fighting Style",
        description: "Learn another Fighting Style.",
      },
    ],
  },
  {
    id: "battle-master",
    parentClassId: "fighter",
    name: "Battle Master",
    description:
      "Those who emulate the Battle Master employ martial techniques passed down through generations.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Combat Superiority",
        description: "Learn maneuvers and gain superiority dice.",
      },
      {
        level: 3,
        name: "Student of War",
        description: "Gain proficiency with artisan's tools.",
      },
      {
        level: 7,
        name: "Know Your Enemy",
        description: "Learn information about enemies.",
      },
    ],
  },
  {
    id: "eldritch-knight",
    parentClassId: "fighter",
    name: "Eldritch Knight",
    description:
      "The Eldritch Knight combines martial prowess with the study of magic.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Spellcasting",
        description: "Cast wizard spells.",
      },
      {
        level: 3,
        name: "Weapon Bond",
        description: "Bond with weapons to summon them.",
      },
      {
        level: 7,
        name: "War Magic",
        description: "Make a weapon attack after casting a cantrip.",
      },
    ],
  },

  // Monk Subclasses
  {
    id: "way-of-the-open-hand",
    parentClassId: "monk",
    name: "Way of the Open Hand",
    description:
      "Monks of the Way of the Open Hand are the ultimate masters of martial arts combat.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Open Hand Technique",
        description: "Add special effects to Flurry of Blows.",
      },
      {
        level: 6,
        name: "Wholeness of Body",
        description: "Heal yourself as an action.",
      },
      {
        level: 11,
        name: "Tranquility",
        description: "Cast Sanctuary on yourself.",
      },
    ],
  },
  {
    id: "way-of-shadow",
    parentClassId: "monk",
    name: "Way of Shadow",
    description:
      "Monks of the Way of Shadow follow a tradition that values stealth and subterfuge.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Shadow Arts",
        description: "Cast certain spells using Ki.",
      },
      {
        level: 6,
        name: "Shadow Step",
        description: "Teleport between shadows.",
      },
      {
        level: 11,
        name: "Cloak of Shadows",
        description: "Become invisible in dim light.",
      },
    ],
  },

  // Paladin Subclasses
  {
    id: "oath-of-devotion",
    parentClassId: "paladin",
    name: "Oath of Devotion",
    description:
      "The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Sacred Weapon",
        description: "Empower your weapon with radiant energy.",
      },
      {
        level: 3,
        name: "Turn the Unholy",
        description: "Turn fiends and undead.",
      },
      {
        level: 7,
        name: "Aura of Devotion",
        description: "You and allies can't be charmed.",
      },
    ],
  },
  {
    id: "oath-of-the-ancients",
    parentClassId: "paladin",
    name: "Oath of the Ancients",
    description:
      "The Oath of the Ancients is as old as the race of elves and the rituals of druids.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Nature's Wrath",
        description: "Restrain enemies with spectral vines.",
      },
      {
        level: 3,
        name: "Turn the Faithless",
        description: "Turn fey and fiends.",
      },
      {
        level: 7,
        name: "Aura of Warding",
        description: "Resistance to spell damage for you and allies.",
      },
    ],
  },
  {
    id: "oath-of-vengeance",
    parentClassId: "paladin",
    name: "Oath of Vengeance",
    description:
      "The Oath of Vengeance is a solemn commitment to punish those who have committed grievous sins.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Abjure Enemy",
        description: "Frighten and slow a creature.",
      },
      {
        level: 3,
        name: "Vow of Enmity",
        description: "Gain advantage on attacks against one enemy.",
      },
      {
        level: 7,
        name: "Relentless Avenger",
        description: "Move toward fleeing enemies.",
      },
    ],
  },

  // Ranger Subclasses
  {
    id: "hunter",
    parentClassId: "ranger",
    name: "Hunter",
    description:
      "Emulating the Hunter archetype means accepting your place as a bulwark between civilization and the terrors of the wilderness.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Hunter's Prey",
        description: "Choose a combat technique against enemies.",
      },
      {
        level: 7,
        name: "Defensive Tactics",
        description: "Choose a defensive technique.",
      },
      {
        level: 11,
        name: "Multiattack",
        description: "Attack multiple targets or the same target multiple times.",
      },
    ],
  },
  {
    id: "beast-master",
    parentClassId: "ranger",
    name: "Beast Master",
    description:
      "The Beast Master forms a mystical bond with an animal companion.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Ranger's Companion",
        description: "Gain a beast companion.",
      },
      {
        level: 7,
        name: "Exceptional Training",
        description: "Your companion can Dash, Disengage, or Dodge as a bonus action.",
      },
      {
        level: 11,
        name: "Bestial Fury",
        description: "Your companion makes two attacks.",
      },
    ],
  },

  // Rogue Subclasses
  {
    id: "thief",
    parentClassId: "rogue",
    name: "Thief",
    description:
      "You hone your skills in the larcenous arts, using nimble hands and quick wits.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Fast Hands",
        description: "Use Cunning Action for additional tasks.",
      },
      {
        level: 3,
        name: "Second-Story Work",
        description: "Climb faster and jump farther.",
      },
      {
        level: 9,
        name: "Supreme Sneak",
        description: "Advantage on Stealth if you move slowly.",
      },
    ],
  },
  {
    id: "assassin",
    parentClassId: "rogue",
    name: "Assassin",
    description:
      "You focus your training on the grim art of death, mastering killing techniques.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Bonus Proficiencies",
        description: "Gain proficiency with disguise and poisoner's kits.",
      },
      {
        level: 3,
        name: "Assassinate",
        description: "Advantage on creatures that haven't acted and auto-crit surprised creatures.",
      },
      {
        level: 9,
        name: "Infiltration Expertise",
        description: "Create false identities.",
      },
    ],
  },
  {
    id: "arcane-trickster",
    parentClassId: "rogue",
    name: "Arcane Trickster",
    description:
      "Some rogues enhance their fine-honed skills of stealth and agility with magic.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 3,
        name: "Spellcasting",
        description: "Cast wizard spells, focusing on illusion and enchantment.",
      },
      {
        level: 3,
        name: "Mage Hand Legerdemain",
        description: "Enhanced Mage Hand with additional abilities.",
      },
      {
        level: 9,
        name: "Magical Ambush",
        description: "Impose disadvantage on saves if you're hidden.",
      },
    ],
  },

  // Sorcerer Subclasses
  {
    id: "draconic-bloodline",
    parentClassId: "sorcerer",
    name: "Draconic Bloodline",
    description:
      "Your innate magic comes from draconic magic that was mingled with your blood.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Dragon Ancestor",
        description: "Choose a dragon type for your bloodline.",
      },
      {
        level: 1,
        name: "Draconic Resilience",
        description: "HP increase and natural armor.",
      },
      {
        level: 6,
        name: "Elemental Affinity",
        description: "Add CHA to damage of your dragon's element.",
      },
    ],
  },
  {
    id: "wild-magic",
    parentClassId: "sorcerer",
    name: "Wild Magic",
    description:
      "Your innate magic comes from the wild forces of chaos that underlie the order of creation.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Wild Magic Surge",
        description: "Spells may trigger random magical effects.",
      },
      {
        level: 1,
        name: "Tides of Chaos",
        description: "Gain advantage on one roll.",
      },
      {
        level: 6,
        name: "Bend Luck",
        description: "Add or subtract from a creature's roll.",
      },
    ],
  },

  // Warlock Subclasses
  {
    id: "the-fiend",
    parentClassId: "warlock",
    name: "The Fiend",
    description:
      "You have made a pact with a fiend from the lower planes of existence.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Dark One's Blessing",
        description: "Gain temporary HP when you reduce a creature to 0 HP.",
      },
      {
        level: 6,
        name: "Dark One's Own Luck",
        description: "Add d10 to an ability check or save.",
      },
      {
        level: 10,
        name: "Fiendish Resilience",
        description: "Choose a damage type to resist.",
      },
    ],
  },
  {
    id: "the-archfey",
    parentClassId: "warlock",
    name: "The Archfey",
    description: "Your patron is a lord or lady of the fey, a creature of legend.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Fey Presence",
        description: "Charm or frighten nearby creatures.",
      },
      {
        level: 6,
        name: "Misty Escape",
        description: "Turn invisible and teleport when damaged.",
      },
      {
        level: 10,
        name: "Beguiling Defenses",
        description: "Immune to charm and turn charm back.",
      },
    ],
  },
  {
    id: "the-great-old-one",
    parentClassId: "warlock",
    name: "The Great Old One",
    description:
      "Your patron is a mysterious entity whose nature is utterly foreign to the fabric of reality.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 1,
        name: "Awakened Mind",
        description: "Telepathically communicate with creatures.",
      },
      {
        level: 6,
        name: "Entropic Ward",
        description: "Impose disadvantage on attacks and gain advantage on your next attack.",
      },
      {
        level: 10,
        name: "Thought Shield",
        description: "Resistance to psychic damage and reflect damage.",
      },
    ],
  },

  // Wizard Subclasses
  {
    id: "school-of-evocation",
    parentClassId: "wizard",
    name: "School of Evocation",
    description:
      "You focus your study on magic that creates powerful elemental effects.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Evocation Savant",
        description: "Evocation spells cost half gold and time to copy.",
      },
      {
        level: 2,
        name: "Sculpt Spells",
        description: "Protect allies from your area spells.",
      },
      {
        level: 6,
        name: "Potent Cantrip",
        description: "Cantrips deal half damage on saves.",
      },
    ],
  },
  {
    id: "school-of-abjuration",
    parentClassId: "wizard",
    name: "School of Abjuration",
    description:
      "You focus your study on magic that blocks, banishes, or protects.",
    source: "Official",
    edition: "Both",
    version: 1,
    features: [
      {
        level: 2,
        name: "Abjuration Savant",
        description: "Abjuration spells cost half gold and time to copy.",
      },
      {
        level: 2,
        name: "Arcane Ward",
        description: "Create a magical ward that absorbs damage.",
      },
      {
        level: 6,
        name: "Projected Ward",
        description: "Use your ward to protect others.",
      },
    ],
  },

  // Artificer Subclasses
  {
    id: "alchemist",
    parentClassId: "artificer",
    name: "Alchemist",
    description:
      "An Alchemist is an expert at combining reagents to produce mystical effects.",
    source: "Official",
    edition: "2024",
    version: 1,
    features: [
      {
        level: 3,
        name: "Tool Proficiency",
        description: "Gain proficiency with alchemist's supplies.",
      },
      {
        level: 3,
        name: "Alchemist Spells",
        description: "Gain additional spells.",
      },
      {
        level: 3,
        name: "Experimental Elixir",
        description: "Create magical elixirs.",
      },
    ],
  },
  {
    id: "armorer",
    parentClassId: "artificer",
    name: "Armorer",
    description:
      "An Armorer specializes in using magic to create a suit of powerful armor.",
    source: "Official",
    edition: "2024",
    version: 1,
    features: [
      {
        level: 3,
        name: "Tools of the Trade",
        description: "Gain proficiency with smith's tools.",
      },
      {
        level: 3,
        name: "Armorer Spells",
        description: "Gain additional spells.",
      },
      {
        level: 3,
        name: "Arcane Armor",
        description: "Transform a suit of armor into magical armor.",
      },
    ],
  },
  {
    id: "artillerist",
    parentClassId: "artificer",
    name: "Artillerist",
    description:
      "An Artillerist specializes in using magic to hurl energy and projectiles.",
    source: "Official",
    edition: "2024",
    version: 1,
    features: [
      {
        level: 3,
        name: "Tool Proficiency",
        description: "Gain proficiency with woodcarver's tools.",
      },
      {
        level: 3,
        name: "Artillerist Spells",
        description: "Gain additional spells.",
      },
      {
        level: 3,
        name: "Eldritch Cannon",
        description: "Create a magical cannon.",
      },
    ],
  },
];

// ========================================
// COMPREHENSIVE BACKGROUND DATABASE (SRD)
// ========================================

export const comprehensiveBackgrounds: Background[] = [
  {
    id: "acolyte",
    name: "Acolyte",
    description:
      "You have spent your life in the service of a temple to a specific god or pantheon of gods.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Insight", "Religion"],
    toolProficiencies: [],
    languages: 2,
    equipment: [
      "Holy symbol",
      "Prayer book",
      "5 sticks of incense",
      "Vestments",
      "Common clothes",
      "Belt pouch with 15 gp",
    ],
    feature: {
      name: "Shelter of the Faithful",
      description:
        "You can call upon the support of those who share your faith, receiving healing and care at temples.",
    },
  },
  {
    id: "criminal",
    name: "Criminal",
    description:
      "You are an experienced criminal with a history of breaking the law.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Deception", "Stealth"],
    toolProficiencies: ["Thieves' tools", "Gaming set (one type)"],
    languages: 0,
    equipment: [
      "Crowbar",
      "Dark common clothes with hood",
      "Belt pouch with 15 gp",
    ],
    feature: {
      name: "Criminal Contact",
      description:
        "You have a reliable contact who acts as your liaison to a network of other criminals.",
    },
  },
  {
    id: "folk-hero",
    name: "Folk Hero",
    description:
      "You come from a humble social rank, but you are destined for so much more.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Animal Handling", "Survival"],
    toolProficiencies: ["Artisan's tools (one type)", "Vehicles (land)"],
    languages: 0,
    equipment: [
      "Artisan's tools",
      "Shovel",
      "Iron pot",
      "Common clothes",
      "Belt pouch with 10 gp",
    ],
    feature: {
      name: "Rustic Hospitality",
      description:
        "Common folk will shelter and hide you from the law or anyone searching for you.",
    },
  },
  {
    id: "noble",
    name: "Noble",
    description:
      "You understand wealth, power, and privilege. You carry a noble title.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["History", "Persuasion"],
    toolProficiencies: ["Gaming set (one type)"],
    languages: 1,
    equipment: [
      "Fine clothes",
      "Signet ring",
      "Scroll of pedigree",
      "Purse with 25 gp",
    ],
    feature: {
      name: "Position of Privilege",
      description:
        "People are inclined to think the best of you, and you have access to high society.",
    },
  },
  {
    id: "sage",
    name: "Sage",
    description:
      "You spent years learning the lore of the multiverse in libraries and universities.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Arcana", "History"],
    toolProficiencies: [],
    languages: 2,
    equipment: [
      "Bottle of black ink",
      "Quill",
      "Small knife",
      "Letter from colleague",
      "Common clothes",
      "Belt pouch with 10 gp",
    ],
    feature: {
      name: "Researcher",
      description:
        "You know how to obtain information and can often recall or find lore.",
    },
  },
  {
    id: "soldier",
    name: "Soldier",
    description:
      "You have military experience and extensive training in armed combat.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Athletics", "Intimidation"],
    toolProficiencies: ["Gaming set (one type)", "Vehicles (land)"],
    languages: 0,
    equipment: [
      "Insignia of rank",
      "Trophy from fallen enemy",
      "Gaming set",
      "Common clothes",
      "Belt pouch with 10 gp",
    ],
    feature: {
      name: "Military Rank",
      description:
        "You have rank from your military career, granting you authority over lower-ranked soldiers.",
    },
  },
  {
    id: "urchin",
    name: "Urchin",
    description:
      "You grew up on the streets alone, poor, and without anyone to rely on.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Sleight of Hand", "Stealth"],
    toolProficiencies: ["Disguise kit", "Thieves' tools"],
    languages: 0,
    equipment: [
      "Small knife",
      "Map of your city",
      "Pet mouse",
      "Token from parents",
      "Common clothes",
      "Belt pouch with 10 gp",
    ],
    feature: {
      name: "City Secrets",
      description:
        "You know the secret patterns of city streets and can move through urban environments quickly.",
    },
  },
  {
    id: "entertainer",
    name: "Entertainer",
    description:
      "You thrive in front of an audience, entertaining with music, dance, acting, or storytelling.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Acrobatics", "Performance"],
    toolProficiencies: ["Disguise kit", "Musical instrument (one type)"],
    languages: 0,
    equipment: [
      "Musical instrument",
      "Favor from an admirer",
      "Costume",
      "Belt pouch with 15 gp",
    ],
    feature: {
      name: "By Popular Demand",
      description:
        "You can find a place to perform and receive free lodging and food.",
    },
  },
  {
    id: "guild-artisan",
    name: "Guild Artisan",
    description:
      "You are a skilled member of an artisan's guild, trained in a particular craft.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Insight", "Persuasion"],
    toolProficiencies: ["Artisan's tools (one type)"],
    languages: 1,
    equipment: [
      "Artisan's tools",
      "Letter of introduction from guild",
      "Traveler's clothes",
      "Belt pouch with 15 gp",
    ],
    feature: {
      name: "Guild Membership",
      description:
        "Your guild provides lodging, legal support, and access to trade networks.",
    },
  },
  {
    id: "hermit",
    name: "Hermit",
    description:
      "You lived in seclusion seeking enlightenment or escaping your past.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Medicine", "Religion"],
    toolProficiencies: ["Herbalism kit"],
    languages: 1,
    equipment: [
      "Scroll case with notes",
      "Winter blanket",
      "Common clothes",
      "Herbalism kit",
      "5 gp",
    ],
    feature: {
      name: "Discovery",
      description:
        "You discovered a unique truth or secret that has shaped your life.",
    },
  },
  {
    id: "outlander",
    name: "Outlander",
    description:
      "You grew up in the wilds, far from civilization and the comforts of town.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Athletics", "Survival"],
    toolProficiencies: ["Musical instrument (one type)"],
    languages: 1,
    equipment: [
      "Staff",
      "Hunting trap",
      "Trophy from animal",
      "Traveler's clothes",
      "Belt pouch with 10 gp",
    ],
    feature: {
      name: "Wanderer",
      description:
        "You have excellent memory for geography and can find food and water for yourself and others.",
    },
  },
  {
    id: "charlatan",
    name: "Charlatan",
    description:
      "You have always had a way with people, knowing what to say and when to say it.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Deception", "Sleight of Hand"],
    toolProficiencies: ["Disguise kit", "Forgery kit"],
    languages: 0,
    equipment: [
      "Fine clothes",
      "Disguise kit",
      "Tools of con (weighted dice, marked cards)",
      "Belt pouch with 15 gp",
    ],
    feature: {
      name: "False Identity",
      description:
        "You have created a second identity with documentation and disguises.",
    },
  },
];

// ========================================
// COMPREHENSIVE FEAT DATABASE (SRD)
// ========================================

export const comprehensiveFeats: Feat[] = [
  {
    id: "alert",
    name: "Alert",
    description:
      "Always on the lookout for danger, you gain the following benefits: +5 to initiative, you can't be surprised, and hidden creatures don't gain advantage on attacks against you.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "+5 to initiative",
        "Can't be surprised",
        "No advantage for hidden attackers",
      ],
    },
  },
  {
    id: "athlete",
    name: "Athlete",
    description:
      "You have undergone extensive physical training to gain athletic prowess.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: [
        "Stand up from prone costs only 5 feet",
        "Climbing doesn't cost extra movement",
        "Running jump with only 5 feet of movement",
      ],
    },
  },
  {
    id: "actor",
    name: "Actor",
    description:
      "Skilled at mimicry and dramatics, you gain advantages when impersonating or entertaining.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { CHA: 1 },
      features: [
        "Advantage on Deception and Performance checks when pretending",
        "Mimic speech of others or sounds",
      ],
    },
  },
  {
    id: "charger",
    name: "Charger",
    description:
      "When you Dash, you can use a bonus action to make a melee attack or shove.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "After Dash, make melee attack or shove as bonus action",
        "Attack gains +5 damage or shove pushes 10 feet",
      ],
    },
  },
  {
    id: "crossbow-expert",
    name: "Crossbow Expert",
    description:
      "Thanks to extensive practice, you ignore loading property of crossbows and can attack in melee.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Ignore loading property",
        "No disadvantage for ranged attacks in melee",
        "Bonus action attack with hand crossbow after one-handed weapon attack",
      ],
    },
  },
  {
    id: "defensive-duelist",
    name: "Defensive Duelist",
    description:
      "When wielding a finesse weapon, you can use your reaction to add proficiency bonus to AC.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      abilityScore: { DEX: 13 },
    },
    benefits: {
      features: [
        "Add proficiency bonus to AC against one melee attack while wielding finesse weapon",
      ],
    },
  },
  {
    id: "dual-wielder",
    name: "Dual Wielder",
    description: "You master fighting with two weapons, gaining the following benefits.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "+1 AC while dual wielding",
        "Can dual wield non-light weapons",
        "Can draw or stow two weapons at once",
      ],
    },
  },
  {
    id: "dungeon-delver",
    name: "Dungeon Delver",
    description:
      "Alert to hidden traps and secret doors, you gain advantages in dungeons.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Advantage on Perception and Investigation checks for secret doors",
        "Advantage on saves against traps",
        "Resistance to trap damage",
        "Search for traps at normal pace",
      ],
    },
  },
  {
    id: "durable",
    name: "Durable",
    description: "Hardy and resilient, you gain increased hit point recovery.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { CON: 1 },
      features: [
        "Minimum HP regained from Hit Die equals 2x CON modifier",
      ],
    },
  },
  {
    id: "elemental-adept",
    name: "Elemental Adept",
    description:
      "When you gain this feat, choose acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to that damage type.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      class: [
        "wizard",
        "sorcerer",
        "warlock",
        "druid",
        "cleric",
        "bard",
        "artificer",
      ],
    },
    benefits: {
      features: [
        "Spells ignore resistance to chosen element",
        "Treat 1s on damage dice as 2s for chosen element",
      ],
    },
  },
  {
    id: "grappler",
    name: "Grappler",
    description:
      "You've developed skills necessary to hold your own in close-quarters grappling.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      abilityScore: { STR: 13 },
    },
    benefits: {
      features: [
        "Advantage on attacks against creatures you're grappling",
        "Pin grappled creatures (both restrained)",
      ],
    },
  },
  {
    id: "great-weapon-master",
    name: "Great Weapon Master",
    description:
      "You've learned to use your weapon's weight to your advantage in combat.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Bonus action melee attack on critical hit or reducing creature to 0 HP",
        "Take -5 to attack for +10 damage with heavy weapons",
      ],
    },
  },
  {
    id: "healer",
    name: "Healer",
    description:
      "You are an able physician, allowing you to mend wounds quickly.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Stabilize with healer's kit restores 1 HP",
        "Heal 1d6+4+target's max Hit Dice with healer's kit (once per short rest per creature)",
      ],
    },
  },
  {
    id: "heavily-armored",
    name: "Heavily Armored",
    description:
      "You have trained to master the use of heavy armor, gaining proficiency.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      features: ["Proficiency with medium armor"],
    },
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: ["Gain heavy armor proficiency"],
    },
  },
  {
    id: "heavy-armor-master",
    name: "Heavy Armor Master",
    description:
      "You can use your armor to deflect strikes that would kill others.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      features: ["Proficiency with heavy armor"],
    },
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: [
        "Reduce non-magical bludgeoning, piercing, slashing damage by 3",
      ],
    },
  },
  {
    id: "inspiring-leader",
    name: "Inspiring Leader",
    description:
      "You can spend 10 minutes inspiring companions, granting them temporary HP.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      abilityScore: { CHA: 13 },
    },
    benefits: {
      features: [
        "Grant temporary HP equal to your level + CHA modifier to up to 6 creatures",
      ],
    },
  },
  {
    id: "keen-mind",
    name: "Keen Mind",
    description: "You have a mind that can track time, direction, and details.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { INT: 1 },
      features: [
        "Always know which way is north",
        "Always know hours until sunrise/sunset",
        "Recall anything from the past month",
      ],
    },
  },
  {
    id: "lightly-armored",
    name: "Lightly Armored",
    description: "You have trained to master the use of light armor.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: ["Gain light armor proficiency"],
    },
  },
  {
    id: "linguist",
    name: "Linguist",
    description: "You have studied languages and codes, gaining linguistic skills.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { INT: 1 },
      features: [
        "Learn 3 languages",
        "Create written ciphers (DC = INT score + proficiency)",
      ],
    },
  },
  {
    id: "lucky",
    name: "Lucky",
    description: "You have inexplicable luck that seems to kick in at just the right moment.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "3 luck points to reroll attack, ability check, or save",
        "Can force reroll of attacks against you",
      ],
    },
  },
  {
    id: "mage-slayer",
    name: "Mage Slayer",
    description: "You have practiced techniques useful in melee combat against spellcasters.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Reaction attack when creature within 5 feet casts spell",
        "Impose disadvantage on concentration saves from your damage",
        "Advantage on saves against spells cast within 5 feet",
      ],
    },
  },
  {
    id: "magic-initiate",
    name: "Magic Initiate",
    description: "Choose a class: you learn 2 cantrips and 1 1st-level spell from that class.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      spells: ["2 cantrips + 1 first level spell from chosen class"],
    },
  },
  {
    id: "martial-adept",
    name: "Martial Adept",
    description: "You have martial training that allows you to perform special combat maneuvers.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Learn 2 maneuvers from Battle Master",
        "Gain 1 superiority die (d6)",
      ],
    },
  },
  {
    id: "medium-armor-master",
    name: "Medium Armor Master",
    description: "You have practiced moving in medium armor to gain mastery.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      features: ["Proficiency with medium armor"],
    },
    benefits: {
      features: [
        "No disadvantage on Stealth in medium armor",
        "Add up to +3 DEX to AC in medium armor (instead of +2)",
      ],
    },
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "You are exceptionally speedy and agile.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "+10 feet movement speed",
        "Dash through difficult terrain without extra cost",
        "No opportunity attacks from creatures you attacked",
      ],
    },
  },
  {
    id: "moderately-armored",
    name: "Moderately Armored",
    description: "You have trained to master the use of medium armor and shields.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      features: ["Proficiency with light armor"],
    },
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: ["Gain medium armor and shield proficiency"],
    },
  },
  {
    id: "mounted-combatant",
    name: "Mounted Combatant",
    description: "You are a dangerous foe to face while mounted.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Advantage on melee attacks against unmounted creatures smaller than mount",
        "Force attacks against mount to target you instead",
        "Mount takes no damage on successful DEX save (half on failure)",
      ],
    },
  },
  {
    id: "observant",
    name: "Observant",
    description: "Quick to notice details of your environment.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { WIS: 1 },
      features: [
        "+5 to passive Perception and Investigation",
        "Read lips",
      ],
    },
  },
  {
    id: "polearm-master",
    name: "Polearm Master",
    description: "You can use polearms with deadly efficiency.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Bonus action attack with opposite end (d4 damage)",
        "Opportunity attacks when creatures enter reach",
      ],
    },
  },
  {
    id: "resilient",
    name: "Resilient",
    description: "Choose one ability score. You gain proficiency in saves for that ability.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "+1 to chosen ability score",
        "Gain saving throw proficiency in chosen ability",
      ],
    },
  },
  {
    id: "ritual-caster",
    name: "Ritual Caster",
    description: "You have learned ritual spells from a chosen class.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      abilityScore: { INT: 13, WIS: 13 },
    },
    benefits: {
      features: [
        "Gain ritual book with 2 ritual spells from chosen class",
        "Can add ritual spells you find to your book",
      ],
    },
  },
  {
    id: "savage-attacker",
    name: "Savage Attacker",
    description: "Once per turn, reroll weapon damage dice and use either result.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: ["Reroll melee weapon damage once per turn"],
    },
  },
  {
    id: "sentinel",
    name: "Sentinel",
    description: "You have mastered techniques to take advantage of every drop in enemy defense.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Opportunity attacks reduce target speed to 0",
        "Attack creatures that attack allies within 5 feet",
        "Opportunity attacks even when enemy Disengages",
      ],
    },
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "You have mastered ranged weapons and can make shots others find impossible.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "No disadvantage for long range",
        "Ignore half and three-quarters cover",
        "Take -5 to attack for +10 damage with ranged weapons",
      ],
    },
  },
  {
    id: "shield-master",
    name: "Shield Master",
    description: "You use shields not just for protection but as weapons.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Bonus action shove with shield after Attack action",
        "Add shield AC to DEX saves against single-target effects",
        "Take no damage on successful DEX save (half on failure) when using shield",
      ],
    },
  },
  {
    id: "skilled",
    name: "Skilled",
    description: "You gain proficiency in any combination of 3 skills or tools.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: ["Gain 3 skill or tool proficiencies"],
    },
  },
  {
    id: "skulker",
    name: "Skulker",
    description: "You are expert at slinking through shadows.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      abilityScore: { DEX: 13 },
    },
    benefits: {
      features: [
        "Hide when lightly obscured",
        "Missing ranged attack doesn't reveal position",
        "No disadvantage on Perception in dim light",
      ],
    },
  },
  {
    id: "spell-sniper",
    name: "Spell Sniper",
    description: "You have learned techniques to enhance your attack spells.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      class: [
        "wizard",
        "sorcerer",
        "warlock",
        "druid",
        "cleric",
        "bard",
        "artificer",
      ],
    },
    benefits: {
      features: [
        "Double range for spells with attack rolls",
        "Ignore half and three-quarters cover",
        "Learn 1 attack cantrip",
      ],
    },
  },
  {
    id: "tavern-brawler",
    name: "Tavern Brawler",
    description: "Accustomed to rough-and-tumble fighting using improvised weapons.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: [
        "Proficient with improvised weapons",
        "Unarmed strike uses d4",
        "Grapple as bonus action after hitting with unarmed or improvised weapon",
      ],
    },
  },
  {
    id: "tough",
    name: "Tough",
    description: "Your hit point maximum increases by an amount equal to twice your level.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: ["+2 HP per level (including past levels)"],
    },
  },
  {
    id: "war-caster",
    name: "War Caster",
    description: "You have practiced casting spells in the midst of combat.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      class: [
        "wizard",
        "sorcerer",
        "warlock",
        "druid",
        "cleric",
        "bard",
        "artificer",
        "paladin",
        "ranger",
      ],
    },
    benefits: {
      features: [
        "Advantage on concentration saves",
        "Cast spells with hands full of weapons/shield",
        "Cast spell as opportunity attack",
      ],
    },
  },
  {
    id: "weapon-master",
    name: "Weapon Master",
    description: "You have practiced extensively with a variety of weapons.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: ["Gain proficiency with 4 weapons of your choice"],
    },
  },
];

// ========================================
// COMPREHENSIVE ITEM DATABASE (SRD)
// ========================================

export const comprehensiveItems: Item[] = [
  // Weapons - Simple Melee
  {
    id: "club",
    name: "Club",
    type: "Weapon",
    description: "A simple wooden club used for bludgeoning foes.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 1, currency: "sp" },
    weight: 2,
    properties: ["Light", "Simple", "Melee", "1d4 bludgeoning"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "dagger",
    name: "Dagger",
    type: "Weapon",
    description: "A short blade used for close combat or throwing.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 2, currency: "gp" },
    weight: 1,
    properties: [
      "Light",
      "Finesse",
      "Thrown (20/60)",
      "Simple",
      "Melee",
      "1d4 piercing",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "mace",
    name: "Mace",
    type: "Weapon",
    description: "A heavy club with a metal head.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 5, currency: "gp" },
    weight: 4,
    properties: ["Simple", "Melee", "1d6 bludgeoning"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "quarterstaff",
    name: "Quarterstaff",
    type: "Weapon",
    description: "A simple wooden staff, favored by monks and travelers.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 2, currency: "sp" },
    weight: 4,
    properties: ["Versatile (1d8)", "Simple", "Melee", "1d6 bludgeoning"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "spear",
    name: "Spear",
    type: "Weapon",
    description: "A pole weapon with a sharp point.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 1, currency: "gp" },
    weight: 3,
    properties: [
      "Thrown (20/60)",
      "Versatile (1d8)",
      "Simple",
      "Melee",
      "1d6 piercing",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Weapons - Simple Ranged
  {
    id: "light-crossbow",
    name: "Light Crossbow",
    type: "Weapon",
    description: "A ranged weapon that shoots bolts.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 25, currency: "gp" },
    weight: 5,
    properties: [
      "Ammunition (80/320)",
      "Loading",
      "Two-handed",
      "Simple",
      "Ranged",
      "1d8 piercing",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "shortbow",
    name: "Shortbow",
    type: "Weapon",
    description: "A lightweight bow suitable for quick shots.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 25, currency: "gp" },
    weight: 2,
    properties: [
      "Ammunition (80/320)",
      "Two-handed",
      "Simple",
      "Ranged",
      "1d6 piercing",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Weapons - Martial Melee
  {
    id: "longsword",
    name: "Longsword",
    type: "Weapon",
    description: "A versatile blade favored by knights and warriors.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 15, currency: "gp" },
    weight: 3,
    properties: ["Versatile (1d10)", "Martial", "Melee", "1d8 slashing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "greatsword",
    name: "Greatsword",
    type: "Weapon",
    description: "A massive two-handed sword that deals devastating damage.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 50, currency: "gp" },
    weight: 6,
    properties: ["Heavy", "Two-handed", "Martial", "Melee", "2d6 slashing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "rapier",
    name: "Rapier",
    type: "Weapon",
    description: "A thin, sharp blade perfect for precise strikes.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 25, currency: "gp" },
    weight: 2,
    properties: ["Finesse", "Martial", "Melee", "1d8 piercing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "shortsword",
    name: "Shortsword",
    type: "Weapon",
    description: "A light, quick blade ideal for dual wielding.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 10, currency: "gp" },
    weight: 2,
    properties: ["Finesse", "Light", "Martial", "Melee", "1d6 piercing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "battleaxe",
    name: "Battleaxe",
    type: "Weapon",
    description: "A heavy axe designed for cleaving foes.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 10, currency: "gp" },
    weight: 4,
    properties: ["Versatile (1d10)", "Martial", "Melee", "1d8 slashing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "greataxe",
    name: "Greataxe",
    type: "Weapon",
    description: "A massive two-handed axe capable of devastating strikes.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 30, currency: "gp" },
    weight: 7,
    properties: ["Heavy", "Two-handed", "Martial", "Melee", "1d12 slashing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "warhammer",
    name: "Warhammer",
    type: "Weapon",
    description: "A heavy hammer designed for crushing armor and bone.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 15, currency: "gp" },
    weight: 2,
    properties: ["Versatile (1d10)", "Martial", "Melee", "1d8 bludgeoning"],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Weapons - Martial Ranged
  {
    id: "longbow",
    name: "Longbow",
    type: "Weapon",
    description: "A powerful bow with exceptional range.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 50, currency: "gp" },
    weight: 2,
    properties: [
      "Ammunition (150/600)",
      "Heavy",
      "Two-handed",
      "Martial",
      "Ranged",
      "1d8 piercing",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "heavy-crossbow",
    name: "Heavy Crossbow",
    type: "Weapon",
    description: "A powerful crossbow that requires significant strength.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 50, currency: "gp" },
    weight: 18,
    properties: [
      "Ammunition (100/400)",
      "Heavy",
      "Loading",
      "Two-handed",
      "Martial",
      "Ranged",
      "1d10 piercing",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Armor - Light
  {
    id: "padded-armor",
    name: "Padded Armor",
    type: "Armor",
    description: "Quilted layers of cloth and batting.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 5, currency: "gp" },
    weight: 8,
    properties: ["Light Armor", "AC 11 + Dex", "Disadvantage on Stealth"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "leather-armor",
    name: "Leather Armor",
    type: "Armor",
    description: "Boiled leather breastplate and shoulder protectors.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 10, currency: "gp" },
    weight: 10,
    properties: ["Light Armor", "AC 11 + Dex"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "studded-leather",
    name: "Studded Leather Armor",
    type: "Armor",
    description: "Leather armor reinforced with close-set rivets or spikes.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 45, currency: "gp" },
    weight: 13,
    properties: ["Light Armor", "AC 12 + Dex"],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Armor - Medium
  {
    id: "hide-armor",
    name: "Hide Armor",
    type: "Armor",
    description: "Crude armor made from thick furs and pelts.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 10, currency: "gp" },
    weight: 12,
    properties: ["Medium Armor", "AC 12 + Dex (max 2)"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "chain-shirt",
    name: "Chain Shirt",
    type: "Armor",
    description: "Made of interlocking metal rings.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 50, currency: "gp" },
    weight: 20,
    properties: ["Medium Armor", "AC 13 + Dex (max 2)"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "scale-mail",
    name: "Scale Mail",
    type: "Armor",
    description: "Coat and leggings of leather covered with overlapping metal scales.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 50, currency: "gp" },
    weight: 45,
    properties: [
      "Medium Armor",
      "AC 14 + Dex (max 2)",
      "Disadvantage on Stealth",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "breastplate",
    name: "Breastplate",
    type: "Armor",
    description: "Fitted metal chest piece worn with leather.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 400, currency: "gp" },
    weight: 20,
    properties: ["Medium Armor", "AC 14 + Dex (max 2)"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "half-plate",
    name: "Half Plate Armor",
    type: "Armor",
    description: "Shaped metal plates that cover most of the body.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 750, currency: "gp" },
    weight: 40,
    properties: [
      "Medium Armor",
      "AC 15 + Dex (max 2)",
      "Disadvantage on Stealth",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Armor - Heavy
  {
    id: "ring-mail",
    name: "Ring Mail",
    type: "Armor",
    description: "Leather armor with heavy rings sewn into it.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 30, currency: "gp" },
    weight: 40,
    properties: ["Heavy Armor", "AC 14", "Disadvantage on Stealth"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "chain-mail",
    name: "Chain Mail",
    type: "Armor",
    description: "Interlocking metal rings form this armor.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 75, currency: "gp" },
    weight: 55,
    properties: [
      "Heavy Armor",
      "AC 16",
      "Str 13 required",
      "Disadvantage on Stealth",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "splint-armor",
    name: "Splint Armor",
    type: "Armor",
    description: "Narrow vertical strips of metal riveted to leather backing.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 200, currency: "gp" },
    weight: 60,
    properties: [
      "Heavy Armor",
      "AC 17",
      "Str 15 required",
      "Disadvantage on Stealth",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "plate-armor",
    name: "Plate Armor",
    type: "Armor",
    description:
      "Interlocking metal plates covering the entire body, the best mundane armor available.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 1500, currency: "gp" },
    weight: 65,
    properties: [
      "Heavy Armor",
      "AC 18",
      "Str 15 required",
      "Disadvantage on Stealth",
    ],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Magical Items
  {
    id: "potion-of-healing",
    name: "Potion of Healing",
    type: "Potion",
    description: "A character who drinks this potion regains 2d4+2 hit points.",
    magical: true,
    rarity: "Common",
    requiresAttunement: false,
    cost: { amount: 50, currency: "gp" },
    weight: 0.5,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "potion-of-greater-healing",
    name: "Potion of Greater Healing",
    type: "Potion",
    description: "A character who drinks this potion regains 4d4+4 hit points.",
    magical: true,
    rarity: "Uncommon",
    requiresAttunement: false,
    cost: { amount: 150, currency: "gp" },
    weight: 0.5,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "bag-of-holding",
    name: "Bag of Holding",
    type: "Wondrous Item",
    description:
      "This bag has an interior space considerably larger than its outside dimensions. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet.",
    magical: true,
    rarity: "Uncommon",
    requiresAttunement: false,
    cost: { amount: 4000, currency: "gp" },
    weight: 15,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "cloak-of-protection",
    name: "Cloak of Protection",
    type: "Wondrous Item",
    description:
      "You gain a +1 bonus to AC and saving throws while you wear this cloak.",
    magical: true,
    rarity: "Uncommon",
    requiresAttunement: true,
    cost: { amount: 3500, currency: "gp" },
    weight: 1,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "ring-of-protection",
    name: "Ring of Protection",
    type: "Ring",
    description:
      "You gain a +1 bonus to AC and saving throws while wearing this ring.",
    magical: true,
    rarity: "Rare",
    requiresAttunement: true,
    cost: { amount: 8000, currency: "gp" },
    weight: 0,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "wand-of-magic-missiles",
    name: "Wand of Magic Missiles",
    type: "Wand",
    description:
      "This wand has 7 charges. While holding it, you can expend 1 or more charges to cast Magic Missile.",
    magical: true,
    rarity: "Uncommon",
    requiresAttunement: false,
    cost: { amount: 4000, currency: "gp" },
    weight: 1,
    properties: ["7 charges", "Regain 1d6+1 charges at dawn"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "boots-of-speed",
    name: "Boots of Speed",
    type: "Wondrous Item",
    description:
      "While wearing these boots, you can use a bonus action to double your walking speed and make opportunity attacks against you have disadvantage.",
    magical: true,
    rarity: "Rare",
    requiresAttunement: true,
    cost: { amount: 8000, currency: "gp" },
    weight: 1,
    properties: ["Duration: 10 minutes", "Can't use again for 1 hour"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "+1-longsword",
    name: "+1 Longsword",
    type: "Weapon",
    description: "You have a +1 bonus to attack and damage rolls with this magic weapon.",
    magical: true,
    rarity: "Uncommon",
    requiresAttunement: false,
    cost: { amount: 2000, currency: "gp" },
    weight: 3,
    properties: ["+1 to hit and damage", "Versatile (1d10)", "1d8 slashing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "+2-longsword",
    name: "+2 Longsword",
    type: "Weapon",
    description: "You have a +2 bonus to attack and damage rolls with this magic weapon.",
    magical: true,
    rarity: "Rare",
    requiresAttunement: false,
    cost: { amount: 8000, currency: "gp" },
    weight: 3,
    properties: ["+2 to hit and damage", "Versatile (1d10)", "1d8 slashing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "+3-longsword",
    name: "+3 Longsword",
    type: "Weapon",
    description: "You have a +3 bonus to attack and damage rolls with this magic weapon.",
    magical: true,
    rarity: "Very Rare",
    requiresAttunement: false,
    cost: { amount: 32000, currency: "gp" },
    weight: 3,
    properties: ["+3 to hit and damage", "Versatile (1d10)", "1d8 slashing"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "flame-tongue",
    name: "Flame Tongue",
    type: "Weapon",
    description:
      "You can use a bonus action to speak this sword's command word, causing flames to erupt from the blade. These flames shed bright light in a 40-foot radius and deal an extra 2d6 fire damage.",
    magical: true,
    rarity: "Rare",
    requiresAttunement: true,
    cost: { amount: 10000, currency: "gp" },
    weight: 3,
    properties: ["Longsword", "+2d6 fire damage when activated"],
    source: "Official",
    edition: "Both",
    version: 1,
  },

  // Adventuring Gear
  {
    id: "rope-hemp",
    name: "Rope, Hemp (50 feet)",
    type: "Adventuring Gear",
    description: "Rope has 2 hit points and can be burst with a DC 17 Strength check.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 1, currency: "gp" },
    weight: 10,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "torch",
    name: "Torch",
    type: "Adventuring Gear",
    description:
      "A torch burns for 1 hour, providing bright light in a 20-foot radius and dim light for an additional 20 feet.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 1, currency: "cp" },
    weight: 1,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "backpack",
    name: "Backpack",
    type: "Adventuring Gear",
    description: "A backpack can hold 1 cubic foot or 30 pounds of gear.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 2, currency: "gp" },
    weight: 5,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "bedroll",
    name: "Bedroll",
    type: "Adventuring Gear",
    description: "A sleeping bag for adventurers on the road.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 1, currency: "gp" },
    weight: 7,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "rations",
    name: "Rations (1 day)",
    type: "Adventuring Gear",
    description: "Rations consist of dry foods suitable for extended travel.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 5, currency: "sp" },
    weight: 2,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "waterskin",
    name: "Waterskin",
    type: "Adventuring Gear",
    description: "A waterskin can hold 4 pints of liquid.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 2, currency: "sp" },
    weight: 5,
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "healers-kit",
    name: "Healer's Kit",
    type: "Adventuring Gear",
    description:
      "This kit has ten uses. As an action, you can expend one use to stabilize a creature that has 0 hit points.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 5, currency: "gp" },
    weight: 3,
    properties: ["10 uses"],
    source: "Official",
    edition: "Both",
    version: 1,
  },
  {
    id: "thieves-tools",
    name: "Thieves' Tools",
    type: "Adventuring Gear",
    description:
      "This set of tools includes a small file, lock picks, a small mirror, scissors, and pliers. Proficiency allows you to add your proficiency bonus to checks to disarm traps or open locks.",
    magical: false,
    requiresAttunement: false,
    cost: { amount: 25, currency: "gp" },
    weight: 1,
    source: "Official",
    edition: "Both",
    version: 1,
  },
];
