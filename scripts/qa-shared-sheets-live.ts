import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { config } from "dotenv";
import { createClient } from "@sanity/client";

// Explicit opt-in smoke test: creates and deletes only these randomly named test records.
config({ path: ".env.local", quiet: true });
config({ quiet: true });
const origin = process.argv[2] || "http://127.0.0.1:5185";
const id = randomBytes(16).toString("hex");
const contentId = `sharedSheet.${id}`;
const accessId = `drafts.sharedSheetAccess.${id}`;
const client = createClient({
    projectId: process.env.SANITY_API_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ylk0tk34",
    dataset: process.env.SANITY_API_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    token: process.env.SANITY_SHEET_WRITE_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false, apiVersion: "2024-01-01", timeout: 20_000, maxRetries: 0,
});
let created = false;
let attempted = false;
async function call(method: string, body?: unknown, cookie?: string, action?: string, bootstrap = false) {
    const response = await fetch(`${origin}/api/sheets${bootstrap ? "" : `?id=${id}${action ? `&action=${action}` : ""}`}`, {
        method,
        headers: { Origin: origin, "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, body: await response.json(), cookie: response.headers.get("set-cookie")?.split(";")[0] };
}
try {
    const ready = await call("GET", undefined, undefined, undefined, true);
    assert.equal(ready.status, 200, ready.body.error);
    assert.ok(ready.cookie);
    const snapshot = { version: 1, fields: { "/page1/characterName": "Temporary shared-sheet QA", "/page1/characterLevel": "2" } };
    attempted = true;
    const saved = await call("POST", { snapshot, pin: "0042" }, ready.cookie);
    assert.equal(saved.status, 201, saved.body.error);
    created = true;
    assert.equal(saved.body.canManagePin, true);
    const viewer = await call("GET");
    assert.equal(viewer.status, 200);
    assert.equal(viewer.body.canEdit, false);
    assert.equal(viewer.body.canManagePin, false);
    assert.equal((await call("PUT", { snapshot, revision: saved.body.revision })).status, 403);
    assert.equal((await call("POST", { pin: "1111" }, undefined, "unlock")).status, 401);
    const unlocked = await call("POST", { pin: "0042" }, undefined, "unlock");
    assert.equal(unlocked.status, 200, unlocked.body.error);
    assert.ok(unlocked.cookie);
    assert.equal(unlocked.body.canEdit, true);
    const changed = { ...snapshot, fields: { ...snapshot.fields, "/page1/characterLevel": "5" } };
    const edited = await call("PUT", { snapshot: changed, revision: saved.body.revision }, unlocked.cookie);
    assert.equal(edited.status, 200, edited.body.error);
    assert.equal(edited.body.id, saved.body.id);
    assert.equal((await call("GET")).body.snapshot.fields["/page1/characterLevel"], "5");
    assert.equal((await call("PUT", { snapshot, revision: saved.body.revision }, ready.cookie)).status, 409);
    assert.equal((await call("POST", { pin: "9876" }, ready.cookie, "pin")).status, 200);
    assert.equal((await call("GET", undefined, unlocked.cookie)).body.canEdit, false);
    const anonymous = client.withConfig({ token: undefined });
    try {
        const privateData = await anonymous.getDocument(accessId);
        assert.equal(privateData, undefined, "PIN data must not be readable without authentication");
    } catch (error) {
        assert.equal((error as { statusCode?: number }).statusCode, 403, "Unexpected unauthenticated-read result");
    }
    const route = await fetch(`${origin}/s/${id}`);
    assert.equal(route.status, 200);
    assert.match(await route.text(), /id="root"/);
    console.log("Live check passed: creator PIN, owner access, view-only links, cross-browser unlock/save, updated shared values, conflicts, PIN revocation, private PIN storage, and /s routing.");
} catch (error) {
    // Never print SDK requests or headers containing a token.
    console.error(error instanceof Error && error.name === "AssertionError" ? error.message : "Live check failed; backend/network access needs attention.");
    process.exitCode = 1;
} finally {
    if (created || attempted) {
        try {
            await client.transaction().delete(contentId).delete(accessId).commit({ visibility: "sync" });
            console.log("Temporary test character and PIN record removed.");
        } catch {
            console.error(`Cleanup needed for test records only: ${contentId}, ${accessId}`);
            process.exitCode = 1;
        }
    }
}
