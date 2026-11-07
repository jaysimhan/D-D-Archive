import OBR from "@owlbear-rodeo/sdk";
import DiceBox from "@3d-dice/dice-box-threejs";
import { TRAY_ID, decodeThrow, notationOf } from "./tray-throw";

/**
 * The dice tray every player sees when someone rolls: the dice tumble onto
 * the faces that were rolled, the footer names who threw and what came up,
 * and the tray puts itself away. A click puts it away sooner.
 */

/** How long the settled dice stay on screen, in ms. */
const LINGER_MS = 3000;

const ready = new Promise<void>((resolve) => OBR.onReady(() => resolve()));
const close = () => ready.then(() => OBR.popover.close(TRAY_ID));

document.getElementById("tray")!.addEventListener("click", close);

async function main() {
    const thrown = decodeThrow(window.location.hash.slice(1));
    if (!thrown) {
        close();
        return;
    }

    const who = document.getElementById("who")!;
    const rolls = document.getElementById("rolls")!;
    if (thrown.rolls.length === 1) {
        who.textContent = `${thrown.player} | ${thrown.rolls[0].total}`;
        rolls.textContent = thrown.rolls[0].name;
    } else {
        who.textContent = thrown.player;
        rolls.textContent = thrown.rolls.map((roll) => `${roll.name} ${roll.total}`).join(" · ");
    }

    const notation = notationOf(thrown.dice);
    if (notation) {
        const box = new DiceBox("#dice", {
            assetPath: "/owlbear/dice/",
            sounds: false,
            // Sized for a tray a few inches across, not a table.
            baseScale: 74,
            // The default warm spotlight tints grey dice olive.
            color_spotlight: 0xffffff,
            theme_customColorset: {
                name: "archive-speckled",
                foreground: "#ffffff",
                background: "#7a7a86",
                outline: "#000000",
                texture: "speckles",
                material: "plastic",
            },
        });
        await box.initialize();
        await box.roll(notation);
    }
    window.setTimeout(close, LINGER_MS);
}

main().catch((cause) => {
    console.error("The dice tray could not throw", cause);
    window.setTimeout(close, LINGER_MS);
});
