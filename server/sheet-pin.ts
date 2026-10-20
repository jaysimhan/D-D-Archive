import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derive = promisify(scrypt);
export const ACCESS_PREFIX = "drafts.sharedSheetAccess.";
export const PIN_WINDOW_MS = 15 * 60 * 1000;
export const PIN_ATTEMPTS = 5;
export const EDIT_SECONDS = 30 * 24 * 60 * 60;
export interface SheetAccess {
    _id: string;
    _type: "sharedSheetAccess";
    _rev?: string;
    pinSalt: string;
    pinHash: string;
    attempts: number;
    windowStarted: number;
    grants: string[];
}
export interface AccessRepository {
    getAccess(id: string): Promise<SheetAccess | undefined>;
    writeAccess(access: SheetAccess): Promise<SheetAccess>;
}
export class HttpError extends Error {
    constructor(readonly status: number, message: string) { super(message); }
}
export function requirePin(value: unknown): string {
    if (typeof value !== "string" || !/^\d{4}$/.test(value)) {
        throw new HttpError(400, "Choose a PIN containing exactly four digits.");
    }
    return value;
}
export function tokenHash(token: string) {
    return createHash("sha256").update(token).digest("hex");
}
export async function makeAccess(id: string, pin: string): Promise<SheetAccess> {
    const pinSalt = randomBytes(16).toString("hex");
    return {
        _id: `${ACCESS_PREFIX}${id}`, _type: "sharedSheetAccess",
        pinSalt, pinHash: (await derive(requirePin(pin), pinSalt, 64) as Buffer).toString("hex"),
        attempts: 0, windowStarted: Date.now(), grants: [],
    };
}
export async function matchesPin(access: SheetAccess, pin: string) {
    const supplied = await derive(pin, access.pinSalt, 64) as Buffer;
    const expected = Buffer.from(access.pinHash, "hex");
    return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
export function editorCookieName(id: string) { return `dnd_sheet_edit_${id}`; }
export function hasGrant(access: SheetAccess | undefined, token?: string) {
    if (!access || !token || !/^[a-f0-9]{64}$/.test(token)) return false;
    const hash = tokenHash(token);
    return access.grants.some((grant) => {
        const [stored, expires] = grant.split(":");
        return stored === hash && Number(expires) > Date.now();
    });
}
const conflict = (error: unknown) => (error as { statusCode?: number })?.statusCode === 409;

/** Reserve every attempt atomically, including across concurrent API instances. */
export async function unlockWithPin(store: AccessRepository, id: string, pin: string): Promise<string> {
    requirePin(pin);
    let reserved: SheetAccess | undefined;
    for (let retry = 0; retry < 8; retry++) {
        const current = await store.getAccess(`${ACCESS_PREFIX}${id}`);
        if (!current) throw new HttpError(400, "The creator has not set a PIN for this sheet yet.");
        const now = Date.now();
        const inWindow = now - current.windowStarted < PIN_WINDOW_MS;
        if (inWindow && current.attempts >= PIN_ATTEMPTS) {
            throw new HttpError(429, "Too many PIN attempts. Try again in 15 minutes.");
        }
        try {
            reserved = await store.writeAccess({
                ...current, attempts: inWindow ? current.attempts + 1 : 1,
                windowStarted: inWindow ? current.windowStarted : now,
            });
            break;
        } catch (error) { if (!conflict(error)) throw error; }
    }
    if (!reserved) throw new HttpError(429, "Too many PIN requests. Please try again shortly.");
    if (!await matchesPin(reserved, pin)) throw new HttpError(401, "Incorrect PIN.");
    const token = randomBytes(32).toString("hex");
    for (let retry = 0; retry < 8; retry++) {
        const current = await store.getAccess(`${ACCESS_PREFIX}${id}`);
        if (!current || current.pinHash !== reserved.pinHash) {
            throw new HttpError(401, "The PIN changed. Enter the current PIN.");
        }
        try {
            await store.writeAccess({
                ...current, attempts: 0, windowStarted: Date.now(),
                grants: [
                    ...current.grants.filter((grant) => Number(grant.split(":")[1]) > Date.now()).slice(-49),
                    `${tokenHash(token)}:${Date.now() + EDIT_SECONDS * 1000}`,
                ],
            });
            return token;
        } catch (error) { if (!conflict(error)) throw error; }
    }
    throw new HttpError(429, "Too many PIN requests. Please try again shortly.");
}
