import { AbilityScores, Character, Class, SPELL_SLOTS_BY_LEVEL } from "../types/dnd-types";

// Calculate ability score modifier
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Calculate proficiency bonus based on level
export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

// Calculate all ability modifiers from scores
export function calculateAbilityModifiers(scores: AbilityScores): AbilityScores {
  return {
    STR: getAbilityModifier(scores.STR),
    DEX: getAbilityModifier(scores.DEX),
    CON: getAbilityModifier(scores.CON),
    INT: getAbilityModifier(scores.INT),
    WIS: getAbilityModifier(scores.WIS),
    CHA: getAbilityModifier(scores.CHA),
  };
}

// Standard array for ability scores
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

// Point buy costs
export const POINT_BUY_COSTS: { [key: number]: number } = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

// Calculate spell save DC
export function calculateSpellSaveDC(
  spellcastingModifier: number,
  proficiencyBonus: number
): number {
  return 8 + proficiencyBonus + spellcastingModifier;
}

// Calculate spell attack bonus
export function calculateSpellAttackBonus(
  spellcastingModifier: number,
  proficiencyBonus: number
): number {
  return proficiencyBonus + spellcastingModifier;
}

// Get spell slots for a given class level
export function getSpellSlots(
  classData: Class,
  level: number
): {
  1: { max: number; current: number };
  2: { max: number; current: number };
  3: { max: number; current: number };
  4: { max: number; current: number };
  5: { max: number; current: number };
  6: { max: number; current: number };
  7: { max: number; current: number };
  8: { max: number; current: number };
  9: { max: number; current: number };
} {
  if (!classData.spellcaster) {
    return {
      1: { max: 0, current: 0 },
      2: { max: 0, current: 0 },
      3: { max: 0, current: 0 },
      4: { max: 0, current: 0 },
      5: { max: 0, current: 0 },
      6: { max: 0, current: 0 },
      7: { max: 0, current: 0 },
      8: { max: 0, current: 0 },
      9: { max: 0, current: 0 },
    };
  }

  const slots = SPELL_SLOTS_BY_LEVEL[classData.spellcaster][level] || [
    0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];

  return {
    1: { max: slots[0], current: slots[0] },
    2: { max: slots[1], current: slots[1] },
    3: { max: slots[2], current: slots[2] },
    4: { max: slots[3], current: slots[3] },
    5: { max: slots[4], current: slots[4] },
    6: { max: slots[5], current: slots[5] },
    7: { max: slots[6], current: slots[6] },
    8: { max: slots[7], current: slots[7] },
    9: { max: slots[8], current: slots[8] },
  };
}

// Calculate max hit points
export function calculateMaxHP(
  classData: Class,
  level: number,
  conModifier: number
): number {
  // First level: max hit die + CON modifier
  // Additional levels: average of hit die + CON modifier per level
  const firstLevelHP = classData.hitDie + conModifier;
  const additionalLevelsHP = (level - 1) * (Math.floor(classData.hitDie / 2) + 1 + conModifier);
  return Math.max(1, firstLevelHP + additionalLevelsHP);
}

// Calculate initiative
export function calculateInitiative(dexModifier: number): number {
  return dexModifier;
}

// Get max spell level available to a character
export function getMaxSpellLevel(classData: Class, level: number): number {
  if (!classData.spellcaster) {
    return 0;
  }

  const spellSlots = SPELL_SLOTS_BY_LEVEL[classData.spellcaster][level];
  if (!spellSlots) return 0;

  // Find the highest spell level with at least 1 slot
  for (let i = spellSlots.length - 1; i >= 0; i--) {
    if (spellSlots[i] > 0) {
      return i + 1;
    }
  }

  return 0;
}

// Validate ability score total for point buy
export function calculatePointBuyCost(scores: Partial<AbilityScores>): number {
  let total = 0;
  Object.values(scores).forEach((score) => {
    if (score !== undefined && score >= 8 && score <= 15) {
      total += POINT_BUY_COSTS[score];
    }
  });
  return total;
}

// Apply racial bonuses to ability scores
export function applyRacialBonuses(
  baseScores: AbilityScores,
  racialBonuses: Partial<AbilityScores>
): AbilityScores {
  return {
    STR: baseScores.STR + (racialBonuses.STR || 0),
    DEX: baseScores.DEX + (racialBonuses.DEX || 0),
    CON: baseScores.CON + (racialBonuses.CON || 0),
    INT: baseScores.INT + (racialBonuses.INT || 0),
    WIS: baseScores.WIS + (racialBonuses.WIS || 0),
    CHA: baseScores.CHA + (racialBonuses.CHA || 0),
  };
}
