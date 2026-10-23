import type { CharacterRuleset, Class, Subclass } from "../types/dnd-types";

/**
 * How many spells a class picks at each level, levels 1-20, under each ruleset.
 *
 * The Archive's class documents say what kind of caster a class is but not its
 * tables, so the Handbook columns live here: cantrips known, spells known or
 * prepared, and the highest spell level the class's slots reach. Homebrew
 * classes fall back on the column their caster type would have.
 */

type Table = readonly number[];

/** One entry per level, 1-20. */
const at = (table: Table, level: number) => table[Math.min(20, Math.max(1, level)) - 1] ?? 0;

/** Cantrips known: the count at level 1, plus one at each listed level. */
const CANTRIP_STEPS: Record<string, { base: number; steps: number[] }> = {
    bard: { base: 2, steps: [4, 10] },
    cleric: { base: 3, steps: [4, 10] },
    druid: { base: 2, steps: [4, 10] },
    sorcerer: { base: 4, steps: [4, 10] },
    warlock: { base: 2, steps: [4, 10] },
    wizard: { base: 3, steps: [4, 10] },
    artificer: { base: 2, steps: [10, 14] },
    warmage: { base: 4, steps: [4, 10] },
};

/** Subclasses that bring spellcasting to a martial class, from level 3. */
const THIRD_CASTER_CANTRIPS: Record<string, { base: number; steps: number[] }> = {
    "eldritch-knight": { base: 2, steps: [10] },
    "arcane-trickster": { base: 3, steps: [10] },
};

// Spells known (2014) — the classes that learn a fixed list.
const KNOWN_2014: Record<string, Table> = {
    bard: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
    sorcerer: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
    warlock: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    ranger: [0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
};

// Prepared spells (2024) — every class prepares a fixed number.
const FULL_2024: Table = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
const HALF_2024: Table = [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15];
const PREPARED_2024: Record<string, Table> = {
    bard: FULL_2024,
    cleric: FULL_2024,
    druid: FULL_2024,
    sorcerer: [2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22],
    warlock: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
    wizard: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25],
    paladin: HALF_2024,
    ranger: HALF_2024,
    artificer: HALF_2024,
};

/** Eldritch Knight and Arcane Trickster, identical in both rulesets. */
const THIRD_CASTER_KNOWN: Table = [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13];

/** 2014 classes that prepare from their whole list: a level-based count plus their modifier. */
const PREPARED_2014: Record<string, "full" | "half"> = {
    cleric: "full",
    druid: "full",
    wizard: "full",
    paladin: "half",
    artificer: "half",
};

export type CasterType = "full" | "half" | "half-up" | "third" | "pact" | "none";

export function casterTypeOf(classData: Class, subclass?: Subclass): CasterType {
    const type = String(classData.spellcaster ?? "").toLowerCase();
    if (["full", "half", "half-up", "third", "pact"].includes(type)) return type as CasterType;
    if (subclass?.isSpellcaster || subclass?.spellcaster) return "third";
    return classData.isSpellcaster ? "full" : "none";
}

/** The highest level of spell the class's own slots can cast. */
export function maxSpellLevel(type: CasterType, level: number, ruleset?: CharacterRuleset): number {
    switch (type) {
        case "full":
            return Math.min(9, Math.ceil(level / 2));
        case "half":
            // 2014 Paladins and Rangers cast from level 2; the 2024 ones from level 1.
            if (ruleset !== "2024" && level < 2) return 0;
            return Math.min(5, Math.ceil(Math.ceil(level / 2) / 2));
        case "half-up":
            return Math.min(5, Math.ceil(Math.ceil(level / 2) / 2));
        case "third":
            if (level < 3) return 0;
            return level >= 19 ? 4 : level >= 13 ? 3 : level >= 7 ? 2 : 1;
        case "pact":
            return Math.min(5, Math.ceil(level / 2));
        default:
            return 0;
    }
}

function steppedCount(entry: { base: number; steps: number[] }, level: number): number {
    return entry.base + entry.steps.filter((step) => level >= step).length;
}

export function cantripsKnown(classData: Class, level: number, subclass?: Subclass): number {
    const type = casterTypeOf(classData, subclass);
    if (type === "third") {
        const entry = subclass && THIRD_CASTER_CANTRIPS[subclass.id];
        if (level < 3) return 0;
        return entry ? steppedCount(entry, level) : 2;
    }
    const entry = CANTRIP_STEPS[classData.id];
    if (entry) return steppedCount(entry, level);
    // A homebrew class takes the column of its caster type.
    if (type === "full") return steppedCount({ base: 3, steps: [4, 10] }, level);
    if (type === "pact") return steppedCount({ base: 2, steps: [4, 10] }, level);
    if (type === "half-up") return steppedCount({ base: 2, steps: [10, 14] }, level);
    return 0;
}

/**
 * Levelled spells the class picks: spells known, or spells prepared. A 2014
 * Cleric, Druid, Wizard, Paladin or Artificer prepares their level (or half
 * of it) plus their spellcasting modifier, so that modifier is needed.
 */
export function leveledSpellCount(
    classData: Class,
    level: number,
    ruleset: CharacterRuleset | undefined,
    spellcastingModifier: number,
    subclass?: Subclass,
): number {
    const type = casterTypeOf(classData, subclass);
    if (type === "none" || maxSpellLevel(type, level, ruleset) === 0) return 0;
    if (type === "third") return at(THIRD_CASTER_KNOWN, level);

    if (ruleset === "2024") {
        const table = PREPARED_2024[classData.id];
        if (table) return at(table, level);
    } else {
        const known = KNOWN_2014[classData.id];
        if (known) return at(known, level);
        const prepared = PREPARED_2014[classData.id];
        if (prepared) {
            const base = prepared === "full" ? level : Math.floor(level / 2);
            return Math.max(1, base + spellcastingModifier);
        }
    }

    // Homebrew: the 2024 column for its caster type.
    if (type === "full") return at(FULL_2024, level);
    if (type === "pact") return at(PREPARED_2024.warlock, level);
    return at(HALF_2024, level);
}

/** Warlock Mystic Arcanum: one spell each of levels 6-9, learned at 11, 13, 15 and 17. */
export function mysticArcanumLevels(classData: Class, level: number): number[] {
    if (classData.id !== "warlock") return [];
    return [[11, 6], [13, 7], [15, 8], [17, 9]]
        .filter(([classLevel]) => level >= classLevel)
        .map(([, spellLevel]) => spellLevel);
}
