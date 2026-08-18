import {
    memo,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";
import { useSheetSuggestions } from "../../hooks/useSheetSuggestions";
import { useMenuPlacement } from "./useMenuPlacement";
import type { CharacterData } from "../../types/character-creator";
import {
    DeathSaveMarker,
    ProfRing,
    type ProfRingVariant,
    type ProficiencyLevel,
} from "./markers";
import { useEditableAutoValue } from "./use-editable-auto-value";
import { spellSlotsByLevel, type SpellSlots } from "./spell-slots";
import { finalAbilityScores } from "../../utils/ability-scores";
import { calculateArmorClass } from "../../utils/armor-class";
import { alertInitiativeBonus, classPointAmount, featResourceAmount, walkingSpeed } from "../../utils/combat-progression";
import {
    classGrantsSpells,
    speciesGrantsSpells,
    spellGrantingSources,
    subclassGrantsSpells,
} from "./spellcasting-sources";
import "./character-sheet.css";

/**
 * Minimal Character Sheet for D&D — A4, implemented 1:1 from Figma
 * (Simhan – Workspace, node 1780:1656). The sheet renders at its native
 * design size of 2480 x 3508 (A4 @ 300dpi); CharacterSheetPage scales it.
 *
 * Every blank in the design is a text field.
 */

export const SHEET_WIDTH = 2480;
export const SHEET_HEIGHT = 3508;

/** Icons exported from the Figma node. */
const asset = (name: string) => `/character-sheet/${name}.svg`;

/* ------------------------------------------------------------------ */
/* Shrink to fit                                                       */
/* ------------------------------------------------------------------ */

/**
 * Floor on the shrink, as a share of the designed size. Low enough that the
 * longest value the sheet generates itself still fits — a four-class Hit Dice
 * string such as "5d10 + 3d8 + 2d6 + 2d12" needs roughly a third of the size
 * Figma drew — and no lower, so a field pasted full of prose reads as too much
 * text for the box rather than shrinking away to nothing.
 */
const MIN_FIT_SCALE = 0.35;

/** Room left for the caret and for sub-pixel rounding, in design px. */
const FIT_PADDING = 4;

/** One canvas measures every field — text metrics cost no layout. */
let fitContext: CanvasRenderingContext2D | null | undefined;

function measureText(text: string, style: CSSStyleDeclaration, fontSize: number) {
    fitContext ??= document.createElement("canvas").getContext("2d");
    if (!fitContext) return 0;
    fitContext.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
    const spacing = Number.parseFloat(style.letterSpacing);
    return (
        fitContext.measureText(text).width +
        (Number.isNaN(spacing) ? 0 : spacing * text.length)
    );
}

/**
 * Keeps a value inside the box the design drew for it.
 *
 * The sheet is a fixed A4 canvas, so a blank cannot grow to meet its contents:
 * a long value is either clipped or steps down a size. This measures the text
 * against the field's own width and returns the size that fits, never above
 * the designed one — a short value still looks exactly as Figma drew it.
 *
 * Widths come from `clientWidth` and from canvas metrics, both untransformed,
 * so the page's zoom drops out and a field fits the same at any scale.
 *
 * Consumers also mark their element `data-cs-fit`, which is how the HTML
 * download finds the fields it has to keep fitting once React is gone.
 */
function useFitText<T extends HTMLElement>(text: string) {
    const ref = useRef<T>(null);
    /** The class-given size, read before any fitted size overwrites it. */
    const designSize = useRef(0);
    const [fontSize, setFontSize] = useState<number | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const fit = () => {
            const style = getComputedStyle(el);
            if (!designSize.current) designSize.current = Number.parseFloat(style.fontSize);
            const design = designSize.current;
            const available = el.clientWidth - FIT_PADDING;
            if (!design || available <= 0) return;

            const needed = measureText(text, style, design);
            const scale = needed > available ? Math.max(MIN_FIT_SCALE, available / needed) : 1;
            setFontSize(scale < 1 ? design * scale : null);
        };

        fit();

        // A webfont landing after first paint changes every measurement.
        let live = true;
        void document.fonts?.ready.then(() => live && fit());

        // The field's width is layout-driven (flex, page resize) — refit when
        // it moves. Shrinking the text never changes that width, so this
        // cannot feed back on itself.
        const observer = new ResizeObserver(fit);
        observer.observe(el);
        return () => {
            live = false;
            observer.disconnect();
        };
    }, [text]);

    const style = fontSize ? { fontSize: `${fontSize}px` } : undefined;
    return [ref, style] as const;
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** An exported icon, drawn at its designed outer box and leaf size. */
function Icon({
    src,
    w,
    h,
    inset,
    className = "",
}: {
    src: string;
    w: number;
    h: number;
    /** Figma stroke overflow, e.g. "-4.99%" or "-3.33% -3.03%". */
    inset?: string;
    className?: string;
}) {
    return (
        <div
            className={`relative shrink-0 ${className}`}
            style={{ width: `${w}px`, height: `${h}px` }}
        >
            {inset ? (
                <div className="absolute" style={{ inset }}>
                    <img alt="" src={src} className="block size-full max-w-none" />
                </div>
            ) : (
                <img alt="" src={src} className="absolute inset-0 block size-full max-w-none" />
            )}
        </div>
    );
}

/**
 * A blank the user types into. The hidden sizer text is the same text Figma
 * used to size the box, so the field keeps its designed geometry whether it is
 * empty or filled.
 */
function Blank({
    sizer,
    textClassName,
    wrapperClassName = "",
    wrapperStyle,
    label,
    align = "center",
    value,
    onChange,
    inputMode,
    maxLength,
    valueClassName,
}: {
    sizer: string;
    textClassName: string;
    wrapperClassName?: string;
    wrapperStyle?: React.CSSProperties;
    label: string;
    align?: "center" | "left" | "right";
    /** Supply with onChange to make the blank controlled. */
    value?: string;
    onChange?: (value: string) => void;
    inputMode?: "numeric";
    maxLength?: number;
    /** Styling for the typed text when it should differ from the sizer's. */
    valueClassName?: string;
}) {
    const [typed, setTyped] = useState("");
    const text = value ?? typed;
    const [inputRef, fitStyle] = useFitText<HTMLInputElement>(text);

    const alignClass =
        align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";
    return (
        <span className={`relative block shrink-0 ${wrapperClassName}`} style={wrapperStyle}>
            <span aria-hidden className={`block opacity-0 ${textClassName}`}>
                {sizer}
            </span>
            <input
                ref={inputRef}
                type="text"
                aria-label={label}
                value={text}
                onChange={(e) => {
                    if (value === undefined) setTyped(e.target.value);
                    onChange?.(e.target.value);
                }}
                inputMode={inputMode}
                maxLength={maxLength}
                data-cs-fit=""
                style={fitStyle}
                className={`absolute inset-0 h-full w-full ${alignClass} ${valueClassName ?? textClassName}`}
            />
        </span>
    );
}

/**
 * A blank the design sized itself rather than through Blank's hidden sizer.
 * Same shrink-to-fit behaviour, but no wrapper element, so it keeps whatever
 * flex and sizing classes the surrounding layout puts on it.
 */
function FitInput({
    label,
    className,
    inputMode,
    value,
    onChange,
    readOnly = false,
}: {
    label: string;
    className: string;
    inputMode?: "numeric";
    value?: string;
    onChange?: (value: string) => void;
    readOnly?: boolean;
}) {
    const [internal, setInternal] = useState("");
    const text = value ?? internal;
    const [inputRef, fitStyle] = useFitText<HTMLInputElement>(text);
    return (
        <input
            ref={inputRef}
            type="text"
            aria-label={label}
            value={text}
            onChange={(e) => {
                if (value === undefined) setInternal(e.target.value);
                onChange?.(e.target.value);
            }}
            inputMode={inputMode}
            readOnly={readOnly}
            data-cs-fit=""
            style={fitStyle}
            className={className}
        />
    );
}

/** Read-only text that keeps labels inside fixed Figma boxes. */
function FitLabel({
    label,
    value,
    className,
}: {
    label: string;
    value: string;
    className: string;
}) {
    const [outputRef, fitStyle] = useFitText<HTMLOutputElement>(value);
    return (
        <output
            ref={outputRef}
            aria-label={label}
            data-cs-fit=""
            style={fitStyle}
            className={className}
        >
            {value}
        </output>
    );
}

/**
 * A blank the sheet fills in itself. Shares Blank's hidden-sizer geometry so a
 * derived value occupies exactly the box the design drew for it.
 */
function DerivedValue({
    sizer,
    value,
    textClassName,
    wrapperClassName = "",
    label,
    valueClassName,
}: {
    sizer: string;
    value: string;
    textClassName: string;
    wrapperClassName?: string;
    label: string;
    /** Styling for the derived text when it should differ from the sizer's. */
    valueClassName?: string;
}) {
    const [outputRef, fitStyle] = useFitText<HTMLOutputElement>(value);
    return (
        <span className={`relative block shrink-0 ${wrapperClassName}`}>
            <span aria-hidden className={`block opacity-0 ${textClassName}`}>
                {sizer}
            </span>
            <output
                ref={outputRef}
                aria-label={label}
                data-cs-fit=""
                style={fitStyle}
                className={`absolute inset-0 flex h-full w-full items-center justify-center whitespace-nowrap text-center ${valueClassName ?? textClassName}`}
            >
                {value}
            </output>
        </span>
    );
}

