import { useMemo, useState } from "react";
import { Check, ChevronDown, Loader2, Search, Sparkles, TrendingUp } from "lucide-react";
import type { AbilityScore, AbilityScores, Feat } from "../../types/dnd-types";
import type { CharacterData } from "../../types/character-creator";
import { useFeats } from "../../hooks/useSanityData";
import { ClampedText } from "../ui/clamped-text";
import { finalAbilityScores } from "../../utils/ability-scores";
import {
    ABILITIES,
    abilityCap,
    abilityScoreImprovement,
    featCategoryOf,
    featsForImprovement,
    featTakenAt,
    featWeight,
    flexibleAbilityAmount,
    flexibleAbilityOptions,
    improvementSlots,
    isAbilityScoreImprovement,
    maxPerAbility,
    pruneFeatAbilityChoices,
    toggleFeatAbilityPoint,
    unmetPrerequisites,
    unspentAbilityPoints,
    type ImprovementSlot,
    type PrerequisiteContext,
} from "../../utils/feats";
import { classLevels, isMulticlassed } from "../../utils/multiclass";

const ABILITY_NAMES: Record<AbilityScore, string> = {
    STR: "Strength", DEX: "Dexterity", CON: "Constitution",
    INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma",
};

type WeightFilter = "all" | "half" | "full";

/**
 * Ability Score Improvements, from level 4. At each one the character takes
 * either the improvement (+2 to one score, or +1 to two) or a feat they
 * qualify for. A half feat's +1 is placed here too, so every point a choice
 * hands out is settled before moving on.
 */
