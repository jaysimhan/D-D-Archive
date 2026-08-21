import { Copy, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FIELD, NumberField } from "./DiceFields";
import {
    DIE_SIDES,
    maxKeepCount,
    notation,
    MAX_COUNT,
    MAX_MODIFIER,
    type DiceLine,
    type DieSides,
} from "../lib/dice";

/**
 * A dropdown sized by its own widest option. Pinning these to pixel widths
 * clipped the labels the moment the font resolved differently, and hiding the
 * native arrow to buy the space back only bought a second arrow — so the
 * control is left to measure itself.
 */
function Choice<T extends string | number>({
    value, options, onChange, title, disabled, className = "",
}: {
    value: T;
    options: { value: T; label: string }[];
    onChange: (next: string) => void;
    title?: string;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <select
            value={value}
            title={title}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className={`${FIELD} shrink-0 pl-1.5 pr-0.5 cursor-pointer ${className}`}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    );
}

export interface DiceLineRowProps {
    line: DiceLine;
    /** Invariants (drop count against pool size, and so on) are the parent's. */
    onChange: (patch: Partial<DiceLine>) => void;
    onDuplicate: () => void;
    onRemove: () => void;
    onRoll: () => void;
    canDuplicate: boolean;
    /** True while any roll is animating — a second one would cancel the first. */
    busy: boolean;
    /** Bumped by the parent on every roll, so a repeated total still pops. */
    pulse: number;
}

export function DiceLineRow({
    line, onChange, onDuplicate, onRemove, onRoll, canDuplicate, busy, pulse,
}: DiceLineRowProps) {
    const dropCeiling = maxKeepCount(line);

    return (
        <li className="rounded-lg border border-gray-200 bg-gray-50/70 p-2 space-y-2">
            {/* Name row */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange({ expanded: !line.expanded })}
                    title={line.expanded ? "Hide options" : "Show options"}
                    aria-expanded={line.expanded}
                    className="p-0.5 text-gray-400 hover:text-brand-600 transition-colors shrink-0"
                >
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${line.expanded ? "rotate-90" : ""}`} />
                </button>
                <input
                    type="text"
                    maxLength={22}
                    value={line.label}
                    placeholder={notation(line)}
                    onChange={(event) => onChange({ label: event.target.value })}
                    aria-label="Roll name"
                    className={`${FIELD} flex-1 min-w-0 px-2 font-medium placeholder:text-gray-400 placeholder:font-normal`}
                />
                <button
                    onClick={onDuplicate}
                    disabled={!canDuplicate}
                    title={canDuplicate ? "Duplicate line" : "Line limit reached"}
                    className="p-1 text-gray-400 hover:text-brand-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors shrink-0"
                >
                    <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={onRemove}
                    title="Remove line"
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors shrink-0"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Dice and modifier */}
            <div className="flex flex-wrap items-center gap-1">
                <NumberField
                    value={line.count}
                    min={1}
                    max={MAX_COUNT}
                    onCommit={(count) => onChange({ count })}
                    title="How many dice"
                    className="w-8"
                />
                <Choice
                    value={line.sides}
                    options={DIE_SIDES.map((sides) => ({ value: sides, label: `d${sides}` }))}
                    onChange={(next) => onChange({ sides: Number(next) as DieSides })}
                    title="Die"
                />
                <div className="flex items-center shrink-0" title="Modifier added to (or taken off) the roll">
                    <Choice
                        value={line.sign}
                        options={[{ value: 1, label: "+" }, { value: -1, label: "\u2212" }]}
                        onChange={(next) => onChange({ sign: Number(next) === -1 ? -1 : 1 })}
                        className="rounded-r-none border-r-0"
                    />
                    <NumberField
                        value={line.modifier}
                        min={0}
                        max={MAX_MODIFIER}
                        onCommit={(modifier) => onChange({ modifier })}
                        minChars={1}
                        className="rounded-l-none"
                    />
                </div>
                <Choice
                    value={line.modTarget}
                    options={[{ value: "total", label: "to total" }, { value: "each", label: "to each" }]}
                    onChange={(next) => onChange({ modTarget: next as DiceLine["modTarget"] })}
                    title="Apply the modifier once, or to every die that counts"
                />
            </div>

            {/* Advanced options */}
            <AnimatePresence initial={false}>
                {line.expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-1.5 pt-0.5">
                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={line.keepEnabled}
                                    onChange={(event) => onChange({ keepEnabled: event.target.checked })}
                                    aria-label="Drop or reroll dice"
                                    className="w-3.5 h-3.5 shrink-0 accent-brand-600"
                                />
                                <Choice
                                    value={line.keepMode}
                                    options={[{ value: "drop", label: "Drop" }, { value: "reroll", label: "Reroll" }]}
                                    onChange={(next) => onChange({ keepMode: next as DiceLine["keepMode"] })}
                                    disabled={!line.keepEnabled}
                                />
                                <Choice
                                    value={line.keepEnd}
                                    options={[{ value: "lowest", label: "lowest" }, { value: "highest", label: "highest" }]}
                                    onChange={(next) => onChange({ keepEnd: next as DiceLine["keepEnd"] })}
                                    disabled={!line.keepEnabled}
                                />
                                <NumberField
                                    value={line.keepCount}
                                    min={0}
                                    max={Math.max(dropCeiling, 1)}
                                    onCommit={(keepCount) => onChange({ keepCount })}
                                    disabled={!line.keepEnabled || dropCeiling === 0}
                                    title={dropCeiling === 0 ? "A single die has nothing to drop" : "How many dice"}
                                    className="w-8"
                                />
                                <span className="text-[11px] text-gray-500 italic">dice</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={line.limitEnabled}
                                    onChange={(event) => onChange({ limitEnabled: event.target.checked })}
                                    aria-label="Floor or ceiling per die"
                                    className="w-3.5 h-3.5 shrink-0 accent-brand-600"
                                />
                                <Choice
                                    value={line.limitMode}
                                    options={[{ value: "min", label: "Minimum" }, { value: "max", label: "Maximum" }]}
                                    onChange={(next) => onChange({ limitMode: next as DiceLine["limitMode"] })}
                                    disabled={!line.limitEnabled}
                                />
                                <span className="text-[11px] text-gray-500 italic">of</span>
                                <NumberField
                                    value={line.limitValue}
                                    min={1}
                                    max={line.sides}
                                    onCommit={(limitValue) => onChange({ limitValue })}
                                    disabled={!line.limitEnabled}
                                    className="w-8"
                                />
                                <span className="text-[11px] text-gray-500 italic">per die</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Result and roll */}
            <div className="flex items-center gap-2 pt-0.5">
                <div className="flex-1 min-w-0 text-right">
                    {line.result !== null && (
                        <motion.span
                            key={pulse}
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-block text-lg font-bold font-['Cinzel',serif] text-gray-800 leading-none"
                        >
                            {line.result}
                        </motion.span>
                    )}
                </div>
                <button
                    onClick={onRoll}
                    disabled={busy}
                    className="px-4 h-7 rounded bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-[12px] font-semibold tracking-wide transition-colors shrink-0"
                >
                    Roll
                </button>
            </div>
        </li>
    );
}
