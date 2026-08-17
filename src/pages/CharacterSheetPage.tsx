import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Code2, Download, Edit } from "lucide-react";
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
import { useSheetSpells } from "../hooks/useSheetSuggestions";
import { loadCompletedSheet } from "../lib/character-storage";

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
    // The sheet's fields seed themselves from this on their first render only,
    // so the character has to be in hand before that render — hence a lazy
    // initial state over an effect.
    const [initialCharacter] = useState(() => loadCompletedSheet() ?? undefined);
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
    }, [measure]);

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

    return (
        <div className="character-sheet-page min-h-screen bg-zinc-950 px-0 py-4 sm:px-4 sm:py-8">
            <div className="character-sheet-toolbar mx-auto mb-3 flex w-full max-w-[1700px] flex-wrap justify-end gap-2 px-3 sm:mb-4 sm:gap-3 sm:px-0">
                {initialCharacter && (
                    <button
                        type="button"
                        onClick={() => navigate("/creator")}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <Edit className="size-4" aria-hidden />
                        Edit Character
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => void downloadHtml()}
                    disabled={Boolean(downloading)}
                    title="A single file that opens in any browser, with every blank still editable"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <Code2 className="size-4" aria-hidden />
                    {downloading === "html" ? "Preparing HTML…" : "Download HTML"}
                </button>
                <button
                    type="button"
                    onClick={() => void downloadSheet()}
                    disabled={Boolean(downloading)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <Download className="size-4" aria-hidden />
                    {downloading === "pdf" ? "Preparing PDF…" : "Download PDF"}
                </button>
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
            </div>
            <div
                ref={viewportRef}
                className="character-sheet-viewport mx-auto flex w-full max-w-[1700px] flex-col gap-4 overflow-x-auto overscroll-x-contain sm:gap-8"
            >
                {/* Pages 2-4 sit below page 1 on screen, in the order the PDF uses. */}
                {[
                    <CharacterSheetA4
                        initialCharacter={initialCharacter}
                        onSpellcastingChange={setSpellcasting}
                        onSpeciesChange={setSpecies}
                        onPerceptionModifierChange={setPerceptionModifier}
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
                            {content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
