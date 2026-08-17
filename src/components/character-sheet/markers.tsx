import { useState, type ReactNode } from "react";
import { useEditableAutoValue } from "./use-editable-auto-value";

/**
 * Every marker on the sheet that holds a state of its own: the proficiency
 * rings, the death saves, attunement, and the spellbook's component and in-use
 * circles.
 *
 * They live together because the HTML download has to keep them clickable
 * without React. It renders each variant in each of its states once
 * (MARKER_VARIANTS), harvests the markup, and swaps that markup back in as the
 * downloaded page is clicked — so a marker's appearance has to follow from its
 * kind and its state alone, never from where on the sheet it sits. That is what
 * makes one harvested state good for every marker of that kind.
 *
 * The same rule is why the state is not written into `aria-label`: a label
 * carries the marker's name, `aria-pressed` and `title` carry its state, and
 * the downloaded page rebuilds the title from `data-cs-label` — the instance's
 * half — and the harvested `data-cs-state-label` — the state's half.
 */

/** Icons exported from the Figma nodes, by the page that draws them. */
const asset = (name: string) => `/character-sheet/${name}.svg`;
const page2Asset = (name: string) => `/character-sheet/page2/${name}.svg`;
const spellAsset = (name: string) => `/character-sheet/spells/${name}.svg`;

export type ProficiencyLevel = 0 | 1 | 2;

/**
 * What the HTML download reads a marker's kind and state from, plus the two
 * halves of its title. Spread onto the marker's own `<button>`.
 */
function markerAttributes(
    kind: string,
    label: string,
    state: number,
    stateLabel: string,
    pressed: boolean = state > 0,
) {
    return {
        "aria-label": label,
        "aria-pressed": pressed,
        title: `${label}: ${stateLabel}`,
        "data-cs-marker": kind,
        "data-cs-state": state,
        "data-cs-label": label,
        "data-cs-state-label": stateLabel,
    };
}

/* ------------------------------------------------------------------ */
/* Proficiency rings                                                   */
/* ------------------------------------------------------------------ */

/**
 * Skills cycle empty → proficient → expertise; a saving throw keeps the plain
 * two-state toggle, and Strength's is drawn from a second ring Figma exported.
 */
const PROF_RING_VARIANTS = {
    skill: { src: asset("prof-ring"), allowExpertise: true },
    save: { src: asset("prof-ring"), allowExpertise: false },
    "save-alt": { src: asset("prof-ring-alt"), allowExpertise: false },
} as const;

export type ProfRingVariant = keyof typeof PROF_RING_VARIANTS;

const PROF_RING_STATE_LABELS = ["not proficient", "proficient", "expertise"] as const;

