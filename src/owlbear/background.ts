import OBR from "@owlbear-rodeo/sdk";
import { critOf } from "../lib/dice";
import { describeBatch, watchTable, type TableBatch } from "./table-rolls";

/**
 * Runs for as long as the room is open, popover or not, and puts each roll
 * someone else makes in front of everyone as an Owlbear notification.
 */
OBR.onReady(async () => {
    const me = await OBR.player.getId();
    let seen: Set<string> | null = null;
    const key = (batch: TableBatch) => `${batch.playerId}-${batch.id}`;

    watchTable((batches) => {
        // The first read is history, not news.
        if (seen) {
            for (const batch of [...batches].reverse()) {
                if (seen.has(key(batch)) || batch.playerId === me) continue;
                const crits = batch.rolls.map(critOf);
                const variant = crits.includes("success")
                    ? "SUCCESS"
                    : crits.includes("failure")
                        ? "ERROR"
                        : "DEFAULT";
                OBR.notification.show(describeBatch(batch), variant);
            }
        }
        seen = new Set(batches.map(key));
    });
});
