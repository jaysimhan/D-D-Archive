import { useState } from "react";
import { clampInt } from "../lib/dice";

export const FIELD = "bg-white border border-gray-300 rounded text-[12px] text-gray-900 h-7 " +
    "focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-40";

/**
 * A number box that lets the field sit empty mid-edit. Committing on every
 * keystroke would fight the typist — clearing "20" to type "4" would snap the
 * box back to the minimum before the 4 arrived — so the draft is only pulled
 * back into range once the caret leaves.
 */
export function NumberField({
    value, min, max, onCommit, className = "", title, disabled, format, minChars,
}: {
    value: number;
    min: number;
    max: number;
    onCommit: (next: number) => void;
    className?: string;
    title?: string;
    disabled?: boolean;
    /** How the number reads while the caret is elsewhere — "+3" over "3". */
    format?: (value: number) => string;
    /**
     * Set to size the box to its contents, never narrower than this many
     * characters. Fixed widths clip once the range allows long numbers.
     */
    minChars?: number;
}) {
    const [draft, setDraft] = useState(() => String(value));
    const [editing, setEditing] = useState(false);

    const signed = min < 0;
    const width = Math.max(String(min).length, String(max).length);

    /** Digits only, plus a leading minus where the range allows one. */
    const clean = (raw: string) => {
        const negative = signed && raw.trimStart().startsWith("-");
        return (negative ? "-" : "") + raw.replace(/\D/g, "").slice(0, width);
    };

    const text = editing ? draft : format ? format(value) : String(value);

    return (
        <input
            type="text"
            style={minChars === undefined
                ? undefined
                : { width: `calc(${Math.max(minChars, text.length)}ch + 1.1rem)` }}
            inputMode={signed ? "text" : "numeric"}
            title={title}
            disabled={disabled}
            value={text}
            onFocus={(event) => {
                const field = event.currentTarget;
                setDraft(String(value));
                setEditing(true);
                // Selecting after the swap from formatted to raw text, so the
                // re-render does not drop the selection on the floor — but only
                // if the caret is still here, since select() would otherwise
                // drag focus back out of wherever it moved on to.
                requestAnimationFrame(() => {
                    if (document.activeElement === field) field.select();
                });
            }}
            onChange={(event) => {
                const next = clean(event.target.value);
                setDraft(next);
                if (next !== "" && next !== "-") onCommit(clampInt(Number(next), min, max));
            }}
            onBlur={() => {
                setEditing(false);
                // An abandoned box lands on zero, or on the nearest end of the
                // range to it — never silently on the minimum.
                const settled = draft === "" || draft === "-"
                    ? clampInt(0, min, max)
                    : clampInt(Number(draft), min, max);
                onCommit(settled);
            }}
            className={`${FIELD} px-1 text-center ${className}`}
        />
    );
}
