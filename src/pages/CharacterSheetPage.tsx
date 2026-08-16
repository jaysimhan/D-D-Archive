import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
    CharacterSheetA4,
    SHEET_HEIGHT,
    SHEET_WIDTH,
} from "../components/character-sheet/CharacterSheetA4";

/**
 * Hosts the A4 character sheet. The sheet is built at its native design size
 * (2480 x 3508), so this page scales it down to whatever width is available
 * rather than reflowing it — that keeps the layout identical at every size.
 */
export function CharacterSheetPage() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    const measure = useCallback(() => {
        const el = viewportRef.current;
        if (el) setScale(el.clientWidth / SHEET_WIDTH);
    }, []);

    useLayoutEffect(() => {
        measure();
        const el = viewportRef.current;
        if (!el) return;
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
    }, [measure]);

    return (
        <div className="min-h-screen bg-zinc-950 px-4 py-8">
            <div ref={viewportRef} className="mx-auto w-full max-w-[1700px]">
                <div
                    className="relative overflow-hidden"
                    style={{ height: `${SHEET_HEIGHT * scale}px` }}
                >
                    <div
                        className="origin-top-left"
                        style={{
                            width: `${SHEET_WIDTH}px`,
                            height: `${SHEET_HEIGHT}px`,
                            transform: `scale(${scale})`,
                        }}
                    >
                        <CharacterSheetA4 />
                    </div>
                </div>
            </div>
        </div>
    );
}
