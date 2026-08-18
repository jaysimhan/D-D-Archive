import {
    isCreationStep,
    type CharacterData,
    type CreationStep,
} from "../types/character-creator";
import type { Spell, SpellSchool } from "../types/dnd-types";

/**
 * The creator used to hold the whole character in React state, so a refresh —
 * or any reload the browser decided to do on its own — sent the player back to
 * step one with nothing kept. Both halves of the flow now write to
 * localStorage: the creator saves a draft after every edit, and finishing
 * stamps a copy that /character-sheet can be opened against directly.
 */
const DRAFT_KEY = "dnd-archive:creator-draft";
const SHEET_KEY = "dnd-archive:last-sheet";

/** How long a finished character stays on offer at /character-sheet. */
export const SHEET_TTL_MS = 60 * 60 * 1000;

export interface CreatorDraft {
    step: CreationStep;
    character: CharacterData;
}

export function createEmptyCharacter(): CharacterData {
    return {
        ruleset: undefined,
        name: "",
        level: 1,
        abilityScores: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
        selectedSpells: [],
        feats: [],
        equipment: [],
        magicItems: [],
        magicInitiateClass: undefined,
        personality: {},
        proficiencies: {
            skills: [],
            languages: [],
            tools: [],
            armor: [],
            weapons: [],
        },
        proficiencyChoices: {},
        customProficiencies: {
            skills: [],
            expertise: [],
            languages: [],
            tools: [],
            armor: [],
            weapons: [],
        },
        racialBonusAllocation: {},
    };
}

function readJson(key: string): unknown {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        // Storage can be blocked outright (private windows, cookie settings)
        // and what is in it can be half-written. Either way there is nothing to
        // restore, so the caller starts fresh instead of crashing.
        return null;
    }
}

function writeJson(key: string, value: unknown): void {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (cause) {
        // Nothing to do but carry on in memory: the session still works, it
        // just will not survive a refresh.
        console.warn("Could not save character progress", cause);
    }
}

function removeKey(key: string): void {
    try {
        window.localStorage.removeItem(key);
    } catch {
        /* see readJson */
    }
}

const asArray = <T,>(value: unknown, fallback: T[] = []): T[] =>
    Array.isArray(value) ? (value as T[]) : fallback;

const SPELL_SCHOOLS = new Set<SpellSchool>([
    "Abjuration", "Conjuration", "Divination", "Enchantment",
    "Evocation", "Illusion", "Necromancy", "Transmutation",
]);

/** Old public queries could persist the Sanity school reference itself. */
function normalizeStoredSpell(value: unknown): Spell | null {
    if (!value || typeof value !== "object") return null;
    const spell = value as Spell & {
        school?: unknown;
        legacySchoolName?: unknown;
    };
    const referencedName = spell.school && typeof spell.school === "object"
        ? (spell.school as { name?: unknown }).name
        : undefined;
    const candidate = typeof spell.school === "string"
        ? spell.school
        : typeof spell.legacySchoolName === "string"
            ? spell.legacySchoolName
            : typeof referencedName === "string"
                ? referencedName
                : "Unknown";
    return {
        ...spell,
        // Unknown is intentionally tolerated for a homebrew/legacy record; it
        // is render-safe and the live archive refresh can replace it by id.
        school: (SPELL_SCHOOLS.has(candidate as SpellSchool) ? candidate : "Unknown") as SpellSchool,
    };
}

/** The proficiency picks, dropping any entry that is not a list of names. */
function asRecordOfArrays(value: unknown): Record<string, string[]> {
    if (!value || typeof value !== "object") return {};
    const out: Record<string, string[]> = {};
    for (const [key, picks] of Object.entries(value as Record<string, unknown>)) {
        if (!Array.isArray(picks)) continue;
        const names = picks.filter((pick): pick is string => typeof pick === "string");
        if (names.length) out[key] = names;
    }
    return out;
}

