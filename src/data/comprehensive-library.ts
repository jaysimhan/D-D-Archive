// Comprehensive D&D 5e Library Data
// This file consolidates and expands all game content

import type {
  Race,
  Subrace,
  Class,
  Subclass,
  Background,
  Spell,
  Feat,
  Item,
  Edition,
  Source
} from "../types/dnd-types";
import { species } from "./mock-races";

// ===== EXPANDED RACES =====
export const RACES: Race[] = species;

// ===== SUBRACES =====
export const SUBRACES: Subrace[] = [
  {
    id: "high-elf",
    parentRaceId: "elf",
    name: "High Elf",
    description: "As a high elf, you have a keen mind and a mastery of at least the basics of magic.",
    source: "Official",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: { INT: 1 },
    traits: ["Elf Weapon Training", "Cantrip", "Extra Language"]
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
    traits: ["Elf Weapon Training", "Fleet of Foot", "Mask of the Wild"]
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
    traits: ["Superior Darkvision", "Sunlight Sensitivity", "Drow Magic", "Drow Weapon Training"]
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
    traits: ["Dwarven Toughness"]
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
    traits: ["Dwarven Armor Training"]
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
    traits: ["Naturally Stealthy"]
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
    traits: ["Stout Resilience"]
  }
];

// ===== EXPANDED BACKGROUNDS =====
export const BACKGROUNDS: Background[] = [
  {
    id: "acolyte",
    name: "Acolyte",
    description: "You have spent your life in the service of a temple to a specific god or pantheon of gods.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Insight", "Religion"],
    toolProficiencies: [],
    languages: 2,
    equipment: ["Holy symbol", "Prayer book", "5 sticks of incense", "Vestments", "Common clothes", "15 gp"],
    feature: {
      name: "Shelter of the Faithful",
      description: "As an acolyte, you command the respect of those who share your faith, and you can perform religious ceremonies. You and your companions can expect free healing and care at temples, shrines, and other establishments."
    }
  },
  {
    id: "criminal",
    name: "Criminal",
    description: "You are an experienced criminal with a history of breaking the law.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Deception", "Stealth"],
    toolProficiencies: ["Thieves' tools", "One type of gaming set"],
    languages: 0,
    equipment: ["Crowbar", "Dark common clothes with hood", "15 gp"],
    feature: {
      name: "Criminal Contact",
      description: "You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact."
    }
  },
  {
    id: "folk-hero",
    name: "Folk Hero",
    description: "You come from a humble social rank, but you are destined for so much more.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Animal Handling", "Survival"],
    toolProficiencies: ["One type of artisan's tools", "Vehicles (land)"],
    languages: 0,
    equipment: ["Artisan's tools", "Shovel", "Iron pot", "Common clothes", "10 gp"],
    feature: {
      name: "Rustic Hospitality",
      description: "Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among other commoners."
    }
  },
  {
    id: "noble",
    name: "Noble",
    description: "You understand wealth, power, and privilege. You carry a noble title, and your family owns land, collects taxes, and wields significant political influence.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["History", "Persuasion"],
    toolProficiencies: ["One type of gaming set"],
    languages: 1,
    equipment: ["Fine clothes", "Signet ring", "Scroll of pedigree", "25 gp"],
    feature: {
      name: "Position of Privilege",
      description: "Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are."
    }
  },
  {
    id: "sage",
    name: "Sage",
    description: "You spent years learning the lore of the multiverse. You scoured manuscripts, studied scrolls, and listened to the greatest experts.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Arcana", "History"],
    toolProficiencies: [],
    languages: 2,
    equipment: ["Bottle of ink", "Quill", "Small knife", "Letter from dead colleague", "Common clothes", "10 gp"],
    feature: {
      name: "Researcher",
      description: "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it."
    }
  },
  {
    id: "soldier",
    name: "Soldier",
    description: "War has been your life for as long as you care to remember. You trained as a youth, studied the use of weapons and armor, and learned basic survival techniques.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Athletics", "Intimidation"],
    toolProficiencies: ["One type of gaming set", "Vehicles (land)"],
    languages: 0,
    equipment: ["Insignia of rank", "Trophy from fallen enemy", "Gaming set", "Common clothes", "10 gp"],
    feature: {
      name: "Military Rank",
      description: "You have a military rank from your career as a soldier. Soldiers loyal to your former military organization still recognize your authority and influence."
    }
  },
  {
    id: "charlatan",
    name: "Charlatan",
    description: "You have always had a way with people. You know what makes them tick, you can tease out their hearts' desires after a few minutes of conversation.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Deception", "Sleight of Hand"],
    toolProficiencies: ["Disguise kit", "Forgery kit"],
    languages: 0,
    equipment: ["Fine clothes", "Disguise kit", "Tools of con", "15 gp"],
    feature: {
      name: "False Identity",
      description: "You have created a second identity that includes documentation, established acquaintances, and disguises."
    }
  },
  {
    id: "entertainer",
    name: "Entertainer",
    description: "You thrive in front of an audience. You know how to entrance them, entertain them, and even inspire them.",
    source: "Official",
    edition: "Both",
    version: 1,
    skillProficiencies: ["Acrobatics", "Performance"],
    toolProficiencies: ["Disguise kit", "One type of musical instrument"],
    languages: 0,
    equipment: ["Musical instrument", "Favor of admirer", "Costume", "15 gp"],
    feature: {
      name: "By Popular Demand",
      description: "You can always find a place to perform. You receive free lodging and food as long as you perform each night."
    }
  }
];

