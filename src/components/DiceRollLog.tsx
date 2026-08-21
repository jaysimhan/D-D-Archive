import { Trash2 } from "lucide-react";
import type { DieResult, LogBatch } from "../lib/dice";

const stamp = (at: number) =>
    new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

/**
 * One die as it landed. A dropped die stays on screen struck through rather
 * than vanishing, because "why is this 17 and not 21" is exactly the question
 * a log is for; a rerolled die shows what it replaced, and a die held to a
 * floor or ceiling says so on hover.
 */
function Die({ die }: { die: DieResult }) {
    const chip = "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold tabular-nums";

    if (die.dropped) {
        return (
            <span className={`${chip} bg-red-50 text-red-500 line-through`} title="Dropped">
                {die.value}
            </span>
        );
    }

    return (
        <span
            className={`${chip} bg-white border border-gray-200 text-gray-700 ${die.clampedFrom !== undefined ? "underline decoration-dotted decoration-brand-500" : ""}`}
            title={die.clampedFrom !== undefined ? `Rolled ${die.clampedFrom}, held to ${die.value}` : undefined}
        >
            {die.rerolledFrom !== undefined && (
                <span className="text-gray-400 line-through mr-1 font-normal">{die.rerolledFrom}</span>
            )}
            {die.value}
        </span>
    );
}

export function DiceRollLog({ batches, onClear }: { batches: LogBatch[]; onClear: () => void }) {
    if (!batches.length) {
        return <p className="text-[12px] text-center text-gray-400 py-3">No rolls yet</p>;
    }

    return (
        <div className="space-y-2">
            <button
                onClick={onClear}
                className="w-full text-[12px] text-red-500 hover:text-red-700 hover:bg-red-50 py-1 rounded transition-colors flex items-center justify-center gap-1"
            >
                <Trash2 className="w-3 h-3" />
                Clear log
            </button>

            <ol className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {batches.map((batch) => (
                    <li key={batch.id} className="border-t border-gray-100 pt-2 first:border-t-0 first:pt-0">
                        <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">
                            {stamp(batch.at)}
                        </div>
                        <div className="space-y-1.5">
                            {batch.rolls.map((roll) => (
                                <div key={roll.id} className="rounded bg-gray-50 border border-gray-100 px-2 py-1.5">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <span className="text-[12px] font-medium text-gray-700 truncate">{roll.name}</span>
                                        <span className="text-[13px] font-bold text-brand-700 tabular-nums shrink-0">
                                            {roll.total}
                                        </span>
                                    </div>
                                    {roll.detail !== roll.name && (
                                        <div className="text-[10px] text-gray-400 -mt-0.5">{roll.detail}</div>
                                    )}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {roll.dice.map((die, index) => (
                                            <Die key={index} die={die} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}
