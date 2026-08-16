/**
 * The spell slots a character has at each level, for the counters heading the
 * spellbook blocks and for greying out the levels they cannot cast at.
 *
 * Slots come from the classes taken — including the third-caster subclasses of
 * classes with no magic of their own, Eldritch Knight and Arcane Trickster —
 * and from a warlock's Pact Magic. Species, feats and backgrounds grant spells
 * rather than slots (theirs are cast once per rest), so they leave these
 * numbers alone; what they do grant is named in the header row above.
 */

/** Slots for spell levels 1-9, by shared caster level. PHB multiclass table. */
const SLOTS_BY_CASTER_LEVEL: readonly (readonly number[])[] = [
    [], // No caster levels, no slots.
    [2],
    [3],
    [4, 2],
    [4, 3],
    [4, 3, 2],
    [4, 3, 3],
    [4, 3, 3, 1],
    [4, 3, 3, 2],
    [4, 3, 3, 3, 1],
    [4, 3, 3, 3, 2],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

/** Pact Magic is its own table: [slots, the level they are all cast at]. */
const PACT_MAGIC: readonly (readonly [number, number])[] = [
    [0, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [2, 2],
    [2, 3],
    [2, 3],
    [2, 4],
    [2, 4],
    [2, 5],
    [2, 5],
    [3, 5],
    [3, 5],
    [3, 5],
    [3, 5],
    [3, 5],
    [3, 5],
    [4, 5],
    [4, 5],
    [4, 5],
    [4, 5],
];

const MAX_LEVEL = 20;

/** Slots by spell level, indexed 1-9; index 0 is unused so levels read plainly. */
export type SpellSlots = readonly number[];

export type CastingClass = {
    /** The class's own progression: "full", "half", "third", "pact", "none". */
    progression?: string;
    /** The class slug, which tells an artificer's rounding from a paladin's. */
    id?: string;
    /** Set where the subclass casts off slots the class itself does not have. */
    subclassCasts?: boolean;
    level: number;
};

/**
 * Half and third casters reach a new slot a level before the PHB's multiclass
 * rounding admits it, so a single-classed one is read off its own table and
 * only a multiclassed one rounds down.
 */
function partialCasterLevel(level: number, share: number, multiclassed: boolean, from: number) {
    if (multiclassed) return Math.floor(level / share);
    return level < from ? 0 : Math.ceil(level / share);
}

function casterLevelOf(item: CastingClass, multiclassed: boolean) {
    const progression = item.progression?.trim().toLowerCase();
    // "special" is a homebrew class's own progression; read it as a full caster,
    // which is what every one of them in the Archive is.
    if (progression === "full" || progression === "special") return item.level;
    if (progression === "half") {
        // Artificers cast from level 1; paladins and rangers from level 2.
        const from = item.id === "artificer" ? 1 : 2;
        return partialCasterLevel(item.level, 2, multiclassed, from);
    }
    if (progression === "third") return partialCasterLevel(item.level, 3, multiclassed, 3);
    if (progression === "pact") return 0; // Counted separately below.
    return item.subclassCasts ? partialCasterLevel(item.level, 3, multiclassed, 3) : 0;
}

/**
 * Slots by spell level, or null where the sheet cannot yet say — no class it
 * recognises, or no level against it. Null leaves every block as it was drawn,
 * so a blank sheet is not greyed out end to end.
 */
export function spellSlotsByLevel(classes: CastingClass[]): SpellSlots | null {
    const known = classes.filter(
        (item) => Number.isInteger(item.level) && item.level > 0,
    );
    if (!known.length) return null;

    const multiclassed = known.length > 1;
    let casterLevel = 0;
    let pactLevel = 0;
    for (const item of known) {
        if (item.progression?.trim().toLowerCase() === "pact") pactLevel += item.level;
        else casterLevel += casterLevelOf(item, multiclassed);
    }

    const slots = Array.from({ length: 10 }, () => 0);
    SLOTS_BY_CASTER_LEVEL[Math.min(casterLevel, MAX_LEVEL)].forEach((count, index) => {
        slots[index + 1] = count;
    });
    if (pactLevel) {
        const [count, level] = PACT_MAGIC[Math.min(pactLevel, MAX_LEVEL)];
        slots[level] += count;
    }
    return slots;
}
