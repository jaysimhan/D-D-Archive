import OBR from "@owlbear-rodeo/sdk";
import { makeId, sanitizeLog, type LoggedRoll } from "../lib/dice";
import type { TableBatch } from "./table-rolls";

/**
 * The GM's hidden rolls. They never reach the room — room metadata is
 * readable by every player's browser — so they live in this tab alone, per
 * room: through the popover closing and opening, gone with the tab.
 */

const MAX_HIDDEN = 20;
const HIDE_KEY = "dnd-archive:owlbear-hide-rolls";
const listKey = () => `dnd-archive:owlbear-hidden-rolls:${OBR.room.id}`;

/**
 * Whether the GM keeps their rolls to themselves — so unless they have turned
 * it off, a GM's rolls start hidden.
 */
export function readHideRolls(): boolean {
    try {
        return window.localStorage.getItem(HIDE_KEY) !== "off";
    } catch {
        return true;
    }
}

export function writeHideRolls(on: boolean) {
    try {
        window.localStorage.setItem(HIDE_KEY, on ? "on" : "off");
    } catch {
        // The toggle still works for this visit.
    }
}

export function readHidden(): TableBatch[] {
    try {
        const raw = JSON.parse(window.sessionStorage.getItem(listKey()) ?? "null") as {
            playerId?: unknown;
            player?: unknown;
            color?: unknown;
            batches?: unknown;
        } | null;
        if (!raw || typeof raw.playerId !== "string") return [];
        const player = typeof raw.player === "string" ? raw.player : "GM";
        const color = typeof raw.color === "string" ? raw.color : "#999999";
        return sanitizeLog(raw.batches).map((batch) => ({
            ...batch,
            playerId: raw.playerId as string,
            player,
            color,
            gm: true,
            hidden: true,
        }));
    } catch {
        return [];
    }
}

/** Keeps one hidden press, and hands it back as the table log shows it. */
export async function keepHidden(rolls: LoggedRoll[]): Promise<TableBatch> {
    const [playerId, player, color] = await Promise.all([
        OBR.player.getId(),
        OBR.player.getName(),
        OBR.player.getColor(),
    ]);
    const batch: TableBatch = {
        id: makeId("batch"),
        at: Date.now(),
        rolls,
        playerId,
        player,
        color,
        gm: true,
        hidden: true,
    };
    store(playerId, player, color, [batch, ...readHidden()].slice(0, MAX_HIDDEN));
    return batch;
}

/** Drops one hidden roll — the GM has revealed it, so the table holds it now. */
export function removeHidden(id: string) {
    const rest = readHidden().filter((batch) => batch.id !== id);
    const first = rest[0];
    if (!first) forgetHidden();
    else store(first.playerId, first.player, first.color, rest);
}

function store(playerId: string, player: string, color: string, batches: TableBatch[]) {
    try {
        window.sessionStorage.setItem(listKey(), JSON.stringify({ playerId, player, color, batches }));
    } catch {
        // Shown once all the same; it just won't outlive the popover.
    }
}

export function forgetHidden() {
    try {
        window.sessionStorage.removeItem(listKey());
    } catch {
        // Nothing kept, nothing to forget.
    }
}
