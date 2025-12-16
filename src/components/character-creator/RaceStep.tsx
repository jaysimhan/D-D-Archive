import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { Race, Subrace } from "../../types/dnd-types";
import { RACES, SUBRACES } from "../../data/comprehensive-library";
import { useRaces } from "../../hooks/useSanityData";
import { urlFor } from "../../lib/sanity";

// Race Selection Step
export function RaceStep({
    race,
    subrace,
    onChange,
}: {
    race?: Race;
    subrace?: Subrace;
    onChange: (race: Race, subrace?: Subrace) => void;
}) {
    const [showNonCore, setShowNonCore] = useState(true); // Default to true now to show expansions
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch races from Sanity
    const { data: sanityRaces, loading: racesLoading } = useRaces();
    const useSanityData = sanityRaces && sanityRaces.length > 0;

    // Flatten races and subraces logic (for local data only)
    const displayRaces = useMemo(() => {
        // If we have Sanity data, use it directly
        if (useSanityData) {
            let all = [...sanityRaces];

            // Filter by search term
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                all = all.filter(r => r.name.toLowerCase().includes(lower));
            }

            // Filter non-core if needed
            if (!showNonCore) {
                all = all.filter(r => r.source === "Player's Handbook" || r.source === "Official");
            }

            return all.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Fallback to local data with synthetic subrace logic
        const flattened: Race[] = [];

        // Helper to check if a race has specific flattened variants coming up
        const hasVariants = (id: string) => ["dwarf", "elf", "halfling", "gnome", "human"].includes(id);

        RACES.forEach(r => {
            // If it's a "Core" race that has explicit subraces in the UI (Hill/Mountain), hide the base?
            if (r.id === "dwarf") return;
            if (r.id === "elf") return;
            if (r.id === "halfling") return;
            if (r.id === "gnome") return;
            if (r.id === "human") return;

            flattened.push(r);
        });

        // Now inject Subraces as "Races"
        const subraceCards = SUBRACES.map(s => {
            // Find parent base stats
            const parent = RACES.find(r => r.id === s.parentRaceId);
            if (!parent) return null;

            // Create a synthetic Race object
            return {
                ...parent,
                id: s.id, // e.g. "hill-dwarf"
                name: s.name,
                description: s.description,
                abilityScoreIncrease: { ...parent.abilityScoreIncrease, ...s.abilityScoreIncrease },
                traits: [...parent.traits, ...s.traits],
                isSubrace: true, // Marker
                parentRaceId: s.parentRaceId
            } as Race & { isSubrace?: boolean, parentRaceId?: string };
        }).filter(Boolean) as Race[];

        // Add Human back explicitly if not treated as subrace
        const human = RACES.find(r => r.id === "human");
        if (human) flattened.push(human);

        // Merge
        let all = [...flattened, ...subraceCards];

        // Filter by search term
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            all = all.filter(r => r.name.toLowerCase().includes(lower));
        }

        // Filter non-core
        if (!showNonCore) {
            const coreIds = [
                "hill-dwarf", "mountain-dwarf", "high-elf", "wood-elf", "drow",
                "lightfoot-halfling", "stout-halfling", "human", "human-feat",
                "dragonborn", "tiefling", "half-orc", "half-elf", "gnome-forest", "gnome-rock"
            ];
            all = all.filter(r => coreIds.includes(r.id) || r.source === "Player's Handbook" || r.source === "Official");
        }

        return all.sort((a, b) => a.name.localeCompare(b.name));
    }, [showNonCore, searchTerm, useSanityData, sanityRaces]);

    // Use the race from displayRaces to ensure we have Sanity image data
    const displayedRace = race ? displayRaces.find(r => r.id === race.id) || race : undefined;

    const handleRaceClick = (r: Race) => {
        // If using Sanity data, just pass the race directly
        if (useSanityData) {
            onChange(r, undefined);
            return;
        }

        // Check if it's a subrace wrapper (for local data only)
        const isSynthetic = (r as any).isSubrace;
        if (isSynthetic) {
            const parent = RACES.find(p => p.id === (r as any).parentRaceId);
            const realSubrace = SUBRACES.find(s => s.id === r.id);
            if (parent && realSubrace) {
                onChange(parent, realSubrace);
                return;
            }
        }

        // Normal race
        onChange(r, undefined);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[600px]">
            {/* Left Column: Grid */}
            <div className="flex-1 w-full">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Race <span className="text-base font-normal text-gray-500 ml-2">Choose the character Race.</span></h2>

                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={showNonCore} onChange={e => setShowNonCore(e.target.checked)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${showNonCore ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showNonCore ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-700">Enable non-core</div>
                        </label>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search races..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {racesLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="px-4 py-3 rounded bg-gray-100 animate-pulse h-[50px] flex items-center justify-center">
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {displayRaces.map(r => {
                            // Check if active (selected)
                            let isActive = false;
                            if (subrace) {
                                isActive = r.id === subrace.id;
                            } else if (race) {
                                isActive = r.id === race.id;
                            }

                            return (
                                <button
                                    key={r.id}
                                    onClick={() => handleRaceClick(r)}
                                    className={`
                            px-3 py-3 md:px-5 md:py-4 rounded text-sm font-bold transition-all h-full min-h-[50px] md:min-h-[60px] flex items-center justify-center text-center leading-tight
                            ${isActive
                                            ? 'bg-indigo-600 text-white shadow-md ring-1 ring-offset-1 ring-indigo-600 border border-indigo-600'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                                        }
                        `}
                                >
                                    {r.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Right Column: Details Panel */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
                {displayedRace ? (
                    <div className="animate-in fade-in duration-200">
                        {/* Image Section */}
                        <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative">
                            {(() => {
                                const sanityUrl = displayedRace.image ? urlFor(displayedRace.image)?.url() : null;
                                const finalSrc = sanityUrl || displayedRace.imageUrl || "https://placehold.co/600x400";

                                return (
                                    <>
                                        <img
                                            src={finalSrc}
                                            alt={displayedRace.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                // Show fallback icon if image fails
                                                const iconContainer = e.currentTarget.nextElementSibling;
                                                if (iconContainer) {
                                                    (iconContainer as HTMLElement).style.display = 'flex';
                                                }
                                            }}
                                        />
                                        {/* Fallback Icon - hidden by default unless image is missing/broken */}
                                        <div
                                            className="absolute inset-0 flex items-center justify-center -z-10"
                                            style={{ display: 'none' }} // Controlled by onError above
                                        >
                                            <User className="w-12 h-12 text-gray-300" />
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-indigo-700">{displayedRace.name}</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="font-bold text-gray-900">Ability Score Increase.</span>{' '}
                                <span className="text-gray-700">
                                    {Object.entries(displayedRace.abilityScoreIncrease).map(([k, v]) => `${k} +${v}`).join(", ") || "None"}
                                </span>
                            </div>

                            <div>
                                <span className="font-bold text-gray-900">Size.</span>{' '}
                                <span className="text-gray-700">{displayedRace.size}</span>
                            </div>

                            <div>
                                <span className="font-bold text-gray-900">Speed.</span>{' '}
                                <span className="text-gray-700">{displayedRace.speed} ft./round</span>
                            </div>

                            <div>
                                <span className="font-bold text-gray-900">Languages.</span>{' '}
                                <span className="text-gray-700">{displayedRace.languages?.join(", ") || "Common"}</span>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Traits.</h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                    {displayedRace.traits.map((t, i) => (
                                        <li key={i}>
                                            <span className="font-semibold">{t.name}</span>: {t.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {displayedRace.spells && displayedRace.spells.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Innate Spellcasting.</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {displayedRace.spells.map((s, i) => {
                                            const parts: React.ReactNode[] = [];

                                            // Level Requirement Prefix
                                            if (s.level > 1) {
                                                parts.push(<span key="lvl" className="font-semibold text-indigo-700">Level {s.level}:</span>);
                                            }

                                            // Core Grant Info
                                            let mainText = "";
                                            if (s.mode === 'fixed') {
                                                if (s.specificSpells && s.specificSpells.length > 0) {
                                                    mainText = s.specificSpells.map(spell => spell.name).join(", ");
                                                } else {
                                                    mainText = s.name || "Unknown Spell";
                                                }
                                            } else if (s.mode === 'choice') {
                                                const countStr = s.count && s.count > 1 ? ` ${s.count}` : " one";
                                                let source = s.spellList ? `${s.spellList} spell list` : "list";

                                                if (s.specificSpells && s.specificSpells.length > 0) {
                                                    source = s.specificSpells.map(spell => spell.name).join(", ");
                                                }

                                                const levelStr = s.spellLevel === 0 ? "Cantrip" : (s.spellLevel ? `Level ${s.spellLevel} spell` : "spell");
                                                mainText = `Choose${countStr} ${levelStr} from ${source}`;
                                            } else if (s.mode === 'access') {
                                                mainText = `Access to ${s.spellList} spell list`;
                                            }
                                            parts.push(<span key="main">{mainText}</span>);

                                            // Details
                                            const details: string[] = [];
                                            if (s.ability) details.push(s.ability);
                                            if (s.recharge) details.push(s.recharge === 'day' ? '1/Day' : s.recharge);
                                            if (s.notes) details.push(s.notes);

                                            if (details.length > 0) {
                                                parts.push(<span key="details" className="text-gray-500 italic">({details.join(", ")})</span>);
                                            }

                                            return (
                                                <li key={i} className="flex gap-1 flex-wrap">
                                                    {parts}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500 italic">Source: {displayedRace.source}</p>
                            </div>

                            <p className="text-gray-700 mt-4 leading-relaxed">{displayedRace.description}</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-12">
                        <p>Select a race to view details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
