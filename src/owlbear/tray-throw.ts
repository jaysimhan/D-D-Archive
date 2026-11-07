import { EXTENSION_ID, type TableBatch } from "./table-rolls";

/**
 * What the dice tray throws: a shared roll reduced to the faces each die
 * landed on, plus the footer's words. It rides in the tray's URL, so it holds
 * only what the table already sees.
 */

export const TRAY_ID = `${EXTENSION_ID}/tray`;

/** More than this and the tray is a pile; the footer still has every total. */
const MAX_THROWN = 12;

export interface Throw {
    player: string;
    rolls: { name: string; total: number }[];
    dice: { sides: number; face: number }[];
}

export function throwOf(batch: TableBatch): Throw {
    return {
        player: batch.hidden ? `${batch.player} (hidden)` : batch.player,
        rolls: batch.rolls.map((roll) => ({ name: roll.name, total: roll.total })),
        dice: batch.rolls
            .flatMap((roll) => roll.dice.map((die) => ({
                sides: roll.sides,
                // The face it came to rest on, before any floor or ceiling.
                face: die.clampedFrom ?? die.value,
            })))
            .slice(0, MAX_THROWN),
    };
}

export const encodeThrow = (thrown: Throw) => encodeURIComponent(JSON.stringify(thrown));

export function decodeThrow(hash: string): Throw | null {
    try {
        const raw = JSON.parse(decodeURIComponent(hash)) as Partial<Throw>;
        if (typeof raw.player !== "string" || !Array.isArray(raw.rolls) || !Array.isArray(raw.dice)) return null;
        return {
            player: raw.player.slice(0, 40),
            rolls: raw.rolls
                .filter((roll) => typeof roll?.name === "string" && typeof roll.total === "number")
                .map((roll) => ({ name: roll.name.slice(0, 40), total: roll.total })),
            dice: raw.dice
                .filter((die) => Number.isInteger(die?.sides) && Number.isInteger(die?.face))
                .slice(0, MAX_THROWN),
        };
    } catch {
        return null;
    }
}

/** The dice the 3D tray has models for. A d3 shows in the footer only. */
const MODELLED = new Set([2, 4, 6, 8, 10, 12, 20, 100]);

/**
 * "1d20+2d6@19,4,3". Dice of one type are grouped, since the tray merges
 * repeated types and hands out the faces in group order. A d100 is thrown as
 * percentile dice: a tens die (its 0 is "00") and a d10 for the ones.
 */
export function notationOf(dice: Throw["dice"]): string {
    const groups = new Map<string, number[]>();
    const add = (type: string, face: number) => {
        if (!groups.has(type)) groups.set(type, []);
        groups.get(type)!.push(face);
    };

    for (const { sides, face } of dice) {
        if (!MODELLED.has(sides) || face < 1 || face > sides) continue;
        if (sides === 100) {
            add("d100", Math.floor(face / 10) % 10);
            add("d10", face % 10 || 10);
        } else {
            add(`d${sides}`, face);
        }
    }

    if (!groups.size) return "";
    const sets = [...groups].map(([type, faces]) => `${faces.length}${type}`).join("+");
    const faces = [...groups.values()].flat().join(",");
    return `${sets}@${faces}`;
}
