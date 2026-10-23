import { useMemo } from "react";
import { X } from "lucide-react";
import type { CharacterData } from "../../types/character-creator";
import {
    availableOptions,
    buildProficiencyPlan,
    describeChoice,
    PlanChoice,
    ProficiencySelections,
    remainingPicks,
} from "../../utils/proficiency-plan";

/** Pools longer than this are offered as a dropdown rather than a wall of chips. */
const CHIP_LIMIT = 18;

/**
 * The proficiency choices one source leaves open — a species' Keen Senses, a
 * lineage's two skills — made right where that source is chosen. Picks land in
 * the same `proficiencyChoices` the Proficiencies step reads, so either place
 * can make or undo them.
 */
export function PlanChoicePicker({
    character,
    include,
    onChange,
}: {
    character: CharacterData;
    /** Which of the plan's choices to offer here. */
    include: (choice: PlanChoice) => boolean;
    onChange: (update: (prev: CharacterData) => Partial<CharacterData>) => void;
}) {
    const plan = useMemo(() => buildProficiencyPlan(character), [character]);
    const selections: ProficiencySelections = character.proficiencyChoices ?? {};
    const choices = plan.choices.filter(include);
    if (choices.length === 0) return null;

    const setPicks = (choiceId: string, picks: (current: string[]) => string[]) =>
        onChange((prev) => {
            const current = prev.proficiencyChoices ?? {};
            const next = { ...current, [choiceId]: picks(current[choiceId] ?? []) };
            if (!next[choiceId].length) delete next[choiceId];
            return { proficiencyChoices: next };
        });

    return (
        <div className="space-y-3">
            {choices.map((choice) => {
                const picks = selections[choice.id] ?? [];
                const open = remainingPicks(choice, selections) > 0;
                const options = open ? availableOptions(plan, choice, selections) : [];
                return (
                    <div key={choice.id} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                        <p className="text-xs text-gray-400 mb-2">
                            <span className="font-semibold text-gray-200">{choice.source}</span>
                            {" · "}{describeChoice(choice)}
                            <span className={open ? "text-brand-300" : "text-emerald-400"}>
                                {" · "}{open ? `${remainingPicks(choice, selections)} left` : "done"}
                            </span>
                        </p>
                        {choice.note && <p className="text-xs text-gray-500 italic mb-2">{choice.note}</p>}
                        <div className="flex flex-wrap gap-1.5">
                            {picks.map((pick) => (
                                <button
                                    key={pick}
                                    type="button"
                                    onClick={() => setPicks(choice.id, (current) => current.filter((held) => held !== pick))}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-brand-500 bg-brand-900/40 text-brand-100"
                                    title="Remove"
                                >
                                    {pick} <X className="w-3 h-3" />
                                </button>
                            ))}
                            {open && options.length <= CHIP_LIMIT && options.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setPicks(choice.id, (current) => [...current, option].slice(0, choice.count))}
                                    className="px-2 py-1 rounded-md text-xs border border-zinc-700 text-gray-300 hover:border-brand-500/60 hover:text-white"
                                >
                                    {option}
                                </button>
                            ))}
                            {open && options.length > CHIP_LIMIT && (
                                <select
                                    value=""
                                    onChange={(event) => event.target.value
                                        && setPicks(choice.id, (current) => [...current, event.target.value].slice(0, choice.count))}
                                    className="bg-zinc-900 border border-zinc-700 rounded-md px-2 py-1 text-xs text-white"
                                >
                                    <option value="">Choose…</option>
                                    {options.map((option) => <option key={option} value={option}>{option}</option>)}
                                </select>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
