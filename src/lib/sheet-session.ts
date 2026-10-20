import type { CharacterData } from "../types/character-creator";

export const SHEET_DRAFT_KEY = "dnd-archive:sheet-draft-v1";
const COOKIE = "dnd_sheet";
const MAX_PAYLOAD_LENGTH = 8_000_000;
let nextSessionId = 0;

export interface SheetSnapshot {
    version: 1;
    character?: CharacterData;
    fields: Record<string, unknown>;
}
export interface StoredSheetDraft {
    snapshot: SheetSnapshot;
    sourceHash: string;
    sourcePath?: string;
    remote?: { id: string; revision: string };
    dirty?: boolean;
}

export function decodeSheet(value: string): SheetSnapshot {
    if (value.length > MAX_PAYLOAD_LENGTH) throw new Error("This sheet is too large to open.");
    const parsed = JSON.parse(value) as SheetSnapshot;
    if (!parsed || parsed.version !== 1 || !parsed.fields ||
        typeof parsed.fields !== "object" || Array.isArray(parsed.fields)) {
        throw new Error("This sheet link is invalid or uses an unsupported version.");
    }
    for (const [key, field] of Object.entries(parsed.fields)) {
        if ((key.includes("/auto:") || key.endsWith("Override")) && field !== null) {
            const override = field as { source?: unknown; value?: unknown };
            if (!override || typeof override.source !== "string" || typeof override.value !== "string") {
                throw new Error("This sheet contains an invalid field override.");
            }
        }
        if (key.endsWith("/appearance")) {
            const appearance = field as { text?: unknown; image?: unknown };
            if (!appearance || typeof appearance.text !== "string" || typeof appearance.image !== "string" ||
                (appearance.image !== "" && !appearance.image.startsWith("data:image/"))) {
                throw new Error("This sheet contains invalid appearance data.");
            }
        }
    }
    // Character data originates in the creator, but shared links are untrusted.
    if (parsed.character) {
        const c = parsed.character;
        if (typeof c.name !== "string" || typeof c.level !== "number" ||
            !c.abilityScores || !c.proficiencies || !c.personality ||
            !Array.isArray(c.selectedSpells) || !Array.isArray(c.equipment) ||
            !Array.isArray(c.feats)) {
            throw new Error("This sheet contains invalid character data.");
        }
    }
    return parsed;
}

export function sheetUrl(snapshot: SheetSnapshot, href: string): string {
    const url = new URL(href);
    const serialized = JSON.stringify(snapshot);
    if (serialized.length > MAX_PAYLOAD_LENGTH) throw new Error("This sheet is too large to share.");
    // A fragment keeps the complete sheet out of HTTP requests and server URL limits.
    url.hash = `sheet=${encodeURIComponent(serialized)}`;
    return url.href;
}

export function readSharedSheet(hash: string): SheetSnapshot | null {
    if (!hash.startsWith("#sheet=")) return null;
    return decodeSheet(decodeURIComponent(hash.slice(7)));
}

export function readLocalSheet(sourceHash?: string): SheetSnapshot | null {
    const stored = readSheetDraft();
    if (sourceHash !== undefined && stored?.sourceHash !== sourceHash) return null;
    return stored?.snapshot ?? null;
}

export function readSheetDraft(id?: string): StoredSheetDraft | null {
    try {
        const raw = localStorage.getItem(id ? `${SHEET_DRAFT_KEY}:${id}` : SHEET_DRAFT_KEY);
        if (!raw) return null;
        const stored = JSON.parse(raw);
        const cookieRevision = document.cookie.split("; ")
            .find((entry) => entry.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
        if (!id && cookieRevision && cookieRevision !== stored.revision) return null;
        return { ...stored, snapshot: decodeSheet(JSON.stringify(stored.snapshot)) };
    } catch {
        return null;
    }
}

/** Cookies identify the latest draft; large notes and images live in localStorage. */
export function writeLocalSheet(snapshot: SheetSnapshot, options: Partial<Omit<StoredSheetDraft, "snapshot">> = {}): void {
    const revision = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const serialized = JSON.stringify({
        revision, sourceHash: location.hash, sourcePath: location.pathname, ...options, snapshot,
    });
    if (options.remote) localStorage.setItem(`${SHEET_DRAFT_KEY}:${options.remote.id}`, serialized);
    localStorage.setItem(SHEET_DRAFT_KEY, serialized);
    document.cookie = `${COOKIE}=${revision}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}

export class SheetSession {
    readonly id = nextSessionId++;
    fields: Record<string, unknown>;
    private listeners = new Set<() => void>();
    private past: Record<string, unknown>[] = [];
    private future: Record<string, unknown>[] = [];
    private groupKey: string | null = null;
    private groupTime = 0;
    private inTransaction = false;
    private revision = 0;
    private savedFields: string | null;

    constructor(readonly character: CharacterData | undefined, fields: Record<string, unknown> = {}, saved = false, readonly readOnly = false) {
        this.fields = { ...fields };
        this.savedFields = saved ? JSON.stringify(fields) : null;
    }

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => { this.listeners.delete(listener); };
    };
    getRevision = () => this.revision;
    private emit() {
        this.revision++;
        this.listeners.forEach((listener) => listener());
    }
    seed(key: string, value: unknown) {
        if (!Object.prototype.hasOwnProperty.call(this.fields, key)) {
            const wasSaved = !this.dirty;
            this.fields = { ...this.fields, [key]: value };
            // Defaults are initialization, not edits.
            if (wasSaved) this.savedFields = JSON.stringify(this.fields);
        }
    }
    set(key: string, value: unknown) {
        if (this.readOnly) return;
        if (JSON.stringify(this.fields[key]) === JSON.stringify(value)) return;
        const now = Date.now();
        if (!this.inTransaction && (this.groupKey !== key || now - this.groupTime > 600)) {
            this.past.push(this.fields);
            if (this.past.length > 100) this.past.shift();
        }
        if (!this.inTransaction) {
            this.groupKey = key;
            this.inTransaction = true;
            queueMicrotask(() => { this.inTransaction = false; });
        }
        this.groupTime = now;
        this.future = [];
        this.fields = { ...this.fields, [key]: value };
        this.emit();
    }
    /** Recalculation belongs to the edit that caused it, not a separate undo step. */
    derive(key: string, value: unknown) {
        if (JSON.stringify(this.fields[key]) === JSON.stringify(value)) return;
        this.fields = { ...this.fields, [key]: value };
        this.emit();
    }
    endGroup = () => { this.groupKey = null; };
    undo = () => {
        if (this.readOnly) return;
        const previous = this.past.pop();
        if (!previous) return;
        this.future.push(this.fields);
        this.fields = previous;
        this.endGroup();
        this.emit();
    };
    redo = () => {
        if (this.readOnly) return;
        const next = this.future.pop();
        if (!next) return;
        this.past.push(this.fields);
        this.fields = next;
        this.endGroup();
        this.emit();
    };
    get canUndo() { return this.past.length > 0; }
    get canRedo() { return this.future.length > 0; }
    get dirty() { return JSON.stringify(this.fields) !== this.savedFields; }
    snapshot = (): SheetSnapshot => ({ version: 1, character: this.character, fields: this.fields });
    markSaved = (fields = this.fields) => {
        this.savedFields = JSON.stringify(fields);
        this.endGroup();
        this.emit();
    };
}
