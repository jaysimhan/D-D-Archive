import { ChevronDown, ChevronUp, Book } from "lucide-react";
import { useState } from "react";
import { Feat } from "../types/dnd-types";

interface FeatCardProps {
    feat: Feat;
}

export function FeatCard({ feat }: FeatCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
            <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex-1">
                    <h3 className="text-gray-100 font-semibold text-lg flex items-center gap-2 font-serif">
                        <Book className="w-5 h-5 text-amber-500" />
                        {feat.name}
                    </h3>
                    <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full border ${feat.source === "Official" ? "bg-green-900/50 text-green-300 border-green-700" : "bg-yellow-900/50 text-yellow-300 border-yellow-700"
                            }`}>
                            {feat.source}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700">
                            {feat.edition} Edition
                        </span>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-gray-300">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            <div className={`mt-4 space-y-4 ${isExpanded ? "block" : "hidden"}`}>
                <div className="text-gray-300 text-sm">
                    <p>{feat.description}</p>
                </div>

                {/* Prerequisites */}
                {feat.prerequisites && (
                    <div className="bg-zinc-800/50 p-3 rounded-md text-sm border border-zinc-700">
                        <span className="font-semibold text-gray-200">Prerequisites: </span>
                        <ul className="list-disc list-inside mt-1 text-gray-400">
                            {feat.prerequisites.level && <li>Level {feat.prerequisites.level}</li>}
                            {feat.prerequisites.abilityScore && Object.entries(feat.prerequisites.abilityScore).map(([ability, score]) => (
                                <li key={ability}>{ability} {score} or higher</li>
                            ))}
                            {feat.prerequisites.race && <li>Race: {feat.prerequisites.race.join(", ")}</li>}
                            {feat.prerequisites.class && <li>Class: {feat.prerequisites.class.join(", ")}</li>}
                        </ul>
                        {(!feat.prerequisites.level && !feat.prerequisites.abilityScore && !feat.prerequisites.race && !feat.prerequisites.class) && (
                            <span className="text-gray-500 italic">None</span>
                        )}
                    </div>
                )}

                {/* Benefits */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-200 border-b border-zinc-700 pb-1">Benefits</h4>

                    {feat.benefits.abilityScoreIncrease && (
                        <div className="text-sm">
                            <span className="font-medium text-brand-400">Ability Score Increase: </span>
                            {Object.entries(feat.benefits.abilityScoreIncrease).map(([ability, amount]) => (
                                <span key={ability} className="ml-1 text-gray-300">
                                    {ability} +{amount}
                                </span>
                            ))}
                        </div>
                    )}

                    {feat.benefits.features && feat.benefits.features.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                            {feat.benefits.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    )}

                    {feat.benefits.spells && feat.benefits.spells.length > 0 && (
                        <div className="text-sm">
                            <span className="font-medium text-brand-400">Spells: </span>
                            <span className="text-gray-400">{feat.benefits.spells.join(", ")}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Short Description when collapsed */}
            {!isExpanded && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {feat.description}
                </p>
            )}
        </div>
    );
}
