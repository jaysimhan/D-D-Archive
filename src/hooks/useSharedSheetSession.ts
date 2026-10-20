import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadCompletedSheet } from "../lib/character-storage";
import {
    readLocalSheet, readSharedSheet, readSheetDraft, SheetSession, writeLocalSheet,
} from "../lib/sheet-session";
import {
    fetchSharedSheet, lockSharedSheet, saveSharedSheet, SharedSheetError, SHARED_SHEET_ID,
    sharedSheetPath, submitSheetPin, type SharedSheet,
} from "../lib/shared-sheets";
import { collectCharacterSpells } from "../utils/character-spells";

interface OpenedSheet {
    session: SheetSession;
    remote?: SharedSheet;
    error: string;
    loading?: boolean;
}

function openLocal(): OpenedSheet {
    try {
        const shared = readSharedSheet(window.location.hash);
        // A legacy full-data link always wins over an unrelated browser draft.
        const stored = (shared ? readLocalSheet(window.location.hash) : readLocalSheet()) ?? shared;
        if (stored) return {
            session: new SheetSession(stored.character, stored.fields,
                Boolean(shared && JSON.stringify(shared.fields) === JSON.stringify(stored.fields))),
            error: "",
        };
        const character = loadCompletedSheet();
        return {
            session: new SheetSession(character
                ? { ...character, selectedSpells: collectCharacterSpells(character) } : undefined),
            error: "",
        };
    } catch {
        return { session: new SheetSession(undefined), error: "This sheet link could not be read. Check that you copied the complete link." };
    }
}

// "Exit editing" is remembered per sheet, so a reload stays view-only.
const viewOnlyKey = (id: string) => `dnd-sheet-view-only:${id}`;
const viewOnlySheets = new Set<string>(); // Used when browser storage is unavailable.
function isViewOnly(id: string) {
    try { return localStorage.getItem(viewOnlyKey(id)) === "1"; } catch { return viewOnlySheets.has(id); }
}
function setViewOnly(id: string, viewOnly: boolean) {
    if (viewOnly) viewOnlySheets.add(id); else viewOnlySheets.delete(id);
    try {
        if (viewOnly) localStorage.setItem(viewOnlyKey(id), "1"); else localStorage.removeItem(viewOnlyKey(id));
    } catch { /* The in-memory flag still applies to this tab. */ }
}

function openRemote(remote: SharedSheet, restoreDraft: boolean): OpenedSheet {
    const editing = remote.canEdit && !isViewOnly(remote.id);
    const draft = restoreDraft && editing ? readSheetDraft(remote.id) : null;
    const hasDraft = draft?.dirty && draft.remote?.id === remote.id;
    const snapshot = hasDraft ? draft.snapshot : remote.snapshot;
    const session = new SheetSession(snapshot.character, snapshot.fields, true, !editing);
    session.markSaved(remote.snapshot.fields);
    // Preserve the draft's base revision: an older tab must not overwrite newer data.
    const stale = Boolean(hasDraft && draft.remote?.revision !== remote.revision);
    return {
        session,
        remote: hasDraft ? { ...remote, revision: draft.remote!.revision } : remote,
        error: stale ? "This browser has an older unsaved draft. Download it if needed, then reload the saved sheet." : "",
    };
}

