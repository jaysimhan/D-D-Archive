import assert from "node:assert/strict";
import { Readable } from "node:stream";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createSheetHandler, sanitySheetRepository, type SheetRecord, type SheetRepository } from "../server/shared-sheets";
import { MAX_SHARED_SHEET_BYTES, sharedSheetPath } from "../src/lib/shared-sheets";
import { SheetSession, readSheetDraft, writeLocalSheet } from "../src/lib/sheet-session";

import { ACCESS_PREFIX, PIN_WINDOW_MS, type SheetAccess } from "../server/sheet-pin";

const records = new Map<string, SheetRecord>();
const accessRecords = new Map<string, SheetAccess>();
let revision = 0;
const conflict = () => Object.assign(new Error("conflict"), { statusCode: 409 });
const repository: SheetRepository = {
    async get(id) { return records.get(id); },
    async getAccess(id) { return accessRecords.get(id); },
    async writeAccess(access) {
        const current = accessRecords.get(access._id);
        if (current && current._rev !== access._rev) throw conflict();
        const saved = { ...access, _rev: `access-${++revision}` };
        accessRecords.set(access._id, saved);
        return saved;
    },
    async create(record, access) {
        if (records.has(record._id) || accessRecords.has(access._id)) throw conflict();
        accessRecords.set(access._id, { ...access, _rev: `access-${++revision}` });
        const saved = { ...record, _rev: `rev-${++revision}` };
        records.set(record._id, saved);
        return saved;
    },
    async update(id, previous, payload) {
        const current = records.get(id);
        if (!current || current._rev !== previous) throw conflict();
        const saved = { ...current, payload, _rev: `rev-${++revision}` };
        records.set(id, saved);
        return saved;
    },
};
const handler = createSheetHandler(() => repository);
const id = "a".repeat(32);
const id2 = "b".repeat(32);
const snapshot = {
    version: 1 as const,
    fields: {
        "/page1/characterName": "Éowyn & 火 🐉",
        "/page1/death:success": [true, false, true],
        "/page4/appearance": { text: "", image: "data:image/png;base64,aGVsbG8=" },
    },
};

async function call(method: string, sheetId?: string, body?: unknown, cookie?: string,
    headers: Record<string, string> = {}, selectedHandler = handler, action?: string) {
    const request = Readable.from(body === undefined ? [] : [JSON.stringify(body)]) as IncomingMessage;
    request.method = method;
    request.url = `/api/sheets${sheetId ? `?id=${encodeURIComponent(sheetId)}` : ""}${action ? `&action=${action}` : ""}`;
    request.headers = {
        host: "archive.example", origin: "https://archive.example",
        "content-type": "application/json", "x-forwarded-proto": "https", ...headers,
        ...(cookie ? { cookie } : {}),
    };
    Object.defineProperty(request, "socket", { value: {} });
    const result = { status: 0, headers: {} as Record<string, string>, body: null as any };
    const response = {
        statusCode: 200,
        setHeader(key: string, value: string) { result.headers[key] = value; },
        end(value: string) { result.status = this.statusCode; result.body = JSON.parse(value); },
    } as ServerResponse;
    await selectedHandler(request, response);
    return result;
}

const ready = await call("GET");
assert.equal(ready.status, 200);
assert.match(ready.headers["Set-Cookie"], /HttpOnly; SameSite=Lax; Max-Age=31536000; Secure/);
const cookie = ready.headers["Set-Cookie"].split(";")[0];
assert.equal((await call("POST", id, { snapshot, pin: "0042" })).status, 401, "writes require owner cookie");
assert.equal((await call("POST", id, { snapshot, pin: "0042" }, cookie, { origin: "https://other.example" })).status, 403);
assert.equal((await call("POST", id, { snapshot, pin: "0042" }, cookie, { "content-type": "text/plain" })).status, 415);
assert.equal((await call("GET", "invalid/id")).status, 400);
assert.equal((await call("DELETE", id, undefined, cookie)).status, 405);
assert.equal((await call("GET", id)).status, 404);

