import type { Spell, Class, Subclass, Race, Feat, Background, Item } from "../../types/dnd-types";
import { FEAT_CATEGORIES } from "../../types/dnd-types";
import { RULE_KINDS, type RuleEntry } from "../../data/srd-rules-reference";
import { CASTER_TYPE_LABELS, casterType, slugLabel } from "../../utils/search-utils";
import { goldValue } from "../../utils/item-cost";
import { editionLabel } from "./CardBadges";
import type { LibraryCategoryId } from "./categories";

/**
 * How each Library section can be ordered and split into headed groups. Sorting
 * and grouping only rearrange what the filters kept; they never hide anything.
 */
export interface SortOption<T = any> {
  id: string;
  label: string;
  compare: (a: T, b: T) => number;
}

export interface GroupOption<T = any> {
  id: string;
  label: string;
  /** The heading an entry files under. */
  key: (item: T) => string;
  /** Headings in this order first; any others follow alphabetically. */
  order?: string[];
}

export interface CategoryView<T = any> {
  sorts: SortOption<T>[];
  groups: GroupOption<T>[];
  defaultGroup: string;
}

/** Keeps the search's own order: best match first. Only offered while searching. */
export const RELEVANCE = "relevance";
export const NO_GROUP = "none";

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);

/** Ascending on `value`, entries without one last, ties by name. */
function by<T extends { name: string }>(value: (item: T) => number | undefined, descending = false) {
  return (a: T, b: T) => {
    const x = value(a);
    const y = value(b);
    if (x === undefined || y === undefined) return x === y ? byName(a, b) : x === undefined ? 1 : -1;
    return (descending ? y - x : x - y) || byName(a, b);
  };
}

const NAME_SORT: SortOption<{ name: string }> = { id: "name", label: "Name (A–Z)", compare: byName };
const NONE: GroupOption = { id: NO_GROUP, label: "No grouping", key: () => "" };

const EDITION_ORDER = ["2014", "2024", "2014 & 2024"];
const edition: GroupOption<{ edition?: string }> = {
  id: "edition",
  label: "Edition",
  key: (item) => editionLabel(item.edition),
  order: EDITION_ORDER,
};
const source: GroupOption<{ source?: string }> = {
  id: "source",
  label: "Official / third-party",
  key: (item) => (item.source === "Official" || item.source === "Homebrew" ? item.source : "Third-party"),
  order: ["Official", "Third-party", "Homebrew"],
};
const book: GroupOption<{ source?: string; sourceBook?: string }> = {
  id: "book",
  label: "Book",
  key: (item) => item.sourceBook || item.source || "Unknown",
};

const spellLevel = (level: number) => (level === 0 ? "Cantrips" : `Level ${level}`);
const RARITIES = ["Common", "Uncommon", "Rare", "Very Rare", "Legendary", "Artifact"];
const rarityRank = (item: Item) => (item.rarity ? RARITIES.indexOf(item.rarity) : undefined);

export const CATEGORY_VIEWS: Record<LibraryCategoryId, CategoryView> = {
  spells: {
    sorts: [
      NAME_SORT,
      { id: "level", label: "Spell level", compare: by<Spell>((spell) => spell.level) },
      { id: "school", label: "School", compare: (a: Spell, b: Spell) => a.school.localeCompare(b.school) || byName(a, b) },
    ],
    groups: [
      NONE,
      { id: "level", label: "Spell level", key: (spell: Spell) => spellLevel(spell.level), order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(spellLevel) },
      { id: "school", label: "School", key: (spell: Spell) => spell.school },
      edition,
    ],
    defaultGroup: "level",
  },
  classes: {
    sorts: [NAME_SORT, { id: "hitDie", label: "Hit die (largest first)", compare: by<Class>((c) => c.hitDie, true) }],
    groups: [
      NONE,
      {
        id: "caster",
        label: "Spellcasting",
        key: (c: Class) => CASTER_TYPE_LABELS[casterType(c)],
        order: Object.values(CASTER_TYPE_LABELS),
      },
      source,
    ],
    defaultGroup: "caster",
  },
  subclasses: {
    sorts: [NAME_SORT, { id: "class", label: "Class", compare: (a: Subclass, b: Subclass) => a.parentClassId.localeCompare(b.parentClassId) || byName(a, b) }],
    groups: [NONE, { id: "class", label: "Class", key: (s: Subclass) => slugLabel(s.parentClassId) }, edition, source],
    defaultGroup: "class",
  },
  races: {
    sorts: [NAME_SORT, { id: "speed", label: "Speed (fastest first)", compare: by<Race>((r) => r.speed, true) }],
    groups: [NONE, { id: "size", label: "Size", key: (r: Race) => r.size, order: ["Tiny", "Small", "Medium", "Large"] }, edition, source, book],
    defaultGroup: NO_GROUP,
  },
  feats: {
    sorts: [NAME_SORT],
    groups: [NONE, { id: "category", label: "Feat category", key: (f: Feat) => f.featCategory ?? "General", order: FEAT_CATEGORIES }, edition, source],
    defaultGroup: "category",
  },
  backgrounds: {
    sorts: [NAME_SORT],
    groups: [NONE, edition, source, book],
    defaultGroup: NO_GROUP,
  },
  equipment: {
    sorts: [
      NAME_SORT,
      { id: "cheap", label: "Price (low to high)", compare: by<Item>((i) => goldValue(i.cost)) },
      { id: "dear", label: "Price (high to low)", compare: by<Item>((i) => goldValue(i.cost), true) },
      { id: "weight", label: "Weight (lightest first)", compare: by<Item>((i) => i.weight) },
    ],
    groups: [NONE, { id: "type", label: "Type", key: (i: Item) => i.type, order: ["Weapon", "Armor", "Adventuring Gear", "Tool", "Mount & Vehicle"] }, edition],
    defaultGroup: "type",
  },
  "magic-items": {
    sorts: [NAME_SORT, { id: "rarity", label: "Rarity", compare: by<Item>(rarityRank) }],
    groups: [
      NONE,
      { id: "rarity", label: "Rarity", key: (i: Item) => i.rarity || "Unknown rarity", order: RARITIES },
      { id: "type", label: "Type", key: (i: Item) => i.type },
    ],
    defaultGroup: "rarity",
  },
  rules: {
    sorts: [NAME_SORT],
    groups: [NONE, { id: "kind", label: "Kind", key: (r: RuleEntry) => r.kind, order: RULE_KINDS }],
    defaultGroup: "kind",
  },
};

export interface ResultGroup<T> {
  key: string;
  items: T[];
}

/** `items` in the chosen order, split under headings when a grouping is chosen. */
export function arrangeResults<T>(items: T[], view: CategoryView<T>, sortId: string, groupId: string): ResultGroup<T>[] {
  const sort = view.sorts.find((option) => option.id === sortId);
  const sorted = sort && sortId !== RELEVANCE ? [...items].sort(sort.compare) : items;

  const group = view.groups.find((option) => option.id === groupId);
  if (!group || group.id === NO_GROUP) return [{ key: "", items: sorted }];

  const buckets = new Map<string, T[]>();
  for (const item of sorted) {
    const key = group.key(item);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(item);
    else buckets.set(key, [item]);
  }
  const order = group.order ?? [];
  const rank = (key: string) => (order.includes(key) ? order.indexOf(key) : order.length);
  return Array.from(buckets, ([key, groupItems]) => ({ key, items: groupItems })).sort(
    (a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key)
  );
}
