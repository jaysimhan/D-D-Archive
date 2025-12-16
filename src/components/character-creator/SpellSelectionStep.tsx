import { useState, useMemo } from "react";
import { Search, User, Sparkles, Plus } from "lucide-react";
import { Class, Spell, Feat, Subclass, Race, Subrace } from "../../types/dnd-types";
import { SPELLS as expandedSpells } from "../../data/comprehensive-library";

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

    // Helper to determine Class Slots
    const getClassCapacities = () => {
        let cantrips = 0;
        let level1 = 0;
        let level2 = 0;

        // Class Logic (Beginner: Level 1-3)
        if (["bard", "druid", "warlock", "martyr", "apothecary"].includes(classData.id)) cantrips = 2;
        if (["cleric", "wizard", "sorcerer", "witch", "necromancer", "warmage", "blood-mage", "illrigger"].includes(classData.id)) cantrips = 3;
        if (classData.id === "warmage") cantrips = 4; // Warmages get more cantrips
        if (level >= 4 && ["bard", "druid", "sorcerer", "warlock", "wizard", "witch", "necromancer"].includes(classData.id)) cantrips += 1;

        // Spells Known / Prepared
        if (classData.id === "bard") level1 = level + 3;
        if (classData.id === "sorcerer") level1 = level + 1;
        if (classData.id === "warlock") level1 = level + 1;
        if (classData.id === "ranger" && level >= 2) level1 = level;
        if (["cleric", "druid", "wizard", "witch", "necromancer", "apothecary", "warmage", "blood-mage", "martyr", "illrigger"].includes(classData.id)) level1 = Math.max(1, level + 3);

        // Level 2 Spells
        if (["bard", "cleric", "druid", "sorcerer", "wizard", "witch", "necromancer", "apothecary", "blood-mage"].includes(classData.id) && level >= 3) {
            level2 = 2;
            level1 -= 1;
        }

        // Eldritch Knight & Arcane Trickster (Start at Level 3)
        if ((subclass?.id === "eldritch-knight" || subclass?.id === "arcane-trickster") && level >= 3) {
            cantrips = subclass.id === "arcane-trickster" ? 3 : 2;
            level1 = 3;
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
        // Create slots for this choice
        for (let i = 0; i < choice.choose; i++) {
            racialSlots.push({
                level: choice.level || 0, // Default to cantrip if not specified
                index: racialSlots.length,
                id: `race-${idx}-${i}`,
                source: "Racial",
                choiceIndex: idx // Track which choice block this slot belongs to
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
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    {showClassSelector && onMagicInitiateClassChange && (
                        <select
                            value={magicInitiateClass || ""}
                            onChange={(e) => onMagicInitiateClassChange(e.target.value)}
                            className="px-3 py-1 text-sm border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
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
                            <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                {lvl === 0 ? "Cantrips" : `Level ${lvl} Spells`}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {lvlSlots.map((slot) => {
                                    const globalLevelSpells = selectedSpells.filter(s => s.level === lvl);

                                    // Determine index in global list
                                    let spellIndex = slot.index;
                                    if (slot.source === "Feat") {
                                        // Offset by class capacity for this level
                                        const classCap = classCapacities[lvl === 0 ? "cantrips" : lvl === 1 ? "level1" : "level2"] || 0;
                                        spellIndex += classCap;
                                    }

                                    const filledSpell = globalLevelSpells[spellIndex];

                                    return (
                                        <div key={slot.id} className="relative group">
                                            {filledSpell ? (
                                                <div className="p-3 bg-white border-2 border-purple-200 rounded-lg shadow-sm hover:border-red-300 transition-colors flex justify-between items-center group-hover:bg-red-50">
                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-gray-900 truncate">{filledSpell.name}</div>
                                                        <div className="text-xs text-gray-500">{filledSpell.school}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeSpell(filledSpell.id)}
                                                        className="text-gray-400 hover:text-red-600 p-1 flex-shrink-0"
                                                    >
                                                        <User className="w-4 h-4 rotate-45" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setActiveSlot({ level: slot.level, index: slot.index, source: slot.source, choiceIndex: slot.choiceIndex })}
                                                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
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

    return (
        <div className="min-h-[500px]">
            <div className="text-center mb-6">
                <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h2 className="text-gray-900 text-2xl font-bold mb-2">Prepare Your Spells</h2>
                <p className="text-gray-600">Select spells for your available slots.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {(classSlots.length > 0) && renderSlotGroup(classSlots, `${classData?.name || "Class"} Spells`)}

                {hasMagicInitiate && renderSlotGroup(magicInitiateSlots, "Magic Initiate Spells", true)}

                {hasAberrantDragonmark && renderSlotGroup(aberrantSlots, "Aberrant Dragonmark Spells")}

                {hasRacialCantripChoice && renderSlotGroup(racialSlots, "Racial Spell Choices")}

                {/* Fixed Racial Spells Display */}
                {(() => {
                    // Derive known racial spells from new schema
                    const newKnownSpells = [
                        ...(race?.spells || []),
                        ...(subrace?.spells || [])
                    ].filter(s => (s.mode === 'fixed') && s.level <= level)
                        .flatMap(s => {
                            return (s.specificSpells || []).map(sp => ({
                                spellId: sp.id,
                                level: s.level,
                                abilityScore: s.ability,
                                type: s.recharge,
                                name: sp.name
                            }));
                        });

                    const knownRacialSpells = [
                        ...(race?.racialKnownSpells || []),
                        ...(subrace?.racialKnownSpells || []),
                        ...newKnownSpells
                    ].filter(s => s.level <= level); // Only show spells available at current level

                    if (knownRacialSpells.length === 0) return null;

                    return (
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-indigo-900">Innate Racial Magic</h3>
                            </div>
                            <p className="text-sm text-indigo-700 mb-4">
                                Your lineage grants you these spells automatically. They do not count against your class spells.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {knownRacialSpells.map((known, idx) => {
                                    const spell = expandedSpells.find(s => s.id === known.spellId) || { name: known.name || "Unknown Spell", id: known.spellId };
                                    if (!spell) return null;
                                    return (
                                        <div key={`${known.spellId}-${idx}`} className="p-3 bg-white border-2 border-indigo-300 rounded-lg opacity-90">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-semibold text-gray-900 truncate">{spell.name}</h4>
                                                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">Known</span>
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
                    racialChoice={activeSlot.source === "Racial" && (activeSlot as any).choiceIndex !== undefined
                        ? racialChoices[(activeSlot as any).choiceIndex]
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
            return expandedSpells.filter(s =>
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
            return expandedSpells.filter(s => {
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
        return expandedSpells.filter(s =>
            s.level === slotLevel &&
            s.classes.includes(targetClass) &&
            !currentSpells.find(existing => existing.id === s.id)
        );
    }, [classData, slotLevel, currentSpells, slotSource, magicInitiateClass, subclass, race, isDivineSoulSelection, divineSoulFilter, racialChoice]);

    const filtered = spells.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Recommendations
    const recommended = ["magic-missile", "shield", "cure-wounds", "healing-word", "bless", "hex", "hunter-s-mark", "fireball", "eldritch-blast", "guidance"];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 flex-wrap gap-2">
                    <h3 className="font-bold text-lg text-gray-900">
                        Select {slotLevel === 0 ? "Cantrip" : `Level ${slotLevel} Spell`}
                        {slotSource === "Magic Initiate" && magicInitiateClass && <span className="text-purple-600 ml-2">({magicInitiateClass})</span>}
                        {slotSource === "Aberrant Dragonmark" && <span className="text-red-600 ml-2">(Sorcerer)</span>}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full ml-auto">
                        <User className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Divine Soul Toggle */}
                {isDivineSoulSelection && (
                    <div className="px-4 pt-3 flex justify-center">
                        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                            <button
                                onClick={() => setDivineSoulFilter("all")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setDivineSoulFilter("sorcerer")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "sorcerer" ? "bg-purple-100 text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Sorcerer
                            </button>
                            <button
                                onClick={() => setDivineSoulFilter("cleric")}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "cleric" ? "bg-amber-100 text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Cleric
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-4 border-b bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search spells..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                    </div>
                    {slotSource === "Magic Initiate" && !magicInitiateClass && (
                        <div className="mt-2 text-sm text-red-500">
                            Please select a class for your Magic Initiate feat first.
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 grid grid-cols-1 gap-2">
                    {filtered.map(spell => {
                        const isRec = recommended.includes(spell.id) || spell.name.includes("Bolt");
                        return (
                            <button
                                key={spell.id}
                                onClick={() => onSelect(spell)}
                                className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                                        {spell.name}
                                        {isRec && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full border border-yellow-200">Rec.</span>}
                                    </div>
                                    <span className="text-xs text-gray-500">{spell.school}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{spell.description}</p>
                                {isDivineSoulSelection && (
                                    <div className="mt-1 flex gap-1">
                                        {spell.classes.includes("cleric") && <span className="text-[10px] px-1 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded">Cleric</span>}
                                        {spell.classes.includes("sorcerer") && <span className="text-[10px] px-1 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded">Sorcerer</span>}
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
