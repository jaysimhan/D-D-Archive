/**
 * Where the floating roller keeps itself between visits: its lines, log and
 * settings, in this browser only. Kept apart from the component so a page
 * with no roller on it — the Owlbear extension's background page — can reach
 * it without loading one.
 */

const STORAGE_KEY = "dnd-archive:dice-roller";

export interface StoredRoller {
    lines?: unknown;
    log?: unknown;
    sound?: unknown;
    modifier?: unknown;
    rollMode?: unknown;
    showLog?: unknown;
    lucky?: unknown;
}

export function readStored(): StoredRoller {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : null;
        return parsed && typeof parsed === "object" ? (parsed as StoredRoller) : {};
    } catch {
        // Storage can be blocked outright, and what is in it can be
        // half-written. Either way the roller just starts fresh.
        return {};
    }
}

export function writeStored(state: StoredRoller): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (cause) {
        console.warn("Could not save dice roller state", cause);
    }
}

/** Puts the dice back to plain luck, leaving everything else as it was. */
export function forgetLuck(): void {
    const stored = readStored();
    if (stored.lucky === true) writeStored({ ...stored, lucky: false });
}
