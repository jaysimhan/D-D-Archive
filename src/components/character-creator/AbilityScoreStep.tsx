import { AbilityScores, Race, Feat, Subrace } from "../../types/dnd-types";

// Ability Score Step
export function AbilityScoreStep({
    scores,
    race,
    subrace, // Added subrace to props
    feats,
    onScoresChange,
}: {
    scores: AbilityScores;
    race?: Race;
    subrace?: Subrace;
    feats?: Feat[];
    onScoresChange: (scores: AbilityScores) => void;
}) {
    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-gray-900 text-2xl font-bold mb-2">Assign Ability Scores</h2>
                <p className="text-gray-600">Enter ability scores (0-20)</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(["STR", "DEX", "CON", "INT", "WIS", "CHA"] as (keyof AbilityScores)[]).map((ability) => {
                    // Calculate Racial Bonus (base race + subrace)
                    const racialBonus = (race?.abilityScoreIncrease[ability] || 0) + (subrace?.abilityScoreIncrease[ability] || 0);

                    // Calculate Feat Bonus
                    let featBonus = 0;
                    feats?.forEach(feat => {
                        if (feat.benefits?.abilityScoreIncrease?.[ability]) {
                            featBonus += feat.benefits.abilityScoreIncrease[ability] || 0;
                        }
                    });

                    const totalScore = scores[ability] + racialBonus + featBonus;
                    return (
                        <div key={ability} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                            <label className="block text-gray-700 font-semibold mb-2">{ability}</label>
                            <input
                                type="number"
                                min="0"
                                max="20"
                                value={scores[ability] || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const intVal = parseInt(val);
                                    onScoresChange({
                                        ...scores,
                                        [ability]: val === "" ? 0 : isNaN(intVal) ? 0 : Math.max(0, Math.min(20, intVal)),
                                    })
                                }}
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center font-semibold"
                            />
                            {racialBonus > 0 && (
                                <p className="text-xs text-green-600 mt-1 font-medium">
                                    +{racialBonus} racial
                                </p>
                            )}
                            {featBonus > 0 && (
                                <p className="text-xs text-amber-600 mt-0.5 font-medium">
                                    +{featBonus} feat
                                </p>
                            )}
                            <div className="mt-1 pt-1 border-t border-gray-200 text-center">
                                <span className="font-bold text-gray-900">= {totalScore}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
