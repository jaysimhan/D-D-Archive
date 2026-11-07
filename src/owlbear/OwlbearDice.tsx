import { useCallback, useEffect, useRef, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { DiceRoller } from "../components/DiceRoller";
import { Die } from "../components/DiceRollLog";
import type { LoggedRoll } from "../lib/dice";
import { shareRolls, watchTable, type TableBatch } from "./table-rolls";

type Tab = "roll" | "table";

const stamp = (at: number) =>
    new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/** Every roll at the table, newest first, each under the player who made it. */
function TableLog({ batches, me }: { batches: TableBatch[]; me: string }) {
    if (!batches.length) {
        return <p className="text-[12px] text-center text-gray-400 py-6">Nobody has rolled yet</p>;
    }

    return (
        <ol className="space-y-2">
            {batches.map((batch) => (
                <li key={`${batch.playerId}-${batch.id}`} className="rounded border border-gray-100 bg-gray-50 px-2 py-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: batch.color }} />
                        <span className="font-semibold text-gray-700 truncate">
                            {batch.player}
                            {batch.playerId === me && <span className="font-normal text-gray-400"> (you)</span>}
                        </span>
                        <span className="ml-auto tabular-nums">{stamp(batch.at)}</span>
                    </div>
                    <div className="space-y-1">
                        {batch.rolls.map((roll) => (
                            <div key={roll.id}>
                                <div className="flex items-baseline justify-between gap-2">
                                    <span className="text-[12px] font-medium text-gray-700 truncate">{roll.name}</span>
                                    <span className="text-[14px] font-bold text-brand-700 tabular-nums shrink-0">
                                        {roll.total}
                                    </span>
                                </div>
                                {roll.detail !== roll.name && (
                                    <div className="text-[10px] text-gray-400 -mt-0.5">{roll.detail}</div>
                                )}
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                    {roll.dice.map((die, index) => (
                                        <Die key={index} die={die} perDie={roll.perDie} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </li>
            ))}
        </ol>
    );
}

/**
 * The roller inside Owlbear Rodeo: the site's own panel, plus the table's
 * rolls. Both tabs stay mounted, so switching never loses a roll mid-tumble.
 */
export function OwlbearDice() {
    const [tab, setTab] = useState<Tab>("roll");
    const [batches, setBatches] = useState<TableBatch[]>([]);
    const [me, setMe] = useState("");
    /** Rolls by others that landed while the Roll tab was showing. */
    const [unseen, setUnseen] = useState(0);
    const seen = useRef<Set<string> | null>(null);
    const tabRef = useRef(tab);
    tabRef.current = tab;

    useEffect(() => {
        OBR.player.getId().then(setMe);
    }, []);

    useEffect(() => watchTable((next) => {
        const ids = new Set(next.map((batch) => `${batch.playerId}-${batch.id}`));
        // The first read is history, not news.
        if (seen.current && tabRef.current !== "table") {
            const fresh = next.filter((batch) =>
                !seen.current!.has(`${batch.playerId}-${batch.id}`));
            OBR.player.getId().then((id) => {
                const theirs = fresh.filter((batch) => batch.playerId !== id).length;
                if (theirs) setUnseen((count) => count + theirs);
            });
        }
        seen.current = ids;
        setBatches(next);
    }), []);

    const onRoll = useCallback((rolls: LoggedRoll[]) => {
        shareRolls(rolls).catch((cause) => {
            console.error("Could not share the roll with the table", cause);
            OBR.notification.show("Your roll could not be shared with the table", "ERROR");
        });
    }, []);

    const tabClass = (value: Tab) =>
        `flex-1 py-1.5 text-[12px] font-semibold tracking-wide transition-colors ${tab === value
            ? "text-brand-700 border-b-2 border-brand-600"
            : "text-gray-500 border-b-2 border-transparent hover:text-gray-700"}`;

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex shrink-0 border-b border-gray-200">
                <button className={tabClass("roll")} onClick={() => setTab("roll")}>Roll</button>
                <button
                    className={tabClass("table")}
                    onClick={() => {
                        setTab("table");
                        setUnseen(0);
                    }}
                >
                    Table
                    {unseen > 0 && (
                        <span className="ml-1.5 inline-flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-brand-600 text-white text-[10px] tabular-nums">
                            {unseen}
                        </span>
                    )}
                </button>
            </div>
            <div className={`flex-1 min-h-0 ${tab === "roll" ? "" : "hidden"}`}>
                <DiceRoller embedded onRoll={onRoll} />
            </div>
            <div className={`flex-1 min-h-0 overflow-y-auto p-3 ${tab === "table" ? "" : "hidden"}`}>
                <TableLog batches={batches} me={me} />
            </div>
        </div>
    );
}
