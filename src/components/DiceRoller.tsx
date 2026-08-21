import { useState, useEffect, useRef, useCallback } from "react";
import {
    X, Minus, Plus, Volume2, VolumeX, ScrollText,
    ChevronsDownUp, ChevronsUpDown, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DiceGlyph, RollerGlyph } from "./DiceGlyphs";
import { DiceLineRow } from "./DiceLineRow";
import { DiceRollLog } from "./DiceRollLog";
import { NumberField } from "./DiceFields";
import {
    clampInt,
    createLine,
    critOf,
    lineName,
    duplicateLine,
    makeId,
    maxKeepCount,
    rollLine,
    sanitizeLine,
    sanitizeLog,
    toLoggedRoll,
    MAX_LOG_BATCHES,
    MAX_MODIFIER,
    TRAY_SIDES,
    type DiceLine,
    type DieResult,
    type DieSides,
    type LogBatch,
    type LoggedRoll,
} from "../lib/dice";
import { playDiceSound } from "../lib/dice-sound";

type RollMode = "normal" | "advantage" | "disadvantage";

/** What the big panel-top readout is showing. */
interface Headline {
    title: string;
    detail: string;
    total: number;
    crit: "success" | "failure" | null;
    /** The individual dice, when a single line was rolled. */
    dice: DieResult[] | null;
    /** Line-by-line totals, when ALL was. */
    parts: { id: string; name: string; total: number }[];
}

const STORAGE_KEY = "dnd-archive:dice-roller";
const MAX_LINES = 20;
const STAT_ARRAY_SIZE = 6;

interface StoredRoller {
    lines?: unknown;
    log?: unknown;
    sound?: unknown;
    modifier?: unknown;
    rollMode?: unknown;
    showLog?: unknown;
}

function readStored(): StoredRoller {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw ? JSON.parse(raw) : null;
        return parsed && typeof parsed === "object" ? (parsed as StoredRoller) : {};
    } catch {
        // Storage can be blocked outright, and what is in it can be
        // half-written. Either way the roller just starts fresh.
        return {};
    }
}

function writeStored(state: StoredRoller): void {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (cause) {
        console.warn("Could not save dice roller state", cause);
    }
}

