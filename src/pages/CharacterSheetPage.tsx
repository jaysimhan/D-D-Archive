import { useCallback, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown, Code2, Copy, Download, Edit, FileText, Redo2, Save, Undo2, RefreshCw, KeyRound, Lock, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    CharacterSheetA4,
    EMPTY_SPELLCASTING,
    SHEET_HEIGHT,
    SHEET_WIDTH,
    appendList,
    type SpellcastingSummary,
} from "../components/character-sheet/CharacterSheetA4";
import { CharacterSheetA4Page2 } from "../components/character-sheet/CharacterSheetA4Page2";
import { CharacterSheetA4Page3 } from "../components/character-sheet/CharacterSheetA4Page3";
import { CharacterSheetA4Page4 } from "../components/character-sheet/CharacterSheetA4Page4";
import {
    flattenFieldsForCapture,
    removeScreenOnlyControls,
} from "../components/character-sheet/pdf-fields";
import { expandNotesForPrint } from "../components/character-sheet/entry-notes";
import { useSheetSpells } from "../hooks/useSheetSuggestions";
import { useSharedSheetSession } from "../hooks/useSharedSheetSession";
import { SheetScope, SheetSessionContext } from "../components/character-sheet/sheet-state";
import { SheetPinDialog } from "../components/character-sheet/SheetPinDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";

const toolbarButton = "inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
// Secondary actions are icons only; the title is the hover label, aria-label the spoken one.
const iconButton = toolbarButton.replace("px-4", "px-2.5");
const menuItem = "cursor-pointer items-start gap-3 px-3 py-2 text-white focus:bg-white/10 focus:text-white";

/**
 * html2canvas and jsPDF are fetched at the click rather than shipped with the
 * page, and a deploy renames those files. A tab opened before the deploy asks
 * for names the server no longer has, so the import rejects the moment the
 * button is pressed — reloading the page is the only way out.
 */
const isStaleBuild = (cause: unknown) =>
    cause instanceof Error &&
    /dynamically imported module|module script failed/i.test(cause.message);

/**
 * Hosts the A4 character sheet. The sheet is built at its native design size
 * (2480 x 3508), so this page scales it down to whatever width is available
 * rather than reflowing it — that keeps the layout identical at every size.
 *
 * The page stands on its own at /character-sheet: finishing the creator saves
 * the character and sends the player here, and coming in cold picks that same
 * character up while it is still recent. Failing that the sheet opens blank,
 * which is a perfectly good thing to fill in or print by hand.
 */
