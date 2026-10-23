import { Sparkles, Scroll, Shield, Users, Award, Sword, Gem, BookOpen, ScrollText, type LucideIcon } from "lucide-react";

/**
 * The Library's sections. The id is the URL segment (/library/:category), so
 * renaming one breaks bookmarks; add new sections rather than renaming old ones.
 */
export type LibraryCategoryId =
  | "spells"
  | "classes"
  | "subclasses"
  | "races"
  | "feats"
  | "backgrounds"
  | "equipment"
  | "magic-items"
  | "rules";

export interface LibraryCategory {
  id: LibraryCategoryId;
  label: string;
  /** What one entry is called, for "Back to all …" and page titles. */
  singular: string;
  icon: LucideIcon;
  blurb: string;
}

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  { id: "spells", label: "Spells", singular: "Spell", icon: Sparkles, blurb: "Cantrips to 9th-level magic, with who can cast them." },
  { id: "classes", label: "Classes", singular: "Class", icon: Scroll, blurb: "Hit dice, proficiencies, and every feature from 1st to 20th level." },
  { id: "subclasses", label: "Subclasses", singular: "Subclass", icon: Shield, blurb: "Archetypes, oaths, circles, and patrons for every class." },
  { id: "races", label: "Races & Species", singular: "Race", icon: Users, blurb: "Ancestries with their traits, speed, size, and languages." },
  { id: "feats", label: "Feats", singular: "Feat", icon: Award, blurb: "Origin, general, fighting style, and epic boon feats." },
  { id: "backgrounds", label: "Backgrounds", singular: "Background", icon: BookOpen, blurb: "Proficiencies, starting gear, and the feature each grants." },
  { id: "equipment", label: "Equipment", singular: "Item", icon: Sword, blurb: "Weapons, armor, tools, packs, and adventuring gear, with prices." },
  { id: "magic-items", label: "Magic Items", singular: "Magic Item", icon: Gem, blurb: "Potions, rings, wands, and wondrous items by rarity." },
  { id: "rules", label: "Rules Reference", singular: "Rule", icon: ScrollText, blurb: "Conditions, weapon properties, weapon masteries, and damage types." },
];

export function categoryById(id: string | undefined): LibraryCategory | undefined {
  return LIBRARY_CATEGORIES.find((category) => category.id === id);
}

export function entryPath(category: LibraryCategoryId, id: string): string {
  return `/library/${category}/${encodeURIComponent(id)}`;
}
