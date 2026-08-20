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

/**
 * The same feat ships under two names: 2014 calls it "Metamagic Adept", the
 * 2024 rules call it "Metamagic Initiate". Both teach two Metamagic options and
 * hand out 2 Sorcery Points, so every caller matches on the pair rather than on
 * whichever name happened to be typed first.
 */
const METAMAGIC_FEAT_NAMES = ["metamagic adept", "metamagic initiate"];

export function isMetamagicFeat(feat: Feat): boolean {
  return METAMAGIC_FEAT_NAMES.includes(feat.name.trim().toLowerCase());
}

export function hasMetamagicFeat(feats: Feat[]): boolean {
  return feats.some(isMetamagicFeat);
}

export function metamagicChoiceLimit(classId: string, classLevel: number, feats: Feat[]): number {
  const classChoices = classId === "sorcerer" && classLevel >= 2 ? 2 : 0;
  const featChoices = hasMetamagicFeat(feats) ? 2 : 0;
  return classChoices + featChoices;
}

function grantsSorceryPoints(feat: Feat): boolean {
  return (feat.grants ?? []).some(
    (grant) => grant.grantType === "Resource Pool" && grant.resourceName === "Sorcery Points",
  );
}

/**
 * Sorcery Points a character owes to their feats. "Metamagic Adept" carries an
 * explicit Resource Pool grant, but its 2024 twin only promises the points in
 * prose, so the two it describes are added on its behalf. Should that document
 * gain a grant later the fallback stops firing, so the points never double.
 */
export function featSorceryPoints(feats: Feat[]): number {
  const granted = featResourceAmount(feats, "Sorcery Points");
  const ungranted = feats.some((feat) => isMetamagicFeat(feat) && !grantsSorceryPoints(feat)) ? 2 : 0;
  return granted + ungranted;
}