export function CharacterSheetPage() {
    const navigate = useNavigate();
    const {
        opened, session, remote, canEdit, saving, save, copyLink, reloadSaved, exitEditing, resumeEditing,
        sessionError, saveMessage, setSaveMessage, loading, loadFailed,
        pinMode, pinError, pinBusy, submitPin, openPin, closePin, confirmWithPin,
    } = useSharedSheetSession();
    const initialCharacter = session.character;
    useSyncExternalStore(session.subscribe, session.getRevision);
    const viewportRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [scale, setScale] = useState(1);
    // Which download is in flight, so each button speaks for itself.
    const [downloading, setDownloading] = useState<"pdf" | "html" | null>(null);
    const [failure, setFailure] = useState<"stale-build" | "failed" | null>(null);
    // The spellbook rows carry a hover card in the HTML download, and this is
    // where their spells come from. Already fetched for pages 3 and 4, so
    // reading it here costs a cache hit rather than a request.
    const spells = useSheetSpells();

    // The spellbook pages head every page with where the character's magic
    // comes from, which pages 1 and 2 hold between them: Class, Sub-class and
    // Species here, feats there. Both report as they are edited, and the two
    // lists are appended into the one blank pages 3 and 4 fill in.
    const [spellcasting, setSpellcasting] = useState<SpellcastingSummary>(EMPTY_SPELLCASTING);
    const [feats, setFeats] = useState("");
    const spellcastingWithFeats = useMemo(
        () => ({ ...spellcasting, sources: appendList([spellcasting.sources, feats]) }),
        [spellcasting, feats],
    );

    // Page 2 fills its Species Traits and Passive Perception in from page 1's
    // Species and Perception. Both stay undefined until page 1 has reported,
    // which is page 2's cue to fall back on the character it was opened with.
    const [species, setSpecies] = useState<string>();
    const [perceptionModifier, setPerceptionModifier] = useState<number | null>();

    // A sheet saved on XP takes the PIN to move to milestones, even mid-edit,
    // so one stray click cannot drop the XP off a shared sheet. Asked once:
    // after that this sheet may go back and forth until it is reopened.
    const milestoneVerified = useRef<number>();
    const confirmMilestoneRef = useRef<() => Promise<boolean>>(async () => true);
    confirmMilestoneRef.current = async () => {
        const saved = remote?.snapshot.fields["/page1/leveling"];
        if (!remote || saved === "milestone" || milestoneVerified.current === session.id) return true;
        const verified = await confirmWithPin();
        if (verified) milestoneVerified.current = session.id;
        return verified;
    };
    // Stable, so page 1 stays memoised across this page's re-renders.
    const confirmMilestone = useCallback(() => confirmMilestoneRef.current(), []);

    const measure = useCallback(() => {
        const el = viewportRef.current;
        if (el) {
            const fitScale = el.clientWidth / SHEET_WIDTH;
            setScale(el.clientWidth < 768 ? Math.max(fitScale, 0.32) : fitScale);
        }
    }, []);

    useLayoutEffect(() => {
        measure();
        const el = viewportRef.current;
        if (!el) return;
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [measure, session, loading]);

    const clearFieldFocus = () => {
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    };

    /** The pages as drawn, or null when there is nothing to download yet. */
    const readyPages = () => {
        const pages = pageRefs.current.filter((page): page is HTMLDivElement => Boolean(page));
        return pages.length && !downloading ? pages : null;
    };

    /**
     * The same sheet as a standalone HTML file: the values as they stand, still
     * editable, still adding up. See `html-export.ts` for what it keeps and what
     * it has to leave behind.
     */
    const downloadHtml = async () => {
        const pages = readyPages();
        if (!pages) return;

        clearFieldFocus();
        setDownloading("html");
        setFailure(null);
        try {
            const { downloadSheetHtml } = await import(
                "../components/character-sheet/html-export"
            );
            await downloadSheetHtml({
                pages,
                spells,
                title: initialCharacter?.name?.trim()
                    ? `${initialCharacter.name.trim()} — Character Sheet`
                    : "Character Sheet for D&D",
            });
        } catch (cause) {
            console.error("Could not build the character sheet HTML", cause);
            setFailure(isStaleBuild(cause) ? "stale-build" : "failed");
        } finally {
            setDownloading(null);
        }
    };

    const downloadSheet = async () => {
        const pages = readyPages();
        if (!pages) return;

        clearFieldFocus();
        setDownloading("pdf");
        setFailure(null);
        try {
            await document.fonts?.ready;
            const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
                import("html2canvas"),
                import("jspdf"),
            ]);
            // @types/html2canvas in this project targets 0.5, while the installed
            // runtime is 1.4 and supports these modern capture options.
            const capture = html2canvas as unknown as (
                element: HTMLElement,
                options: {
                    backgroundColor: string;
                    scale: number;
                    useCORS: boolean;
                    width: number;
                    height: number;
                    windowWidth: number;
                    windowHeight: number;
                    onclone: (documentClone: Document) => void;
                },
            ) => Promise<HTMLCanvasElement>;
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true,
            });

            for (const [index, page] of pages.entries()) {
                const canvas = await capture(page, {
                    backgroundColor: "#ffffff",
                    scale: 1,
                    useCORS: true,
                    width: SHEET_WIDTH,
                    height: SHEET_HEIGHT,
                    windowWidth: SHEET_WIDTH,
                    windowHeight: SHEET_HEIGHT,
                    onclone: (documentClone: Document) => {
                        // Undo the on-screen fit-to-width scale so each page is
                        // captured at its full 2480x3508 design size.
                        documentClone
                            .querySelectorAll("[data-download-sheet]")
                            .forEach((node) => {
                                (node as HTMLElement).style.transform = "none";
                            });
                        removeScreenOnlyControls(documentClone);
                        // Nothing hovers on paper: the features, traits and
                        // feats carry their descriptions, shrunk to fit.
                        expandNotesForPrint(documentClone);
                        flattenFieldsForCapture(documentClone);
                    },
                });

                if (index > 0) pdf.addPage("a4", "portrait");
                pdf.addImage(
                    canvas.toDataURL("image/jpeg", 0.96),
                    "JPEG",
                    0,
                    0,
                    210,
                    297,
                    undefined,
                    "FAST",
                );
            }

            pdf.save("dnd-character-sheet.pdf");
        } catch (cause) {
            // Without this the click looked like it did nothing at all: the
            // button flicked through "Preparing PDF…" and the reason was left
            // in a promise nobody was reading.
            console.error("Could not build the character sheet PDF", cause);
            setFailure(isStaleBuild(cause) ? "stale-build" : "failed");
        } finally {
            setDownloading(null);
        }
    };

    if (loading || loadFailed) {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center text-zinc-200">
                <p role={loadFailed ? "alert" : "status"}>{loadFailed ? opened.error : "Loading shared sheet…"}</p>
                {loadFailed && <button className={toolbarButton} onClick={() => void reloadSaved()}>Try again</button>}
            </div>
        );
    }

    return (
        <SheetSessionContext.Provider key={session.id} value={session}>
        <div className="character-sheet-page min-h-screen bg-zinc-950 px-0 py-4 sm:px-4 sm:py-8">
            {pinMode && <SheetPinDialog key={pinMode} mode={pinMode} busy={pinBusy} error={pinError}
                onClose={closePin} onSubmit={submitPin} />}
            <div className="character-sheet-toolbar mx-auto mb-3 flex w-full max-w-[1700px] flex-wrap justify-end gap-2 px-3 sm:mb-4 sm:gap-3 sm:px-0">
                {canEdit && <>
                <button type="button" onClick={() => { session.undo(); setSaveMessage(""); }} disabled={!canEdit || !session.canUndo}
                    className={iconButton} title="Undo" aria-label="Undo">
                    <Undo2 className="size-4" aria-hidden />
                </button>
                <button type="button" onClick={() => { session.redo(); setSaveMessage(""); }} disabled={!canEdit || !session.canRedo}
                    className={iconButton} title="Redo" aria-label="Redo">
                    <Redo2 className="size-4" aria-hidden />
                </button>
                <button type="button" onClick={() => void save()} disabled={!canEdit || saving} className={toolbarButton}>
                    <Save className="size-4" aria-hidden /> {saving ? "Saving…" : "Save"}
                </button>
                {remote && (
                    <button type="button" onClick={() => void exitEditing()} disabled={saving} className={toolbarButton}
                        title={session.dirty ? "Save your changes and switch to view only" : "Switch to view only"}>
                        <Lock className="size-4" aria-hidden /> Exit editing
                    </button>
                )}
                </>}
                {!canEdit && remote?.canEdit && (
                    <button type="button" onClick={() => void resumeEditing()} className={toolbarButton}>
                        <Pencil className="size-4" aria-hidden /> Edit
                    </button>
                )}
                {!canEdit && !remote?.canEdit && remote?.hasPin && (
                    <button type="button" onClick={() => openPin("unlock")} className={toolbarButton}>
                        <KeyRound className="size-4" aria-hidden /> Unlock editing
                    </button>
                )}
                {canEdit && remote?.canManagePin && (
                    <button type="button" onClick={() => openPin("pin")} disabled={saving} className={iconButton}
                        title={remote.hasPin ? "Change PIN" : "Set PIN"} aria-label={remote.hasPin ? "Change PIN" : "Set PIN"}>
                        <KeyRound className="size-4" aria-hidden />
                    </button>
                )}
                <button type="button" onClick={() => void copyLink()} disabled={saving} className={toolbarButton}>
                    <Copy className="size-4" aria-hidden /> Copy link
                </button>
                {initialCharacter && canEdit && (!remote || remote.canManagePin) && (
                    <button
                        type="button"
                        onClick={() => navigate("/creator")}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <Edit className="size-4" aria-hidden />
                        Edit Character
                    </button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={Boolean(downloading)}>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            <Download className="size-4" aria-hidden />
                            {downloading === "pdf" ? "Preparing PDF…" : downloading === "html" ? "Preparing HTML…" : "Download"}
                            <ChevronDown className="size-4" aria-hidden />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 border-zinc-700 bg-zinc-900 text-white">
                        <DropdownMenuItem className={menuItem} onSelect={() => void downloadSheet()}>
                            <FileText className="mt-0.5 size-4 text-zinc-300" aria-hidden />
                            <span className="flex flex-col">
                                <span className="font-semibold">PDF</span>
                                <span className="text-xs text-zinc-400">Print-ready A4 pages</span>
                            </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className={menuItem} onSelect={() => void downloadHtml()}>
                            <Code2 className="mt-0.5 size-4 text-zinc-300" aria-hidden />
                            <span className="flex flex-col">
                                <span className="font-semibold">HTML</span>
                                <span className="text-xs text-zinc-400">One file that opens in any browser, with every blank still editable</span>
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {remote && (
                    <button type="button" onClick={() => void reloadSaved()} disabled={saving} className={iconButton}
                        title={canEdit ? "Reload saved sheet (replaces this browser’s draft)" : "Refresh sheet"}
                        aria-label={canEdit ? "Reload saved sheet" : "Refresh sheet"}>
                        <RefreshCw className="size-4" aria-hidden />
                    </button>
                )}
                {failure && (
                    <p
                        role="alert"
                        className="flex w-full flex-wrap items-center justify-end gap-2 text-sm text-red-300"
                    >
                        {failure === "stale-build" ? (
                            <>
                                A newer version of the site went live while this page was open, so
                                the PDF tools could not be fetched.
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="rounded-lg border border-red-300/40 px-3 py-1 font-semibold text-red-200 transition-colors hover:bg-red-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-200"
                                >
                                    Reload the page
                                </button>
                            </>
                        ) : (
                            "Something went wrong preparing the PDF — the browser console has the details."
                        )}
                    </p>
                )}
                <p role="status" className="w-full text-right text-sm text-zinc-300">
                    {saveMessage || (!canEdit ? "Shared sheet · View only" : session.dirty ? "Unsaved changes. Save to update your shared link." : "Saved sheet")}
                </p>
                {(opened.error || sessionError) && (
                    <p role="alert" className="w-full text-right text-sm text-red-300">{opened.error || sessionError}</p>
                )}
            </div>
            <fieldset disabled={!canEdit} className="m-0 min-w-0 border-0 p-0">
            <div
                ref={viewportRef}
                onBlurCapture={session.endGroup}
                className="character-sheet-viewport mx-auto flex w-full max-w-[1700px] flex-col gap-4 overflow-x-auto overscroll-x-contain sm:gap-8"
            >
                {/* Pages 2-4 sit below page 1 on screen, in the order the PDF uses. */}
                {[
                    <CharacterSheetA4
                        initialCharacter={initialCharacter}
                        onSpellcastingChange={setSpellcasting}
                        onSpeciesChange={setSpecies}
                        onPerceptionModifierChange={setPerceptionModifier}
                        confirmMilestone={confirmMilestone}
                    />,
                    <CharacterSheetA4Page2
                        initialCharacter={initialCharacter}
                        species={species}
                        perceptionModifier={perceptionModifier}
                        onFeatsChange={setFeats}
                    />,
                    <CharacterSheetA4Page3
                        spellcasting={spellcastingWithFeats}
                        spells={initialCharacter?.selectedSpells}
                    />,
                    <CharacterSheetA4Page4
                        spellcasting={spellcastingWithFeats}
                        spells={initialCharacter?.selectedSpells}
                    />,
                ].map((content, index) => (
                    <div
                        key={index}
                        className="character-sheet-stage relative overflow-hidden"
                        style={{
                            width: `${SHEET_WIDTH * scale}px`,
                            height: `${SHEET_HEIGHT * scale}px`,
                        }}
                    >
                        <div
                            ref={(node) => {
                                pageRefs.current[index] = node;
                            }}
                            data-download-sheet
                            className="character-sheet-scaler origin-top-left"
                            style={{
                                width: `${SHEET_WIDTH}px`,
                                height: `${SHEET_HEIGHT}px`,
                                transform: `scale(${scale})`,
                            }}
                        >
                            <SheetScope name={`page${index + 1}`}>{content}</SheetScope>
                        </div>
                    </div>
                ))}
            </div>
            </fieldset>
        </div>
        </SheetSessionContext.Provider>
    );
}
