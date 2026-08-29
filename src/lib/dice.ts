/**
 * The rules behind the floating dice roller, kept out of the component so the
 * awkward parts — what a dropped die does to the total, whether a reroll can
 * come back worse, where a modifier actually lands — can be read without
 * wading through JSX.
 */

export type DieSides = 2 | 3 | 4 | 6 | 8 | 10 | 12 | 20 | 100;
export type KeepMode = "drop" | "reroll";
export type KeepEnd = "lowest" | "highest";
export type LimitMode = "min" | "max";
export type ModTarget = "each" | "total";

export const DIE_SIDES: DieSides[] = [2, 3, 4, 6, 8, 10, 12, 20, 100];

/** The quick tray only offers the dice that have an icon drawn for them. */
export const TRAY_SIDES: DieSides[] = [4, 6, 8, 10, 12, 20, 100];

export const MAX_COUNT = 99;
/**
 * Effectively "type what you like" — six digits is past any modifier a table
 * will ever need, while still keeping totals inside exact integer arithmetic
 * and the input box a sane width.
 */
export const MAX_MODIFIER = 999999;

export interface DiceLine {
    id: string;
    /** Empty means "show the NdX shorthand instead". */
    label: string;
    count: number;
    sides: DieSides;
    sign: 1 | -1;
    modifier: number;
    modTarget: ModTarget;
    /** Whether this line's two advanced options are on screen. */
    expanded: boolean;
    keepEnabled: boolean;
    keepMode: KeepMode;
    keepEnd: KeepEnd;
    keepCount: number;
    limitEnabled: boolean;
    limitMode: LimitMode;
    limitValue: number;
    /** Last total, so a reopened panel still shows what the line rolled. */
    result: number | null;
}

export interface DieResult {
    /** What the die counts for after any reroll and any floor or ceiling. */
    value: number;
    dropped: boolean;
    /** Set when option 1 rerolled this die: the face it showed first. */
    rerolledFrom?: number;
    /** Set when option 2 pulled the die up or down: the face it actually rolled. */
    clampedFrom?: number;
}

export interface LineRoll {
    dice: DieResult[];
    total: number;
}

/**
 * Every die is a straight, even roll — unless the table has talked the roller
 * into being generous, in which case 2 out of 3 dice lean high by taking the
 * best of three draws (which lands in the top half 87.5% of the time) and the
 * remaining third stays uniform. Blended, 75% of a lucky line's dice land in
 * the upper half. Every face stays reachable either way, crits and crit-fails
 * included — luck shifts the odds, it never removes a number from the die.
 */
const LUCKY_CHANCE = 2 / 3;
const LUCKY_DRAWS = 3;

export const rollDie = (sides: number, lucky = false): number => {
    const uniform = () => Math.floor(Math.random() * sides) + 1;
    if (!lucky || Math.random() >= LUCKY_CHANCE) return uniform();
    return Math.max(...Array.from({ length: LUCKY_DRAWS }, uniform));
};

/* --------------------------------------------------------------- the code */

export type LuckSwitch = "on" | "off";

/**
 * A line's name box doubles as a console. Codes are matched on their letters
 * alone, so shouting it or spacing it out — "I Am Feeling Lucky" — still lands.
 */
const CODES: Record<string, LuckSwitch> = {
    iamfeelinglucky: "on",
    leavemealone: "off",
};

export const cheatCode = (label: string): LuckSwitch | null =>
    CODES[label.toLowerCase().replace(/[^a-z]/g, "")] ?? null;

