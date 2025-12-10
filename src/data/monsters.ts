// Monster Database for D&D Omni-Archive
import type { Source, Edition, AbilityScore } from "../types/dnd-types";

export type MonsterSize = "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";
export type MonsterType = "Aberration" | "Beast" | "Celestial" | "Construct" | "Dragon" | "Elemental" | "Fey" | "Fiend" | "Giant" | "Humanoid" | "Monstrosity" | "Ooze" | "Plant" | "Undead";
export type Alignment = "LG" | "NG" | "CG" | "LN" | "N" | "CN" | "LE" | "NE" | "CE" | "Unaligned";

export interface Monster {
  id: string;
  name: string;
  size: MonsterSize;
  type: MonsterType;
  alignment: Alignment;
  armorClass: number;
  hitPoints: number;
  hitDice: string;
  speed: {
    walk?: number;
    fly?: number;
    swim?: number;
    burrow?: number;
    climb?: number;
  };
  abilityScores: {
    STR: number;
    DEX: number;
    CON: number;
    INT: number;
    WIS: number;
    CHA: number;
  };
  savingThrows?: Partial<Record<AbilityScore, number>>;
  skills?: { [key: string]: number };
  damageResistances?: string[];
  damageImmunities?: string[];
  conditionImmunities?: string[];
  senses?: { [key: string]: number };
  languages?: string[];
  challengeRating: number;
  experiencePoints: number;
  traits?: { name: string; description: string }[];
  actions?: { name: string; description: string }[];
  reactions?: { name: string; description: string }[];
  legendaryActions?: { name: string; description: string }[];
  lairActions?: { name: string; description: string }[];
  source: Source;
  edition: Edition;
  version: number;
}

