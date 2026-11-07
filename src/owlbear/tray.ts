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

/**
 * The dice box sizes its walls and camera once, from its container. Owlbear
 * grows the popover open, so it waits for the tray to stop changing size —
 * built any sooner, the dice land in a corner and roll off the edge.
 */
function settledSize(element: HTMLElement) {
    return new Promise<void>((resolve) => {
        let last = "";
        let steady = 0;
        const check = () => {
            const size = `${element.clientWidth}x${element.clientHeight}`;
            steady = size === last && element.clientWidth > 0 && element.clientHeight > 0 ? steady + 1 : 0;
            last = size;
            if (steady >= 3) resolve();
            else window.setTimeout(check, 50);
        };
        check();
    });
}

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
        await settledSize(document.getElementById("dice")!);
        const box = new DiceBox("#dice", {
            assetPath: "/owlbear/dice/",
            sounds: false,
            // Sized for a tray a few inches across, not a table.
            baseScale: 74,
            // White light, a little brighter than the default, so the glass
            // keeps its colour instead of going warm and muddy.
            color_spotlight: 0xffffff,
            light_intensity: 1.1,
            // Stained glass across the logo's purples, numbered in gold; each
            // die takes one of the shades.
            theme_customColorset: {
                name: "archive-stained-glass",
                foreground: "#f0c75e",
                background: ["#4F39F6", "#6a2ff8", "#7f25f9", "#9810FA"],
                outline: "#140838",
                texture: "stainedglass",
                material: "glass",
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
