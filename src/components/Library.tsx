import { useState } from "react";
import { SearchBar } from "./SearchBar";
import { SpellCard } from "./SpellCard";
import { ClassCard } from "./ClassCard";
import { SubclassCard } from "./SubclassCard";
import { RaceCard } from "./RaceCard";
import { ItemCard } from "./ItemCard";
import type { Race, Class, Spell, Item, Background, Subclass, Feat } from "../types/dnd-types";
import {
  searchSpells,
  searchClasses,
  searchRaces,
  searchItems,
  searchBackgrounds,
  searchFeats,
  searchSubclasses,
} from "../utils/search-utils";
import { FeatCard } from "./FeatCard";
import { SearchFilters } from "../types/dnd-types";
import { BookOpen, Sparkles, Users, Package, Scroll, Shield, Award, Crown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

type LibraryTab = "spells" | "classes" | "subclasses" | "races" | "items" | "backgrounds" | "feats";

interface LibraryProps {
  spells: Spell[];
  classes: Class[];
  subclasses: Subclass[];
  races: Race[];
  items: Item[];
  backgrounds: Background[];
  feats: Feat[];
}

export function Library({ spells, classes, subclasses, races, items, backgrounds, feats }: LibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("spells");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
  });

  const filteredSpells = searchSpells(spells, filters);
  const filteredClasses = searchClasses(classes, filters);
  const filteredRaces = searchRaces(races, filters);
  const filteredItems = searchItems(items, filters);
  const filteredBackgrounds = searchBackgrounds(backgrounds, filters);
  const filteredFeats = searchFeats(feats, filters);

  // Filter subclasses
  const filteredSubclasses = searchSubclasses(subclasses, filters);

  // Ensure unique IDs by adding index if needed
  const getUniqueKey = (id: string, index: number) => `${id}-${index}`;

  const tabs = [
    { id: "spells", label: "Spells", icon: Sparkles, count: filteredSpells.length },
    { id: "classes", label: "Classes", icon: Scroll, count: filteredClasses.length },
    { id: "subclasses", label: "Subclasses", icon: Shield, count: filteredSubclasses.length },
    { id: "races", label: "Races", icon: Users, count: filteredRaces.length },
    { id: "feats", label: "Feats", icon: Award, count: filteredFeats.length },
    { id: "items", label: "Items", icon: Package, count: filteredItems.length },
    {
      id: "backgrounds",
      label: "Backgrounds",
      icon: BookOpen,
      count: filteredBackgrounds.length,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand-500/30">
      {/* Dark Fantasy Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-brand-950/20 to-zinc-950"></div>
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 0, 60, 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900/10 to-transparent"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header - connects seamlessly with navbar */}
        <div className="border-b border-zinc-800 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Link to="/" className="p-2 rounded-lg bg-brand-900/30 hover:bg-brand-900/50 border border-brand-800/30 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-brand-400" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center border-2 border-brand-400/50 shadow-lg">
                      <BookOpen className="w-5 h-5 text-brand-100" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-white text-2xl md:text-3xl font-serif tracking-wide">The Universal Library</h1>
                    <p className="text-brand-400/60 text-sm">Browse spells, classes, races, items, and backgrounds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-brand-900/30 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as LibraryTab)}
                    className={`flex items-center gap-2 px-3 py-3 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? "border-brand-500 text-brand-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id
                        ? "bg-brand-500/20 text-brand-400"
                        : "bg-white/10 text-gray-400"
                        }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              filters={filters}
              onFiltersChange={setFilters}
              showSpellFilters={activeTab === "spells"}
              showClassFilters={activeTab === "classes"}
            />
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {activeTab === "spells" &&
              filteredSpells.map((spell) => <SpellCard key={spell.id} spell={spell} />)}

            {activeTab === "classes" &&
              filteredClasses.map((classData) => (
                <ClassCard key={classData.id} classData={classData} />
              ))}

            {activeTab === "subclasses" &&
              filteredSubclasses.map((subclass) => (
                <SubclassCard key={subclass.id} subclass={subclass} />
              ))}

            {activeTab === "races" &&
              filteredRaces.map((race) => <RaceCard key={race.id} race={race} />)}

            {activeTab === "items" &&
              filteredItems.map((item) => <ItemCard key={item.id} item={item} />)}

            {activeTab === "feats" &&
              filteredFeats.map((feat) => <FeatCard key={feat.id} feat={feat} />)}

            {activeTab === "backgrounds" &&
              filteredBackgrounds.map((background) => (
                <div
                  key={background.id}
                  className="border border-brand-900/30 rounded-lg p-4 hover:border-brand-700/50 transition-all bg-black/40 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-white mb-1 font-medium">{background.name}</h3>
                      <p className="text-sm text-gray-400">
                        Skills: {background.skillProficiencies.join(", ")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-brand-500/20 text-brand-400">
                        {background.source}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-400">
                        {background.edition}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{background.description}</p>
                  <div className="pt-3 border-t border-brand-900/30">
                    <p className="text-sm text-white">{background.feature.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {background.feature.description.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* No Results */}
          {((activeTab === "spells" && filteredSpells.length === 0) ||
            (activeTab === "classes" && filteredClasses.length === 0) ||
            (activeTab === "subclasses" && filteredSubclasses.length === 0) ||
            (activeTab === "races" && filteredRaces.length === 0) ||
            (activeTab === "items" && filteredItems.length === 0) ||
            (activeTab === "backgrounds" && filteredBackgrounds.length === 0) ||
            (activeTab === "feats" && filteredFeats.length === 0)) && (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  No results found. Try adjusting your filters.
                </p>
              </div>
            )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
        .font-serif {
          font-family: 'Cinzel', serif;
        }
      `}</style>
    </div>
  );
}