/**
 * Anything read back may predate the current shape of CharacterData, and the
 * step components index into these fields without checking. Layering the
 * stored values over a fresh character keeps every field present and the right
 * kind, so an old or truncated payload cannot take a step down with it.
 */
function normalizeCharacter(value: unknown): CharacterData | null {
    if (!value || typeof value !== "object") return null;

    const stored = value as Partial<CharacterData>;
    const empty = createEmptyCharacter();

    return {
        ...empty,
        ...stored,
        ruleset: stored.ruleset === "2014" || stored.ruleset === "2024" ? stored.ruleset : undefined,
        name: typeof stored.name === "string" ? stored.name : empty.name,
        level: typeof stored.level === "number" ? stored.level : empty.level,
        abilityScores: { ...empty.abilityScores, ...(stored.abilityScores ?? {}) },
        selectedSpells: asArray(stored.selectedSpells)
            .map(normalizeStoredSpell)
            .filter((spell): spell is Spell => Boolean(spell)),
        feats: asArray(stored.feats),
        equipment: asArray(stored.equipment),
        magicItems: asArray(stored.magicItems),
        personality: { ...(stored.personality ?? {}) },
        proficiencies: {
            skills: asArray(stored.proficiencies?.skills),
            languages: asArray(stored.proficiencies?.languages),
            tools: asArray(stored.proficiencies?.tools),
            armor: asArray(stored.proficiencies?.armor),
            weapons: asArray(stored.proficiencies?.weapons),
        },
        // A draft saved before the step followed the rules has no picks to
        // restore; the creator rebuilds the granted half from the character.
        proficiencyChoices: asRecordOfArrays(stored.proficiencyChoices),
        customProficiencies: {
            skills: asArray(stored.customProficiencies?.skills),
            expertise: asArray(stored.customProficiencies?.expertise),
            languages: asArray(stored.customProficiencies?.languages),
            tools: asArray(stored.customProficiencies?.tools),
            armor: asArray(stored.customProficiencies?.armor),
            weapons: asArray(stored.customProficiencies?.weapons),
        },
        racialBonusAllocation: stored.racialBonusAllocation ?? {},
        hpRolls: Array.isArray(stored.hpRolls) ? stored.hpRolls : undefined,
    };
}

export function loadDraft(): CreatorDraft | null {
    const stored = readJson(DRAFT_KEY) as Partial<CreatorDraft> | null;
    const character = normalizeCharacter(stored?.character);
    if (!character) return null;

    return {
        // A step that no longer exists would leave the creator with nowhere to
        // land, so an unrecognised one is dropped and the creator picks up at
        // the first step the draft has actually earned.
        step: isCreationStep(stored?.step) ? stored.step : "ruleset",
        character,
    };
}

export function saveDraft(character: CharacterData, step: CreationStep): void {
    writeJson(DRAFT_KEY, { step, character } satisfies CreatorDraft);
}

export function clearDraft(): void {
    removeKey(DRAFT_KEY);
}

export function saveCompletedSheet(character: CharacterData): void {
    writeJson(SHEET_KEY, { completedAt: Date.now(), character });
}

/**
 * The character behind the last completed run, or null once it is more than an
 * hour old — opening /character-sheet on its own is meant to hand back a sheet
 * the player was just working on, not one from another sitting.
 */
export function loadCompletedSheet(): CharacterData | null {
    const stored = readJson(SHEET_KEY) as
        | { completedAt?: number; character?: unknown }
        | null;
    if (!stored) return null;

    const completedAt = stored.completedAt;
    const isFresh =
        typeof completedAt === "number" && Date.now() - completedAt < SHEET_TTL_MS;
    if (!isFresh) {
        removeKey(SHEET_KEY);
        return null;
    }

    return normalizeCharacter(stored.character);
}

export function hasRecentSheet(): boolean {
    return loadCompletedSheet() !== null;
}
