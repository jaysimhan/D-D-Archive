import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

/**
 * The Class & Subclass Features, Species Traits and Character Feats panels list
 * names only, one per line. What each one does lives here: hovering a line —
 * or long-pressing it on a touch screen — opens its description over the page,
 * as a spell row's card does.
 *
 * The descriptions travel with the panel as `data-cs-notes`, so the HTML
 * download can keep opening them once React is gone, and the PDF — which has
 * nothing to hover — can write them back in beside each name.
 */

export type EntryNote = { name?: string; description?: string };

/** Lower-cased name → description, as `data-cs-notes` carries it. */
export type NoteMap = Record<string, string>;

/**
 * Line height for a names-only panel: room between the names. Set inline so it
 * outranks whatever leading the panel's own classes give it.
 */
const NAMES_LINE_HEIGHT = 1.7;

/** Line height once the PDF has written descriptions back in as paragraphs. */
const PRINT_LINE_HEIGHT = 1.35;

/** How long a finger has to rest on a line before its card opens, in ms. */
export const LONG_PRESS_MS = 450;

/** How far a finger may drift before the press counts as a scroll, in px. */
const LONG_PRESS_SLOP = 10;

/** How tall a card would like to be, its width, and its gap, in design px. */
const NOTE_CARD_HEIGHT = 620;
const NOTE_CARD_WIDTH = 760;
const NOTE_CARD_GAP = 10;
const PAGE_MARGIN = 12;

/** The names, one per line, repeats dropped. */
export function formatEntryNames(entries: EntryNote[]) {
    const seen = new Set<string>();
    const names: string[] = [];
    for (const entry of entries) {
        const name = entry.name?.trim();
        if (!name || seen.has(name.toLowerCase())) continue;
        seen.add(name.toLowerCase());
        names.push(name);
    }
    return names.join("\n");
}

/**
 * The name a panel line stands for. A line the player wrote as "Name: notes"
 * is still read by its name.
 */
export function lineName(line: string) {
    return line.split(":")[0].trim();
}

/** The names out of a panel, one per line. */
export function entryNames(text: string) {
    return text.split("\n").map(lineName).filter(Boolean);
}

/** Every description the entries carry, by lower-cased name; first one wins. */
export function noteMap(...groups: (EntryNote[] | undefined)[]): NoteMap {
    const notes: NoteMap = {};
    for (const entries of groups) {
        for (const entry of entries ?? []) {
            const key = entry.name?.trim().toLowerCase();
            const description = entry.description?.trim();
            if (key && description && !(key in notes)) notes[key] = description;
        }
    }
    return notes;
}

/* ------------------------------------------------------------------ */
/* Which line the pointer is on                                        */
/* ------------------------------------------------------------------ */

const MIRRORED_PROPERTIES = [
    "boxSizing",
    "width",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderStyle",
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "lineHeight",
    "letterSpacing",
    "textTransform",
] as const;

export type LineHit = {
    /** The line's text. */
    line: string;
    /** Its box within the page, in design px. */
    top: number;
    bottom: number;
    left: number;
};

/**
 * The line under a point, found by laying the panel's text out again in an
 * unseen copy of the field — the only way to know where a wrapped line falls.
 *
 * Layout px are untransformed, so the page's zoom only has to be undone for
 * the pointer itself.
 */
export function lineAtPoint(field: HTMLTextAreaElement, clientY: number): LineHit | null {
    const page = field.closest<HTMLElement>(".cs-root");
    if (!page) return null;
    const pageBox = page.getBoundingClientRect();
    const scale = page.offsetWidth ? pageBox.width / page.offsetWidth : 0;
    if (!scale) return null;

    const fieldBox = field.getBoundingClientRect();
    const y = (clientY - fieldBox.top) / scale + field.scrollTop;

    const style = getComputedStyle(field);
    const mirror = document.createElement("div");
    for (const property of MIRRORED_PROPERTIES) mirror.style[property] = style[property];
    mirror.style.position = "absolute";
    mirror.style.visibility = "hidden";
    mirror.style.left = "-99999px";
    mirror.style.top = "0";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.overflowWrap = "break-word";
    mirror.style.width = `${field.offsetWidth}px`;

    const lines = field.value.split("\n");
    const rows = lines.map((line) => {
        const row = document.createElement("div");
        row.textContent = line || "​";
        mirror.appendChild(row);
        return row;
    });
    document.body.appendChild(mirror);

    try {
        const index = rows.findIndex(
            (row) => y >= row.offsetTop && y < row.offsetTop + row.offsetHeight,
        );
        if (index < 0 || !lineName(lines[index])) return null;
        const row = rows[index];
        const fieldTop = (fieldBox.top - pageBox.top) / scale - field.scrollTop;
        return {
            line: lines[index],
            top: fieldTop + row.offsetTop,
            bottom: fieldTop + row.offsetTop + row.offsetHeight,
            left: (fieldBox.left - pageBox.left) / scale,
        };
    } finally {
        mirror.remove();
    }
}

