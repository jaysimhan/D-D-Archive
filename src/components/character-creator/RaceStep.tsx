import { useState, useMemo } from "react";
import { Search, User } from "lucide-react";
import { Race } from "../../types/dnd-types";
import { useRaces } from "../../hooks/useSanityData";
import { urlFor } from "../../lib/sanity";

// Race Selection Step
export function RaceStep({
    race,
    onChange,
}: {
    race?: Race;
    onChange: (race: Race) => void;
}) {
    const [showNonCore, setShowNonCore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch races from Sanity
    const { data: sanityRaces, loading: racesLoading } = useRaces();

    const displayRaces = useMemo(() => {
        // Use Sanity data
        let all = sanityRaces || [];

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
    }, [showNonCore, searchTerm, sanityRaces]);

    // Use the race from displayRaces to ensure we have Sanity image data
    const displayedRace = race ? displayRaces.find(r => r.id === race.id) || race : undefined;

    const handleRaceClick = (r: Race) => {
        onChange(r);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[600px]">
            {/* Left Column: Grid */}
            <div className="flex-1 w-full">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-white font-serif">Race <span className="text-base font-normal text-gray-400 ml-2 font-sans">Choose the character Race.</span></h2>

                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={showNonCore} onChange={e => setShowNonCore(e.target.checked)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${showNonCore ? 'bg-brand-600' : 'bg-zinc-700'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showNonCore ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-300 group-hover:text-brand-400 transition-colors">Enable non-core</div>
                        </label>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search races..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {racesLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="px-4 py-3 rounded bg-zinc-900/50 animate-pulse h-[50px] flex items-center justify-center border border-zinc-800">
                                <div className="h-4 w-16 bg-zinc-800 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {displayRaces.map(r => {
                            const isActive = race?.id === r.id;

                            return (
                                <button
                                    key={r.id}
                                    onClick={() => handleRaceClick(r)}
                                    className={`
                            px-3 py-3 md:px-5 md:py-4 rounded-lg text-sm font-bold transition-all h-full min-h-[50px] md:min-h-[60px] flex items-center justify-center text-center leading-tight
                            ${isActive
                                            ? 'bg-brand-900/40 text-brand-100 shadow-[0_0_15px_rgba(220,38,38,0.3)] ring-1 ring-offset-0 ring-brand-500 border border-brand-500'
                                            : 'bg-zinc-900/40 text-gray-400 border border-zinc-800 hover:bg-zinc-800 hover:border-brand-500/50 hover:text-gray-200'
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
            <div className="w-full lg:w-1/3 lg:sticky lg:top-8 p-6 bg-zinc-900/60 backdrop-blur-sm border border-brand-900/30 rounded-xl shadow-xl min-h-[400px]">
                {displayedRace ? (
                    <div className="animate-in fade-in duration-200">
                        {/* Image Section */}
                        <div className="w-full h-48 bg-black/40 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative border border-zinc-800">
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
                                                const iconContainer = e.currentTarget.nextElementSibling;
                                                if (iconContainer) {
                                                    (iconContainer as HTMLElement).style.display = 'flex';
                                                }
                                            }}
                                        />
                                        <div
                                            className="absolute inset-0 flex items-center justify-center -z-10"
                                            style={{ display: 'none' }}
                                        >
                                            <User className="w-12 h-12 text-zinc-700" />
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-4 text-brand-500 font-serif border-b border-brand-900/30 pb-2">{displayedRace.name}</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="font-bold text-brand-400">Ability Score Increase.</span>{' '}
                                <span className="text-gray-300">
                                    {displayedRace.flexibleAbilityScores
                                        ? "+2/+1 or +1/+1/+1"
                                        : (Object.entries(displayedRace.abilityScoreIncrease).filter(([_, v]) => v && v > 0).map(([k, v]) => `${k} +${v}`).join(", ") || "None")
                                    }
                                </span>
                            </div>

                            <div>
                                <span className="font-bold text-brand-400">Size.</span>{' '}
                                <span className="text-gray-300">{displayedRace.size}</span>
                            </div>

                            <div>
                                <span className="font-bold text-brand-400">Speed.</span>{' '}
                                <span className="text-gray-300">{displayedRace.speed} ft./round</span>
                            </div>

                            <div>
                                <span className="font-bold text-brand-400">Languages.</span>{' '}
                                <span className="text-gray-300">{displayedRace.languages?.join(", ") || "Common"}</span>
                            </div>

                            <div>
                                <h4 className="font-bold text-brand-400 mb-1">Traits.</h4>
                                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                    {displayedRace.traits.map((t, i) => (
                                        <li key={i}>
                                            <span className="font-semibold text-gray-200">{t.name}</span>: <span className="text-gray-400">{t.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {displayedRace.spells && displayedRace.spells.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-brand-400 mb-1">Innate Spellcasting.</h4>
                                    <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
                                        {displayedRace.spells.map((s, i) => {
                                            const parts: React.ReactNode[] = [];

                                            if (s.level > 1) {
                                                parts.push(<span key="lvl" className="font-semibold text-brand-300">Level {s.level}:</span>);
                                            }

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

                            <div className="pt-4 border-t border-brand-900/30">
                                <p className="text-sm text-gray-500 italic">Source: {displayedRace.source}</p>
                            </div>

                            <p className="text-gray-300 mt-4 leading-relaxed">{displayedRace.description}</p>
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
