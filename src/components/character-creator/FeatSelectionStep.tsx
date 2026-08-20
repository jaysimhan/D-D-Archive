import { useState, useMemo } from "react";
import { Search, Sparkles, Loader2, Lock } from "lucide-react";
import {
    AbilityScores,
    CharacterRuleset,
    Class,
    Feat,
    Race,
    Subclass,
    Subrace,
} from "../../types/dnd-types";
import { useFeats } from "../../hooks/useSanityData";
import {
    featBudget,
    flexibleAbilityAmount,
    flexibleAbilityOptions,
    unmetPrerequisites,
    type PrerequisiteContext,
} from "../../utils/feats";

const ABILITY_SHORT: Record<string, string> = {
    STR: "Str", DEX: "Dex", CON: "Con", INT: "Int", WIS: "Wis", CHA: "Cha",
};

// Feat Selection Step
export function FeatSelectionStep({
    selectedFeats,
    ruleset,
    onFeatsChange,
    lockedFeatIds = [],
    classData,
    subclass,
    level,
    race,
    subrace,
    abilityScores,
}: {
    selectedFeats: Feat[];
    ruleset: CharacterRuleset;
    onFeatsChange: (feats: Feat[]) => void;
    lockedFeatIds?: string[];
    classData?: Class;
    subclass?: Subclass;
    level: number;
    race?: Race;
    subrace?: Subrace;
    abilityScores?: AbilityScores;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: allFeats, loading } = useFeats(ruleset);

    const budget = useMemo(() => featBudget(level, race, subrace), [level, race, subrace]);
    // Feats a background hands over are already spent, so they count against
    // the same budget rather than sitting outside it.
    const spent = selectedFeats.length;
    const remaining = budget - spent;

    const context: PrerequisiteContext = useMemo(() => ({
        level,
        ruleset,
        abilityScores,
        race,
        subrace,
        class: classData,
        subclass,
        feats: selectedFeats,
    }), [level, ruleset, abilityScores, race, subrace, classData, subclass, selectedFeats]);

    const filteredFeats = useMemo(() => {
        if (!allFeats) return [];
        const term = searchTerm.trim().toLowerCase();
        if (!term) return allFeats;
        return allFeats.filter((feat) =>
            feat.name.toLowerCase().includes(term) ||
            (feat.description ?? "").toLowerCase().includes(term)
        );
    }, [searchTerm, allFeats]);

    const toggleFeat = (feat: Feat) => {
        if (lockedFeatIds.includes(feat.id)) return;
        if (selectedFeats.some((selected) => selected.id === feat.id)) {
            onFeatsChange(selectedFeats.filter((selected) => selected.id !== feat.id));
            return;
        }
        if (remaining <= 0) return;
        onFeatsChange([...selectedFeats, feat]);
    };

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
                <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h2 className="text-white text-3xl font-bold mb-2 font-serif">Select Feats</h2>
                <p className="text-gray-400">
                    Level {level} grants {budget} feat{budget === 1 ? "" : "s"}. Any feat may be taken.
                </p>
            </div>

            {/* Feat budget */}
            <div className="mb-6">
                <SlotCard
                    label="Feats"
                    used={spent}
                    total={budget}
                    note={budget > 1 ? "Human — a second feat at level 1" : "One at level 1"}
                />
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search feats by name or benefit..."
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
                />
            </div>

            <div className="max-h-[520px] overflow-y-auto pr-2 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredFeats.map((feat) => {
                        const isSelected = selectedFeats.some((selected) => selected.id === feat.id);
                        const isLocked = lockedFeatIds.includes(feat.id);
                        const reasons = unmetPrerequisites(feat, context);
                        const blocked = reasons.filter((reason) => !reason.advisory);
                        const advisory = reasons.filter((reason) => reason.advisory);
                        const noSlot = !isSelected && remaining <= 0;
                        const unavailable = blocked.length > 0 || noSlot;
                        const points = flexibleAbilityAmount(feat);

                        return (
                            <button
                                key={feat.id}
                                onClick={() => toggleFeat(feat)}
                                disabled={isLocked || unavailable}
                                title={blocked.map((reason) => reason.text).join(" · ")}
                                className={`text-left p-3 border rounded-lg transition-all ${isSelected
                                    ? "border-amber-500 bg-amber-900/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                    : unavailable
                                        ? "border-zinc-800/60 bg-zinc-900/20 opacity-50 cursor-not-allowed"
                                        : "border-zinc-800 bg-zinc-900/40 hover:border-amber-500/50 hover:bg-zinc-800"
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <h4 className={`font-semibold font-serif ${isSelected ? "text-amber-400" : "text-gray-200"}`}>
                                        {feat.name}
                                    </h4>
                                    <div className="flex flex-wrap gap-1 justify-end shrink-0">
                                        {isLocked && (
                                            <Badge tone="amber">
                                                <Lock className="w-3 h-3 inline mr-0.5 -mt-0.5" />Background
                                            </Badge>
                                        )}
                                        {points > 0 && <Badge tone="emerald">+{points} ability</Badge>}
                                        <Badge tone="zinc">{feat.source}</Badge>
                                    </div>
                                </div>

                                {(blocked.length > 0 || advisory.length > 0 || noSlot) && (
                                    <div className="flex flex-wrap gap-1 mb-1">
                                        {blocked.map((reason) => (
                                            <Badge key={reason.text} tone="red">{reason.text}</Badge>
                                        ))}
                                        {advisory.map((reason) => (
                                            <Badge key={reason.text} tone="sky">{reason.text}</Badge>
                                        ))}
                                        {noSlot && blocked.length === 0 && <Badge tone="zinc">No feats left</Badge>}
                                    </div>
                                )}

                                <p className="text-sm text-gray-400 line-clamp-2">{feat.description}</p>

                                {points > 0 && (
                                    <p className="text-xs text-emerald-400/80 mt-1">
                                        Raises {flexibleAbilityOptions(feat).map((option) => ABILITY_SHORT[option]).join(" / ")} — assign it in Ability Scores.
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>

                {filteredFeats.length === 0 && (
                    <p className="text-center text-gray-500 py-10">No feats match “{searchTerm}”.</p>
                )}
            </div>
        </div>
    );
}

function SlotCard({ label, used, total, note }: { label: string; used: number; total: number; note: string }) {
    const full = used >= total;
    return (
        <div className={`rounded-xl border p-4 ${total === 0 ? "border-zinc-800 bg-zinc-900/20" : full ? "border-emerald-700/50 bg-emerald-950/20" : "border-amber-700/50 bg-amber-950/20"}`}>
            <div className="flex items-baseline justify-between">
                <span className="font-semibold text-gray-200">{label}</span>
                <span className={`font-bold ${total === 0 ? "text-gray-600" : full ? "text-emerald-400" : "text-amber-400"}`}>
                    {used} / {total}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{note}</p>
        </div>
    );
}

function Badge({ tone, children }: { tone: "amber" | "red" | "zinc" | "emerald" | "sky"; children: React.ReactNode }) {
    const tones = {
        amber: "bg-amber-950 text-amber-300 border-amber-700",
        red: "bg-red-950 text-red-300 border-red-800",
        zinc: "bg-zinc-800 text-gray-400 border-zinc-700",
        emerald: "bg-emerald-950 text-emerald-300 border-emerald-800",
        sky: "bg-sky-950 text-sky-300 border-sky-800",
    };
    return <span className={`text-xs px-2 py-1 rounded border whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}
