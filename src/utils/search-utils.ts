import { Spell, Class, Race, Item, Background, SearchFilters } from "../types/dnd-types";

export function searchSpells(spells: Spell[], filters: SearchFilters): Spell[] {
  return spells.filter((spell) => {
    // Text search
    if (
      filters.query &&
      !spell.name.toLowerCase().includes(filters.query.toLowerCase()) &&
      !spell.description.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }

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
    if (filters.class && !spell.classes.includes(filters.class)) {
      return false;
    }

    return true;
  });
}

export function searchClasses(classes: Class[], filters: SearchFilters): Class[] {
  return classes.filter((classItem) => {
    // Text search
    if (
      filters.query &&
      !classItem.name.toLowerCase().includes(filters.query.toLowerCase()) &&
      !classItem.description.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }

    // Edition filter
    if (filters.edition && filters.edition !== "Both") {
      if (classItem.edition !== filters.edition && classItem.edition !== "Both") {
        return false;
      }
    }

    // Source filter
    if (filters.source && classItem.source !== filters.source) {
      return false;
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
  return races.filter((race) => {
    // Text search
    if (
      filters.query &&
      !race.name.toLowerCase().includes(filters.query.toLowerCase()) &&
      !race.description.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }

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
  return items.filter((item) => {
    // Text search
    if (
      filters.query &&
      !item.name.toLowerCase().includes(filters.query.toLowerCase()) &&
      !item.description.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }

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

    return true;
  });
}

export function searchBackgrounds(
  backgrounds: Background[],
  filters: SearchFilters
): Background[] {
  return backgrounds.filter((background) => {
    // Text search
    if (
      filters.query &&
      !background.name.toLowerCase().includes(filters.query.toLowerCase()) &&
      !background.description.toLowerCase().includes(filters.query.toLowerCase())
    ) {
      return false;
    }

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
