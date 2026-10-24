import type { AbilityScoreMethod, ScoreAssignment } from "../utils/ability-scores";
import type { MulticlassEntry } from "../utils/multiclass";
import { Race, Class, Subclass, Background, AbilityScores, Spell, Feat, Item, Subrace, CharacterRuleset } from "./dnd-types";

export type CreationStep =
    | "ruleset"
    | "name"
    | "race"
    | "subspecies"
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
    "subspecies",
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
    /** How the table levels up; the sheet opens on it. Unset means XP. */
    leveling?: "xp" | "milestone";
    name: string;
    race?: Race;
    subrace?: Subrace;
    class?: Class;
    subclass?: Subclass;
    /** The character's total level; the first class holds what `multiclasses` leaves. */
    level: number;
    /** Classes taken after the first, each with its own level and subclass. */
    multiclasses?: MulticlassEntry[];
    background?: Background;
    abilityScores: AbilityScores;
    selectedSpells: Spell[];
    feats: Feat[];
    /** Kit contents and purchases; written by the equipment step from `startingEquipment`. */
    equipment: EquipmentItem[];
    /** How the starting kits were chosen and what was bought with the gold. */
    startingEquipment?: StartingEquipmentChoices;
    /** The coins left after the starting purchases. */
    currency?: { gp: number; sp: number; cp: number };
    /** A lifestyle tier from LIFESTYLES: "Modest". */
    lifestyle?: string;
    magicItems?: Item[];
    /** Ids of the magic items the character is attuned to, three at most. */
    attunedItemIds?: string[];
    magicInitiateClass?: string;
    metamagicChoices?: string[];
    featSpellcastingAbilities?: Record<string, "INT" | "WIS" | "CHA">;
    /**
     * Where each half feat's flexible ability increase was spent, keyed by feat
     * id: { "feat-fey-touched": { WIS: 1 } }. Held apart from `abilityScores`
     * so dropping the feat drops its bonus with it.
     */
    featAbilityChoices?: Record<string, Partial<AbilityScores>>;
    /**
     * Picks for class features that offer a package, keyed by feature name:
     * { "Divine Order": "Protector" }. Cleared whenever the class changes.
     */
    classFeatureChoices?: Record<string, string>;
    personality: {
        alignment?: string;
        traits?: string;
        ideals?: string;
        bonds?: string;
        flaws?: string;
        appearance?: string;
        backstory?: string;
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
    /** How the base scores were generated; drafts from before the choice existed used point buy. */
    abilityScoreMethod?: AbilityScoreMethod;
    /** The six 4d6-drop-lowest totals, for the rolled method. */
    rolledAbilityScores?: number[];
    /** Standard array and rolled: which entry of the pool each ability took. */
    abilityScoreAssignment?: ScoreAssignment;
    racialBonusAllocation?: Record<string, number>;
    hpMax?: number;
    hpRolls?: number[];
}

/** A piece of equipment, with how many the character carries. */
export type EquipmentItem = Item & { quantity?: number };

export interface StartingEquipmentChoices {
    /** The class kit taken: "A", "B" — or "kit" / "wealth" in 2014. */
    classOption?: string;
    /** The background kit taken: "A" or "B" in 2024. */
    backgroundOption?: string;
    /**
     * Picks inside the kits, keyed by the line's path ("class:fighter:kit/1"):
     * an alternative's index for "(a) or (b)", an item name for "any simple weapon".
     */
    picks?: Record<string, string>;
    /** Gold rolled for 2014 starting wealth, or agreed for a class with no kit. */
    wealth?: number;
    purchases?: Purchase[];
}

export interface Purchase {
    name: string;
    quantity: number;
    /** Price of one, in copper, as listed when it was bought. */
    unitCost: number;
}
