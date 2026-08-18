import { useState, useMemo } from "react";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { CharacterRuleset, Class, Feat, Subclass } from "../../types/dnd-types";
import { useFeats } from "../../hooks/useSanityData";

// Feat Selection Step
export function FeatSelectionStep({
    selectedFeats,
    ruleset,
    onFeatsChange,
    lockedFeatIds = [],
    classData,
    subclass,
}: {
    selectedFeats: Feat[];
    ruleset: CharacterRuleset;
    onFeatsChange: (feats: Feat[]) => void;
    lockedFeatIds?: string[];
    classData?: Class;
    subclass?: Subclass;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const { data: allFeats, loading } = useFeats(ruleset);

    const filteredFeats = useMemo(() => {
        if (!allFeats) return [];
        return allFeats.filter((feat) =>
            feat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allFeats]);

    const toggleFeat = (feat: Feat) => {
        if (lockedFeatIds.includes(feat.id)) return;
        if (selectedFeats.find((f) => f.id === feat.id)) {
            onFeatsChange(selectedFeats.filter((f) => f.id !== feat.id));
        } else {
            // Limit to 1 feat
            if (selectedFeats.length >= 1) {
                // Replace existing
                onFeatsChange([feat]);
            } else {
                onFeatsChange([...selectedFeats, feat]);
            }
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <h2 className="text-white text-3xl font-bold mb-2 font-serif">Select Feats</h2>
                <p className="text-gray-400">Choose feats to customize your character's abilities</p>
                <p className="text-sm text-gray-500 mt-2">
                    (Optional) Select feats granted by your Race, Background, or Class Level.
                </p>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search feats..."
                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2">
                {filteredFeats.map((feat) => {
                    const isSelected = selectedFeats.find((f) => f.id === feat.id);
                    const isLocked = lockedFeatIds.includes(feat.id);
                    const requiresSpellcasting = feat.name === "Metamagic Adept";
                    const hasSpellcasting = Boolean(
                        classData?.isSpellcaster ||
                        (classData?.spellcaster && !["none", "None"].includes(classData.spellcaster)) ||
                        subclass?.isSpellcaster || subclass?.spellcaster,
                    );
                    const unavailable = requiresSpellcasting && !hasSpellcasting;
                    return (
                        <button
                            key={feat.id}
                            onClick={() => toggleFeat(feat)}
                            disabled={isLocked || unavailable}
                            className={`text-left p-3 border rounded-lg transition-all ${isSelected
                                ? "border-amber-500 bg-amber-900/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                : "border-zinc-800 bg-zinc-900/40 hover:border-amber-500/50 hover:bg-zinc-800"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`font-semibold font-serif ${isSelected ? 'text-amber-400' : 'text-gray-200'}`}>{feat.name}</h4>
                                <div className="flex gap-1">
                                    {isLocked && <span className="text-xs px-2 py-1 bg-amber-950 text-amber-300 rounded border border-amber-700">Background</span>}
                                    {unavailable && <span className="text-xs px-2 py-1 bg-red-950 text-red-300 rounded border border-red-800">Requires Spellcasting</span>}
                                    <span className="text-xs px-2 py-1 bg-zinc-800 text-gray-400 rounded border border-zinc-700">
                                        {feat.source}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 line-clamp-2">{feat.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
