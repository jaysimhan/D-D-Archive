import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { Class } from "../../types/dnd-types";
import { CLASSES as combinedClasses, SUBCLASSES as mockSubclasses } from "../../data/comprehensive-library";
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

    // Fetch subclasses for details display
    const { data: sanitySubclasses } = useSubclasses();
    const allSubclasses = useMemo(() => {
        const sanity = sanitySubclasses || [];
        const mock = mockSubclasses || [];

        // First, deduplicate mock data - prefer entries with magicType
        const deduplicatedMock = new Map<string, typeof mock[0]>();
        for (const s of mock) {
            const existing = deduplicatedMock.get(s.id);
            if (!existing || (s.magicType && !existing.magicType)) {
                deduplicatedMock.set(s.id, s);
            }
        }
        const uniqueMock = Array.from(deduplicatedMock.values());

        // If Sanity hasn't loaded yet, use deduplicated mock data
        if (sanity.length === 0) {
            return uniqueMock;
        }

        // Create lookup map for augmenting Sanity data with mock fields
        const mockMap = new Map(uniqueMock.map(s => [s.id, s]));

        // Augment sanity data with missing fields from mock
        const augmentedSanity = sanity.map(s => {
            const mockVer = mockMap.get(s.id);
            if (mockVer) {
                return {
                    ...s,
                    // Fall back to Mock for missing magic fields
                    magicType: s.magicType || mockVer.magicType,
                    magicAbility: s.magicAbility || mockVer.magicAbility,
                    magicDescription: s.magicDescription || mockVer.magicDescription,
                    spellcaster: s.spellcaster ?? mockVer.spellcaster
                };
            }
            return s;
        });

        const sanityIds = new Set(augmentedSanity.map(s => s.id));
        const result = [...augmentedSanity, ...uniqueMock.filter(s => !sanityIds.has(s.id))];
        console.log('[ClassStep] allSubclasses computed:', { sanityCount: sanity.length, mockCount: mock.length, uniqueMockCount: uniqueMock.length, resultCount: result.length });
        // Debug: log a specific subclass to check magic fields
        const arcaneTrickster = result.find(s => s.id === 'arcane-trickster');
        if (arcaneTrickster) {
            console.log('[ClassStep] Arcane Trickster:', { magicType: arcaneTrickster.magicType, spellcaster: arcaneTrickster.spellcaster });
        }
        return result;
    }, [sanitySubclasses]);

    const relatedSubclasses = useMemo(() => {
        if (!selected) return [];
        return allSubclasses.filter(s => s.parentClassId === selected.id);
    }, [selected, allSubclasses]);

    // Fetch classes from Sanity, fall back to mock data
    const { data: sanityClasses, loading: classesLoading } = useClasses();
    const allClasses = useMemo(() => {
        const sanity = sanityClasses || [];
        const mock = combinedClasses || [];
        const sanityIds = new Set(sanity.map(c => c.id));
        return [...sanity, ...mock.filter(c => !sanityIds.has(c.id))];
    }, [sanityClasses]);

    const filteredClasses = useMemo(() => {
        return allClasses.filter((classData) =>
            classData.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allClasses]);

    // Use the class from allClasses to ensure we have Sanity image data
    const displayedClass = selected ? allClasses.find(c => c.id === selected.id) || selected : undefined;

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your Class</h2>
                <p className="text-gray-600">Select your character's profession and level (1-3)</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
                {/* Left Column: Grid */}
                <div className="flex-1 w-full">
                    {/* Level Selector */}
                    <div className="mb-6 max-w-xs">
                        <label className="block text-gray-700 font-medium mb-2">
                            Character Level (Beginner: 1-3)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="3"
                            value={level}
                            onChange={(e) => onLevelChange(Math.max(1, Math.min(3, parseInt(e.target.value) || 1)))}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-semibold"
                        />
                        <p className="text-xs text-gray-500 mt-1">Limited to levels 1-3 for beginner characters</p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search classes..."
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {classesLoading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="px-2 py-3 rounded-lg bg-gray-100 animate-pulse h-24 flex flex-col items-center justify-center gap-2">
                                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                                    <div className="h-4 w-14 bg-gray-200 rounded-full"></div>
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
                                                ? 'bg-indigo-600 text-white shadow-md ring-1 ring-offset-1 ring-indigo-600 border border-indigo-600'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                                            }
                  `}
                                    >
                                        <span className="font-bold text-lg mb-1">{classData.name}</span>
                                        {classData.spellcaster && classData.spellcaster !== "None" && classData.spellcaster !== "none" && (
                                            <span className={`text-[10px] px-2 py-1 rounded-full ${isActive ? 'bg-indigo-500 text-white' : 'bg-purple-100 text-purple-700'}`}>
                                                {classData.spellcaster}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column: Details Panel */}
                <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
                    {selected ? (
                        <div className="animate-in fade-in duration-200">
                            {/* Image Section */}
                            <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                                {displayedClass?.image || displayedClass?.imageUrl ? (
                                    <img
                                        src={displayedClass.imageUrl || (displayedClass.image ? urlFor(displayedClass.image)?.url() : '') || ''}
                                        alt={displayedClass.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <div className="text-center p-4">
                                            <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                            <span className="text-xs text-gray-400">Class Icon</span>
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

                            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-indigo-700 font-serif">{selected.name}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                                    Hit Die: d{selected.hitDie}
                                </span>
                                {selected.spellcaster && selected.spellcaster !== "None" && selected.spellcaster !== "none" && (
                                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                                        {selected.spellcaster} Caster
                                    </span>
                                )}
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                    {selected.edition}
                                </span>
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-6 text-sm">{selected.description}</p>

                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Primary Ability</h4>
                                    <p className="text-sm text-gray-600">{selected.primaryAbility.join(" or ")}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Saving Throws</h4>
                                    <p className="text-sm text-gray-600">{selected.savingThrows.join(", ")}</p>
                                </div>
                            </div>

                            {relatedSubclasses.length > 0 && (
                                <div className="pt-4 border-t border-gray-100 mt-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-2">
                                        Available Subclasses
                                        <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                            High level features unavailable
                                        </span>
                                    </h4>
                                    <p className="text-xs text-indigo-600 mb-3 font-medium">
                                        You chose your subclass at Level {getSubclassLevel(selected.id)}
                                    </p>
                                    <div className="space-y-3">
                                        {relatedSubclasses.map(sub => {
                                            const hasSpellcasting = sub.spellcaster || sub.magicType;
                                            return (
                                                <div
                                                    key={sub.id}
                                                    className={`p-3 rounded-lg ${hasSpellcasting
                                                            ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-sm'
                                                            : 'bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className="font-semibold text-indigo-700 text-sm">{sub.name}</h5>
                                                        {hasSpellcasting && (
                                                            <span className="text-[10px] px-2 py-0.5 bg-purple-600 text-white rounded-full font-semibold flex items-center gap-1">
                                                                ✨ Spellcaster
                                                            </span>
                                                        )}
                                                    </div>
                                                    {sub.magicType && (
                                                        <div className="mb-2 flex flex-wrap gap-1">
                                                            <span className="text-[10px] px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                                                                {sub.magicType}
                                                            </span>
                                                            {sub.magicAbility && (
                                                                <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                                                    {sub.magicAbility}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {sub.magicDescription && (
                                                        <p className="text-xs text-purple-700 mb-1 italic">{sub.magicDescription}</p>
                                                    )}
                                                    <p className="text-xs text-gray-600 line-clamp-2">{sub.description}</p>
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
