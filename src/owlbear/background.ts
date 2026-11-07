import OBR from "@owlbear-rodeo/sdk";
import { forgetLuck } from "../lib/dice-roller-storage";
import { clearTable, watchTable, type TableBatch } from "./table-rolls";
import { TRAY_ID, encodeThrow, throwOf } from "./tray-throw";

/** The tray's size, and its gap from the corner of the screen, in px. */
const TRAY_WIDTH = 300;
const TRAY_HEIGHT = 340;
const TRAY_MARGIN = 16;

/**
 * Runs for as long as the room is open, popover or not. Whenever anyone rolls
 * — the roller included — it throws their dice in a tray in the corner of
 * every player's screen.
 */
async function showTray(batch: TableBatch) {
    const [width, height] = await Promise.all([OBR.viewport.getWidth(), OBR.viewport.getHeight()]);
    const url = new URL("/owlbear/tray.html", window.location.href);
    url.hash = encodeThrow(throwOf(batch));

    // Reopened rather than updated, so a second roll throws from the start.
    await OBR.popover.close(TRAY_ID);
    await OBR.popover.open({
        id: TRAY_ID,
        url: url.toString(),
        width: TRAY_WIDTH,
        height: TRAY_HEIGHT,
        anchorReference: "POSITION",
        anchorPosition: { left: width - TRAY_MARGIN, top: height - TRAY_MARGIN },
        anchorOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
        transformOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
        hidePaper: true,
        disableClickAway: true,
    });
}

OBR.onReady(async () => {
    // Entering a room is a new session: the dice go back to plain luck, and
    // whoever opens an empty room clears the last session's rolls before
    // anyone sees them. Nothing can run once everyone has left, so this is
    // when the closed session gets tidied away.
    forgetLuck();
    if (!(await OBR.party.getPlayers()).length) {
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
