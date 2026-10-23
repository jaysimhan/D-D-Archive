import { Loader2 } from "lucide-react";
import type { CharacterRuleset, Feat } from "../../types/dnd-types";
import { useFeats } from "../../hooks/useSanityData";
import { featsForSpecies } from "../../utils/feats";
import { ClampedText } from "../ui/clamped-text";

/**
 * A 2024 Human's Versatile trait: one Origin feat at level 1. Origin feats
 * carry no ability increase, so picking one is the whole choice.
 */
export function OriginFeatPicker({
    ruleset,
    selected,
    takenElsewhere,
    onChange,
}: {
    ruleset: CharacterRuleset;
    selected?: Feat;
    /** Feats the background already grants; an Origin feat can't be taken twice. */
    takenElsewhere: string[];
    onChange: (feat: Feat | undefined) => void;
}) {
    const { data: allFeats, loading } = useFeats(ruleset);
    const options = featsForSpecies(allFeats ?? []);
    const taken = new Set(takenElsewhere.map((name) => name.toLowerCase()));

    return (
        <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-3">
            <h4 className="font-bold text-amber-300">Versatile — Origin Feat</h4>
            <p className="text-xs text-gray-400 mb-3">
                Humans gain an Origin feat of their choice. You can't continue until you pick one.
            </p>
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            ) : (
                <div className="grid gap-2">
                    {options.map((feat) => {
                        const active = selected?.id === feat.id;
                        const duplicate = !active && taken.has(feat.name.toLowerCase());
                        return (
                            <button
                                key={feat.id}
                                type="button"
                                disabled={duplicate}
                                aria-pressed={active}
                                onClick={() => onChange(active ? undefined : feat)}
                                className={`text-left p-2 rounded-md border transition-colors ${active
                                    ? "border-amber-500 bg-amber-900/40"
                                    : duplicate
                                        ? "border-zinc-800 opacity-50 cursor-not-allowed"
                                        : "border-zinc-800 bg-zinc-900/40 hover:border-amber-500/50"
                                }`}
                            >
                                <span className={`font-serif text-sm font-semibold ${active ? "text-amber-300" : "text-gray-200"}`}>
                                    {feat.name}
                                </span>
                                {duplicate && <span className="ml-2 text-xs text-gray-500">From your background</span>}
                                <ClampedText text={feat.description} className="text-xs text-gray-400 mt-0.5" />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
