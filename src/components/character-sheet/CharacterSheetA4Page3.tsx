import {
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
    type RefObject,
} from "react";
import {
    useSheetSpells,
    useSheetSuggestions,
    type SheetSpell,
} from "../../hooks/useSheetSuggestions";
import type { Spell } from "../../types/dnd-types";
import {
    EMPTY_SPELLCASTING,
    SHEET_HEIGHT,
    SHEET_WIDTH,
    SuggestInput,
    type SpellcastingSummary,
} from "./CharacterSheetA4";
import { PreparedMarker, SpellMarker } from "./markers";
import { useEditableAutoValue } from "./use-editable-auto-value";
import { useMenuPlacement } from "./useMenuPlacement";
import "./character-sheet.css";

/**
 * Minimal Character Sheet for D&D — A4 page 3, implemented 1:1 from Figma
 * (Simhan – Workspace, node 1780:2049). Same native design size as pages 1-2
 * (2480 x 3508) so the host scales every page identically and the PDF can
 * append this as its third page.
 *
 * Page 4 (node 1780:3791) is the same spellbook layout with different blocks,
 * so the shell, header row and spell block live here and are exported for it.
 *
 * As on the earlier pages, every blank is a text field and every label is a
 * permanent element rather than a placeholder.
 */

/** Icons exported from the Figma nodes; shared by pages 3 and 4. */
export const spellAsset = (name: string) => `/character-sheet/spells/${name}.svg`;

/** Spell blocks are outlined red; the header tiles and prose panels blue. */
const RED = "#d40000";
/** A spell level the character has no slots for keeps the outline, greyed. */
const INACTIVE = "#c2c2c2";
export const SPELL_BLUE = "#0090ff";

/** Block heights straight from Figma: the top block in a column is taller. */
export const SPELL_BLOCK_TOP = 971.98;
export const SPELL_BLOCK = 967.46;
/** 971.98 + 20.8 + 967.46 + 20.8 + 967.46 — the height of both columns. */
export const SPELL_BODY_HEIGHT = 2948.5;

/** Time / Range / Type all share one column width; Components is wider. */
const CELL = 93.61;
const COMPONENTS_CELL = 146.225;
/** Gap between every cell and its divider. Dividers are zero-width. */
const CELL_GAP = 14.281;

const SPELL_ROWS = 10;

/** Shared, so a block with nothing written in it holds no set of its own. */
const EMPTY_ROWS: ReadonlySet<number> = new Set();

/* ------------------------------------------------------------------ */
/* The Archive's spells                                                */
/* ------------------------------------------------------------------ */

/**
 * School colours, each with the abbreviation the row tag carries.
 *
 * The letters do the work where the colour cannot — a printed sheet, or a
 * reader who cannot tell two hues apart — so the tag is never colour alone.
 */
const SCHOOLS: Record<string, { color: string; short: string }> = {
    abjuration: { color: "#2563eb", short: "Abj" },
    conjuration: { color: "#ca8a04", short: "Con" },
    divination: { color: "#0891b2", short: "Div" },
    enchantment: { color: "#db2777", short: "Enc" },
    evocation: { color: "#dc2626", short: "Evo" },
    illusion: { color: "#7c3aed", short: "Ill" },
    necromancy: { color: "#16a34a", short: "Nec" },
    transmutation: { color: "#ea580c", short: "Tra" },
};

const UNKNOWN_SCHOOL = "#4b5563";

/** A spell's school, as a small colour-coded tag. */
function SchoolTag({
    school,
    full = false,
    className = "",
}: {
    school?: string;
    /** Spell out the school. The menu has the room for it; a row has not. */
    full?: boolean;
    className?: string;
}) {
    if (!school) return null;
    const known = SCHOOLS[school.trim().toLowerCase()];
    const color = known?.color ?? UNKNOWN_SCHOOL;
    return (
        <span
            data-cs="spell-school"
            title={school}
            className={`relative shrink-0 whitespace-nowrap rounded-full border-2 border-solid px-[10px] py-[1px] font-semibold leading-[1.35] ${className}`}
            style={{ borderColor: color, color, backgroundColor: `${color}1f` }}
        >
            {full ? school : (known?.short ?? school.slice(0, 3))}
        </span>
    );
}

