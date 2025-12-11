// Core D&D Type System for Omni-Archive
// Supports both 2014 and 2024 editions

export type Edition = "2014" | "2024" | "Both" | "5e" | string;
export type Source = "Official" | "Homebrew" | "Unofficial" | string;

// Sanity Image type for CMS images
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

// ===== Ability Scores =====
export type AbilityScore = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";

export interface AbilityScores {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

// ===== Race System =====
export interface Race {
  id: string;
  name: string;
  description: string;
  image?: SanityImage;
  imageUrl?: string;
  source: Source;
  edition: Edition;
  version: number;
  abilityScoreIncrease: Partial<AbilityScores>;
  size: "Tiny" | "Small" | "Medium" | "Large";
  speed: number;
  traits: { name: string; description: string }[];
  languages: string[];
  subraces?: string[]; // IDs of subraces
  racialSpellChoices?: {
    choose: number;
    list: string[]; // List of Spell IDs or "any:classId" or "cantrip:classId"
    school?: string; // Optional school restriction
    level?: number; // Max level (0 for cantrip)
    name: string; // "High Elf Cantrip", "Legacy of Stygia", etc.
  }[];
  racialKnownSpells?: {
    level: number; // Character level required
    spellId: string;
    abilityScore?: AbilityScore; // Casting stat
    type?: "at-will" | "1/day" | "recharge";
    name?: string; // Optional override name
  }[];
}

export interface Subrace {
  id: string;
  parentRaceId: string;
  name: string;
  description: string;
  image?: SanityImage;
  source: Source;
  edition: Edition;
  version: number;
  abilityScoreIncrease: Partial<AbilityScores>;
  traits: { name: string; description: string }[];
  racialSpellChoices?: {
    choose: number;
    list: string[]; // List of Spell IDs or "any:classId" or "cantrip:classId"
    school?: string; // Optional school restriction
    level?: number; // Max level (0 for cantrip)
    name: string; // "High Elf Cantrip", "Legacy of Stygia", etc.
  }[];
  racialKnownSpells?: {
    level: number; // Character level required
    spellId: string;
    abilityScore?: AbilityScore; // Casting stat
    type?: "at-will" | "1/day" | "recharge";
    name?: string; // Optional override name
  }[];
}

// ===== Class System =====
export interface Class {
  id: string;
  name: string;
  description: string;
  image?: SanityImage;
  imageUrl?: string;
  source: Source;
  edition: Edition;
  version: number;
  hitDie: number;
  primaryAbility: AbilityScore[];
  savingThrows: AbilityScore[];
  spellcaster?: "full" | "half" | "third" | "pact" | "special";
  spellcastingAbility?: AbilityScore;
  features: Feature[];
  subclasses: string[]; // IDs of subclasses
}

export interface Feature {
  level: number;
  name: string;
  description: string;
}

export interface ClassFeature extends Feature { }

export interface Subclass {
  id: string;
  parentClassId: string;
  name: string;
  description: string;
  image?: SanityImage;
  imageUrl?: string;
  source: Source;
  edition: Edition;
  version: number;
  features: Feature[];
  spellcaster?: boolean;
  spellcastingAbility?: string;
}

// ===== Background System =====
export interface Background {
  id: string;
  name: string;
  description: string;
  image?: SanityImage;
  imageUrl?: string;
  source: Source;
  edition: Edition;
  version: number;
  skillProficiencies: string[];
  toolProficiencies: string[];
  languages: number;
  equipment: string[];
  feature: {
    name: string;
    description: string;
  };
}

// ===== Spell System =====
export type SpellSchool =
  | "Abjuration"
  | "Conjuration"
  | "Divination"
  | "Enchantment"
  | "Evocation"
  | "Illusion"
  | "Necromancy"
  | "Transmutation";

export interface Spell {
  id: string;
  name: string;
  level: number; // 0 = Cantrip
  school: SpellSchool;
  castingTime: string;
  range: string;
  components: {
    verbal: boolean;
    somatic: boolean;
    material: boolean;
    materialDescription?: string;
  };
  duration: string;
  concentration: boolean;
  ritual: boolean;
  description: string;
  higherLevels?: string;
  classes: string[]; // Class IDs that can cast this spell
  subclasses?: string[]; // Subclass names that can cast this spell
  image?: SanityImage;
  source: Source;
  edition: Edition;
  version: number;
}

// ===== Feat System =====
export interface Feat {
  id: string;
  name: string;
  description: string;
  image?: SanityImage;
  source: Source;
  edition: Edition;
  version: number;
  prerequisites?: {
    level?: number;
    abilityScore?: Partial<AbilityScores>;
    race?: string[];
    class?: string[];
    features?: string[];
  };
  benefits: {
    abilityScoreIncrease?: Partial<AbilityScores>;
    spells?: string[]; // Spell IDs granted by this feat
    features?: string[];
  };
}

// ===== Item System =====
export type ItemRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Very Rare"
  | "Legendary"
  | "Artifact";

export type ItemType =
  | "Weapon"
  | "Armor"
  | "Potion"
  | "Scroll"
  | "Wondrous Item"
  | "Ring"
  | "Rod"
  | "Staff"
  | "Wand"
  | "Adventuring Gear";

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  image?: SanityImage;
  magical: boolean;
  rarity?: ItemRarity;
  requiresAttunement: boolean;
  cost?: {
    amount: number;
    currency: "cp" | "sp" | "ep" | "gp" | "pp";
  };
  weight?: number;
  properties?: string[];
  source: Source;
  edition: Edition;
  version: number;
}