// ===== EXPANDED FEATS =====
export const FEATS: Feat[] = [
  {
    id: "alert",
    name: "Alert",
    description: "Always on the lookout for danger, you gain the following benefits: You can't be surprised while you are conscious. You gain a +5 bonus to initiative. Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {}
  },
  {
    id: "athlete",
    name: "Athlete",
    description: "You have undergone extensive physical training to gain the following benefits.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      abilityScoreIncrease: { STR: 1 },
      features: ["Climbing doesn't cost extra movement", "Running jump distance increases", "Standing from prone costs only 5 feet"]
    }
  },
  {
    id: "lucky",
    name: "Lucky",
    description: "You have inexplicable luck that seems to kick in at just the right moment.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: ["You have 3 luck points", "You can spend a luck point to roll an additional d20 when making an attack roll, ability check, or saving throw"]
    }
  },
  {
    id: "magic-initiate",
    name: "Magic Initiate",
    description: "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips and one 1st-level spell from that class's spell list.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      spells: [],
      features: ["Learn 2 cantrips from chosen class", "Learn one 1st-level spell from chosen class"]
    }
  },
  {
    id: "tough",
    name: "Tough",
    description: "Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: ["Hit point maximum increases by 2 per level"]
    }
  },
  {
    id: "war-caster",
    name: "War Caster",
    description: "You have practiced casting spells in the midst of combat, learning techniques that grant you the following benefits.",
    source: "Official",
    edition: "Both",
    version: 1,
    prerequisites: {
      class: ["wizard", "sorcerer", "cleric", "bard", "druid", "warlock", "artificer", "paladin", "ranger"]
    },
    benefits: {
      features: [
        "Advantage on Constitution saving throws to maintain concentration",
        "Can perform somatic components even with weapons or shield",
        "Can cast spells as opportunity attacks"
      ]
    }
  },
  {
    id: "great-weapon-master",
    name: "Great Weapon Master",
    description: "You've learned to put the weight of a weapon to your advantage, letting its momentum empower your strikes.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "On critical hit or reduce creature to 0 HP, make bonus melee weapon attack",
        "Before making melee attack with heavy weapon, take -5 to attack roll to gain +10 to damage"
      ]
    }
  },
  {
    id: "sharpshooter",
    name: "Sharpshooter",
    description: "You have mastered ranged weapons and can make shots that others find impossible.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Attacking at long range doesn't impose disadvantage",
        "Ranged attacks ignore half cover and three-quarters cover",
        "Before making ranged attack, take -5 to attack roll to gain +10 to damage"
      ]
    }
  },
  {
    id: "sentinel",
    name: "Sentinel",
    description: "You have mastered techniques to take advantage of every drop in any enemy's guard.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Opportunity attacks reduce target's speed to 0",
        "Can make opportunity attacks even if target Disengages",
        "When creature attacks ally, can use reaction to make melee attack"
      ]
    }
  },
  {
    id: "polearm-master",
    name: "Polearm Master",
    description: "You can keep your enemies at bay with reach weapons.",
    source: "Official",
    edition: "Both",
    version: 1,
    benefits: {
      features: [
        "Can make bonus attack with opposite end of weapon",
        "Creatures provoke opportunity attack when entering your reach"
      ]
    }
  }
];

// Export all data
export const LIBRARY_DATA = {
  races: RACES,
  subraces: SUBRACES,
  backgrounds: BACKGROUNDS,
  feats: FEATS
};