/**
 * Time and Range are two of the narrowest cells on the sheet, and the Archive
 * writes them out in full ("1 bonus action", "1 reaction, which you take
 * when…"). These cut each to the part that identifies it; the hover card over
 * the row still carries the whole thing.
 */
function shortCastingTime(value?: string): string {
    const text = value?.trim().toLowerCase();
    if (!text) return "";
    if (text.startsWith("instant")) return "Instant";
    if (text.includes("bonus action")) return "Bonus";
    if (text.includes("reaction")) return "Reaction";
    if (text.includes("action")) return "Action";
    const period = text.match(/^(\d+)\s*(round|minute|hour|day)/);
    if (period) {
        const [, count, unit] = period;
        const short = { round: "rnd", minute: "min", hour: "hr", day: "day" }[unit] ?? unit;
        return `${count} ${short}`;
    }
    return value!.trim();
}

/**
 * A handful of the Archive's spells have the opening of their description run
 * into the duration ("1 minute This spell causes your anatomy to become…"),
 * from an earlier import. The card reads the duration up to the unit it ends
 * on, so the stray sentence does not run through the details line; the
 * description below still carries it.
 */
function shortDuration(value?: string): string {
    const text = value?.trim();
    if (!text) return "";
    const unit = text.match(
        /^.*?\b(rounds?|minutes?|hours?|days?|instantaneous|dispelled|special)\b\)?/i,
    );
    return unit ? unit[0] : text;
}

function shortRange(value?: string): string {
    const text = value?.trim();
    if (!text) return "";
    if (text.toLowerCase().startsWith("instant")) return "Instant";
    // "Self (15-foot cone)" — the shape matters more here than its size does.
    const self = text.match(/^self\s*\((.*)\)$/i);
    if (self) {
        const shape = self[1].match(/cone|cube|line|radius|sphere|square/i);
        return shape ? `Self ${shape[0].toLowerCase()}` : "Self";
    }
    return text.replace(/\s*(?:feet|foot|ft\b\.?)/i, " ft").replace(/\s*miles?\b/i, " mi");
}

/**
 * The Archive's spells, arranged for the blanks: the names each block offers,
 * and every spell by name so a chosen one can fill its row in.
 */
interface SpellIndex {
    namesByLevel: Map<number, string[]>;
    byName: Map<string, SheetSpell>;
}

const EMPTY_INDEX: SpellIndex = { namesByLevel: new Map(), byName: new Map() };
const NO_NAMES: string[] = [];

/**
 * Read once per page and handed down, rather than fetched per block: sixty
 * blanks share the one library.
 */
const SpellIndexContext = createContext<SpellIndex>(EMPTY_INDEX);

