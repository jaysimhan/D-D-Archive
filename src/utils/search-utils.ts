import { Spell, Class, Race, Item, Background, SearchFilters, Feat, Subclass } from "../types/dnd-types";
import type { HasSource } from "./source-label";
import { matchScore, prepareQuery } from "./text-match";
import { goldValue } from "./item-cost";
import type { RuleEntry } from "../data/srd-rules-reference";

/**
 * Apply the non-text filters, then score and order what survives.
 *
 * `fields` returns the searchable text for a record, most significant first
 * (name, then description and friends). With no query the original order — the
 * alphabetical order Sanity returned — is preserved.
 */
function rank<T>(
  items: T[],
  filters: SearchFilters,
  fields: (item: T) => (string | undefined | null)[],
  keep: (item: T) => boolean
): T[] {
  const query = prepareQuery(filters.query);
  const matched: { item: T; score: number }[] = [];

  for (const item of items) {
    if (!keep(item)) continue;
    if (!query) {
      matched.push({ item, score: 0 });
      continue;
    }
    const [name, ...body] = fields(item);
    const score = matchScore(query, name ?? "", ...body);
    if (score <= 0) continue;
    matched.push({ item, score });
  }

  // Array.prototype.sort is stable, so equal scores keep alphabetical order.
  if (query) matched.sort((a, b) => b.score - a.score);
  return matched.map((entry) => entry.item);
}

/**
 * "2014" and "2024" keep entries written for that edition plus those that work
 * with both; "Both" keeps only the universal ones.
 */
function matchesEdition(edition: string | undefined, filters: SearchFilters): boolean {
  if (!filters.edition) return true;
  if (filters.edition === "Both") return edition === "Both";
  return edition === filters.edition || edition === "Both";
}

/** "Unofficial" takes in every third-party label that is neither Official nor Homebrew. */
function matchesSource(entity: HasSource, filters: SearchFilters): boolean {
  if (filters.sourceBook && entity.sourceBook !== filters.sourceBook) return false;
  if (!filters.source) return true;
  if (filters.source === "Unofficial") return entity.source !== "Official" && entity.source !== "Homebrew";
  return entity.source === filters.source;
}

function matchesCommon(entity: HasSource & { edition?: string }, filters: SearchFilters): boolean {
  return matchesEdition(entity.edition, filters) && matchesSource(entity, filters);
}

export type CasterType = "full" | "half" | "third" | "pact" | "special" | "martial";

export const CASTER_TYPE_LABELS: Record<CasterType, string> = {
  full: "Full Caster",
  half: "Half Caster",
  third: "Third Caster",
  pact: "Pact Magic",
  special: "Special Caster",
  martial: "Martial",
};

/** The Archive stores martial classes as "none", "None" or nothing at all. */
export function casterType(classItem: Pick<Class, "spellcaster">): CasterType {
  const value = classItem.spellcaster?.toLowerCase();
  if (!value || value === "none") return "martial";
  if (value === "half-up") return "half";
  return value in CASTER_TYPE_LABELS ? (value as CasterType) : "special";
}

