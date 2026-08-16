import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DiceD20 } from "../DiceIcons";
import { useSheetSuggestions } from "../../hooks/useSheetSuggestions";
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

/** Below this share of the designed size the text stops being readable. */
const MIN_FIT_SCALE = 0.42;

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
}: {
    label: string;
    className: string;
    inputMode?: "numeric";
}) {
    const [text, setText] = useState("");
    const [inputRef, fitStyle] = useFitText<HTMLInputElement>(text);
    return (
        <input
            ref={inputRef}
            type="text"
            aria-label={label}
            value={text}
            onChange={(e) => setText(e.target.value)}
            inputMode={inputMode}
            style={fitStyle}
            className={className}
        />
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
    return (
        <span className={`relative block shrink-0 ${wrapperClassName}`}>
            <span aria-hidden className={`block opacity-0 ${textClassName}`}>
                {sizer}
            </span>
            <output
                aria-label={label}
                className={`absolute inset-0 flex h-full w-full items-center justify-center whitespace-nowrap text-center ${valueClassName ?? textClassName}`}
            >
                {value}
            </output>
        </span>
    );
}

/** A proficiency ring, toggled by clicking it. */
function ProfRing({ label, src = asset("prof-ring") }: { label: string; src?: string }) {
    const [marked, setMarked] = useState(false);
    return (
        <button
            type="button"
            aria-label={`${label} proficiency`}
            aria-pressed={marked}
            onClick={() => setMarked((v) => !v)}
            className="relative size-[20.73px] shrink-0"
        >
            <div className="absolute" style={{ inset: "-4.99%" }}>
                <img alt="" src={src} className="block size-full max-w-none" />
            </div>
            {marked && <span className="absolute inset-[26%] rounded-full bg-black" />}
        </button>
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

/**
 * Class and Subclass accept a list so a multiclassed character fits on one
 * line, e.g. "Fighter / Wizard". Entries are separated by a slash.
 */
const LIST_SEPARATOR = "/";

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
function SuggestInput({
    label,
    options,
    className,
    value,
    onValueChange,
    multiple = false,
}: {
    label: string;
    options: string[];
    className: string;
    /** Provide both to lift state (Class drives the Subclass list). */
    value?: string;
    onValueChange?: (value: string) => void;
    /** Accept several entries, separated by a slash — used for multiclassing. */
    multiple?: boolean;
}) {
    const [internal, setInternal] = useState("");
    const current = value ?? internal;
    const setCurrent = (next: string) => {
        setInternal(next);
        onValueChange?.(next);
    };

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);

    // In multiple mode only the entry after the last slash is being edited;
    // the ones before it are already committed.
    const committed = multiple ? splitList(current).slice(0, -1) : [];
    const pending = multiple
        ? (current.split(LIST_SEPARATOR).pop() ?? "").trim()
        : current.trim();

    const matches = useMemo(() => {
        const taken = new Set(committed.map((entry) => entry.toLowerCase()));
        const pool = options.filter((option) => !taken.has(option.toLowerCase()));
        const query = pending.toLowerCase();
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
    }, [options, pending, current, multiple]);

    const visible = open && matches.length > 0;

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
        <span className="relative min-w-[1px] flex-[1_0_0]">
            <input
                type="text"
                role="combobox"
                aria-label={label}
                aria-expanded={visible}
                aria-autocomplete="list"
                autoComplete="off"
                value={current}
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
                    className="absolute left-0 top-full z-50 mt-[10px] w-full min-w-[420px] overflow-hidden rounded-[18px] border-[3px] border-solid border-black bg-white py-[8px] shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
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
        </span>
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
}: {
    icon: ReactNode;
    label: string;
    options: string[];
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
    savingThrowRing?: string;
    skills: SkillDef[];
    headerAlign: string;
};

const SAVING_THROW_ICON = { src: asset("saving-throw"), w: 35.566, h: 28.827 };

/** Highest ability score the rules allow (magic items cap at 30). */
const MAX_ABILITY_SCORE = 30;

/** PHB: modifier = (score − 10) ÷ 2, rounded down. */
function abilityModifier(score: number) {
    return Math.floor((score - 10) / 2);
}

/** Modifiers are always written with their sign, "+0" included. */
function formatModifier(modifier: number) {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * The score box is the only blank here: the circle shows the modifier the rules
 * derive from it, so it is read-only.
 */
function AbilityScoreGrid({ ability }: { ability: string }) {
    const [score, setScore] = useState("");
    const parsed = Number.parseInt(score, 10);
    const modifier = Number.isNaN(parsed) ? "" : formatModifier(abilityModifier(parsed));

    return (
        <div className="relative inline-grid shrink-0 grid-cols-[max-content] grid-rows-[max-content] place-items-start leading-[0]">
            {/* Score box, tucked behind the modifier circle. Sized by the widest
                pair of digits, not Figma's "14", so "20" cannot be shaved. */}
            <div className="relative col-start-1 row-start-1 ml-[98.13px] mt-[28.95px] flex items-center justify-center rounded-[8.273px] border-2 border-solid border-black py-[16.545px] pl-[41.363px] pr-[16.545px]">
                <Blank
                    label={`${ability} score`}
                    sizer="00"
                    value={score}
                    onChange={(next) => {
                        const digits = next.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
                        if (digits === "" || Number(digits) <= MAX_ABILITY_SCORE) setScore(digits);
                    }}
                    inputMode="numeric"
                    maxLength={2}
                    textClassName="whitespace-nowrap text-[33.09px] font-normal not-italic leading-[normal] text-black"
                    valueClassName="whitespace-nowrap text-[29px] font-normal not-italic leading-[normal] tabular-nums text-black"
                />
            </div>
            {/* Modifier circle. Only "+10" reaches three characters; it steps
                down a size rather than crowding the ring. */}
            <div className="relative col-start-1 row-start-1 ml-0 mt-0 flex size-[124.088px] flex-col items-center justify-center rounded-[198.54px] border-2 border-solid border-black bg-white px-[15.42px] py-[12.336px]">
                <DerivedValue
                    label={`${ability} modifier`}
                    sizer="+2"
                    value={modifier}
                    wrapperClassName="w-[72.175px]"
                    textClassName="text-[55.699px] font-medium not-italic leading-[normal] text-black"
                    valueClassName={`${modifier.length > 2 ? "text-[42px]" : "text-[50px]"} font-medium not-italic leading-[normal] tabular-nums text-black`}
                />
            </div>
        </div>
    );
}

function SkillRow({ skill }: { skill: SkillDef }) {
    return (
        <div className="relative flex h-[53.771px] w-full shrink-0 items-center gap-[12.409px] rounded-[22.544px] bg-white px-[20.681px] py-[22.544px]">
            <ProfRing label={skill.label} />
            <Icon src={skill.icon} w={skill.w} h={skill.h} />
            <p className="relative shrink-0 whitespace-nowrap text-[20.681px] font-normal not-italic leading-[normal] text-black">
                {skill.label}
            </p>
        </div>
    );
}

function AbilityCard({ ability }: { ability: AbilityDef }) {
    const { abbr, rest, skills } = ability;
    const name = `${abbr}${rest}`.toUpperCase();
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
                    <AbilityScoreGrid ability={name} />
                </div>

                <div
                    className={`relative flex w-full shrink-0 flex-col items-start ${skills.length ? "gap-[8.273px]" : ""}`}
                >
                    {/* Saving throw */}
                    <div className="relative flex h-[53.771px] w-full shrink-0 items-center gap-[12.409px] rounded-[22.544px] bg-white px-[20.681px] py-[22.544px]">
                        <ProfRing
                            label={`${name} saving throw`}
                            src={ability.savingThrowRing ?? asset("prof-ring")}
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
                                <SkillRow key={skill.label} skill={skill} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/** Proficiency Bonus / Inspiration — a blank box with a label beside it. */
function CounterCard({ label }: { label: ReactNode }) {
    return (
        <div className="relative flex w-full shrink-0 flex-wrap content-start items-start gap-y-[3.5px] rounded-[22.749px] border-[4.136px] border-solid border-[#ffb800] p-[10.794px]">
            <div className="relative flex w-full items-center gap-[24.672px] overflow-clip rounded-[16.545px] bg-[#f8f8f8] p-[12.409px]">
                <div className="relative flex shrink-0 flex-col items-center rounded-[9.252px] border-2 border-solid border-black bg-white px-[15.42px] py-[12.336px]">
                    <Blank
                        label={typeof label === "string" ? label : "Proficiency Bonus"}
                        sizer="+2"
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
        savingThrowRing: asset("prof-ring-alt"),
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
            { label: "Persusasion", icon: asset("skill-persuasion"), w: 28.744, h: 28.744 },
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
}: {
    icon: ReactNode;
    label: string;
    options: string[];
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
                className="text-[29.933px] font-normal not-italic leading-[normal] text-black"
            />
        </div>
    );
}

/** Weapons / Tools — a labelled block with room to write. */
function EquipmentBlock({
    icon,
    label,
    height,
}: {
    icon: ReactNode;
    label: string;
    height: number;
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
            <textarea
                aria-label={label}
                className="relative min-h-[1px] w-full flex-[1_0_0] text-[29.933px] font-normal not-italic leading-[normal] text-black"
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

function ActionRow({ index }: { index: number }) {
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

export function CharacterSheetA4() {
    const suggestions = useSheetSuggestions();
    const [characterClass, setCharacterClass] = useState("");

    // Narrow the 217 subclasses to the entered classes. A multiclassed
    // character draws from every class they have taken.
    const subclassOptions = useMemo(() => {
        const entered = new Set(splitList(characterClass).map((name) => name.toLowerCase()));
        const slugs = suggestions.classes
            .filter((c) => entered.has(c.name.toLowerCase()))
            .map((c) => c.id);
        const pool = slugs.length
            ? suggestions.subclasses.filter(
                  (s) => s.parentClassId && slugs.includes(s.parentClassId),
              )
            : suggestions.subclasses;
        return (pool.length ? pool : suggestions.subclasses).map((s) => s.name);
    }, [suggestions.classes, suggestions.subclasses, characterClass]);

    const classOptions = useMemo(
        () => suggestions.classes.map((c) => c.name),
        [suggestions.classes],
    );

    return (
        <div
            className="cs-root relative bg-white"
            style={{ width: `${SHEET_WIDTH}px`, height: `${SHEET_HEIGHT}px` }}
        >
            <div className="absolute left-1/2 top-1/2 h-[3156.687px] w-[2220.373px] -translate-x-1/2 -translate-y-1/2">
                {/* Title */}
                <div className="absolute left-0 top-0 flex items-center gap-[18.569px] whitespace-nowrap not-italic text-black">
                    <div className="flex shrink-0 items-center justify-center">
                        <DiceD20 className="size-[55.707px]" />
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
                                        className="relative min-h-[1px] w-full flex-[1_0_0] text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                    />
                                </div>
                            </div>
                            <div className="relative flex w-[1156.001px] shrink-0 items-center gap-[25.814px] rounded-[25.814px] border-[3.227px] border-solid border-black p-[25.814px]">
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
                        </div>
                        <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start justify-between">
                            <HeaderFieldSm
                                label="Species"
                                options={suggestions.species}
                                icon={<Icon src={asset("species")} w={27.804} h={37.071} />}
                            />
                            <HeaderFieldSm
                                label="Background"
                                options={suggestions.backgrounds}
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
                                        label={
                                            <>
                                                Proficiency
                                                <br aria-hidden />
                                                Bonus
                                            </>
                                        }
                                    />
                                    {ABILITIES_LEFT.map((ability) => (
                                        <AbilityCard key={ability.abbr} ability={ability} />
                                    ))}
                                </div>
                                <div className="relative flex w-[403.082px] shrink-0 flex-col items-start gap-[20.681px]">
                                    <CounterCard label="Inspiration" />
                                    {ABILITIES_RIGHT.map((ability) => (
                                        <AbilityCard key={ability.abbr} ability={ability} />
                                    ))}
                                </div>
                            </div>

                            {/* Equipment Training & Proficiencies */}
                            <div className="relative flex w-full shrink-0 items-start rounded-[22.749px] border-[4.136px] border-solid border-[#005f1a] p-[9.02px]">
                                <div className="relative flex w-full flex-col items-start justify-center overflow-clip rounded-[11.067px] bg-[#f8f8f8] p-[13.834px]">
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
                                            icon={<Icon src={asset("armor-type")} w={35.783} h={36} />}
                                        />
                                        <EquipmentField
                                            label="Shield"
                                            options={suggestions.armor}
                                            icon={<Icon src={asset("shield")} w={33.762} h={36} />}
                                        />
                                        <EquipmentBlock
                                            label="Weapons"
                                            height={236.473}
                                            icon={<Icon src={asset("weapons")} w={36.484} h={48.646} />}
                                        />
                                        <EquipmentBlock
                                            label="Tools"
                                            height={268}
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
                                                <div className="relative flex h-[148.974px] w-full shrink-0 flex-col items-center justify-end rounded-[17.833px] border-[2.452px] border-solid border-black bg-[#f8f8f8] px-[41.472px] py-[16.553px]">
                                                    <input
                                                        type="text"
                                                        aria-label="Hit die"
                                                        className="relative min-h-[1px] w-full flex-[1_0_0] text-center text-[61.978px] font-medium not-italic leading-[normal] text-black"
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
                                                    <input
                                                        type="text"
                                                        aria-label="Current hit points"
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
                                                    <input
                                                        type="text"
                                                        aria-label="Temporary hit points"
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
                                                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-center justify-end rounded-[18.395px] border-[2.516px] border-solid border-black bg-[#f8f8f8] p-[42.555px]">
                                                    <input
                                                        type="text"
                                                        aria-label="Maximum hit points"
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
                                            icon: <Icon src={asset("speed")} w={29.76} h={29.745} />,
                                            gap: "gap-[6.078px] px-[6.078px]",
                                            text: "text-[25.149px]",
                                        },
                                        {
                                            label: "Armor class",
                                            icon: (
                                                <Icon src={asset("armor-class")} w={27.778} h={29.619} />
                                            ),
                                            gap: "gap-[5.989px] px-[5.989px]",
                                            text: "text-[24.782px]",
                                        },
                                        {
                                            label: "Initiative",
                                            icon: (
                                                <Icon src={asset("initiative")} w={24.87} h={21.761} />
                                            ),
                                            gap: "gap-[6.078px] px-[6.078px]",
                                            text: "text-[25.149px]",
                                        },
                                    ].map((stat) => (
                                        <div
                                            key={stat.label}
                                            className="relative flex w-full items-center gap-[23.409px] overflow-clip rounded-[15.698px] bg-[#f8f8f8] p-[11.773px]"
                                        >
                                            <div className="relative flex shrink-0 flex-col items-center rounded-[8.778px] border-[1.898px] border-solid border-black bg-white px-[14.63px] py-[11.704px]">
                                                <Blank
                                                    label={stat.label}
                                                    sizer="+2"
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
                                                <div className="relative flex h-[165.527px] w-[33.657px] shrink-0 items-center justify-center">
                                                    <div className="flex-none -rotate-90">
                                                        <Icon
                                                            src={asset("death-save-success-track")}
                                                            w={165.527}
                                                            h={33.657}
                                                        />
                                                    </div>
                                                </div>
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
                                                <div className="relative flex h-[167.389px] w-[35.226px] shrink-0 items-center justify-center">
                                                    <div className="flex-none -rotate-90">
                                                        <Icon
                                                            src={asset("death-save-failure-track")}
                                                            w={167.389}
                                                            h={35.226}
                                                        />
                                                    </div>
                                                </div>
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
                                            <div className="relative flex h-[91px] w-[549px] shrink-0 items-center gap-[23.68px] overflow-clip rounded-[17px] border-[3.227px] border-solid border-black px-[23.68px]">
                                                <p className="relative shrink-0 whitespace-nowrap text-[32.268px] font-medium not-italic leading-[normal] text-black">
                                                    Skill Save DC
                                                </p>
                                                <input
                                                    type="text"
                                                    aria-label="Skill Save DC"
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
                                                <ActionRow key={index} index={index} />
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
                                                className="absolute bottom-[23.768px] left-[47.535px] top-[23.768px] w-[calc(50%_-_59.419px)] text-[29.71px] font-medium not-italic leading-[normal] text-black"
                                            />
                                            <textarea
                                                aria-label="Subclass features"
                                                className="absolute bottom-[220px] right-[47.535px] top-[23.768px] w-[calc(50%_-_59.419px)] text-[29.71px] font-medium not-italic leading-[normal] text-black"
                                            />

                                            <div className="absolute left-[1016.4px] top-[995.7px] h-[189px] w-[261px] overflow-clip rounded-[17px] border-[3.227px] border-solid border-black">
                                                <input
                                                    type="text"
                                                    aria-label="Points"
                                                    className="absolute left-[28.79px] top-0 h-[123.81px] w-[197px] text-right text-[32.268px] font-medium not-italic leading-[normal] text-black"
                                                />
                                                <p className="absolute left-[28.79px] top-[123.81px] h-[39px] w-[197px] text-right text-[32.268px] font-medium not-italic leading-[normal] text-black">
                                                    Points
                                                </p>
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
}
