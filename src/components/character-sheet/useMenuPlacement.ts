import { useLayoutEffect, useState, type RefObject } from "react";

/** Room left between the menu and the page edge, in design px. */
const PAGE_MARGIN = 12;

export type MenuPlacement = {
    /** Which side of the field the menu opens on. */
    side: "above" | "below";
    /** How tall it may be, in design px — never past the page edge. */
    maxHeight: number;
};

/**
 * Where a field's suggestion menu can open.
 *
 * Each sheet page is clipped to its own A4 box, so a menu running past the page
 * edge is cut off rather than spilling onto the screen — and the fields at the
 * foot of a column have no room below them at all. This measures both sides of
 * the field, opens on whichever has more, and caps the menu to the space that
 * is actually there.
 *
 * A page is drawn through a single scale transform, so screen measurements
 * convert back to design px with the ratio between the page's drawn width and
 * its untransformed layout width.
 */
export function useMenuPlacement(
    ref: RefObject<HTMLElement | null>,
    open: boolean,
    preferredHeight: number,
): MenuPlacement {
    const [placement, setPlacement] = useState<MenuPlacement>({
        side: "below",
        maxHeight: preferredHeight,
    });

    useLayoutEffect(() => {
        const field = ref.current;
        // `.cs-root` is a page's own box; the scaler is the fallback for a page
        // that does not set one, and is the element the transform lives on.
        const page = field?.closest<HTMLElement>(".cs-root, .character-sheet-scaler");
        if (!open || !field || !page) return;

        const pageBox = page.getBoundingClientRect();
        const scale = page.offsetWidth ? pageBox.width / page.offsetWidth : 0;
        if (!scale) return;

        const fieldBox = field.getBoundingClientRect();
        const below = (pageBox.bottom - fieldBox.bottom) / scale - PAGE_MARGIN;
        const above = (fieldBox.top - pageBox.top) / scale - PAGE_MARGIN;

        // Stay below unless flipping actually buys room, so a field with space
        // to spare keeps the ordinary downward menu.
        const side = below >= preferredHeight || below >= above ? "below" : "above";
        setPlacement({
            side,
            maxHeight: Math.max(
                0,
                Math.min(preferredHeight, side === "below" ? below : above),
            ),
        });
    }, [ref, open, preferredHeight]);

    return placement;
}
