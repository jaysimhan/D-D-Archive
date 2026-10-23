import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { SpellCard } from "./SpellCard";
import { ClassCard } from "./ClassCard";
import { SubclassCard } from "./SubclassCard";
import { RaceCard } from "./RaceCard";
import { ItemCard } from "./ItemCard";
import { BackgroundCard } from "./BackgroundCard";
import { FeatCard } from "./FeatCard";
import type { Race, Class, Spell, Item, Background, Subclass, Feat, SearchFilters } from "../types/dnd-types";
import {
  searchSpells,
  searchClasses,
  searchRaces,
  searchItems,
  searchBackgrounds,
  searchFeats,
  searchSubclasses,
  searchRules,
} from "../utils/search-utils";
import { RuleCard } from "./RuleCard";
import type { RuleEntry } from "../data/srd-rules-reference";
import { LIBRARY_CATEGORIES, entryPath, type LibraryCategory, type LibraryCategoryId } from "./library/categories";
import { LibraryShell, LibraryLoading } from "./library/LibraryShell";
import type { LibraryData } from "./library/useLibraryData";

/**
 * Filters survive leaving a list for an entry and coming back, so "back" lands
 * on the same search. Kept per category for the life of the tab.
 */
const savedFilters = new Map<LibraryCategoryId, SearchFilters>();

/** What the category shows under the given filters. The item sections pin their own split. */
export function filterCategory(category: LibraryCategoryId, data: LibraryData, filters: SearchFilters) {
  switch (category) {
    case "spells": return searchSpells(data.spells, filters);
    case "classes": return searchClasses(data.classes, filters);
    case "subclasses": return searchSubclasses(data.subclasses, filters);
    case "races": return searchRaces(data.races, filters);
    case "feats": return searchFeats(data.feats, filters);
    case "backgrounds": return searchBackgrounds(data.backgrounds, filters);
    case "equipment": return searchItems(data.items, { ...filters, itemCategory: "Equipment" });
    case "magic-items": return searchItems(data.items, { ...filters, itemCategory: "Magic Items" });
    case "rules": return searchRules(data.rules, filters);
  }
}

interface LibraryProps {
  category: LibraryCategory;
  data: LibraryData;
}

export function Library({ category, data }: LibraryProps) {
  const [filters, setFiltersState] = useState<SearchFilters>(() => savedFilters.get(category.id) ?? { query: "" });
  const setFilters = (next: SearchFilters) => {
    savedFilters.set(category.id, next);
    setFiltersState(next);
  };

  const results = filterCategory(category.id, data, filters);
  const href = (id: string) => entryPath(category.id, id);

  const tabs = (
    <div className="bg-black/30 backdrop-blur-sm border-b border-brand-900/30 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-1">
          {LIBRARY_CATEGORIES.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === category.id;
            return (
              <Link
                key={tab.id}
                to={`/library/${tab.id}`}
                className={`flex items-center gap-2 px-3 py-3 border-b-2 transition-colors whitespace-nowrap ${active
                  ? "border-brand-500 text-brand-400"
                  : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {active && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
                    {results.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <LibraryShell
      title={category.label}
      subtitle={category.blurb}
      icon={category.icon}
      crumbs={[{ label: "Library", to: "/library" }, { label: category.label }]}
      toolbar={tabs}
    >
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          filters={filters}
          onFiltersChange={setFilters}
          showSpellFilters={category.id === "spells"}
          showClassFilters={category.id === "classes" || category.id === "subclasses"}
          showEquipmentFilters={category.id === "equipment"}
          showMagicItemFilters={category.id === "magic-items"}
          showRuleFilters={category.id === "rules"}
        />
      </div>

      {data.loading && results.length === 0 ? (
        <LibraryLoading />
      ) : (
        <>
          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {category.id === "spells" &&
              (results as Spell[]).map((spell) => <SpellCard key={spell.id} spell={spell} href={href(spell.id)} />)}

            {category.id === "classes" &&
              (results as Class[]).map((classData) => (
                <ClassCard key={classData.id} classData={classData} href={href(classData.id)} />
              ))}

            {category.id === "subclasses" &&
              (results as Subclass[]).map((subclass) => (
                <SubclassCard key={subclass.id} subclass={subclass} href={href(subclass.id)} />
              ))}

            {category.id === "races" &&
              (results as Race[]).map((race) => <RaceCard key={race.id} race={race} href={href(race.id)} />)}

            {(category.id === "equipment" || category.id === "magic-items") &&
              (results as Item[]).map((item) => <ItemCard key={item.id} item={item} href={href(item.id)} />)}

            {category.id === "feats" &&
              (results as Feat[]).map((feat) => <FeatCard key={feat.id} feat={feat} href={href(feat.id)} />)}

            {category.id === "rules" &&
              (results as RuleEntry[]).map((rule) => <RuleCard key={rule.id} rule={rule} href={href(rule.id)} />)}

            {category.id === "backgrounds" &&
              (results as Background[]).map((background) => (
                <BackgroundCard key={background.id} background={background} href={href(background.id)} />
              ))}
          </div>

          {/* No Results */}
          {results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">
                No results found. Try adjusting your filters.
              </p>
            </div>
          )}
        </>
      )}
    </LibraryShell>
  );
}
