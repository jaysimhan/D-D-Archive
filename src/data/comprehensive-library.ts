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
import { extraRaces } from "./extra-races";
import { MOCK_FEATS } from "./mock-feats";

// ===== EXPANDED RACES =====
export const RACES: Race[] = [...species, ...extraRaces];

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
    traits: [
      { name: "Elf Weapon Training", description: "Proficiency with longsword, shortsword, shortbow, longbow" },
      { name: "Cantrip", description: "One wizard cantrip of your choice" },
      { name: "Extra Language", description: "One additional language" },
    ],
    racialSpellChoices: [
      {
        choose: 1,
        list: ["cantrip:wizard"],
        name: "High Elf Cantrip"
      }
    ]
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
    traits: [
      { name: "Elf Weapon Training", description: "Proficiency with longsword, shortsword, shortbow, longbow" },
      { name: "Fleet of Foot", description: "Base speed 35 ft." },
      { name: "Mask of the Wild", description: "Hide in light natural phenomena" },
    ]
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
    traits: [
      { name: "Superior Darkvision", description: "120 ft." },
      { name: "Sunlight Sensitivity", description: "Disadvantage in bright light" },
      { name: "Drow Magic", description: "Dancing lights cantrip, faerie fire, darkness" },
      { name: "Drow Weapon Training", description: "Proficiency with rapiers, shortswords, and hand crossbows" },
    ]
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
    traits: [{ name: "Dwarven Toughness", description: "+1 HP per level" }]
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
    traits: [{ name: "Dwarven Armor Training", description: "Proficiency with light and medium armor" }]
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
    traits: [{ name: "Naturally Stealthy", description: "Hide behind creatures one size larger" }]
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
    traits: [{ name: "Stout Resilience", description: "Advantage on saves against poison, resistance to poison damage" }]
  },
  {
    id: "half-elf-standard",
    parentRaceId: "half-elf",
    name: "Half-Elf (Standard)",
    description: "The most common versatility of half-elves.",
    source: "Player's Handbook",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: {},
    traits: [
      { name: "Skill Versatility", description: "You gain proficiency in two skills of your choice." }
    ]
  },
  {
    id: "half-elf-high-variant",
    parentRaceId: "half-elf",
    name: "Half-Elf (High Elf Descent)",
    description: "Some half-elves have a stronger connection to their high elf heritage.",
    source: "SCAG / PHB",
    edition: "Both",
    version: 1,
    abilityScoreIncrease: {},
    traits: [
      { name: "High Elf Descent", description: "You know one wizard cantrip of your choice. Intelligence is your spellcasting ability for it." }
    ],
    racialSpellChoices: [
      {
        choose: 1,
        list: ["cantrip:wizard"],
        name: "High Elf Descent"
      }
    ]
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
// ===== EXPANDED FEATS =====
export const FEATS: Feat[] = MOCK_FEATS;

// Export all data
export const LIBRARY_DATA = {
  races: RACES,
  subraces: SUBRACES,
  backgrounds: BACKGROUNDS,
  feats: FEATS
};