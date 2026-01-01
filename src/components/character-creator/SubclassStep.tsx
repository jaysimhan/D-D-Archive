import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Class, Subclass } from "../../types/dnd-types";
import { useSubclasses } from "../../hooks/useSanityData";
import SanityImage from "../SanityImage";


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
    const [showNonCore, setShowNonCore] = useState(true);

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
                <p className="text-gray-400 text-lg mb-2">
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="text-center lg:text-left">
                        <h2 className="text-white text-3xl font-bold mb-2 font-serif">Choose Your {classData.name} Subclass</h2>
                        <p className="text-gray-400">Specialize your character's abilities</p>
                    </div>

                    {/* Non-core Toggle */}
                    <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={showNonCore} onChange={e => setShowNonCore(e.target.checked)} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${showNonCore ? 'bg-brand-600' : 'bg-zinc-700'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showNonCore ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-300 group-hover:text-brand-400 transition-colors">Enable non-core options</div>
                    </label>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search subclasses..."
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
                    />
                </div>

                {showNonCore ? (
                    <ScrollArea className="h-[500px] rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                        <div className="p-4">
                            {subclassesLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="p-4 border border-zinc-800 rounded-lg animate-pulse bg-zinc-900/50">
                                            <div className="h-5 w-32 bg-zinc-800 rounded mb-2"></div>
                                            <div className="h-4 w-16 bg-zinc-800 rounded mb-3"></div>
                                            <div className="h-4 w-full bg-zinc-800 rounded mb-1"></div>
                                            <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {filteredSubclasses.map((subclass) => (
                                        <button
                                            key={subclass.id}
                                            onClick={() => onSelect(subclass)}
                                            className={`text-left p-4 border rounded-lg transition-all ${selectedSubclass?.id === subclass.id
                                                ? "border-brand-500 bg-brand-900/30 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                                : "border-zinc-800 bg-zinc-900/40 hover:border-brand-500/50 hover:bg-zinc-800"
                                                }`}
                                        >
                                            <h3 className={`font-semibold text-lg mb-1 font-serif ${selectedSubclass?.id === subclass.id ? 'text-brand-400' : 'text-gray-200'}`}>{subclass.name}</h3>
                                            {subclass.edition && (
                                                <span className="text-xs px-2 py-1 bg-zinc-800 text-gray-400 rounded inline-block mb-2 mr-1 border border-zinc-700">
                                                    {subclass.edition}
                                                </span>
                                            )}
                                            {subclass.spellcaster && (
                                                <span className="text-xs px-2 py-1 bg-brand-900/50 text-brand-300 rounded inline-block mb-2 font-semibold border border-brand-700">
                                                    Spellcasting
                                                </span>
                                            )}
                                            {subclass.magicType && (
                                                <div className="mb-2 flex flex-col gap-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="text-xs px-2 py-1 bg-amber-900/50 text-amber-300 rounded-full font-semibold border border-amber-700">
                                                            {subclass.magicType}
                                                        </span>
                                                        {subclass.magicAbility && (
                                                            <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full font-semibold border border-blue-700">
                                                                {subclass.magicAbility}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {subclass.magicDescription && (
                                                        <p className="text-xs text-amber-300/80 font-medium italic mt-1 bg-amber-900/30 p-1.5 rounded border border-amber-800">
                                                            {subclass.magicDescription}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-400 line-clamp-2">{subclass.description}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                        <div className="p-4">
                            {subclassesLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="p-4 border border-zinc-800 rounded-lg animate-pulse bg-zinc-900/50">
                                            <div className="h-5 w-32 bg-zinc-800 rounded mb-2"></div>
                                            <div className="h-4 w-16 bg-zinc-800 rounded mb-3"></div>
                                            <div className="h-4 w-full bg-zinc-800 rounded mb-1"></div>
                                            <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {filteredSubclasses.map((subclass) => (
                                        <button
                                            key={subclass.id}
                                            onClick={() => onSelect(subclass)}
                                            className={`text-left p-4 border rounded-lg transition-all ${selectedSubclass?.id === subclass.id
                                                ? "border-brand-500 bg-brand-900/30 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                                : "border-zinc-800 bg-zinc-900/40 hover:border-brand-500/50 hover:bg-zinc-800"
                                                }`}
                                        >
                                            <h3 className={`font-semibold text-lg mb-1 font-serif ${selectedSubclass?.id === subclass.id ? 'text-brand-400' : 'text-gray-200'}`}>{subclass.name}</h3>
                                            {subclass.edition && (
                                                <span className="text-xs px-2 py-1 bg-zinc-800 text-gray-400 rounded inline-block mb-2 mr-1 border border-zinc-700">
                                                    {subclass.edition}
                                                </span>
                                            )}
                                            {subclass.spellcaster && (
                                                <span className="text-xs px-2 py-1 bg-brand-900/50 text-brand-300 rounded inline-block mb-2 font-semibold border border-brand-700">
                                                    Spellcasting
                                                </span>
                                            )}
                                            {subclass.magicType && (
                                                <div className="mb-2 flex flex-col gap-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="text-xs px-2 py-1 bg-amber-900/50 text-amber-300 rounded-full font-semibold border border-amber-700">
                                                            {subclass.magicType}
                                                        </span>
                                                        {subclass.magicAbility && (
                                                            <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full font-semibold border border-blue-700">
                                                                {subclass.magicAbility}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {subclass.magicDescription && (
                                                        <p className="text-xs text-amber-300/80 font-medium italic mt-1 bg-amber-900/30 p-1.5 rounded border border-amber-800">
                                                            {subclass.magicDescription}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            <p className="text-sm text-gray-400 line-clamp-2">{subclass.description}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Details Panel */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-zinc-900/60 backdrop-blur-sm border border-brand-900/30 rounded-xl shadow-xl min-h-[400px]">
                {displayedSubclass ? (
                    <div className="animate-in fade-in duration-200">
                        {/* Image Section */}
                        <div className="w-full aspect-[3/2] bg-black/40 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative border border-zinc-800">
                            {displayedSubclass?.image ? (
                                <SanityImage
                                    imageAsset={displayedSubclass.image}
                                    alt={displayedSubclass.name}
                                    width={600}
                                    height={400}
                                    className="w-full h-full object-cover"
                                />
                            ) : displayedSubclass?.imageUrl ? (
                                <img
                                    src={displayedSubclass.imageUrl}
                                    alt={displayedSubclass.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <User className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                                    <span className="text-xs text-zinc-600">Subclass Icon</span>
                                </div>
                            )}
                        </div>

                        <h3 className="text-3xl font-bold text-brand-500 mb-2 font-serif border-b border-brand-900/30 pb-2">{displayedSubclass.name}</h3>

                        {/* Spellcaster Badge */}
                        {(displayedSubclass.spellcaster || displayedSubclass.magicType) && (
                            <div className="mb-3">
                                <span className="text-xs px-3 py-1 bg-brand-600 text-white rounded-full font-semibold">
                                    ✨ Spellcaster Subclass
                                </span>
                            </div>
                        )}

                        {displayedSubclass.magicType && (
                            <div className="bg-gradient-to-r from-brand-950/50 to-amber-950/50 p-4 rounded-lg mb-4 border border-brand-800 shadow-sm">
                                <h4 className="font-bold text-brand-300 text-sm mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                                    Magic Capability
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block text-xs">Type</span>
                                        <span className="font-medium text-gray-200">{displayedSubclass.magicType}</span>
                                    </div>
                                    {displayedSubclass.magicAbility && (
                                        <div>
                                            <span className="text-gray-500 block text-xs">Ability</span>
                                            <span className="font-medium text-gray-200">{displayedSubclass.magicAbility}</span>
                                        </div>
                                    )}
                                </div>
                                {displayedSubclass.magicDescription && (
                                    <div className="mt-3 pt-3 border-t border-brand-800">
                                        <span className="text-gray-500 block text-xs mb-1">Details</span>
                                        <p className="text-sm text-brand-200 italic bg-black/30 p-2 rounded">
                                            {displayedSubclass.magicDescription}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <p className="text-gray-300 leading-relaxed mb-6 text-sm">{displayedSubclass.description}</p>

                        <div className="text-sm text-gray-400">
                            <strong className="text-gray-200 block mb-2">Features:</strong>
                            <ul className="space-y-3">
                                {displayedSubclass.features.map((feature, idx) => (
                                    <li key={idx} className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700">
                                        <span className="font-semibold text-brand-400 block mb-1">Level {feature.level}: {feature.name}</span>
                                        <p className="text-gray-400 text-sm mt-1">{feature.description}</p>
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
