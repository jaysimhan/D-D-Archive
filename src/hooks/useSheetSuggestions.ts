import { editionQuery } from '../lib/ruleset-query';
import { useEffect, useState } from 'react';
import { sanityClient } from '../lib/sanity';
import {
    ADVENTURING_GEAR,
    ARMOR,
    MAGIC_ITEMS,
    TOOLS,
    TREASURE,
    WEAPONS,
} from '../data/srd-equipment';
import type { ArchiveItemStats } from '../utils/sheet-combat';

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
        /** Weapons the class always trains with; null where the Archive doesn't say. */
        weaponProficiencies?: string[] | null;
        /** The class table's Martial Arts or Fisticuffs die, by level. */
        unarmedDice?: { level: number; die?: string }[];
    }[];
    /** Carries the text page 2 writes into the Species Traits panel. */
    species: {
        name: string;
        size?: string;
        speed?: number;
        isSpellcaster?: boolean;
        traits?: { name: string; description?: string }[];
    }[];
    backgrounds: { name: string; skillProficiencies?: string[]; feats?: { name: string }[]; originFeatSpellList?: string }[];
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
    /**
     * The lists below are the Archive's items merged with the SRD catalogue in
     * src/data/srd-equipment.ts — the Archive holds only a sample of them.
     */
    armor: string[];
    weapons: string[];
    tools: string[];
    /** Every language the Archive's species speak, for page 2's Languages. */
    languages: string[];
    /** Every item, for the page 2 inventory. */
    items: string[];
    magicItems: string[];
    /** Everything the Treasure panel can look up: gems, art, magic items, gear. */
    treasure: string[];
    /** Weapon and armor documents, for homebrew the catalogue doesn't know. */
    itemStats: ArchiveItemStats[];
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
        "pointLabel": grants[grantType == "Resource Pool" && defined(resourceName)][0].resourceName,
        // Only the fixed rule: a choice of weapons says nothing about which.
        "weaponProficiencies": select(
            defined(proficiencies) => proficiencies[type == "weapon" && mode == "fixed"].weaponOptions[],
            null
        ),
        "unarmedDice": progression[]{
            level,
            "die": resources[name in ["Martial Arts", "Fisticuffs"]][0].value
        }
    },
    "species": *[_type in ["species", "race"] && defined(name)] | order(name asc) {
        name,
        size,
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
        skillProficiencies,
        feats[]->{name},
        originFeatSpellList
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
    "itemStats": *[_type == "item" && type in ["Weapon", "Armor"] && defined(name)] {
        name,
        type,
        properties,
        magicBonus,
        armorClass
    },
    "feats": *[_type == "feat" && defined(name)] | order(name asc) {
        name,
        description,
        "benefits": benefits.features
    }
}`;

/**
 * Every list, in one alphabetical order, repeats dropped however they are
 * capitalised. The Archive's own spelling wins where both have an entry.
 */
function mergeNames(...lists: string[][]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const name of lists.flat()) {
        const key = name.trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        out.push(name.trim());
    }
    return out.sort((a, b) => a.localeCompare(b));
}

const CATALOGUE_ARMOR = ARMOR.map((item) => item.name);
const CATALOGUE_WEAPONS = WEAPONS.map((item) => item.name);
const CATALOGUE_MAGIC_ITEMS = MAGIC_ITEMS.map((item) => item.name);

/** The equipment lists with the Archive's entries merged into the catalogue's. */
function equipmentLists(archive: {
    armor?: string[];
    weapons?: string[];
    tools?: string[];
    items?: string[];
    magicItems?: string[];
}) {
    const armor = mergeNames(archive.armor ?? [], CATALOGUE_ARMOR);
    const weapons = mergeNames(archive.weapons ?? [], CATALOGUE_WEAPONS);
    const tools = mergeNames(archive.tools ?? [], TOOLS);
    const magicItems = mergeNames(archive.magicItems ?? [], CATALOGUE_MAGIC_ITEMS);
    const items = mergeNames(archive.items ?? [], weapons, armor, ADVENTURING_GEAR, tools, magicItems);
    return { armor, weapons, tools, magicItems, items, treasure: mergeNames(TREASURE, items) };
}

// Offline, or before the Archive answers, the catalogue alone still searches.
const EMPTY: SheetSuggestions = {
    classes: [],
    species: [],
    backgrounds: [],
    subclasses: [],
    ...equipmentLists({}),
    languages: [],
    itemStats: [],
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
    /** "This spell's damage increases by 1d10 when you reach 5th level…" */
    higherLevels?: string;
}

// `school` is a magicSchool reference in the schema but a plain string in the
// live dataset, so dereference it and fall back to the string. Components vary
// the same way — the ["V","S","M"] array the studio writes against the object
// the seeded documents hold — and are coalesced below.
const SPELLS_QUERY = `*[_type == "spell" && defined(name)] | order(name asc) {
    name,
    level,
    "school": coalesce(school->name, legacySchoolName, "Unknown"),
    castingTime,
    range,
    components,
    concentration,
    ritual,
    duration,
    description,
    higherLevels
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
            higherLevels: plainText(value.higherLevels),
        });
    }
    return out;
}