export const MONSTERS: Monster[] = [
  {
    id: "goblin",
    name: "Goblin",
    size: "Small",
    type: "Humanoid",
    alignment: "NE",
    armorClass: 15,
    hitPoints: 7,
    hitDice: "2d6",
    speed: { walk: 30 },
    abilityScores: {
      STR: 8,
      DEX: 14,
      CON: 10,
      INT: 10,
      WIS: 8,
      CHA: 8
    },
    skills: { Stealth: 6 },
    senses: { Darkvision: 60 },
    languages: ["Common", "Goblin"],
    challengeRating: 0.25,
    experiencePoints: 50,
    traits: [
      {
        name: "Nimble Escape",
        description: "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
      }
    ],
    actions: [
      {
        name: "Scimitar",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."
      },
      {
        name: "Shortbow",
        description: "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ],
    source: "Official",
    edition: "Both",
    version: 1
  },
  {
    id: "ancient-red-dragon",
    name: "Ancient Red Dragon",
    size: "Gargantuan",
    type: "Dragon",
    alignment: "CE",
    armorClass: 22,
    hitPoints: 546,
    hitDice: "28d20 + 252",
    speed: { walk: 40, climb: 40, fly: 80 },
    abilityScores: {
      STR: 30,
      DEX: 10,
      CON: 29,
      INT: 18,
      WIS: 15,
      CHA: 23
    },
    savingThrows: { DEX: 7, CON: 16, WIS: 9, CHA: 13 },
    skills: { Perception: 16, Stealth: 7 },
    damageImmunities: ["Fire"],
    senses: { Blindsight: 60, Darkvision: 120 },
    languages: ["Common", "Draconic"],
    challengeRating: 24,
    experiencePoints: 62000,
    traits: [
      {
        name: "Legendary Resistance (3/Day)",
        description: "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        description: "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        name: "Bite",
        description: "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage plus 14 (4d6) fire damage."
      },
      {
        name: "Fire Breath (Recharge 5-6)",
        description: "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one."
      }
    ],
    legendaryActions: [
      {
        name: "Detect",
        description: "The dragon makes a Wisdom (Perception) check."
      },
      {
        name: "Tail Attack",
        description: "The dragon makes a tail attack."
      },
      {
        name: "Wing Attack (Costs 2 Actions)",
        description: "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone."
      }
    ],
    source: "Official",
    edition: "Both",
    version: 1
  },
  {
    id: "beholder",
    name: "Beholder",
    size: "Large",
    type: "Aberration",
    alignment: "LE",
    armorClass: 18,
    hitPoints: 180,
    hitDice: "19d10 + 76",
    speed: { walk: 0, fly: 20 },
    abilityScores: {
      STR: 10,
      DEX: 14,
      CON: 18,
      INT: 17,
      WIS: 15,
      CHA: 17
    },
    savingThrows: { INT: 8, WIS: 7, CHA: 8 },
    skills: { Perception: 12 },
    conditionImmunities: ["Prone"],
    senses: { Darkvision: 120 },
    languages: ["Deep Speech", "Undercommon"],
    challengeRating: 13,
    experiencePoints: 10000,
    traits: [
      {
        name: "Antimagic Cone",
        description: "The beholder's central eye creates an area of antimagic, as in the antimagic field spell, in a 150-foot cone."
      }
    ],
    actions: [
      {
        name: "Bite",
        description: "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 14 (4d6) piercing damage."
      },
      {
        name: "Eye Rays",
        description: "The beholder shoots three of the following magical eye rays at random, choosing three different targets it can see within 120 feet."
      }
    ],
    legendaryActions: [
      {
        name: "Eye Ray",
        description: "The beholder uses one random eye ray."
      }
    ],
    source: "Official",
    edition: "Both",
    version: 1
  },
  {
    id: "owlbear",
    name: "Owlbear",
    size: "Large",
    type: "Monstrosity",
    alignment: "Unaligned",
    armorClass: 13,
    hitPoints: 59,
    hitDice: "7d10 + 21",
    speed: { walk: 40 },
    abilityScores: {
      STR: 20,
      DEX: 12,
      CON: 17,
      INT: 3,
      WIS: 12,
      CHA: 7
    },
    skills: { Perception: 3 },
    senses: { Darkvision: 60 },
    languages: [],
    challengeRating: 3,
    experiencePoints: 700,
    traits: [
      {
        name: "Keen Sight and Smell",
        description: "The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell."
      }
    ],
    actions: [
      {
        name: "Multiattack",
        description: "The owlbear makes two attacks: one with its beak and one with its claws."
      },
      {
        name: "Beak",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10 + 5) piercing damage."
      },
      {
        name: "Claws",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) slashing damage."
      }
    ],
    source: "Official",
    edition: "Both",
    version: 1
  },
  {
    id: "gelatinous-cube",
    name: "Gelatinous Cube",
    size: "Large",
    type: "Ooze",
    alignment: "Unaligned",
    armorClass: 6,
    hitPoints: 84,
    hitDice: "8d10 + 40",
    speed: { walk: 15 },
    abilityScores: {
      STR: 14,
      DEX: 3,
      CON: 20,
      INT: 1,
      WIS: 6,
      CHA: 1
    },
    conditionImmunities: ["Blinded", "Charmed", "Deafened", "Exhaustion", "Frightened", "Prone"],
    senses: { Blindsight: 60 },
    languages: [],
    challengeRating: 2,
    experiencePoints: 450,
    traits: [
      {
        name: "Ooze Cube",
        description: "The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the saving throw."
      },
      {
        name: "Transparent",
        description: "Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked."
      }
    ],
    actions: [
      {
        name: "Pseudopod",
        description: "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) acid damage."
      },
      {
        name: "Engulf",
        description: "The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Dexterity saving throw."
      }
    ],
    source: "Official",
    edition: "Both",
    version: 1
  },
  {
    id: "mindflayer",
    name: "Mind Flayer",
    size: "Medium",
    type: "Aberration",
    alignment: "LE",
    armorClass: 15,
    hitPoints: 71,
    hitDice: "13d8 + 13",
    speed: { walk: 30 },
    abilityScores: {
      STR: 11,
      DEX: 12,
      CON: 12,
      INT: 19,
      WIS: 17,
      CHA: 17
    },
    savingThrows: { INT: 7, WIS: 6, CHA: 6 },
    skills: { Arcana: 7, Deception: 6, Insight: 6, Perception: 6, Persuasion: 6, Stealth: 4 },
    senses: { Darkvision: 120 },
    languages: ["Deep Speech", "Undercommon", "Telepathy 120 ft."],
    challengeRating: 7,
    experiencePoints: 2900,
    traits: [
      {
        name: "Magic Resistance",
        description: "The mind flayer has advantage on saving throws against spells and other magical effects."
      },
      {
        name: "Innate Spellcasting (Psionics)",
        description: "The mind flayer's innate spellcasting ability is Intelligence (spell save DC 15). It can innately cast the following spells, requiring no components: At will: detect thoughts, levitate. 1/day each: dominate monster, plane shift (self only)."
      }
    ],
    actions: [
      {
        name: "Tentacles",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 15 (2d10 + 4) psychic damage. If the target is Medium or smaller, it is grappled (escape DC 15) and must succeed on a DC 15 Intelligence saving throw or be stunned until this grapple ends."
      },
      {
        name: "Extract Brain",
        description: "Melee Weapon Attack: +7 to hit, reach 5 ft., one incapacitated humanoid grappled by the mind flayer. Hit: The target takes 55 (10d10) piercing damage. If this damage reduces the target to 0 hit points, the mind flayer kills the target by extracting and devouring its brain."
      },
      {
        name: "Mind Blast (Recharge 5-6)",
        description: "The mind flayer magically emits psychic energy in a 60-foot cone. Each creature in that area must succeed on a DC 15 Intelligence saving throw or take 22 (4d8 + 4) psychic damage and be stunned for 1 minute."
      }
    ],
    source: "Official",
    edition: "Both",
    version: 1
  }
];
