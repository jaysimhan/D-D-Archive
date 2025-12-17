import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { Background } from "../../types/dnd-types";
import { useBackgrounds } from "../../hooks/useSanityData";
import { urlFor } from "../../lib/sanity";

// Background Step
export function BackgroundStep({
    selected,
    onSelect,
}: {
    selected?: Background;
    onSelect: (background: Background) => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch backgrounds from Sanity
    const { data: sanityBackgrounds, loading: backgroundsLoading } = useBackgrounds();
    const allBackgrounds = sanityBackgrounds || [];

    const filteredBackgrounds = useMemo(() => {
        return allBackgrounds.filter((bg) =>
            bg.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allBackgrounds]);

    // Use the background from allBackgrounds to ensure we have Sanity image data
    const displayedBackground = selected ? allBackgrounds.find(bg => bg.id === selected.id) || selected : undefined;

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
            {/* Left Column: Grid */}
            <div className="flex-1 w-full">
                <div className="text-center lg:text-left mb-6">
                    <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your Background</h2>
                    <p className="text-gray-600">Your character's history and skills</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search backgrounds..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                {backgroundsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="p-4 border-2 border-gray-200 rounded-lg animate-pulse">
                                <div className="h-5 w-28 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                        {filteredBackgrounds.map((background) => (
                            <button
                                key={background.id}
                                onClick={() => onSelect(background)}
                                className={`text-left p-4 border-2 rounded-lg transition-all ${selected?.id === background.id
                                    ? "border-indigo-600 bg-indigo-50 shadow-md"
                                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                    }`}
                            >
                                <h3 className="text-gray-900 font-semibold text-lg mb-1">{background.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{background.description}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Details Panel */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
                {selected ? (
                    <div className="animate-in fade-in duration-200">
                        {/* Image Section */}
                        <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                            {displayedBackground?.image || displayedBackground?.imageUrl ? (
                                <img
                                    src={displayedBackground.imageUrl || (displayedBackground.image ? urlFor(displayedBackground.image)?.url() : '') || ''}
                                    alt={displayedBackground.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    <div className="text-center p-4">
                                        <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                        <span className="text-xs text-gray-400">Background Scene</span>
                                    </div>
                                    <img
                                        src={`/images/backgrounds/${selected.id}.jpg`}
                                        alt={selected.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </>
                            )}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2 text-indigo-700 font-serif">{selected.name}</h3>
                        <p className="text-gray-700 leading-relaxed mb-6 text-sm">{selected.description}</p>

                        {/* Could add Skills, Tools, Languages here if available in Background object */}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-12">
                        <p>Select a background to view details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