export function FeatSelectionStep({
    character,
    onChange,
}: {
    character: CharacterData;
    onChange: (patch: Pick<CharacterData, "feats" | "featAbilityChoices">) => void;
}) {
    const ruleset = character.ruleset;
    const { data: allFeats, loading } = useFeats(ruleset);
    const slots = improvementSlots(character);
    const multiclassed = isMulticlassed(character);
    const choices = character.featAbilityChoices;

    const firstOpen = slots.find((slot) => {
        const taken = featTakenAt(character.feats, slot.takenAt);
        return !taken || unspentAbilityPoints(taken, choices) > 0;
    });
    const [openSlot, setOpenSlot] = useState<ImprovementSlot["takenAt"] | undefined>((firstOpen ?? slots[0])?.takenAt);

    const offered = useMemo(() => featsForImprovement(allFeats ?? [], ruleset), [allFeats, ruleset]);

    /** Replaces whatever fills a slot, keeping the background and the other slots. */
    const fillSlot = (slot: ImprovementSlot, pick: Feat | undefined) => {
        const others = character.feats.filter((feat) => feat.takenAt !== slot.takenAt);
        const feats = pick ? [...others, { ...pick, takenAt: slot.takenAt }] : others;
        onChange({ feats, featAbilityChoices: pruneFeatAbilityChoices(feats, choices) });
    };

    const placePoint = (feat: Feat, ability: AbilityScore) =>
        onChange({ feats: character.feats, featAbilityChoices: toggleFeatAbilityPoint(feat, ability, choices) });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                Loading feats…
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <TrendingUp className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h2 className="text-white text-3xl font-bold mb-2 font-serif">Ability Score Improvement or Feat</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    At each of these levels, take an Ability Score Improvement (+2 to one score, or +1 to two) or a feat
                    you qualify for. {ruleset === "2024"
                        ? "Most 2024 feats are half feats: they also raise an ability by 1."
                        : "Most 2014 feats are full feats; a few half feats also raise an ability by 1."}
                </p>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
                {slots.map((slot) => {
                    const taken = featTakenAt(character.feats, slot.takenAt);
                    const open = openSlot === slot.takenAt;
                    const unspent = taken ? unspentAbilityPoints(taken, choices) : 0;
                    const done = !!taken && unspent === 0;
                    const epic = slot.epicBoon;

                    return (
                        <section
                            key={slot.takenAt}
                            className={`rounded-xl border ${open ? "border-amber-600/60 bg-zinc-900/60" : done ? "border-emerald-800/50 bg-zinc-900/30" : "border-zinc-800 bg-zinc-900/30"}`}
                        >
                            <button
                                type="button"
                                onClick={() => setOpenSlot(open ? undefined : slot.takenAt)}
                                aria-expanded={open}
                                className="w-full flex items-center gap-3 p-4 text-left"
                            >
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${done ? "border-emerald-600 bg-emerald-950 text-emerald-300" : "border-amber-700 bg-amber-950 text-amber-300"}`}>
                                    {done ? <Check className="w-4 h-4" /> : slot.classLevel}
                                </span>
                                <span className="flex-1 min-w-0">
                                    <span className="block font-serif font-semibold text-gray-100">
                                        {multiclassed ? `${slot.className} level ${slot.classLevel}` : `Level ${slot.classLevel}`}
                                        {" · "}{epic ? "Epic Boon" : "Ability Score Improvement"}
                                    </span>
                                    <span className="block text-sm text-gray-400 truncate">
                                        {slotSummary(taken, choices, unspent)}
                                    </span>
                                </span>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
                            </button>

                            {open && (
                                <SlotEditor
                                    key={slot.takenAt}
                                    character={character}
                                    slot={slot}
                                    taken={taken}
                                    offered={offered}
                                    onFill={(pick) => fillSlot(slot, pick)}
                                    onPlacePoint={placePoint}
                                />
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}

function slotSummary(
    taken: Feat | undefined,
    choices: Record<string, Partial<AbilityScores>> | undefined,
    unspent: number,
): string {
    if (!taken) return "Not chosen yet";
    const fixed = ABILITIES
        .filter((ability) => (taken.benefits?.abilityScoreIncrease?.[ability] ?? 0) > 0)
        .map((ability) => `+${taken.benefits.abilityScoreIncrease![ability]} ${ability}`);
    const placed = Object.entries(choices?.[taken.id] ?? {})
        .filter(([, value]) => (value ?? 0) > 0)
        .map(([ability, value]) => `+${value} ${ability}`);
    const raises = [...fixed, ...placed].join(", ");
    const pending = unspent > 0 ? ` — ${unspent} point${unspent === 1 ? "" : "s"} to place` : "";
    if (isAbilityScoreImprovement(taken)) return `Ability Score Improvement${raises ? `: ${raises}` : ""}${pending}`;
    return `${taken.name}${raises ? ` (${raises})` : ""}${pending}`;
}

function SlotEditor({
    character,
    slot,
    taken,
    offered,
    onFill,
    onPlacePoint,
}: {
    character: CharacterData;
    slot: ImprovementSlot;
    taken?: Feat;
    offered: Feat[];
    onFill: (pick: Feat | undefined) => void;
    onPlacePoint: (feat: Feat, ability: AbilityScore) => void;
}) {
    const epic = slot.epicBoon;
    const tookFeat = !!taken && !isAbilityScoreImprovement(taken);
    const [mode, setMode] = useState<"asi" | "feat" | undefined>(taken ? (tookFeat ? "feat" : "asi") : undefined);
    const [browsing, setBrowsing] = useState(!tookFeat);
    const [search, setSearch] = useState("");
    const [weight, setWeight] = useState<WeightFilter>("all");
    const [showUnavailable, setShowUnavailable] = useState(false);

    // Scores with every other choice in place: prerequisites are checked
    // against them, and the bubbles stop a score passing its cap.
    const others = useMemo(() => finalAbilityScores({
        ...character,
        feats: character.feats.filter((feat) => feat.takenAt !== slot.takenAt),
    }), [character, slot.takenAt]);
    const scores = useMemo(() => finalAbilityScores(character), [character]);

    const listed = useMemo(() => {
        const context: PrerequisiteContext = {
            // The level the choice is made at, so an Epic Boon can't fill level 4.
            // An extra class's improvement comes after the first class's levels,
            // so only the first class's can be pinned to its own level.
            level: typeof slot.takenAt === "number" ? slot.classLevel : character.level,
            ruleset: character.ruleset,
            abilityScores: others,
            race: character.race,
            subrace: character.subrace,
            class: character.class,
            subclass: character.subclass,
            feats: character.feats,
            armor: character.proficiencies?.armor,
            takenAt: slot.takenAt,
            classes: classLevels(character),
        };
        const term = search.trim().toLowerCase();
        return offered
            .map((feat) => ({ feat, reasons: unmetPrerequisites(feat, context).filter((reason) => !reason.advisory) }))
            .filter(({ feat, reasons }) => {
                if (!showUnavailable && reasons.length > 0) return false;
                if (weight !== "all" && featWeight(feat).kind !== weight) return false;
                if (!term) return true;
                return feat.name.toLowerCase().includes(term) || (feat.description ?? "").toLowerCase().includes(term);
            })
            // At level 19 the Epic Boons are the headline choice, so they lead.
            .sort((a, b) => Number(featCategoryOf(b.feat) === "Epic Boon") - Number(featCategoryOf(a.feat) === "Epic Boon"));
    }, [offered, search, weight, showUnavailable, character, slot, others]);

    const chooseAsi = () => {
        setMode("asi");
        if (!taken || !isAbilityScoreImprovement(taken)) onFill(abilityScoreImprovement(slot.takenAt, character.ruleset));
    };

    const chooseFeatMode = () => {
        setMode("feat");
        setBrowsing(!tookFeat);
        // The improvement's points go with it; a feat is picked from the list next.
        if (taken && isAbilityScoreImprovement(taken)) onFill(undefined);
    };

    return (
        <div className="px-4 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={`${slot.className} level ${slot.classLevel} choice`}>
                <ModeButton active={mode === "asi"} onClick={chooseAsi} title="Ability Score Improvement" note="+2 to one score, or +1 to two" />
                <ModeButton
                    active={mode === "feat"}
                    onClick={chooseFeatMode}
                    title={epic ? "Epic Boon or Feat" : "Feat"}
                    note={epic ? "An Epic Boon, or any feat you qualify for" : "Any feat you qualify for"}
                />
            </div>

            {mode === "asi" && taken && isAbilityScoreImprovement(taken) && (
                <AbilityBubbles feat={taken} character={character} scores={scores} others={others} onPlace={onPlacePoint} />
            )}

            {mode === "feat" && tookFeat && !browsing && (
                <div className="rounded-lg border border-amber-600/50 bg-amber-950/20 p-3 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h4 className="font-serif font-semibold text-amber-300 mb-1">{taken.name}</h4>
                            <FeatBadges feat={taken} ruleset={character.ruleset} />
                        </div>
                        <button type="button" onClick={() => setBrowsing(true)} className="text-sm text-amber-400 hover:text-amber-200 shrink-0">
                            Change
                        </button>
                    </div>
                    <ClampedText text={taken.description} className="text-sm text-gray-400" />
                    {flexibleAbilityAmount(taken) > 0 && (
                        <AbilityBubbles feat={taken} character={character} scores={scores} others={others} onPlace={onPlacePoint} />
                    )}
                </div>
            )}

            {mode === "feat" && browsing && (
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search feats by name or benefit..."
                                className="w-full pl-9 pr-3 py-2 bg-zinc-900/60 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
                            />
                        </div>
                        <div className="flex rounded-lg border border-zinc-700 overflow-hidden text-sm" role="group" aria-label="Feat type">
                            {(["all", "half", "full"] as WeightFilter[]).map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    aria-pressed={weight === option}
                                    onClick={() => setWeight(option)}
                                    className={`px-3 py-2 ${weight === option ? "bg-amber-900/50 text-amber-200" : "text-gray-400 hover:bg-zinc-800"}`}
                                >
                                    {option === "all" ? "All" : option === "half" ? "Half feats" : "Full feats"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                        <input type="checkbox" checked={showUnavailable} onChange={(event) => setShowUnavailable(event.target.checked)} />
                        Show feats this character doesn't qualify for
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {listed.map(({ feat, reasons }) => {
                            const active = taken?.id === feat.id;
                            const blocked = reasons.length > 0;
                            return (
                                <button
                                    key={feat.id}
                                    type="button"
                                    aria-pressed={active}
                                    aria-disabled={blocked}
                                    onClick={() => {
                                        if (blocked) return;
                                        if (!active) onFill(feat);
                                        setBrowsing(false);
                                    }}
                                    className={`text-left p-3 border rounded-lg transition-all ${active
                                        ? "border-amber-500 bg-amber-900/30"
                                        : blocked
                                            ? "border-zinc-800/60 bg-zinc-900/20 opacity-50 cursor-not-allowed"
                                            : "border-zinc-800 bg-zinc-900/40 hover:border-amber-500/50 hover:bg-zinc-800"
                                    }`}
                                >
                                    <h4 className={`font-semibold font-serif mb-1 ${active ? "text-amber-400" : "text-gray-200"}`}>{feat.name}</h4>
                                    <FeatBadges feat={feat} ruleset={character.ruleset} />
                                    {blocked && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {reasons.map((reason) => <Badge key={reason.text} tone="red">{reason.text}</Badge>)}
                                        </div>
                                    )}
                                    <ClampedText text={feat.description} className="text-sm text-gray-400 mt-1" />
                                </button>
                            );
                        })}
                    </div>
                    {listed.length === 0 && (
                        <p className="text-center text-gray-500 py-6">
                            No feats match.{!showUnavailable && " Some may be hidden because this character doesn't qualify for them."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

function ModeButton({ active, onClick, title, note }: { active: boolean; onClick: () => void; title: string; note: string }) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={active}
            onClick={onClick}
            className={`text-left p-3 rounded-lg border transition-all ${active ? "border-amber-500 bg-amber-900/30" : "border-zinc-700 bg-zinc-900/40 hover:border-amber-500/50"}`}
        >
            <span className={`block font-semibold ${active ? "text-amber-300" : "text-gray-200"}`}>{title}</span>
            <span className="block text-xs text-gray-400">{note}</span>
        </button>
    );
}

/** One button per ability: its score now, and the points this choice puts there. */
function AbilityBubbles({
    feat,
    character,
    scores,
    others,
    onPlace,
}: {
    feat: Feat;
    character: CharacterData;
    scores: AbilityScores;
    others: AbilityScores;
    onPlace: (feat: Feat, ability: AbilityScore) => void;
}) {
    const allowed = new Set(flexibleAbilityOptions(feat));
    const placed = character.featAbilityChoices?.[feat.id] ?? {};
    const remaining = unspentAbilityPoints(feat, character.featAbilityChoices);
    const amount = flexibleAbilityAmount(feat);
    const cap = abilityCap(feat);
    const perAbility = Math.min(maxPerAbility(feat), amount);

    return (
        <div>
            <p className="text-xs text-gray-400 mb-2">
                {remaining > 0
                    ? `Place ${remaining} more point${remaining === 1 ? "" : "s"}. A score can't go above ${cap}.`
                    : "All points placed. Click a score again to take its points back."}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ABILITIES.map((ability) => {
                    const here = placed[ability] ?? 0;
                    const fixed = feat.benefits?.abilityScoreIncrease?.[ability] ?? 0;
                    // One more point here needs room under the cap and the per-ability limit,
                    // and a point left to give — except a single point, which simply moves.
                    const room = allowed.has(ability) && here < perAbility && others[ability] + here + fixed + 1 <= cap;
                    const usable = here > 0 || (room && (remaining > 0 || amount === 1));
                    return (
                        <button
                            key={ability}
                            type="button"
                            disabled={!usable}
                            onClick={() => onPlace(feat, ability)}
                            title={!allowed.has(ability) ? `${feat.name} can't raise ${ABILITY_NAMES[ability]}` : undefined}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${here > 0
                                ? "border-emerald-600 bg-emerald-950/40 text-emerald-200"
                                : usable
                                    ? "border-zinc-700 bg-zinc-900/50 text-gray-300 hover:border-emerald-600/60"
                                    : "border-zinc-800 bg-zinc-900/20 text-gray-600 cursor-not-allowed"
                            }`}
                        >
                            <span>
                                <span className="font-semibold">{ability}</span>{" "}
                                <span className="text-gray-500">{scores[ability]}</span>
                            </span>
                            <span className="font-bold">{here > 0 ? `+${here}` : fixed > 0 ? `+${fixed}` : ""}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function FeatBadges({ feat, ruleset }: { feat: Feat; ruleset?: CharacterData["ruleset"] }) {
    const weight = featWeight(feat);
    const category = featCategoryOf(feat);
    return (
        <div className="flex flex-wrap gap-1">
            <Badge tone={weight.kind === "half" ? "emerald" : "zinc"}>{weight.label}</Badge>
            {/* 2014 has no feat categories, so only 2024 names them. */}
            {ruleset === "2024" && category !== "General" && (
                <Badge tone="amber">
                    {category === "Epic Boon" && <Sparkles className="w-3 h-3 inline mr-0.5 -mt-0.5" />}
                    {category}
                </Badge>
            )}
            {feat.source !== "Official" && <Badge tone="zinc">{feat.source}</Badge>}
        </div>
    );
}

function Badge({ tone, children }: { tone: "amber" | "red" | "zinc" | "emerald"; children: React.ReactNode }) {
    const tones = {
        amber: "bg-amber-950 text-amber-300 border-amber-700",
        red: "bg-red-950 text-red-300 border-red-800",
        zinc: "bg-zinc-800 text-gray-400 border-zinc-700",
        emerald: "bg-emerald-950 text-emerald-300 border-emerald-800",
    };
    return <span className={`text-xs px-2 py-0.5 rounded border whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}