/** A proficiency marker. */
export function ProfRing({
    label,
    variant,
    level,
    onLevelChange,
}: {
    label: string;
    variant: ProfRingVariant;
    level?: ProficiencyLevel;
    onLevelChange?: (level: ProficiencyLevel) => void;
}) {
    const { src, allowExpertise } = PROF_RING_VARIANTS[variant];
    const [internalLevel, setInternalLevel] = useState<ProficiencyLevel>(0);
    const currentLevel = level ?? internalLevel;

    const toggle = () => {
        const next = (
            allowExpertise ? (currentLevel + 1) % 3 : currentLevel === 0 ? 1 : 0
        ) as ProficiencyLevel;
        if (level === undefined) setInternalLevel(next);
        onLevelChange?.(next);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className="relative size-[20.73px] shrink-0"
            {...markerAttributes(
                `prof-ring-${variant}`,
                `${label} proficiency`,
                currentLevel,
                PROF_RING_STATE_LABELS[currentLevel],
            )}
        >
            {currentLevel === 2 ? (
                <img
                    alt=""
                    src={asset("expertise-star")}
                    className="absolute inset-0 block size-full max-w-none"
                />
            ) : (
                <>
                    <div className="absolute" style={{ inset: "-4.99%" }}>
                        <img alt="" src={src} className="block size-full max-w-none" />
                    </div>
                    {currentLevel === 1 && (
                        <span className="absolute inset-[26%] rounded-full bg-black" />
                    )}
                </>
            )}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Death saves                                                         */
/* ------------------------------------------------------------------ */

/** One death-save marker: a circle for a success, a rotated square for a failure. */
export function DeathSaveMarker({
    kind,
    label,
    marked,
    onToggle,
}: {
    kind: "success" | "failure";
    label: string;
    marked: boolean;
    onToggle?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={
                kind === "success"
                    ? `size-[33.657px] rounded-full border-[2.243px] border-solid border-black ${
                          marked ? "bg-black" : "bg-[#f8f8f8]"
                      }`
                    : `size-[24.908px] rotate-45 border-[2.243px] border-solid border-black ${
                          marked ? "bg-black" : "bg-[#f8f8f8]"
                      }`
            }
            {...markerAttributes(
                `death-save-${kind}`,
                label,
                marked ? 1 : 0,
                marked ? "marked" : "not marked",
            )}
        />
    );
}

/* ------------------------------------------------------------------ */
/* Attunement                                                          */
/* ------------------------------------------------------------------ */

/**
 * The attunement marker beside a magic item: an outline the player fills in,
 * toggled the same way the proficiency rings are.
 */
export function AttunementMarker({
    label,
    initialAttuned = false,
}: {
    label: string;
    initialAttuned?: boolean;
}) {
    const [attuned, setAttuned] = useState(initialAttuned);
    return (
        <button
            type="button"
            onClick={() => setAttuned((current) => !current)}
            className="relative size-[47.234px] shrink-0"
            {...markerAttributes(
                "attunement",
                `${label} attunement`,
                attuned ? 1 : 0,
                attuned ? "attuned" : "not attuned",
            )}
        >
            {attuned ? (
                <img
                    alt=""
                    src={page2Asset("magic-item-marker-selected")}
                    className="absolute inset-0 block size-full max-w-none"
                />
            ) : (
                // Figma drew the outline with its stroke overflowing the box.
                <div className="absolute" style={{ inset: "0 1.25% 4.95% 1.25%" }}>
                    <img
                        alt=""
                        src={page2Asset("magic-item-marker")}
                        className="block size-full max-w-none"
                    />
                </div>
            )}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Spellbook markers                                                   */
/* ------------------------------------------------------------------ */

export type MarkerName = "c" | "r" | "v" | "s" | "m";

const MARKER_LABELS: Record<MarkerName, string> = {
    c: "Concentration",
    r: "Ritual",
    v: "Verbal component",
    s: "Somatic component",
    m: "Material component",
};

/** A spell marker whose automatic value can still be changed by hand. */
export function SpellMarker({ name, automatic }: { name: MarkerName; automatic: boolean }) {
    const [selectedValue, setSelectedValue] = useEditableAutoValue(String(automatic));
    const selected = selectedValue === "true";
    const label = MARKER_LABELS[name];
    const selectedAsset =
        name === "c" || name === "r" ? "component-active-7" : "component-active-6";
    // "C" is exported a shade larger than the rest.
    const size = name === "c" ? 40.041 : 39.089;

    return (
        <button
            type="button"
            onClick={() => setSelectedValue(String(!selected))}
            className="relative shrink-0 cursor-pointer rounded-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black"
            style={{ width: `${size}px`, height: `${size}px` }}
            {...markerAttributes(
                `spell-${name}`,
                label,
                selected ? 1 : 0,
                selected ? "yes" : "no",
            )}
        >
            <img
                alt=""
                src={selected ? spellAsset(selectedAsset) : spellAsset(`component-${name}`)}
                className="absolute inset-0 block size-full max-w-none"
            />
        </button>
    );
}

/** The prepared/in-use circle, initially selected for spells from the creator list. */
export function PreparedMarker({ automatic, row }: { automatic: boolean; row: string }) {
    const [selectedValue, setSelectedValue] = useEditableAutoValue(String(automatic));
    const selected = selectedValue === "true";

    return (
        <button
            type="button"
            onClick={() => setSelectedValue(String(!selected))}
            className="relative h-[23.857px] w-[23.857px] shrink-0 cursor-pointer rounded-full focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-black"
            {...markerAttributes(
                "prepared",
                `Spell in use, ${row}`,
                selected ? 1 : 0,
                selected ? "yes" : "no",
            )}
        >
            <span className="absolute -inset-[4.99%]">
                <img
                    alt=""
                    src={spellAsset(selected ? "prepared-active" : "prepared")}
                    className="block size-full max-w-none"
                />
            </span>
        </button>
    );
}

/* ------------------------------------------------------------------ */
/* Every marker, in every state                                        */
/* ------------------------------------------------------------------ */

/**
 * What the HTML download harvests its clickable markers from: one entry per
 * kind, holding that kind's states in the order they cycle through. The labels
 * here are placeholders — the downloaded page keeps each marker's own.
 */
export const MARKER_VARIANTS: { kind: string; states: ReactNode[] }[] = [
    ...(Object.keys(PROF_RING_VARIANTS) as ProfRingVariant[]).map((variant) => ({
        kind: `prof-ring-${variant}`,
        states: (
            PROF_RING_VARIANTS[variant].allowExpertise
                ? ([0, 1, 2] as const)
                : ([0, 1] as const)
        ).map((level) => <ProfRing label="Marker" variant={variant} level={level} />),
    })),
    ...(["success", "failure"] as const).map((kind) => ({
        kind: `death-save-${kind}`,
        states: [false, true].map((marked) => (
            <DeathSaveMarker kind={kind} label="Marker" marked={marked} />
        )),
    })),
    {
        kind: "attunement",
        states: [false, true].map((attuned) => (
            <AttunementMarker label="Marker" initialAttuned={attuned} />
        )),
    },
    ...(["c", "r", "v", "s", "m"] as const).map((name) => ({
        kind: `spell-${name}`,
        states: [false, true].map((automatic) => (
            <SpellMarker name={name} automatic={automatic} />
        )),
    })),
    {
        kind: "prepared",
        states: [false, true].map((automatic) => (
            <PreparedMarker automatic={automatic} row="Marker" />
        )),
    },
];
