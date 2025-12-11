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
} from "../utils/search-utils";
import { FeatCard } from "./FeatCard";
import { SearchFilters } from "../types/dnd-types";
import { BookOpen, Sparkles, Users, Package, Scroll, Plus, Shield, Award } from "lucide-react";

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

  // Filter subclasses by search query
  const filteredSubclasses = subclasses.filter((subclass) => {
    if (!filters.query) return true;
    const query = filters.query.toLowerCase();
    return (
      subclass.name.toLowerCase().includes(query) ||
      subclass.description.toLowerCase().includes(query) ||
      subclass.parentClassId.toLowerCase().includes(query)
    );
  });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-white mb-2">The Universal Library</h1>
              <p className="text-red-100">
                Browse spells, classes, races, items, and backgrounds from both 2014 and
                2024 editions
              </p>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-red-700 rounded-lg hover:bg-red-50 transition-colors">
              <Plus className="w-5 h-5" />
              Add Homebrew
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as LibraryTab)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? "border-red-700 text-red-700"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
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
                className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{background.name}</h3>
                    <p className="text-sm text-gray-600">
                      Skills: {background.skillProficiencies.join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {background.source}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                      {background.edition}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{background.description}</p>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-900">{background.feature.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
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
              <p className="text-gray-600">
                No results found. Try adjusting your filters.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}