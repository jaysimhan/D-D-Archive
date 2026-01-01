// Core D&D Type System for Omni-Archive
// Supports both 2014 and 2024 editions

export type Edition = "2014" | "2024" | "Both" | "5e" | string;
export type Source = "Official" | "Homebrew" | "Unofficial" | string;

// Sanity Image asset with metadata for optimized loading
export interface SanityImageAsset {
  _id?: string;
  _ref?: string;
  _type?: 'reference';
  url?: string;
  metadata?: {
    lqip?: string; // Low Quality Image Placeholder (base64)
    dimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
  };
}

// Sanity Image type for CMS images
export interface SanityImage {
  _type: 'image';
  asset: SanityImageAsset;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
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
export interface ProficiencyRule {
  type: 'skill' | 'tool' | 'language' | 'armor' | 'weapon' | 'savingThrow';
  mode: 'fixed' | 'choice';
  count?: number;
  // Options now split by type in schema, but we can unify types here or list them all
  options?: string[]; // Legacy/Generic
  skillOptions?: string[];
  toolOptions?: string[];
  languageOptions?: string[];
  armorOptions?: string[];
  weaponOptions?: string[];
  description?: string;
}

export interface SpellGrant {
  name?: string;
  level: number;
  mode: 'fixed' | 'choice' | 'access';
  count?: number;
  spellList?: string; // e.g. "wizard"
  specificSpells?: Spell[]; // Expanded objects
  ability?: 'INT' | 'WIS' | 'CHA' | 'CON';
  recharge?: 'at-will' | 'short-rest' | 'long-rest' | 'day';
  spellLevel?: number; // New
  notes?: string; // New
}

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
  flexibleAbilityScores?: boolean;
  size: "Tiny" | "Small" | "Medium" | "Large";
  speed: number;
  traits: { name: string; description: string }[];
  languages: string[];
  subraces?: string[]; // IDs of subraces
  proficiencies?: ProficiencyRule[];
  isSpellcaster?: boolean;
  spells?: SpellGrant[];
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
  proficiencies?: ProficiencyRule[];
  spells?: SpellGrant[];
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
  proficiencies?: ProficiencyRule[];
  spells?: SpellGrant[];
  spellcaster?: "full" | "half" | "half-up" | "third" | "pact" | "special" | "None" | "none";
  isSpellcaster?: boolean;
  spellcastingAbility?: AbilityScore;
  features: Feature[];
  traits?: { name: string; description: string }[];
  subclasses: Subclass[]; // Auto-detected from Subclass.parentClassId
  subclassLevel?: number; // Level at which subclass is selected (1-3)
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
  traits?: { name: string; description: string }[];
  proficiencies?: ProficiencyRule[];
  isSpellcaster?: boolean;
  spellcaster?: boolean; // Deprecated
  spellcastingAbility?: string;
  magicType?: string;
  magicAbility?: string;
  magicDescription?: string;
  spells?: SpellGrant[];
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
  proficiencies?: ProficiencyRule[]; // New unified field
  traits?: { name: string; description: string }[];
  languages: number; // Count of extra languages
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
  proficiencies?: ProficiencyRule[];
  spells?: SpellGrant[];
  benefits: {
    abilityScoreIncrease?: Partial<AbilityScores>;
    flexibleAbilityIncrease?: {
      amount: number;
      options: AbilityScore[];
    };
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
  | "Tool"
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
  magicBonus?: number;
  rarity?: ItemRarity;
  requiresAttunement: boolean;
  cost?: {
    amount: number;
    currency: "cp" | "sp" | "ep" | "gp" | "pp";
  };
  weight?: number;
  toolCategory?: string;
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
  proficiencies?: ProficiencyRule[];
  spells?: SpellGrant[];
  racialTraits: string[]; // This was `traits` in the diff, but `racialTraits` is more specific for Character
  classFeatures: string[];
  feats: Feat[];

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
  // Item specific
  minCost?: number;
  maxCost?: number;
  minWeight?: number;
  maxWeight?: number;
  itemCategory?: "Equipment" | "Magic Items";
  // Magic Item specific
  magicBonus?: number; // 1, 2, 3
  rarity?: string;
  attunement?: boolean; // undefined = all, true = yes, false = no
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

// ===== Homepage System =====
export interface HeroTitleLine {
  text: string;
  fontSize: string;
  letterSpacing: string;
  style: "default" | "glow" | "gradient" | string;
}

export interface HomepageData {
  title?: string; // Deprecated
  heroTitleLine1?: HeroTitleLine;
  heroTitleLine2?: HeroTitleLine;
  subtitle: string;
  heroImage?: SanityImage;
  features?: {
    title: string;
    description: string;
    icon: string;
  }[];
  footer?: {
    text: string;
    disclaimer: string;
    credits: string;
  };
}