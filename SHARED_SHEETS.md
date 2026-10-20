# Permanent sheet links

Save creates `/s/<random-id>` on the current origin. Later saves update the same
Sanity document. Copy link saves pending edits first. Full-data `#sheet=...` links
still open and become a permanent link on their first save.

`api/sheets.ts` is the Vercel endpoint. `npm run dev` and `npm run preview` expose
the same handler through the Vite server. No third-party shortener or domain
change is required.

## Server configuration

Set these environment variables in the Vercel project for each deployment
environment that should support sharing:

- `SANITY_SHEET_WRITE_TOKEN` (preferred) or `SANITY_API_WRITE_TOKEN`: a Sanity
  token with the **Editor** role (read, create, update, including drafts) for
  the selected dataset. A Viewer token can load sheets but cannot create them.
- `SANITY_API_PROJECT_ID` (or `NEXT_PUBLIC_SANITY_PROJECT_ID`).
- `SANITY_API_DATASET` (or `NEXT_PUBLIC_SANITY_DATASET`).

Local development reads the existing `.env` files through Vite. Never give the
write token a `VITE_` or `NEXT_PUBLIC_` prefix. It is used only by the server.
The existing Vercel rewrite already excludes `/api/` and serves `/s/...` through
the React app. Deploy the site normally after configuring the variables.

## Access and persistence

The first Save asks the creator to choose and confirm a four-digit PIN, then
creates the link. Each character has its own link and its own PIN.

- **Creator:** the creating browser receives a random HttpOnly owner cookie; the
  database stores only its SHA-256 fingerprint. The creator can always edit and
  is the only one who sees **Change PIN**.
- **Viewers:** anyone with the link sees a view-only sheet with no Save, Undo or
  Redo. They can download it and see **Unlock editing**.
- **PIN editors:** entering the correct PIN on any browser grants that browser a
  30-day HttpOnly editing cookie for that one sheet. Its saves update the shared
  sheet for everyone. Changing the PIN revokes every earlier PIN unlock.
- **Exit editing:** saves any unsaved changes, then switches to view only. For a
  PIN editor it also revokes that browser's unlock on the server, so editing
  again needs the PIN. The creator's browser keeps its rights and remembers the
  view-only choice per sheet; **Edit** switches back without a PIN.

The PIN is never put in the link or browser storage. It is stored as a salted
scrypt hash in a `drafts.sharedSheetAccess.<id>` document, which Sanity does not
serve to unauthenticated readers. Five wrong PINs lock unlocking for 15 minutes;
attempts are counted atomically, so parallel guesses share the same limit.

Shared sheets use the configured Sanity dataset. They are shareable content,
not private documents; dataset administrators can access them. The API returns
only the sheet, its ID/revision, and what the current browser may do with it.

Editor drafts stay in localStorage, separately for each sheet. A clean draft
never replaces the latest server version. An unsaved draft retains its original
revision, so saving from an outdated tab produces a conflict instead of erasing
newer changes. **Reload saved sheet** explicitly replaces the local draft; users
can download HTML first to preserve it. Open tabs check for newer saves every
15 seconds and on focus; viewers update automatically, editors with unsaved
changes are warned instead.

The full snapshot, including embedded appearance images, can be up to 3 MB of
UTF-8 JSON. Larger sheets remain editable locally and downloadable as HTML.
API writes validate origin, content type, access, size, and revision. Reads
disable caching so opening or refreshing a shared link gets the current version.

## Checks

Run `npm run qa:sheet-session`, `npm run qa:shared-sheets`, `npm run build`,
and `npm run lint`. The API regression suite uses an isolated in-memory
repository, so it does not alter real sheets.

`npm run qa:shared-sheets-live -- <origin>` (default `http://127.0.0.1:5185`)
exercises a running dev/preview server against the real dataset. It creates one
temporary test character and deletes it afterwards.
