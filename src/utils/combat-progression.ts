import type { CharacterRuleset, Feat, Item } from "../types/dnd-types";

export function proficiencyBonusAtLevel(level: number): number {
  return 2 + Math.floor((Math.max(1, level) - 1) / 4);
}

export function alertInitiativeBonus(feats: Feat[], ruleset: CharacterRuleset | undefined, level: number): number {
  if (!feats.some((feat) => feat.name.trim().toLowerCase() === "alert")) return 0;
  return ruleset === "2024" ? proficiencyBonusAtLevel(level) : 5;
}

export function monkUnarmoredMovementBonus(monkLevel: number): number {
  if (monkLevel < 2) return 0;
  if (monkLevel >= 18) return 30;
  if (monkLevel >= 14) return 25;
  if (monkLevel >= 10) return 20;
  if (monkLevel >= 6) return 15;
  return 10;
}

export function isWearingArmorOrShield(equipment: Item[]): boolean {
  return equipment.some((item) => item?.type === "Armor");
}

export function walkingSpeed(baseSpeed: number, monkLevel: number, equipment: Item[]): number {
  return baseSpeed + (isWearingArmorOrShield(equipment) ? 0 : monkUnarmoredMovementBonus(monkLevel));
}

export function featResourceAmount(feats: Feat[], resourceName: string): number {
  return feats.flatMap((feat) => feat.grants ?? [])
    .filter((grant) => grant.grantType === "Resource Pool" && grant.resourceName === resourceName)
    .reduce((total, grant) => total + (grant.maxAmount ?? 0), 0);
}

export function classPointAmount(classId: string, classLevel: number): number {
  if (["monk", "sorcerer"].includes(classId) && classLevel < 2) return 0;
  return Math.max(0, classLevel);
}

export function metamagicChoiceLimit(classId: string, classLevel: number, feats: Feat[]): number {
  const classChoices = classId === "sorcerer" && classLevel >= 2 ? 2 : 0;
  const featChoices = feats.some((feat) => feat.name === "Metamagic Adept") ? 2 : 0;
  return classChoices + featChoices;
}
