import type { CharacterData } from "../types/character-creator";
import type { AbilityScore, AbilityScores } from "../types/dnd-types";
import { featAbilityBonuses } from "./feats";

const POINT_BUY_COST: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};

export const POINT_BUY_BUDGET = 27;

export function pointBuyCost(scores: AbilityScores): number {
  return Object.values(scores).reduce((total, score) => total + (POINT_BUY_COST[score] ?? 99), 0);
}

export function isValidPointBuy(scores: AbilityScores): boolean {
  return Object.values(scores).every((score) => score >= 8 && score <= 15) && pointBuyCost(scores) <= POINT_BUY_BUDGET;
}

/**
 * How the six base scores are generated. The first three are the Handbook's
 * own methods, identical under 2014 and 2024; manual entry is for a table that
 * rolled in person or plays by its own rules.
 */
export type AbilityScoreMethod = "standard" | "pointBuy" | "rolled" | "manual";

export const ABILITY_SCORE_METHODS: { value: AbilityScoreMethod; label: string; description: string }[] = [
  { value: "standard", label: "Standard Array", description: "Assign 15, 14, 13, 12, 10 and 8, one to each ability." },
  { value: "pointBuy", label: "Point Buy", description: "Spend 27 points on scores from 8 to 15." },
  { value: "rolled", label: "Rolled", description: "Roll 4d6 six times, drop the lowest die each time, and assign the totals." },
  { value: "manual", label: "Manual", description: "Type in any score from 3 to 18." },
];

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
export const MANUAL_MIN = 3;
export const MANUAL_MAX = 18;

/** Which entry of the pool each ability took, by position — two rolls can tie. */
export type ScoreAssignment = Partial<Record<AbilityScore, number>>;

const ABILITY_ORDER: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/** Base scores from a pool and its assignment; anything unassigned sits at 8 until it is. */
export function scoresFromAssignment(pool: number[], assignment: ScoreAssignment): AbilityScores {
  const scores = {} as AbilityScores;
  for (const ability of ABILITY_ORDER) {
    const index = assignment[ability];
    scores[ability] = index !== undefined && pool[index] !== undefined ? pool[index] : 8;
  }
  return scores;
}

/** Whether the base scores are finished under the method the player chose. */
export function abilityScoresReady(
  character: Pick<CharacterData, "abilityScores" | "abilityScoreMethod" | "abilityScoreAssignment" | "rolledAbilityScores">,
): boolean {
  const assignment = character.abilityScoreAssignment ?? {};
  const fullyAssigned = (pool: number[]) =>
    ABILITY_ORDER.every((ability) => pool[assignment[ability] ?? -1] !== undefined);

  switch (character.abilityScoreMethod ?? "pointBuy") {
    case "standard":
      return fullyAssigned(STANDARD_ARRAY);
    case "rolled":
      return (character.rolledAbilityScores?.length ?? 0) === 6 && fullyAssigned(character.rolledAbilityScores!);
    case "manual":
      return Object.values(character.abilityScores).every((score) => score >= MANUAL_MIN && score <= MANUAL_MAX);
    case "pointBuy":
      return isValidPointBuy(character.abilityScores);
  }
}

export function finalAbilityScores(
  character: Pick<
    CharacterData,
    "abilityScores" | "race" | "subrace" | "racialBonusAllocation" | "feats" | "featAbilityChoices"
  > & { ruleset?: "2014" | "2024" },
): AbilityScores {
  const result = { ...character.abilityScores };
  const abilities = Object.keys(result) as AbilityScore[];
  const flexible = character.ruleset === "2024" || character.race?.flexibleAbilityScores === true;
  // Half feats carry both a printed increase and one the character placed
  // themselves, and both have to land before the sheet reads a modifier.
  const fromFeats = featAbilityBonuses(character.feats ?? [], character.featAbilityChoices);

  for (const ability of abilities) {
    result[ability] += flexible
      ? character.racialBonusAllocation?.[ability] ?? 0
      : (character.race?.abilityScoreIncrease?.[ability] ?? 0) +
        (character.subrace?.abilityScoreIncrease?.[ability] ?? 0);
    result[ability] += fromFeats[ability];
  }
  return result;
}
