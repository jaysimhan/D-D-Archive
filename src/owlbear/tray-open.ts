import OBR from "@owlbear-rodeo/sdk";
import type { TableBatch } from "./table-rolls";
import { TRAY_ID, encodeThrow, throwOf } from "./tray-throw";

/** The tray's size, and its gap from the corner of the screen, in px. */
const TRAY_WIDTH = 300;
const TRAY_HEIGHT = 340;
const TRAY_MARGIN = 16;

/** Throws a batch's dice in the tray in the corner of this player's screen. */
export async function showTray(batch: TableBatch) {
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