const created = await call("POST", id, { snapshot, pin: "0042" }, cookie);
assert.equal(created.status, 201);
assert.equal(created.body.canEdit, true);
assert.deepEqual(created.body.snapshot, snapshot);
assert.equal(created.body.id, id);
assert.ok(!JSON.stringify(created.body).includes("ownerHash"), "owner fingerprint is never returned");
assert.ok(!JSON.stringify(records.get(`sharedSheet.${id}`)).includes(cookie.split("=")[1]), "raw owner token is never stored");
assert.equal((await call("POST", id, { snapshot, pin: "0042" }, cookie)).status, 200, "identical retries are idempotent");
assert.equal(records.size, 1);
const changed = { ...snapshot, fields: { ...snapshot.fields, "/page1/characterName": "Updated name" } };
assert.equal((await call("POST", id, { snapshot: changed, pin: "0042" }, cookie)).status, 409, "create cannot overwrite");
const stranger = "dnd_sheet_owner=" + "f".repeat(64);
assert.equal((await call("POST", id, { snapshot, pin: "0042" }, stranger)).status, 409);
assert.equal((await call("PUT", id, { snapshot: changed, revision: created.body.revision }, stranger)).status, 403);
assert.equal((await call("PUT", id, { snapshot: changed, revision: "old" }, cookie)).status, 409);
assert.equal((await call("PUT", id, { snapshot: changed, pin: "0042" }, cookie)).status, 409);
const viewer = await call("GET", id);
assert.equal(viewer.body.canEdit, false);
assert.equal(viewer.headers["Cache-Control"], "private, no-store");
assert.deepEqual(viewer.body.snapshot, snapshot);
assert.equal((await call("GET", id, undefined, cookie)).body.canEdit, true);

const saved = await call("PUT", id, { snapshot: changed, revision: created.body.revision }, cookie);
assert.equal(saved.status, 200);
assert.equal(saved.body.id, created.body.id, "updates keep the same link");
assert.notEqual(saved.body.revision, created.body.revision);
assert.deepEqual((await call("GET", id)).body.snapshot, changed, "viewers get the latest saved version");
assert.equal((await call("PUT", id, { snapshot, revision: created.body.revision }, cookie)).status, 409, "stale tabs cannot overwrite");
const racingHandler = createSheetHandler(() => ({ ...repository, async update() { throw conflict(); } }));
assert.equal((await call("PUT", id, { snapshot, revision: saved.body.revision }, cookie, {}, racingHandler)).status, 409, "atomic revision guard handles writes racing after authorization");
assert.equal((await call("POST", id2, { snapshot: { version: 2, fields: {} } }, cookie)).status, 400);
assert.equal((await call("POST", id2, { snapshot: { version: 1, fields: { huge: "x".repeat(MAX_SHARED_SHEET_BYTES + 1024) } } }, cookie)).status, 413);
const broken = createSheetHandler(() => { throw new Error("secret token"); });
const unavailable = await call("GET", id, undefined, undefined, {}, broken);
assert.equal(unavailable.status, 503);
assert.ok(!JSON.stringify(unavailable).includes("secret token"));
assert.throws(() => sanitySheetRepository({}), /not configured/);
assert.equal(sharedSheetPath(id), `/s/${id}`);
assert.throws(() => sharedSheetPath("https://other.example"));

// A save completing after another edit must not falsely mark the new edit saved.
const session = new SheetSession(undefined, { name: "Before" });
const sent = session.snapshot();
session.set("name", "Typed during save");
session.markSaved(sent.fields);
assert.equal(session.dirty, true);
const readonly = new SheetSession(undefined, snapshot.fields, true, true);
readonly.set("/page1/characterName", "Unauthorized");
assert.equal(readonly.fields["/page1/characterName"], snapshot.fields["/page1/characterName"]);

// Each character has a private, salted PIN and separately scoped editor grants.
assert.equal(created.body.hasPin, true);
assert.equal(created.body.canManagePin, true);
assert.equal(viewer.body.canManagePin, false);
assert.ok(!JSON.stringify(created.body).includes("pinHash"));
assert.ok(!JSON.stringify(records.get(`sharedSheet.${id}`)).includes("pinHash"));
assert.ok(accessRecords.has(`${ACCESS_PREFIX}${id}`));
assert.equal((await call("POST", id2, { snapshot }, cookie)).status, 400, "creation requires a creator-chosen PIN");
assert.equal((await call("POST", id2, { snapshot, pin: "123" }, cookie)).status, 400);
const pinCall = (action: string, pin: string, auth?: string, target = id) =>
    call("POST", target, { pin }, auth, {}, handler, action);
