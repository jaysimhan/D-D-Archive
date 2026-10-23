import { useMemo } from "react";
import { useRaces, useClasses, useSubclasses, useSpells, useItems, useFeats, useBackgrounds } from "../../hooks/useSanityData";
import type { Race, Class, Spell, Item, Background, Subclass, Feat } from "../../types/dnd-types";
import { mergeLibraryItems } from "./library-items";
import { RULES_REFERENCE, type RuleEntry } from "../../data/srd-rules-reference";

export interface LibraryData {
  ruleset?: "2014" | "2024";
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
export function useLibraryData(ruleset?: "2014" | "2024"): LibraryData {
  const races = useRaces(ruleset);
  const classes = useClasses(ruleset);
  const subclasses = useSubclasses(ruleset);
  const spells = useSpells(ruleset);
  const items = useItems(ruleset);
  const feats = useFeats(ruleset);
  const backgrounds = useBackgrounds(ruleset);
  const archiveItems = items.data;
  // Static fallback text is not edition-resolved and must not fill deliberate
  // empty overrides or reintroduce items unavailable in the selected year.
  const mergedItems = useMemo(() => ruleset ? archiveItems : mergeLibraryItems(archiveItems || []), [archiveItems, ruleset]);

  return {
    ruleset,
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