/** Shared, so pages 3 and 4 open the spell library on one round trip. */
const spellsRequests = new Map<string, Promise<SheetSpell[]>>();

function fetchSheetSpells(edition: string): Promise<SheetSpell[]> {
    let spellsRequest = spellsRequests.get(edition);
    if (!spellsRequest) {
        spellsRequest = sanityClient
            .fetch<unknown>(editionQuery(SPELLS_QUERY, edition), { edition, rulesetKey: `srd-${edition}` })
            .then(normalizeSpells)
            .catch((err) => {
                // Drop the failure so a later mount can try again.
                spellsRequests.delete(edition);
                throw err;
            });
    }
    spellsRequests.set(edition, spellsRequest);
    return spellsRequest;
}

/** Every spell in the Archive, for the spellbook pages' searchable blanks. */
export function useSheetSpells(edition = '2024'): SheetSpell[] {
    const [spells, setSpells] = useState<SheetSpell[]>(NO_SPELLS);
    const [loadedEdition, setLoadedEdition] = useState<string>();

    useEffect(() => {
        let isMounted = true;

        setSpells(NO_SPELLS);
        fetchSheetSpells(edition)
            .then((result) => {
                if (isMounted) { setSpells(result); setLoadedEdition(edition); }
            })
            .catch((err) => {
                // The blanks stay plain text fields without these.
                console.error('Character sheet spells unavailable:', err);
            });

        return () => {
            isMounted = false;
        };
    }, [edition]);

    return loadedEdition === edition ? spells : NO_SPELLS;
}

export function useSheetSuggestions(edition = '2024'): SheetSuggestions {
    const [data, setData] = useState<SheetSuggestions>(EMPTY);
    const [loadedEdition, setLoadedEdition] = useState<string>();

    useEffect(() => {
        let isMounted = true;

        setData(EMPTY);
        sanityClient
            .fetch<Record<string, unknown>>(editionQuery(QUERY, edition), { edition, rulesetKey: `srd-${edition}` })
            .then((result) => {
                if (!isMounted || !result) return;
                setLoadedEdition(edition);
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
                        weaponProficiencies?: string[] | null;
                        unarmedDice?: { level: number; die?: string }[];
                    }>(result.classes),
                    species: uniqueDocs<{
                        name: string;
                        size?: string;
                        speed?: number;
                        isSpellcaster?: boolean;
                        traits?: { name: string; description?: string }[];
                    }>(result.species),
                    backgrounds: uniqueDocs<{
                        name: string;
                        skillProficiencies?: string[];
                        feats?: { name: string }[];
                        originFeatSpellList?: string;
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
                    ...equipmentLists({
                        armor: uniqueNames(result.armor),
                        weapons: uniqueNames(result.weapons),
                        tools: uniqueNames(result.tools),
                        items: uniqueNames(result.items),
                        magicItems: uniqueNames(result.magicItems),
                    }),
                    itemStats: Array.isArray(result.itemStats)
                        ? (result.itemStats as ArchiveItemStats[])
                        : [],
                    languages: languageNames(result.languages),
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
    }, [edition]);

    return loadedEdition === edition ? data : EMPTY;
}
