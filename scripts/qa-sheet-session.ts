import assert from "node:assert/strict";
import {
    decodeSheet, readLocalSheet, readSharedSheet, SheetSession, SHEET_DRAFT_KEY,
    sheetUrl, writeLocalSheet,
} from "../src/lib/sheet-session";
import { createEmptyCharacter, saveCompletedSheet } from "../src/lib/character-storage";

const character = createEmptyCharacter();
character.name = "Éowyn & 火 🐉";
const sheet = new SheetSession(character);
sheet.seed("/page1/name", character.name);
sheet.seed("/page1/score:STR", "10");
sheet.seed("/page1/modifier:STR", 0);
sheet.seed("/page4/appearance", { text: "", image: "data:image/png;base64,aGVsbG8=" });
sheet.seed("/page4/text:Personality Traits", "First line\n第二行 & #?=+%");
sheet.seed("/page3/Level 1, row 1/auto:marker:c", { source: "false", value: "true" });
sheet.seed("/page1/death:success", [true, false, true]);
assert.equal(sheet.canUndo, false, "seeding a sheet is not an edit");

const url = sheetUrl(JSON.parse(JSON.stringify(sheet.snapshot())), "https://example.test/character-sheet?view=full");
assert.equal(new URL(url).search, "?view=full");
assert.deepEqual(readSharedSheet(new URL(url).hash), JSON.parse(JSON.stringify(sheet.snapshot())), "complete Unicode/image/marker round trip");
assert.equal(readSharedSheet("#unrelated"), null);
assert.throws(() => readSharedSheet("#sheet=%broken"));
assert.throws(() => decodeSheet('{"version":2,"fields":{}}'));
assert.throws(() => decodeSheet('{"version":1,"fields":[]}'));
assert.throws(() => decodeSheet('{"version":1,"fields":{},"character":{"name":2}}'));

sheet.markSaved();
assert.equal(sheet.dirty, false);
sheet.set("/page1/score:STR", "16");
sheet.set("/page1/modifier:STR", 3);
await Promise.resolve();
sheet.undo();
assert.equal(sheet.fields["/page1/score:STR"], "10");
assert.equal(sheet.fields["/page1/modifier:STR"], 0, "dependent changes undo together");
assert.equal(sheet.dirty, false, "undoing to the saved values clears dirty state");
sheet.redo();
assert.equal(sheet.fields["/page1/modifier:STR"], 3);
sheet.endGroup();
sheet.set("/page1/name", "A");
await Promise.resolve();
sheet.set("/page1/name", "Al");
await Promise.resolve();
sheet.set("/page1/name", "Alia");
await Promise.resolve();
sheet.undo();
assert.equal(sheet.fields["/page1/name"], character.name, "typing is a single undo group");
sheet.set("/page1/name", "New branch");
await Promise.resolve();
assert.equal(sheet.canRedo, false, "new edits discard redo");
sheet.undo();
sheet.redo();
assert.equal(sheet.fields["/page1/name"], "New branch");
sheet.markSaved();
sheet.seed("/page3/new-field", "");
assert.equal(sheet.dirty, false, "new defaults don't mark a saved sheet dirty");
sheet.set("/page1/name", "Unsaved");
await Promise.resolve();
sheet.seed("/page3/another-field", "");
assert.equal(sheet.dirty, true, "new defaults must not hide existing unsaved changes");

const memory = new Map<string, string>();
const localStorageMock = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => { memory.set(key, value); },
    removeItem: (key: string) => { memory.delete(key); },
};
const documentMock = { cookie: "" };
Object.assign(globalThis, {
    localStorage: localStorageMock,
    document: documentMock,
    location: { hash: new URL(url).hash, protocol: "https:" },
    window: { localStorage: localStorageMock },
});
writeLocalSheet(sheet.snapshot());
const cookie = documentMock.cookie;
assert.ok(cookie.includes("SameSite=Lax") && cookie.includes("Secure"));
assert.deepEqual(readLocalSheet(), JSON.parse(JSON.stringify(sheet.snapshot())), "same-browser resume");
assert.deepEqual(readLocalSheet(new URL(url).hash), JSON.parse(JSON.stringify(sheet.snapshot())), "unsaved draft survives reload of its original link");
assert.equal(readLocalSheet("#sheet=different"), null, "a different shared link must win over the local draft");
sheet.set("/page1/name", "Cookie changed");
writeLocalSheet(sheet.snapshot());
assert.notEqual(documentMock.cookie, cookie, "edits update the cookie revision");
documentMock.cookie = "";
assert.deepEqual(readLocalSheet(), JSON.parse(JSON.stringify(sheet.snapshot())), "local storage still works if cookies are disabled");
memory.set(SHEET_DRAFT_KEY, "broken JSON");
assert.equal(readLocalSheet(), null, "broken local storage doesn't crash the sheet");
writeLocalSheet(sheet.snapshot());
saveCompletedSheet(character);
assert.equal(readLocalSheet(), null, "finishing the creator starts a new sheet");
localStorageMock.setItem = () => { throw new Error("quota"); };
assert.throws(() => writeLocalSheet(sheet.snapshot()), /quota/, "storage failures can be reported without losing in-memory edits");
assert.equal(sheet.fields["/page1/name"], "Cookie changed");
const derived = new SheetSession(undefined, {
    level: "1", override: { source: "+2", value: "+9" },
});
derived.set("level", "5");
derived.derive("override", null);
await Promise.resolve();
derived.undo();
assert.equal(derived.fields.level, "1");
assert.deepEqual(derived.fields.override, { source: "+2", value: "+9" }, "undo restores source and its manual override together");
derived.redo();
assert.equal(derived.fields.level, "5");
assert.equal(derived.fields.override, null);
console.log("Sheet session QA passed: full links, Unicode, images, markers, history, draft precedence, cookies, and storage failures.");
