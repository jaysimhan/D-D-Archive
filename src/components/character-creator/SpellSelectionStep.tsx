import { useState, useMemo } from "react";
import { Search, User, Sparkles, Plus, Loader2 } from "lucide-react";
import { Class, Spell, Feat, Subclass, Race, Subrace } from "../../types/dnd-types";
import { useSpells } from "../../hooks/useSanityData";

// Spell Selection Step - Slot Based
export function SpellSelectionStep({
    classData,
    level,
    selectedSpells,
    onSpellsChange,
    feats,
    subclass,
    race,
    subrace, // Added subrace
    magicInitiateClass,
    onMagicInitiateClassChange
}: {
    classData: Class;
    level: number;
    selectedSpells: Spell[];
    onSpellsChange: (spells: Spell[]) => void;
    feats: Feat[];
    subclass?: Subclass;
    race?: Race;
    subrace?: Subrace;
    magicInitiateClass?: string;
    onMagicInitiateClassChange?: (cls: string) => void;
}) {
    const { data: allSpells, loading: spellsLoading } = useSpells();
    const [activeSlot, setActiveSlot] = useState<{ level: number, index: number, source: string, choiceIndex?: number } | null>(null);

    // Magic Initiate Detection
    const hasMagicInitiate = feats.some(f => f.name.includes("Magic Initiate"));
    const hasAberrantDragonmark = feats.some(f => f.name.includes("Aberrant Dragonmark"));

    // Racial Magic Detection
    const racialChoices = [
        ...(race?.racialSpellChoices || []),
        ...(subrace?.racialSpellChoices || []),
        // Map new schema 'choice' grants to the internal format
        ...(race?.spells || []).filter(s => s.mode === 'choice').map(s => ({
            choose: s.count || 1,
            name: s.name || "Racial Choice",
            level: s.spellLevel, // 0 for cantrip, 1+ for others
            list: s.specificSpells?.map(sp => sp.id) || [], // Specific IDs
            spellList: s.spellList, // Class list (e.g. "Wizard")
        })),
        ...(subrace?.spells || []).filter(s => s.mode === 'choice').map(s => ({
            choose: s.count || 1,
            name: s.name || "Racial Choice",
            level: s.spellLevel,
            list: s.specificSpells?.map(sp => sp.id) || [],
            spellList: s.spellList,
        }))
    ];
    const hasRacialCantripChoice = racialChoices.length > 0;

    const minLevelLabel = (type: string) => {
        return type === 'at-will' ? 'At Will' : type;
    };

    // Helper to determine Class Slots dynamically
    const getClassCapacities = () => {
        let cantrips = 0;
        let level1 = 0;
        let level2 = 0;

        const type = classData.spellcaster; // 'full', 'half', 'half-up', 'third', 'pact', 'none'
        const effectiveLevel = level;

        // If not a caster, return 0
        if (!type || type === 'none') {
            // Check manual override boolean just in case logic is mixed
            if (!classData.isSpellcaster) return { cantrips: 0, level1: 0, level2: 0 };
        }

        // Cantrips
        // Most full casters start with 3, some 2, some 4. This is hard to generalize perfectly without data field,
        // but we can make reasonable defaults based on type.
        // Or we can rely on specific fields in future. For now, we'll use a mix of type + ID override if needed.
        if (type === 'full') cantrips = 3;
        if (type === 'half') cantrips = 0; // Paladin/Ranger usually 0
        if (type === 'half-up') cantrips = 2; // Artificer
        if (type === 'third') cantrips = 2; // But usually AT/EK start at lvl 3
        if (type === 'pact') cantrips = 2;

        // Specific overrides for accuracy (still needed for exact 5e rules until we add 'cantripsKnown' to schema)
        if (["bard", "druid"].includes(classData.id)) cantrips = 2;
        if (classData.id === "warmage") cantrips = 4;
        if (level >= 4 && (type === 'full' || type === 'pact')) cantrips += 1;


        // Slot Logic
        if (type === 'pact') {
            // Warlock Logic
            level1 = level + 1; // 1 slot at lvl 1, 2 slots at lvl 2+
            if (level >= 2) level1 = 2;
            // Warlock slots upgrade level, they don't add strictly.
            // Beginner creator (1-3):
            // Lvl 1: 1 x 1st
            // Lvl 2: 2 x 1st
            // Lvl 3: 2 x 2nd
            if (level === 1) { level1 = 1; level2 = 0; }
            if (level === 2) { level1 = 2; level2 = 0; }
            if (level === 3) { level1 = 0; level2 = 2; }
        } else if (type === 'full' || type === 'half-up' || type === 'half' || type === 'third') {
            // Standard Progression
            let casterLevel = 0;
            if (type === 'full') casterLevel = level;
            if (type === 'half-up') casterLevel = Math.ceil(level / 2);
            if (type === 'half') casterLevel = Math.floor(level / 2);
            if (type === 'third') casterLevel = Math.floor(level / 3);

            // Level 1 Slots
            if (casterLevel >= 1) level1 = 2;
            if (casterLevel >= 2) level1 = 3;
            if (casterLevel >= 3) level1 = 4;

            // Level 2 Slots
            if (casterLevel >= 3) {
                level2 = 2;
                // Note: In 5e, slots are additive. You have 4 1st AND 2 2nd.
                // But this UI seems slot-selection based (known spells vs slots).
                // "Spells Known" (Bard/Sorc/Warlock) vs "Prepared" (Cleric/Druid/Wiz).
                // Existing logic seemed to try to calculate "Spells you can select".

                // Let's approximate "Spells Known/Prepared" count, not Spell Slots.
                // User selects spells to "prepare" or "know".

                // Full Casters (Prep): Lvl + Mod (assume +3)
                // Full Casters (Known): Bard/Sorc ~ Lvl + something.

                // Let's default to a generous "Standard Prep" formula for future proofing:
                // Level + 3. (Min 1).

                const baseCount = Math.max(1, effectiveLevel + 3);

                // Distribute reasonable split for UI
                level1 = baseCount;
                if (casterLevel >= 3) {
                    level2 = 2;
                    level1 = Math.max(1, baseCount - 2);
                }
            } else {
                // Low level
                level1 = Math.max(1, casterLevel + 2); // heuristic
                if (type === 'half' && casterLevel < 2) level1 = 0; // Paladin 1 has 0
                if (type === 'half' && casterLevel >= 2 && effectiveLevel >= 2) level1 = 2; // Paladin 2
            }
        }

        // Manual override for "Subclass Caster" (Third Caster logic usually handles this if class is updated, but if subclass adds it to non-caster class?)
        // E.g. Fighter (None) -> Eldritch Knight (Third).
        // If class is 'none' but subclass isSpellcaster?
        if (classData.spellcaster === 'none' && subclass?.isSpellcaster) {
            // Assume Third Caster
            const casterLevel = Math.floor(level / 3);
            if (casterLevel >= 1) { // Level 3+
                cantrips = 2;
                if (subclass.id === 'arcane-trickster') cantrips = 3;
                level1 = 3; // usually 3 known at lvl 3
            } else {
                cantrips = 0; level1 = 0; level2 = 0;
            }
        }

        return { cantrips, level1, level2 };
    };

    const classCapacities = getClassCapacities();

    const createSlots = (count: number, level: number, prefix: string, source: string) => {
        return Array.from({ length: count }).map((_, i) => ({
            level,
            index: i,
            id: `${prefix}-${i}`,
            source
        }));
    };

    const classSlots = [
        ...createSlots(classCapacities.cantrips, 0, "class-cantrip", "Class"),
        ...createSlots(classCapacities.level1, 1, "class-lvl1", "Class"),
        ...createSlots(classCapacities.level2, 2, "class-lvl2", "Class"),
    ];

    // Magic Initiate Slots
    const magicInitiateSlots = hasMagicInitiate ? [
        ...createSlots(2, 0, "feat-mi-cantrip", "Magic Initiate"),
        ...createSlots(1, 1, "feat-mi-lvl1", "Magic Initiate")
    ] : [];

    // Aberrant Dragonmark Slots
    const aberrantSlots = hasAberrantDragonmark ? [
        ...createSlots(1, 0, "feat-ab-cantrip", "Aberrant Dragonmark"),
        ...createSlots(1, 1, "feat-ab-lvl1", "Aberrant Dragonmark")
    ] : [];

    // Racial Spell Slots
    const racialSlots: { level: number, index: number, id: string, source: string, choiceIndex: number }[] = [];
    racialChoices.forEach((choice, idx) => {
        for (let i = 0; i < choice.choose; i++) {
            racialSlots.push({
                level: choice.level || 0,
                index: racialSlots.length,
                id: `race-${idx}-${i}`,
                source: "Racial",
                choiceIndex: idx
            });
        }
    });

    // Subclass Spell Slots (Choices)
    // Separate from Racial Slots for cleaner UI
    const subclassChoiceSlots: { level: number, index: number, id: string, source: string, choiceIndex: number }[] = [];
    const subclassChoices = [
        ...(subclass?.spells || []).filter(s => s.mode === 'choice').map(s => ({
            choose: s.count || 1,
            name: s.name || "Subclass Choice",
            level: s.spellLevel,
            list: s.specificSpells?.map(sp => sp.id) || [],
            spellList: s.spellList,
        }))
    ];

    subclassChoices.forEach((choice, idx) => {
        for (let i = 0; i < choice.choose; i++) {
            subclassChoiceSlots.push({
                level: choice.level || 0,
                index: subclassChoiceSlots.length, // local index
                id: `subclass-choice-${idx}-${i}`,
                source: "Subclass",
                choiceIndex: idx
            });
        }
    });


    const removeSpell = (spellId: string) => {
        onSpellsChange(selectedSpells.filter(s => s.id !== spellId));
    };

    const selectSpell = (spell: Spell) => {
        onSpellsChange([...selectedSpells, spell]);
        setActiveSlot(null);
    };

    const renderSlotGroup = (slots: any[], title: string, showClassSelector = false) => {
        if (slots.length === 0) return null;

        // Group slots by level for display within this section
        const levels = Array.from(new Set(slots.map(s => s.level))).sort((a, b) => a - b);

        return (
            <div className="bg-zinc-900/40 p-6 rounded-xl border border-zinc-800 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-200">{title}</h3>
                    {showClassSelector && onMagicInitiateClassChange && (
                        <select
                            value={magicInitiateClass || ""}
                            onChange={(e) => onMagicInitiateClassChange(e.target.value)}
                            className="px-3 py-1 text-sm bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:outline-none focus:border-brand-500 text-gray-200"
                        >
                            <option value="" disabled>Select Class...</option>
                            <option value="bard">Bard</option>
                            <option value="cleric">Cleric</option>
                            <option value="druid">Druid</option>
                            <option value="sorcerer">Sorcerer</option>
                            <option value="warlock">Warlock</option>
                            <option value="wizard">Wizard</option>
                        </select>
                    )}
                </div>

                {levels.map(lvl => {
                    const lvlSlots = slots.filter(s => s.level === lvl);
                    return (
                        <div key={lvl} className="mb-4 last:mb-0">
                            <h4 className="text-sm font-semibold text-brand-400 mb-2 uppercase tracking-wide">
                                {lvl === 0 ? "Cantrips" : `Level ${lvl} Spells`}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {lvlSlots.map((slot) => {
                                    const globalLevelSpells = selectedSpells.filter(s => s.level === lvl);

                                    // Determine index in global list (simplified for robustness)
                                    // Actually, distinct Source groups make 'index' logic tricky if we rely on global position.
                                    // Better to just check if THIS slot ID has a mapped spell?
                                    // Current logic stores full Spell objects in selectedSpells, not mapped to Slot IDs.
                                    // It relies on Count match: "You have 3 Level 1 selected, fill the first 3 slots".
                                    // This breaks if we have multiple groups of Level 1 slots (Class + Race).

                                    // FIX: We need to filter selectedSpells by SOURCE if possible, or just rely on global "fill from top" behavior per level?
                                    // "fill from top" is chaotic with multiple groups.
                                    // Ideally, we should tag selected spells with their source slot.
                                    // BUt `selectedSpells` is just `Spell[]`.
                                    // The `CharacterSheet` and `finalData` probably don't track which slot a spell is in.

                                    // Compromise:
                                    // We will count how many spells of this Level are already "claimed" by previous Groups/Slots
                                    // and display the remainder here.

                                    // NO, that's getting complex.
                                    // Existing behavior:
                                    // let spellIndex = slot.index; 
                                    // if (Feat) spellIndex += classCap;

                                    // This assumes a strict order: Class -> Feat -> ...
                                    // If we keep strict order of rendering, we can maintain this offset logic.

                                    // Order: Class -> MagicInit -> Aberrant -> Racial -> Subclass
                                    let offset = 0;
                                    if (classSlots.length > 0) {
                                        // Count how many slots of THIS level are in classSlots
                                        offset += classSlots.filter(s => s.level === lvl).length;
                                    }
                                    if (slot.source === "Magic Initiate" || slot.source === "Aberrant Dragonmark" || slot.source === "Racial" || slot.source === "Subclass") {
                                        // If we are NOT class, we skip class slots.
                                        // If we are Aberrant, skip MagicInit too?
                                        // This is getting messy defined locally.
                                    }

                                    // Better Clean approach:
                                    // Calculate global offset for this specific slot ID based on our defined order.

                                    const allSlotsCombined = [
                                        ...classSlots,
                                        ...magicInitiateSlots,
                                        ...aberrantSlots,
                                        ...racialSlots,
                                        ...subclassChoiceSlots
                                    ];

                                    const slotsOfSameLevel = allSlotsCombined.filter(s => s.level === lvl);
                                    const myGlobalIndexForLevel = slotsOfSameLevel.findIndex(s => s.id === slot.id);

                                    const filledSpell = globalLevelSpells[myGlobalIndexForLevel];

                                    return (
                                        <div key={slot.id} className="relative group">
                                            {filledSpell ? (
                                                <div className="p-3 bg-zinc-800 border-2 border-zinc-700 rounded-lg shadow-sm hover:border-brand-500/50 transition-colors flex justify-between items-center group-hover:bg-zinc-800/80">
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-gray-200 truncate">{filledSpell.name}</div>
                                                        <div className="text-xs text-gray-500">{filledSpell.school}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSpell(filledSpell.id)}
                                                        className="text-gray-500 hover:text-red-400 p-1 flex-shrink-0"
                                                    >
                                                        <User className="w-4 h-4 rotate-45" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveSlot({
                                                        level: slot.level,
                                                        index: slot.index,
                                                        source: slot.source,
                                                        choiceIndex: slot.choiceIndex
                                                    })}
                                                    className="w-full p-3 border-2 border-dashed border-zinc-700 rounded-lg text-gray-500 hover:border-brand-500 hover:text-brand-400 hover:bg-brand-900/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Select</span>
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Check if character has any spellcasting ability (Updated for Future Proofing)
    // FIX: Explicitly check for 'none' or missing spellcaster field to avoid treating undefined as a caster.
    const isClassCaster = classData?.isSpellcaster || (classData?.spellcaster && classData.spellcaster !== 'none');

    const hasSpellcasting = isClassCaster ||
        (subclass?.isSpellcaster) ||
        hasMagicInitiate ||
        hasAberrantDragonmark ||
        hasRacialCantripChoice ||
        (race?.racialKnownSpells && race.racialKnownSpells.length > 0) ||
        (subrace?.racialKnownSpells && subrace.racialKnownSpells.length > 0) ||
        (race?.spells && race.spells.length > 0) ||
        (subrace?.spells && subrace.spells.length > 0) ||
        (subclass?.spells && subclass.spells.length > 0);

    const totalSlots = classSlots.length + magicInitiateSlots.length + aberrantSlots.length + racialSlots.length + subclassChoiceSlots.length;

    // Check for fixed racial spells that would be displayed
    const hasFixedSpells = (race?.racialKnownSpells && race.racialKnownSpells.length > 0) ||
        (subrace?.racialKnownSpells && subrace.racialKnownSpells.length > 0) ||
        (race?.spells && race.spells.some(s => s.mode === 'fixed')) ||
        (subrace?.spells && subrace.spells.some(s => s.mode === 'fixed')) ||
        (subclass?.spells && subclass.spells.some(s => s.mode === 'fixed'));

    // If no slots to display AND no fixed spells, show the "No Spellcasting" message
    if (totalSlots === 0 && !hasFixedSpells) {
        return (
            <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-6">
                    <Sparkles className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <h2 className="text-gray-200 text-2xl font-bold mb-2 font-serif">Spells</h2>
                    <p className="text-gray-400">Review your spellcasting abilities.</p>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center">
                        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-zinc-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Spellcasting</h3>
                        <p className="text-gray-500 mb-4 max-w-md mx-auto">
                            Your current class, subclass, and race do not grant any spellcasting abilities.
                            You can proceed to the next step.
                        </p>
                        <div className="text-sm text-gray-600">
                            <p>
                                Spellcasting can be gained through:
                            </p>
                            <ul className="mt-2 space-y-1">
                                <li>• Choosing a spellcasting class (Wizard, Cleric, Bard, etc.)</li>
                                <li>• Selecting a spellcasting subclass (Eldritch Knight, Arcane Trickster, etc.)</li>
                                <li>• Taking the Magic Initiate or similar feats</li>
                                <li>• Choosing a race with innate spellcasting</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 text-brand-500 mx-auto mb-3" />
                <h2 className="text-brand-400 text-2xl font-bold mb-2 font-serif">Prepare Your Spells</h2>
                <p className="text-gray-400">Select spells for your available slots.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {(classSlots.length > 0) && renderSlotGroup(classSlots, `${classData?.name || "Class"} Spells`)}

                {hasMagicInitiate && renderSlotGroup(magicInitiateSlots, "Magic Initiate Spells", true)}

                {hasAberrantDragonmark && renderSlotGroup(aberrantSlots, "Aberrant Dragonmark Spells")}

                {hasRacialCantripChoice && renderSlotGroup(racialSlots, "Racial Spell Choices")}

                {subclassChoiceSlots.length > 0 && renderSlotGroup(subclassChoiceSlots, `${subclass?.name || "Subclass"} Spell Choices`)}

                {/* Fixed Racial Spells Display */}
                {(() => {
                    // Racial Fixed Spells
                    const newRacialSpells = [
                        ...(race?.spells || []),
                        ...(subrace?.spells || [])
                    ].filter(s => (s.mode === 'fixed') && s.level <= level)
                        .flatMap(s => {
                            return (s.specificSpells || []).map(sp => ({
                                spellId: sp.id,
                                level: s.level,
                                abilityScore: s.ability,
                                type: s.recharge,
                                name: sp.name,
                                source: "Racial"
                            }));
                        });

                    const knownRacialSpells = [
                        ...(race?.racialKnownSpells || []),
                        ...(subrace?.racialKnownSpells || []),
                        ...newRacialSpells
                    ].filter(s => s.level <= level);

                    if (knownRacialSpells.length === 0) return null;

                    return (
                        <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-indigo-300">Racial Spells</h3>
                            </div>
                            <p className="text-sm text-indigo-400 mb-4">
                                Your lineage grants you these spells automatically.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {knownRacialSpells.map((known, idx) => {
                                    const spell = allSpells.find(s => s.id === known.spellId) || { name: known.name || "Unknown Spell", id: known.spellId };
                                    if (!spell) return null;
                                    return (
                                        <div key={`race-${known.spellId}-${idx}`} className="p-3 bg-zinc-900 border border-indigo-500/50 rounded-lg">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-gray-200 truncate">{spell.name}</h4>
                                                <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/50">Known</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {minLevelLabel(known.type || "at-will")} {known.abilityScore ? `(Ability: ${known.abilityScore})` : ''}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                {/* Fixed Subclass Spells Display */}
                {(() => {
                    // Subclass Fixed Spells
                    const knownSubclassSpells = [
                        ...(subclass?.spells || [])
                    ].filter(s => (s.mode === 'fixed') && s.level <= level)
                        .flatMap(s => {
                            return (s.specificSpells || []).map(sp => ({
                                spellId: sp.id,
                                level: s.level,
                                abilityScore: s.ability,
                                type: s.recharge,
                                name: sp.name,
                                source: "Subclass"
                            }));
                        });

                    if (knownSubclassSpells.length === 0) return null;

                    return (
                        <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/30 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-purple-300">Subclass Spells</h3>
                            </div>
                            <p className="text-sm text-purple-400 mb-4">
                                Your subclass grants you these spells automatically.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {knownSubclassSpells.map((known, idx) => {
                                    const spell = allSpells.find(s => s.id === known.spellId) || { name: known.name || "Unknown Spell", id: known.spellId };
                                    if (!spell) return null;
                                    return (
                                        <div key={`sub-${known.spellId}-${idx}`} className="p-3 bg-zinc-900 border border-purple-500/50 rounded-lg">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-gray-200 truncate">{spell.name}</h4>
                                                <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/50">Known</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {minLevelLabel(known.type || "always")} {known.abilityScore ? `(Ability: ${known.abilityScore})` : ''}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Spell Selection Modal */}
            {activeSlot !== null && (
                <SpellSelectionModal
                    classData={classData}
                    slotLevel={activeSlot.level}
                    slotSource={activeSlot.source}
                    onSelect={selectSpell}
                    onClose={() => setActiveSlot(null)}
                    currentSpells={selectedSpells}
                    magicInitiateClass={magicInitiateClass}
                    subclass={subclass}
                    race={race}
                    subrace={subrace}
                    allSpells={allSpells}
                    racialChoice={activeSlot.source === "Racial" && (activeSlot as any).choiceIndex !== undefined
                        ? racialChoices[(activeSlot as any).choiceIndex]
                        : activeSlot.source === "Subclass" && (activeSlot as any).choiceIndex !== undefined
                            ? subclassChoices[(activeSlot as any).choiceIndex]
                            : undefined}
                />
            )}
        </div>
    );
}

function SpellSelectionModal({
    classData,
    slotLevel,
    slotSource,
    onSelect,
    onClose,
    currentSpells,
    magicInitiateClass,
    subclass,
    race,
    subrace,
    allSpells,
    racialChoice
}: {
    classData: Class;
    slotLevel: number;
    slotSource: string;
    onSelect: (s: Spell) => void;
    onClose: () => void;
    currentSpells: Spell[];
    magicInitiateClass?: string;
    subclass?: Subclass;
    race?: Race;
    subrace?: Subrace; // Add subrace prop
    allSpells: Spell[];
    racialChoice?: { list: string[]; name: string; school?: string; level?: number; spellList?: string }; // Specific choice block
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [divineSoulFilter, setDivineSoulFilter] = useState<"all" | "sorcerer" | "cleric">("all");

    // Determine if this is a Divine Soul selection scenario
    const isDivineSoulSelection = classData.id === "sorcerer" && subclass?.id === "divine-soul" && slotSource === "Class";

    // Available spells filter
    const spells = useMemo(() => {
        let targetClass = classData.id;

        // Subclass Logic: Eldritch Knight & Arcane Trickster use Wizard list
        if (subclass?.id === "eldritch-knight" || subclass?.id === "arcane-trickster") {
            targetClass = "wizard";
        }

        // specialized logic for Divine Soul Class Slots
        if (isDivineSoulSelection) {
            return allSpells.filter(s =>
                s.level === slotLevel &&
                !currentSpells.find(existing => existing.id === s.id) &&
                (
                    divineSoulFilter === "all" ? (s.classes.includes("sorcerer") || s.classes.includes("cleric")) :
                        divineSoulFilter === "sorcerer" ? s.classes.includes("sorcerer") :
                            divineSoulFilter === "cleric" ? s.classes.includes("cleric") : false
                )
            );
        }

        // If selecting for Feat, use the chosen magic initiate class
        if (slotSource === "Magic Initiate") {
            if (!magicInitiateClass) return []; // No spells if class not selected
            targetClass = magicInitiateClass;
        }

        if (slotSource === "Aberrant Dragonmark") {
            targetClass = "sorcerer";
        }

        // Racial Logic
        if (slotSource === "Racial" && racialChoice) {
            return allSpells.filter(s => {
                // Check level cap
                if (racialChoice.level !== undefined && s.level > racialChoice.level) return false;
                if (racialChoice.level === undefined && s.level !== 0) return false; // Default to cantrip

                // Check list/criteria (specific IDs) - PRIORITIZE if exists
                if (racialChoice.list.length > 0) {
                    const matchesSpecific = racialChoice.list.some(criteria => {
                        if (criteria.startsWith("cantrip:")) {
                            const cls = criteria.split(":")[1];
                            return s.level === 0 && s.classes.includes(cls);
                        }
                        if (criteria === "any") return true;
                        // Exact ID match
                        return s.id === criteria;
                    });
                    return matchesSpecific && !currentSpells.find(existing => existing.id === s.id);
                }

                // Check spellList (Class List) e.g. "Wizard"
                if (racialChoice.spellList) {
                    const targetList = racialChoice.spellList.toLowerCase();
                    const matchesClass = s.classes.includes(targetList);
                    if (!matchesClass) return false;
                    return !currentSpells.find(existing => existing.id === s.id);
                }
                return false; // No matching criteria
            });
        }

        // Default: Class spell selection (targetClass already set above)
        return allSpells.filter(s =>
            s.level === slotLevel &&
            s.classes.includes(targetClass) &&
            !currentSpells.find(existing => existing.id === s.id)
        );
    }, [classData, slotLevel, currentSpells, slotSource, magicInitiateClass, subclass, race, isDivineSoulSelection, divineSoulFilter, racialChoice, allSpells]);

    const filtered = spells.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Recommendations
    const recommended = ["magic-missile", "shield", "cure-wounds", "healing-word", "bless", "hex", "hunter-s-mark", "fireball", "eldritch-blast", "guidance"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden border border-zinc-800">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 flex-wrap gap-2">
                    <h3 className="font-bold text-lg text-gray-100">
                        Select {slotLevel === 0 ? "Cantrip" : `Level ${slotLevel} Spell`}
                        {slotSource === "Magic Initiate" && magicInitiateClass && <span className="text-brand-400 ml-2">({magicInitiateClass})</span>}
                        {slotSource === "Aberrant Dragonmark" && <span className="text-red-400 ml-2">(Sorcerer)</span>}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full ml-auto text-gray-400 hover:text-white">
                        <User className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Divine Soul Toggle */}
                {isDivineSoulSelection && (
                    <div className="px-4 pt-3 flex justify-center">
                        <div className="bg-zinc-800 p-1 rounded-lg flex gap-1">
                            <button
                                onClick={() => setDivineSoulFilter("all")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "all" ? "bg-zinc-700 text-brand-300 shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setDivineSoulFilter("sorcerer")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "sorcerer" ? "bg-purple-900/50 text-purple-300 shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                Sorcerer
                            </button>
                            <button
                                onClick={() => setDivineSoulFilter("cleric")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "cleric" ? "bg-amber-900/50 text-amber-300 shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
                            >
                                Cleric
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-4 border-b border-zinc-800 bg-zinc-900">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search spells..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-white placeholder-gray-500"
                        />
                    </div>
                    {slotSource === "Magic Initiate" && !magicInitiateClass && (
                        <div className="mt-2 text-sm text-red-500">
                            Please select a class for your Magic Initiate feat first.
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-zinc-950/50 grid grid-cols-1 gap-2">
                    {filtered.map(spell => {
                        const isRec = recommended.includes(spell.id) || spell.name.includes("Bolt");
                        return (
                            <button
                                key={spell.id}
                                onClick={() => onSelect(spell)}
                                className="text-left p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-brand-500 hover:bg-zinc-800 transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="font-semibold text-gray-200 flex items-center gap-2 group-hover:text-brand-400 transition-colors">
                                        {spell.name}
                                        {isRec && <span className="text-xs bg-yellow-900/30 text-yellow-500 px-1.5 py-0.5 rounded-full border border-yellow-700/50">Rec.</span>}
                                    </div>
                                    <span className="text-xs text-gray-500">{spell.school}</span>
                                </div>
                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{spell.description}</p>
                                {isDivineSoulSelection && (
                                    <div className="mt-1 flex gap-1">
                                        {spell.classes.includes("cleric") && <span className="text-xs px-1 py-0.5 bg-amber-900/30 text-amber-500 border border-amber-800/50 rounded">Cleric</span>}
                                        {spell.classes.includes("sorcerer") && <span className="text-xs px-1 py-0.5 bg-purple-900/30 text-purple-500 border border-purple-800/50 rounded">Sorcerer</span>}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    {filtered.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {slotSource === "Magic Initiate" && !magicInitiateClass ? "Select a class above." : `No spells found matching "${searchTerm}"`}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