// Custom hook for responsive positioning
function useIsLargeScreen(breakpoint: number = 1410) {
    const [isLarge, setIsLarge] = useState(
        typeof window !== 'undefined' ? window.innerWidth >= breakpoint : true
    );

    useEffect(() => {
        const handleResize = () => setIsLarge(window.innerWidth >= breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isLarge;
}

export function DiceRoller() {
    const isLargeScreen = useIsLargeScreen(1410);
    const [stored] = useState(readStored);

    const [isOpen, setIsOpen] = useState(false);
    const [isRolling, setIsRolling] = useState(false);

    // Quick tray settings — the one-tap dice grid, unchanged in spirit.
    const [modifier, setModifier] = useState(() =>
        typeof stored.modifier === "number" ? clampInt(stored.modifier, -MAX_MODIFIER, MAX_MODIFIER) : 0
    );
    const [rollMode, setRollMode] = useState<RollMode>(() =>
        stored.rollMode === "advantage" || stored.rollMode === "disadvantage" ? stored.rollMode : "normal"
    );

    const [lines, setLines] = useState<DiceLine[]>(() => {
        if (!Array.isArray(stored.lines)) return [createLine()];
        return stored.lines
            .map(sanitizeLine)
            .filter((line): line is DiceLine => line !== null)
            .slice(0, MAX_LINES);
    });

    const [log, setLog] = useState<LogBatch[]>(() => sanitizeLog(stored.log));
    const [showLog, setShowLog] = useState(stored.showLog === true);
    const [soundOn, setSoundOn] = useState(stored.sound === true);

    const [headline, setHeadline] = useState<Headline | null>(null);
    /** A settling total shown mid-animation; null once the real one lands. */
    const [shuffle, setShuffle] = useState<number | null>(null);
    /** Bumped per line on every roll, so a repeated total still animates. */
    const [pulses, setPulses] = useState<Record<string, number>>({});

    const shuffleTimer = useRef<number | null>(null);

    useEffect(() => () => {
        if (shuffleTimer.current !== null) window.clearInterval(shuffleTimer.current);
    }, []);

    useEffect(() => {
        writeStored({ lines, log, sound: soundOn, modifier, rollMode, showLog });
    }, [lines, log, soundOn, modifier, rollMode, showLog]);

    /**
     * Tumbles a placeholder total for a few frames before the real one lands.
     * The roll itself happens in `settle`, at the end — the numbers flashing
     * past are scenery, not draws anyone is stuck with.
     */
    const runShuffle = useCallback((ceiling: number, settle: () => void) => {
        if (shuffleTimer.current !== null) window.clearInterval(shuffleTimer.current);

        setIsRolling(true);
        let ticks = 0;

        shuffleTimer.current = window.setInterval(() => {
            setShuffle(1 + Math.floor(Math.random() * Math.max(1, ceiling)));

            if (++ticks >= 8) {
                if (shuffleTimer.current !== null) window.clearInterval(shuffleTimer.current);
                shuffleTimer.current = null;
                setShuffle(null);
                settle();
                setIsRolling(false);
            }
        }, 45);
    }, []);

    const pushBatch = useCallback((rolls: LoggedRoll[]) => {
        setLog((prev) => [{ id: makeId("batch"), at: Date.now(), rolls }, ...prev].slice(0, MAX_LOG_BATCHES));
    }, []);

    const announce = useCallback((rolls: LoggedRoll[]) => {
        if (rolls.length === 1) {
            const roll = rolls[0];
            setHeadline({
                title: roll.name,
                detail: roll.detail === roll.name ? "" : roll.detail,
                total: roll.total,
                crit: critOf(roll),
                dice: roll.dice,
                parts: [],
            });
            return;
        }

        setHeadline({
            title: `${rolls.length} rolls`,
            detail: "every line, one press",
            total: rolls.reduce((running, roll) => running + roll.total, 0),
            crit: null,
            dice: null,
            parts: rolls.map((roll) => ({ id: roll.id, name: roll.name, total: roll.total })),
        });
    }, []);

    /** Rolls the given lines together: one log batch, one sound, one headline. */
    const rollLines = useCallback((targets: DiceLine[]) => {
        if (!targets.length) return;

        // Name the roll before the tumble starts, so the readout has something
        // to sit under — and so the previous roll's dice are not left on screen
        // beside a total that is still settling.
        setHeadline({
            title: targets.length === 1 ? lineName(targets[0]) : `${targets.length} rolls`,
            detail: "",
            total: 0,
            crit: null,
            dice: null,
            parts: [],
        });

        const ceiling = targets.reduce((running, line) => running + line.count * line.sides, 0);

        runShuffle(ceiling, () => {
            const rolled = targets.map((line) => ({ line, roll: rollLine(line) }));
            const logged = rolled.map(({ line, roll }) => toLoggedRoll(line, roll));
            const totals = new Map(rolled.map(({ line, roll }) => [line.id, roll.total]));

            setLines((prev) => prev.map((line) => (
                totals.has(line.id) ? { ...line, result: totals.get(line.id)! } : line
            )));
            setPulses((prev) => {
                const next = { ...prev };
                for (const { line } of rolled) next[line.id] = (next[line.id] ?? 0) + 1;
                return next;
            });

            pushBatch(logged);
            announce(logged);
            if (soundOn) playDiceSound(rolled.reduce((running, { roll }) => running + roll.dice.length, 0));
        });
    }, [announce, pushBatch, runShuffle, soundOn]);

    /**
     * The quick tray borrows the line engine rather than duplicating it, so
     * advantage is simply 2dX dropping the lowest — and the log shows the die
     * it threw away, same as any other line would.
     */
    const rollTray = useCallback((sides: DieSides) => {
        const twin = rollMode !== "normal";
        rollLines([createLine({
            label: twin ? `${rollMode === "advantage" ? "Advantage" : "Disadvantage"} d${sides}` : "",
            count: twin ? 2 : 1,
            sides,
            sign: modifier < 0 ? -1 : 1,
            modifier: Math.abs(modifier),
            modTarget: "total",
            keepEnabled: twin,
            keepMode: "drop",
            keepEnd: rollMode === "advantage" ? "lowest" : "highest",
            keepCount: twin ? 1 : 0,
        })]);
    }, [modifier, rollLines, rollMode]);

    const updateLine = useCallback((id: string, patch: Partial<DiceLine>) => {
        setLines((prev) => prev.map((line) => {
            if (line.id !== id) return line;

            // A change in one field can put another out of range: shrinking the
            // pool leaves fewer dice to drop, and a smaller die lowers the
            // ceiling a per-die floor can sit at.
            const next = { ...line, ...patch };
            const ceiling = maxKeepCount(next);

            // Ticking the box on a line whose count has been clamped to zero
            // would otherwise switch on an option that does nothing.
            const wantsOne = patch.keepEnabled === true && next.keepCount === 0 && ceiling > 0;

            return {
                ...next,
                keepCount: wantsOne ? 1 : clampInt(next.keepCount, 0, ceiling),
                limitValue: clampInt(next.limitValue, 1, next.sides),
            };
        }));
    }, []);

    const addLine = useCallback(() => {
        setLines((prev) => (prev.length >= MAX_LINES ? prev : [...prev, createLine()]));
    }, []);

    const copyLine = useCallback((id: string) => {
        setLines((prev) => {
            const index = prev.findIndex((line) => line.id === id);
            if (index < 0 || prev.length >= MAX_LINES) return prev;
            return [...prev.slice(0, index + 1), duplicateLine(prev[index]), ...prev.slice(index + 1)];
        });
    }, []);

    const removeLine = useCallback((id: string) => {
        setLines((prev) => prev.filter((line) => line.id !== id));
    }, []);

    const allExpanded = lines.length > 0 && lines.every((line) => line.expanded);
    const toggleExpandAll = useCallback(() => {
        setLines((prev) => {
            const expand = !prev.every((line) => line.expanded);
            return prev.map((line) => ({ ...line, expanded: expand }));
        });
    }, []);

    /** Six lines of 4d6 drop lowest, rolled straight away — the classic spread. */
    const rollStatArray = useCallback(() => {
        const fresh = Array.from({ length: STAT_ARRAY_SIZE }, (_, index) => createLine({
            label: `Ability ${index + 1}`,
            count: 4,
            sides: 6,
            keepEnabled: true,
            keepMode: "drop",
            keepEnd: "lowest",
            keepCount: 1,
        }));

        setLines((prev) => [...prev, ...fresh].slice(0, MAX_LINES));
        rollLines(fresh);
    }, [rollLines]);

    const roomForStatArray = lines.length + STAT_ARRAY_SIZE <= MAX_LINES;
    const shown = shuffle ?? headline?.total ?? 0;

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed z-50 group hover:scale-110 transition-all"
                    style={{
                        bottom: isLargeScreen ? '32px' : '16px',
                        ...(isLargeScreen
                            ? { right: '32px', left: 'auto' }
                            : { left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto' }
                        ),
                        width: isLargeScreen ? '80px' : '64px',
                        height: isLargeScreen ? '80px' : '64px',
                        filter: 'drop-shadow(0 20px 25px rgba(124, 51, 6, 0.5))'
                    }}
                >
                    <div className="relative w-full h-full group-hover:rotate-12 transition-transform">
                        <RollerGlyph />
                    </div>
                </motion.button>
            )}

            {/* Dice Roller Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bg-white rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
                        style={{
                            bottom: isLargeScreen ? '32px' : '80px',
                            ...(isLargeScreen
                                ? { right: '32px', left: 'auto' }
                                : { left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto' }
                            ),
                            width: '384px',
                            maxWidth: 'calc(100vw - 32px)',
                            maxHeight: isLargeScreen ? 'calc(100vh - 64px)' : 'calc(100vh - 112px)',
                        }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 flex items-center justify-between shrink-0">
                            <span className="text-white text-[15px] font-normal">Dice Roller</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setSoundOn(!soundOn)}
                                    title={soundOn ? "Sound on" : "Sound off"}
                                    aria-pressed={soundOn}
                                    className="p-1 hover:bg-white/10 rounded transition-all"
                                >
                                    {soundOn
                                        ? <Volume2 className="w-4 h-4 text-white" />
                                        : <VolumeX className="w-4 h-4 text-white/50" />}
                                </button>
                                <button
                                    onClick={toggleExpandAll}
                                    title={allExpanded ? "Collapse all options" : "Expand all options"}
                                    className="p-1 hover:bg-white/10 rounded transition-all"
                                >
                                    {allExpanded
                                        ? <ChevronsDownUp className="w-4 h-4 text-white" />
                                        : <ChevronsUpDown className="w-4 h-4 text-white" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} title="Close" className="p-1 hover:bg-white/10 rounded transition-all">
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 space-y-3 overflow-y-auto">
                            {/* Result Display */}
                            <AnimatePresence mode="wait">
                                {headline && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="w-full"
                                    >
                                        <div
                                            className={`rounded-lg p-3 text-center border w-full relative overflow-hidden transition-colors duration-500
                                                ${headline.crit === "success"
                                                    ? "bg-green-50 border-green-200"
                                                    : headline.crit === "failure"
                                                        ? "bg-red-50 border-red-200"
                                                        : "bg-gray-100 border-gray-200"}`}
                                        >
                                            <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-0.5 z-10 relative">
                                                {headline.crit === "success"
                                                    ? "CRITICAL SUCCESS!"
                                                    : headline.crit === "failure"
                                                        ? "CRITICAL FAILURE!"
                                                        : "RESULT"}
                                            </div>
                                            <motion.div
                                                animate={shuffle !== null
                                                    ? {}
                                                    : headline.crit === "success"
                                                        ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
                                                        : headline.crit === "failure"
                                                            ? { x: [0, -5, 5, -5, 5, 0] }
                                                            : {}}
                                                transition={{ duration: 0.5 }}
                                                className={`text-4xl font-bold font-['Cinzel',serif] leading-none mb-1 z-10 relative tabular-nums
                                                    ${shuffle !== null
                                                        ? "text-gray-400"
                                                        : headline.crit === "success"
                                                            ? "text-green-600 drop-shadow-[0_2px_4px_rgba(22,163,74,0.3)]"
                                                            : headline.crit === "failure"
                                                                ? "text-red-600 drop-shadow-[0_2px_4px_rgba(220,38,38,0.3)]"
                                                                : "text-gray-800"}`}
                                            >
                                                {shown}
                                            </motion.div>
                                            <div className="text-[12px] text-brand-600 font-medium z-10 relative">
                                                {headline.title}
                                            </div>
                                            {headline.detail && (
                                                <div className="text-[11px] text-gray-400 z-10 relative">{headline.detail}</div>
                                            )}

                                            {shuffle === null && headline.dice && headline.dice.length > 1 && (
                                                <div className="flex flex-wrap justify-center gap-1 mt-1.5 z-10 relative">
                                                    {headline.dice.map((die, index) => (
                                                        <span
                                                            key={index}
                                                            className={`text-[11px] px-1.5 py-0.5 rounded font-semibold tabular-nums ${die.dropped
                                                                ? "bg-red-50 text-red-400 line-through"
                                                                : "bg-white/80 text-gray-600 border border-gray-200"}`}
                                                        >
                                                            {die.value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {shuffle === null && headline.parts.length > 0 && (
                                                <div className="flex flex-wrap justify-center gap-1 mt-1.5 z-10 relative">
                                                    {headline.parts.map((part) => (
                                                        <span
                                                            key={part.id}
                                                            className="text-[11px] px-1.5 py-0.5 rounded bg-white/80 border border-gray-200 text-gray-600"
                                                            title={part.name}
                                                        >
                                                            <span className="font-semibold tabular-nums">{part.total}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {headline.crit === "success" && (
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-200/50 via-transparent to-transparent opacity-50 pointer-events-none" />
                                            )}
                                            {headline.crit === "failure" && (
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-200/50 via-transparent to-transparent opacity-50 pointer-events-none" />
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Quick tray */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Quick roll</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-[11px] text-gray-500 mr-0.5">Modifier</span>
                                        <button
                                            onClick={() => setModifier(Math.max(-MAX_MODIFIER, modifier - 1))}
                                            title="Lower the modifier"
                                            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-all text-gray-800"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <NumberField
                                            value={modifier}
                                            min={-MAX_MODIFIER}
                                            max={MAX_MODIFIER}
                                            onCommit={setModifier}
                                            format={(amount) => (amount > 0 ? `+${amount}` : String(amount))}
                                            title="Added to every quick roll"
                                            minChars={3}
                                            className="font-semibold tabular-nums"
                                        />
                                        <button
                                            onClick={() => setModifier(Math.min(MAX_MODIFIER, modifier + 1))}
                                            title="Raise the modifier"
                                            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded transition-all text-gray-800"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    {(["normal", "advantage", "disadvantage"] as RollMode[]).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setRollMode(mode)}
                                            className={`flex-1 px-1 py-1 rounded text-[11px] capitalize transition-all ${rollMode === mode
                                                ? "bg-brand-50 text-brand-700 border border-brand-500 font-medium"
                                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {TRAY_SIDES.map((sides) => (
                                        <button
                                            key={sides}
                                            onClick={() => rollTray(sides)}
                                            disabled={isRolling}
                                            className="aspect-square bg-black rounded-lg border border-white/20 shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                                        >
                                            {/* Glossy Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

                                            <div className="w-full h-full flex items-center justify-center p-1.5">
                                                <DiceGlyph sides={sides} />
                                            </div>
                                            <span className="absolute bottom-0.5 right-1 text-[13px] text-white/80 font-['Cinzel',serif] uppercase tracking-wider">
                                                D{sides}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Dice lines */}
                            <div className="space-y-2 pt-1 border-t border-gray-100">
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                                        Dice lines
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={rollStatArray}
                                            disabled={isRolling || !roomForStatArray}
                                            title={roomForStatArray
                                                ? "Add and roll six lines of 4d6 drop lowest"
                                                : `No room for ${STAT_ARRAY_SIZE} more lines`}
                                            className="flex items-center gap-1 px-2 h-6 rounded border border-gray-300 text-[11px] text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            Stat array
                                        </button>
                                        <button
                                            onClick={addLine}
                                            disabled={lines.length >= MAX_LINES}
                                            title={lines.length >= MAX_LINES ? `${MAX_LINES} lines is the limit` : "Add a line"}
                                            className="flex items-center gap-1 px-2 h-6 rounded border border-gray-300 text-[11px] text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                            Add line
                                        </button>
                                    </div>
                                </div>

                                <ul className="space-y-2 empty:hidden">
                                    {lines.map((line) => (
                                        <DiceLineRow
                                            key={line.id}
                                            line={line}
                                            pulse={pulses[line.id] ?? 0}
                                            busy={isRolling}
                                            canDuplicate={lines.length < MAX_LINES}
                                            onChange={(patch) => updateLine(line.id, patch)}
                                            onDuplicate={() => copyLine(line.id)}
                                            onRemove={() => removeLine(line.id)}
                                            onRoll={() => rollLines([line])}
                                        />
                                    ))}
                                </ul>

                                <button
                                    onClick={() => rollLines(lines)}
                                    disabled={isRolling || lines.length === 0}
                                    className="w-full py-2 rounded bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold tracking-widest font-['Cinzel',serif] transition-colors"
                                >
                                    ROLL ALL
                                </button>
                            </div>

                            {/* Log */}
                            <div className="pt-1 border-t border-gray-100">
                                <button
                                    onClick={() => setShowLog(!showLog)}
                                    className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-[12px] transition-colors"
                                >
                                    <ScrollText className="w-3.5 h-3.5" />
                                    {showLog ? "Hide" : "Show"} roll log ({log.length})
                                </button>

                                <AnimatePresence initial={false}>
                                    {showLog && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <DiceRollLog
                                                batches={log}
                                                onClear={() => {
                                                    setLog([]);
                                                    setHeadline(null);
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
            `}</style>
        </>
    );
}