export const clampInt = (value: number, min: number, max: number): number =>
    Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : min;

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${idCounter++}`;

export function createLine(overrides: Partial<DiceLine> = {}): DiceLine {
    return {
        id: nextId("line"),
        label: "",
        count: 1,
        sides: 20,
        sign: 1,
        modifier: 0,
        modTarget: "total",
        expanded: false,
        keepEnabled: false,
        keepMode: "drop",
        keepEnd: "lowest",
        keepCount: 1,
        limitEnabled: false,
        limitMode: "min",
        limitValue: 1,
        result: null,
        ...overrides,
    };
}

/** A copy that is its own line: new identity, no borrowed result. */
export const duplicateLine = (line: DiceLine): DiceLine => ({
    ...line,
    id: nextId("line"),
    result: null,
});

export const shorthand = (line: DiceLine): string => `${line.count}d${line.sides}`;

/**
 * The line read back as dice notation — "4d6+2". Standing in as the name
 * field's placeholder, it also does quiet duty as a legend: the modifier boxes
 * say nothing about what they feed into until you watch the notation change
 * with them.
 */
export const notation = (line: DiceLine): string =>
    line.modifier > 0
        ? `${shorthand(line)}${line.sign < 0 ? "\u2212" : "+"}${line.modifier}`
        : shorthand(line);

/** What the line is called on screen — its label, or the notation it stands for. */
export const lineName = (line: DiceLine): string => line.label.trim() || notation(line);

/**
 * A dropped die still has to leave one behind, so drop tops out one short of
 * the pool; a reroll replaces dice rather than removing them and can take all.
 */
export const maxKeepCount = (line: DiceLine): number =>
    line.keepMode === "drop" ? Math.max(0, line.count - 1) : line.count;

/** The full reading of a line — "4d6 +2 to each (drop lowest 1)" — for the log. */
export function describeLine(line: DiceLine): string {
    const parts: string[] = [shorthand(line)];

    if (line.modifier > 0) {
        parts.push(`${line.sign < 0 ? "-" : "+"}${line.modifier} to ${line.modTarget}`);
    }

    const clauses: string[] = [];
    const keepCount = Math.min(line.keepCount, maxKeepCount(line));
    if (line.keepEnabled && keepCount > 0) {
        clauses.push(`${line.keepMode} ${line.keepEnd} ${keepCount}`);
    }
    if (line.limitEnabled) {
        clauses.push(`${line.limitMode === "min" ? "minimum" : "maximum"} ${line.limitValue} per die`);
    }
    if (clauses.length) parts.push(`(${clauses.join(", ")})`);

    return parts.join(" ");
}

/** Option 2: a floor or a ceiling on the face, remembering what was rolled. */
function applyLimit(rolled: number, line: DiceLine): DieResult {
    if (!line.limitEnabled) return { value: rolled, dropped: false };

    const bound = clampInt(line.limitValue, 1, line.sides);
    const limited = line.limitMode === "min" ? Math.max(rolled, bound) : Math.min(rolled, bound);

    return limited === rolled
        ? { value: rolled, dropped: false }
        : { value: limited, dropped: false, clampedFrom: rolled };
}

export function rollLine(line: DiceLine, lucky = false): LineRoll {
    const count = clampInt(line.count, 1, MAX_COUNT);
    const dice: DieResult[] = Array.from({ length: count }, () => applyLimit(rollDie(line.sides, lucky), line));

    // Option 1 picks the same dice either way — the extremes — and only the
    // treatment differs: a drop takes them out of the total, a reroll replaces
    // them once and keeps whatever comes up, better or worse.
    const keepCount = Math.min(clampInt(line.keepCount, 0, count), maxKeepCount({ ...line, count }));
    if (line.keepEnabled && keepCount > 0) {
        const byExtreme = dice
            .map((die, index) => ({ index, value: die.value }))
            .sort((a, b) => (line.keepEnd === "lowest" ? a.value - b.value : b.value - a.value));

        for (const { index } of byExtreme.slice(0, keepCount)) {
            if (line.keepMode === "drop") {
                dice[index].dropped = true;
            } else {
                const before = dice[index].value;
                dice[index] = { ...applyLimit(rollDie(line.sides, lucky), line), rerolledFrom: before };
            }
        }
    }

    const kept = dice.filter((die) => !die.dropped);
    const sum = kept.reduce((running, die) => running + die.value, 0);
    const modifier = line.sign * clampInt(line.modifier, 0, MAX_MODIFIER);
    // "to each" rides along with every die that counts, so dropped dice carry
    // no modifier with them.
    const total = line.modTarget === "each" ? sum + modifier * kept.length : sum + modifier;

    return { dice, total };
}

/**
 * Stored lines are whatever an older build (or a hand-edited localStorage)
 * left behind, so every field is pulled back into range rather than trusted.
 */
export function sanitizeLine(raw: unknown): DiceLine | null {
    if (!raw || typeof raw !== "object") return null;
    const value = raw as Record<string, unknown>;

    const sides = DIE_SIDES.includes(value.sides as DieSides) ? (value.sides as DieSides) : 20;
    const count = clampInt(Number(value.count), 1, MAX_COUNT);
    const line = createLine({
        label: typeof value.label === "string" ? value.label.slice(0, 22) : "",
        count,
        sides,
        sign: value.sign === -1 ? -1 : 1,
        modifier: clampInt(Number(value.modifier), 0, MAX_MODIFIER),
        modTarget: value.modTarget === "each" ? "each" : "total",
        expanded: value.expanded === true,
        keepEnabled: value.keepEnabled === true,
        keepMode: value.keepMode === "reroll" ? "reroll" : "drop",
        keepEnd: value.keepEnd === "highest" ? "highest" : "lowest",
        limitEnabled: value.limitEnabled === true,
        limitMode: value.limitMode === "max" ? "max" : "min",
        limitValue: clampInt(Number(value.limitValue), 1, sides),
        result: typeof value.result === "number" ? value.result : null,
    });

    return { ...line, keepCount: clampInt(Number(value.keepCount), 0, maxKeepCount(line)) };
}

/* ---------------------------------------------------------------- the log */

export interface LoggedRoll {
    id: string;
    /** What the line is called, and the full NdX reading behind it. */
    name: string;
    detail: string;
    dice: DieResult[];
    total: number;
    sides: DieSides;
}

/** One press of Roll or ALL: everything it rolled, under one timestamp. */
export interface LogBatch {
    id: string;
    at: number;
    rolls: LoggedRoll[];
}

export const MAX_LOG_BATCHES = 25;

export const makeId = (prefix: string): string => nextId(prefix);

export function toLoggedRoll(line: DiceLine, roll: LineRoll): LoggedRoll {
    return {
        id: nextId("roll"),
        name: lineName(line),
        detail: describeLine(line),
        dice: roll.dice,
        total: roll.total,
        sides: line.sides,
    };
}

/** A natural 20 on a lone, undropped die — nothing to celebrate in a handful. */
export function critOf(roll: LoggedRoll): "success" | "failure" | null {
    if (roll.dice.length !== 1 || roll.dice[0].dropped) return null;
    const face = roll.dice[0];
    if (face.clampedFrom !== undefined || face.rerolledFrom !== undefined) return null;
    if (face.value === roll.sides) return "success";
    if (face.value === 1) return "failure";
    return null;
}

function sanitizeDie(raw: unknown): DieResult | null {
    if (!raw || typeof raw !== "object") return null;
    const value = raw as Record<string, unknown>;
    if (typeof value.value !== "number") return null;

    return {
        value: value.value,
        dropped: value.dropped === true,
        ...(typeof value.rerolledFrom === "number" ? { rerolledFrom: value.rerolledFrom } : {}),
        ...(typeof value.clampedFrom === "number" ? { clampedFrom: value.clampedFrom } : {}),
    };
}

export function sanitizeLog(raw: unknown): LogBatch[] {
    if (!Array.isArray(raw)) return [];

    return raw
        .slice(0, MAX_LOG_BATCHES)
        .map((entry): LogBatch | null => {
            if (!entry || typeof entry !== "object") return null;
            const batch = entry as Record<string, unknown>;
            if (!Array.isArray(batch.rolls)) return null;

            const rolls = batch.rolls
                .map((item): LoggedRoll | null => {
                    if (!item || typeof item !== "object") return null;
                    const roll = item as Record<string, unknown>;
                    const dice = Array.isArray(roll.dice)
                        ? roll.dice.map(sanitizeDie).filter((die): die is DieResult => die !== null)
                        : [];
                    if (!dice.length || typeof roll.total !== "number") return null;

                    return {
                        id: typeof roll.id === "string" ? roll.id : nextId("roll"),
                        name: typeof roll.name === "string" ? roll.name : "roll",
                        detail: typeof roll.detail === "string" ? roll.detail : "",
                        dice,
                        total: roll.total,
                        sides: DIE_SIDES.includes(roll.sides as DieSides) ? (roll.sides as DieSides) : 20,
                    };
                })
                .filter((roll): roll is LoggedRoll => roll !== null);

            if (!rolls.length) return null;

            return {
                id: typeof batch.id === "string" ? batch.id : nextId("batch"),
                at: typeof batch.at === "number" ? batch.at : Date.now(),
                rolls,
            };
        })
        .filter((batch): batch is LogBatch => batch !== null);
}