function useSpellIndex(): SpellIndex {
    const spells = useSheetSpells();
    return useMemo(() => {
        const namesByLevel = new Map<number, string[]>();
        const byName = new Map<string, SheetSpell>();
        for (const spell of spells) {
            const names = namesByLevel.get(spell.level);
            if (names) names.push(spell.name);
            else namesByLevel.set(spell.level, [spell.name]);
            byName.set(spell.name.toLowerCase(), spell);
        }
        return { namesByLevel, byName };
    }, [spells]);
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

/** An exported icon, drawn at its designed outer box and leaf size. */
export function Icon({
    src,
    w,
    h,
    inset,
    className = "",
}: {
    src: string;
    w: number;
    h: number;
    /** Figma stroke overflow, e.g. "-4.99%". */
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

/* ------------------------------------------------------------------ */
/* Header row                                                          */
/* ------------------------------------------------------------------ */

/**
 * Spell Casting Class / Spell Casting Ability — icon, label, wide blank.
 *
 * The blank is filled in from pages 1 and 2 and stays editable, as every
 * derived field on the sheet does. Given options it also suggests entries from
 * the Archive, but only once something is typed: the sheet has usually written
 * the answer already, so an unbidden list of every class would only be noise.
 */
function LabelledTile({
    width,
    label,
    fieldClassName,
    autoValue = "",
    options,
}: {
    width: number;
    label: string;
    fieldClassName: string;
    autoValue?: string;
    options?: string[];
}) {
    const [value, setValue] = useEditableAutoValue(autoValue);
    const fieldClass = `font-medium not-italic leading-[normal] text-black ${fieldClassName}`;

    return (
        <div
            className="relative flex h-full shrink-0 items-start rounded-[22.914px] border-[4.14px] border-solid p-[10.873px]"
            style={{ borderColor: SPELL_BLUE, width: `${width}px` }}
        >
            {/* Unclipped: the suggestion menu opens past the tile, as page 2's
                magic item rows do. */}
            <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start justify-center gap-[20.831px] rounded-[16.665px] bg-[#f8f8f8] p-[12.499px]">
                <div className="relative flex shrink-0 items-center gap-[16.665px]">
                    <Icon src={spellAsset("spell-casting")} w={39.526} h={39.526} />
                    <p className="relative shrink-0 whitespace-nowrap text-[31.064px] font-normal not-italic leading-[normal] text-black">
                        {label}
                    </p>
                </div>
                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-center rounded-[9.319px] border-2 border-solid border-black bg-white px-[15.532px] py-[12.426px]">
                    {options ? (
                        <SuggestInput
                            label={label}
                            options={options}
                            value={value}
                            onValueChange={setValue}
                            multiple
                            suggestWhenTyped
                            wrapperClassName="relative block h-full w-full"
                            className={`h-full ${fieldClass}`}
                        />
                    ) : (
                        <input
                            type="text"
                            aria-label={label}
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            className={`relative h-full w-full ${fieldClass}`}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/** Spell Save DC / Spell Attack Bonus — a square blank beside its label. */
function NumericTile({
    label,
    autoValue = "",
    exportField,
    abilities,
}: {
    label: string;
    autoValue?: string;
    /** Names the tile for the HTML download, which keeps deriving it. */
    exportField?: string;
    /** The casting abilities behind it, "INT / WIS", appended as page 1 writes them. */
    abilities?: string;
}) {
    const [value, setValue] = useEditableAutoValue(autoValue);
    return (
        <div
            data-cs={exportField}
            data-cs-abilities={abilities}
            data-cs-auto={exportField === undefined ? undefined : autoValue}
            className="relative flex h-full min-w-[1px] flex-[1_0_0] items-start rounded-[24.156px] border-[4.14px] border-solid p-[11.462px]"
            style={{ borderColor: SPELL_BLUE }}
        >
            <div className="relative flex h-full min-w-[1px] flex-[1_0_0] items-center gap-[26.198px] overflow-clip rounded-[17.568px] bg-[#f8f8f8] p-[13.176px]">
                <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-center rounded-[9.824px] border-2 border-solid border-black bg-white px-[16.374px] py-[13.099px]">
                    <input
                        type="text"
                        aria-label={label}
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        className="relative h-full w-full text-center text-[76.411px] font-medium not-italic leading-[normal] text-black"
                    />
                </div>
                <p className="relative w-[210.05px] shrink-0 text-[32.748px] font-normal not-italic leading-[normal] text-black">
                    {label}
                </p>
            </div>
        </div>
    );
}

/**
 * The four blue tiles that top both spellbook pages, filled in from what pages
 * 1 and 2 hold: every source of the character's magic, appended, and the
 * ability and numbers those sources set.
 */
function SpellHeaderRow({ spellcasting }: { spellcasting: SpellcastingSummary }) {
    const suggestions = useSheetSuggestions();
    // Anything that can grant spellcasting is a valid source to add by hand.
    const sourceOptions = useMemo(
        () =>
            [
                ...suggestions.classes,
                ...suggestions.subclasses,
                ...suggestions.species,
                ...suggestions.feats,
            ].map((item) => item.name),
        [suggestions],
    );

    return (
        <div className="relative flex h-[217px] w-full shrink-0 items-start justify-center gap-[20.831px]">
            <LabelledTile
                width={821}
                label="Spell Casting Class,Sub-class, Race, Feat"
                fieldClassName="text-[44px]"
                autoValue={spellcasting.sources}
                options={sourceOptions}
            />
            <LabelledTile
                width={493}
                label="Spell Casting Ability"
                fieldClassName="text-[56px]"
                autoValue={spellcasting.ability}
            />
            <NumericTile
                label="Spell Save DC"
                autoValue={spellcasting.saveDc}
                exportField="spell-save-dc"
                abilities={spellcasting.ability}
            />
            <NumericTile
                label="Spell Attack Bonus"
                autoValue={spellcasting.attackBonus}
                exportField="spell-attack-bonus"
                abilities={spellcasting.ability}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Spell block                                                         */
/* ------------------------------------------------------------------ */

/** The hairline between two cells. Zero-width, so the gaps sit either side. */
function CellDivider() {
    return (
        <div className="relative flex h-[42.393px] w-0 shrink-0 items-center justify-center">
            <div className="flex-none rotate-90">
                <div className="relative h-0 w-[42.393px]">
                    <div className="absolute" style={{ inset: "-1.35px 0 0 0" }}>
                        <img
                            alt=""
                            src={spellAsset("row-divider")}
                            className="block size-full max-w-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function TypeMarkers({ spell }: { spell?: SheetSpell }) {
    return (
        <div className="relative flex shrink-0 items-center gap-[14.479px]">
            <SpellMarker name="c" automatic={Boolean(spell?.concentration)} />
            <SpellMarker name="r" automatic={Boolean(spell?.ritual)} />
        </div>
    );
}

function ComponentMarkers({ spell }: { spell?: SheetSpell }) {
    return (
        <div className="relative flex shrink-0 items-center gap-[14.479px]">
            <SpellMarker name="v" automatic={Boolean(spell?.components?.verbal)} />
            <SpellMarker name="s" automatic={Boolean(spell?.components?.somatic)} />
            <SpellMarker name="m" automatic={Boolean(spell?.components?.material)} />
        </div>
    );
}

/** The icon-and-title group shared by every block header. */
function BlockTitle({ title }: { title: string }) {
    return (
        <div className="relative h-[40.255px] w-[181.693px] shrink-0">
            <img
                alt=""
                src={spellAsset("spell-level")}
                className="absolute left-0 top-0 block h-[40.255px] w-[46.006px] max-w-none"
            />
            <p className="absolute left-[63.63px] top-[3.39px] h-[33.481px] w-[118.065px] text-[28.136px] font-semibold not-italic leading-[normal] text-black">
                {title}
            </p>
        </div>
    );
}

/** One of the two slot counters in a level header. */
function SlotBox({
    label,
    width,
    autoValue = "",
    exportLevel,
}: {
    label: string;
    width: number;
    autoValue?: string;
    /** Set on the total, which the HTML download re-derives as Level is edited. */
    exportLevel?: number;
}) {
    const [value, setValue] = useEditableAutoValue(autoValue);
    return (
        <div
            data-cs={exportLevel === undefined ? undefined : "slot-total"}
            data-cs-level={exportLevel}
            data-cs-auto={exportLevel === undefined ? undefined : autoValue}
            className="relative flex h-[64.13px] shrink-0 flex-col items-center rounded-[5.3px] border-2 border-solid border-black bg-white px-[8.834px] py-[7.067px]"
            style={{ width: `${width}px` }}
        >
            <input
                type="text"
                aria-label={label}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="relative h-full w-full text-center text-[41.224px] font-medium not-italic leading-[normal] text-black"
            />
        </div>
    );
}

/**
 * Level headers carry "__ of __" slot counters; the cantrip header does not.
 * The total is filled in from the class levels page 1 holds, leaving the player
 * only the expended count to keep — the one number no sheet can derive.
 */
function BlockHeader({
    title,
    level,
    slots,
    total,
}: {
    title: string;
    level: number;
    slots: boolean;
    total: string;
}) {
    if (!slots) {
        return (
            <div className="relative flex h-[58.419px] w-full shrink-0 items-center justify-center rounded-[29.993px] border border-solid border-black bg-[#f8f8f8] px-[18.13px]">
                <div className="relative flex shrink-0 items-center justify-center px-[16.116px]">
                    <BlockTitle title={title} />
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-[83.6px] w-full shrink-0 items-center justify-center rounded-[16px] border-2 border-solid border-black bg-[#f8f8f8] px-[18.13px]">
            <div className="relative flex h-full w-full items-center justify-between px-[16.116px]">
                <BlockTitle title={title} />
                <div className="relative flex h-full shrink-0 items-center gap-[18.529px] overflow-clip rounded-[12.425px] py-[9.319px] pl-[9.319px] pr-[15.532px]">
                    <SlotBox label={`${title} slots expended`} width={118.838} />
                    <p className="relative shrink-0 whitespace-nowrap text-[40.504px] font-normal not-italic leading-[normal] text-black">
                        of
                    </p>
                    <SlotBox
                        label={`${title} slots total`}
                        width={113.817}
                        autoValue={total}
                        exportLevel={level}
                    />
                </div>
            </div>
        </div>
    );
}

const LABEL_CLASS =
    "relative shrink-0 whitespace-nowrap text-center text-[24.174px] font-medium not-italic leading-[normal] text-black";

/** The Name / Time / Range / Type / Components strip above the blanks. */
function ColumnLabels({ height }: { height: number }) {
    return (
        <div
            className="relative flex w-full shrink-0 items-center rounded-[25.946px] bg-white px-[23.802px]"
            style={{ height: `${height}px`, gap: `${CELL_GAP}px` }}
        >
            <p className="relative min-w-[1px] flex-[1_0_0] pl-[39.961px] text-[24.174px] font-medium not-italic leading-[normal] text-black">
                Name
            </p>
            <CellDivider />
            <p className={LABEL_CLASS} style={{ width: `${CELL}px` }}>
                Time
            </p>
            <CellDivider />
            <p className={LABEL_CLASS} style={{ width: `${CELL}px` }}>
                Range
            </p>
            <CellDivider />
            <p className={LABEL_CLASS} style={{ width: `${CELL}px` }}>
                Type
            </p>
            <CellDivider />
            <p className={LABEL_CLASS} style={{ width: `${COMPONENTS_CELL}px` }}>
                Components
            </p>
        </div>
    );
}

/**
 * Time and Range are not blanks: the Archive fills them in from the spell in
 * the row's name, and nothing else belongs in them. `leading` centres the one
 * line in the box the blanks used to occupy.
 */
const CELL_TEXT =
    "relative h-[40.041px] shrink-0 overflow-hidden whitespace-nowrap text-center text-[24px] font-medium not-italic leading-[40.041px] text-black";

/** How tall the hover card would like to be, in design px. */
const DETAILS_HEIGHT = 620;

/** As much of a description as the card can hold before it is cut. */
const DETAILS_CHARS = 700;

/**
 * A spell's own entry, shown while the pointer rests on a filled row: what the
 * two abbreviated cells had to cut, and the spell's text.
 *
 * It is drawn inside the sheet's coordinate space, as the suggestion menus
 * are, so it scales with the page — and it never takes the pointer, so moving
 * onto it cannot make it flicker away.
 *
 * Exported for the HTML download, which renders one of these per spell the
 * sheet has written down and hangs it off the row rather than rebuilding the
 * card by hand.
 */
export function SpellDetails({
    spell,
    anchorRef,
    open,
}: {
    spell: SheetSpell;
    anchorRef: RefObject<HTMLDivElement | null>;
    open: boolean;
}) {
    const placement = useMenuPlacement(anchorRef, open, DETAILS_HEIGHT);
    if (!open) return null;

    const components = [
        spell.components?.verbal && "V",
        spell.components?.somatic && "S",
        spell.components?.material && "M",
    ]
        .filter(Boolean)
        .join(", ");

    const details = [
        spell.level === 0 ? "Cantrip" : `Level ${spell.level}`,
        spell.castingTime && `Casting Time: ${spell.castingTime}`,
        spell.range && `Range: ${spell.range}`,
        spell.duration && `Duration: ${shortDuration(spell.duration)}`,
        components && `Components: ${components}`,
        spell.concentration && "Concentration",
        spell.ritual && "Ritual",
    ].filter(Boolean) as string[];

    const description =
        spell.description && spell.description.length > DETAILS_CHARS
            ? `${spell.description.slice(0, DETAILS_CHARS).trimEnd()}…`
            : spell.description;

    return (
        <div
            role="tooltip"
            className={`pointer-events-none absolute left-0 z-40 w-[760px] overflow-hidden rounded-[18px] border-[3px] border-solid border-black bg-white p-[24px] shadow-[0_18px_48px_rgba(0,0,0,0.28)] ${
                placement.side === "above" ? "bottom-full mb-[10px]" : "top-full mt-[10px]"
            }`}
            style={{ maxHeight: `${placement.maxHeight}px` }}
        >
            <div className="flex items-center gap-[14px]">
                <p className="min-w-[1px] flex-[1_0_0] truncate text-[32px] font-semibold leading-[1.2] text-black">
                    {spell.name}
                </p>
                <SchoolTag school={spell.school} full className="text-[20px]" />
            </div>
            <p className="mt-[8px] text-[22px] font-medium leading-[1.4] text-black/60">
                {details.join(" · ")}
            </p>
            {description && (
                <p className="mt-[12px] whitespace-pre-wrap text-[23px] font-normal leading-[1.4] text-black">
                    {description}
                </p>
            )}
        </div>
    );
}

/**
 * One spell: a prepared marker, the searchable name, and the cells the Archive
 * fills in from it.
 *
 * The row follows whatever name the blank holds rather than the spell it was
 * opened with — pick another, or type one out, and the time, range and markers
 * follow it. The two marker groups are keyed on that spell so a marker toggled
 * by hand belongs to the spell it was toggled for, and does not carry over.
 */
function SpellRow({
    title,
    index,
    prepared,
    spell,
    options,
    byName,
    renderOption,
    onFilledChange,
}: {
    title: string;
    index: number;
    prepared: boolean;
    spell?: Spell;
    /** The Archive's spells at this block's level. */
    options: string[];
    byName: Map<string, SheetSpell>;
    renderOption: (option: string) => ReactNode;
    /** Tells the block whether this row holds a spell; see `inactive` there. */
    onFilledChange: (row: number, filled: boolean) => void;
}) {
    const row = `${title}, row ${index + 1}`;
    const [name, setName] = useEditableAutoValue(spell?.name ?? "");
    const nameRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState(false);
    const [editing, setEditing] = useState(false);

    const filled = Boolean(name.trim());
    useEffect(() => onFilledChange(index, filled), [onFilledChange, index, filled]);

    const key = name.trim().toLowerCase();
    const resolved: SheetSpell | undefined =
        byName.get(key) ??
        (key && key === spell?.name.trim().toLowerCase() ? spell : undefined);

    return (
        <div
            data-cs="spell-row"
            className="relative flex min-h-[1px] w-full flex-[1_0_0] items-center rounded-[25.946px] bg-white px-[23.802px]"
            style={{ gap: `${CELL_GAP}px` }}
        >
            {prepared && (
                <PreparedMarker automatic={Boolean(spell)} row={row} />
            )}
            <div
                ref={nameRef}
                data-cs="spell-name"
                className="relative flex h-[40.041px] min-w-[1px] flex-[1_0_0] items-center gap-[12px]"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setEditing(true)}
                onBlur={() => setEditing(false)}
            >
                <SuggestInput
                    label={`Spell name, ${row}`}
                    options={options}
                    value={name}
                    onValueChange={setName}
                    renderOption={renderOption}
                    wrapperClassName="relative block h-full min-w-[1px] flex-[1_0_0]"
                    className="h-full text-[28px] font-medium not-italic leading-[normal] text-black"
                />
                <SchoolTag school={resolved?.school} className="text-[19px]" />
                {spell?.freeCastReset && (
                    <span
                        data-cs="free-cast"
                        title={`One free cast per ${spell.freeCastReset.toLowerCase()}${spell.canUseSpellSlots ? "; spell slots also allowed" : ""}`}
                        className="shrink-0 rounded-full border-2 border-[#6b21a8] bg-[#f3e8ff] px-[9px] py-[2px] text-[16px] font-bold leading-none text-[#6b21a8]"
                    >
                        1/LR{spell.canUseSpellSlots ? " + slots" : ""}
                    </span>
                )}
                {resolved && (
                    // Held back while the blank is being typed into, so the
                    // card never sits over its own suggestions.
                    <SpellDetails
                        spell={resolved}
                        anchorRef={nameRef}
                        open={hovered && !editing}
                    />
                )}
            </div>
            <CellDivider />
            <p
                data-cs="spell-time"
                className={CELL_TEXT}
                style={{ width: `${CELL}px` }}
                title={resolved?.castingTime}
            >
                {shortCastingTime(resolved?.castingTime)}
            </p>
            <CellDivider />
            <p
                data-cs="spell-range"
                className={CELL_TEXT}
                style={{ width: `${CELL}px` }}
                title={resolved?.range}
            >
                {shortRange(resolved?.range)}
            </p>
            <CellDivider />
            <TypeMarkers key={`type:${resolved?.name ?? ""}`} spell={resolved} />
            <CellDivider />
            <ComponentMarkers key={`components:${resolved?.name ?? ""}`} spell={resolved} />
        </div>
    );
}

/**
 * A red-outlined spell table. The ten spell rows are flex-grown so the block
 * always fills its declared height exactly, which is what keeps the two
 * columns tiling to the page — the same fix page 1's actions table needed.
 *
 * Memoised: the header row above it now re-renders as pages 1 and 2 are typed
 * into, and sixty spell rows have no reason to follow.
 */
export const SpellBlock = memo(function SpellBlock({
    title,
    level,
    height,
    slots = true,
    slotTotal,
    spells = [],
}: {
    title: string;
    /** Which of the Archive's spells this block's blanks offer. */
    level: number;
    height: number;
    /** Cantrips have no slot counters, and their rows have no prepared marker. */
    slots?: boolean;
    /**
     * The slots the character has at this level, from page 1. Undefined while
     * the classes behind them are unknown, which leaves the block as drawn;
     * zero greys it out, as a level they cannot yet cast at.
     */
    slotTotal?: number;
    /** Selected spells for this level, filled from the creator in row order. */
    spells?: Spell[];
}) {
    // A memoised component still follows the context it reads, so the blanks
    // come alive as soon as the Archive answers.
    const index = useContext(SpellIndexContext);
    const options = index.namesByLevel.get(level) ?? NO_NAMES;

    // The menu has room to spell the school out where a row has not.
    const renderOption = useMemo(
        () => (option: string) => (
            <span className="flex items-center gap-[18px]">
                <span className="min-w-[1px] flex-[1_0_0] truncate">{option}</span>
                <SchoolTag
                    school={index.byName.get(option.toLowerCase())?.school}
                    full
                    className="text-[20px]"
                />
            </span>
        ),
        [index],
    );

    // A level the character has no slots for is dimmed rather than disabled:
    // the sheet is writable throughout, and a block they will grow into should
    // still take a spell they are keeping an eye on. Writing one in brings the
    // block back — a species or feat grants its spells without a slot to spend,
    // and the level holding them is anything but inactive.
    const [filledRows, setFilledRows] = useState<ReadonlySet<number>>(EMPTY_ROWS);
    const noteFilled = useCallback((row: number, filled: boolean) => {
        setFilledRows((current) => {
            if (current.has(row) === filled) return current;
            const next = new Set(current);
            if (filled) next.add(row);
            else next.delete(row);
            return next;
        });
    }, []);
    const inactive = slotTotal === 0 && filledRows.size === 0;

    return (
        <div
            className="relative flex w-full shrink-0 items-start rounded-[19.87px] border-[4.14px] border-solid p-[12.645px]"
            style={{ borderColor: inactive ? INACTIVE : RED, height: `${height}px` }}
        >
            {/* Unclipped: the rows' suggestion menus and hover cards open past
                the block, as page 2's magic item rows do. */}
            <div
                className={`relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start justify-center rounded-[15.516px] bg-[#f8f8f8] p-[19.394px] ${
                    inactive ? "opacity-45" : ""
                }`}
            >
                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-start gap-[9.998px]">
                    <BlockHeader
                        title={title}
                        level={level}
                        slots={slots}
                        total={slotTotal ? `${slotTotal}` : ""}
                    />
                    <ColumnLabels height={slots ? 59.94 : 67.23} />
                    {Array.from({ length: SPELL_ROWS }, (_, row) => (
                        <SpellRow
                            key={row}
                            title={title}
                            index={row}
                            prepared={slots}
                            spell={spells[row]}
                            options={options}
                            byName={index.byName}
                            renderOption={renderOption}
                            onFilledChange={noteFilled}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

const NO_SPELLS: Spell[] = [];

/**
 * The character's spells, bucketed by level for the blocks that hold them.
 *
 * Kept stable across renders — the header row above these blocks re-renders as
 * pages 1 and 2 are typed into, and a fresh array per level on every one of
 * those renders would put all sixty spell rows through it too.
 */
export function useSpellsByLevel(spells: Spell[] | undefined) {
    return useMemo(() => {
        const byLevel = new Map<number, Spell[]>();
        for (const spell of spells ?? NO_SPELLS) {
            const bucket = byLevel.get(spell.level);
            if (bucket) bucket.push(spell);
            else byLevel.set(spell.level, [spell]);
        }
        return (level: number) => byLevel.get(level) ?? NO_SPELLS;
    }, [spells]);
}

/**
 * The slots a spellbook block heads its level with, or undefined where page 1
 * has not said — a sheet with no class on it greys nothing out.
 */
export function spellSlotsAt(spellcasting?: SpellcastingSummary) {
    return (level: number) => spellcasting?.slots?.[level];
}

/** One of the two block columns filling the page body. */
export function SpellColumn({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start gap-[20.8px]">
            {children}
        </div>
    );
}

/** The A4 canvas, header row and two-column body shared by pages 3 and 4. */
export function SpellPage({
    children,
    spellcasting = EMPTY_SPELLCASTING,
}: {
    children: ReactNode;
    spellcasting?: SpellcastingSummary;
}) {
    const spellIndex = useSpellIndex();
    return (
        <div
            className="cs-root relative flex justify-center bg-white px-[125.5px] pt-[160px]"
            style={{ width: `${SHEET_WIDTH}px`, height: `${SHEET_HEIGHT}px` }}
        >
            <div className="relative flex w-full shrink-0 flex-col items-start gap-[25px]">
                <SpellHeaderRow spellcasting={spellcasting} />
                <div
                    className="relative flex w-full shrink-0 items-start gap-[19.14px]"
                    style={{ height: `${SPELL_BODY_HEIGHT}px` }}
                >
                    <SpellIndexContext.Provider value={spellIndex}>
                        {children}
                    </SpellIndexContext.Provider>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sheet                                                               */
/* ------------------------------------------------------------------ */

export function CharacterSheetA4Page3({
    spellcasting,
    spells,
}: { spellcasting?: SpellcastingSummary; spells?: Spell[] } = {}) {
    const spellsAt = useSpellsByLevel(spells);
    const slotsAt = spellSlotsAt(spellcasting);
    return (
        <SpellPage spellcasting={spellcasting}>
            <SpellColumn>
                <SpellBlock
                    title="Cantrips"
                    level={0}
                    height={SPELL_BLOCK_TOP}
                    slots={false}
                    spells={spellsAt(0)}
                />
                <SpellBlock
                    title="Level 1"
                    level={1}
                    height={SPELL_BLOCK}
                    slotTotal={slotsAt(1)}
                    spells={spellsAt(1)}
                />
                <SpellBlock
                    title="Level 2"
                    level={2}
                    height={SPELL_BLOCK}
                    slotTotal={slotsAt(2)}
                    spells={spellsAt(2)}
                />
            </SpellColumn>
            <SpellColumn>
                <SpellBlock
                    title="Level 3"
                    level={3}
                    height={SPELL_BLOCK_TOP}
                    slotTotal={slotsAt(3)}
                    spells={spellsAt(3)}
                />
                <SpellBlock
                    title="Level 4"
                    level={4}
                    height={SPELL_BLOCK}
                    slotTotal={slotsAt(4)}
                    spells={spellsAt(4)}
                />
                <SpellBlock
                    title="Level 5"
                    level={5}
                    height={SPELL_BLOCK}
                    slotTotal={slotsAt(5)}
                    spells={spellsAt(5)}
                />
            </SpellColumn>
        </SpellPage>
    );
}
