import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { Feat } from "../../types/dnd-types";
import { FEATS } from "../../data/comprehensive-library";

// Feat Selection Step
export function FeatSelectionStep({
    selectedFeats,
    onFeatsChange,
}: {
    selectedFeats: Feat[];
    onFeatsChange: (feats: Feat[]) => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFeats = useMemo(() => {
        return FEATS.filter((feat) =>
            feat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const toggleFeat = (feat: Feat) => {
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
        <div>
            <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <h2 className="text-gray-900 text-2xl font-bold mb-2">Select Feats</h2>
                <p className="text-gray-600">Choose feats to customize your character's abilities</p>
                <p className="text-sm text-gray-500 mt-2">
                    (Optional) Select feats granted by your Race, Background, or Class Level.
                </p>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search feats..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2">
                {filteredFeats.map((feat) => {
                    const isSelected = selectedFeats.find((f) => f.id === feat.id);
                    return (
                        <button
                            key={feat.id}
                            onClick={() => toggleFeat(feat)}
                            className={`text-left p-3 border-2 rounded-lg transition-all ${isSelected
                                ? "border-amber-600 bg-amber-50 shadow-md"
                                : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-gray-900 font-semibold">{feat.name}</h4>
                                <div className="flex gap-1">
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                        {feat.source}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{feat.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
