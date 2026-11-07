import OBR, { type Metadata } from "@owlbear-rodeo/sdk";
import { makeId, sanitizeLog, type LogBatch, type LoggedRoll } from "../lib/dice";

/**
 * Rolls the whole table can see, kept in the room's metadata.
 *
 * Each player writes only their own key, so a table rolling initiative at the
 * same moment cannot overwrite one another — room metadata merges top-level
 * keys, and no two players ever share one.
 *
 * What goes out is the roll as the log reads it: names, dice, totals. Nothing
 * about how the dice were rolled travels with it.
 */

export const EXTENSION_ID = "app.vercel.d-d-archive.dice";
const KEY_PREFIX = `${EXTENSION_ID}/rolls/`;

/** One player's recent rolls, as stored under their key. */
interface PlayerRolls {
    name: string;
    color: string;
    batches: LogBatch[];
}

/** A batch as the table sees it: whose it was, and what they rolled. */
export interface TableBatch extends LogBatch {
    playerId: string;
    player: string;
    color: string;
}

/**
 * Room metadata is small and shared with every other extension in the room,
 * so each player keeps a handful of rolls in a couple of kilobytes.
 */
const MAX_BATCHES = 6;
const BUDGET_BYTES = 2000;
/** Dice kept per roll once a batch alone is over budget; totals stay exact. */
const DICE_WHEN_TIGHT = 10;

const size = (value: unknown) => JSON.stringify(value).length;

function fitBudget(entry: PlayerRolls): PlayerRolls {
    const batches = entry.batches.slice(0, MAX_BATCHES);
    while (batches.length > 1 && size({ ...entry, batches }) > BUDGET_BYTES) batches.pop();
    if (size({ ...entry, batches }) <= BUDGET_BYTES) return { ...entry, batches };

    // One press of ROLL ALL on twenty full lines: keep every total, trim dice.
    const trimmed = batches.map((batch) => ({
        ...batch,
        rolls: batch.rolls.map((roll) => ({ ...roll, dice: roll.dice.slice(0, DICE_WHEN_TIGHT) })),
    }));
    return { ...entry, batches: trimmed };
}

function readPlayer(value: unknown): PlayerRolls | null {
    if (!value || typeof value !== "object") return null;
    const raw = value as Record<string, unknown>;
    const batches = sanitizeLog(raw.batches);
    if (!batches.length) return null;
    return {
        name: typeof raw.name === "string" && raw.name.trim() ? raw.name.trim().slice(0, 40) : "Someone",
        color: typeof raw.color === "string" ? raw.color : "#999999",
        batches,
    };
}

/** Every player's rolls in the room, newest first. */
export function tableBatches(metadata: Metadata): TableBatch[] {
    const out: TableBatch[] = [];
    for (const [key, value] of Object.entries(metadata)) {
        if (!key.startsWith(KEY_PREFIX)) continue;
        const entry = readPlayer(value);
        if (!entry) continue;
        const playerId = key.slice(KEY_PREFIX.length);
        for (const batch of entry.batches) {
            out.push({ ...batch, playerId, player: entry.name, color: entry.color });
        }
    }
    return out.sort((a, b) => b.at - a.at);
}

/** Shares one press of the roller with the room. */
export async function shareRolls(rolls: LoggedRoll[]) {
    if (!rolls.length || !OBR.isReady) return;
    const [playerId, name, color, metadata] = await Promise.all([
        OBR.player.getId(),
        OBR.player.getName(),
        OBR.player.getColor(),
        OBR.room.getMetadata(),
    ]);

    const key = KEY_PREFIX + playerId;
    const previous = readPlayer(metadata[key]);
    const batch: LogBatch = { id: makeId("batch"), at: Date.now(), rolls };
    await OBR.room.setMetadata({
        [key]: fitBudget({ name, color, batches: [batch, ...(previous?.batches ?? [])] }),
    });
}

/**
 * Wipes every player's rolls from the room: the GM clearing the table, or a
 * new session starting. A key is emptied rather than removed, since a
 * metadata update merges keys and has no way to take one away.
 */
export async function clearTable() {
    const metadata = await OBR.room.getMetadata();
    const update: Metadata = {};
    for (const [key, value] of Object.entries(metadata)) {
        if (key.startsWith(KEY_PREFIX) && value !== null) update[key] = null;
    }
    if (Object.keys(update).length) await OBR.room.setMetadata(update);
}

/** Calls back with the table's rolls now and whenever anyone rolls. */
export function watchTable(callback: (batches: TableBatch[]) => void) {
    let live = true;
    OBR.room.getMetadata().then((metadata) => {
        if (live) callback(tableBatches(metadata));
    });
    const stop = OBR.room.onMetadataChange((metadata) => callback(tableBatches(metadata)));
    return () => {
        live = false;
        stop();
    };
}
