import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';

/**
 * Autocomplete options for the character sheet's free-text fields.
 *
 * One round trip for every list the sheet needs, fetching names only — the
 * full document hooks in useSanityData are far too heavy for a dropdown.
 */
export interface SheetSuggestions {
    classes: {
        name: string;
        id: string;
        hitDie?: number;
        pointLabel?: string;
        primaryAbility?: string[];
        /** "full" | "half" | "third" | "pact" | "special" | "none". */
        spellcaster?: string;
        spellcastingAbility?: string;
        features?: { level: number; name: string; description?: string }[];
    }[];
    /** Carries the text page 2 writes into the Species Traits panel. */
    species: {
        name: string;
        speed?: number;
        isSpellcaster?: boolean;
        traits?: { name: string; description?: string }[];
    }[];
    backgrounds: { name: string; skillProficiencies?: string[] }[];
    subclasses: {
        name: string;
        parentClassId?: string;
        isSpellcaster?: boolean;
        /** How the magic works, e.g. "Spell Slots (Wizard List)", "Ki Spells". */
        magicType?: string;
        magicAbility?: string;
        spellcastingAbility?: string;
        features?: { level: number; name: string; description?: string }[];
    }[];
    armor: string[];
    weapons: string[];
    tools: string[];
    /** Every language the Archive's species speak, for page 2's Languages. */
    languages: string[];
    /** Every item, for the page 2 inventory. */
    items: string[];
    magicItems: string[];
    /** Carries the text page 2 writes into the Character Feats panel. */
    feats: {
        name: string;
        description?: string;
        /** The benefits summarised in the Archive, one line each. */
        benefits?: string[];
    }[];
    loading: boolean;
}

// `species` is the newer schema and `race` the legacy one; the live dataset
// still holds races, so read both and merge until the migration lands. Species
// write their traits inline where races reference the trait library, so those
// are coalesced into the one shape, as the class features above are.
const QUERY = `{
    "classes": *[_type == "class" && defined(name)] | order(name asc) {
        name,
        "id": slug.current,
        hitDie,
        primaryAbility,
        spellcaster,
        spellcastingAbility,
        features[]{
            "level": coalesce(level, acquiredAtLevel, @->acquiredAtLevel),
            "name": coalesce(name, @->name),
            "description": coalesce(description, @->description)
        },
        "pointLabel": grants[grantType == "Resource Pool" && defined(resourceName)][0].resourceName
    },
    "species": *[_type in ["species", "race"] && defined(name)] | order(name asc) {
        name,
        speed,
        // Races carry the flag; species record the same thing as spell grants.
        "isSpellcaster": coalesce(
            isSpellcaster,
            count(grants[grantType in ["Specific Spell", "Spell Slot"]]) > 0
        ),
        traits[]{
            "name": coalesce(name, @->name),
            "description": coalesce(description, @->description)
        }
    },
    "backgrounds": *[_type == "background" && defined(name)] | order(name asc) {
        name,
        skillProficiencies
    },
    "subclasses": *[_type == "subclass" && defined(name)] | order(name asc) {
        name,
        "parentClassId": coalesce(parentClass->slug.current, parentClassId),
        isSpellcaster,
        magicType,
        magicAbility,
        spellcastingAbility,
        features[]{
            "level": coalesce(level, acquiredAtLevel, @->acquiredAtLevel),
            "name": coalesce(name, @->name),
            "description": coalesce(description, @->description)
        }
    },
    // No language document to read, so take the union of what species speak.
    "languages": array::unique(
        *[_type in ["species", "race"] && defined(languages)].languages[]
    ),
    "armor": *[_type == "item" && type == "Armor" && defined(name)] | order(name asc).name,
    "weapons": *[_type == "item" && type == "Weapon" && defined(name)] | order(name asc).name,
    "tools": *[_type == "item" && type == "Tool" && defined(name)] | order(name asc).name,
    "items": *[_type == "item" && defined(name)] | order(name asc).name,
    "magicItems": *[_type == "item" && magical == true && defined(name)] | order(name asc).name,
    "feats": *[_type == "feat" && defined(name)] | order(name asc) {
        name,
        description,
        "benefits": benefits.features
    }
}`;

