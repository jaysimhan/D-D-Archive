import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';

/**
 * Autocomplete options for the character sheet's free-text fields.
 *
 * One round trip for every list the sheet needs, fetching names only — the
 * full document hooks in useSanityData are far too heavy for a dropdown.
 */
export interface SheetSuggestions {
    classes: { name: string; id: string }[];
    species: string[];
    backgrounds: string[];
    subclasses: { name: string; parentClassId?: string }[];
    armor: string[];
    weapons: string[];
    tools: string[];
    loading: boolean;
}

// `species` is the newer schema and `race` the legacy one; the live dataset
// still holds races, so read both and merge until the migration lands.
const QUERY = `{
    "classes": *[_type == "class" && defined(name)] | order(name asc) { name, "id": slug.current },
    "species": *[_type in ["species", "race"] && defined(name)] | order(name asc).name,
    "backgrounds": *[_type == "background" && defined(name)] | order(name asc).name,
    "subclasses": *[_type == "subclass" && defined(name)] | order(name asc) { name, parentClassId },
    "armor": *[_type == "item" && type == "Armor" && defined(name)] | order(name asc).name,
    "weapons": *[_type == "item" && type == "Weapon" && defined(name)] | order(name asc).name,
    "tools": *[_type == "item" && type == "Tool" && defined(name)] | order(name asc).name
}`;

const EMPTY: SheetSuggestions = {
    classes: [],
    species: [],
    backgrounds: [],
    subclasses: [],
    armor: [],
    weapons: [],
    tools: [],
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

export function useSheetSuggestions(): SheetSuggestions {
    const [data, setData] = useState<SheetSuggestions>(EMPTY);

    useEffect(() => {
        let isMounted = true;

        sanityClient
            .fetch<Record<string, unknown>>(QUERY)
            .then((result) => {
                if (!isMounted || !result) return;
                setData({
                    classes: uniqueDocs<{ name: string; id: string }>(result.classes),
                    species: uniqueNames(result.species),
                    backgrounds: uniqueNames(result.backgrounds),
                    subclasses: uniqueDocs<{ name: string; parentClassId?: string }>(
                        result.subclasses,
                    ),
                    armor: uniqueNames(result.armor),
                    weapons: uniqueNames(result.weapons),
                    tools: uniqueNames(result.tools),
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
