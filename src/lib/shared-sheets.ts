import { decodeSheet, type SheetSnapshot } from "./sheet-session.js";

export const SHARED_SHEET_ID = /^[a-f0-9]{32}$/;
/** Links carry only the first characters of the ID; the API resolves the rest. */
export const SHEET_CODE_LENGTH = 10;
export const SHEET_CODE = /^[a-f0-9]{10}$/;
export const MAX_SHARED_SHEET_BYTES = 3_000_000;
export interface SharedSheet {
    id: string;
    revision: string;
    canEdit: boolean;
    canManagePin: boolean;
    hasPin: boolean;
    /** Name part of the link, fixed when the link is created. */
    slug: string;
    snapshot: SheetSnapshot;
}

export function sheetName(snapshot?: SheetSnapshot): string {
    const typed = snapshot?.fields["/page1/characterName"];
    return typeof typed === "string" ? typed : snapshot?.character?.name ?? "";
}

export const SHEET_SLUG = /^[a-z0-9-]{0,40}$/;
export function sheetSlug(name: string): string {
    return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40).replace(/-+$/, "");
}

/** `/sheet/<slug>-<code>`; the slug is cosmetic and only the code is read back. */
export function sharedSheetPath(id: string, slug = ""): string {
    if (!SHARED_SHEET_ID.test(id)) throw new Error("Invalid sheet link.");
    return `/sheet/${slug ? `${slug}-` : ""}${id.slice(0, SHEET_CODE_LENGTH)}`;
}

/** The sheet code (or a legacy full ID) at the end of a link segment. */
export function sheetCodeFromParam(param: string): string | undefined {
    const code = param.slice(param.lastIndexOf("-") + 1);
    return SHEET_CODE.test(code) || SHARED_SHEET_ID.test(code) ? code : undefined;
}

export class SharedSheetError extends Error {
    constructor(message: string, readonly status: number) { super(message); }
}

async function request(init: RequestInit, id?: string, action?: "unlock" | "verify" | "pin" | "lock"): Promise<SharedSheet> {
    const response = await fetch(`/api/sheets${id ? `?id=${encodeURIComponent(id)}` : ""}${action ? `&action=${action}` : ""}`, {
        ...init, credentials: "same-origin", cache: "no-store",
    });
    const body = await response.json().catch(() => null);
    if (!response.ok || !body) {
        throw new SharedSheetError(body?.error || "The sheet service is unavailable. Your draft is still on this browser.", response.status);
    }
    if (!SHARED_SHEET_ID.test(body.id) || typeof body.revision !== "string" || typeof body.canEdit !== "boolean" ||
        typeof body.canManagePin !== "boolean" || typeof body.hasPin !== "boolean" ||
        typeof body.slug !== "string" || !SHEET_SLUG.test(body.slug)) {
        throw new SharedSheetError("The sheet service returned an invalid response.", 502);
    }
    return { ...body, snapshot: decodeSheet(JSON.stringify(body.snapshot)) };
}

export async function fetchSharedSheet(id: string, signal?: AbortSignal): Promise<SharedSheet> {
    if (!SHEET_CODE.test(id)) sharedSheetPath(id);
    return request({ method: "GET", signal }, id);
}

/** Establish the HttpOnly owner cookie before creating anything, so retries are safe. */
export async function saveSharedSheet(snapshot: SheetSnapshot, id: string, revision?: string, pin?: string): Promise<SharedSheet> {
    sharedSheetPath(id);
    const serialized = JSON.stringify(snapshot);
    if (new TextEncoder().encode(serialized).length > MAX_SHARED_SHEET_BYTES) {
        throw new SharedSheetError("This sheet is too large to share. Use a smaller appearance image, or download HTML.", 413);
    }
    if (!revision) {
        if (!pin || !/^\d{4}$/.test(pin)) throw new SharedSheetError("Choose a four-digit PIN before creating this link.", 400);
        const prepare = async () => {
            const response = await fetch("/api/sheets", { credentials: "same-origin", cache: "no-store" });
            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new SharedSheetError(body?.error || "Sharing is unavailable. Your draft is still on this browser.", response.status);
            }
        };
        // Two new tabs should not race to install different owner cookies.
        if (navigator.locks) await navigator.locks.request("dnd-sheet-owner", prepare);
        else await prepare();
    }
    return request({
        method: revision ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshot, revision, ...(!revision ? { pin, slug: sheetSlug(sheetName(snapshot)) } : {}) }),
    }, id);
}

export async function submitSheetPin(id: string, pin: string, action: "unlock" | "pin") {
    sharedSheetPath(id);
    if (!/^\d{4}$/.test(pin)) throw new SharedSheetError("Enter exactly four digits.", 400);
    const result = await request({
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }),
    }, id, action);
    if (action === "unlock") {
        const verified = await fetchSharedSheet(id);
        if (!verified.canEdit) throw new SharedSheetError("Allow cookies on this site to unlock editing.", 401);
        return verified;
    }
    return result;
}

/** Checks the PIN without changing who can edit, for a change worth guarding. */
export async function verifySheetPin(id: string, pin: string) {
    sharedSheetPath(id);
    if (!/^\d{4}$/.test(pin)) throw new SharedSheetError("Enter exactly four digits.", 400);
    await request({
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }),
    }, id, "verify");
}

/** Give up this browser's PIN unlock; the creator's own access is unaffected. */
export async function lockSharedSheet(id: string) {
    sharedSheetPath(id);
    return request({ method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }, id, "lock");
}
