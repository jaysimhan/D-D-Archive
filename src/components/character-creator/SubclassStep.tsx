import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { Class, Subclass } from "../../types/dnd-types";
import { useSubclasses } from "../../hooks/useSanityData";
import { urlFor } from "../../lib/sanity";


// Subclass Step
export function SubclassStep({
    classData,
    selectedSubclass,
    level,
    onSelect,
}: {
    classData: Class;
    selectedSubclass?: Subclass;
    level: number;
    onSelect: (subclass: Subclass) => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch subclasses from Sanity, fall back to mock data
    const { data: sanitySubclasses, loading: subclassesLoading } = useSubclasses();

    const subclassLevel = classData.id === "cleric" ||
        classData.id === "sorcerer" ||
        classData.id === "warlock" ? 1 :
        classData.id === "wizard" ? 2 : 3;

    const availableSubclasses = useMemo(() => {
        const sanity = sanitySubclasses || [];
        // Just use Sanity data (plus we only need subclasses for this class)
        return sanity.filter((sc) => sc.parentClassId === classData.id);
    }, [classData.id, sanitySubclasses]);

    const filteredSubclasses = useMemo(() => {
        return availableSubclasses.filter((subclass) =>
            subclass.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [availableSubclasses, searchTerm]);

    // Use the subclass from availableSubclasses to ensure we have Sanity image data
    const displayedSubclass = selectedSubclass ? availableSubclasses.find(sc => sc.id === selectedSubclass.id) || selectedSubclass : undefined;

    if (level < subclassLevel) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-2">
                    Subclass selection unlocks at level {subclassLevel}
                </p>
                <p className="text-sm text-gray-500">
                    Increase your character level to {subclassLevel} or higher to choose a subclass
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
            {/* Left Column: Grid */}
            <div className="flex-1 w-full">
                <div className="text-center lg:text-left mb-6">
                    <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your {classData.name} Subclass</h2>
                    <p className="text-gray-600">Specialize your character's abilities</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search subclasses..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {subclassesLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="p-4 border-2 border-gray-200 rounded-lg animate-pulse">
                                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded mb-3"></div>
                                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        {filteredSubclasses.map((subclass) => (
                            <button
                                key={subclass.id}
                                onClick={() => onSelect(subclass)}
                                className={`text-left p-4 border-2 rounded-lg transition-all ${selectedSubclass?.id === subclass.id
                                    ? "border-indigo-600 bg-indigo-50 shadow-md"
                                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                    }`}
                            >
                                <h3 className="text-gray-900 font-semibold text-lg mb-1">{subclass.name}</h3>
                                {subclass.edition && (
                                    <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-700 rounded inline-block mb-2 mr-1">
                                        {subclass.edition}
                                    </span>
                                )}
                                {subclass.spellcaster && (
                                    <span className="text-[10px] px-2 py-1 bg-indigo-100 text-indigo-700 rounded inline-block mb-2 font-semibold">
                                        Spellcasting
                                    </span>
                                )}
                                {subclass.magicType && (
                                    <div className="mb-2 flex flex-col gap-1">
                                        <div className="flex flex-wrap gap-1">
                                            <span className="text-[10px] px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                                                {subclass.magicType}
                                            </span>
                                            {subclass.magicAbility && (
                                                <span className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                                    {subclass.magicAbility}
                                                </span>
                                            )}
                                        </div>
                                        {subclass.magicDescription && (
                                            <p className="text-xs text-purple-600 font-medium italic mt-1 bg-purple-50 p-1.5 rounded border border-purple-100">
                                                {subclass.magicDescription}
                                            </p>
                                        )}
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 line-clamp-2">{subclass.description}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Details Panel */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
                {displayedSubclass ? (
                    <div className="animate-in fade-in duration-200">
                        {/* Image Section */}
                        <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                            {displayedSubclass?.image || displayedSubclass?.imageUrl ? (
                                <img
                                    src={displayedSubclass.imageUrl || (displayedSubclass.image ? urlFor(displayedSubclass.image)?.url() : '') || ''}
                                    alt={displayedSubclass.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    <div className="text-center p-4">
                                        <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <span className="text-xs text-gray-400">Subclass Icon</span>
                                    </div>
                                    <img
                                        src={`/images/subclasses/${displayedSubclass.id}.jpg`}
                                        alt={displayedSubclass.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-indigo-700 font-serif">{displayedSubclass.name}</h3>

                        {/* Spellcaster Badge */}
                        {(displayedSubclass.spellcaster || displayedSubclass.magicType) && (
                            <div className="mb-3">
                                <span className="text-xs px-3 py-1 bg-purple-600 text-white rounded-full font-semibold">
                                    ✨ Spellcaster Subclass
                                </span>
                            </div>
                        )}

                        {displayedSubclass.magicType && (
                            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg mb-4 border border-purple-200 shadow-sm">
                                <h4 className="font-bold text-purple-900 text-sm mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    Magic Capability
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block text-xs">Type</span>
                                        <span className="font-medium text-gray-900">{displayedSubclass.magicType}</span>
                                    </div>
                                    {displayedSubclass.magicAbility && (
                                        <div>
                                            <span className="text-gray-500 block text-xs">Ability</span>
                                            <span className="font-medium text-gray-900">{displayedSubclass.magicAbility}</span>
                                        </div>
                                    )}
                                </div>
                                {displayedSubclass.magicDescription && (
                                    <div className="mt-3 pt-3 border-t border-purple-200">
                                        <span className="text-gray-500 block text-xs mb-1">Details</span>
                                        <p className="text-sm text-purple-800 italic bg-white/50 p-2 rounded">
                                            {displayedSubclass.magicDescription}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className="text-gray-700 leading-relaxed mb-6 text-sm">{displayedSubclass.description}</p>

                        <div className="text-sm text-gray-500">
                            <strong className="text-gray-900 block mb-2">Features:</strong>
                            <ul className="space-y-3">
                                {displayedSubclass.features.map((feature, idx) => (
                                    <li key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <span className="font-semibold text-indigo-700 block mb-1">Level {feature.level}: {feature.name}</span>
                                        <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-12">
                        <p>Select a subclass to view details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
