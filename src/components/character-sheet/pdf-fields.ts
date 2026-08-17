/**
 * html2canvas paints an <input> or <textarea> value itself instead of sending
 * it through its normal text path, and it gets the placement wrong: the value
 * is drawn from the top of the field rather than centred in it — tall values
 * lose their upper half to the field's clip — and a textarea is flattened onto
 * one unwrapped line.
 *
 * Swapping every field for a plain element that carries the same box, font and
 * text puts the value back on the ordinary text path, which lands where the
 * browser puts it. This only ever runs against html2canvas's throwaway clone
 * of the sheet, never the live DOM.
 */

/** Copied verbatim from the field; the box itself is pinned separately. */
const COPIED_PROPERTIES = [
    "position",
    "top",
    "right",
    "bottom",
    "left",
    "margin",
    "padding",
    "border",
    "borderRadius",
    "backgroundColor",
    "backgroundImage",
    "boxShadow",
    "opacity",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "letterSpacing",
    "textTransform",
    "textAlign",
    "direction",
] as const;

const JUSTIFY_BY_TEXT_ALIGN: Record<string, string> = {
    center: "center",
    right: "flex-end",
    end: "flex-end",
};

/**
 * Drops the controls that only exist to fill the sheet in — the feats search
 * field and anything else marked `data-screen-only`. They are taken out rather
 * than hidden so whatever they sat above takes the space back, and this runs
 * before the fields are flattened so those boxes are measured after the gap
 * closes.
 */
export function removeScreenOnlyControls(root: ParentNode) {
    root.querySelectorAll("[data-screen-only]").forEach((node) => node.remove());
}

export function flattenFieldsForCapture(root: ParentNode) {
    const fields = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        'input[type="text"], input:not([type]), textarea',
    );

    fields.forEach((field) => {
        const view = field.ownerDocument.defaultView;
        if (!view) return;

        const style = view.getComputedStyle(field);
        const box = field.getBoundingClientRect();
        const multiline = field.tagName === "TEXTAREA";
        // An empty field shows its placeholder, in the placeholder's own colour.
        const empty = field.value.length === 0;

        const flat = field.ownerDocument.createElement("div");
        flat.textContent = empty ? field.placeholder : field.value;
        for (const property of COPIED_PROPERTIES) flat.style[property] = style[property];
        flat.style.color = empty
            ? view.getComputedStyle(field, "::placeholder").color || style.color
            : style.color;

        // Pin the box to the size the field actually occupies, so swapping the
        // element out cannot re-run flex sizing or intrinsic-width guesses.
        flat.style.boxSizing = "border-box";
        flat.style.width = `${box.width}px`;
        flat.style.height = `${box.height}px`;
        flat.style.flex = "0 0 auto";
        flat.style.minWidth = "0";
        flat.style.minHeight = "0";
        flat.style.maxWidth = "none";
        flat.style.maxHeight = "none";
        flat.style.overflow = "hidden";

        if (multiline) {
            // A textarea lays its value out from the top edge and wraps it.
            flat.style.whiteSpace = "pre-wrap";
            flat.style.overflowWrap = "break-word";
        } else {
            // A single-line input centres its value in the content box.
            flat.style.display = "flex";
            flat.style.alignItems = "center";
            flat.style.justifyContent = JUSTIFY_BY_TEXT_ALIGN[style.textAlign] ?? "flex-start";
            flat.style.whiteSpace = "pre";
        }

        field.replaceWith(flat);
    });
}
