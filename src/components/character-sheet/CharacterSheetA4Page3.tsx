import type { ReactNode } from "react";
import { SHEET_HEIGHT, SHEET_WIDTH } from "./CharacterSheetA4";
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

/** Spell Casting Class / Spell Casting Ability — icon, label, wide blank. */
function LabelledTile({
    width,
    label,
    fieldClassName,
}: {
    width: number;
    label: string;
    fieldClassName: string;
}) {
    return (
        <div
            className="relative flex h-full shrink-0 items-start rounded-[22.914px] border-[4.14px] border-solid p-[10.873px]"
            style={{ borderColor: SPELL_BLUE, width: `${width}px` }}
        >
            <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start justify-center gap-[20.831px] overflow-clip rounded-[16.665px] bg-[#f8f8f8] p-[12.499px]">
                <div className="relative flex shrink-0 items-center gap-[16.665px]">
                    <Icon src={spellAsset("spell-casting")} w={39.526} h={39.526} />
                    <p className="relative shrink-0 whitespace-nowrap text-[31.064px] font-normal not-italic leading-[normal] text-black">
                        {label}
                    </p>
                </div>
                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-center rounded-[9.319px] border-2 border-solid border-black bg-white px-[15.532px] py-[12.426px]">
                    <input
                        type="text"
                        aria-label={label}
                        className={`relative h-full w-full font-medium not-italic leading-[normal] text-black ${fieldClassName}`}
                    />
                </div>
            </div>
        </div>
    );
}

/** Spell Save DC / Spell Attack Bonus — a square blank beside its label. */
function NumericTile({ label }: { label: string }) {
    return (
        <div
            className="relative flex h-full min-w-[1px] flex-[1_0_0] items-start rounded-[24.156px] border-[4.14px] border-solid p-[11.462px]"
            style={{ borderColor: SPELL_BLUE }}
        >
            <div className="relative flex h-full min-w-[1px] flex-[1_0_0] items-center gap-[26.198px] overflow-clip rounded-[17.568px] bg-[#f8f8f8] p-[13.176px]">
                <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-center rounded-[9.824px] border-2 border-solid border-black bg-white px-[16.374px] py-[13.099px]">
                    <input
                        type="text"
                        aria-label={label}
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

/** The four blue tiles that top both spellbook pages. */
function SpellHeaderRow() {
    return (
        <div className="relative flex h-[217px] w-full shrink-0 items-start justify-center gap-[20.831px]">
            <LabelledTile
                width={821}
                label="Spell Casting Class,Sub-class, Race, Feat"
                fieldClassName="text-[44px]"
            />
            <LabelledTile width={493} label="Spell Casting Ability" fieldClassName="text-[56px]" />
            <NumericTile label="Spell Save DC" />
            <NumericTile label="Spell Attack Bonus" />
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

/**
 * The C/R and V/S/M markers a player rings by hand. Each is a single exported
 * glyph, as on page 1's death saves, so they are drawn rather than interactive.
 */
function Markers({ names }: { names: string[] }) {
    return (
        <div className="relative flex shrink-0 items-center gap-[14.479px]">
            {names.map((name) => {
                // "C" is exported a shade larger than the rest.
                const size = name === "c" ? 40.041 : 39.089;
                return (
                    <Icon key={name} src={spellAsset(`component-${name}`)} w={size} h={size} />
                );
            })}
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
function SlotBox({ label, width }: { label: string; width: number }) {
    return (
        <div
            className="relative flex h-[64.13px] shrink-0 flex-col items-center rounded-[5.3px] border-2 border-solid border-black bg-white px-[8.834px] py-[7.067px]"
            style={{ width: `${width}px` }}
        >
            <input
                type="text"
                aria-label={label}
                className="relative h-full w-full text-center text-[41.224px] font-medium not-italic leading-[normal] text-black"
            />
        </div>
    );
}

/** Level headers carry "__ of __" slot counters; the cantrip header does not. */
function BlockHeader({ title, slots }: { title: string; slots: boolean }) {
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
                    <SlotBox label={`${title} slots total`} width={113.817} />
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

const CELL_FIELD =
    "relative h-[40.041px] shrink-0 text-center text-[24px] font-medium not-italic leading-[normal] text-black";

/** One spell: a prepared marker, three blanks, and the two marker groups. */
function SpellRow({
    title,
    index,
    prepared,
}: {
    title: string;
    index: number;
    prepared: boolean;
}) {
    const row = `${title}, row ${index + 1}`;
    return (
        <div
            className="relative flex min-h-[1px] w-full flex-[1_0_0] items-center overflow-hidden rounded-[25.946px] bg-white px-[23.802px]"
            style={{ gap: `${CELL_GAP}px` }}
        >
            {prepared && (
                <Icon src={spellAsset("prepared")} w={23.857} h={23.857} inset="-4.99%" />
            )}
            <input
                type="text"
                aria-label={`Spell name, ${row}`}
                className="relative h-[40.041px] min-w-[1px] flex-[1_0_0] text-[28px] font-medium not-italic leading-[normal] text-black"
            />
            <CellDivider />
            <input
                type="text"
                aria-label={`Casting time, ${row}`}
                className={CELL_FIELD}
                style={{ width: `${CELL}px` }}
            />
            <CellDivider />
            <input
                type="text"
                aria-label={`Range, ${row}`}
                className={CELL_FIELD}
                style={{ width: `${CELL}px` }}
            />
            <CellDivider />
            <Markers names={["c", "r"]} />
            <CellDivider />
            <Markers names={["v", "s", "m"]} />
        </div>
    );
}

/**
 * A red-outlined spell table. The ten spell rows are flex-grown so the block
 * always fills its declared height exactly, which is what keeps the two
 * columns tiling to the page — the same fix page 1's actions table needed.
 */
export function SpellBlock({
    title,
    height,
    slots = true,
}: {
    title: string;
    height: number;
    /** Cantrips have no slot counters, and their rows have no prepared marker. */
    slots?: boolean;
}) {
    return (
        <div
            className="relative flex w-full shrink-0 items-start rounded-[19.87px] border-[4.14px] border-solid p-[12.645px]"
            style={{ borderColor: RED, height: `${height}px` }}
        >
            <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start justify-center overflow-clip rounded-[15.516px] bg-[#f8f8f8] p-[19.394px]">
                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-start gap-[9.998px]">
                    <BlockHeader title={title} slots={slots} />
                    <ColumnLabels height={slots ? 59.94 : 67.23} />
                    {Array.from({ length: SPELL_ROWS }, (_, index) => (
                        <SpellRow key={index} title={title} index={index} prepared={slots} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page shell                                                          */
/* ------------------------------------------------------------------ */

/** One of the two block columns filling the page body. */
export function SpellColumn({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start gap-[20.8px]">
            {children}
        </div>
    );
}

/** The A4 canvas, header row and two-column body shared by pages 3 and 4. */
export function SpellPage({ children }: { children: ReactNode }) {
    return (
        <div
            className="cs-root relative flex justify-center bg-white px-[125.5px] pt-[160px]"
            style={{ width: `${SHEET_WIDTH}px`, height: `${SHEET_HEIGHT}px` }}
        >
            <div className="relative flex w-full shrink-0 flex-col items-start gap-[25px]">
                <SpellHeaderRow />
                <div
                    className="relative flex w-full shrink-0 items-start gap-[19.14px]"
                    style={{ height: `${SPELL_BODY_HEIGHT}px` }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sheet                                                               */
/* ------------------------------------------------------------------ */

export function CharacterSheetA4Page3() {
    return (
        <SpellPage>
            <SpellColumn>
                <SpellBlock title="Cantrips" height={SPELL_BLOCK_TOP} slots={false} />
                <SpellBlock title="Level 1" height={SPELL_BLOCK} />
                <SpellBlock title="Level 2" height={SPELL_BLOCK} />
            </SpellColumn>
            <SpellColumn>
                <SpellBlock title="Level 3" height={SPELL_BLOCK_TOP} />
                <SpellBlock title="Level 4" height={SPELL_BLOCK} />
                <SpellBlock title="Level 5" height={SPELL_BLOCK} />
            </SpellColumn>
        </SpellPage>
    );
}
