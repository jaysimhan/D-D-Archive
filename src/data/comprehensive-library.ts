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

import { RACES } from "./races";
import { CLASSES } from "./classes";
import { SUBCLASSES } from "./subclasses";
import { BACKGROUNDS } from "./backgrounds";
import { FEATS } from "./feats";
import { ITEMS } from "./items";
import { SPELLS } from "./spells";

// Re-exporting from unified files
export { RACES, CLASSES, SUBCLASSES, BACKGROUNDS, FEATS, ITEMS, SPELLS };


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



// ===== EXPANDED FEATS =====


// Export all data
export const LIBRARY_DATA = {
  races: RACES,
  subraces: SUBRACES,
  backgrounds: BACKGROUNDS,
  feats: FEATS
};