const EMPTY: SheetSuggestions = {
    classes: [],
    species: [],
    backgrounds: [],
    subclasses: [],
    armor: [],
    weapons: [],
    tools: [],
    languages: [],
    items: [],
    magicItems: [],
    feats: [],
    loading: true,
};

/** Drop blanks and duplicates, preserving the query's alphabetical order. */
function uniqueNames(values: unknown): string[] {
    if (!Array.isArray(values)) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const value of values) {
        if (typeof value !== 'string') continue;
        const name = value.trim();
        if (!name || seen.has(name.toLowerCase())) continue;
        seen.add(name.toLowerCase());
        out.push(name);
    }
    return out;
}

/**
 * The languages, alphabetically. Species record them as free text, so this also
 * drops the placeholders written among them — "one other" and its like. A
 * language is a name, and a name is capitalised.
 */
function languageNames(values: unknown): string[] {
    return uniqueNames(values)
        .filter((name) => /^\p{Lu}/u.test(name))
        .sort((a, b) => a.localeCompare(b));
}

function uniqueDocs<T extends { name?: string }>(values: unknown): T[] {
    if (!Array.isArray(values)) return [];
    const seen = new Set<string>();
    const out: T[] = [];
    for (const value of values) {
        const name = value?.name;
        if (typeof name !== 'string' || !name.trim()) continue;
        const key = name.trim().toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ ...value, name: name.trim() });
    }
    return out;
}

/* ------------------------------------------------------------------ */
/* Spells                                                              */
/* ------------------------------------------------------------------ */

/**
 * A spell as the spellbook pages need it: the name their blanks search on, and
 * everything a chosen spell writes into the rest of its row.
 */
export interface SheetSpell {
    name: string;
    level: number;
    school?: string;
    castingTime?: string;
    range?: string;
    components?: { verbal: boolean; somatic: boolean; material: boolean };
    concentration?: boolean;
    ritual?: boolean;
    /** Carried for the hover card over a filled row, not for the row itself. */
    duration?: string;
    description?: string;
}

// `school` is a magicSchool reference in the schema but a plain string in the
// live dataset, so dereference it and fall back to the string. Components vary
// the same way — the ["V","S","M"] array the studio writes against the object
// the seeded documents hold — and are coalesced below.
const SPELLS_QUERY = `*[_type == "spell" && defined(name)] | order(name asc) {
    name,
    level,
    "school": coalesce(school->name, school),
    castingTime,
    range,
    components,
    concentration,
    ritual,
    duration,
    description
}`;

const NO_SPELLS: SheetSpell[] = [];

/** Descriptions are block content in the schema and plain strings in the seed. */
function plainText(value: unknown): string | undefined {
    if (typeof value === 'string') return value.trim() || undefined;
    if (!Array.isArray(value)) return undefined;
    const text = value
        .map((block) =>
            Array.isArray(block?.children)
                ? block.children
                      .map((child: unknown) =>
                          typeof (child as { text?: unknown })?.text === 'string'
                              ? (child as { text: string }).text
                              : '',
                      )
                      .join('')
                : '',
        )
        .filter(Boolean)
        .join('\n\n')
        .trim();
    return text || undefined;
}

function normalizeComponents(value: unknown): SheetSpell['components'] {
    if (Array.isArray(value)) {
        const letters = new Set(value.map((entry) => String(entry).trim().toUpperCase()));
        return {
            verbal: letters.has('V'),
            somatic: letters.has('S'),
            material: letters.has('M'),
        };
    }
    if (value && typeof value === 'object') {
        const components = value as Record<string, unknown>;
        return {
            verbal: Boolean(components.verbal),
            somatic: Boolean(components.somatic),
            material: Boolean(components.material),
        };
    }
    return undefined;
}

