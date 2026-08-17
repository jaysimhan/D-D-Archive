import { Race, Class, Subclass, Background, AbilityScores, Spell, Feat, Item, Subrace } from "./dnd-types";

export type CreationStep =
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
    personality: {
        traits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
    };
    proficiencies?: {
        skills: { name: string; proficient: boolean; expertise: boolean }[];
        languages: string[];
        tools: string[];
        armor: string[];
        weapons: string[];
    };
    racialBonusAllocation?: Record<string, number>;
    hpMax?: number;
    hpRolls?: number[];
}
