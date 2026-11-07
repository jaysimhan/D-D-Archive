import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { DiceRoller } from "../components/DiceRoller";
import { Die } from "../components/DiceRollLog";
import type { LoggedRoll } from "../lib/dice";
import { clearTable, shareRolls, watchTable, type TableBatch } from "./table-rolls";
import {
    forgetHidden,
    keepHidden,
    readHidden,
    readHideRolls,
    removeHidden,
    writeHideRolls,
} from "./hidden-rolls";
import { showTray } from "./tray-open";

type Tab = "roll" | "table";

/**
 * The popover follows its content: shorter when lines are removed, taller as
 * they are added, up to the manifest's height — past that, the page scrolls
 * under the pinned tabs.
 */
const MAX_HEIGHT = 640;
const MIN_HEIGHT = 120;
/** Everyone, the DM's rolls, or one player's, by id. */
type Filter = "all" | "gm" | string;

const stamp = (at: number) =>
    new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const tag = "inline-flex items-center gap-0.5 rounded px-1 text-[10px] font-semibold uppercase tracking-wide";

/** Every roll at the table, newest first, each under the player who made it. */
function TableLog({
    batches,
    me,
    onReveal,
}: {
    batches: TableBatch[];
    me: string;
    onReveal: (batch: TableBatch) => void;
}) {
    if (!batches.length) {
        return <p className="text-[12px] text-center text-gray-400 py-6">No rolls here yet</p>;
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
                        {batch.gm && !batch.hidden && !batch.revealed && (
                            <span className={`${tag} bg-brand-50 text-brand-700`}>DM</span>
                        )}
                        {batch.hidden && (
                            <span className={`${tag} bg-gray-200 text-gray-600`} title="Only you can see this roll">
                                <EyeOff className="w-2.5 h-2.5" />
                                Hidden
                            </span>
                        )}
                        {batch.revealed && (
                            <span className={`${tag} bg-brand-50 text-brand-700`} title="Rolled hidden, then shown to the table">
                                <Eye className="w-2.5 h-2.5" />
                                Revealed
                            </span>
                        )}
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
                    {batch.hidden && batch.playerId === me && (
                        <button
                            onClick={() => onReveal(batch)}
                            className="mt-1.5 w-full flex items-center justify-center gap-1 rounded border border-brand-200 bg-white py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors"
                        >
                            <Eye className="w-3 h-3" />
                            Reveal to the table
                        </button>
                    )}
                </li>
            ))}
        </ol>
    );
}

/** Chips to narrow the table: everyone, the DM, or one player. */
function TableFilter({
    value,
    onChange,
    players,
    hasGM,
}: {
    value: Filter;
    onChange: (value: Filter) => void;
    players: { id: string; name: string; color: string }[];
    hasGM: boolean;
}) {
    const chip = (active: boolean) =>
        `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${active
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`;

    return (
        <div className="flex flex-wrap gap-1.5">
            <button className={chip(value === "all")} onClick={() => onChange("all")}>All</button>
            {hasGM && (
                <button className={chip(value === "gm")} onClick={() => onChange("gm")}>DM</button>
            )}
            {players.map((player) => (
                <button key={player.id} className={chip(value === player.id)} onClick={() => onChange(player.id)}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: player.color }} />
                    {player.name}
                </button>
            ))}
        </div>
    );
}

/**
 * The GM's switch for rolling out of the players' sight, in a strip of its own
 * under the tabs — tinted while it is on, so a hidden roll is never a surprise.
 */
