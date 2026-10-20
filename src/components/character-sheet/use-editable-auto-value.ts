import { useSheetState } from "./sheet-state";
import { useEffect, useRef } from "react";

/**
 * An automatic value that becomes a temporary manual override when edited.
 *
 * Lives on its own so the markers can share it without reaching into the page
 * that draws them.
 */
export function useEditableAutoValue(key: string, automatic: string) {
    const [override, setOverride, clearOverride] = useSheetState<{ source: string; value: string } | null>(
        `auto:${key}`, null,
    );
    const previousAutomatic = useRef(automatic);
    useEffect(() => {
        const previous = previousAutomatic.current;
        previousAutomatic.current = automatic;
        // Invalidate only when leaving the override's known source. Initial
        // async loading can pass through placeholders before reaching it.
        if (override?.source === previous && previous !== automatic) clearOverride(null);
    }, [automatic, override, clearOverride]);

    // Keep the source with the override. Archive data can arrive after a shared
    // sheet mounts; clearing on mount would discard its saved manual values.
    const value = override?.source === automatic ? override.value : automatic;
    const setValue = (next: string) => setOverride({ source: automatic, value: next });
    return [value, setValue] as const;
}
