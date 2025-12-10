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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search the archive..."
          value={filters.query}
          onChange={(e) => onFiltersChange({ ...filters, query: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Edition Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-gray-700">Edition</label>
          <select
            value={filters.edition || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                edition: e.target.value ? (e.target.value as Edition) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Editions</option>
            <option value="2014">2014 Rules</option>
            <option value="2024">2024 Rules</option>
            <option value="Both">Universal</option>
          </select>
        </div>

        {/* Source Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm mb-1 text-gray-700">Source</label>
          <select
            value={filters.source || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                source: e.target.value ? (e.target.value as Source) : undefined,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm mb-1 text-gray-700">Spell Level</label>
              <select
                value={filters.level !== undefined ? filters.level : ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    level: e.target.value !== "" ? parseInt(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm mb-1 text-gray-700">School</label>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </>
        )}

        {/* Class-specific filters */}
        {showClassFilters && (
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm mb-1 text-gray-700">Type</label>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
