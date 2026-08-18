import type { CharacterRuleset, Class } from "../types/dnd-types";

/** The 2014 classes did not all choose subclasses at the same level; 2024 does. */
export function subclassLevelFor(classData: Class, ruleset?: CharacterRuleset): number {
  if (ruleset === "2024") return 3;
  if (["cleric", "sorcerer", "warlock"].includes(classData.id)) return 1;
  if (["druid", "wizard"].includes(classData.id)) return 2;
  return classData.subclassLevel || 3;
}
