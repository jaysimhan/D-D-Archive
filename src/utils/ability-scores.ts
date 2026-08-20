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

export function finalAbilityScores(
  character: Pick<
    CharacterData,
    "abilityScores" | "race" | "subrace" | "racialBonusAllocation" | "feats" | "featAbilityChoices"
  >,
): AbilityScores {
  const result = { ...character.abilityScores };
  const abilities = Object.keys(result) as AbilityScore[];
  const flexible = character.race?.flexibleAbilityScores === true;
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
