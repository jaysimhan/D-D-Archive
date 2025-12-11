import { useState, useEffect, useCallback } from 'react';
import { fetchSanityData } from '../lib/sanity';
import {
    ALL_CLASSES_QUERY,
    ALL_SUBCLASSES_QUERY,
    ALL_RACES_QUERY,
    ALL_BACKGROUNDS_QUERY,
    ALL_SPELLS_QUERY,
    ALL_FEATS_QUERY,
    ALL_ITEMS_QUERY,
    ALL_MONSTERS_QUERY,
    SUBCLASSES_BY_CLASS_QUERY,
    SPELLS_BY_CLASS_QUERY
} from '../lib/queries';
import type { Class, Subclass, Race, Background, Spell, Feat, Item } from '../types/dnd-types';

// Cache for data to avoid redundant fetches
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedData<T>(key: string): T | null {
    const cached = cache[key];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as T;
    }
    return null;
}

function setCachedData<T>(key: string, data: T): void {
    cache[key] = { data, timestamp: Date.now() };
}

// Generic hook for Sanity data fetching
function useSanityQuery<T>(
    query: string,
    params?: Record<string, unknown>,
    cacheKey?: string
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const key = cacheKey || query + JSON.stringify(params);

    const fetchData = useCallback(async () => {
        // Check cache first
        const cached = getCachedData<T>(key);
        if (cached) {
            setData(cached);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const result = await fetchSanityData<T>(query, params);
            setData(result);
            setCachedData(key, result);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        } finally {
            setLoading(false);
        }
    }, [query, params, key]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}

// ===== CLASSES =====
export function useClasses() {
    return useSanityQuery<Class[]>(ALL_CLASSES_QUERY, undefined, 'all-classes');
}

// ===== SUBCLASSES =====
export function useSubclasses() {
    return useSanityQuery<Subclass[]>(ALL_SUBCLASSES_QUERY, undefined, 'all-subclasses');
}

export function useSubclassesByClass(classId: string) {
    return useSanityQuery<Subclass[]>(
        SUBCLASSES_BY_CLASS_QUERY,
        { classId },
        `subclasses-${classId}`
    );
}

// ===== RACES =====
export function useRaces() {
    return useSanityQuery<Race[]>(ALL_RACES_QUERY, undefined, 'all-races');
}

// ===== BACKGROUNDS =====
export function useBackgrounds() {
    return useSanityQuery<Background[]>(ALL_BACKGROUNDS_QUERY, undefined, 'all-backgrounds');
}

// ===== SPELLS =====
export function useSpells() {
    return useSanityQuery<Spell[]>(ALL_SPELLS_QUERY, undefined, 'all-spells');
}

export function useSpellsByClass(classId: string) {
    return useSanityQuery<Spell[]>(
        SPELLS_BY_CLASS_QUERY,
        { classId },
        `spells-${classId}`
    );
}

// ===== FEATS =====
export function useFeats() {
    return useSanityQuery<Feat[]>(ALL_FEATS_QUERY, undefined, 'all-feats');
}

// ===== ITEMS =====
export function useItems() {
    return useSanityQuery<Item[]>(ALL_ITEMS_QUERY, undefined, 'all-items');
}

// ===== MONSTERS =====
// Note: Monster type would need to be defined in dnd-types.ts
export function useMonsters() {
    return useSanityQuery<unknown[]>(ALL_MONSTERS_QUERY, undefined, 'all-monsters');
}

// ===== COMBINED DATA HOOK =====
// For loading all data at once (useful for initial app load)
export function useAllDndData() {
    const classes = useClasses();
    const subclasses = useSubclasses();
    const races = useRaces();
    const backgrounds = useBackgrounds();
    const spells = useSpells();
    const feats = useFeats();
    const items = useItems();

    const loading =
        classes.loading ||
        subclasses.loading ||
        races.loading ||
        backgrounds.loading ||
        spells.loading ||
        feats.loading ||
        items.loading;

    const error =
        classes.error ||
        subclasses.error ||
        races.error ||
        backgrounds.error ||
        spells.error ||
        feats.error ||
        items.error;

    return {
        classes: classes.data,
        subclasses: subclasses.data,
        races: races.data,
        backgrounds: backgrounds.data,
        spells: spells.data,
        feats: feats.data,
        items: items.data,
        loading,
        error
    };
}
