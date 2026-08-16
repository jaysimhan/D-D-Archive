import type { SheetSuggestions } from "../../hooks/useSheetSuggestions";

/**
 * Which of a character's classes, subclasses, species and feats belong in the
 * spellbook pages' "Spell Casting Class, Sub-class, Race, Feat" blank.
 *
 * Only the ones granting the character magic: a Sorcerer's Aberrant Sorcery
 * casts off the class's own spellcasting and so says nothing the class has not
 * said already, and a feat like Metamagic Initiate shapes spells rather than
 * granting any. Pages 1 and 2 name every one of them elsewhere; this blank is
 * for where the magic itself comes from.
 */

/**
 * The Archive flags a caster class, subclass and species, but a feat's only
 * record of the spells it grants is the prose describing it — so these read
 * that prose. Deliberately narrow: text merely mentioning spells (a save
 * against them, a feat sharpening the ones already known) grants nothing, so a
 * match needs a cantrip, a "Spells:" list, or a spell learnt.
 */
const SPELL_GRANT_PATTERNS = [
    /\bcantrips?\b/i,
    /\bspells?\s*:/i,
    /\b(?:learn|learns|know|knows|acquire|acquires)\b[^.;]{0,60}\b(?:spell|cantrip)/i,
];

function readsAsSpellGrant(...parts: (string | undefined)[]) {
    const text = parts.filter(Boolean).join(" ");
    return SPELL_GRANT_PATTERNS.some((pattern) => pattern.test(text));
}

/** "full", "half", "third", "pact" and "special" all cast; "none" does not. */
export function classGrantsSpells(item: SheetSuggestions["classes"][number]) {
    const progression = item.spellcaster?.trim().toLowerCase();
    return Boolean(item.spellcastingAbility) || Boolean(progression && progression !== "none");
}

/**
 * Flagged only where the subclass is the source — Eldritch Knight, Arcane
 * Trickster and the like. A caster class's own subclasses leave it unset.
 */
export function subclassGrantsSpells(item: SheetSuggestions["subclasses"][number]) {
    return Boolean(item.isSpellcaster || item.spellcastingAbility || item.magicAbility);
}

export function speciesGrantsSpells(item: SheetSuggestions["species"][number]) {
    return (
        Boolean(item.isSpellcaster) ||
        (item.traits ?? []).some((trait) => readsAsSpellGrant(trait.name, trait.description))
    );
}

export function featGrantsSpells(item: SheetSuggestions["feats"][number]) {
    return readsAsSpellGrant(item.description, ...(item.benefits ?? []));
}

/**
 * The entries of one of the sheet's " / " lists that grant spellcasting.
 *
 * Names the Archive doesn't hold are kept as typed: these blanks are free text
 * first, and a source written in by hand is one the player means to keep.
 */
export function spellGrantingSources<T extends { name: string }>(
    names: string[],
    documents: T[],
    grantsSpells: (item: T) => boolean,
): string[] {
    const byName = new Map(documents.map((item) => [item.name.trim().toLowerCase(), item]));
    return names.filter((name) => {
        const item = byName.get(name.trim().toLowerCase());
        return item ? grantsSpells(item) : true;
    });
}
