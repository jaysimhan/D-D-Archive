import { Search, Filter } from "lucide-react";
import { SearchFilters, Edition, Source, SpellSchool } from "../types/dnd-types";

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  showSpellFilters?: boolean;
  showClassFilters?: boolean;
}

export function SearchBar({
  filters,
  onFiltersChange,
  showSpellFilters = false,
  showClassFilters = false,
}: SearchBarProps) {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search the archive..."
          value={filters.query}
          onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
          className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Edition Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-gray-400">Edition</label>
          <select
            value={filters.edition || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                edition: e.target.value ? (e.target.value as Edition) : undefined,
              })
            }
            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white"
          >
            <option value="">All Editions</option>
            <option value="2014">2014 Rules</option>
            <option value="2024">2024 Rules</option>
            <option value="Both">Universal</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-gray-400">Source</label>
          <select
            value={filters.source || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                source: e.target.value ? (e.target.value as Source) : undefined,
              })
            }
            className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white"
          >
            <option value="">All Sources</option>
            <option value="Official">Official</option>
            <option value="Homebrew">Homebrew</option>
            <option value="Unofficial">Unofficial</option>
          </select>
        </div>

        {/* Spell-specific filters */}
        {showSpellFilters && (
          <>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm mb-1 text-gray-400">Spell Level</label>
              <select
                value={filters.level !== undefined ? filters.level : ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    level: e.target.value !== "" ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white"
              >
                <option value="">All Levels</option>
                <option value="0">Cantrip</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm mb-1 text-gray-400">School</label>
              <select
                value={filters.school || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    school: e.target.value
                      ? (e.target.value as SpellSchool)
                      : undefined,
                  })
                }
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white"
              >
                <option value="">All Schools</option>
                <option value="Abjuration">Abjuration</option>
                <option value="Conjuration">Conjuration</option>
                <option value="Divination">Divination</option>
                <option value="Enchantment">Enchantment</option>
                <option value="Evocation">Evocation</option>
                <option value="Illusion">Illusion</option>
                <option value="Necromancy">Necromancy</option>
                <option value="Transmutation">Transmutation</option>
              </select>
            </div>


            {/* Class Filter */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm mb-1 text-gray-400">Class List</label>
              <select
                value={filters.class || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    class: e.target.value || undefined,
                  })
                }
                className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white"
              >
                <option value="">All Classes</option>
                <option value="artificer">Artificer</option>
                <option value="bard">Bard</option>
                <option value="cleric">Cleric</option>
                <option value="druid">Druid</option>
                <option value="paladin">Paladin</option>
                <option value="ranger">Ranger</option>
                <option value="sorcerer">Sorcerer</option>
                <option value="warlock">Warlock</option>
                <option value="wizard">Wizard</option>
                <option disabled>--- Unofficial ---</option>
                <option value="blood-mage">Blood Mage</option>
                <option value="illrigger">Illrigger</option>
                <option value="martyr">Martyr</option>
                <option value="necromancer">Necromancer</option>
                <option value="warmage">Warmage</option>
                <option value="witch">Witch</option>
                <option value="apothecary">Apothecary</option>
              </select>
            </div>

            <div className="w-full h-0 basis-full md:hidden"></div> {/* Break row on small screens */}

            {/* Components Filter */}
            <div className="flex items-center gap-3 min-w-[200px] border border-zinc-700 rounded-lg px-3 py-2 bg-zinc-900/50">
              <span className="text-sm text-gray-400 font-medium">Require:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.components?.includes("verbal") || false}
                  onChange={(e) => {
                    const current = filters.components || [];
                    const next = e.target.checked
                      ? [...current, "verbal"]
                      : current.filter(c => c !== "verbal");
                    onFiltersChange({ ...filters, components: next as any });
                  }}
                  className="rounded text-brand-600 focus:ring-brand-500 bg-zinc-800 border-zinc-600"
                />
                <span className="text-sm text-gray-300">V</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.components?.includes("somatic") || false}
                  onChange={(e) => {
                    const current = filters.components || [];
                    const next = e.target.checked
                      ? [...current, "somatic"]
                      : current.filter(c => c !== "somatic");
                    onFiltersChange({ ...filters, components: next as any });
                  }}
                  className="rounded text-brand-600 focus:ring-brand-500 bg-zinc-800 border-zinc-600"
                />
                <span className="text-sm text-gray-300">S</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.components?.includes("material") || false}
                  onChange={(e) => {
                    const current = filters.components || [];
                    const next = e.target.checked
                      ? [...current, "material"]
                      : current.filter(c => c !== "material");
                    onFiltersChange({ ...filters, components: next as any });
                  }}
                  className="rounded text-brand-600 focus:ring-brand-500 bg-zinc-800 border-zinc-600"
                />
                <span className="text-sm text-gray-300">M</span>
              </label>
            </div>

            {/* Conc/Ritual Toggles */}
            <div className="flex gap-2">
              <button
                onClick={() => onFiltersChange({ ...filters, concentration: filters.concentration === true ? undefined : true })}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${filters.concentration
                  ? "bg-brand-900/50 border-brand-500/50 text-brand-300 font-medium"
                  : "bg-zinc-900/50 border-zinc-700 text-gray-400 hover:bg-zinc-800"
                  }`}
              >
                Conc.
              </button>
              <button
                onClick={() => onFiltersChange({ ...filters, ritual: filters.ritual === true ? undefined : true })}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${filters.ritual
                  ? "bg-brand-900/50 border-brand-500/50 text-brand-300 font-medium"
                  : "bg-zinc-900/50 border-zinc-700 text-gray-400 hover:bg-zinc-800"
                  }`}
              >
                Ritual
              </button>
            </div>
          </>
        )}

        {/* Class-specific filters */}
        {showClassFilters && (
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm mb-1 text-gray-400">Type</label>
            <select
              value={
                filters.spellcaster !== undefined ? (filters.spellcaster ? "yes" : "no") : ""
              }
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  spellcaster:
                    e.target.value === "" ? undefined : e.target.value === "yes",
                })
              }
              className="w-full px-3 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white"
            >
              <option value="">All Classes</option>
              <option value="yes">Spellcasters</option>
              <option value="no">Non-Spellcasters</option>
            </select>
          </div>
        )}

        {/* Clear Filters Button */}
        {(filters.query ||
          filters.edition ||
          filters.source ||
          filters.level !== undefined ||
          filters.school ||
          filters.spellcaster !== undefined) && (
            <div className="flex items-end">
              <button
                onClick={() =>
                  onFiltersChange({
                    query: "",
                    edition: undefined,
                    source: undefined,
                    level: undefined,
                    school: undefined,
                    spellcaster: undefined,
                  })
                }
                className="px-4 py-2 text-sm text-gray-400 hover:text-brand-400 underline transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
      </div>
    </div >
  );
}