/** Where a card opens beside a line: below unless above buys more room. */
export function notePlacement(hit: LineHit, page: HTMLElement) {
    const below = page.offsetHeight - hit.bottom - NOTE_CARD_GAP - PAGE_MARGIN;
    const above = hit.top - NOTE_CARD_GAP - PAGE_MARGIN;
    const openBelow = below >= NOTE_CARD_HEIGHT || below >= above;
    const left = Math.max(
        PAGE_MARGIN,
        Math.min(hit.left, page.offsetWidth - NOTE_CARD_WIDTH - PAGE_MARGIN),
    );
    return {
        left,
        top: openBelow ? hit.bottom + NOTE_CARD_GAP : undefined,
        bottom: openBelow ? undefined : page.offsetHeight - hit.top + NOTE_CARD_GAP,
        maxHeight: Math.max(0, Math.min(NOTE_CARD_HEIGHT, openBelow ? below : above)),
    };
}

/* ------------------------------------------------------------------ */
/* The card                                                            */
/* ------------------------------------------------------------------ */

/**
 * A feature's, trait's or feat's description. Drawn in the page's own
 * coordinates so it scales with the sheet, and never takes the pointer.
 *
 * Exported for the HTML download, which harvests one as the template its
 * runtime fills in.
 */
export function NoteCard({
    name,
    description,
    style,
}: {
    name: string;
    description: string;
    style?: React.CSSProperties;
}) {
    return (
        <div
            role="tooltip"
            data-cs-note-card=""
            className="pointer-events-none absolute z-40 w-[760px] overflow-hidden rounded-[18px] border-[3px] border-solid border-black bg-white p-[24px] shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
            style={style}
        >
            <p
                data-cs-note-name=""
                className="truncate text-[32px] font-semibold leading-[1.2] text-black"
            >
                {name}
            </p>
            <p
                data-cs-note-description=""
                className="mt-[12px] whitespace-pre-wrap text-[23px] font-normal leading-[1.4] text-black"
            >
                {description}
            </p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Long press                                                          */
/* ------------------------------------------------------------------ */

/**
 * A touch-screen stand-in for hover: a finger held still opens what the
 * pointer would have, and the next touch anywhere closes it. A press that
 * drifts, or that the browser takes over to scroll, is let go.
 */
export function useLongPress<T>(onPress: (event: { clientX: number; clientY: number }) => T) {
    const timer = useRef<number | undefined>(undefined);
    const start = useRef<{ x: number; y: number } | null>(null);
    const fired = useRef(false);

    const cancel = useCallback(() => {
        window.clearTimeout(timer.current);
        timer.current = undefined;
        start.current = null;
    }, []);

    useEffect(() => cancel, [cancel]);

    return {
        /** True for the press that just opened something, so it is not undone. */
        fired,
        handlers: {
            onPointerDown: (event: ReactPointerEvent) => {
                fired.current = false;
                if (event.pointerType === "mouse") return;
                cancel();
                const point = { clientX: event.clientX, clientY: event.clientY };
                start.current = { x: event.clientX, y: event.clientY };
                timer.current = window.setTimeout(() => {
                    fired.current = true;
                    start.current = null;
                    onPress(point);
                }, LONG_PRESS_MS);
            },
            onPointerMove: (event: ReactPointerEvent) => {
                const origin = start.current;
                if (!origin) return;
                if (
                    Math.abs(event.clientX - origin.x) > LONG_PRESS_SLOP ||
                    Math.abs(event.clientY - origin.y) > LONG_PRESS_SLOP
                ) {
                    cancel();
                }
            },
            onPointerUp: cancel,
            onPointerCancel: cancel,
            // Android opens the text menu on the same press; the card is the
            // answer to it instead.
            onContextMenu: (event: React.MouseEvent) => {
                if (fired.current) event.preventDefault();
            },
        },
    };
}

/** Closes a long-pressed card on the next touch anywhere. */
export function useDismissOnNextPointer(open: boolean, close: () => void) {
    useEffect(() => {
        if (!open) return;
        // Deferred past the press that opened it, which is still in flight.
        const id = window.setTimeout(() => {
            document.addEventListener("pointerdown", close, { once: true });
        }, 0);
        return () => {
            window.clearTimeout(id);
            document.removeEventListener("pointerdown", close);
        };
    }, [open, close]);
}

/* ------------------------------------------------------------------ */
/* The panel                                                           */
/* ------------------------------------------------------------------ */

type OpenNote = { name: string; description: string; hit: LineHit; page: HTMLElement };

/**
 * A names-only panel: the textarea it always was, plus the card for whichever
 * line the pointer rests on. The card is held back while the panel is being
 * typed into with a mouse, so it never sits over the text being written; a
 * long press opens it regardless.
 */
export function NotesTextArea({
    label,
    value,
    onChange,
    notes,
    className,
    exportField,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    notes: NoteMap;
    className: string;
    exportField?: string;
}) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [open, setOpen] = useState<(OpenNote & { pressed: boolean }) | null>(null);
    const [editing, setEditing] = useState(false);

    const noteAt = useCallback(
        (clientY: number): OpenNote | null => {
            const field = ref.current;
            const page = field?.closest<HTMLElement>(".cs-root");
            if (!field || !page) return null;
            const hit = lineAtPoint(field, clientY);
            const name = hit && lineName(hit.line);
            const description = name && notes[name.toLowerCase()];
            return hit && name && description ? { name, description, hit, page } : null;
        },
        [notes],
    );

    const close = useCallback(() => setOpen(null), []);
    const longPress = useLongPress(({ clientY }) => {
        const note = noteAt(clientY);
        setOpen(note && { ...note, pressed: true });
    });
    useDismissOnNextPointer(Boolean(open?.pressed), close);

    const notesJson = useMemo(() => JSON.stringify(notes), [notes]);
    const visible = open && (open.pressed || !editing);

    return (
        <>
            <textarea
                ref={ref}
                aria-label={label}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                data-cs={exportField}
                data-cs-notes={notesJson}
                onFocus={() => setEditing(true)}
                onBlur={() => setEditing(false)}
                {...longPress.handlers}
                // Hover is a mouse's alone: a tap's emulated mouse events
                // would open a card no finger asked for.
                onPointerMove={(event) => {
                    longPress.handlers.onPointerMove(event);
                    if (event.pointerType !== "mouse" || open?.pressed) return;
                    const note = noteAt(event.clientY);
                    setOpen((current) =>
                        note?.name === current?.name && note?.hit.top === current?.hit.top
                            ? current
                            : note && { ...note, pressed: false },
                    );
                }}
                onPointerLeave={(event) => {
                    if (event.pointerType === "mouse" && !open?.pressed) close();
                }}
                onScroll={() => {
                    if (!open?.pressed) close();
                }}
                className={className}
                style={{ lineHeight: NAMES_LINE_HEIGHT }}
            />
            {visible &&
                createPortal(
                    <NoteCard
                        name={open.name}
                        description={open.description}
                        style={notePlacement(open.hit, open.page)}
                    />,
                    open.page,
                )}
        </>
    );
}

/* ------------------------------------------------------------------ */
/* PDF                                                                 */
/* ------------------------------------------------------------------ */

/** Floor on the PDF's shrink, as a share of the designed size. */
const MIN_PRINT_SCALE = 0.25;

/**
 * Readies every panel for a PDF: names get their descriptions written back in
 * beside them — the page cannot be hovered — and any panel holding more than
 * its box is stepped down a size until it fits.
 *
 * Runs against html2canvas's clone only, before its fields are flattened, so
 * the flattened copy inherits the fitted size.
 */
export function expandNotesForPrint(root: ParentNode) {
    root.querySelectorAll<HTMLTextAreaElement>("textarea").forEach((field) => {
        const raw = field.getAttribute("data-cs-notes");
        if (raw) {
            let notes: NoteMap = {};
            try {
                notes = JSON.parse(raw) as NoteMap;
            } catch {
                // An unreadable map leaves the names as they are.
            }
            field.value = field.value
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => {
                    const description = notes[lineName(line).toLowerCase()];
                    return description && !line.includes(":")
                        ? `${line.trim()}: ${description}`
                        : line;
                })
                .join("\n\n");
            field.style.lineHeight = String(PRINT_LINE_HEIGHT);
        }
        fitTextAreaHeight(field);
    });
}

function fitTextAreaHeight(field: HTMLTextAreaElement) {
    if (!field.value.trim() || field.clientHeight <= 0) return;
    const view = field.ownerDocument.defaultView;
    if (!view) return;
    const design = Number.parseFloat(view.getComputedStyle(field).fontSize);
    if (!design) return;

    const fits = () => field.scrollHeight <= field.clientHeight + 1;
    if (fits()) return;

    // The largest size that still fits, to within a twentieth of a px.
    let low = design * MIN_PRINT_SCALE;
    let high = design;
    while (high - low > 0.05) {
        const middle = (low + high) / 2;
        field.style.fontSize = `${middle}px`;
        if (fits()) low = middle;
        else high = middle;
    }
    // A hair under, since the flattened copy wraps by its own measure.
    field.style.fontSize = `${low * 0.97}px`;
}
