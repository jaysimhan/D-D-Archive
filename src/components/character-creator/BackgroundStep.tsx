import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
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
    const [showNonCore, setShowNonCore] = useState(true);

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="text-center lg:text-left">
                        <h2 className="text-white text-3xl font-bold mb-2 font-serif">Choose Your Background</h2>
                        <p className="text-gray-400">Your character's history and skills</p>
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
                        placeholder="Search backgrounds..."
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
                    />
                </div>

                {showNonCore ? (
                    <ScrollArea className="h-[500px] rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                        <div className="p-4">
                            {backgroundsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="p-4 border border-zinc-800 rounded-lg animate-pulse bg-zinc-900/50">
                                            <div className="h-5 w-28 bg-zinc-800 rounded mb-2"></div>
                                            <div className="h-4 w-full bg-zinc-800 rounded mb-1"></div>
                                            <div className="h-4 w-2/3 bg-zinc-800 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {filteredBackgrounds.map((background) => (
                                        <button
                                            key={background.id}
                                            onClick={() => onSelect(background)}
                                            className={`text-left p-4 border rounded-lg transition-all ${selected?.id === background.id
                                                ? "border-brand-500 bg-brand-900/30 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                                : "border-zinc-700 bg-zinc-900 hover:border-brand-500/50 hover:bg-zinc-800"
                                                }`}
                                        >
                                            <h3 className={`font-semibold text-lg mb-1 font-serif ${selected?.id === background.id ? 'text-brand-400' : 'text-gray-200'}`}>{background.name}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2">{background.description}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20">
                        <div className="p-4">
                            {backgroundsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="p-4 border border-zinc-800 rounded-lg animate-pulse bg-zinc-900/50">
                                            <div className="h-5 w-28 bg-zinc-800 rounded mb-2"></div>
                                            <div className="h-4 w-full bg-zinc-800 rounded mb-1"></div>
                                            <div className="h-4 w-2/3 bg-zinc-800 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                                    {filteredBackgrounds.map((background) => (
                                        <button
                                            key={background.id}
                                            onClick={() => onSelect(background)}
                                            className={`text-left p-4 border rounded-lg transition-all ${selected?.id === background.id
                                                ? "border-brand-500 bg-brand-900/30 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                                                : "border-zinc-700 bg-zinc-900 hover:border-brand-500/50 hover:bg-zinc-800"
                                                }`}
                                        >
                                            <h3 className={`font-semibold text-lg mb-1 font-serif ${selected?.id === background.id ? 'text-brand-400' : 'text-gray-200'}`}>{background.name}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2">{background.description}</p>
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
                {selected ? (
                    <div className="animate-in fade-in duration-200">
                        {/* Image Section */}
                        <div className="w-full aspect-[3/2] bg-black/40 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative border border-zinc-800">
                            {displayedBackground?.image || displayedBackground?.imageUrl ? (
                                <img
                                    src={(displayedBackground.image ? urlFor(displayedBackground.image)?.url() : '') || displayedBackground.imageUrl || ''}
                                    alt={displayedBackground.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <>
                                    <div className="text-center p-4">
                                        <User className="w-12 h-12 text-zinc-700 mx-auto mb-2" />
                                        <span className="text-xs text-zinc-600">Background Scene</span>
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

                        <h3 className="text-3xl font-bold text-brand-500 mb-2 font-serif border-b border-brand-900/30 pb-2">{selected.name}</h3>
                        <p className="text-gray-300 leading-relaxed mb-6 text-sm">{selected.description}</p>

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
