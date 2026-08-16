import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Download, Edit } from "lucide-react";
import {
    CharacterSheetA4,
    SHEET_HEIGHT,
    SHEET_WIDTH,
} from "../components/character-sheet/CharacterSheetA4";
import { CharacterSheetA4Page2 } from "../components/character-sheet/CharacterSheetA4Page2";
import { CharacterSheetA4Page3 } from "../components/character-sheet/CharacterSheetA4Page3";
import { CharacterSheetA4Page4 } from "../components/character-sheet/CharacterSheetA4Page4";
import type { CharacterData } from "../types/character-creator";

/**
 * Hosts the A4 character sheet. The sheet is built at its native design size
 * (2480 x 3508), so this page scales it down to whatever width is available
 * rather than reflowing it — that keeps the layout identical at every size.
 */
export function CharacterSheetPage({
    initialCharacter,
    onEdit,
}: {
    initialCharacter?: CharacterData;
    onEdit?: () => void;
} = {}) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [scale, setScale] = useState(1);
    const [downloading, setDownloading] = useState(false);

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

    const downloadSheet = async () => {
        const pages = pageRefs.current.filter((page): page is HTMLDivElement => Boolean(page));
        if (!pages.length || downloading) return;

        clearFieldFocus();
        setDownloading(true);
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
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="character-sheet-page min-h-screen bg-zinc-950 px-0 py-4 sm:px-4 sm:py-8">
            <div className="character-sheet-toolbar mx-auto mb-3 flex w-full max-w-[1700px] flex-wrap justify-end gap-2 px-3 sm:mb-4 sm:gap-3 sm:px-0">
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <Edit className="size-4" aria-hidden />
                        Edit Character
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => void downloadSheet()}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <Download className="size-4" aria-hidden />
                    {downloading ? "Preparing PDF…" : "Download PDF"}
                </button>
            </div>
            <div
                ref={viewportRef}
                className="character-sheet-viewport mx-auto flex w-full max-w-[1700px] flex-col gap-4 overflow-x-auto overscroll-x-contain sm:gap-8"
            >
                {/* Pages 2-4 sit below page 1 on screen, in the order the PDF uses. */}
                {[
                    <CharacterSheetA4 initialCharacter={initialCharacter} />,
                    <CharacterSheetA4Page2 />,
                    <CharacterSheetA4Page3 />,
                    <CharacterSheetA4Page4 />,
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
