import { ChevronDown, ChevronUp, Book } from "lucide-react";
import { useState } from "react";
import { Feat } from "../types/dnd-types";

interface FeatCardProps {
    feat: Feat;
}

export function FeatCard({ feat }: FeatCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
            <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex-1">
                    <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                        <Book className="w-5 h-5 text-amber-600" />
                        {feat.name}
                    </h3>
                    <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${feat.source === "Official" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {feat.source}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                            {feat.edition} Edition
                        </span>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            <div className={`mt-4 space-y-4 ${isExpanded ? "block" : "hidden"}`}>
                <div className="text-gray-700 text-sm">
                    <p>{feat.description}</p>
                </div>

                {/* Prerequisites */}
                {feat.prerequisites && (
                    <div className="bg-gray-50 p-3 rounded-md text-sm">
                        <span className="font-semibold text-gray-900">Prerequisites: </span>
                        <ul className="list-disc list-inside mt-1 text-gray-600">
                            {feat.prerequisites.level && <li>Level {feat.prerequisites.level}</li>}
                            {feat.prerequisites.abilityScore && Object.entries(feat.prerequisites.abilityScore).map(([ability, score]) => (
                                <li key={ability}>{ability} {score} or higher</li>
                            ))}
                            {feat.prerequisites.race && <li>Race: {feat.prerequisites.race.join(", ")}</li>}
                            {feat.prerequisites.class && <li>Class: {feat.prerequisites.class.join(", ")}</li>}
                        </ul>
                        {/* If no prerequisites explicitly listed above but object exists and is empty/undefined, show None or nothing? 
                Actually, the object might be sparse. If completely empty, we might show "None". 
             */}
                        {(!feat.prerequisites.level && !feat.prerequisites.abilityScore && !feat.prerequisites.race && !feat.prerequisites.class) && (
                            <span className="text-gray-500 italic">None</span>
                        )}
                    </div>
                )}

                {/* Benefits */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-900 border-b pb-1">Benefits</h4>

                    {feat.benefits.abilityScoreIncrease && (
                        <div className="text-sm">
                            <span className="font-medium text-indigo-700">Ability Score Increase: </span>
                            {Object.entries(feat.benefits.abilityScoreIncrease).map(([ability, amount]) => (
                                <span key={ability} className="ml-1">
                                    {ability} +{amount}
                                </span>
                            ))}
                        </div>
                    )}

                    {feat.benefits.features && feat.benefits.features.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {feat.benefits.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                        </ul>
                    )}

                    {feat.benefits.spells && feat.benefits.spells.length > 0 && (
                        <div className="text-sm">
                            <span className="font-medium text-purple-700">Spells: </span>
                            <span className="text-gray-600">{feat.benefits.spells.join(", ")}</span>
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
