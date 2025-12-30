
import { useState, useEffect } from "react";
import { Class, AbilityScores, Race, Subrace } from "../../types/dnd-types";
import { CharacterData } from "../../types/character-creator";

// Hit Points Calculator Step
export function HitPointsStep({
    classData,
    abilityScores,
    level,
    race,
    subrace,
    feats,
    racialBonusAllocation,
    hpRolls = [],
    onHpRollsChange,
    onMaxHpChange
}: {
    classData?: Class;
    abilityScores: AbilityScores;
    level: number;
    race?: Race | CharacterData['race'];
    subrace?: Subrace;
    feats?: any[];
    racialBonusAllocation?: Record<string, number>;
    hpRolls?: number[];
    onHpRollsChange: (rolls: number[]) => void;
    onMaxHpChange: (hp: number) => void;
}) {
    // Helper: Calculate Final CON Score
    const getFinalCon = (): number => {
        let score = abilityScores.CON;

        // Racial Bonuses
        if (race?.flexibleAbilityScores) {
            score += (racialBonusAllocation?.["CON"] || 0);
        } else {
            score += (race?.abilityScoreIncrease?.CON || 0);
            if (subrace) {
                score += (subrace.abilityScoreIncrease?.CON || 0);
            }
        }

        // Feat Bonuses
        if (feats) {
            feats.forEach(feat => {
                if (feat.benefits?.abilityScoreIncrease?.CON) {
                    score += feat.benefits.abilityScoreIncrease.CON;
                }
            });
        }
        return score;
    };

    const finalCon = getFinalCon();
    const conMod = Math.floor((finalCon - 10) / 2);

    // Constants
    const hitDie = classData?.hitDie || 8;
    const averageDie = Math.ceil((hitDie + 1) / 2);

    // Calculate Bonuses
    // Hill Dwarf: Dwarven Toughness (+1 HP per level)
    const isHillDwarf = race?.name?.toLowerCase().includes("dwarf") &&
        (subrace?.name?.toLowerCase()?.includes("hill") ||
            race?.name?.toLowerCase().includes("hill dwarf"));

    // Tough Feat: +2 HP per level
    const hasToughFeat = feats?.some(f => f.name === "Tough");

    const otherBonusPerLevel = (isHillDwarf ? 1 : 0) + (hasToughFeat ? 2 : 0);

    // Initialize rolls if empty
    useEffect(() => {
        if (!hpRolls || hpRolls.length < level) {
            const newRolls = [...(hpRolls || [])];
            // Fill missing levels
            for (let i = newRolls.length; i < level; i++) {
                if (i === 0) {
                    newRolls[i] = hitDie; // Level 1 is max
                } else {
                    newRolls[i] = averageDie; // Default to average for others
                }
            }
            onHpRollsChange(newRolls);
        }
    }, [level, hpRolls]);

    // Calculate Total
    const currentRolls = hpRolls && hpRolls.length >= level ? hpRolls.slice(0, level) : [];
    // If rolls not initialized yet, use temp placeholders for calculation to avoid flicker
    const displayRolls = currentRolls.length === level ? currentRolls :
        Array.from({ length: level }, (_, i) => i === 0 ? hitDie : averageDie);

    const totalHp = displayRolls.reduce((sum, roll) => sum + roll + conMod + otherBonusPerLevel, 0);

    // Update parent's max HP
    useEffect(() => {
        onMaxHpChange(totalHp);
    }, [totalHp]);

    const handleRollChange = (lvlIndex: number, newValue: number) => {
        const newRolls = [...displayRolls];
        // Clamp value between 1 and hitDie (technically valid range, though could be house ruled)
        // I won't strict clamp, but good UX implies meaningful bounds.
        newRolls[lvlIndex] = Math.max(1, Math.min(hitDie, newValue));
        onHpRollsChange(newRolls);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-brand-400 text-2xl font-bold mb-2 font-serif">Hit Points</h2>
                <p className="text-gray-400">Review your hit points per level.</p>
            </div>

            <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 space-y-6">

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                        <thead>
                            <tr className="border-b border-zinc-700 text-gray-400 text-sm uppercase tracking-wide">
                                <th className="pb-3 text-center w-16">Lvl</th>
                                <th className="pb-3 text-center">Brut HP (d{hitDie})</th>
                                <th className="pb-3 text-center w-24">CON Bonus</th>
                                {otherBonusPerLevel > 0 && <th className="pb-3 text-center w-24">Other</th>}
                                <th className="pb-3 text-center w-24 font-bold text-gray-200">Final</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {Array.from({ length: level }).map((_, i) => {
                                const roll = displayRolls[i] || (i === 0 ? hitDie : averageDie);
                                const lvl = i + 1;
                                const isFirstLevel = i === 0;

                                return (
                                    <tr key={lvl} className="hover:bg-zinc-800/50">
                                        <td className="py-4 text-center font-medium text-gray-300">{lvl}</td>
                                        <td className="py-4 text-center">
                                            {isFirstLevel ? (
                                                <span className="font-bold text-gray-100 bg-zinc-800 px-3 py-1.5 rounded">{roll}</span>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleRollChange(i, roll - 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded hover:bg-zinc-600 text-gray-300 font-bold disabled:opacity-50"
                                                        disabled={roll <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-xl text-gray-100">{roll}</span>
                                                    <button
                                                        onClick={() => handleRollChange(i, roll + 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-zinc-700 rounded hover:bg-zinc-600 text-gray-300 font-bold disabled:opacity-50"
                                                        disabled={roll >= hitDie}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 text-center text-gray-400">
                                            {conMod >= 0 ? '+' : ''}{conMod}
                                        </td>
                                        {otherBonusPerLevel > 0 && (
                                            <td className="py-4 text-center text-gray-500">
                                                +{otherBonusPerLevel}
                                            </td>
                                        )}
                                        <td className="py-4 text-center font-bold text-lg text-brand-400">
                                            {roll + conMod + otherBonusPerLevel}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="border-t-2 border-zinc-700 bg-zinc-800/50">
                            <tr>
                                <td colSpan={otherBonusPerLevel > 0 ? 3 : 2} className="py-4 text-right pr-4 font-semibold text-gray-400 uppercase text-sm">
                                    Total HP
                                </td>
                                <td className="py-4 text-center">
                                    {/* Empty for alignment if needed, or join cells */}
                                </td>
                                <td className="py-4 text-center font-bold text-3xl text-brand-400">
                                    {totalHp}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="bg-brand-900/30 p-4 rounded-lg text-sm text-brand-300 border border-brand-800/50">
                    <p>
                        <strong>Note:</strong> Level 1 HP is maximized. For other levels, the average is selected by default, but you can adjust it if you rolled for HP.
                        The Constitution modifier and any racial/feat bonuses are automatically applied to every level.
                    </p>
                    <p className="mt-1">
                        <strong>Constitution:</strong> {finalCon} (Base: {abilityScores.CON}) → Modifier: {conMod >= 0 ? '+' : ''}{conMod}
                    </p>
                </div>
            </div>
        </div>
    );
}