export function useSharedSheetSession() {
    const { sheetId } = useParams<{ sheetId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [opened, setOpened] = useState<OpenedSheet>(() => sheetId
        ? { session: new SheetSession(undefined), error: "", loading: true } : openLocal());
    const [sessionError, setSessionError] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const [pinMode, setPinMode] = useState<"create" | "unlock" | "pin" | null>(null);
    const [pinError, setPinError] = useState("");
    const [pinBusy, setPinBusy] = useState(false);
    const pinRequest = useRef(false);
    const copyAfterCreate = useRef(false);
    const savingRef = useRef(false);
    const mounted = useRef(true);
    const discardedSessions = useRef(new Set<number>());
    const pendingId = useRef<string>();
    const loadedSource = useRef(sheetId ? "" : `${location.pathname}${location.hash}`);
    const source = `${location.pathname}${location.hash}`;
    const latest = useRef(opened);
    latest.current = opened;
    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        // Returning to the plain sheet resumes its last permanent link.
        if (!sheetId && !location.hash) {
            const previous = readSheetDraft()?.remote?.id;
            if (previous && SHARED_SHEET_ID.test(previous)) {
                navigate(sharedSheetPath(previous), { replace: true });
                return;
            }
        }
        if (loadedSource.current === source) return;
        setSessionError("");
        setSaveMessage("");
        setPinMode(null);
        setPinError("");
        pendingId.current = undefined;
        if (!sheetId) {
            loadedSource.current = source;
            setOpened(openLocal());
            return;
        }
        const abort = new AbortController();
        setOpened({ session: new SheetSession(undefined), error: "", loading: true });
        void fetchSharedSheet(sheetId, abort.signal).then((remote) => {
            if (abort.signal.aborted) return;
            loadedSource.current = source;
            setOpened(openRemote(remote, true));
        }).catch((error: Error) => {
            if (abort.signal.aborted) return;
            loadedSource.current = source;
            setOpened({ session: new SheetSession(undefined), error: error.message });
        });
        return () => abort.abort();
    }, [source, sheetId, location.hash, navigate]);

    const { session, remote } = opened;
    const canEdit = !session.readOnly && !opened.loading && (!sheetId || Boolean(remote));
    useEffect(() => {
        if (!canEdit || (opened.error && !remote)) return;
        const persist = () => {
            if (discardedSessions.current.has(session.id)) return;
            try {
                writeLocalSheet(session.snapshot(), {
                    sourcePath: remote ? sharedSheetPath(remote.id) : "/character-sheet",
                    sourceHash: remote ? "" : location.hash,
                    remote: remote ? { id: remote.id, revision: remote.revision } : undefined,
                    dirty: session.dirty,
                });
            } catch {
                setSessionError("Browser storage is unavailable or full. Use Save to keep your changes online.");
            }
        };
        let timer = window.setTimeout(persist, 250);
        const unsubscribe = session.subscribe(() => {
            window.clearTimeout(timer);
            timer = window.setTimeout(persist, 250);
        });
        window.addEventListener("pagehide", persist);
        return () => {
            unsubscribe();
            window.clearTimeout(timer);
            window.removeEventListener("pagehide", persist);
            persist();
        };
    }, [session, remote, canEdit, opened.error, location.hash]);

    const save = async (pin?: string): Promise<string | null> => {
        if (!canEdit || savingRef.current) return null;
        if (!remote && !pin) {
            setPinError("");
            setPinMode("create");
            return null;
        }
        savingRef.current = true;
        setSaving(true);
        setSessionError("");
        const active = session;
        const snapshot = active.snapshot();
        try {
            const id = remote?.id ?? (pendingId.current ??= crypto.randomUUID().replace(/-/g, ""));
            const saved = await saveSharedSheet(snapshot, id, remote?.revision, pin);
            const path = sharedSheetPath(saved.id);
            active.markSaved(snapshot.fields); // Edits made during the request remain unsaved.
            const updated = { session: active, remote: saved, error: "" };
            if (mounted.current && latest.current.session === active) {
                latest.current = updated;
                loadedSource.current = path;
                setOpened(updated);
                navigate(path, { replace: true });
                setSaveMessage("Saved. Your shared link now shows this version.");
                setPinMode(null);
            }
            try {
                writeLocalSheet(active.snapshot(), {
                    sourcePath: path, sourceHash: "",
                    remote: { id: saved.id, revision: saved.revision }, dirty: active.dirty,
                });
            } catch {
                setSessionError("Saved online, but this browser could not keep a local draft.");
            }
            return new URL(path, window.location.origin).href;
        } catch (error) {
            if (mounted.current && latest.current.session === active) {
                setSessionError(error instanceof Error ? error.message : "Could not save. Your local draft is safe.");
                if (pin) setPinError(error instanceof Error ? error.message : "Could not create the link.");
                if (error instanceof SharedSheetError && error.status === 403) {
                    setSaveMessage("Enter the character’s PIN to unlock editing.");
                }
            }
            return null;
        } finally {
            savingRef.current = false;
            if (mounted.current) setSaving(false);
        }
    };
    const copy = async (link: string) => {
        try {
            await navigator.clipboard.writeText(link);
            setSaveMessage("Shared link copied.");
        } catch {
            setSaveMessage("Copy the link from your browser’s address bar.");
        }
    };
    const copyLink = async () => {
        if (!remote) copyAfterCreate.current = true;
        const link = remote && (!canEdit || !session.dirty)
            ? new URL(sharedSheetPath(remote.id), window.location.origin).href : await save();
        if (!link) return;
        await copy(link);
    };
    const submitPin = async (pin: string) => {
        if (pinRequest.current || !pinMode) return;
        pinRequest.current = true;
        setPinBusy(true);
        setPinError("");
        try {
            if (pinMode === "create") {
                const link = await save(pin);
                if (link && copyAfterCreate.current) await copy(link);
                if (link) copyAfterCreate.current = false;
            } else if (remote) {
                const updated = await submitSheetPin(remote.id, pin, pinMode);
                if (!mounted.current || latest.current.remote?.id !== updated.id) return;
                if (pinMode === "unlock") {
                    setViewOnly(updated.id, false);
                    setOpened(openRemote(updated, true));
                    setSaveMessage("Editing unlocked. Save your changes to update the shared sheet.");
                } else {
                    // Changing a PIN must not change the base revision of unsaved edits.
                    setOpened((current) => ({
                        ...current,
                        remote: { ...updated, revision: current.remote!.revision, snapshot: current.remote!.snapshot },
                    }));
                    setSaveMessage("PIN updated. Other browsers need the new PIN to edit.");
                }
                setSessionError("");
                setPinMode(null);
            }
        } catch (error) {
            setPinError(error instanceof Error ? error.message : "Could not verify the PIN.");
        } finally {
            pinRequest.current = false;
            if (mounted.current) setPinBusy(false);
        }
    };
    const exitEditing = async () => {
        if (!remote || !canEdit || savingRef.current) return;
        // Unsaved edits are saved first; a failed save keeps the editor open.
        if (session.dirty && !await save()) return;
        const current = latest.current.remote;
        if (!current || !mounted.current) return;
        setViewOnly(current.id, true);
        setSessionError("");
        if (current.canManagePin) {
            // The creator's browser keeps its rights; it only hides editing.
            setOpened(openRemote(current, false));
            setSaveMessage("View only. Use Edit to make changes again.");
            return;
        }
        try {
            const updated = await lockSharedSheet(current.id);
            if (!mounted.current || latest.current.remote?.id !== updated.id) return;
            setOpened(openRemote(updated, false));
            setSaveMessage("View only. Enter the PIN to edit again.");
        } catch (error) {
            setOpened(openRemote(current, false));
            setSessionError(error instanceof Error ? error.message : "Could not end editing access.");
        }
    };
    const resumeEditing = async () => {
        const id = latest.current.remote?.id;
        if (!id) return;
        setSessionError("");
        try {
            const updated = await fetchSharedSheet(id);
            if (!mounted.current || latest.current.remote?.id !== id) return;
            setViewOnly(id, false);
            setOpened(openRemote(updated, true));
            setSaveMessage(updated.canEdit ? "Editing enabled." : "View only. Enter the PIN to edit.");
        } catch (error) {
            setSessionError(error instanceof Error ? error.message : "Could not load the sheet.");
        }
    };
    const reloadSaved = useCallback(async () => {
        const id = latest.current.remote?.id ?? sheetId;
        if (!id || savingRef.current) return;
        setSessionError("");
        try {
            const saved = await fetchSharedSheet(id);
            // Ignore a response if navigation switched to another sheet.
            if (!mounted.current || (latest.current.remote?.id ?? sheetId) !== id) return;
            discardedSessions.current.add(latest.current.session.id);
            setOpened(openRemote(saved, false));
            setSaveMessage("Loaded the latest saved sheet.");
        } catch (error) {
            setSessionError(error instanceof Error ? error.message : "Could not reload the sheet.");
        }
    }, [sheetId]);

    // Open viewer tabs follow shared saves; a dirty editor keeps its draft and revision.
    useEffect(() => {
        if (!remote?.id) return;
        const id = remote.id;
        const abort = new AbortController();
        let running = false;
        const refresh = async () => {
            if (running || document.visibilityState === "hidden" || savingRef.current || pinRequest.current) return;
            running = true;
            try {
                const updated = await fetchSharedSheet(id, abort.signal);
                const current = latest.current;
                if (abort.signal.aborted || current.remote?.id !== id) return;
                if (updated.canEdit !== current.remote.canEdit) {
                    setOpened(openRemote(updated, false));
                    setSaveMessage(updated.canEdit ? "Editing unlocked." : "View only. Enter the PIN to edit.");
                } else if (updated.revision !== current.remote.revision) {
                    if (current.remote.canEdit && current.session.dirty) {
                        setSessionError("Another editor saved a newer version. Download your draft if needed, then reload the saved sheet.");
                    } else {
                        setOpened(openRemote(updated, false));
                        setSaveMessage("Showing the latest saved sheet.");
                    }
                }
            } catch { /* A temporary network failure leaves the current sheet visible. */ }
            finally { running = false; }
        };
        const timer = window.setInterval(() => void refresh(), 15000);
        window.addEventListener("focus", refresh);
        document.addEventListener("visibilitychange", refresh);
        return () => {
            abort.abort();
            window.clearInterval(timer);
            window.removeEventListener("focus", refresh);
            document.removeEventListener("visibilitychange", refresh);
        };
    }, [remote?.id]);

    return {
        opened, session, remote, canEdit, saving, save, copyLink, reloadSaved, exitEditing, resumeEditing,
        sessionError, saveMessage, setSaveMessage,
        pinMode, pinError, pinBusy, submitPin,
        openPin: (mode: "unlock" | "pin") => { setPinError(""); setPinMode(mode); },
        closePin: () => { if (!pinRequest.current) { setPinMode(null); copyAfterCreate.current = false; } },
        loading: opened.loading || (Boolean(sheetId) && loadedSource.current !== source),
        loadFailed: Boolean(sheetId && !opened.loading && !remote && opened.error),
    };
}
