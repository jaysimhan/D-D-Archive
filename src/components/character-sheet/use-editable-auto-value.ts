import { useEffect, useState } from "react";

/**
 * An automatic value that becomes a temporary manual override when edited.
 *
 * Lives on its own so the markers can share it without reaching into the page
 * that draws them.
 */
export function useEditableAutoValue(automatic: string) {
    const [override, setOverride] = useState<{ source: string; value: string } | null>(null);

    // Prevent an old override from reappearing if the inputs later return to a
    // previously seen automatic value.
    useEffect(() => setOverride(null), [automatic]);

    const value = override?.source === automatic ? override.value : automatic;
    const setValue = (next: string) => setOverride({ source: automatic, value: next });
    return [value, setValue] as const;
}
