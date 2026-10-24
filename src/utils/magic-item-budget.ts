import { Item, ItemRarity } from "../types/dnd-types";

/** Rarities a starting character can hold, lowest first. Artifacts never start in play. */
export const STARTING_RARITIES: ItemRarity[] = ["Common", "Uncommon", "Rare", "Very Rare", "Legendary"];

/** A character can be attuned to no more than three magic items at once. */
export const MAX_ATTUNED_ITEMS = 3;

/** +1 is Uncommon, +2 Rare, +3 Very Rare. */
const BONUS_RARITY: Record<number, number> = { 1: 1, 2: 2, 3: 3 };

/**
 * Magic items one character starts with at each level, as counts of
 * [Common, Uncommon, Rare, Very Rare, Legendary].
 *
 * Drawn from the 2024 DMG's Magic Items Awarded by Level table, which tracks a
 * four-player party: 6/4/1/0/0 over levels 1–4, 10/17/6/1/0 over 5–10,
 * 3/7/11/7/2 over 11–16 and 0/0/5/11/9 over 17–20. Each tier's awards are
 * spread evenly over its levels, totalled up to the character's level and
 * split four ways. Rarities hold back until the campaign's unlock: Common only
 * at level 3, Uncommon from 4, Rare from 5, Very Rare from 11, Legendary from
 * 17, with anything earlier counted at the highest rarity already open.
 */
const BUDGET_BY_LEVEL: Record<number, number[]> = {
    3: [2, 0, 0, 0, 0],
    4: [2, 1, 0, 0, 0],
    5: [2, 1, 1, 0, 0],
    6: [3, 2, 1, 0, 0],
    7: [3, 3, 1, 0, 0],
    8: [3, 4, 1, 0, 0],
    9: [4, 4, 2, 0, 0],
    10: [4, 5, 2, 0, 0],
    11: [4, 6, 2, 1, 0],
    12: [4, 6, 3, 1, 0],
    13: [4, 6, 4, 1, 0],
    14: [4, 6, 4, 2, 0],
    15: [5, 7, 4, 2, 0],
    16: [5, 7, 4, 3, 0],
    17: [5, 7, 4, 3, 1],
    18: [5, 7, 5, 3, 2],
    19: [5, 7, 5, 4, 2],
    20: [5, 7, 5, 5, 3],
};

/** How many magic items of each rarity a character of this level starts with. */
export function magicItemBudget(level: number): number[] {
    if (level < 3) return [0, 0, 0, 0, 0];
    return BUDGET_BY_LEVEL[Math.min(level, 20)];
}

/** The index of the rarest item this budget allows, or -1 when it allows none. */
export function highestRarity(budget: number[]): number {
    return budget.reduce((highest, count, rank) => (count > 0 ? rank : highest), -1);
}

/**
 * Where an item sits in STARTING_RARITIES. An item with no rarity on record is
 * judged by its +N bonus, else counted as Common; an Artifact is out of reach.
 */
export function rarityRank(item: Item): number {
    if (item.rarity) {
        const rank = STARTING_RARITIES.indexOf(item.rarity);
        return rank === -1 ? Infinity : rank;
    }
    return item.magicBonus ? BONUS_RARITY[item.magicBonus] ?? Infinity : 0;
}

/** The highest +N bonus this budget's rarities reach, or 0. */
export function highestBonus(budget: number[]): number {
    const cap = highestRarity(budget);
    return Math.max(0, ...Object.entries(BONUS_RARITY).filter(([, rank]) => rank <= cap).map(([bonus]) => Number(bonus)));
}

/**
 * Whether these items fit the budget. A slot of one rarity can hold an item of
 * a lower rarity, so each rarity is checked against every slot at or above it.
 */
export function fitsBudget(items: Item[], budget: number[]): boolean {
    const ranks = items.map(rarityRank);
    for (let rank = budget.length - 1; rank >= 0; rank--) {
        const slots = budget.slice(rank).reduce((sum, count) => sum + count, 0);
        if (ranks.filter((r) => r >= rank).length > slots) return false;
    }
    return ranks.every((r) => r < budget.length);
}
