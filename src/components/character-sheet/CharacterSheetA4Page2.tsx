import { memo, useCallback, useEffect, useState, type ReactNode } from "react";
import { useSheetSuggestions, type SheetSuggestions } from "../../hooks/useSheetSuggestions";
import type { CharacterData } from "../../types/character-creator";
import { AutocompleteField } from "./AutocompleteField";
import {
    SHEET_HEIGHT,
    SHEET_WIDTH,
    SuggestTextArea,
    appendList,
    splitList,
} from "./CharacterSheetA4";
import { AttunementMarker } from "./markers";
import { useEditableAutoValue } from "./use-editable-auto-value";
import { featGrantsSpells, spellGrantingSources } from "./spellcasting-sources";
import "./character-sheet.css";

/**
 * Minimal Character Sheet for D&D — A4 page 2, implemented 1:1 from Figma
 * (Simhan – Workspace, node 1780:4987). Same native design size as page 1
 * (2480 x 3508), so the page host can scale both identically and the PDF can
 * append this as its second page.
 *
 * As on page 1, every blank is a text field and every label is permanent.
 */

/** Icons exported from the Figma node. */
const asset = (name: string) => `/character-sheet/page2/${name}.svg`;

const YELLOW = "#ffb800";
const BLUE = "#0090ff";
const GREEN = "#005f1a";

/* ------------------------------------------------------------------ */
/* Values the sheet fills in from the character                        */
/* ------------------------------------------------------------------ */

/** PHB: modifier = (score − 10) ÷ 2, rounded down. */
function abilityModifier(score: number) {
    return Math.floor((score - 10) / 2);
}

/** PHB: +2 at level 1, rising by one every four levels. */
function proficiencyBonus(level: number) {
    return 2 + Math.floor((Math.max(level, 1) - 1) / 4);
}

/**
 * Feats that raise passive Perception, by lower-cased name. Also handed to the
 * HTML download, which keeps deriving the panel's bonus after the fact.
 */
export const PASSIVE_PERCEPTION_FEATS: Record<string, number> = {
    observant: 5,
};

/** What the feats named in this page's own panel add to passive Perception. */
function passivePerceptionFeatBonus(feats: string[]) {
    return feats.reduce(
        (total, feat) => total + (PASSIVE_PERCEPTION_FEATS[feat.trim().toLowerCase()] ?? 0),
        0,
    );
}

/**
 * The Perception modifier a character brings to the sheet. Page 1 reports the
 * same number as it is edited there, so this is only the value the two pages
 * start from — and what page 2 falls back on when it is rendered alone.
 */
function characterPerceptionModifier(character: CharacterData) {
    const perception = character.proficiencies?.skills.find(
        (skill) => skill.name.trim().toLowerCase() === "perception",
    );
    const rank = perception?.expertise ? 2 : perception?.proficient ? 1 : 0;

    return (
        abilityModifier(character.abilityScores.WIS) +
        proficiencyBonus(character.level) * rank
    );
}

/** "Name: description", one blank line apart, as page 1 writes its features. */
function formatEntries(entries: { name?: string; description?: string }[]) {
    return entries
        .filter((entry) => entry.name?.trim())
        .map((entry) => `${entry.name}${entry.description ? `: ${entry.description}` : ""}`)
        .join("\n\n");
}

/**
 * The names out of a panel written as formatEntries writes it — one entry per
 * blank line, "Name: description". Whatever else the player types is left
 * alone; only the leading name of each entry is read back.
 */
function entryNames(text: string) {
    return text
        .split(/\n\s*\n/)
        .map((entry) => entry.trim().split("\n")[0].split(":")[0].trim())
        .filter(Boolean);
}

/**
 * The traits the Species Traits panel fills in with. A character carries its
 * own — the subrace's included — while a sheet being filled in by hand looks
 * up whatever Species page 1 names, so that changing it there rewrites the
 * panel here. A name the Archive does not know leaves the character's traits
 * standing rather than blanking a panel that was right a keystroke ago.
 */
function speciesTraits({
    species,
    options,
    character,
}: {
    /** Page 1's Species blank, or undefined when this page stands alone. */
    species?: string;
    options: SheetSuggestions["species"];
    character?: CharacterData;
}) {
    const fromCharacter = [
        ...(character?.race?.traits ?? []),
        ...(character?.subrace?.traits ?? []),
    ];
    if (species === undefined) return fromCharacter;

    const named = splitList(species).flatMap((name) => {
        const key = name.toLowerCase();
        // The character's own entry is the fuller one: the Archive lists the
        // race's traits, the character adds the subrace's on top.
        if (key === character?.race?.name.trim().toLowerCase()) return fromCharacter;
        return options.find((option) => option.name.toLowerCase() === key)?.traits ?? [];
    });

    return named.length ? named : fromCharacter;
}

