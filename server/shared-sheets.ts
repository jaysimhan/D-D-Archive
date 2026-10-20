import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@sanity/client";
import { decodeSheet, type SheetSnapshot } from "../src/lib/sheet-session";
import { MAX_SHARED_SHEET_BYTES, SHARED_SHEET_ID } from "../src/lib/shared-sheets";
import {
    ACCESS_PREFIX, EDIT_SECONDS, editorCookieName, hasGrant, HttpError, makeAccess,
    matchesPin, requirePin, unlockWithPin, type SheetAccess, type AccessRepository,
} from "./sheet-pin";

const OWNER_COOKIE = "dnd_sheet_owner";
const ID_PREFIX = "sharedSheet.";
export interface SheetRecord {
    _id: string;
    _rev: string;
    _type: "sharedSheet";
    ownerHash: string;
    payload: string;
}
export interface SheetRepository extends AccessRepository {
    get(id: string): Promise<SheetRecord | undefined>;
    create(record: Omit<SheetRecord, "_rev">, access: SheetAccess): Promise<SheetRecord>;
    update(id: string, revision: string, payload: string): Promise<SheetRecord>;
}

export function sanitySheetRepository(env: Record<string, string | undefined>): SheetRepository {
    const token = env.SANITY_SHEET_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN;
    if (!token) throw new HttpError(503, "Sharing is not configured on this server. Your local draft is safe.");
    const client = createClient({
        projectId: env.SANITY_API_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ylk0tk34",
        dataset: env.SANITY_API_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion: "2024-01-01", useCdn: false, token, timeout: 20_000, maxRetries: 1,
    });
    return {
        get: (id) => client.getDocument<SheetRecord>(id),
        create: async (record, access) => {
            await client.transaction().create(record).create(access).commit({ visibility: "sync" });
            const saved = await client.getDocument<SheetRecord>(record._id);
            if (!saved) throw new Error("Sheet creation did not return a document.");
            return saved;
        },
        update: (id, revision, payload) => client.patch(id).ifRevisionId(revision)
            .set({ payload }).commit({ visibility: "sync" }) as Promise<SheetRecord>,
        getAccess: (id) => client.getDocument<SheetAccess>(id),
        writeAccess: ({ _id, _rev, _type, ...values }) => (_rev
            ? client.patch(_id).ifRevisionId(_rev).set(values).commit({ visibility: "sync" })
            : client.create({ _id, _type, ...values }, { visibility: "sync" })) as Promise<SheetAccess>,
    };
}

function cookieToken(req: IncomingMessage, name = OWNER_COOKIE): string | undefined {
    const value = req.headers.cookie?.split(/;\s*/)
        .find((cookie) => cookie.startsWith(`${name}=`))?.slice(name.length + 1);
    return value && /^[a-f0-9]{64}$/.test(value) ? value : undefined;
}
function digest(token: string) { return createHash("sha256").update(token).digest("hex"); }
function owns(record: SheetRecord, token?: string) {
    return Boolean(token && /^[a-f0-9]{64}$/.test(record.ownerHash) &&
        timingSafeEqual(Buffer.from(record.ownerHash, "hex"), Buffer.from(digest(token), "hex")));
}
function unpack(record: SheetRecord): SheetSnapshot {
    const serialized = gunzipSync(Buffer.from(record.payload, "base64"), {
        maxOutputLength: MAX_SHARED_SHEET_BYTES,
    }).toString("utf8");
    return decodeSheet(serialized);
}
function publicRecord(record: SheetRecord, token?: string, access?: SheetAccess, editorToken?: string) {
    return {
        id: record._id.slice(ID_PREFIX.length), revision: record._rev,
        canEdit: owns(record, token) || hasGrant(access, editorToken),
        canManagePin: owns(record, token), hasPin: Boolean(access), snapshot: unpack(record),
    };
}
function isConflict(error: unknown) {
    return (error as { statusCode?: number })?.statusCode === 409;
}

type ApiRequest = IncomingMessage & { body?: unknown };
async function readBody(req: ApiRequest): Promise<{ snapshot?: unknown; revision?: unknown; pin?: unknown }> {
    let raw: string;
    if (req.body !== undefined) {
        raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    } else {
        const chunks: Buffer[] = [];
        let length = 0;
        for await (const chunk of req) {
            const buffer = Buffer.from(chunk);
            length += buffer.length;
            if (length > MAX_SHARED_SHEET_BYTES + 1024) throw new HttpError(413, "This sheet is too large. Use a smaller appearance image.");
            chunks.push(buffer);
        }
        raw = Buffer.concat(chunks).toString("utf8");
    }
    if (Buffer.byteLength(raw) > MAX_SHARED_SHEET_BYTES + 1024) throw new HttpError(413, "This sheet is too large. Use a smaller appearance image.");
    try {
        const body = JSON.parse(raw);
        if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
        return body;
    } catch { throw new HttpError(400, "Invalid sheet data."); }
}