/** Three individually toggleable death-save markers on their connecting line. */
function DeathSaveTrack({ kind }: { kind: "success" | "failure" }) {
    const [marked, setMarked] = useState([false, false, false]);
    const success = kind === "success";
    const markerBox = success ? "size-[33.657px]" : "size-[35.226px]";

    const toggle = (index: number) => {
        setMarked((current) =>
            current.map((value, markerIndex) =>
                markerIndex === index ? !value : value,
            ),
        );
    };

    return (
        <div
            className={`relative shrink-0 ${
                success
                    ? "h-[165.527px] w-[33.657px]"
                    : "h-[167.389px] w-[35.226px]"
            }`}
        >
            <span
                aria-hidden
                className="absolute left-1/2 top-[16.828px] bottom-[16.828px] w-[2.243px] -translate-x-1/2 bg-black"
            />
            <div className="relative z-10 flex size-full flex-col justify-between">
                {marked.map((isMarked, index) => (
                    <div
                        key={index}
                        className={`flex shrink-0 items-center justify-center ${markerBox}`}
                    >
                        <DeathSaveMarker
                            kind={kind}
                            label={`${kind} death save ${index + 1}`}
                            marked={isMarked}
                            onToggle={() => toggle(index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

/** A hairline separator exported as a rotated line asset. */
function ColumnRule({ src, edge = "-2px" }: { src: string; edge?: string }) {
    return (
        <div className="relative flex h-[39.178px] w-0 shrink-0 items-center justify-center">
            <div className="flex-none rotate-90">
                <div className="relative h-0 w-[39.178px]">
                    <div className="absolute" style={{ inset: `${edge} 0 0 0` }}>
                        <img alt="" src={src} className="block size-full max-w-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Autocomplete                                                        */
/* ------------------------------------------------------------------ */

const MAX_SUGGESTIONS = 8;

/** A menu row: 12px of padding either side of a 28px line at 1.25. */
const MENU_ROW_HEIGHT = 59;

/**
 * The menu's usual height, in design px, before the page edge trims it: every
 * row it can hold, plus its own 8px padding, 3px borders and a little slack —
 * landing exactly on the content height would raise a scrollbar on a rounding
 * error alone.
 */
const MENU_HEIGHT = MAX_SUGGESTIONS * MENU_ROW_HEIGHT + 24;

/**
 * Class and Subclass accept a list so a multiclassed character fits on one
 * line, e.g. "Fighter / Wizard". Entries are separated by a slash.
 */
const LIST_SEPARATOR = "/";

/** Fallbacks for legacy class documents that predate Resource Pool grants. */
const CLASS_POINT_LABELS: Record<string, string> = {
    monk: "Focus Points",
    sorcerer: "Sorcery Points",
    pugilist: "Moxie Points",
};

/** Class-feature save DC abilities when no explicit schema value is present. */
const CLASS_SAVE_ABILITIES: Record<string, string> = {
    barbarian: "STR",
    bard: "CHA",
    cleric: "WIS",
    druid: "WIS",
    fighter: "STR",
    monk: "WIS",
    paladin: "CHA",
    ranger: "WIS",
    rogue: "DEX",
    sorcerer: "CHA",
    warlock: "CHA",
    wizard: "INT",
    artificer: "INT",
};

const ABILITY_KEYS: Record<string, string> = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
};

function normalizeAbilityKey(value?: string) {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    return ABILITY_KEYS[normalized] ?? normalized.slice(0, 3).toUpperCase();
}

/** ["Fighter", "Wizard"] from "Fighter / Wizard " — blanks dropped. */
export function splitList(value: string): string[] {
    return value
        .split(LIST_SEPARATOR)
        .map((part) => part.trim())
        .filter(Boolean);
}

/** The nine alignments are rules text, not library content, so they are local. */
const ALIGNMENTS = [
    "Lawful Good",
    "Neutral Good",
    "Chaotic Good",
    "Lawful Neutral",
    "True Neutral",
    "Chaotic Neutral",
    "Lawful Evil",
    "Neutral Evil",
    "Chaotic Evil",
];

/**
 * A blank that suggests matching entries from the Archive as you type.
 *
 * It stays an ordinary text field — anything can be typed, suggestions are
 * only an accelerator — and it renders inside the sheet's coordinate space so
 * the menu scales with the page.
 */
export function SuggestInput({
    label,
    options,
    className,
    wrapperClassName = "relative min-w-[1px] flex-[1_0_0]",
    value,
    onValueChange,
    multiple = false,
    initialValue = "",
    suggestWhenTyped = false,
    renderOption,
}: {
    label: string;
    options: string[];
    className: string;
    /** The positioning of the field within its box; the menu hangs off it. */
    wrapperClassName?: string;
    /** Provide both to lift state (Class drives the Subclass list). */
    value?: string;
    onValueChange?: (value: string) => void;
    /** Accept several entries, separated by a slash — used for multiclassing. */
    multiple?: boolean;
    initialValue?: string;
    /**
     * Hold the menu back until something is typed. For a field the sheet fills
     * in itself, where an unprompted list of everything would only be noise.
     */
    suggestWhenTyped?: boolean;
    /**
     * Draw a menu row as something richer than its own text — the spellbook
     * hangs each spell's school off it. The option is still what gets picked.
     */
    renderOption?: (option: string) => ReactNode;
}) {
    const [internal, setInternal] = useState(initialValue);
    const current = value ?? internal;
    const [inputRef, fitStyle] = useFitText<HTMLInputElement>(current);
    const setCurrent = (next: string) => {
        setInternal(next);
        onValueChange?.(next);
    };

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const wrapperRef = useRef<HTMLSpanElement>(null);

    // In multiple mode only the entry after the last slash is being edited;
    // every segment before that slash is already committed. Work from the raw
    // segments so a trailing slash in "Monk /" preserves Monk instead of
    // dropping it as splitList (which intentionally removes blanks) would.
    const segments = multiple ? current.split(LIST_SEPARATOR) : [current];
    const committed = multiple
        ? segments
              .slice(0, -1)
              .map((entry) => entry.trim())
              .filter(Boolean)
        : [];
    const pending = (segments[segments.length - 1] ?? "").trim();

    const matches = useMemo(() => {
        const taken = new Set(committed.map((entry) => entry.toLowerCase()));
        const pool = options.filter((option) => !taken.has(option.toLowerCase()));
        const query = pending.toLowerCase();
        if (!query) return suggestWhenTyped ? [] : pool.slice(0, MAX_SUGGESTIONS);
        const starts: string[] = [];
        const contains: string[] = [];
        for (const option of pool) {
            const lower = option.toLowerCase();
            if (lower === query) continue;
            if (lower.startsWith(query)) starts.push(option);
            else if (lower.includes(query)) contains.push(option);
        }
        return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
    }, [options, pending, current, multiple, suggestWhenTyped]);

    const visible = open && matches.length > 0;
    const menu = useMenuPlacement(wrapperRef, visible, MENU_HEIGHT);

    const choose = (option: string) => {
        if (multiple) {
            // Leave a trailing separator so the next class can be picked
            // straight away; onBlur tidies it up if they stop here.
            setCurrent([...committed, option].join(" / ") + " / ");
            setActive(-1);
            return;
        }
        setCurrent(option);
        setOpen(false);
        setActive(-1);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") {
            setOpen(false);
            setActive(-1);
            return;
        }
        if (!visible) {
            if (event.key === "ArrowDown") setOpen(true);
            return;
        }
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActive((i) => (i + 1) % matches.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
        } else if (event.key === "Enter" && active >= 0) {
            event.preventDefault();
            choose(matches[active]);
        }
    };

    return (
        <span ref={wrapperRef} className={wrapperClassName}>
            <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-label={label}
                aria-expanded={visible}
                aria-autocomplete="list"
                autoComplete="off"
                value={current}
                data-cs-fit=""
                style={fitStyle}
                onChange={(e) => {
                    setCurrent(e.target.value);
                    setOpen(true);
                    setActive(-1);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                    if (multiple) setCurrent(splitList(current).join(" / "));
                    setOpen(false);
                    setActive(-1);
                }}
                onKeyDown={onKeyDown}
                className={`w-full ${className}`}
            />
            {visible && (
                <ul
                    role="listbox"
                    aria-label={`${label} suggestions`}
                    className={`absolute left-0 z-50 w-full min-w-[420px] overflow-y-auto rounded-[18px] border-[3px] border-solid border-black bg-white py-[8px] shadow-[0_18px_48px_rgba(0,0,0,0.28)] ${
                        menu.side === "above" ? "bottom-full mb-[10px]" : "top-full mt-[10px]"
                    }`}
                    style={{ maxHeight: `${menu.maxHeight}px` }}
                >
                    {matches.map((option, i) => (
                        <li key={option} role="option" aria-selected={i === active}>
                            <button
                                type="button"
                                tabIndex={-1}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => choose(option)}
                                onMouseEnter={() => setActive(i)}
                                className={`block w-full px-[26px] py-[12px] text-left text-[28px] font-medium leading-[1.25] text-black ${
                                    i === active ? "bg-black/10" : ""
                                }`}
                            >
                                {renderOption ? renderOption(option) : option}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </span>
    );
}

/**
 * Weapons / Tools / Languages — the same Archive suggestions as SuggestInput,
 * over a block that holds a list rather than a single value.
 *
 * One entry per line: the menu matches the line the caret is on, picking fills
 * that line and opens the next, and entries already listed drop out of the
 * menu, so several can be chosen in a row. It stays an ordinary textarea —
 * anything can still be typed.
 */
export function SuggestTextArea({
    label,
    options,
    className,
    initialValue = "",
}: {
    label: string;
    options: string[];
    className: string;
    initialValue?: string;
}) {
    const [value, setValue] = useState(initialValue);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const [caretLine, setCaretLine] = useState(0);
    const areaRef = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    /** Set when a pick rewrites the value, so the caret can follow it. */
    const caretAfterPick = useRef<number | null>(null);

    const matches = useMemo(() => {
        const rows = value.split("\n");
        const taken = new Set(
            rows
                .filter((_, index) => index !== caretLine)
                .map((row) => row.trim().toLowerCase())
                .filter(Boolean),
        );
        const pool = options.filter((option) => !taken.has(option.toLowerCase()));
        const query = (rows[caretLine] ?? "").trim().toLowerCase();
        if (!query) return pool.slice(0, MAX_SUGGESTIONS);
        const starts: string[] = [];
        const contains: string[] = [];
        for (const option of pool) {
            const lower = option.toLowerCase();
            if (lower === query) continue;
            if (lower.startsWith(query)) starts.push(option);
            else if (lower.includes(query)) contains.push(option);
        }
        return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
    }, [options, value, caretLine]);

    const visible = open && matches.length > 0;
    // These blocks sit at the foot of a tall column, where the page edge is
    // usually closer than the menu is tall.
    const menu = useMenuPlacement(wrapperRef, visible, MENU_HEIGHT);

    useLayoutEffect(() => {
        const caret = caretAfterPick.current;
        if (caret === null) return;
        caretAfterPick.current = null;
        areaRef.current?.setSelectionRange(caret, caret);
    }, [value]);

    const syncCaret = (element: HTMLTextAreaElement) => {
        const upto = element.value.slice(0, element.selectionStart ?? 0);
        setCaretLine(upto.split("\n").length - 1);
    };

    const choose = (option: string) => {
        const rows = value.split("\n");
        rows[caretLine] = option;
        // Leave a blank line ready so the next entry can be picked straight
        // away; onBlur tidies it up if they stop here.
        if (caretLine === rows.length - 1) rows.push("");
        caretAfterPick.current = rows.slice(0, caretLine + 1).join("\n").length + 1;
        setValue(rows.join("\n"));
        setCaretLine(caretLine + 1);
        setActive(-1);
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Escape") {
            setOpen(false);
            setActive(-1);
            return;
        }
        if (!visible) {
            if (event.key === "ArrowDown") setOpen(true);
            return;
        }
        // The arrows belong to the caret while there are lines left to move
        // to; only from the edge of the text do they step into the menu.
        const lastLine = value.split("\n").length - 1;
        if (event.key === "ArrowDown") {
            if (active < 0 && caretLine < lastLine) return;
            event.preventDefault();
            setActive((i) => (i + 1) % matches.length);
        } else if (event.key === "ArrowUp") {
            if (active < 0 && caretLine > 0) return;
            event.preventDefault();
            setActive((i) => (i <= 0 ? matches.length - 1 : i - 1));
        } else if (event.key === "Enter" && active >= 0) {
            event.preventDefault();
            choose(matches[active]);
        }
    };

    return (
        <div
            ref={wrapperRef}
            className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col"
        >
            <textarea
                ref={areaRef}
                role="combobox"
                aria-label={label}
                aria-expanded={visible}
                aria-autocomplete="list"
                autoComplete="off"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    syncCaret(e.target);
                    setOpen(true);
                    setActive(-1);
                }}
                onSelect={(e) => syncCaret(e.currentTarget)}
                onFocus={(e) => {
                    syncCaret(e.currentTarget);
                    setOpen(true);
                }}
                onBlur={() => {
                    setValue(
                        value
                            .split("\n")
                            .map((row) => row.trim())
                            .filter(Boolean)
                            .join("\n"),
                    );
                    setOpen(false);
                    setActive(-1);
                }}
                onKeyDown={onKeyDown}
                className={`min-h-[1px] w-full flex-[1_0_0] ${className}`}
            />
            {visible && (
                <ul
                    role="listbox"
                    aria-label={`${label} suggestions`}
                    className={`absolute left-0 z-50 w-full min-w-[420px] overflow-y-auto rounded-[18px] border-[3px] border-solid border-black bg-white py-[8px] shadow-[0_18px_48px_rgba(0,0,0,0.28)] ${
                        menu.side === "above" ? "bottom-full mb-[10px]" : "top-full mt-[10px]"
                    }`}
                    style={{ maxHeight: `${menu.maxHeight}px` }}
                >
                    {matches.map((option, i) => (
                        <li key={option} role="option" aria-selected={i === active}>
                            <button
                                type="button"
                                tabIndex={-1}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => choose(option)}
                                onMouseEnter={() => setActive(i)}
                                className={`block w-full px-[26px] py-[12px] text-left text-[28px] font-medium leading-[1.25] text-black ${
                                    i === active ? "bg-black/10" : ""
                                }`}
                            >
                                {option}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Header fields                                                       */
/* ------------------------------------------------------------------ */

/**
 * Species / Background / Alignment — the narrow right-hand fields. The field
 * name is a permanent label, not a placeholder, so it survives typing; the
 * blank to its right is what you write in.
 */
function HeaderFieldSm({
    icon,
    label,
    options,
    value,
    onValueChange,
}: {
    icon: ReactNode;
    label: string;
    options: string[];
    value?: string;
    onValueChange?: (value: string) => void;
}) {
    return (
        <div className="relative flex w-full shrink-0 items-center gap-[24.714px] rounded-[24.714px] border-[3.089px] border-solid border-black p-[24.714px]">
            {icon}
            <p className="relative shrink-0 whitespace-nowrap text-[30.893px] font-medium not-italic leading-[normal] text-black">
                {label}
            </p>
            <SuggestInput
                label={label}
                options={options}
                value={value}
                onValueChange={onValueChange}
                className="text-[30.893px] font-medium not-italic leading-[normal] text-black"
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Ability cards                                                       */
/* ------------------------------------------------------------------ */

type SkillDef = { label: string; icon: string; w: number; h: number };

type AbilityDef = {
    /** Bold prefix, e.g. "WIS". */
    abbr: string;
    /** Grey remainder, e.g. "DOM". */
    rest: string;
    icon: string;
    iconW: number;
    iconH: number;
    /** Figma uses a second ring variant on Strength. */
    savingThrowRing?: ProfRingVariant;
    skills: SkillDef[];
    headerAlign: string;
};

const SAVING_THROW_ICON = { src: asset("saving-throw"), w: 35.566, h: 28.827 };

/** Highest ability score the rules allow (magic items cap at 30). */
const MAX_ABILITY_SCORE = 30;

/** The Level blank takes two digits, and the rules stop at twenty. */
const MAX_CHARACTER_LEVEL = 20;

/** PHB: modifier = (score − 10) ÷ 2, rounded down. */
function abilityModifier(score: number) {
    return Math.floor((score - 10) / 2);
}

/** Modifiers are always written with their sign, "+0" included. */
function formatModifier(modifier: number) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/** Read a user-entered proficiency bonus such as "2" or "+2". */
function parseProficiencyBonus(value: string) {
    const trimmed = value.trim();
    return /^\+?\d+$/.test(trimmed) ? Number.parseInt(trimmed, 10) : null;
}

/** PHB: +2 at level 1, rising by one every four levels. */
function proficiencyBonusAt(level: number) {
    return 2 + Math.floor((level - 1) / 4);
}

/**
 * Maximum hit points by the PHB's average rule: the first class's die in full
 * at level 1, then half of it rounded up per level after, each with the
 * Constitution modifier and never gaining less than one.
 *
 * A pure function of the dice, the levels behind each of them and the modifier,
 * so the HTML download can be handed this same answer for every level and
 * Constitution the player might edit their way to.
 */
export function averageMaximumHitPoints(
    dice: number[],
    classLevels: number[],
    constitutionModifier: number,
) {
    let maximum = 0;
    dice.forEach((die, index) => {
        const levels = classLevels[index] ?? 0;
        const averageGain = Math.floor(die / 2) + 1;

        if (index === 0 && levels > 0) {
            maximum += Math.max(1, die + constitutionModifier);
            maximum += Math.max(1, averageGain + constitutionModifier) * (levels - 1);
        } else {
            maximum += Math.max(1, averageGain + constitutionModifier) * levels;
        }
    });
    return maximum;
}

/** How the total level is shared out between the classes taken, in order. */
function splitLevels(totalLevel: number, classCount: number) {
    const levelsPerClass = Math.floor(totalLevel / classCount);
    const remainder = totalLevel % classCount;
    return Array.from(
        { length: classCount },
        (_, index) => levelsPerClass + (index < remainder ? 1 : 0),
    );
}

/**
 * The score box is the only blank here: the circle shows the modifier the rules
 * derive from it, so it is read-only.
 *
 * `data-cs` marks the pair for the HTML download, which re-derives the circle
 * from the box as this page does — the box is the only `input` inside and the
 * circle the only `output`.
 */
function AbilityScoreGrid({
    ability,
    abilityKey,
    onModifierChange,
    initialScore,
}: {
    ability: string;
    /** "WIS" — how every other field on the sheet names this ability. */
    abilityKey: string;
    onModifierChange: (modifier: number | null) => void;
    initialScore?: number;
}) {
    const [score, setScore] = useState(initialScore === undefined ? "" : `${initialScore}`);
    const parsed = Number.parseInt(score, 10);
    const modifier = Number.isNaN(parsed) ? "" : formatModifier(abilityModifier(parsed));

    return (
        <div
            data-cs="ability"
            data-cs-ability={abilityKey}
            className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]"
        >
            {/* Score box, tucked behind the modifier circle. Sized by the widest
                pair of digits, not Figma's "14", so "20" cannot be shaved. */}
            <div className="relative col-start-1 row-start-1 ml-[98.13px] mt-[28.95px] flex items-center justify-center rounded-[8.273px] border-2 border-solid border-black py-[16.545px] pl-[41.363px] pr-[16.545px]">
                <Blank
                    label={`${ability} score`}
                    sizer="00"
                    value={score}
                    onChange={(next) => {
                        const digits = next.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
                        if (digits === "" || Number(digits) <= MAX_ABILITY_SCORE) {
                            setScore(digits);
                            onModifierChange(
                                digits === "" ? null : abilityModifier(Number.parseInt(digits, 10)),
                            );
                        }
                    }}
                    inputMode="numeric"
                    maxLength={2}
                    textClassName="whitespace-nowrap text-[33.09px] font-normal not-italic leading-[normal] text-black"
                    valueClassName="whitespace-nowrap text-[33.09px] font-normal not-italic leading-[normal] tabular-nums text-black"
                />
            </div>
            {/* Modifier circle. Only "+10" reaches three characters, and the
                blank shrinks it to fit rather than crowding the ring. */}
            <div className="relative col-start-1 row-start-1 ml-0 mt-0 flex size-[124.088px] flex-col items-center justify-center rounded-[198.54px] border-2 border-solid border-black bg-white px-[15.42px] py-[12.336px]">
                <DerivedValue
                    label={`${ability} modifier`}
                    sizer="+2"
                    value={modifier}
                    wrapperClassName="w-[72.175px]"
                    textClassName="text-[55.699px] font-medium not-italic leading-[normal] text-black"
                    valueClassName="text-[50px] font-medium not-italic leading-[normal] tabular-nums text-black"
                />
            </div>
        </div>
    );
}

/**
 * `data-cs` marks the row for the HTML download: the ring inside it and the
 * ability named here are what the total is re-derived from once the sheet is a
 * standalone file.
 */
function SkillRow({
    skill,
    abilityKey,
    modifier,
    proficiencyBonus,
    initialLevel = 0,
    onLevelChange,
}: {
    skill: SkillDef;
    /** "WIS" — which ability's modifier this skill adds. */
    abilityKey: string;
    modifier: number | null;
    proficiencyBonus: number | null;
    initialLevel?: ProficiencyLevel;
    /** Reports the ring, for a skill another page derives a value from. */
    onLevelChange?: (level: ProficiencyLevel) => void;
}) {
    const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>(initialLevel);
    const total =
        proficiencyLevel > 0 && modifier !== null && proficiencyBonus !== null
            ? formatModifier(modifier + proficiencyBonus * proficiencyLevel)
            : "";

    return (
        <div
            data-cs="skill"
            data-cs-ability={abilityKey}
            data-cs-skill={skill.label}
            className="relative flex h-[53.771px] w-full shrink-0 items-center gap-[12.409px] rounded-[22.544px] bg-white px-[20.681px] py-[22.544px]"
        >
            <ProfRing
                label={skill.label}
                variant="skill"
                level={proficiencyLevel}
                onLevelChange={(level) => {
                    setProficiencyLevel(level);
                    onLevelChange?.(level);
                }}
            />
            <Icon src={skill.icon} w={skill.w} h={skill.h} />
            <p className="relative shrink-0 whitespace-nowrap text-[20.681px] font-normal not-italic leading-[normal] text-black">
                {skill.label}
            </p>
            <output
                aria-label={`${skill.label} modifier`}
                className="relative ml-auto min-w-[48px] shrink-0 text-right text-[20.681px] font-semibold leading-[normal] tabular-nums text-black"
            >
                {total}
            </output>
        </div>
    );
}

function AbilityCard({
    ability,
    proficiencyBonus,
    onModifierChange,
    onSkillLevelChange,
    initialScore,
    initialSkillLevels,
}: {
    ability: AbilityDef;
    proficiencyBonus: number | null;
    onModifierChange?: (ability: string, modifier: number | null) => void;
    /** The card names the ability: the sheet lists Perception under two. */
    onSkillLevelChange?: (ability: string, skill: string, level: ProficiencyLevel) => void;
    initialScore?: number;
    initialSkillLevels?: Record<string, ProficiencyLevel>;
}) {
    const { abbr, rest, skills } = ability;
    const name = `${abbr}${rest}`.toUpperCase();
    const abilityKey = abbr.toUpperCase();
    const [modifier, setModifier] = useState<number | null>(
        initialScore === undefined ? null : abilityModifier(initialScore),
    );
    return (
        <div className="relative flex w-full shrink-0 flex-wrap content-start items-start gap-y-[3.5px] rounded-[22.749px] border-[4.136px] border-solid border-[#ffb800] p-[10.794px]">
            <div className="relative flex w-full flex-col items-center justify-center gap-[12.409px] overflow-clip rounded-[16.545px] bg-[#f8f8f8] p-[20.681px]">
                <div className={`relative flex shrink-0 flex-col gap-[20.681px] ${ability.headerAlign}`}>
                    <div className="relative flex shrink-0 items-center justify-center gap-[8.273px]">
                        <Icon src={ability.icon} w={ability.iconW} h={ability.iconH} />
                        <p className="cs-manrope relative shrink-0 whitespace-nowrap text-[30.841px] font-bold uppercase leading-[0] text-black">
                            <span className="leading-[normal]">{abbr}</span>
                            <span className="cs-manrope font-normal leading-[normal] text-[#5f5f5f]">
                                {rest}
                            </span>
                        </p>
                    </div>
                    <AbilityScoreGrid
                        ability={name}
                        abilityKey={abilityKey}
                        initialScore={initialScore}
                        onModifierChange={(next) => {
                            setModifier(next);
                            onModifierChange?.(abilityKey, next);
                        }}
                    />
                </div>

                <div
                    className={`relative flex w-full shrink-0 flex-col items-start ${skills.length ? "gap-[8.273px]" : ""}`}
                >
                    {/* Saving throw */}
                    <div className="relative flex h-[53.771px] w-full shrink-0 items-center gap-[12.409px] rounded-[22.544px] bg-white px-[20.681px] py-[22.544px]">
                        <ProfRing
                            label={`${name} saving throw`}
                            variant={ability.savingThrowRing ?? "save"}
                        />
                        <Icon {...SAVING_THROW_ICON} />
                        <p className="relative shrink-0 whitespace-nowrap text-[20.681px] font-normal not-italic leading-[normal] text-black">
                            Saving Throw
                        </p>
                    </div>

                    {skills.length > 0 && (
                        <>
                            <div className="relative flex h-[53.771px] w-full shrink-0 items-center justify-center gap-[12.409px] rounded-[8.273px] border-2 border-solid border-black bg-[#f8f8f8] px-[20.681px] py-[22.544px]">
                                <Icon src={asset("skills")} w={33.817} h={29.59} />
                                <p className="relative shrink-0 whitespace-nowrap text-[20.681px] font-semibold not-italic leading-[normal] text-black">
                                    Skills
                                </p>
                            </div>
                            {skills.map((skill) => (
                                <SkillRow
                                    key={skill.label}
                                    skill={skill}
                                    abilityKey={abilityKey}
                                    modifier={modifier}
                                    proficiencyBonus={proficiencyBonus}
                                    initialLevel={initialSkillLevels?.[skill.label] ?? 0}
                                    onLevelChange={(level) =>
                                        onSkillLevelChange?.(abilityKey, skill.label, level)
                                    }
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/** Proficiency Bonus / Inspiration — a blank box with a label beside it. */
function CounterCard({
    label,
    value,
    onValueChange,
    exportField,
    automaticValue,
}: {
    label: ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    /** Names the card for the HTML download, where it derives a value. */
    exportField?: string;
    /** The derived value behind it; see `applyDerived` in the download runtime. */
    automaticValue?: string;
}) {
    return (
        <div
            data-cs={exportField}
            data-cs-auto={automaticValue}
            className="relative flex w-full shrink-0 flex-wrap content-start items-start gap-y-[3.5px] rounded-[22.749px] border-[4.136px] border-solid border-[#ffb800] p-[10.794px]"
        >
            <div className="relative flex w-full items-center gap-[24.672px] overflow-clip rounded-[16.545px] bg-[#f8f8f8] p-[12.409px]">
                <div className="relative flex shrink-0 flex-col items-center rounded-[9.252px] border-2 border-solid border-black bg-white px-[15.42px] py-[12.336px]">
                    <Blank
                        label={typeof label === "string" ? label : "Proficiency Bonus"}
                        sizer="+2"
                        value={value}
                        onChange={onValueChange}
                        wrapperClassName="w-full"
                        textClassName="text-[71.961px] font-medium not-italic leading-[normal] text-black"
                    />
                </div>
                <p className="relative shrink-0 whitespace-nowrap text-[30.841px] font-normal not-italic leading-[normal] text-black">
                    {label}
                </p>
            </div>
        </div>
    );
}

const ABILITIES_LEFT: AbilityDef[] = [
    {
        abbr: "WIS",
        rest: "DOM",
        icon: asset("ability-wisdom"),
        iconW: 40.328,
        iconH: 41.767,
        headerAlign: "items-start",
        skills: [
            { label: "Animal Handling", icon: asset("skill-animal-handling"), w: 28.744, h: 28.744 },
            { label: "Insight", icon: asset("skill-insight"), w: 28.744, h: 28.744 },
            { label: "Medicine", icon: asset("skill-medicine"), w: 28.744, h: 26.948 },
            { label: "Perception", icon: asset("skill-perception"), w: 35.93, h: 25.151 },
            { label: "Survival", icon: asset("skill-survival"), w: 28.688, h: 28.744 },
        ],
    },
    {
        abbr: "INT",
        rest: "eLLIGENCE",
        icon: asset("ability-intelligence"),
        iconW: 47.792,
        iconH: 40.53,
        headerAlign: "items-center justify-center",
        skills: [
            { label: "Arcana", icon: asset("skill-arcana"), w: 33.817, h: 33.817 },
            { label: "History", icon: asset("skill-history"), w: 33.817, h: 33.817 },
            { label: "Investigation", icon: asset("skill-investigation"), w: 33.685, h: 33.751 },
            { label: "Nature", icon: asset("skill-nature"), w: 33.817, h: 30.514 },
            { label: "Religion", icon: asset("skill-religion"), w: 40.752, h: 33.751 },
        ],
    },
    {
        abbr: "CON",
        rest: "Stitution",
        icon: asset("ability-constitution"),
        iconW: 40.283,
        iconH: 36.135,
        headerAlign: "items-center justify-center",
        skills: [],
    },
];

const ABILITIES_RIGHT: AbilityDef[] = [
    {
        abbr: "STR",
        rest: "eNgth",
        icon: asset("ability-strength"),
        iconW: 41.634,
        iconH: 41.767,
        savingThrowRing: "save-alt",
        headerAlign: "items-center justify-center",
        skills: [{ label: "Athletics", icon: asset("skill-athletics"), w: 42.271, h: 29.59 }],
    },
    {
        abbr: "DEX",
        rest: "Terity",
        icon: asset("ability-dexterity"),
        iconW: 47.973,
        iconH: 40.523,
        headerAlign: "items-center justify-center",
        skills: [
            { label: "Acrobatics", icon: asset("skill-acrobatics"), w: 37.978, h: 29.59 },
            { label: "Sleight of Hand", icon: asset("skill-sleight-of-hand"), w: 35.864, h: 33.817 },
            { label: "Stealth", icon: asset("skill-stealth"), w: 29.59, h: 33.883 },
        ],
    },
    {
        abbr: "Cha",
        rest: "risma",
        icon: asset("ability-charisma"),
        iconW: 38.778,
        iconH: 40.969,
        headerAlign: "items-start",
        skills: [
            { label: "Deception", icon: asset("skill-deception"), w: 28.744, h: 28.744 },
            { label: "Intimidation", icon: asset("skill-intimidation"), w: 28.744, h: 28.744 },
            { label: "Perception", icon: asset("skill-perception"), w: 35.93, h: 25.151 },
            { label: "Performance", icon: asset("skill-performance"), w: 28.744, h: 28.576 },
            { label: "Persuasion", icon: asset("skill-persuasion"), w: 28.744, h: 28.744 },
        ],
    },
];

/* ------------------------------------------------------------------ */
/* Equipment                                                           */
/* ------------------------------------------------------------------ */

/** Armor Type / Shield — a single-line proficiency field. */
function EquipmentField({
    icon,
    label,
    options,
    initialValue,
}: {
    icon: ReactNode;
    label: string;
    options: string[];
    initialValue?: string;
}) {
    return (
        <div className="relative flex w-full shrink-0 items-center gap-[14.067px] rounded-[14.067px] border-2 border-solid border-black bg-white px-[28.135px] py-[14.067px]">
            {icon}
            <p className="relative shrink-0 whitespace-nowrap text-[29.933px] font-normal not-italic leading-[normal] text-black">
                {label}
            </p>
            <SuggestInput
                label={label}
                options={options}
                initialValue={initialValue}
                className="text-[29.933px] font-normal not-italic leading-[normal] text-black"
            />
        </div>
    );
}

/** Weapons / Tools — a labelled block with room to write, one entry per line. */
function EquipmentBlock({
    icon,
    label,
    options,
    height,
    initialValue,
}: {
    icon: ReactNode;
    label: string;
    options: string[];
    height: number;
    initialValue?: string;
}) {
    return (
        <div
            className="relative flex w-full shrink-0 flex-col items-start rounded-[14.067px] border-2 border-solid border-black bg-white px-[28.135px] py-[14.067px]"
            style={{ height: `${height}px` }}
        >
            <div className="relative flex shrink-0 items-center gap-[14.967px]">
                {icon}
                <p className="relative shrink-0 whitespace-nowrap text-[29.933px] font-normal not-italic leading-[normal] text-black">
                    {label}
                </p>
            </div>
            <SuggestTextArea
                label={label}
                options={options}
                initialValue={initialValue}
                className="text-[29.933px] font-normal not-italic leading-[normal] text-black"
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Actions table                                                       */
/* ------------------------------------------------------------------ */

const ACTION_COLUMNS = [
    { label: "Action", width: 251.606 },
    { label: "Atk. bonus", width: 200.108 },
    { label: "Damage & Type", width: 337.102 },
    { label: "Range / Reach", width: 337.102 },
];

const ACTION_ROW_COUNT = 6;

function formatFeatures(
    features: { level: number; name: string; description?: string }[] | undefined,
    maximumLevel: number,
) {
    return (features ?? [])
        .filter((feature) => !feature.level || feature.level <= maximumLevel)
        .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
        .map(
            (feature) =>
                `${feature.name}${feature.description ? `: ${feature.description}` : ""}`,
        )
        .join("\n\n");
}

type ActionValue = { action?: string; attack?: string; damage?: string; range?: string };

function ActionRow({ index, initial }: { index: number; initial?: ActionValue }) {
    const [values, setValues] = useState([
        initial?.action ?? "",
        initial?.attack ?? "",
        initial?.damage ?? "",
        initial?.range ?? "",
    ]);
    return (
        <div className="relative flex w-full items-start gap-[23.768px] rounded-[23.768px] px-[47.535px] py-[23.768px]">
            {ACTION_COLUMNS.map((column, i) => (
                <div key={column.label} className="contents">
                    {i > 0 && (
                        <ColumnRule
                            src={i === 3 ? asset("table-divider-thin") : asset("table-divider")}
                            edge={i === 3 ? "-1.24px" : "-2px"}
                        />
                    )}
                    <Blank
                        label={`${column.label}, row ${index + 1}`}
                        sizer={column.label}
                        align="left"
                        value={values[i]}
                        onChange={(next) =>
                            setValues((current) =>
                                current.map((value, valueIndex) =>
                                    valueIndex === i ? next : value,
                                ),
                            )
                        }
                        wrapperStyle={{ flexGrow: column.width, flexBasis: 0, minWidth: 0 }}
                        textClassName="whitespace-nowrap text-[29.71px] font-medium not-italic leading-[normal] text-black"
                    />
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sheet                                                               */
/* ------------------------------------------------------------------ */

/**
 * What the spellbook pages fill their header row in from. Every field is a
 * list, appended with the sheet's usual " / ", so a multiclassed caster keeps
 * one entry per source rather than losing all but the first.
 *
 * Page 1 reports Class, Sub-class and Species and the numbers they derive;
 * page 2 adds the feats, and CharacterSheetPage appends the two.
 */
export type SpellcastingSummary = {
    /** "Wizard / Evocation / High Elf". */
    sources: string;
    /** "INT / WIS". */
    ability: string;
    /** "15", or "15 / 13" when two classes cast off different abilities. */
    saveDc: string;
    /** "+7", or "+7 / +5". */
    attackBonus: string;
    /**
     * Slots by spell level, indexed 1-9, or null while the classes behind them
     * are unknown — which leaves the spellbook blocks as they are drawn.
     */
    slots: SpellSlots | null;
};

export const EMPTY_SPELLCASTING: SpellcastingSummary = {
    sources: "",
    ability: "",
    saveDc: "",
    attackBonus: "",
    slots: null,
};

/**
 * Appended into one list, blanks and repeats dropped. Entries may themselves
 * be lists, so two of these can be appended again without nesting.
 */
export function appendList(entries: (string | undefined)[]): string {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const entry of entries.flatMap((value) => splitList(value ?? ""))) {
        const key = entry.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(entry);
    }
    return out.join(" / ");
}

/**
 * Memoised: the page host now re-renders whenever page 2's feats change, and
 * this page — the largest of the four — has no part in that.
 */
export const CharacterSheetA4 = memo(function CharacterSheetA4({
    initialCharacter,
    onSpellcastingChange,
    onSpeciesChange,
    onPerceptionModifierChange,
}: {
    initialCharacter?: CharacterData;
    /** Reports what pages 3 and 4 fill their Spell Casting header row with. */
    onSpellcastingChange?: (summary: SpellcastingSummary) => void;
    /** Reports the Species page 2 looks its Species Traits up from. */
    onSpeciesChange?: (species: string) => void;
    /**
     * Reports the Perception modifier this page derives — page 2's Passive
     * Perception is 10 plus it. Null while the Wisdom score is blank, so that
     * page keeps a blank of its own rather than showing a bare 10.
     */
    onPerceptionModifierChange?: (modifier: number | null) => void;
}) {
    const suggestions = useSheetSuggestions();
    const [characterName, setCharacterName] = useState(initialCharacter?.name ?? "");
    const [characterClass, setCharacterClass] = useState(initialCharacter?.class?.name ?? "");
    const [characterSubclass, setCharacterSubclass] = useState(
        initialCharacter?.subclass?.name ?? "",
    );
    const [species, setSpecies] = useState(initialCharacter?.race?.name ?? "");
    const [background, setBackground] = useState(initialCharacter?.background?.name ?? "");
    const [characterLevel, setCharacterLevel] = useState(
        initialCharacter ? `${initialCharacter.level}` : "",
    );
    const [abilityModifiers, setAbilityModifiers] = useState<
        Partial<Record<string, number | null>>
    >(() => {
        if (!initialCharacter) return {};
        const scores = finalAbilityScores(initialCharacter);
        return Object.fromEntries(
            Object.entries(scores).map(([ability, score]) => [
                ability,
                abilityModifier(score),
            ]),
        );
    });
    // Every other skill ring is the row's own business; Perception's is read
    // back because page 2's Passive Perception is derived from it.
    const [perceptionLevel, setPerceptionLevel] = useState<ProficiencyLevel>(() => {
        const perception = initialCharacter?.proficiencies?.skills.find(
            (skill) => skill.name.trim().toLowerCase() === "perception",
        );
        return perception?.expertise ? 2 : perception?.proficient ? 1 : 0;
    });
    const [hitDieOverride, setHitDieOverride] = useState<{
        source: string;
        value: string;
    } | null>(null);
    const [pointOverride, setPointOverride] = useState<{
        source: string;
        value: string;
    } | null>(null);

    // Preserve the order in which classes were entered: any remainder from an
    // uneven level split belongs to the earliest classes, especially the first.
    const selectedClasses = useMemo(() => {
        const byName = new Map(
            suggestions.classes.map((item) => [item.name.toLowerCase(), item]),
        );
        const selected: typeof suggestions.classes = [];
        const seen = new Set<string>();

        for (const name of splitList(characterClass)) {
            const item = byName.get(name.toLowerCase());
            if (!item || seen.has(item.id)) continue;
            seen.add(item.id);
            selected.push(item);
        }
        return selected;
    }, [suggestions.classes, characterClass]);

    // Narrow the subclass suggestions to the selected classes. A multiclassed
    // character draws from every class they have taken. Only fall back to the
    // full list while no entered value matches a known class; once a class is
    // selected, an empty match must stay empty rather than leaking unrelated
    // subclass suggestions back into the menu.
    const subclassOptions = useMemo(() => {
        const selectedClassIds = new Set(selectedClasses.map((c) => c.id.toLowerCase()));

        if (!selectedClassIds.size) {
            return suggestions.subclasses.map((s) => s.name);
        }

        return suggestions.subclasses
            .filter(
                (s) =>
                    s.parentClassId &&
                    selectedClassIds.has(s.parentClassId.toLowerCase()),
            )
            .map((s) => s.name);
    }, [suggestions.subclasses, selectedClasses]);

    const isMulticlass = selectedClasses.length > 1;
    const allocatedClassLevels = useMemo(() => {
        const totalLevel = Number.parseInt(characterLevel, 10);
        if (
            !Number.isInteger(totalLevel) ||
            totalLevel <= 0 ||
            selectedClasses.length === 0
        ) {
            return [];
        }

        return splitLevels(totalLevel, selectedClasses.length);
    }, [characterLevel, selectedClasses]);

    const automaticHitDice = useMemo(() => {
        if (
            allocatedClassLevels.length !== selectedClasses.length ||
            selectedClasses.some((item) => !item.hitDie)
        ) {
            return "";
        }

        return selectedClasses
            .map((item, index) => `${allocatedClassLevels[index]}d${item.hitDie}`)
            .join(" + ");
    }, [allocatedClassLevels, selectedClasses]);
    const hitDieValue =
        isMulticlass && hitDieOverride?.source === automaticHitDice
            ? hitDieOverride.value
            : automaticHitDice;

    // Multiclass Hit Dice may be manually adjusted, so read the class levels
    // back from that field before calculating each class-specific point pool.
    const hitDieClassLevels = useMemo(() => {
        const parts = hitDieValue.split("+").map((part) => part.trim());
        if (parts.length !== selectedClasses.length) return allocatedClassLevels;

        const parsed = parts.map((part) => {
            const match = /^(\d+)\s*d\d+$/i.exec(part);
            return match ? Number.parseInt(match[1], 10) : Number.NaN;
        });
        return parsed.every(Number.isFinite) ? parsed : allocatedClassLevels;
    }, [hitDieValue, selectedClasses.length, allocatedClassLevels]);

    const pointResources = selectedClasses.flatMap((item, index) => {
        const label = CLASS_POINT_LABELS[item.id] ?? item.pointLabel?.trim();
        return label ? [{ label, classIndex: index }] : [];
    });
    const resourceTotals = new Map<string, number>();
    for (const resource of pointResources) {
        const classId = selectedClasses[resource.classIndex]?.id ?? "";
        const amount = classPointAmount(classId, hitDieClassLevels[resource.classIndex] ?? 0);
        if (Number.isFinite(amount) && amount > 0) resourceTotals.set(resource.label, (resourceTotals.get(resource.label) ?? 0) + amount);
    }
    const adeptSorceryPoints = featResourceAmount(initialCharacter?.feats ?? [], "Sorcery Points");
    if (adeptSorceryPoints) resourceTotals.set("Sorcery Points", (resourceTotals.get("Sorcery Points") ?? 0) + adeptSorceryPoints);
    const pointLabel = resourceTotals.size ? [...resourceTotals.keys()].join(" + ") : "Points";
    const automaticPointValue = resourceTotals.size ? [...resourceTotals.values()].join(" + ") : "";
    const pointValue =
        pointOverride?.source === automaticPointValue
            ? pointOverride.value
            : automaticPointValue;

    const totalLevel = Number.parseInt(characterLevel, 10);
    const automaticProficiencyBonus =
        Number.isInteger(totalLevel) && totalLevel > 0
            ? formatModifier(proficiencyBonusAt(totalLevel))
            : "";
    const [proficiencyBonus, setProficiencyBonus] = useEditableAutoValue(
        automaticProficiencyBonus,
    );
    const parsedProficiencyBonus = parseProficiencyBonus(proficiencyBonus);

    const selectedSubclassDocs = splitList(characterSubclass)
        .map((name) =>
            suggestions.subclasses.find(
                (item) => item.name.toLowerCase() === name.toLowerCase(),
            ),
        )
        .filter((item) => item !== undefined);
    const subclassSaveAbility = selectedSubclassDocs
        .map((item) => item.spellcastingAbility ?? item.magicAbility)
        .find(Boolean);
    const classSaveAbility = selectedClasses
        .map(
            (item) =>
                item.spellcastingAbility ??
                CLASS_SAVE_ABILITIES[item.id] ??
                item.primaryAbility?.[0],
        )
        .find(Boolean);
    const skillSaveAbility = normalizeAbilityKey(subclassSaveAbility ?? classSaveAbility);
    const skillSaveModifier = skillSaveAbility
        ? abilityModifiers[skillSaveAbility]
        : undefined;
    const automaticSkillSaveDc =
        parsedProficiencyBonus !== null && typeof skillSaveModifier === "number"
            ? `${8 + parsedProficiencyBonus + skillSaveModifier}`
            : "";
    const [skillSaveDc, setSkillSaveDc] = useEditableAutoValue(automaticSkillSaveDc);

    const selectedSpecies = suggestions.species.find(
        (item) => item.name.toLowerCase() === species.trim().toLowerCase(),
    );
    const monkIndex = selectedClasses.findIndex((item) => item.id === "monk");
    const monkLevel = monkIndex >= 0 ? (hitDieClassLevels[monkIndex] ?? 0) : 0;
    const automaticSpeed = typeof selectedSpecies?.speed === "number"
        ? `${walkingSpeed(selectedSpecies.speed, monkLevel, initialCharacter?.equipment ?? [])}`
        : "";
    const [speed, setSpeed] = useEditableAutoValue(automaticSpeed);

    // The spellbook pages head every page with where the character's magic
    // comes from and the numbers it sets, so report both upward as they are
    // entered here. Classes and subclasses are the only sources the Archive
    // records a casting ability for; a species or feat that grants spells is
    // still listed, and its ability typed in on the spellbook page.
    const castingAbilities: string[] = [];
    for (const source of [
        ...selectedClasses.map((item) => item.spellcastingAbility),
        ...selectedSubclassDocs.map((item) => item.spellcastingAbility ?? item.magicAbility),
    ]) {
        const ability = normalizeAbilityKey(source);
        if (ability && !castingAbilities.includes(ability)) castingAbilities.push(ability);
    }
    const castingModifiers = castingAbilities
        .map((ability) => abilityModifiers[ability])
        .filter((modifier): modifier is number => typeof modifier === "number");
    const spellcastingSources = appendList([
        ...spellGrantingSources(
            splitList(characterClass),
            suggestions.classes,
            classGrantsSpells,
        ),
        ...spellGrantingSources(
            splitList(characterSubclass),
            suggestions.subclasses,
            subclassGrantsSpells,
        ),
        ...spellGrantingSources(splitList(species), suggestions.species, speciesGrantsSpells),
    ]);
    const spellcastingAbility = appendList(castingAbilities);
    const spellcastingSaveDc =
        parsedProficiencyBonus === null
            ? ""
            : appendList(
                  castingModifiers.map(
                      (modifier) => `${8 + parsedProficiencyBonus + modifier}`,
                  ),
              );
    const spellcastingAttackBonus =
        parsedProficiencyBonus === null
            ? ""
            : appendList(
                  castingModifiers.map((modifier) =>
                      formatModifier(parsedProficiencyBonus + modifier),
                  ),
              );

    // Only a subclass casting off spell slots of its own adds to them —
    // Eldritch Knight and Arcane Trickster, not a monk's ki spells.
    const slotCastingClassIds = useMemo(
        () =>
            new Set(
                splitList(characterSubclass)
                    .map((name) =>
                        suggestions.subclasses.find(
                            (item) => item.name.toLowerCase() === name.toLowerCase(),
                        ),
                    )
                    .filter((item) => item?.magicType?.toLowerCase().includes("spell slot"))
                    .map((item) => item?.parentClassId?.toLowerCase()),
            ),
        [suggestions.subclasses, characterSubclass],
    );

    /** The slots the classes taken grant at a given split of their levels. */
    const slotsForLevels = useCallback(
        (classLevels: number[]) =>
            spellSlotsByLevel(
                selectedClasses.map((item, index) => ({
                    progression: item.spellcaster,
                    id: item.id,
                    level: classLevels[index],
                    subclassCasts: slotCastingClassIds.has(item.id.toLowerCase()),
                })),
            ),
        [selectedClasses, slotCastingClassIds],
    );

    // The slots each spellbook block is headed with, from the class levels held
    // here. Memoised: pages 3 and 4 read the array itself, and a fresh one on
    // every keystroke would put all ten blocks through a re-render.
    const spellSlots = useMemo(
        () => slotsForLevels(hitDieClassLevels),
        [slotsForLevels, hitDieClassLevels],
    );

    /**
     * What keeps the level-driven fields alive in the downloaded HTML, where the
     * Archive is out of reach: the dice the classes taken roll, and — for every
     * level the player might edit their way to — how those classes split that
     * level and the values which follow from it.
     *
     * Levelling up in a standalone file would otherwise leave the hit dice, hit
     * points, class resource and spell slots reading for the level the sheet was
     * downloaded at. Undefined while the classes are unknown, which leaves each
     * of those fields exactly as it was written.
     */
    const exportDerivations = useMemo(() => {
        const dice = selectedClasses.map((item) => item.hitDie ?? 0);
        if (!dice.length || dice.some((die) => !die)) return undefined;

        // Which of the classes taken keep a resource pool, by their position.
        const pointClasses = selectedClasses.flatMap((item, index) =>
            CLASS_POINT_LABELS[item.id] ?? item.pointLabel?.trim() ? [index] : [],
        );

        const byLevel: Record<number, unknown> = {};
        for (let level = 1; level <= MAX_CHARACTER_LEVEL; level += 1) {
            const classLevels = splitLevels(level, dice.length);
            byLevel[level] = {
                proficiencyBonus: formatModifier(proficiencyBonusAt(level)),
                hitDice: classLevels
                    .map((levels, index) => `${levels}d${dice[index]}`)
                    .join(" + "),
                points: pointClasses.length
                    ? pointClasses.map((index) => classLevels[index]).join(" + ")
                    : dice.length > 1
                      ? classLevels.join(" + ")
                      : `${level}`,
                slots: slotsForLevels(classLevels),
                // A score of 1 to 30 puts the modifier between -5 and +10.
                maxHitPoints: Object.fromEntries(
                    Array.from({ length: 16 }, (_, index) => index - 5).map(
                        (constitutionModifier) => [
                            constitutionModifier,
                            averageMaximumHitPoints(
                                dice,
                                classLevels,
                                constitutionModifier,
                            ),
                        ],
                    ),
                ),
            };
        }
        return JSON.stringify({ byLevel });
    }, [selectedClasses, slotsForLevels]);

    // Page 2 fills its Species Traits panel from the Species named here, and
    // its Passive Perception from the Perception modifier this page derives.
    const wisdomModifier = abilityModifiers.WIS;
    const perceptionModifier =
        typeof wisdomModifier === "number"
            ? wisdomModifier + (parsedProficiencyBonus ?? 0) * perceptionLevel
            : null;

    useEffect(() => {
        onSpeciesChange?.(species);
    }, [onSpeciesChange, species]);

    useEffect(() => {
        onPerceptionModifierChange?.(perceptionModifier);
    }, [onPerceptionModifierChange, perceptionModifier]);

    useEffect(() => {
        onSpellcastingChange?.({
            sources: spellcastingSources,
            ability: spellcastingAbility,
            saveDc: spellcastingSaveDc,
            attackBonus: spellcastingAttackBonus,
            slots: spellSlots,
        });
    }, [
        onSpellcastingChange,
        spellSlots,
        spellcastingSources,
        spellcastingAbility,
        spellcastingSaveDc,
        spellcastingAttackBonus,
    ]);

    const dexterityModifier = abilityModifiers.DEX;
    const automaticArmorClass = typeof dexterityModifier === "number"
        ? `${calculateArmorClass(initialCharacter?.equipment ?? [], dexterityModifier)}`
        : "";
    const automaticInitiative = typeof dexterityModifier === "number"
        ? formatModifier(dexterityModifier + alertInitiativeBonus(
            initialCharacter?.feats ?? [],
            initialCharacter?.ruleset,
            Number.isInteger(totalLevel) ? totalLevel : 1,
        ))
        : "";
    const [armorClass, setArmorClass] = useEditableAutoValue(automaticArmorClass);
    const [initiative, setInitiative] = useEditableAutoValue(automaticInitiative);

    const constitutionModifier = abilityModifiers.CON ?? 0;
    const automaticMaximumHitPoints = useMemo(() => {
        if (
            selectedClasses.length === 0 ||
            hitDieClassLevels.length !== selectedClasses.length ||
            selectedClasses.some((item) => !item.hitDie)
        ) {
            return "";
        }

        const maximum = averageMaximumHitPoints(
            selectedClasses.map((item) => item.hitDie ?? 0),
            hitDieClassLevels,
            constitutionModifier,
        );
        return maximum > 0 ? `${maximum}` : "";
    }, [selectedClasses, hitDieClassLevels, constitutionModifier]);
    const [maximumHitPoints, setMaximumHitPoints] = useEditableAutoValue(
        automaticMaximumHitPoints,
    );

    const creatorClassFeaturesBase =
        initialCharacter?.class &&
        splitList(characterClass).some(
            (name) => name.toLowerCase() === initialCharacter.class?.name.toLowerCase(),
        )
            ? formatFeatures(initialCharacter.class.features, initialCharacter.level)
            : "";
    const creatorClassFeatures = [
        creatorClassFeaturesBase,
        initialCharacter?.metamagicChoices?.length
            ? `Metamagic: ${initialCharacter.metamagicChoices.join(", ")}`
            : "",
    ].filter(Boolean).join("\n\n");
    const automaticClassFeatures = selectedClasses.length
        ? selectedClasses
              .map((item, index) =>
                  formatFeatures(
                      item.features?.length
                          ? item.features
                          : item.id === initialCharacter?.class?.id
                            ? initialCharacter.class.features
                            : undefined,
                      hitDieClassLevels[index] ?? 0,
                  ),
              )
              .filter(Boolean)
              .join("\n\n")
        : creatorClassFeatures;
    const creatorSubclassFeatures =
        initialCharacter?.subclass &&
        splitList(characterSubclass).some(
            (name) => name.toLowerCase() === initialCharacter.subclass?.name.toLowerCase(),
        )
            ? formatFeatures(initialCharacter.subclass.features, initialCharacter.level)
            : "";
    const automaticSubclassFeatures = selectedSubclassDocs.length
        ? selectedSubclassDocs
              .map((item) => {
                  const classIndex = selectedClasses.findIndex(
                      (classItem) => classItem.id === item.parentClassId,
                  );
                  return formatFeatures(
                      item.features?.length
                          ? item.features
                          : item.name === initialCharacter?.subclass?.name
                            ? initialCharacter.subclass.features
                            : undefined,
                      hitDieClassLevels[classIndex] ??
                          (Number.isInteger(totalLevel) ? totalLevel : 0),
                  );
              })
              .filter(Boolean)
              .join("\n\n")
        : creatorSubclassFeatures;
    const [classFeatures, setClassFeatures] = useEditableAutoValue(
        automaticClassFeatures,
    );
    const [subclassFeatures, setSubclassFeatures] = useEditableAutoValue(
        automaticSubclassFeatures,
    );

    const spellAttackBonus =
        parsedProficiencyBonus !== null && typeof skillSaveModifier === "number"
            ? formatModifier(parsedProficiencyBonus + skillSaveModifier)
            : "";
    const initialActions: ActionValue[] = [
        ...(initialCharacter?.selectedSpells ?? []).map((spell) => ({
            action: spell.name,
            attack: spellAttackBonus,
            damage: spell.school,
            range: spell.range,
        })),
        ...(initialCharacter?.equipment ?? [])
            .filter((item) => item.type === "Weapon")
            .map((item) => ({
                action: item.name,
                damage: item.properties?.join(", ") ?? "",
            })),
    ].slice(0, ACTION_ROW_COUNT);

    const handleAbilityModifierChange = (ability: string, modifier: number | null) => {
        setAbilityModifiers((current) => ({ ...current, [ability]: modifier }));
    };

    // The sheet prints a Perception row under Charisma as well as Wisdom; only
    // the Wisdom one is the skill Passive Perception is derived from.
    const handleSkillLevelChange = (
        ability: string,
        skill: string,
        level: ProficiencyLevel,
    ) => {
        if (ability === "WIS" && skill === "Perception") setPerceptionLevel(level);
    };

    const classOptions = useMemo(
        () => suggestions.classes.map((c) => c.name),
        [suggestions.classes],
    );
    const initialSkillLevels = Object.fromEntries(
        (initialCharacter?.proficiencies?.skills ?? []).map((skill) => [
            skill.name,
            (skill.expertise ? 2 : skill.proficient ? 1 : 0) as ProficiencyLevel,
        ]),
    );
    const initialAbilityScore = (ability: string) =>
        initialCharacter?.abilityScores[
            ability.toUpperCase() as keyof CharacterData["abilityScores"]
        ];
    const initialArmor = (initialCharacter?.equipment ?? [])
        .filter((item) => item.type === "Armor" && !item.name.toLowerCase().includes("shield"))
        .map((item) => item.name)
        .join(" / ");
    const initialShield = (initialCharacter?.equipment ?? []).find((item) =>
        item.name.toLowerCase().includes("shield"),
    )?.name;
    const initialWeapons = (initialCharacter?.equipment ?? [])
        .filter((item) => item.type === "Weapon")
        .map((item) => item.name)
        .join("\n");
    const initialTools = initialCharacter?.proficiencies?.tools.join("\n") ?? "";

    return (
        <div
            className="cs-root relative bg-white"
            data-cs-derived={exportDerivations}
            style={{ width: `${SHEET_WIDTH}px`, height: `${SHEET_HEIGHT}px` }}
        >
            <div className="absolute left-1/2 top-1/2 h-[3156.687px] w-[2220.373px] -translate-x-1/2 -translate-y-1/2">
                {/* Title */}
                <div className="absolute left-0 top-0 flex items-center gap-[18.569px] whitespace-nowrap not-italic text-black">
                    <div className="flex shrink-0 items-center justify-center">
                        <Icon src={asset("die")} w={48.743} h={55.707} />
                    </div>
                    <p className="relative shrink-0 text-[46.422px] font-bold leading-[normal]">
                        Character Sheet for D&amp;D
                    </p>
                </div>

                <div className="absolute left-0 top-[82.73px] flex flex-col items-start gap-[57.908px]">
                    {/* ---------------- Personal information ---------------- */}
                    <div className="relative flex h-[307.426px] w-[2217.647px] shrink-0 items-start gap-[28.954px]">
                        <div className="relative flex h-full w-[1154.017px] shrink-0 flex-col items-start justify-between">
                            <div className="relative flex h-[192.667px] w-[1156.001px] shrink-0 items-start gap-[25.814px] rounded-[25.814px] border-[3.227px] border-solid border-black p-[25.814px]">
                                <Icon src={asset("name")} w={43.032} h={38.722} />
                                <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start">
                                    <p className="relative shrink-0 whitespace-nowrap text-[32.268px] font-medium not-italic leading-[normal] text-black">
                                        Character name
                                    </p>
                                    <textarea
                                        aria-label="Character name"
                                        value={characterName}
                                        onChange={(event) => setCharacterName(event.target.value)}
                                        className="relative min-h-[1px] w-full flex-[1_0_0] text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                    />
                                </div>
                            </div>
                            <div className="relative flex w-[1156.001px] shrink-0 items-stretch rounded-[25.814px] border-[3.227px] border-solid border-black">
                                <div className="relative flex min-w-0 flex-1 items-center gap-[25.814px] p-[25.814px]">
                                    <Icon src={asset("class")} w={38.722} h={38.722} />
                                    <p className="relative shrink-0 whitespace-nowrap text-[32.268px] font-medium not-italic leading-[normal] text-black">
                                        Class
                                    </p>
                                    <SuggestInput
                                        label="Class"
                                        options={classOptions}
                                        multiple
                                        value={characterClass}
                                        onValueChange={setCharacterClass}
                                        className="text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                    />
                                </div>
                                <div
                                    data-cs="level"
                                    className="relative flex w-[258px] shrink-0 items-center gap-[18px] border-l-[3.227px] border-solid border-black px-[25.814px]"
                                >
                                    <p className="relative shrink-0 whitespace-nowrap text-[32.268px] font-medium not-italic leading-[normal] text-black">
                                        Level
                                    </p>
                                    <Blank
                                        label="Level"
                                        sizer="00"
                                        value={characterLevel}
                                        onChange={(next) => {
                                            const digits = next
                                                .replace(/\D/g, "")
                                                .replace(/^0+(?=\d)/, "");
                                            setCharacterLevel(digits);
                                        }}
                                        inputMode="numeric"
                                        maxLength={2}
                                        wrapperClassName="min-w-0 flex-1"
                                        textClassName="whitespace-nowrap text-[32.268px] font-medium not-italic leading-[normal] tabular-nums text-black"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start justify-between">
                            <HeaderFieldSm
                                label="Species"
                                options={suggestions.species.map((item) => item.name)}
                                value={species}
                                onValueChange={setSpecies}
                                icon={<Icon src={asset("species")} w={27.804} h={37.071} />}
                            />
                            <HeaderFieldSm
                                label="Background"
                                options={suggestions.backgrounds.map((item) => item.name)}
                                value={background}
                                onValueChange={setBackground}
                                icon={<Icon src={asset("background")} w={32.438} h={37.071} />}
                            />
                            <HeaderFieldSm
                                label="Alignment"
                                options={ALIGNMENTS}
                                icon={
                                    <Icon
                                        src={asset("alignment")}
                                        w={31.213}
                                        h={28.375}
                                        inset="-3.33% -3.03%"
                                    />
                                }
                            />
                        </div>
                    </div>

                    {/* ---------------- Body ---------------- */}
                    <div className="relative flex shrink-0 items-stretch gap-[20.681px]">
                        {/* Left: abilities + equipment */}
                        <div className="relative flex w-[827.461px] shrink-0 flex-col items-start gap-[20.681px]">
                            <div className="relative flex w-full shrink-0 items-center gap-[20.681px]">
                                <div className="relative flex w-[402.649px] shrink-0 flex-col items-start gap-[20.681px]">
                                    <CounterCard
                                        exportField="prof-bonus"
                                        automaticValue={automaticProficiencyBonus}
                                        value={proficiencyBonus}
                                        onValueChange={setProficiencyBonus}
                                        label={
                                            <>
                                                Proficiency
                                                <br aria-hidden />
                                                Bonus
                                            </>
                                        }
                                    />
                                    {ABILITIES_LEFT.map((ability) => (
                                        <AbilityCard
                                            key={ability.abbr}
                                            ability={ability}
                                            proficiencyBonus={parsedProficiencyBonus}
                                            onModifierChange={handleAbilityModifierChange}
                                            onSkillLevelChange={handleSkillLevelChange}
                                            initialScore={initialAbilityScore(ability.abbr)}
                                            initialSkillLevels={initialSkillLevels}
                                        />
                                    ))}
                                </div>
                                <div className="relative flex w-[403.082px] shrink-0 flex-col items-start gap-[20.681px]">
                                    <CounterCard label="Inspiration" />
                                    {ABILITIES_RIGHT.map((ability) => (
                                        <AbilityCard
                                            key={ability.abbr}
                                            ability={ability}
                                            proficiencyBonus={parsedProficiencyBonus}
                                            onModifierChange={handleAbilityModifierChange}
                                            onSkillLevelChange={handleSkillLevelChange}
                                            initialScore={initialAbilityScore(ability.abbr)}
                                            initialSkillLevels={initialSkillLevels}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Equipment Training & Proficiencies */}
                            <div className="relative flex w-full shrink-0 items-start rounded-[22.749px] border-[4.136px] border-solid border-[#005f1a] p-[9.02px]">
                                {/* No overflow clip: the equipment fields' suggestion
                                    menus have to escape this box. Its children are
                                    inset by the padding, so nothing needs clipping. */}
                                <div className="relative flex w-full flex-col items-start justify-center rounded-[11.067px] bg-[#f8f8f8] p-[13.834px]">
                                    <div className="relative flex w-full flex-col items-start gap-[8.273px]">
                                        <div className="relative flex w-full shrink-0 items-center gap-[14.067px] rounded-[14.067px] bg-[#f8f8f8] px-[28.135px] py-[14.067px]">
                                            <Icon
                                                src={asset("equipment-training")}
                                                w={39.57}
                                                h={37.996}
                                            />
                                            <p className="relative shrink-0 whitespace-nowrap text-[29.933px] font-semibold not-italic leading-[normal] text-black">
                                                Equipment Training &amp; Proficiencies
                                            </p>
                                        </div>
                                        <EquipmentField
                                            label="Armor Type"
                                            options={suggestions.armor}
                                            initialValue={initialArmor}
                                            icon={<Icon src={asset("armor-type")} w={35.783} h={36} />}
                                        />
                                        <EquipmentField
                                            label="Shield"
                                            options={suggestions.armor}
                                            initialValue={initialShield}
                                            icon={<Icon src={asset("shield")} w={33.762} h={36} />}
                                        />
                                        <EquipmentBlock
                                            label="Weapons"
                                            options={suggestions.weapons}
                                            height={236.473}
                                            initialValue={initialWeapons}
                                            icon={<Icon src={asset("weapons")} w={36.484} h={48.646} />}
                                        />
                                        <EquipmentBlock
                                            label="Tools"
                                            options={suggestions.tools}
                                            height={268}
                                            initialValue={initialTools}
                                            icon={
                                                <div className="relative flex shrink-0 items-center justify-center">
                                                    <div className="flex-none rotate-180 -scale-y-100">
                                                        <Icon
                                                            src={asset("tools")}
                                                            w={41.525}
                                                            h={41.526}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: vitals, actions, features */}
                        <div className="relative flex w-[1373px] shrink-0 flex-col items-center gap-[20.722px]">
                            <div className="relative flex shrink-0 items-stretch gap-[18.082px]">
                                {/* Hit points */}
                                <div className="flex flex-row items-stretch self-stretch">
                                    <div className="relative flex h-full shrink-0 flex-col items-stretch">
                                        <div className="relative flex h-full w-[690.272px] shrink-0 items-stretch gap-[18.645px] rounded-[29.918px] border-[3.561px] border-solid border-[#d40000] p-[18.645px]">
                                            <div className="relative flex w-[331.159px] shrink-0 flex-col items-stretch gap-[15.982px]">
                                                <div
                                                    data-cs="hit-dice"
                                                    data-cs-auto={automaticHitDice}
                                                    className="relative flex h-[148.974px] w-full shrink-0 flex-col items-center justify-end rounded-[17.833px] border-[2.452px] border-solid border-black bg-[#f8f8f8] px-[41.472px] py-[16.553px]"
                                                >
                                                    <FitInput
                                                        label="Hit die"
                                                        value={hitDieValue}
                                                        readOnly={!isMulticlass}
                                                        onChange={(next) => {
                                                            if (isMulticlass) {
                                                                setHitDieOverride({
                                                                    source: automaticHitDice,
                                                                    value: next,
                                                                });
                                                            }
                                                        }}
                                                        className={`relative min-h-[1px] w-full flex-[1_0_0] text-center text-[61.978px] font-medium not-italic leading-[normal] text-black ${
                                                            isMulticlass ? "" : "cursor-default"
                                                        }`}
                                                    />
                                                    <div className="relative flex shrink-0 items-center gap-[5.925px] px-[5.925px]">
                                                        <Icon
                                                            src={asset("hit-die")}
                                                            w={30.805}
                                                            h={30.805}
                                                        />
                                                        <p className="relative shrink-0 whitespace-nowrap text-[24.516px] font-normal not-italic leading-[normal] text-black">
                                                            Hit Die
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-center justify-end rounded-[18.395px] border-[2.516px] border-solid border-black bg-[#f8f8f8] p-[42.555px]">
                                                    <FitInput
                                                        label="Current hit points"
                                                        className="relative min-h-[1px] w-full flex-[1_0_0] text-center text-[63.596px] font-medium not-italic leading-[normal] text-black"
                                                    />
                                                    <div className="relative flex w-full shrink-0 items-center px-[6.079px]">
                                                        <p className="relative shrink-0 whitespace-nowrap text-[25.155px] font-normal not-italic leading-[normal] text-black">
                                                            Current Hit points
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex min-w-[1px] flex-[1_0_0] flex-col items-stretch gap-[15.982px]">
                                                <div className="relative flex h-[148.974px] w-full shrink-0 flex-col items-center justify-end rounded-[17.833px] border-[2.452px] border-solid border-black bg-[#f8f8f8] px-[41.472px] py-[16.553px]">
                                                    <FitInput
                                                        label="Temporary hit points"
                                                        className="relative min-h-[1px] w-full flex-[1_0_0] text-center text-[61.978px] font-medium not-italic leading-[100.04%] text-black bg-transparent"
                                                    />
                                                    <div className="relative flex w-full shrink-0 items-center gap-[5.925px] px-[5.925px]">
                                                        <Icon
                                                            src={asset("temp-hit-points")}
                                                            w={20.022}
                                                            h={17.768}
                                                            inset="-1.6% -1.43% -1.61% -1.42%"
                                                        />
                                                        <p className="relative shrink-0 whitespace-nowrap text-[24.516px] font-normal not-italic leading-[normal] text-black">
                                                            Temp Hit points
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    data-cs="max-hit-points"
                                                    data-cs-auto={automaticMaximumHitPoints}
                                                    className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-center justify-end rounded-[18.395px] border-[2.516px] border-solid border-black bg-[#f8f8f8] p-[42.555px]"
                                                >
                                                    <FitInput
                                                        label="Maximum hit points"
                                                        value={maximumHitPoints}
                                                        onChange={setMaximumHitPoints}
                                                        className="relative min-h-[1px] w-full flex-[1_0_0] text-center text-[63.596px] font-medium not-italic leading-[100.04%] text-black bg-transparent"
                                                    />
                                                    <div className="relative flex w-full shrink-0 items-center gap-[6.079px] px-[6.079px]">
                                                        <Icon
                                                            src={asset("max-hit-points")}
                                                            w={25.703}
                                                            h={22.49}
                                                        />
                                                        <p className="relative shrink-0 whitespace-nowrap text-[25.155px] font-normal not-italic leading-[normal] text-black">
                                                            Max Hit points
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Speed / Armor class / Initiative */}
                                <div className="relative flex w-[389px] shrink-0 flex-wrap content-start items-start gap-[13.96px] rounded-[21.627px] border-[3.561px] border-solid border-[#0090ff] p-[13.96px]">
                                    {[
                                        {
                                            label: "Speed",
                                            exportField: undefined,
                                            automaticValue: undefined,
                                            icon: <Icon src={asset("speed")} w={29.76} h={29.745} />,
                                            value: speed,
                                            setValue: setSpeed,
                                            gap: "gap-[6.078px] px-[6.078px]",
                                            text: "text-[25.149px]",
                                        },
                                        {
                                            label: "Armor class",
                                            exportField: "armor-class",
                                            automaticValue: automaticArmorClass,
                                            icon: (
                                                <Icon src={asset("armor-class")} w={27.778} h={29.619} />
                                            ),
                                            value: armorClass,
                                            setValue: setArmorClass,
                                            gap: "gap-[5.989px] px-[5.989px]",
                                            text: "text-[24.782px]",
                                        },
                                        {
                                            label: "Initiative",
                                            exportField: "initiative",
                                            automaticValue: automaticInitiative,
                                            icon: (
                                                <Icon src={asset("initiative")} w={24.87} h={21.761} />
                                            ),
                                            value: initiative,
                                            setValue: setInitiative,
                                            gap: "gap-[6.078px] px-[6.078px]",
                                            text: "text-[25.149px]",
                                        },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            data-cs={stat.exportField}
                                            data-cs-auto={stat.automaticValue}
                                            className="relative flex w-full items-center gap-[23.409px] overflow-clip rounded-[15.698px] bg-[#f8f8f8] p-[11.773px]"
                                        >
                                            <div className="relative flex shrink-0 flex-col items-center rounded-[8.778px] border-[1.898px] border-solid border-black bg-white px-[14.63px] py-[11.704px]">
                                                <Blank
                                                    label={stat.label}
                                                    sizer="+2"
                                                    value={stat.value}
                                                    onChange={stat.setValue}
                                                    wrapperClassName="w-full"
                                                    textClassName="text-[68.275px] font-medium not-italic leading-[normal] text-black"
                                                />
                                            </div>
                                            <div
                                                className={`relative flex shrink-0 items-center ${stat.gap}`}
                                            >
                                                {stat.icon}
                                                <p
                                                    className={`relative shrink-0 whitespace-nowrap ${stat.text} font-medium not-italic leading-[normal] text-black`}
                                                >
                                                    {stat.label}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Death saves */}
                                <div className="relative flex shrink-0 items-start rounded-[19.609px] border-[3.565px] border-solid border-[#d40000] p-[12.22px]">
                                    <div className="relative flex w-[233.124px] shrink-0 flex-col items-center gap-[8.975px] rounded-[14.855px] bg-[#f8f8f8] p-[31.413px]">
                                        <div className="relative flex w-[228.865px] shrink-0 items-center justify-center gap-[4.488px] rounded-[4.488px] p-[13.463px]">
                                            <Icon src={asset("death-saves")} w={36.746} h={38.453} />
                                            <p className="relative shrink-0 whitespace-nowrap text-[18.569px] font-normal not-italic leading-[normal] text-black">
                                                Death Saves
                                            </p>
                                        </div>
                                        <div className="relative flex w-[228.865px] shrink-0 items-center justify-center gap-[13.463px]">
                                            <div className="relative flex shrink-0 flex-col items-center gap-[13.463px] p-[13.463px]">
                                                <p className="relative shrink-0 whitespace-nowrap text-[17.95px] font-normal not-italic leading-[100.08%] text-black">
                                                    Success
                                                </p>
                                                <DeathSaveTrack kind="success" />
                                                <Icon
                                                    src={asset("death-save-success-icon")}
                                                    w={38.784}
                                                    h={38.784}
                                                />
                                            </div>
                                            <div className="relative flex h-[226.032px] w-0 shrink-0 items-center justify-center">
                                                <div className="flex-none -rotate-90">
                                                    <div className="relative h-0 w-[226.032px]">
                                                        <div
                                                            className="absolute"
                                                            style={{ inset: "-0.86px 0" }}
                                                        >
                                                            <img
                                                                alt=""
                                                                src={asset("death-saves-divider")}
                                                                className="block size-full max-w-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex h-[282.716px] w-[98.726px] shrink-0 flex-col items-center gap-[13.463px] p-[13.463px]">
                                                <p className="relative shrink-0 whitespace-nowrap text-[17.95px] font-normal not-italic leading-[100.08%] text-black">
                                                    Failure
                                                </p>
                                                <DeathSaveTrack kind="failure" />
                                                <Icon
                                                    src={asset("death-save-failure-icon")}
                                                    w={32.701}
                                                    h={32.701}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions & Spells casting */}
                            <div className="relative flex w-full shrink-0 items-start rounded-[22.795px] border-[4.144px] border-solid border-[#d40000] p-[12.488px]">
                                <div className="relative flex w-full flex-col items-start justify-center overflow-clip rounded-[15.324px] bg-[#f8f8f8] p-[19.155px]">
                                    <div className="relative flex w-full flex-col items-start gap-[7.662px]">
                                        <div className="relative flex w-full shrink-0 items-center justify-between rounded-[19.477px] bg-[#f8f8f8] px-[38.955px] py-[19.477px]">
                                            <div className="relative h-[35px] w-[388.689px] shrink-0">
                                                <div className="absolute left-0 top-[2.89px] size-[29.212px]">
                                                    <img
                                                        alt=""
                                                        src={asset("actions-spells")}
                                                        className="absolute inset-0 block size-full max-w-none"
                                                    />
                                                </div>
                                                <p className="absolute left-[48.69px] top-0 whitespace-nowrap text-[29.216px] font-semibold not-italic leading-[normal] text-black">
                                                    Actions &amp; Spells casting
                                                </p>
                                            </div>
                                            <div
                                                data-cs="skill-save-dc"
                                                data-cs-abilities={skillSaveAbility}
                                                data-cs-auto={automaticSkillSaveDc}
                                                className="relative flex h-[91px] w-[549px] shrink-0 items-center gap-[23.68px] overflow-clip rounded-[17px] border-[3.227px] border-solid border-black px-[23.68px]"
                                            >
                                                <p className="relative shrink-0 whitespace-nowrap text-[32.268px] font-medium not-italic leading-[normal] text-black">
                                                    Skill Save DC
                                                </p>
                                                <FitInput
                                                    label="Skill Save DC"
                                                    value={skillSaveDc}
                                                    onChange={setSkillSaveDc}
                                                    className="relative min-w-[1px] flex-[1_0_0] text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative flex w-full items-start gap-[23.768px] rounded-[23.768px] bg-white px-[47.535px] py-[23.768px]">
                                            {ACTION_COLUMNS.map((column, i) => (
                                                <div key={column.label} className="contents">
                                                    {i > 0 && (
                                                        <ColumnRule
                                                            src={
                                                                i === 3
                                                                    ? asset("table-divider-thin")
                                                                    : asset("table-divider")
                                                            }
                                                            edge={i === 3 ? "-1.24px" : "-2px"}
                                                        />
                                                    )}
                                                    <p
                                                        className="relative whitespace-nowrap text-[29.71px] font-medium not-italic leading-[normal] text-black"
                                                        style={{ flexGrow: column.width, flexBasis: 0, minWidth: 0 }}
                                                    >
                                                        {column.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative flex w-full flex-col items-start rounded-[37.398px] bg-[#f8f8f8]">
                                            {Array.from({ length: ACTION_ROW_COUNT }, (_, index) => (
                                                <ActionRow
                                                    key={index}
                                                    index={index}
                                                    initial={initialActions[index]}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Class & Subclass Features */}
                            <div className="relative flex min-h-[1px] w-full flex-[1_0_0] items-stretch rounded-[22.795px] border-[4.144px] border-solid border-[#0090ff] p-[12.488px]">
                                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-stretch overflow-clip rounded-[15.324px] bg-[#f8f8f8] p-[19.155px]">
                                    <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-start gap-[7.662px]">
                                        <div className="relative flex w-full shrink-0 items-center justify-between rounded-[19.477px] bg-[#f8f8f8] py-[19.477px] pl-[38.955px]">
                                            <div className="relative flex shrink-0 items-center gap-[19px]">
                                                <Icon
                                                    src={asset("class-features")}
                                                    w={39.151}
                                                    h={39.151}
                                                />
                                                <p className="relative shrink-0 whitespace-nowrap text-[29.216px] font-semibold not-italic leading-[normal] text-black">
                                                    Class &amp; Subclass Features
                                                </p>
                                            </div>
                                            <div className="relative flex w-[656px] shrink-0 items-center gap-[25.814px] rounded-[17px] border-[3.227px] border-solid border-black px-[25.814px] py-[25.814px]">
                                                <p className="relative shrink-0 whitespace-nowrap text-[32.268px] font-medium not-italic leading-[normal] text-black">
                                                    Subclass
                                                </p>
                                                <SuggestInput
                                                    label="Subclass"
                                                    options={subclassOptions}
                                                    multiple
                                                    value={characterSubclass}
                                                    onValueChange={setCharacterSubclass}
                                                    className="text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative flex min-h-[1px] w-full flex-[1_0_0] items-center justify-center gap-[23.768px] rounded-[23.768px] bg-white px-[47.535px] py-[23.768px]">
                                            {/* Centre rule from the design */}
                                            <div
                                                className="relative flex h-full min-w-[1px] flex-[1_0_0] items-center justify-center"
                                                style={{ containerType: "size" }}
                                            >
                                                <div className="h-0 w-[100cqh] flex-none rotate-90">
                                                    <div className="relative size-full">
                                                        <div
                                                            className="absolute"
                                                            style={{ inset: "-2px 0 0 0" }}
                                                        >
                                                            <img
                                                                alt=""
                                                                src={asset("features-divider")}
                                                                className="block size-full max-w-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <textarea
                                                aria-label="Class features"
                                                value={classFeatures}
                                                onChange={(event) =>
                                                    setClassFeatures(event.target.value)
                                                }
                                                className="absolute bottom-[23.768px] left-[47.535px] top-[23.768px] w-[calc(50%_-_59.419px)] text-[29.71px] font-medium not-italic leading-[normal] text-black"
                                            />
                                            <textarea
                                                aria-label="Subclass features"
                                                value={subclassFeatures}
                                                onChange={(event) =>
                                                    setSubclassFeatures(event.target.value)
                                                }
                                                className="absolute bottom-[220px] right-[47.535px] top-[23.768px] w-[calc(50%_-_59.419px)] text-[29.71px] font-medium not-italic leading-[normal] text-black"
                                            />

                                            <div
                                                data-cs="class-points"
                                                data-cs-auto={automaticPointValue}
                                                className="absolute left-[1016.4px] top-[995.7px] h-[189px] w-[261px] overflow-clip rounded-[17px] border-[3.227px] border-solid border-black"
                                            >
                                                <FitInput
                                                    label={pointLabel}
                                                    value={pointValue}
                                                    onChange={(next) =>
                                                        setPointOverride({
                                                            source: automaticPointValue,
                                                            value: next,
                                                        })
                                                    }
                                                    className="absolute left-[28.79px] top-0 h-[123.81px] w-[197px] text-right text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                                />
                                                <FitLabel
                                                    label="Class point resource"
                                                    value={pointLabel}
                                                    className="absolute left-[28.79px] top-[123.81px] h-[39px] w-[197px] whitespace-nowrap text-right text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
