import { useState, useEffect, useMemo } from "react";
import { Dices, Minus, Plus, RotateCcw } from "lucide-react";
import { AbilityScores, Race, Feat, Subrace, Background, CharacterRuleset } from "../../types/dnd-types";
import {
    ABILITY_SCORE_METHODS,
    AbilityScoreMethod,
    MANUAL_MAX,
    MANUAL_MIN,
    POINT_BUY_BUDGET,
    pointBuyCost,
    ScoreAssignment,
    scoresFromAssignment,
    STANDARD_ARRAY,
} from "../../utils/ability-scores";
import { onStatRollResult, requestStatRoll } from "../../lib/stat-roll-bridge";
import { featAbilityBonuses } from "../../utils/feats";

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

/** Everything about how the base scores were generated, changed together. */
export interface ScoreGeneration {
    abilityScoreMethod?: AbilityScoreMethod;
    rolledAbilityScores?: number[];
    abilityScoreAssignment?: ScoreAssignment;
    abilityScores?: AbilityScores;
}

// Ability Score Step with redesigned layout
export function AbilityScoreStep({
    scores,
    ruleset,
    background,
    race,
    subrace,
    feats,
    onScoresChange,
    racialBonusAllocation,
    onRacialBonusChange,
    featAbilityChoices,
    method = "pointBuy",
    rolledScores,
    assignment = {},
    onGenerationChange,
}: {
    scores: AbilityScores;
    ruleset?: CharacterRuleset;
    background?: Background;
    race?: Race;
    subrace?: Subrace;
    feats?: Feat[];
    onScoresChange: (scores: AbilityScores) => void;
    racialBonusAllocation?: RacialBonusAllocation;
    onRacialBonusChange?: (allocation: RacialBonusAllocation) => void;
    /** Placed in the Feats step; only read here so the final score counts them. */
    featAbilityChoices?: Record<string, Partial<AbilityScores>>;
    method?: AbilityScoreMethod;
    rolledScores?: number[];
    assignment?: ScoreAssignment;
    onGenerationChange: (patch: ScoreGeneration) => void;
}) {
    const abilities: AbilityKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

    // --- Score generation ---
    // Standard array and rolled scores both hand out a fixed pool of six
    // numbers, one per ability; the pool is all that differs between them.
    const pool = method === "standard" ? STANDARD_ARRAY : method === "rolled" ? rolledScores ?? [] : [];
    const usesPool = method === "standard" || method === "rolled";

    // Rolled totals arrive from the dice roller. Each ability keeps its slot in
    // the array, so rerolling one line in the roller only changes that score.
    useEffect(() => {
        if (method !== "rolled") return;
        return onStatRollResult((totals) => onGenerationChange({
            rolledAbilityScores: totals,
            abilityScores: scoresFromAssignment(totals, assignment),
        }));
    }, [method, assignment, onGenerationChange]);

    const changeMethod = (next: AbilityScoreMethod) => {
        if (next === method) return;
        if (next === "pointBuy") {
            onGenerationChange({
                abilityScoreMethod: next,
                abilityScoreAssignment: undefined,
                abilityScores: { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 },
            });
        } else if (next === "manual") {
            const clamped = { ...scores };
            for (const ability of abilities) {
                clamped[ability] = Math.max(MANUAL_MIN, Math.min(MANUAL_MAX, clamped[ability]));
            }
            onGenerationChange({ abilityScoreMethod: next, abilityScoreAssignment: undefined, abilityScores: clamped });
        } else {
            const nextPool = next === "standard" ? STANDARD_ARRAY : rolledScores ?? [];
            onGenerationChange({
                abilityScoreMethod: next,
                abilityScoreAssignment: {},
                abilityScores: scoresFromAssignment(nextPool, {}),
            });
            if (next === "rolled") requestStatRoll({ roll: false });
        }
    };

    /** Gives an ability a pool entry; the ability holding it takes this one's old entry. */
    const assignFromPool = (ability: AbilityKey, index: number | undefined) => {
        const next: ScoreAssignment = { ...assignment };
        const previous = next[ability];
        const holder = abilities.find((other) => other !== ability && next[other] === index);
        if (index === undefined) delete next[ability];
        else next[ability] = index;
        if (holder) {
            if (previous === undefined) delete next[holder];
            else next[holder] = previous;
        }
        onGenerationChange({ abilityScoreAssignment: next, abilityScores: scoresFromAssignment(pool, next) });
    };

    const setManualScore = (ability: AbilityKey, value: number) => {
        if (Number.isNaN(value)) return;
        onScoresChange({ ...scores, [ability]: Math.max(MANUAL_MIN, Math.min(MANUAL_MAX, Math.round(value))) });
    };

    // Check if race uses flexible ability scores
    // Exception: Human (Standard) should be fixed +1 all, so we disable flexibility for them
    const isHuman = race?.name === "Human";
    const isFlexible = ruleset === "2024" || (race?.flexibleAbilityScores === true && !isHuman);
    const allowedAbilities = ruleset === "2024" && background?.abilityScoreOptions?.length ? background.abilityScoreOptions : abilities;

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

    // Feat increases are placed in the Feats step; they still count here.
    const featAllocations = featAbilityChoices ?? {};



    // Calculate total allocated points
    const totalAllocated = assignments.filter(a => a !== null).length;

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
    const featBonuses = useMemo(
        () => featAbilityBonuses(feats ?? [], featAllocations),
        [feats, featAllocations],
    );
    const getFeatBonus = (ability: AbilityKey): number => featBonuses[ability];

    // Handle Matrix Toggle
    const handleToggle = (ability: AbilityKey, colIndex: number) => {
        if (!isFlexible || !allowedAbilities.includes(ability)) return;

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

        // Action: Assign column to this ability (Steals from other if occupied)
        newAssignments[colIndex] = ability;
        setAssignments(newAssignments);
        updateParent(newAssignments);
    };

    // Handle score increment/decrement
    const adjustScore = (ability: AbilityKey, delta: number) => {
        const currentScore = scores[ability];
        const candidate = Math.max(8, Math.min(15, currentScore + delta));
        const nextScores = { ...scores, [ability]: candidate };
        if (pointBuyCost(nextScores) > POINT_BUY_BUDGET) return;
        onScoresChange({
            ...nextScores,
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-1 font-serif">Ability Scores</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3">
                    <label htmlFor="ability-method" className="text-sm font-medium text-gray-300">Method</label>
                    <select
                        id="ability-method"
                        value={method}
                        onChange={(event) => changeMethod(event.target.value as AbilityScoreMethod)}
                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                        {ABILITY_SCORE_METHODS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <p className="text-sm text-gray-400">
                        {ABILITY_SCORE_METHODS.find((option) => option.value === method)?.description}
                    </p>
                </div>
                {method === "pointBuy" && (
                    <p className="mt-2 text-sm font-semibold text-brand-300">
                        {POINT_BUY_BUDGET - pointBuyCost(scores)} points remaining
                    </p>
                )}
                {usesPool && (
                    <p className="mt-2 text-sm font-semibold text-brand-300">
                        {abilities.filter((ability) => pool[assignment[ability] ?? -1] !== undefined).length} of 6 assigned
                    </p>
                )}
                {method === "rolled" && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                        {rolledScores?.length ? (
                            <>
                                <span className="text-gray-400">Rolled:</span>
                                {rolledScores.map((total, index) => (
                                    <span key={index} className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-white font-semibold">{total}</span>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => requestStatRoll({ roll: true })}
                                    className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-700 text-brand-300 hover:bg-brand-950 transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" /> Reroll
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-400">Roll the stat array in the dice roller, then assign the totals below.</span>
                                <button
                                    type="button"
                                    onClick={() => requestStatRoll({ roll: false })}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-700 text-brand-300 hover:bg-brand-950 transition-colors"
                                >
                                    <Dices className="w-3.5 h-3.5" /> Open dice roller
                                </button>
                            </>
                        )}
                    </div>
                )}
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
            <div className="grid grid-cols-[150px_1fr_140px_120px] gap-2 items-center mb-2 px-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
                <div></div>
                <div className="text-center">Base Score</div>
                <div className="text-center">{ruleset === "2024" ? "Background Bonus" : "Racial Bonus"}</div>
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
                            className="grid grid-cols-[150px_1fr_140px_120px] gap-2 items-center py-4 px-4 bg-zinc-900/60 border border-zinc-800 rounded-xl hover:border-brand-800 hover:shadow-sm transition-all"
                        >
                            {/* Ability Name */}
                            <div className="font-bold text-gray-200 text-lg font-serif">
                                {ABILITY_NAMES[ability]}
                            </div>

                            {/* Base Score: a pool dropdown, a typed number, or point-buy steppers */}
                            {usesPool ? (
                                <div className="flex items-center justify-center">
                                    <select
                                        aria-label={`${ABILITY_NAMES[ability]} score`}
                                        value={assignment[ability] ?? ""}
                                        disabled={pool.length === 0}
                                        onChange={(event) => assignFromPool(
                                            ability,
                                            event.target.value === "" ? undefined : Number(event.target.value),
                                        )}
                                        className="w-28 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-lg font-bold text-center disabled:opacity-50"
                                    >
                                        <option value="">—</option>
                                        {pool.map((value, index) => {
                                            const holder = abilities.find((other) => other !== ability && assignment[other] === index);
                                            return (
                                                <option key={index} value={index}>
                                                    {value}{holder ? ` (${holder})` : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            ) : method === "manual" ? (
                                <div className="flex items-center justify-center">
                                    <input
                                        type="number"
                                        aria-label={`${ABILITY_NAMES[ability]} score`}
                                        min={MANUAL_MIN}
                                        max={MANUAL_MAX}
                                        value={baseScore}
                                        onChange={(event) => setManualScore(ability, event.target.valueAsNumber)}
                                        className="w-20 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-white text-lg font-bold text-center"
                                    />
                                </div>
                            ) : (
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    onClick={() => adjustScore(ability, -1)}
                                    disabled={baseScore <= 8}
                                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-gray-400 rounded-lg hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <div className="w-12 text-center font-bold text-xl text-white">
                                    {baseScore}
                                </div>
                                <button
                                    onClick={() => adjustScore(ability, 1)}
                                    disabled={baseScore >= 15 || pointBuyCost({ ...scores, [ability]: baseScore + 1 }) > POINT_BUY_BUDGET}
                                    className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-gray-400 rounded-lg hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            )}

                            {/* Racial Bonus Matrix */}
                            <div className="flex items-center justify-center gap-2 w-full">
                                {[0, 1, 2].map((colIndex) => {
                                    // Status for this cell
                                    const assignedToSelf = assignments[colIndex] === ability;
                                    const isClickable = isFlexible && allowedAbilities.includes(ability);

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

                            {/* Final Score with Modifier (feat increases included) */}
                            <div className="text-center" title={featBonus ? `Includes +${featBonus} from feats` : undefined}>
                                {usesPool && pool[assignment[ability] ?? -1] === undefined ? (
                                    <span className="text-2xl text-gray-600">—</span>
                                ) : (
                                    <>
                                        <span className="font-bold text-2xl text-white">
                                            {finalScore}
                                        </span>
                                        <span className="text-xl text-gray-500 ml-1">
                                            ({getModifier(finalScore)})
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