for (let attempt = 0; attempt < 5; attempt++) {
    assert.equal((await pinCall("unlock", "1111")).status, 401);
}
assert.equal((await pinCall("unlock", "0042")).status, 429, "attempt limit persists across requests and devices");
const locked = accessRecords.get(`${ACCESS_PREFIX}${id}`)!;
accessRecords.set(locked._id, { ...locked, windowStarted: Date.now() - PIN_WINDOW_MS - 1 });
const unlocked = await pinCall("unlock", "0042");
assert.equal(unlocked.status, 200, "leading-zero PIN unlocks after the attempt window");
assert.equal(unlocked.body.canEdit, true);
assert.equal(unlocked.body.canManagePin, false);
assert.match(unlocked.headers["Set-Cookie"], /HttpOnly/);
const editorCookie = unlocked.headers["Set-Cookie"].split(";")[0];
assert.equal((await call("GET", id, undefined, editorCookie)).body.canEdit, true);
const editorSave = await call("PUT", id, { snapshot, revision: saved.body.revision }, editorCookie);
assert.equal(editorSave.status, 200, "a different browser with the PIN can save");
assert.deepEqual((await call("GET", id)).body.snapshot, snapshot, "everyone sees the editor's saved values");
assert.equal((await pinCall("pin", "4321", editorCookie)).status, 403, "PIN editors cannot change the creator's PIN");
assert.equal((await call("POST", id2, { snapshot, pin: "9999" }, cookie)).status, 201);
assert.equal((await call("GET", id2, undefined, editorCookie)).body.canEdit, false, "one character's grant cannot edit another");
assert.equal((await pinCall("unlock", "0042", undefined, id2)).status, 401);
assert.equal((await pinCall("unlock", "9999", undefined, id2)).status, 200);
assert.equal((await pinCall("pin", "4321", cookie)).status, 200);
assert.equal((await call("GET", id, undefined, editorCookie)).body.canEdit, false, "changing a PIN revokes previous editor grants");
assert.equal((await call("PUT", id, { snapshot, revision: editorSave.body.revision }, editorCookie)).status, 403);
assert.equal((await pinCall("unlock", "0042")).status, 401);
assert.equal((await pinCall("unlock", "4321")).status, 200);
assert.equal((await call("GET", id, undefined, cookie)).body.canEdit, true, "original creator keeps access");
const concurrent = await Promise.all(Array.from({ length: 8 }, () => pinCall("unlock", "1111")));
assert.equal(concurrent.filter((result) => result.status === 401).length, 5, "parallel guesses reserve attempts atomically");
assert.equal(concurrent.filter((result) => result.status === 429).length, 3);

const memory = new Map<string, string>();
Object.assign(globalThis, {
    localStorage: { getItem: (key: string) => memory.get(key) ?? null, setItem: (key: string, value: string) => memory.set(key, value) },
    document: { cookie: "" },
    location: { hash: "", pathname: `/s/${id}`, protocol: "https:" },
});
writeLocalSheet(snapshot, { remote: { id, revision: "one" }, dirty: true });
writeLocalSheet(changed, { remote: { id: id2, revision: "two" }, dirty: true });
assert.deepEqual(readSheetDraft(id)?.snapshot, snapshot, "drafts are isolated by sheet ID");
assert.equal(readSheetDraft(id)?.remote?.revision, "one");
assert.deepEqual(readSheetDraft(id2)?.snapshot, changed);
assert.equal(readSheetDraft("c".repeat(32)), null);
console.log("Shared sheets QA passed: creation, stable links, live reads, owner/viewer access, retry safety, conflicts, validation, size limits, draft isolation, and in-flight edits, per-character PINs, cross-device editing, PIN revocation, and concurrent guess limits.");