/** Equipment carries no count of its own, so repeats become the Amount. */
function inventoryRows(character?: CharacterData) {
    const amounts = new Map<string, number>();
    for (const item of character?.equipment ?? []) {
        const name = item.name?.trim();
        if (!name) continue;
        amounts.set(name, (amounts.get(name) ?? 0) + 1);
    }
    return [...amounts].map(([item, amount]) => ({ item, amount: `${amount}` }));
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
}: {
    src: string;
    w: number;
    h: number;
    /** Figma stroke overflow, e.g. "-6.25% -7.14%". */
    inset?: string;
}) {
    return (
        <div className="relative shrink-0" style={{ width: `${w}px`, height: `${h}px` }}>
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

/** The grey pill that titles each panel. */
function PanelHeader({
    icon,
    label,
    className = "w-full pl-[7px] pr-[39.159px] py-[19.58px]",
    textClassName = "text-[29.369px]",
}: {
    icon: ReactNode;
    label: string;
    className?: string;
    textClassName?: string;
}) {
    return (
        <div
            className={`relative flex shrink-0 items-center gap-[19.58px] rounded-[19.58px] bg-[#f8f8f8] ${className}`}
        >
            {icon}
            <p
                className={`relative shrink-0 whitespace-nowrap ${textClassName} font-semibold not-italic leading-[normal] text-black`}
            >
                {label}
            </p>
        </div>
    );
}

/**
 * A titled panel with a large blank underneath — Allies & Org., Symbols,
 * Species Traits, Character Feats, Treasure, Backstory.
 */
function WritingPanel({
    borderColor,
    icon,
    label,
    height,
    grow = false,
    outerClassName = "p-[12.554px] rounded-[19.728px]",
    innerClassName = "p-[19.255px] rounded-[15.404px]",
    headerClassName,
    value,
    search,
    onTextChange,
    exportField,
}: {
    borderColor: string;
    icon: ReactNode;
    label: string;
    height?: number;
    grow?: boolean;
    outerClassName?: string;
    innerClassName?: string;
    headerClassName?: string;
    /** Names the panel for the HTML download, where another field reads it. */
    exportField?: string;
    /**
     * What the sheet fills in. Rewriting the panel overrides it; the override
     * lasts until the sheet fills in something else — picking another Species
     * on page 1 rewrites this panel rather than leaving the old traits under a
     * new name.
     */
    value?: string;
    /** Adds a field that looks entries up and writes them into the panel. */
    search?: { options: { name: string; description?: string }[]; placeholder: string };
    /** Reports what the panel holds, however it was written. */
    onTextChange?: (text: string) => void;
}) {
    const [text, setText] = useEditableAutoValue(value ?? "");

    // Reported from an effect rather than the handlers, so a pick from the
    // search field is carried as well as a keystroke.
    useEffect(() => onTextChange?.(text), [onTextChange, text]);

    /** Append the picked entry, unless the panel already names it. */
    const add = (name: string) => {
        const option = search?.options.find((item) => item.name === name);
        if (!option) return;
        const written = text.trimEnd();
        const already = written
            .split("\n")
            .some((line) => line.trim().toLowerCase().startsWith(name.toLowerCase()));
        if (already) return;
        const entry = formatEntries([option]);
        setText(written ? `${written}\n\n${entry}` : entry);
    };

    return (
        <div
            data-cs={exportField}
            className={`relative flex w-full items-start border-[4.14px] border-solid ${outerClassName} ${
                grow ? "min-h-[1px] flex-[1_0_0]" : "shrink-0"
            }`}
            style={{ borderColor, ...(height ? { height: `${height}px` } : {}) }}
        >
            <div
                className={`relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-start justify-center overflow-clip bg-[#f8f8f8] ${innerClassName}`}
            >
                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-start gap-[7.702px]">
                    <PanelHeader icon={icon} label={label} {...(headerClassName ? { className: headerClassName } : {})} />
                    {search && (
                        // A way to write into the panel, not part of the sheet:
                        // the PDF drops it and lets the panel take the space.
                        <div
                            data-screen-only
                            className="relative flex w-full shrink-0 items-center rounded-[23.893px] bg-white px-[28px] py-[16px]"
                        >
                            <AutocompleteField
                                ariaLabel={`Search ${label}`}
                                placeholder={search.placeholder}
                                suggestions={search.options.map((option) => option.name)}
                                onSelect={add}
                                clearOnSelect
                                className="w-full text-[30px] font-medium not-italic leading-[normal] text-black placeholder:text-black/40"
                            />
                        </div>
                    )}
                    <textarea
                        aria-label={label}
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        className="relative min-h-[1px] w-full flex-[1_0_0] rounded-[23.893px] bg-white px-[28px] py-[22px] text-[30px] font-medium not-italic leading-[1.35] text-black"
                    />
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Column 1                                                            */
/* ------------------------------------------------------------------ */

/** Size / Languages — an icon-and-label header above a tall blank. */
function StatPanel({
    icon,
    label,
    height,
    headerClassName = "",
    multiline = false,
    options,
}: {
    icon: ReactNode;
    label: string;
    height: number;
    headerClassName?: string;
    multiline?: boolean;
    /**
     * Suggest these from the Archive, one entry per line, as the Weapons and
     * Tools blocks on page 1 do. Languages are picked this way; Size is not.
     */
    options?: string[];
}) {
    return (
        <div
            className="relative flex w-full shrink-0 flex-col items-start rounded-[22.914px] border-[4.14px] border-solid p-[10.873px]"
            style={{ borderColor: YELLOW, height: `${height}px` }}
        >
            {/* Unclipped where it suggests: the menu opens past the panel, as
                page 1's weapon blocks and the magic item rows below do. */}
            <div
                className={`relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-start justify-center gap-[20.831px] rounded-[16.665px] bg-[#f8f8f8] p-[12.499px] ${
                    options ? "" : "overflow-clip"
                }`}
            >
                <div className={`relative flex shrink-0 items-center gap-[16.665px] ${headerClassName}`}>
                    {icon}
                    <p className="relative shrink-0 whitespace-nowrap text-[31.064px] font-normal not-italic leading-[normal] text-black">
                        {label}
                    </p>
                </div>
                <div className="relative flex min-h-[1px] w-full flex-[1_0_0] flex-col items-center rounded-[9.319px] border-2 border-solid border-black bg-white px-[15.532px] py-[12.426px]">
                    {options ? (
                        <SuggestTextArea
                            label={label}
                            options={options}
                            className="text-[34px] font-medium not-italic leading-[1.3] text-black"
                        />
                    ) : multiline ? (
                        <textarea
                            aria-label={label}
                            className="relative h-full w-full text-[34px] font-medium not-italic leading-[1.3] text-black"
                        />
                    ) : (
                        <input
                            type="text"
                            aria-label={label}
                            className="relative h-full w-full text-center text-[72.483px] font-medium not-italic leading-[normal] text-black"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/** CP / SP / GP / PP. */
function CurrencyPanel({ label }: { label: string }) {
    return (
        <div
            className="relative flex min-h-[1px] w-full flex-[1_0_0] items-start rounded-[33.248px] border-[4.14px] border-solid p-[15.776px]"
            style={{ borderColor: YELLOW }}
        >
            <div className="relative flex h-full min-w-[1px] flex-[1_0_0] items-center gap-[36.059px] overflow-clip rounded-[24.181px] bg-[#f8f8f8] py-[18.135px] pl-[18.135px] pr-[30.226px]">
                <div className="relative flex h-full min-w-[1px] flex-[1_0_0] flex-col items-center rounded-[13.522px] border-2 border-solid border-black bg-white px-[22.537px] py-[18.029px]">
                    <input
                        type="text"
                        aria-label={`${label} coins`}
                        className="relative h-full w-full text-center text-[105.172px] font-medium not-italic leading-[normal] text-black"
                    />
                </div>
                <p className="relative shrink-0 whitespace-nowrap text-[45.074px] font-normal not-italic leading-[normal] text-black">
                    {label}
                </p>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Inventory                                                           */
/* ------------------------------------------------------------------ */

/** Proportional so the two columns fill the row exactly, as page 1 does. */
const INVENTORY_COLUMNS: { label: string; grow: number; search?: boolean }[] = [
    { label: "Item", grow: 506.353, search: true },
    { label: "Amount", grow: 156.375 },
];

const INVENTORY_ROWS = 8;

const MAGIC_ITEM_ROWS = 4;

function InventoryDivider() {
    return (
        <div className="relative flex h-[44.197px] w-0 shrink-0 items-center justify-center">
            <div className="flex-none rotate-90">
                <div className="relative h-0 w-[44.197px]">
                    <div className="absolute" style={{ inset: "-2px 0 0 0" }}>
                        <img
                            alt=""
                            src={asset("inventory-divider")}
                            className="block size-full max-w-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Sheet                                                               */
/* ------------------------------------------------------------------ */

/** Memoised: page 1's edits re-render the host, and this page ignores them. */
export const CharacterSheetA4Page2 = memo(function CharacterSheetA4Page2({
    initialCharacter,
    species,
    perceptionModifier,
    onFeatsChange,
}: {
    initialCharacter?: CharacterData;
    /**
     * The Species named on page 1, which the Species Traits panel is filled in
     * from. Undefined where this page stands alone, and the character it was
     * opened with is the only species it knows.
     */
    species?: string;
    /** Page 1's Perception modifier; Passive Perception is 10 plus it. */
    perceptionModifier?: number | null;
    /** Reports the feats, appended, for the spellbook pages' header row. */
    onFeatsChange?: (feats: string) => void;
} = {}) {
    const suggestions = useSheetSuggestions();
    const characterFeats = formatEntries(initialCharacter?.feats ?? []);

    // Held as well as reported: Observant raises passive Perception,
    // and the panel is where this page learns the character has taken them.
    const [feats, setFeats] = useState(characterFeats);
    const featOptions = suggestions.feats;
    const reportFeats = useCallback(
        (text: string) => {
            setFeats(text);
            // Only the feats granting spells — Magic Initiate and its like —
            // belong in the spellbook header; the rest are named on this page.
            onFeatsChange?.(
                appendList(
                    spellGrantingSources(entryNames(text), featOptions, featGrantsSpells),
                ),
            );
        },
        [onFeatsChange, featOptions],
    );

    // Page 1 reports as it is edited; until it has, and wherever this page is
    // rendered without it, the character the sheet was opened with stands in.
    const perception =
        perceptionModifier === undefined
            ? initialCharacter
                ? characterPerceptionModifier(initialCharacter)
                : null
            : perceptionModifier;
    const passive =
        perception === null
            ? ""
            : `${10 + perception + passivePerceptionFeatBonus(entryNames(feats))}`;
    const [passiveValue, setPassiveValue] = useEditableAutoValue(passive);

    const traits = formatEntries(
        speciesTraits({ species, options: suggestions.species, character: initialCharacter }),
    );
    const inventory = inventoryRows(initialCharacter).slice(0, INVENTORY_ROWS);
    const magicItems = (initialCharacter?.magicItems ?? [])
        .map((item) => item.name)
        .slice(0, MAGIC_ITEM_ROWS);

    return (
        <div
            className="cs-root relative flex items-center justify-center bg-white px-[95.824px] py-[133.321px]"
            style={{ width: `${SHEET_WIDTH}px`, height: `${SHEET_HEIGHT}px` }}
        >
            <div className="relative flex shrink-0 items-center gap-[20.68px]">
                {/* ---------------- Column 1 ---------------- */}
                <div className="flex flex-row items-center self-stretch">
                    <div className="relative flex h-full w-[429.126px] shrink-0 flex-col items-start gap-[20.831px]">
                        <div className="relative flex w-full shrink-0 flex-col items-start gap-[20.831px]">
                            {/* Passive Perception */}
                            <div
                                data-cs="passive-perception"
                                data-cs-auto={passive}
                                className="relative flex w-full shrink-0 flex-col items-start rounded-[24.156px] border-[4.14px] border-solid p-[11.462px]"
                                style={{ borderColor: YELLOW }}
                            >
                                <div className="relative flex w-full shrink-0 items-center gap-[16.665px] overflow-clip rounded-[17.568px] bg-[#f8f8f8] p-[13.176px]">
                                    <div className="relative flex shrink-0 flex-col items-center rounded-[9.824px] border-2 border-solid border-black bg-white px-[16.374px] py-[13.099px]">
                                        <span className="relative block shrink-0">
                                            <span
                                                aria-hidden
                                                className="block whitespace-nowrap text-[76.411px] font-medium not-italic leading-[normal] text-black opacity-0"
                                            >
                                                +2
                                            </span>
                                            {/* Derived from page 1, and still a
                                                blank: a monster's or a magic
                                                item's effect is the player's
                                                to write in. */}
                                            <input
                                                type="text"
                                                aria-label="Passive Perception"
                                                value={passiveValue}
                                                onChange={(event) =>
                                                    setPassiveValue(event.target.value)
                                                }
                                                className="absolute inset-0 h-full w-full text-center text-[76.411px] font-medium not-italic leading-[normal] text-black"
                                            />
                                        </span>
                                    </div>
                                    <div className="relative flex shrink-0 items-center justify-center gap-[12.499px]">
                                        <Icon
                                            src={asset("passive-perception")}
                                            w={56.402}
                                            h={51.808}
                                        />
                                        <p className="relative w-[161.602px] shrink-0 text-[25.194px] font-normal not-italic leading-[normal] text-black">
                                            Passive Perception
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <StatPanel
                                label="Size"
                                height={220.812}
                                icon={<Icon src={asset("size")} w={49.991} h={21.485} />}
                            />
                            <StatPanel
                                label="Languages"
                                height={261}
                                multiline
                                options={suggestions.languages}
                                headerClassName="justify-center px-[8.333px]"
                                icon={<Icon src={asset("languages")} w={42.277} h={42.277} />}
                            />
                        </div>

                        <WritingPanel
                            borderColor="#000000"
                            grow
                            label="Allies & Org."
                            headerClassName="w-full pl-[11px] pr-[39.159px] py-[19.58px]"
                            icon={<Icon src={asset("allies")} w={48.487} h={43.294} />}
                        />

                        <WritingPanel
                            borderColor="#000000"
                            height={481}
                            label="Symbols"
                            headerClassName="w-full pl-[12px] pr-[39.159px] py-[19.58px]"
                            icon={
                                <Icon
                                    src={asset("symbols")}
                                    w={24.773}
                                    h={28.313}
                                    inset="-6.25% -7.14%"
                                />
                            }
                        />

                        <div className="relative flex h-[719px] w-[429px] shrink-0 flex-col items-start gap-[20.831px]">
                            {["CP", "SP", "GP", "PP"].map((label) => (
                                <CurrencyPanel key={label} label={label} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ---------------- Column 2 ---------------- */}
                <div className="relative flex h-[3178px] w-[922px] shrink-0 flex-col items-start justify-center gap-[20.72px]">
                    <WritingPanel
                        borderColor={BLUE}
                        height={551.64}
                        label="Species Traits"
                        value={traits}
                        outerClassName="p-[12.547px] rounded-[22.795px]"
                        innerClassName="p-[19.245px] rounded-[15.396px]"
                        icon={<Icon src={asset("species-traits")} w={28.245} h={37.66} />}
                    />
                    <WritingPanel
                        borderColor={BLUE}
                        height={1160}
                        label="Character Feats"
                        exportField="feats"
                        value={characterFeats}
                        onTextChange={reportFeats}
                        search={{ options: suggestions.feats, placeholder: "Search feats…" }}
                        outerClassName="p-[12.547px] rounded-[19.717px]"
                        innerClassName="p-[19.245px] rounded-[22.795px]"
                        icon={<Icon src={asset("character-feats")} w={43.716} h={39.336} />}
                    />

                    {/* Magic Items */}
                    <div
                        className="relative flex w-full shrink-0 items-start rounded-[20.276px] border-[4.14px] border-solid p-[12.903px]"
                        style={{ borderColor: GREEN }}
                    >
                        {/* Unclipped: the rows' suggestion menus open past the panel. */}
                        <div className="relative flex min-w-[1px] flex-[1_0_0] flex-col items-start justify-center self-stretch rounded-[17.287px] bg-[#f8f8f8] p-[21.608px]">
                            <div className="relative flex w-full shrink-0 flex-col items-start gap-[8.643px]">
                                <PanelHeader
                                    label="Magic Items"
                                    className="w-full px-[8.333px] py-[19.58px]"
                                    icon={<Icon src={asset("magic-items")} w={54.463} h={51.014} />}
                                />
                                {Array.from({ length: MAGIC_ITEM_ROWS }, (_, index) => (
                                    <div
                                        key={index}
                                        className="relative flex h-[97.82px] w-full shrink-0 items-center justify-end gap-[24.568px] rounded-[26.782px] bg-white px-[24.568px] py-[26.782px]"
                                    >
                                        <AutocompleteField
                                            ariaLabel={`Magic item ${index + 1}`}
                                            suggestions={suggestions.magicItems}
                                            defaultValue={magicItems[index] ?? ""}
                                            className="w-full text-[32px] font-medium not-italic leading-[normal] text-black"
                                        />
                                        <AttunementMarker label={`Magic item ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <WritingPanel
                        borderColor={GREEN}
                        height={825}
                        label="Treasure"
                        headerClassName="w-full px-[8.333px] py-[19.58px]"
                        icon={<Icon src={asset("treasure")} w={48.551} h={39.002} />}
                    />
                </div>

                {/* ---------------- Column 3 ---------------- */}
                <div className="relative flex w-[839px] shrink-0 flex-col items-start gap-[22.142px]">
                    {/* Inventory */}
                    <div
                        className="relative flex w-full shrink-0 items-start rounded-[20.276px] border-[4.14px] border-solid p-[12.903px]"
                        style={{ borderColor: GREEN }}
                    >
                        {/* Unclipped: the rows' suggestion menus open past the panel. */}
                        <div className="relative flex min-w-[1px] flex-[1_0_0] flex-col items-start justify-center rounded-[17.287px] bg-[#f8f8f8] p-[21.608px]">
                            <div className="relative flex w-full shrink-0 flex-col items-start gap-[8.643px]">
                                <PanelHeader
                                    label="Inventory"
                                    className="shrink-0 gap-[21.972px] rounded-[21.972px] py-[21.972px] pl-[12px] pr-[43.945px]"
                                    textClassName="text-[32.959px]"
                                    icon={<Icon src={asset("inventory")} w={31.749} h={31.749} />}
                                />

                                <div className="relative flex w-full shrink-0 items-start gap-[26.812px] rounded-[26.812px] bg-white px-[53.625px] py-[26.812px]">
                                    {INVENTORY_COLUMNS.map((column, i) => (
                                        <div key={column.label} className="contents">
                                            {i > 0 && <InventoryDivider />}
                                            <p
                                                className="relative whitespace-nowrap text-[33.516px] font-medium not-italic leading-[normal] text-black"
                                                style={{
                                                    flexGrow: column.grow,
                                                    flexBasis: 0,
                                                    minWidth: 0,
                                                }}
                                            >
                                                {column.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="relative flex w-full shrink-0 flex-col items-start rounded-[42.189px] bg-[#f8f8f8]">
                                    {Array.from({ length: INVENTORY_ROWS }, (_, row) => (
                                        <div
                                            key={row}
                                            className="relative flex w-full shrink-0 items-start gap-[26.812px] rounded-[26.812px] px-[53.625px] py-[26.812px]"
                                        >
                                            {INVENTORY_COLUMNS.map((column, i) => {
                                                const filled = inventory[row];
                                                const value = column.search
                                                    ? (filled?.item ?? "")
                                                    : (filled?.amount ?? "");
                                                return (
                                                    <div key={column.label} className="contents">
                                                        {i > 0 && <InventoryDivider />}
                                                        {column.search ? (
                                                            <AutocompleteField
                                                                ariaLabel={`${column.label}, row ${row + 1}`}
                                                                suggestions={suggestions.items}
                                                                defaultValue={value}
                                                                wrapperClassName="block"
                                                                wrapperStyle={{
                                                                    flexGrow: column.grow,
                                                                    flexBasis: 0,
                                                                    minWidth: 0,
                                                                }}
                                                                sizer={column.label}
                                                                sizerClassName="whitespace-nowrap text-[33.516px] font-medium not-italic leading-[normal] text-black"
                                                                className="absolute inset-0 h-full w-full text-left text-[33.516px] font-medium not-italic leading-[normal] text-black"
                                                            />
                                                        ) : (
                                                            <span
                                                                className="relative block"
                                                                style={{
                                                                    flexGrow: column.grow,
                                                                    flexBasis: 0,
                                                                    minWidth: 0,
                                                                }}
                                                            >
                                                                <span
                                                                    aria-hidden
                                                                    className="block whitespace-nowrap text-[33.516px] font-medium not-italic leading-[normal] text-black opacity-0"
                                                                >
                                                                    {column.label}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    aria-label={`${column.label}, row ${row + 1}`}
                                                                    defaultValue={value}
                                                                    className="absolute inset-0 h-full w-full text-left text-[33.516px] font-medium not-italic leading-[normal] text-black"
                                                                />
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <WritingPanel
                        borderColor="#000000"
                        height={2108}
                        label="Backstory"
                        headerClassName="w-[487.454px] pl-[7px] pr-[39.159px] py-[19.58px]"
                        icon={<Icon src={asset("backstory")} w={62.739} h={60.749} />}
                    />
                </div>
            </div>
        </div>
    );
});
