import OBR from "@owlbear-rodeo/sdk";
import { forgetLuck } from "../lib/dice-roller-storage";
import { clearTable, watchTable, type TableBatch } from "./table-rolls";
import { forgetHidden } from "./hidden-rolls";
import { showTray } from "./tray-open";

/**
 * Runs for as long as the room is open, popover or not. Whenever anyone rolls
 * — the roller included — it throws their dice in a tray in the corner of
 * every player's screen.
 */
OBR.onReady(async () => {
    // Entering a room is a new session: the dice go back to plain luck, and
    // whoever opens an empty room clears the last session's rolls before
    // anyone sees them. Nothing can run once everyone has left, so this is
    // when the closed session gets tidied away.
    forgetLuck();
    if (!(await OBR.party.getPlayers()).length) {
        forgetHidden();
        await clearTable().catch((cause) => console.error("Could not clear the last session's rolls", cause));
    }

    let seen: Set<string> | null = null;
    const key = (batch: TableBatch) => `${batch.playerId}-${batch.id}`;

    watchTable((batches) => {
        // The first read is history, not news.
        const fresh = seen ? batches.filter((batch) => !seen!.has(key(batch))) : [];
        seen = new Set(batches.map(key));
        // Newest first: when several land together, the latest is thrown.
        if (fresh.length) {
            showTray(fresh[0]).catch((cause) => console.error("Could not open the dice tray", cause));
        }
    });
});
