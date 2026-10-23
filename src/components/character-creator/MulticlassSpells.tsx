import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { AbilityScores, CharacterRuleset, Spell } from "../../types/dnd-types";
import { useSpells } from "../../hooks/useSanityData";
import { cantripsKnown, casterTypeOf, leveledSpellCount, maxSpellLevel } from "../../utils/spellcasting-progression";
import { multiclassSlotId, multiclassSpellClass, type MulticlassEntry } from "../../utils/multiclass";

const DEFAULT_CASTING_ABILITY: Record<string, keyof AbilityScores> = {
    artificer: "INT", bard: "CHA", cleric: "WIS", druid: "WIS", paladin: "CHA",
    ranger: "WIS", sorcerer: "CHA", warlock: "CHA", wizard: "INT",
};

/**
 * Spells for each class taken after the first. A multiclassed caster learns or
 * prepares each class's spells as if single-classed in it — its cantrips and
 * spell count, from its own list, up to the spell level its own levels reach.
 * The slots they are cast with pool across classes; the sheet works those out.
 */
export function MulticlassSpells({
    entries,
    ruleset,
    abilityScores,
    selectedSpells,
    onSpellsChange,
}: {
    entries: MulticlassEntry[];
    ruleset: CharacterRuleset;
    abilityScores: AbilityScores;
    selectedSpells: Spell[];
    onSpellsChange: (spells: Spell[]) => void;
}) {
    const { data: spells } = useSpells(ruleset);
    const casters = entries.filter((entry) => casterTypeOf(entry.class, entry.subclass) !== "none");
    if (casters.length === 0) return null;

    return (
        <div className="mt-10 space-y-6">
            <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-2xl font-bold text-white font-serif">Multiclass Spells</h3>
                <p className="text-sm text-gray-400">
                    Each further class learns its spells as if you had only its levels.
                </p>
            </div>
            {casters.map((entry) => (
                <ClassSpellPicker
                    key={entry.class.id}
                    entry={entry}
                    ruleset={ruleset}
                    abilityScores={abilityScores}
                    allSpells={spells ?? []}
                    selectedSpells={selectedSpells}
                    onSpellsChange={onSpellsChange}
                />
            ))}
        </div>
    );
}

function ClassSpellPicker({
    entry,
    ruleset,
    abilityScores,
    allSpells,
    selectedSpells,
    onSpellsChange,
}: {
    entry: MulticlassEntry;
    ruleset: CharacterRuleset;
    abilityScores: AbilityScores;
    allSpells: Spell[];
    selectedSpells: Spell[];
    onSpellsChange: (spells: Spell[]) => void;
}) {
    const [query, setQuery] = useState("");
    const classData = entry.class;
    const type = casterTypeOf(classData, entry.subclass);
    const highest = maxSpellLevel(type, entry.level, ruleset);
    const ability = classData.spellcastingAbility ?? DEFAULT_CASTING_ABILITY[classData.id] ?? "INT";
    const modifier = Math.floor(((abilityScores[ability] ?? 10) - 10) / 2);
    const capacity = {
        cantrips: cantripsKnown(classData, entry.level, entry.subclass),
        leveled: highest > 0 ? leveledSpellCount(classData, entry.level, ruleset, modifier, entry.subclass) : 0,
    };

    const picked = selectedSpells.filter((spell) => multiclassSpellClass(spell) === classData.id);
    const pickedCantrips = picked.filter((spell) => spell.level === 0);
    const pickedLeveled = picked.filter((spell) => spell.level > 0);
    const heldIds = new Set(selectedSpells.map((spell) => spell.id));

    const pool = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return allSpells
            .filter((spell) => (spell.classes ?? []).includes(classData.id))
            .filter((spell) => spell.level === 0 ? capacity.cantrips > 0 : spell.level <= highest)
            .filter((spell) => !needle || spell.name.toLowerCase().includes(needle))
            .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    }, [allSpells, classData.id, capacity.cantrips, highest, query]);

    const add = (spell: Spell) => {
        const cantrip = spell.level === 0;
        if (cantrip ? pickedCantrips.length >= capacity.cantrips : pickedLeveled.length >= capacity.leveled) return;
        onSpellsChange([...selectedSpells, {
            ...spell,
            selectionSource: "Multiclass",
            selectionSlotId: multiclassSlotId(classData.id, `${cantrip ? "cantrip" : "spell"}-${spell.id}`),
        }]);
    };
    const remove = (spell: Spell) =>
        onSpellsChange(selectedSpells.filter((held) => held.selectionSlotId !== spell.selectionSlotId));

    if (capacity.cantrips === 0 && capacity.leveled === 0) {
        return (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-gray-400">
                <span className="font-serif font-bold text-gray-200">{classData.name} {entry.level}</span> — no spells yet at this level.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h4 className="font-serif font-bold text-lg text-gray-100">{classData.name} {entry.level}</h4>
                <p className="text-xs text-gray-400">
                    Cantrips {pickedCantrips.length}/{capacity.cantrips}
                    {" · "}Spells {pickedLeveled.length}/{capacity.leveled}
                    {highest > 0 && ` (up to level ${highest})`}
                    {" · "}{ability}
                </p>
            </div>

            {picked.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {picked.map((spell) => (
                        <button
                            key={spell.selectionSlotId}
                            type="button"
                            onClick={() => remove(spell)}
                            title="Remove"
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border border-brand-500 bg-brand-900/40 text-brand-100"
                        >
                            {spell.name}{spell.level === 0 ? " (cantrip)" : ` (${spell.level})`} <X className="w-3 h-3" />
                        </button>
                    ))}
                </div>
            )}

            <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={`Search ${classData.name} spells...`}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-sm text-white placeholder-gray-500"
                />
            </div>
            <div className="max-h-56 overflow-y-auto overscroll-contain grid grid-cols-1 sm:grid-cols-2 gap-1.5 pr-1">
                {pool.map((spell) => {
                    const cantrip = spell.level === 0;
                    const full = cantrip ? pickedCantrips.length >= capacity.cantrips : pickedLeveled.length >= capacity.leveled;
                    const held = heldIds.has(spell.id);
                    return (
                        <button
                            key={spell.id}
                            type="button"
                            onClick={() => add(spell)}
                            disabled={held || full}
                            className="text-left px-2 py-1.5 rounded-md text-xs border border-zinc-800 text-gray-300 hover:border-brand-500/60 hover:text-white disabled:opacity-40 disabled:hover:border-zinc-800"
                        >
                            {spell.name}
                            <span className="text-gray-500"> · {cantrip ? "cantrip" : `level ${spell.level}`}{held ? " · known" : ""}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
