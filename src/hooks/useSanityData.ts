import { RACES } from '../data/races';
import { BACKGROUNDS } from '../data/backgrounds';
import { FEATS } from '../data/feats';
import { CLASSES } from '../data/classes';
import { SUBCLASSES } from '../data/subclasses';
import { SPELLS } from '../data/spells';
import { ITEMS } from '../data/items';
import type { Class, Subclass, Race, Background, Spell, Feat, Item } from '../types/dnd-types';

// Helper to wrap local data in the hook format
function useLocalData<T>(data: T) {
    return {
        data,
        loading: false,
        error: null,
        refetch: () => { }
    };
}

// ===== CLASSES =====
export function useClasses() {
    return useLocalData<Class[]>(CLASSES);
}

// ===== SUBCLASSES =====
export function useSubclasses() {
    return useLocalData<Subclass[]>(SUBCLASSES);
}

export function useSubclassesByClass(classId: string) {
    const filtered = SUBCLASSES.filter(s => s.parentClassId === classId);
    return useLocalData<Subclass[]>(filtered);
}

// ===== RACES =====
export function useRaces() {
    return useLocalData<Race[]>(RACES);
}

// ===== BACKGROUNDS =====
export function useBackgrounds() {
    return useLocalData<Background[]>(BACKGROUNDS);
}

// ===== SPELLS =====
export function useSpells() {
    return useLocalData<Spell[]>(SPELLS);
}

export function useSpellsByClass(classId: string) {
    // Note: This matches the rough logic of "available spells"
    // For a simple list, we return all spells that *can* be cast by the class
    const filtered = SPELLS.filter(s => s.classes.includes(classId));
    return useLocalData<Spell[]>(filtered);
}

// ===== FEATS =====
export function useFeats() {
    return useLocalData<Feat[]>(FEATS);
}

// ===== ITEMS =====
export function useItems() {
    return useLocalData<Item[]>(ITEMS);
}

// ===== MONSTERS =====
export function useMonsters() {
    // No local monster data yet, returning empty
    return useLocalData<unknown[]>([]);
}

// ===== COMBINED DATA HOOK =====
export function useAllDndData() {
    return {
        classes: CLASSES,
        subclasses: SUBCLASSES,
        races: RACES,
        backgrounds: BACKGROUNDS,
        spells: SPELLS,
        feats: FEATS,
        items: ITEMS,
        loading: false,
        error: null
    };
}
