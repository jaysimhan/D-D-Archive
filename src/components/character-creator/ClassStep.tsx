import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Class } from "../../types/dnd-types";
import { useClasses, useSubclasses } from "../../hooks/useSanityData";
import { urlFor } from "../../lib/sanity";


// Class Step with Search - Limited to Level 1-3
export function ClassStep({
    selected,
    level,
    onSelect,
    onLevelChange,
}: {
    selected?: Class;
    level: number;
    onSelect: (classData: Class) => void;
    onLevelChange: (level: number) => void;
}) {
    const getSubclassLevel = (classId: string): number => {
        const level1 = ["cleric", "sorcerer", "warlock"];
        const level2 = ["druid", "wizard"];
        if (level1.includes(classId)) return 1;
        if (level2.includes(classId)) return 2;
        return 3; // Default for others (Artificer, Barbarian, Bard, Fighter, Monk, Paladin, Ranger, Rogue, and homebrew)
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [showNonCore, setShowNonCore] = useState(false);

    // Fetch subclasses for details display
    const { data: sanitySubclasses } = useSubclasses();
    const allSubclasses = useMemo(() => sanitySubclasses || [], [sanitySubclasses]);

    const relatedSubclasses = useMemo(() => {
        if (!selected) return [];
        return allSubclasses.filter(s => s.parentClassId === selected.id);
    }, [selected, allSubclasses]);

    // Fetch classes from Sanity
    const { data: sanityClasses, loading: classesLoading } = useClasses();
    const allClasses = useMemo(() => sanityClasses || [], [sanityClasses]);

    const filteredClasses = useMemo(() => {
        let classes = allClasses;

        // Filter non-core if needed
        if (!showNonCore) {
            classes = classes.filter(c => c.source === "Player's Handbook" || c.source === "Official");
        }

        // Filter by search term
        return classes.filter((classData) =>
            classData.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allClasses, showNonCore]);

    // Use the class from allClasses to ensure we have Sanity image data
    const displayedClass = selected ? allClasses.find(c => c.id === selected.id) || selected : undefined;

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-white text-3xl font-bold mb-2 font-serif">Choose Your Class</h2>
                <p className="text-gray-400">Select your character's profession and level (1-3)</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
                {/* Left Column: Grid */}
                <div className="flex-1 w-full">
                    {/* Toggle and Level Selector Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        {/* Level Selector */}
                        <div className="max-w-xs">
                            <label className="block text-gray-300 font-medium mb-2">
                                Character Level (Beginner: 1-3)
                            </label>
                            <div className="flex items-center w-full bg-zinc-900/50 border border-zinc-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
                                <button
                                    onClick={() => onLevelChange(Math.max(1, level - 1))}
                                    disabled={level <= 1}
                                    className={`px-4 py-2 text-xl font-bold transition-colors ${level <= 1 ? 'text-zinc-600 cursor-not-allowed' : 'text-gray-300 hover:bg-zinc-800 hover:text-white'}`}
                                >
                                    -
                                </button>
                                <div className="flex-1 text-center py-2 text-lg font-semibold text-white border-l border-r border-zinc-700/50">
                                    {level}
                                </div>
                                <button
                                    onClick={() => onLevelChange(Math.min(3, level + 1))}
                                    disabled={level >= 3}
                                    className={`px-4 py-2 text-xl font-bold transition-colors ${level >= 3 ? 'text-zinc-600 cursor-not-allowed' : 'text-gray-300 hover:bg-zinc-800 hover:text-white'}`}
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Limited to levels 1-3 for beginner characters</p>
                        </div>

                        {/* Non-core Toggle */}
                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={showNonCore} onChange={e => setShowNonCore(e.target.checked)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${showNonCore ? 'bg-brand-600' : 'bg-zinc-700'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showNonCore ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-300 group-hover:text-brand-400 transition-colors">Enable non-core classes</div>
                        </label>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search classes..."
                            className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
                        />
                    </div>

                    {showNonCore ? (
                        <ScrollArea className="h-[500px] rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                            <div className="p-4">
                                {classesLoading ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {Array.from({ length: 9 }).map((_, i) => (
                                            <div key={i} className="px-2 py-3 rounded-lg bg-zinc-900/50 animate-pulse h-24 flex flex-col items-center justify-center gap-2 border border-zinc-800">
                                                <div className="h-5 w-20 bg-zinc-800 rounded"></div>
                                                <div className="h-4 w-14 bg-zinc-800 rounded-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {filteredClasses.map((classData) => {
                                            const isActive = selected?.id === classData.id;
                                            return (
                                                <button
                                                    key={classData.id}
                                                    onClick={() => onSelect(classData)}
                                                    className={`
                        px-2 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center text-center h-24
                        ${isActive
                                                            ? 'bg-brand-900/40 text-brand-100 shadow-[0_0_15px_rgba(220,38,38,0.3)] ring-1 ring-offset-0 ring-brand-500 border border-brand-500'
                                                            : 'bg-zinc-900/40 text-gray-400 border border-zinc-800 hover:bg-zinc-800 hover:border-brand-500/50 hover:text-gray-200'
                                                        }
                      `}
                                                >
                                                    <span className="font-bold text-lg mb-1 font-serif">{classData.name}</span>
                                                    {classData.spellcaster && classData.spellcaster !== "None" && classData.spellcaster !== "none" && (
                                                        <span className={`text-xs px-2 py-1 rounded-full ${isActive ? 'bg-brand-500 text-white' : 'bg-zinc-800 text-brand-400 border border-brand-900/30'}`}>
                                                            {classData.spellcaster}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                            <div className="p-4">
                                {classesLoading ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {Array.from({ length: 9 }).map((_, i) => (
                                            <div key={i} className="px-2 py-3 rounded-lg bg-zinc-900/50 animate-pulse h-24 flex flex-col items-center justify-center gap-2 border border-zinc-800">
                                                <div className="h-5 w-20 bg-zinc-800 rounded"></div>
                                                <div className="h-4 w-14 bg-zinc-800 rounded-full"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                        {filteredClasses.map((classData) => {
                                            const isActive = selected?.id === classData.id;
                                            return (
                                                <button
                                                    key={classData.id}
                                                    onClick={() => onSelect(classData)}
                                                    className={`
                        px-2 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center text-center h-24
                        ${isActive
                                                            ? 'bg-brand-900/40 text-brand-100 shadow-[0_0_15px_rgba(220,38,38,0.3)] ring-1 ring-offset-0 ring-brand-500 border border-brand-500'
                                                            : 'bg-zinc-900/40 text-gray-400 border border-zinc-800 hover:bg-zinc-800 hover:border-brand-500/50 hover:text-gray-200'
                                                        }
                      `}
                                                >
                                                    <span className="font-bold text-lg mb-1 font-serif">{classData.name}</span>
                                                    {classData.spellcaster && classData.spellcaster !== "None" && classData.spellcaster !== "none" && (
                                                        <span className={`text-xs px-2 py-1 rounded-full ${isActive ? 'bg-brand-500 text-white' : 'bg-zinc-800 text-brand-400 border border-brand-900/30'}`}>
                                                            {classData.spellcaster}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Details Panel */}
                <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-zinc-900/60 backdrop-blur-sm border border-brand-900/30 rounded-xl shadow-xl min-h-[400px]">
                    {selected ? (
                        <div className="animate-in fade-in duration-200">
                            {/* Image Section */}
                            <div className="w-full aspect-[3/2] bg-black/40 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative border border-zinc-800">
                                {displayedClass?.image || displayedClass?.imageUrl ? (
                                    <img
                                        src={(displayedClass.image ? urlFor(displayedClass.image)?.url() : '') || displayedClass.imageUrl || ''}
                                        alt={displayedClass.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <div className="text-center p-4">
                                            <User className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                                            <span className="text-xs text-zinc-600">Class Icon</span>
                                        </div>
                                        <img
                                            src={`/images/classes/${selected.id}.jpg`}
                                            alt={selected.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-3xl font-bold text-white text-brand-500 font-serif">{selected.name}</h3>
                                {selected.spellcaster && selected.spellcaster !== "None" && selected.spellcaster !== "none" && (
                                    <span className="text-xs px-2 py-1 bg-brand-900/30 text-brand-300 border border-brand-500/30 rounded-full font-semibold">
                                        {selected.spellcaster} Caster
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs px-2 py-1 bg-red-900/20 text-red-400 border border-red-900/30 rounded-full font-semibold">
                                    Hit Die: d{selected.hitDie}
                                </span>
                                <span className="text-xs px-2 py-1 bg-zinc-800 text-gray-400 border border-zinc-700 rounded-full">
                                    {selected.edition}
                                </span>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6 text-sm">{selected.description}</p>

                            <div className="pt-4 border-t border-brand-900/30 space-y-3">
                                <div>
                                    <h4 className="font-bold text-brand-400 text-sm">Primary Ability</h4>
                                    <p className="text-sm text-gray-300">{selected.primaryAbility.join(" or ")}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-400 text-sm">Saving Throws</h4>
                                    <p className="text-sm text-gray-300">{selected.savingThrows.join(", ")}</p>
                                </div>
                            </div>

                            {relatedSubclasses.length > 0 && (
                                <div className="pt-4 border-t border-brand-900/30 mt-4">
                                    <h4 className="font-bold text-gray-200 text-sm mb-2 flex items-center justify-between">
                                        Available Subclasses
                                        <span className="ml-2 text-xs font-normal text-gray-500 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                                            Features unlock at Lv {getSubclassLevel(selected.id)}
                                        </span>
                                    </h4>
                                    <p className="text-xs text-brand-400/80 mb-3 font-medium italic">
                                        You chose your subclass at Level {getSubclassLevel(selected.id)}
                                    </p>
                                    <div className="space-y-3">
                                        {relatedSubclasses.map(sub => {
                                            const hasSpellcasting = sub.spellcaster || sub.magicType;
                                            return (
                                                <div
                                                    key={sub.id}
                                                    className={`p-3 rounded-lg border ${hasSpellcasting
                                                        ? 'bg-zinc-900/80 border-brand-500/30 shadow-inner shadow-brand-900/10'
                                                        : 'bg-zinc-900/40 border-zinc-800'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className={`font-serif font-semibold text-sm ${hasSpellcasting ? 'text-brand-300' : 'text-gray-300'}`}>{sub.name}</h5>
                                                        {hasSpellcasting && (
                                                            <span className="text-xs px-2 py-0.5 bg-brand-900/50 text-brand-200 border border-brand-500/30 rounded-full font-semibold flex items-center gap-1 ml-auto">
                                                                ✨ Spellcaster
                                                            </span>
                                                        )}
                                                    </div>
                                                    {sub.magicType && (
                                                        <div className="mb-2 flex flex-wrap gap-1">
                                                            <span className="text-xs px-2 py-1 bg-amber-900/20 text-amber-500 border border-amber-900/30 rounded-full font-semibold">
                                                                {sub.magicType}
                                                            </span>
                                                            {sub.magicAbility && (
                                                                <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 border border-blue-900/30 rounded-full font-semibold">
                                                                    {sub.magicAbility}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {sub.magicDescription && (
                                                        <p className="text-xs text-brand-400/80 mb-1 italic">{sub.magicDescription}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500 line-clamp-2">{sub.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-12">
                            <p>Select a class to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