export function createSheetHandler(repository: () => SheetRepository) {
    return async (req: ApiRequest, res: ServerResponse) => {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "private, no-store");
        res.setHeader("Vary", "Cookie");
        res.setHeader("X-Content-Type-Options", "nosniff");
        const send = (status: number, body: unknown) => {
            res.statusCode = status;
            res.end(JSON.stringify(body));
        };
        try {
            const method = req.method || "GET";
            if (!["GET", "POST", "PUT"].includes(method)) {
                res.setHeader("Allow", "GET, POST, PUT");
                throw new HttpError(405, "Method not allowed.");
            }
            const params = new URL(req.url || "/", "http://localhost").searchParams;
            const id = params.get("id");
            const action = params.get("action");
            if (action && !["unlock", "pin"].includes(action)) throw new HttpError(400, "Unknown sheet action.");
            if (action && method !== "POST") throw new HttpError(405, "Use POST for this action.");
            if (id !== null && !SHARED_SHEET_ID.test(id)) throw new HttpError(400, "Invalid sheet link.");
            const token = cookieToken(req);
            const setCookie = (name: string, value: string, maxAge: number, path: string) => {
                const secure = req.headers["x-forwarded-proto"] === "https" ||
                    Boolean((req.socket as { encrypted?: boolean }).encrypted);
                res.setHeader("Set-Cookie", `${name}=${value}; Path=${path}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`);
            };
            if (method !== "GET") {
                // Browser saves must come from this host, with JSON (never a cross-site form).
                const origin = req.headers.origin;
                const expectedHost = req.headers.host;
                let parsedOrigin: URL | undefined;
                try { if (origin) parsedOrigin = new URL(origin); } catch { /* Reject below. */ }
                if (!parsedOrigin || !expectedHost || !["http:", "https:"].includes(parsedOrigin.protocol) ||
                    parsedOrigin.host !== expectedHost || req.headers["sec-fetch-site"] === "cross-site") {
                    throw new HttpError(403, "Save sheets from this website.");
                }
                if (!req.headers["content-type"]?.startsWith("application/json")) throw new HttpError(415, "Expected JSON.");
                if (!token && method === "POST" && !action) throw new HttpError(401, "Allow cookies on this site to create and edit shared sheets.");
            }
            const store = repository();
            if (method === "GET" && !id) {
                if (!token) {
                    setCookie(OWNER_COOKIE, randomBytes(32).toString("hex"), 31536000, "/");
                }
                send(200, { ready: true });
                return;
            }
            if (!id) throw new HttpError(400, "A sheet ID is required.");
            const recordId = `${ID_PREFIX}${id}`;
            const editToken = cookieToken(req, editorCookieName(id));
            if (method === "GET") {
                const record = await store.get(recordId);
                if (!record || record._type !== "sharedSheet") throw new HttpError(404, "This shared sheet was not found.");
                send(200, publicRecord(record, token, await store.getAccess(`${ACCESS_PREFIX}${id}`), editToken));
                return;
            }
            const body = await readBody(req);
            if (action) {
                const record = await store.get(recordId);
                if (!record || record._type !== "sharedSheet") throw new HttpError(404, "This shared sheet was not found.");
                const pin = requirePin(body.pin);
                if (action === "unlock") {
                    const editor = await unlockWithPin(store, id, pin);
                    setCookie(editorCookieName(id), editor, EDIT_SECONDS, "/api/sheets");
                    send(200, publicRecord(record, token, await store.getAccess(`${ACCESS_PREFIX}${id}`), editor));
                } else {
                    if (!owns(record, token)) throw new HttpError(403, "Only the original creator can change this character’s PIN.");
                    const existing = await store.getAccess(`${ACCESS_PREFIX}${id}`);
                    const access = await makeAccess(id, pin);
                    try {
                        const saved = await store.writeAccess({ ...access, _rev: existing?._rev });
                        send(200, publicRecord(record, token, saved));
                    } catch (error) {
                        if (isConflict(error)) throw new HttpError(409, "The PIN was updated elsewhere. Please try again.");
                        throw error;
                    }
                }
                return;
            }
            let snapshot: SheetSnapshot;
            let serialized: string;
            try {
                serialized = JSON.stringify(body.snapshot);
                snapshot = decodeSheet(serialized);
            } catch { throw new HttpError(400, "Invalid sheet data."); }
            if (Buffer.byteLength(serialized) > MAX_SHARED_SHEET_BYTES) throw new HttpError(413, "This sheet is too large. Use a smaller appearance image.");
            const payload = gzipSync(JSON.stringify(snapshot)).toString("base64");
            if (method === "POST") {
                const pin = requirePin(body.pin);
                const access = await makeAccess(id, pin);
                const record = { _id: recordId, _type: "sharedSheet" as const, ownerHash: digest(token!), payload };
                try {
                    send(201, publicRecord(await store.create(record, access), token, access));
                } catch (error) {
                    if (!isConflict(error)) throw error;
                    // A retried creation uses the same random ID and never overwrites a record.
                    const existing = await store.get(recordId);
                    const existingAccess = await store.getAccess(`${ACCESS_PREFIX}${id}`);
                    if (existing && owns(existing, token) && existing.payload === payload &&
                        existingAccess && await matchesPin(existingAccess, pin)) {
                        send(200, publicRecord(existing, token, existingAccess));
                    } else throw new HttpError(409, "This sheet was already created with different values. Reopen its link before saving again.");
                }
                return;
            }
            const existing = await store.get(recordId);
            if (!existing || existing._type !== "sharedSheet") throw new HttpError(404, "This shared sheet was not found.");
            const access = await store.getAccess(`${ACCESS_PREFIX}${id}`);
            if (!owns(existing, token) && !hasGrant(access, editToken)) throw new HttpError(403, "This link is view-only. Enter the character’s PIN to unlock editing.");
            if (typeof body.revision !== "string" || !body.revision || existing._rev !== body.revision) {
                throw new HttpError(409, "A newer version was saved elsewhere. Download your draft if needed, then reload the saved sheet.");
            }
            try {
                send(200, publicRecord(await store.update(recordId, body.revision, payload), token, access, editToken));
            } catch (error) {
                if (isConflict(error)) throw new HttpError(409, "A newer version was saved elsewhere. Download your draft if needed, then reload the saved sheet.");
                throw error;
            }
        } catch (error) {
            if (error instanceof HttpError) send(error.status, { error: error.message });
            else {
                // SDK errors can contain authorization headers: never log or return them.
                send(503, { error: "The sheet could not be saved or loaded. Please try again; your local draft is safe." });
            }
        }
    };
}
