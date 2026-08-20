import { Race, Class, Subclass, Background, AbilityScores, Spell, Feat, Item, Subrace, CharacterRuleset } from "./dnd-types";

export type CreationStep =
    | "ruleset"
    | "name"
    | "race"
    | "class"
    | "subclass"
    | "abilities"
    | "background"
    | "spells"
    | "feats"
    | "proficiencies"
    | "hp"
    | "equipment"
    | "magic-item"
    | "personality";

/**
 * Every step id, which doubles as its URL: /creator/race, /creator/magic-item.
 * The creator builds its own running order from the character (a fighter never
 * sees "spells"); this is only the vocabulary a URL is allowed to use.
 */
export const CREATION_STEPS: CreationStep[] = [
    "ruleset",
    "name",
    "race",
    "class",
    "subclass",
    "abilities",
    "background",
    "spells",
    "feats",
    "proficiencies",
    "hp",
    "equipment",
    "magic-item",
    "personality",
];

export function isCreationStep(value: unknown): value is CreationStep {
    return CREATION_STEPS.includes(value as CreationStep);
}

export interface CharacterData {
    /** Mechanical rules used for every Sanity-backed creator choice. */
    ruleset?: CharacterRuleset;
    name: string;
    race?: Race;
    subrace?: Subrace;
    class?: Class;
    subclass?: Subclass;
    level: number;
    background?: Background;
    abilityScores: AbilityScores;
    selectedSpells: Spell[];
    feats: Feat[];
    equipment: Item[];
    magicItems?: Item[];
    magicInitiateClass?: string;
    metamagicChoices?: string[];
    featSpellcastingAbilities?: Record<string, "INT" | "WIS" | "CHA">;
    /**
     * Where each half feat's flexible ability increase was spent, keyed by feat
     * id: { "feat-fey-touched": { WIS: 1 } }. Held apart from `abilityScores`
     * so dropping the feat drops its bonus with it.
     */
    featAbilityChoices?: Record<string, Partial<AbilityScores>>;
    personality: {
        traits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
    };
    /**
     * The proficiencies the character ends up with: what their species, class,
     * subclass, background and feats grant, plus whatever they chose. Written
     * by the creator from `proficiencyChoices`, and read by the sheet.
     */
    proficiencies?: {
        skills: { name: string; proficient: boolean; expertise: boolean }[];
        languages: string[];
        tools: string[];
        armor: string[];
        weapons: string[];
    };
    /**
     * The picks behind the proficiencies above, keyed by the choice that offered
     * them ("choose 2 cleric skills"). Kept apart from the result so changing
     * class drops only the picks that class was offering.
     */
    proficiencyChoices?: Record<string, string[]>;
    /** Proficiencies added by hand, for homebrew the Archive has no rules for. */
    customProficiencies?: {
        skills: string[];
        expertise: string[];
        languages: string[];
        tools: string[];
        armor: string[];
        weapons: string[];
    };
    racialBonusAllocation?: Record<string, number>;
    hpMax?: number;
    hpRolls?: number[];
}