/** "blood-hunter" → "Blood Hunter". */
export function slugLabel(slug: string): string {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export function searchSpells(spells: Spell[], filters: SearchFilters): Spell[] {
  return rank(spells, filters, (spell) => [spell.name, spell.description], (spell) => {
    if (!matchesCommon(spell, filters)) return false;
    if (filters.level !== undefined && spell.level !== filters.level) return false;
    if (filters.school && spell.school !== filters.school) return false;
    if (filters.class && !(spell.classes || []).includes(filters.class.toLowerCase())) return false;
    if (filters.concentration !== undefined && spell.concentration !== filters.concentration) return false;
    if (filters.ritual !== undefined && spell.ritual !== filters.ritual) return false;
    // Checking V and S means the spell needs both, whatever else it needs.
    for (const comp of filters.components || []) {
      if (!spell.components?.[comp]) return false;
    }
    return true;
  });
}

export function searchClasses(classes: Class[], filters: SearchFilters): Class[] {
  return rank(classes, filters, (classItem) => [classItem.name, classItem.description], (classItem) => {
    if (!matchesCommon(classItem, filters)) return false;
    if (filters.casterType && casterType(classItem) !== filters.casterType) return false;
    return true;
  });
}

export function searchRaces(races: Race[], filters: SearchFilters): Race[] {
  return rank(races, filters, (race) => [race.name, race.description], (race) => {
    if (!matchesCommon(race, filters)) return false;
    if (filters.size && race.size !== filters.size) return false;
    return true;
  });
}

export function searchItems(items: Item[], filters: SearchFilters): Item[] {
  return rank(items, filters, (item) => [item.name, item.description], (item) => {
    if (!matchesCommon(item, filters)) return false;

    // Category Filter
    if (filters.itemCategory) {
      // Magic items include: inherently magical types OR any item with magical: true
      const isMagicItem = item.magical || ["Potion", "Scroll", "Wondrous Item", "Ring", "Rod", "Staff", "Wand"].includes(item.type);
      // Equipment includes non-magical weapons, armor, tools, and gear
      const isEquipment = !item.magical && ["Weapon", "Armor", "Tool", "Adventuring Gear", "Mount & Vehicle"].includes(item.type);

      if (filters.itemCategory === "Equipment" && !isEquipment) return false;
      if (filters.itemCategory === "Magic Items" && !isMagicItem) return false;
    }

    if (filters.itemType && item.type !== filters.itemType) return false;

    // Cost Filter: an unpriced item only survives a range that starts at nothing.
    const gold = goldValue(item.cost);
    if (gold !== undefined) {
      if (filters.minCost !== undefined && gold < filters.minCost) return false;
      if (filters.maxCost !== undefined && gold > filters.maxCost) return false;
    } else if ((filters.minCost ?? 0) > 0 || filters.maxCost !== undefined) {
      return false;
    }

    // Weight Filter
    if (item.weight !== undefined) {
      if (filters.minWeight !== undefined && item.weight < filters.minWeight) return false;
      if (filters.maxWeight !== undefined && item.weight > filters.maxWeight) return false;
    } else if ((filters.minWeight ?? 0) > 0) {
      return false;
    }

    // --- Magic Item Filters ---
    if (filters.rarity && item.rarity !== filters.rarity) return false;
    if (filters.magicBonus !== undefined && item.magicBonus !== filters.magicBonus) return false;
    if (filters.attunement === true && !item.requiresAttunement) return false;
    if (filters.attunement === false && item.requiresAttunement) return false;

    return true;
  });
}

export function searchBackgrounds(
  backgrounds: Background[],
  filters: SearchFilters
): Background[] {
  return rank(backgrounds, filters, (background) => [background.name, background.description], (background) =>
    matchesCommon(background, filters)
  );
}

export function searchFeats(feats: Feat[], filters: SearchFilters): Feat[] {
  return rank(feats, filters, (feat) => [feat.name, feat.description], (feat) => {
    if (!matchesCommon(feat, filters)) return false;
    // 2014 feats carry no category and count as General.
    if (filters.featCategory && (feat.featCategory ?? "General") !== filters.featCategory) return false;
    return true;
  });
}

// Helper function to get available spells based on class, level, and subclass
export function getAvailableSpells(
  allSpells: Spell[],
  classId: string,
  level: number,
  subclassId?: string
): Spell[] {
  // Get max spell level based on class level and spellcaster type
  // This is a simplified version - you'd need to map class -> spellcaster type
  const maxSpellLevel = Math.ceil(level / 2); // Simplified calculation

  return allSpells.filter((spell) => {
    // Must be available to the class
    if (!spell.classes.includes(classId)) {
      return false;
    }

    // Must be within spell level range (cantrips are always available)
    if (spell.level > 0 && spell.level > maxSpellLevel) {
      return false;
    }

    return true;
  });
}

export function searchSubclasses(subclasses: Subclass[], filters: SearchFilters): Subclass[] {
  return rank(subclasses, filters, (subclass) => [subclass.name, subclass.description, subclass.parentClassId?.replace(/-/g, ' ')], (subclass) => {
    if (!matchesCommon(subclass, filters)) return false;
    if (filters.parentClass && subclass.parentClassId !== filters.parentClass) return false;
    return true;
  });
}

export function searchRules(rules: RuleEntry[], filters: SearchFilters): RuleEntry[] {
  return rank(rules, filters, (rule) => [rule.name, rule.summary, ...rule.rules], (rule) => {
    if (filters.ruleKind && rule.kind !== filters.ruleKind) return false;
    return true;
  });
}