function normalizeSpells(values: unknown): SheetSpell[] {
    if (!Array.isArray(values)) return [];
    const seen = new Set<string>();
    const out: SheetSpell[] = [];
    for (const value of values) {
        const name = typeof value?.name === 'string' ? value.name.trim() : '';
        // A spell with no level has no block to sit in, so it cannot be offered.
        if (!name || typeof value?.level !== 'number') continue;
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
            name,
            level: value.level,
            school: typeof value.school === 'string' ? value.school.trim() : undefined,
            castingTime: typeof value.castingTime === 'string' ? value.castingTime : undefined,
            range: typeof value.range === 'string' ? value.range : undefined,
            components: normalizeComponents(value.components),
            concentration: Boolean(value.concentration),
            ritual: Boolean(value.ritual),
            duration: typeof value.duration === 'string' ? value.duration.trim() : undefined,
            description: plainText(value.description),
        });
    }
    return out;
}

/** Shared, so pages 3 and 4 open the spell library on one round trip. */
let spellsRequest: Promise<SheetSpell[]> | null = null;

function fetchSheetSpells(): Promise<SheetSpell[]> {
    if (!spellsRequest) {
        spellsRequest = sanityClient
            .fetch<unknown>(SPELLS_QUERY)
            .then(normalizeSpells)
            .catch((err) => {
                // Drop the failure so a later mount can try again.
                spellsRequest = null;
                throw err;
            });
    }
    return spellsRequest;
}

/** Every spell in the Archive, for the spellbook pages' searchable blanks. */
export function useSheetSpells(): SheetSpell[] {
    const [spells, setSpells] = useState<SheetSpell[]>(NO_SPELLS);

    useEffect(() => {
        let isMounted = true;

        fetchSheetSpells()
            .then((result) => {
                if (isMounted) setSpells(result);
            })
            .catch((err) => {
                // The blanks stay plain text fields without these.
                console.error('Character sheet spells unavailable:', err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return spells;
}

export function useSheetSuggestions(): SheetSuggestions {
    const [data, setData] = useState<SheetSuggestions>(EMPTY);

    useEffect(() => {
        let isMounted = true;

        sanityClient
            .fetch<Record<string, unknown>>(QUERY)
            .then((result) => {
                if (!isMounted || !result) return;
                setData({
                    classes: uniqueDocs<{
                        name: string;
                        id: string;
                        hitDie?: number;
                        pointLabel?: string;
                        primaryAbility?: string[];
                        spellcaster?: string;
                        spellcastingAbility?: string;
                        features?: { level: number; name: string; description?: string }[];
                    }>(result.classes),
                    species: uniqueDocs<{
                        name: string;
                        speed?: number;
                        isSpellcaster?: boolean;
                        traits?: { name: string; description?: string }[];
                    }>(result.species),
                    backgrounds: uniqueDocs<{
                        name: string;
                        skillProficiencies?: string[];
                    }>(result.backgrounds),
                    subclasses: uniqueDocs<{
                        name: string;
                        parentClassId?: string;
                        isSpellcaster?: boolean;
                        magicType?: string;
                        magicAbility?: string;
                        spellcastingAbility?: string;
                        features?: { level: number; name: string; description?: string }[];
                    }>(result.subclasses),
                    armor: uniqueNames(result.armor),
                    weapons: uniqueNames(result.weapons),
                    tools: uniqueNames(result.tools),
                    languages: languageNames(result.languages),
                    items: uniqueNames(result.items),
                    magicItems: uniqueNames(result.magicItems),
                    feats: uniqueDocs<{
                        name: string;
                        description?: string;
                        benefits?: string[];
                    }>(result.feats),
                    loading: false,
                });
            })
            .catch((err) => {
                // The sheet stays fully usable as plain text fields without these.
                console.error('Character sheet suggestions unavailable:', err);
                if (isMounted) setData({ ...EMPTY, loading: false });
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return data;
}
