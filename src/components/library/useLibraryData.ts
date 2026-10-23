import { useMemo } from "react";
import { useRaces, useClasses, useSubclasses, useSpells, useItems, useFeats, useBackgrounds } from "../../hooks/useSanityData";
import type { Race, Class, Spell, Item, Background, Subclass, Feat } from "../../types/dnd-types";
import { mergeLibraryItems } from "./library-items";
import { RULES_REFERENCE, type RuleEntry } from "../../data/srd-rules-reference";

export interface LibraryData {
  spells: Spell[];
  classes: Class[];
  subclasses: Subclass[];
  races: Race[];
  items: Item[];
  backgrounds: Background[];
  feats: Feat[];
  rules: RuleEntry[];
  loading: boolean;
}

/**
 * Every collection the Library shows. The fetches are cached, so each page can
 * call this freely. Items have the SRD equipment catalogue folded in.
 */
export function useLibraryData(): LibraryData {
  const races = useRaces();
  const classes = useClasses();
  const subclasses = useSubclasses();
  const spells = useSpells();
  const items = useItems();
  const feats = useFeats();
  const backgrounds = useBackgrounds();
  const archiveItems = items.data;
  const mergedItems = useMemo(() => mergeLibraryItems(archiveItems || []), [archiveItems]);

  return {
    spells: spells.data || [],
    classes: classes.data || [],
    subclasses: subclasses.data || [],
    races: races.data || [],
    items: mergedItems,
    backgrounds: backgrounds.data || [],
    feats: feats.data || [],
    rules: RULES_REFERENCE,
    loading: [races, classes, subclasses, spells, items, feats, backgrounds].some((query) => query.loading),
  };
}