function RollVisibility({ hidden, onChange }: { hidden: boolean; onChange: (hidden: boolean) => void }) {
    const Icon = hidden ? EyeOff : Eye;
    return (
        <div
            className={`shrink-0 flex items-center justify-between gap-2 px-3 py-1.5 border-b text-[11px] transition-colors ${hidden
                ? "bg-brand-50 border-brand-100 text-brand-700"
                : "bg-gray-50 border-gray-200 text-gray-500"}`}
        >
            <span className="flex items-center gap-1.5 font-medium">
                <Icon className="w-3.5 h-3.5" />
                {hidden ? "Rolls hidden from players" : "Rolls visible to the table"}
            </span>
            <button
                role="switch"
                aria-checked={hidden}
                aria-label="Hide my rolls from players"
                onClick={() => onChange(!hidden)}
                className="flex items-center gap-1.5 font-semibold"
            >
                Hide
                <span
                    className={`relative inline-flex h-[18px] w-8 shrink-0 rounded-full transition-colors ${hidden ? "bg-brand-600" : "bg-gray-300"}`}
                >
                    <span
                        className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow transition-transform ${hidden ? "translate-x-[16px]" : "translate-x-[2px]"}`}
                    />
                </span>
            </button>
        </div>
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
    const [isGM, setIsGM] = useState(false);
    /** The GM's choice to roll out of the players' sight, and what it kept. */
    const [hideRolls, setHideRolls] = useState(readHideRolls);
    const [hidden, setHidden] = useState<TableBatch[]>(readHidden);
    const secret = isGM && hideRolls;
    const secretRef = useRef(secret);
    secretRef.current = secret;
    /** Rolls by others that landed while the Roll tab was showing. */
    const [unseen, setUnseen] = useState(0);
    const seen = useRef<Set<string> | null>(null);
    const tabRef = useRef(tab);
    tabRef.current = tab;

    useEffect(() => {
        OBR.player.getId().then(setMe);
        OBR.player.getRole().then((role) => setIsGM(role === "GM"));
        // The GM can hand the role on mid-session.
        return OBR.player.onChange((player) => setIsGM(player.role === "GM"));
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
        if (secretRef.current) {
            keepHidden(rolls)
                .then((batch) => {
                    setHidden((prev) => [batch, ...prev.filter((item) => item.id !== batch.id)]);
                    return showTray(batch);
                })
                .catch((cause) => console.error("Could not keep the hidden roll", cause));
            return;
        }
        shareRolls(rolls).catch((cause) => {
            console.error("Could not share the roll with the table", cause);
            OBR.notification.show("Your roll could not be shared with the table", "ERROR");
        });
    }, []);

    // The GM's hidden rolls sit among the table's, where only they can see them.
    const shown = useMemo(
        () => (hidden.length ? [...batches, ...hidden].sort((a, b) => b.at - a.at) : batches),
        [batches, hidden],
    );

    const [filter, setFilter] = useState<Filter>("all");
    const players = useMemo(() => {
        const byId = new Map<string, { id: string; name: string; color: string }>();
        // Newest first, so a renamed player shows under their current name.
        for (const batch of shown) {
            if (!batch.gm && !byId.has(batch.playerId)) {
                byId.set(batch.playerId, { id: batch.playerId, name: batch.player, color: batch.color });
            }
        }
        return [...byId.values()];
    }, [shown]);
    const hasGM = shown.some((batch) => batch.gm);
    // A filter on someone whose rolls were cleared falls back to everyone.
    const active: Filter = filter === "all" || (filter === "gm" ? hasGM : players.some((p) => p.id === filter))
        ? filter
        : "all";
    const filtered = active === "all"
        ? shown
        : shown.filter((batch) => (active === "gm" ? batch.gm : !batch.gm && batch.playerId === active));

    const reveal = useCallback((batch: TableBatch) => {
        shareRolls(batch.rolls, batch)
            .then(() => {
                removeHidden(batch.id);
                setHidden((prev) => prev.filter((item) => item.id !== batch.id));
            })
            .catch((cause) => {
                console.error("Could not reveal the roll", cause);
                OBR.notification.show("The roll could not be revealed", "ERROR");
            });
    }, []);

    const rootRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        let last = 0;
        const fit = () => {
            const height = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.ceil(root.getBoundingClientRect().height)));
            if (height === last) return;
            last = height;
            OBR.action.setHeight(height);
        };
        const observer = new ResizeObserver(fit);
        observer.observe(root);
        return () => observer.disconnect();
    }, []);

    const tabClass = (value: Tab) =>
        `flex-1 py-1.5 text-[12px] font-semibold tracking-wide transition-colors ${tab === value
            ? "text-brand-700 border-b-2 border-brand-600"
            : "text-gray-500 border-b-2 border-transparent hover:text-gray-700"}`;

    return (
        <div ref={rootRef} className="bg-white">
            <div className="sticky top-0 z-10 bg-white">
                <div className="flex border-b border-gray-200">
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
                {isGM && (
                    <RollVisibility
                        hidden={hideRolls}
                        onChange={(next) => {
                            writeHideRolls(next);
                            setHideRolls(next);
                        }}
                    />
                )}
            </div>
            <div className={tab === "roll" ? "" : "hidden"}>
                <DiceRoller embedded onRoll={onRoll} />
            </div>
            <div className={`p-3 space-y-2 ${tab === "table" ? "" : "hidden"}`}>
                {isGM && shown.length > 0 && (
                    <button
                        onClick={() => {
                            forgetHidden();
                            setHidden([]);
                            clearTable().catch((cause) => {
                                console.error("Could not clear the table", cause);
                                OBR.notification.show("The table could not be cleared", "ERROR");
                            });
                        }}
                        className="w-full text-[12px] text-red-500 hover:text-red-700 hover:bg-red-50 py-1 rounded transition-colors flex items-center justify-center gap-1"
                        title="Clears every player's rolls from the table"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear table
                    </button>
                )}
                {(players.length > 0 || hasGM) && (
                    <TableFilter value={active} onChange={setFilter} players={players} hasGM={hasGM} />
                )}
                <TableLog batches={filtered} me={me} onReveal={reveal} />
            </div>
        </div>
    );
}
