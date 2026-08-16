import { Spell, Class, Race, Item, Background, SearchFilters, Feat, Subclass } from "../types/dnd-types";
import { matchScore, prepareQuery } from "./text-match";

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

export function searchSpells(spells: Spell[], filters: SearchFilters): Spell[] {
  return rank(spells, filters, (spell) => [spell.name, spell.description], (spell) => {
    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (spell.edition !== filters.edition && spell.edition !== "Both") {
        return false;
      }
    }

    // Source filter
    if (filters.source && spell.source !== filters.source) {
      return false;
    }

    // Level filter
    if (filters.level !== undefined && spell.level !== filters.level) {
      return false;
    }

    // School filter
    if (filters.school && spell.school !== filters.school) {
      return false;
    }

    // Class filter
    if (filters.class && !spell.classes.includes(filters.class.toLowerCase())) {
      return false;
    }

    // Concentration filter
    if (filters.concentration !== undefined && spell.concentration !== filters.concentration) {
      return false;
    }

    // Ritual filter
    if (filters.ritual !== undefined && spell.ritual !== filters.ritual) {
      return false;
    }

    // Components filter
    if (filters.components && filters.components.length > 0) {
      // Logic: Must contain ALL selected components? 
      // User intent usually "I want spells with V" -> includes V, VS, VSM.
      // If user checks V and S, usually means "Must have V AND S".
      for (const comp of filters.components) {
        if (!spell.components[comp]) return false;
      }
    }

    return true;
  });
}

export function searchClasses(classes: Class[], filters: SearchFilters): Class[] {
  return rank(classes, filters, (classItem) => [classItem.name, classItem.description], (classItem) => {
    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (classItem.edition !== filters.edition && classItem.edition !== "Both") {
        return false;
      }
    }

    // Source filter
    if (filters.source) {
      if (filters.source === "Unofficial") {
        // Unofficial matches anything that isn't Official or Homebrew
        if (classItem.source === "Official" || classItem.source === "Homebrew") {
          return false;
        }
      } else {
        // Exact match for Official and Homebrew
        if (classItem.source !== filters.source) {
          return false;
        }
      }
    }

    // Spellcaster filter
    if (filters.spellcaster !== undefined) {
      if (filters.spellcaster && !classItem.spellcaster) {
        return false;
      }
      if (!filters.spellcaster && classItem.spellcaster) {
        return false;
      }
    }

    return true;
  });
}

export function searchRaces(races: Race[], filters: SearchFilters): Race[] {
  return rank(races, filters, (race) => [race.name, race.description], (race) => {
    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (race.edition !== filters.edition && race.edition !== "Both") {
        return false;
      }
    }

    // Source filter
    if (filters.source && race.source !== filters.source) {
      return false;
    }

    return true;
  });
}

export function searchItems(items: Item[], filters: SearchFilters): Item[] {
  return rank(items, filters, (item) => [item.name, item.description], (item) => {
    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (item.edition !== filters.edition && item.edition !== "Both") {
        return false;
      }
    }

    // Source filter
    if (filters.source && item.source !== filters.source) {
      return false;
    }

    // Category Filter
    if (filters.itemCategory) {
      // Magic items include: inherently magical types OR any item with magical: true
      const isMagicItem = item.magical || ["Potion", "Scroll", "Wondrous Item", "Ring", "Rod", "Staff", "Wand"].includes(item.type);
      // Equipment includes non-magical weapons, armor, tools, and gear
      const isEquipment = !item.magical && ["Weapon", "Armor", "Tool", "Adventuring Gear"].includes(item.type);

      if (filters.itemCategory === "Equipment") {
        if (!isEquipment) return false;
      } else if (filters.itemCategory === "Magic Items") {
        if (!isMagicItem) return false;
      }
    }

    // Cost Filter
    if (item.cost) {
      const itemCost = item.cost.amount;
      const getGoldValue = (amt: number, currency: string) => {
        if (currency === "gp") return amt;
        if (currency === "pp") return amt * 10;
        if (currency === "ep") return amt * 0.5;
        if (currency === "sp") return amt * 0.1;
        if (currency === "cp") return amt * 0.01;
        return 0;
      };
      const goldValue = getGoldValue(item.cost.amount, item.cost.currency);

      if (filters.minCost !== undefined && goldValue < filters.minCost) return false;
      if (filters.maxCost !== undefined && goldValue > filters.maxCost) return false;
    } else {
      if (filters.minCost !== undefined && filters.minCost > 0) return false;
    }

    // Weight Filter
    if (item.weight !== undefined) {
      if (filters.minWeight !== undefined && item.weight < filters.minWeight) return false;
      if (filters.maxWeight !== undefined && item.weight > filters.maxWeight) return false;
    } else {
      if (filters.minWeight !== undefined && filters.minWeight > 0) return false;
    }

    // --- Magic Item Filters ---

    // Rarity Filter
    if (filters.rarity) {
      if (!item.rarity || item.rarity !== filters.rarity) return false;
    }

    // Magic Bonus Filter
    if (filters.magicBonus !== undefined) {
      // If searching for +1, item must have magicBonus === 1
      if (item.magicBonus !== filters.magicBonus) return false;
    }

    // Attunement Filter
    if (filters.attunement !== undefined) {
      // defined true means "requires attunement"
      // defined false means "does NOT require attunement"
      if (filters.attunement === true && !item.requiresAttunement) return false;
      if (filters.attunement === false && item.requiresAttunement) return false;
    }

    return true;
  });
}

export function searchBackgrounds(
  backgrounds: Background[],
  filters: SearchFilters
): Background[] {
  return rank(backgrounds, filters, (background) => [background.name, background.description], (background) => {
    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (
        background.edition !== filters.edition &&
        background.edition !== "Both"
      ) {
        return false;
      }
    }

    // Source filter
    if (filters.source && background.source !== filters.source) {
      return false;
    }

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

export function searchFeats(feats: Feat[], filters: SearchFilters): Feat[] {
  return rank(feats, filters, (feat) => [feat.name, feat.description], (feat) => {
    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (feat.edition !== filters.edition && feat.edition !== "Both") {
        return false;
      }
    }

    // Source filter
    // Search function for subclasses
    if (filters.source && feat.source !== filters.source) {
      return false;
    }

    return true;
  });
}

export function searchSubclasses(subclasses: Subclass[], filters: SearchFilters): Subclass[] {
  return rank(subclasses, filters, (subclass) => [subclass.name, subclass.description, subclass.parentClassId?.replace(/-/g, ' ')], (subclass) => {
    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (subclass.edition !== filters.edition && subclass.edition !== "Both") {
        return false;
      }
    }

    // Source filter
    if (filters.source) {
      if (filters.source === "Unofficial") {
        // Unofficial matches anything that isn't Official or Homebrew
        if (subclass.source === "Official" || subclass.source === "Homebrew") {
          return false;
        }
      } else {
        // Exact match for Official and Homebrew
        if (subclass.source !== filters.source) {
          return false;
        }
      }
    }

    return true;
  });
}