// ===== Character System =====
export interface Character {
  id: string;
  name: string;
  edition: Edition;
  createdAt: Date;
  updatedAt: Date;

  // Core Stats
  race: Race;
  subrace?: Subrace;
  class: Class;
  subclass?: Subclass;
  level: number;
  background: Background;

  // Multiclassing Support
  multiclass?: {
    classId: string;
    subclassId?: string;
    level: number;
  }[];

  // Ability Scores
  abilityScores: AbilityScores;
  abilityScoreModifiers: AbilityScores;

  // Proficiencies
  proficiencyBonus: number;
  savingThrows: AbilityScore[];
  skills: { [key: string]: boolean };
  languages: string[];
  tools: string[];

  // Combat Stats
  armorClass: number;
  initiative: number;
  speed: number;
  hitPoints: {
    max: number;
    current: number;
    temporary: number;
  };
  hitDice: {
    total: number;
    current: number;
    die: number;
  };

  // Features & Traits
  racialTraits: string[];
  classFeatures: string[];
  feats: Feat[];

  // Spellcasting
  spellcasting?: {
    spellcastingAbility: AbilityScore;
    spellSaveDC: number;
    spellAttackBonus: number;
    cantripsKnown: number;
    spellsKnown?: number;
    spellSlots: {
      1: { max: number; current: number };
      2: { max: number; current: number };
      3: { max: number; current: number };
      4: { max: number; current: number };
      5: { max: number; current: number };
      6: { max: number; current: number };
      7: { max: number; current: number };
      8: { max: number; current: number };
      9: { max: number; current: number };
    };
    preparedSpells: Spell[];
    knownSpells: Spell[];
  };

  // Equipment
  equipment: Item[];
  currency: {
    cp: number;
    sp: number;
    ep: number;
    gp: number;
    pp: number;
  };

  // Personality
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  appearance?: string;
  backstory?: string;
}

// ===== Search & Filter Types =====
export interface SearchFilters {
  query: string;
  edition?: Edition;
  source?: Source;
  level?: number;
  school?: SpellSchool;
  class?: string;
  spellcaster?: boolean;
  concentration?: boolean;
  ritual?: boolean;
  components?: ("verbal" | "somatic" | "material")[];
}

// ===== Spell Slot Progression Tables =====
export const SPELL_SLOTS_BY_LEVEL: {
  [key: string]: {
    [level: number]: [number, number, number, number, number, number, number, number, number];
  };
} = {
  full: {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
  },
  half: {
    1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  },
  third: {
    1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    5: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    6: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    7: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    8: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    9: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    10: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    11: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    12: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    13: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    14: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    15: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    16: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    17: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    18: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    19: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    20: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  },
};