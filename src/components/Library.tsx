import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  slugLabel,
} from "../utils/search-utils";
import { RuleCard } from "./RuleCard";
import type { RuleEntry } from "../data/srd-rules-reference";
import { LIBRARY_CATEGORIES, entryPath, type LibraryCategory, type LibraryCategoryId } from "./library/categories";
import { LibraryShell, LibraryCardsSkeleton } from "./library/LibraryShell";
import type { LibraryData } from "./library/useLibraryData";
import { goldValue } from "../utils/item-cost";
import { CATEGORY_VIEWS, NO_GROUP, RELEVANCE, arrangeResults } from "./library/library-view";

/** How the list is ordered and split; undefined means the section's default. */
interface ViewChoice {
  sort?: string;
  group?: string;
}

/**
 * Filters and view choices survive leaving a list for an entry and coming back,
 * so "back" lands on the same search. Kept per category for the life of the tab.
 */
const savedFilters = new Map<LibraryCategoryId, SearchFilters>();
const savedViews = new Map<LibraryCategoryId, ViewChoice>();

const VIEW_SELECT = "h-9 px-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500";

/** Option lists the filters draw from the data, so new classes and books show up on their own. */
function filterOptions(category: LibraryCategoryId, data: LibraryData) {
  const className = new Map(data.classes.map((c) => [c.id, c.name]));
  const toOptions = (ids: Iterable<string>) =>
    Array.from(new Set(ids))
      .filter(Boolean)
      .map((value) => ({ value, label: className.get(value) ?? slugLabel(value) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  const booksOf = (entries: { sourceBook?: string }[]) =>
    Array.from(new Set(entries.map((e) => e.sourceBook).filter((b): b is string => Boolean(b)))).sort((a, b) => a.localeCompare(b));

  switch (category) {
    case "spells": return { spellClasses: toOptions(data.spells.flatMap((s) => s.classes || [])) };
    case "subclasses": return { parentClasses: toOptions(data.subclasses.map((s) => s.parentClassId)), books: booksOf(data.subclasses) };
    case "classes": return { books: booksOf(data.classes) };
    case "races": return { books: booksOf(data.races) };
    case "feats": return { books: booksOf(data.feats) };
    case "backgrounds": return { books: booksOf(data.backgrounds) };
    case "equipment": {
      const equipment = searchItems(data.items, { query: "", itemCategory: "Equipment" });
      return {
        highestPrice: Math.max(0, ...equipment.map((item) => goldValue(item.cost) ?? 0)),
        highestWeight: Math.max(0, ...equipment.map((item) => item.weight ?? 0)),
      };
    }
    default: return {};
  }
}

function renderCard(category: LibraryCategoryId, entry: unknown, href: string): ReactNode {
  switch (category) {
    case "spells": { const spell = entry as Spell; return <SpellCard key={spell.id} spell={spell} href={href} />; }
    case "classes": { const c = entry as Class; return <ClassCard key={c.id} classData={c} href={href} />; }
    case "subclasses": { const s = entry as Subclass; return <SubclassCard key={s.id} subclass={s} href={href} />; }
    case "races": { const race = entry as Race; return <RaceCard key={race.id} race={race} href={href} />; }
    case "feats": { const feat = entry as Feat; return <FeatCard key={feat.id} feat={feat} href={href} />; }
    case "backgrounds": { const b = entry as Background; return <BackgroundCard key={b.id} background={b} href={href} />; }
    case "equipment":
    case "magic-items": { const item = entry as Item; return <ItemCard key={item.id} item={item} href={href} />; }
    case "rules": { const rule = entry as RuleEntry; return <RuleCard key={rule.id} rule={rule} href={href} />; }
  }
}

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

  const [viewChoice, setViewState] = useState<ViewChoice>(() => savedViews.get(category.id) ?? {});
  const setView = (next: ViewChoice) => {
    savedViews.set(category.id, next);
    setViewState(next);
  };
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const results = filterCategory(category.id, data, filters);
  const total = useMemo(() => filterCategory(category.id, data, { query: "" }).length, [category.id, data.spells, data.classes, data.subclasses, data.races, data.feats, data.backgrounds, data.items]);
  const options = useMemo(() => filterOptions(category.id, data), [category.id, data.spells, data.classes, data.subclasses, data.races, data.feats, data.backgrounds, data.items]);
  const href = (id: string) => entryPath(category.id, id);

  const view = CATEGORY_VIEWS[category.id];
  const noun = category.id === "rules" ? "rules" : category.label.toLowerCase();
  const searching = filters.query.trim().length > 0;
  // While searching, best match leads unless a sort was picked.
  const sortId = viewChoice.sort && (viewChoice.sort !== RELEVANCE || searching) ? viewChoice.sort : searching ? RELEVANCE : "name";
  const groupId = viewChoice.group ?? view.defaultGroup;
  const groups = arrangeResults(results as { id: string }[], view, sortId, groupId);
  const grouped = groupId !== NO_GROUP;

  const toggleGroup = (key: string) => {
    const next = new Set(collapsed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setCollapsed(next);
  };

  const tabs = (
    <div className="bg-black/30 backdrop-blur-sm border-b border-brand-900/30 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto lg:justify-center [scrollbar-width:none]">
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
                {active && !(data.loading && results.length === 0) && (
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
      <div className="mb-6">
        <SearchBar filters={filters} onFiltersChange={setFilters} filterSet={category.id} options={options} />
      </div>

      {data.loading && results.length === 0 ? (
        <LibraryCardsSkeleton />
      ) : (
        <>
          {/* Count, sort and grouping */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
            <p className="text-sm text-gray-400">
              {results.length === total ? (
                <>Showing all <span className="text-gray-200 font-medium">{total}</span> {noun}</>
              ) : (
                <>Showing <span className="text-gray-200 font-medium">{results.length}</span> of {total} {noun}</>
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-500">
                Sort by
                <select value={sortId} onChange={(e) => setView({ ...viewChoice, sort: e.target.value })} className={VIEW_SELECT}>
                  {searching && <option value={RELEVANCE}>Best match</option>}
                  {view.sorts.map((sort) => <option key={sort.id} value={sort.id}>{sort.label}</option>)}
                </select>
              </label>
              {view.groups.length > 1 && (
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  Group by
                  <select value={groupId} onChange={(e) => { setCollapsed(new Set()); setView({ ...viewChoice, group: e.target.value }); }} className={VIEW_SELECT}>
                    {view.groups.map((group) => <option key={group.id} value={group.id}>{group.label}</option>)}
                  </select>
                </label>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-8">
            {groups.map((group) => {
              const open = !collapsed.has(group.key);
              return (
                <section key={group.key || "all"}>
                  {grouped && (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.key)}
                      aria-expanded={open}
                      className="w-full flex items-center gap-3 mb-4 text-left group"
                    >
                      {open ? <ChevronDown className="w-4 h-4 text-brand-400" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
                      <h2 className="font-serif text-lg text-gray-100 group-hover:text-brand-300 transition-colors">{group.key}</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400 tabular-nums">{group.items.length}</span>
                      <span className="flex-1 h-px bg-zinc-800" />
                    </button>
                  )}
                  {open && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {group.items.map((entry) => renderCard(category.id, entry, href(entry.id)))}
                    </div>
                  )}
                </section>
              );
            })}
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
