import { useState, useEffect, useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import { AbilityScores, Race, Feat, Subrace } from "../../types/dnd-types";

type AbilityKey = keyof AbilityScores;

const ABILITY_NAMES: Record<AbilityKey, string> = {
    STR: "Strength",
    DEX: "Dexterity",
    CON: "Constitution",
    INT: "Intelligence",
    WIS: "Wisdom",
    CHA: "Charisma",
};

// Calculate ability score modifier
function getModifier(score: number): string {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

interface RacialBonusAllocation {
    [key: string]: number; // e.g. { STR: 2, DEX: 1 } for +2/+1 distribution
}

// Ability Score Step with redesigned layout
export function AbilityScoreStep({
    scores,
    race,
    subrace,
    feats,
    onScoresChange,
    racialBonusAllocation,
    onRacialBonusChange,
}: {
    scores: AbilityScores;
    race?: Race;
    subrace?: Subrace;
    feats?: Feat[];
    onScoresChange: (scores: AbilityScores) => void;
    racialBonusAllocation?: RacialBonusAllocation;
    onRacialBonusChange?: (allocation: RacialBonusAllocation) => void;
}) {
    const abilities: AbilityKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

    // Check if race uses flexible ability scores
    // Exception: Human (Standard) should be fixed +1 all, so we disable flexibility for them
    const isHuman = race?.name === "Human";
    const isFlexible = race?.flexibleAbilityScores === true && !isHuman;

    // --- Matrix Logic State ---
    // We track which ability is assigned to which column (0, 1, 2)
    // assignments[colIndex] = AbilityKey | null
    const [assignments, setAssignments] = useState<(AbilityKey | null)[]>([null, null, null]);

    // Calculate derived allocation for parent
    const localAllocation: RacialBonusAllocation = useMemo(() => {
        const alloc: RacialBonusAllocation = {};
        assignments.forEach(ability => {
            if (ability) {
                alloc[ability] = (alloc[ability] || 0) + 1;
            }
        });
        return alloc;
    }, [assignments]);

    // Initialize from props (Hydration)
    useEffect(() => {
        if (racialBonusAllocation && isFlexible) {
            // Check if current internal state already matches the prop allocation
            // This prevents "defragging" the dots (e.g. 101 -> 110) while the user is interacting
            const currentAllocIsMatch = Object.entries(racialBonusAllocation).every(([key, val]) => {
                return (localAllocation[key] || 0) === val;
            });
            // Also need to check if we have extra keys in local not in props (rare if synced, but good for safety)
            const localHasExtra = Object.keys(localAllocation).some(key => !racialBonusAllocation[key]);

            if (currentAllocIsMatch && !localHasExtra) {
                return;
            }

            const newAssignments: (AbilityKey | null)[] = [null, null, null];
            let colIndex = 0;

            // Greedy fill: For each ability, assign as many columns as it has bonus points
            Object.entries(racialBonusAllocation).forEach(([ability, bonus]) => {
                for (let i = 0; i < bonus && colIndex < 3; i++) {
                    newAssignments[colIndex] = ability as AbilityKey;
                    colIndex++;
                }
            });
            setAssignments(newAssignments);
        }
    }, [racialBonusAllocation, isFlexible, localAllocation]);



    // Sync to parent when assignments change
    const updateParent = (newAssignments: (AbilityKey | null)[]) => {
        const alloc: RacialBonusAllocation = {};
        newAssignments.forEach(ability => {
            if (ability) {
                alloc[ability] = (alloc[ability] || 0) + 1;
            }
        });
        onRacialBonusChange?.(alloc);
    };

    // Calculate total allocated points
    const totalAllocated = assignments.filter(a => a !== null).length;
    const maxPoints = 3;
    const remainingPoints = maxPoints - totalAllocated;

    // Get racial bonus for an ability
    const getRacialBonus = (ability: AbilityKey): number => {
        if (isFlexible) {
            return localAllocation[ability] || 0;
        }
        // Fixed racial bonuses
        return (race?.abilityScoreIncrease[ability] || 0) +
            (subrace?.abilityScoreIncrease[ability] || 0);
    };

    // Get feat bonus for an ability
    const getFeatBonus = (ability: AbilityKey): number => {
        let bonus = 0;
        feats?.forEach(feat => {
            if (feat.benefits?.abilityScoreIncrease?.[ability]) {
                bonus += feat.benefits.abilityScoreIncrease[ability] || 0;
            }
        });
        return bonus;
    };

    // Handle Matrix Toggle
    const handleToggle = (ability: AbilityKey, colIndex: number) => {
        if (!isFlexible) return;

        const currentOwner = assignments[colIndex];
        const newAssignments = [...assignments];

        // Case 1: Deselect (Clicking your own dot)
        if (currentOwner === ability) {
            newAssignments[colIndex] = null;
            setAssignments(newAssignments);
            updateParent(newAssignments);
            return;
        }

        // Case 2: Select (Clicking empty or other's dot)
        // Constraint: One row can max of 2 dots
        const currentRowCount = newAssignments.filter(a => a === ability).length;
        if (currentRowCount >= 2) {
            // Block if trying to add 3rd dot to same row
            return;
        }

        // Action: Assign column to this ability (Steals from other if occupied - "One column can only get one dot")
        newAssignments[colIndex] = ability;
        setAssignments(newAssignments);
        updateParent(newAssignments);
    };

    // Handle score increment/decrement
    const adjustScore = (ability: AbilityKey, delta: number) => {
        const currentScore = scores[ability];
        const newScore = Math.max(1, Math.min(20, currentScore + delta));
        onScoresChange({
            ...scores,
            [ability]: newScore,
        });
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-1 font-serif">Ability Scores</h2>
                <p className="text-gray-400">Assign the 6 Ability Scores.</p>
                {isFlexible && (
                    <div className="mt-2 text-sm text-brand-300 bg-brand-950/50 p-3 rounded-md border border-brand-800">
                        <p className="font-bold">🎲 Flexible Race Rules:</p>
                        <ul className="list-disc list-inside ml-2 text-gray-400">
                            <li>Distribute 3 distinct points (Columns).</li>
                            <li>Each point can be assigned to only one ability.</li>
                            <li>Max +2 points per ability.</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-[150px_1fr_140px_100px_120px] gap-2 items-center mb-2 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <div></div>
                <div className="text-center">Brut Score</div>
                <div className="text-center">Racial Bonus</div>
                <div className="text-center">Feat Bonus</div>
                <div className="text-center">Final Score</div>
            </div>

            {/* Ability Rows */}
            <div className="space-y-2">
                {abilities.map((ability) => {
                    const baseScore = scores[ability];
                    const racialBonus = getRacialBonus(ability);
                    const featBonus = getFeatBonus(ability);
                    const finalScore = baseScore + racialBonus + featBonus;

                    return (
                        <div
                            key={ability}
                            className="grid grid-cols-[150px_1fr_140px_100px_120px] gap-2 items-center py-4 px-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-brand-800 hover:shadow-sm transition-all"
                        >
                            {/* Ability Name */}
                            <div className="font-bold text-gray-200 text-lg font-serif">
                                {ABILITY_NAMES[ability]}
                            </div>

                            {/* Base Score with +/- buttons */}
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => adjustScore(ability, -1)}
                                    disabled={baseScore <= 1}
                                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-gray-400 rounded-lg hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="w-12 text-center font-bold text-xl text-white">
                                    {baseScore}
                                </div>
                                <button
                                    onClick={() => adjustScore(ability, 1)}
                                    disabled={baseScore >= 20}
                                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-gray-400 rounded-lg hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Racial Bonus Matrix */}
                            <div className="flex items-center justify-center gap-2 w-full">
                                {[0, 1, 2].map((colIndex) => {
                                    // Status for this cell
                                    const assignedToSelf = assignments[colIndex] === ability;
                                    const assignedToOther = assignments[colIndex] !== null && !assignedToSelf;
                                    const isClickable = isFlexible;

                                    // Row Cap Check: If we select this, do we exceed 2?
                                    // Only relevant if we are toggling ON (currently not self)
                                    const rowCount = assignments.filter(a => a === ability).length;
                                    const isRowCapReached = rowCount >= 2;
                                    const disabled = isFlexible && !assignedToSelf && isRowCapReached;

                                    return (
                                        <button
                                            key={colIndex}
                                            onClick={() => handleToggle(ability, colIndex)}
                                            disabled={!isClickable || disabled}
                                            className={`
                                                w-7 h-7 rounded-full border-[1.5px] transition-all flex items-center justify-center
                                                ${assignedToSelf
                                                    ? (isHuman ? 'border-gray-500 bg-zinc-800' : 'border-brand-500 bg-brand-950')
                                                    : 'border-zinc-600 hover:border-zinc-500'
                                                }
                                                ${isClickable && !disabled
                                                    ? 'cursor-pointer hover:border-brand-400'
                                                    : ''
                                                }
                                                ${(!isClickable || disabled) ? 'cursor-default opacity-40' : ''}
                                            `}
                                            title={disabled ? "Max +2 per ability" : `Assign Point ${colIndex + 1}`}
                                        >
                                            {/* Inner Dot */}
                                            {assignedToSelf && (
                                                <div className={`w-3.5 h-3.5 rounded-full ${isHuman ? 'bg-gray-500' : 'bg-brand-500'}`} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feat Bonus */}
                            <div className="text-center font-medium text-gray-400">
                                {featBonus > 0 ? `+${featBonus}` : '-'}
                            </div>

                            {/* Final Score with Modifier */}
                            <div className="text-center">
                                <span className="font-bold text-2xl text-white">
                                    {finalScore}
                                </span>
                                <span className="text-xl text-gray-500 ml-1">
                                    ({getModifier(finalScore)})
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Feat bonuses summary if any */}
            {feats && feats.some(f => f.benefits?.abilityScoreIncrease) && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-sm text-amber-400">
                        ✨ Feat bonuses are included in final scores
                    </p>
                </div>
            )}
        </div>
    );
}
