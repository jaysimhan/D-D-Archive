/**
 * Multiclassing, under the 2014 and 2024 Handbooks.
 *
 * A character's `class`, `subclass` and `level` stay what they always were —
 * the first class, and the character's total level — and any further classes
 * sit in `multiclasses` with their own levels. The first class holds whatever
 * levels the others don't, so a level-9 Fighter 5 / Wizard 4 is
 * `{ class: fighter, level: 9, multiclasses: [{ class: wizard, level: 4 }] }`.
 *
 * Everything that differs from a single-class character is worked out here:
 * prerequisites, the narrower proficiencies a later class hands over, hit
 * points per class, and the combined spellcaster level for spell slots.
 */

import type { AbilityScore, AbilityScores, CharacterRuleset, Class, Spell, Subclass } from "../types/dnd-types";
import type { CharacterData } from "../types/character-creator";
import { classRulesFor, MUSICAL_INSTRUMENTS, type RuleGrant } from "../data/proficiency-rules";

export interface MulticlassEntry {
    class: Class;
    subclass?: Subclass;
    level: number;
}

type ClassLevelInput = Pick<CharacterData, "class" | "subclass" | "level" | "multiclasses">;

/** Levels in the extra classes, together. */
export function extraClassLevels(character: Pick<CharacterData, "multiclasses">): number {
    return (character.multiclasses ?? []).reduce((total, entry) => total + entry.level, 0);
}

/** Levels in the first class: whatever the extra classes leave of the total. */
export function primaryClassLevel(character: Pick<CharacterData, "level" | "multiclasses">): number {
    return Math.max(1, (character.level || 1) - extraClassLevels(character));
}

/** Every class the character has, first class first, each with its own level. */
export function classLevels(character: ClassLevelInput): MulticlassEntry[] {
    if (!character.class) return [];
    return [
        { class: character.class, subclass: character.subclass, level: primaryClassLevel(character) },
        ...(character.multiclasses ?? []),
    ];
}

export function isMulticlassed(character: Pick<CharacterData, "multiclasses">): boolean {
    return (character.multiclasses ?? []).some((entry) => entry.level > 0);
}

/** "Fighter 5 / Wizard 4", or just "Fighter" for a single class. */
export function classLine(character: ClassLevelInput, withSubclass = false): string {
    const entries = classLevels(character);
    if (entries.length <= 1) {
        const only = entries[0];
        if (!only) return "";
        return withSubclass && only.subclass ? `${only.class.name} (${only.subclass.name})` : only.class.name;
    }
    return entries
        .map((entry) => `${entry.class.name}${withSubclass && entry.subclass ? ` (${entry.subclass.name})` : ""} ${entry.level}`)
        .join(" / ");
}

// ===== Prerequisites =====

/**
 * The 13s a class asks of anyone entering or leaving it. The two Handbooks
 * agree class for class: 2014 prints the table, 2024 asks for 13 in each
 * class's primary ability, which comes to the same thing.
 */
const PREREQUISITES: Record<string, { all?: AbilityScore[]; any?: AbilityScore[] }> = {
    artificer: { all: ["INT"] },
    barbarian: { all: ["STR"] },
    bard: { all: ["CHA"] },
    cleric: { all: ["WIS"] },
    druid: { all: ["WIS"] },
    fighter: { any: ["STR", "DEX"] },
    monk: { all: ["DEX", "WIS"] },
    paladin: { all: ["STR", "CHA"] },
    ranger: { all: ["DEX", "WIS"] },
    rogue: { all: ["DEX"] },
    sorcerer: { all: ["CHA"] },
    warlock: { all: ["CHA"] },
    wizard: { all: ["INT"] },
};

const ABILITY_NAMES: Record<AbilityScore, string> = {
    STR: "Strength", DEX: "Dexterity", CON: "Constitution",
    INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma",
};

export const MULTICLASS_MINIMUM = 13;

/** What a class requires, in words: "Strength 13 or Dexterity 13". */
export function prerequisiteText(classData: Class): string {
    const rule = PREREQUISITES[classData.id] ?? { any: classData.primaryAbility };
    const names = (rule.all ?? rule.any ?? []).map((ability) => `${ABILITY_NAMES[ability]} ${MULTICLASS_MINIMUM}`);
    return names.join(rule.all ? " and " : " or ") || "None";
}

function meetsPrerequisite(classData: Class, scores: AbilityScores): boolean {
    // Homebrew classes are asked for any one of their primary abilities.
    const rule = PREREQUISITES[classData.id] ?? { any: classData.primaryAbility };
    if (rule.all?.length) return rule.all.every((ability) => scores[ability] >= MULTICLASS_MINIMUM);
    if (rule.any?.length) return rule.any.some((ability) => scores[ability] >= MULTICLASS_MINIMUM);
    return true;
}

/**
 * Classes whose prerequisite the character misses. A single-class character
 * has nothing to meet; a multiclassed one must meet every class's, the first
 * one included — "both your current class and the class you're entering".
 */
export function unmetMulticlassPrerequisites(
    character: ClassLevelInput,
    scores: AbilityScores,
): { classData: Class; requirement: string }[] {
    if (!isMulticlassed(character)) return [];
    return classLevels(character)
        .filter((entry) => !meetsPrerequisite(entry.class, scores))
        .map((entry) => ({ classData: entry.class, requirement: prerequisiteText(entry.class) }));
}

// ===== Proficiencies =====

/**
 * What a class hands someone who takes it as a later class: less than its
 * first-level kit, and no saving throws. 2014 lists simple weapons where a
 * class grants them; in 2024 every class already knows simple weapons, so the
 * table leaves them out.
 */
const MULTICLASS_PROFICIENCIES: Record<CharacterRuleset, Record<string, RuleGrant>> = {
    "2014": {
        artificer: { armor: ["Light Armor", "Medium Armor", "Shields"], tools: ["Thieves' Tools", "Tinker's Tools"] },
        barbarian: { armor: ["Shields"], weapons: ["Simple Weapons", "Martial Weapons"] },
        bard: {
            armor: ["Light Armor"],
            choices: [
                { kind: "skill", count: 1 },
                { kind: "tool", count: 1, options: MUSICAL_INSTRUMENTS, optionsLabel: "a musical instrument" },
            ],
        },
        cleric: { armor: ["Light Armor", "Medium Armor", "Shields"] },
        druid: { armor: ["Light Armor", "Medium Armor", "Shields"] },
        fighter: { armor: ["Light Armor", "Medium Armor", "Shields"], weapons: ["Simple Weapons", "Martial Weapons"] },
        monk: { weapons: ["Simple Weapons", "Shortsword"] },
        paladin: { armor: ["Light Armor", "Medium Armor", "Shields"], weapons: ["Simple Weapons", "Martial Weapons"] },
        ranger: {
            armor: ["Light Armor", "Medium Armor", "Shields"],
            weapons: ["Simple Weapons", "Martial Weapons"],
            choices: [{ kind: "skill", count: 1, optionsLabel: "the Ranger's skills" }],
        },
        rogue: {
            armor: ["Light Armor"],
            tools: ["Thieves' Tools"],
            choices: [{ kind: "skill", count: 1, optionsLabel: "the Rogue's skills" }],
        },
        sorcerer: {},
        warlock: { armor: ["Light Armor"], weapons: ["Simple Weapons"] },
        wizard: {},
    },
    "2024": {
        artificer: { armor: ["Light Armor", "Medium Armor", "Shields"], tools: ["Thieves' Tools", "Tinker's Tools"] },
        barbarian: { armor: ["Shields"], weapons: ["Martial Weapons"] },
        bard: {
            armor: ["Light Armor"],
            choices: [
                { kind: "skill", count: 1 },
                { kind: "tool", count: 1, options: MUSICAL_INSTRUMENTS, optionsLabel: "a musical instrument" },
            ],
        },
        cleric: { armor: ["Light Armor", "Medium Armor", "Shields"] },
        druid: { armor: ["Light Armor", "Shields"] },
        fighter: { armor: ["Light Armor", "Medium Armor", "Shields"], weapons: ["Martial Weapons"] },
        monk: {},
        paladin: { armor: ["Light Armor", "Medium Armor", "Shields"], weapons: ["Martial Weapons"] },
        ranger: {
            armor: ["Light Armor", "Medium Armor", "Shields"],
            weapons: ["Martial Weapons"],
            choices: [{ kind: "skill", count: 1, optionsLabel: "the Ranger's skills" }],
        },
        rogue: {
            armor: ["Light Armor"],
            tools: ["Thieves' Tools"],
            choices: [{ kind: "skill", count: 1, optionsLabel: "the Rogue's skills" }],
        },
        sorcerer: {},
        warlock: { armor: ["Light Armor"] },
        wizard: {},
    },
};

/**
 * A later class's proficiencies. A skill "from the class's list" is filled in
 * from that class's own skill choice, so the Ranger's and Rogue's lists stay
 * in one place. A homebrew class with no entry here hands over nothing; the
 * rules only promise the first class's full kit.
 */
export function multiclassProficiencies(classData: Class, ruleset: CharacterRuleset = "2024"): RuleGrant | undefined {
    const grant = MULTICLASS_PROFICIENCIES[ruleset][classData.id];
    if (!grant) return undefined;
    const classSkills = classRulesFor(classData, ruleset)?.base.choices?.find((choice) => choice.kind === "skill")?.options;
    return {
        ...grant,
        choices: grant.choices?.map((choice) =>
            choice.kind === "skill" && choice.optionsLabel && classSkills ? { ...choice, options: classSkills } : choice),
    };
}

// ===== Hit points =====

/**
 * The first class's first level is the only one taken at its maximum; every
 * other level of every class rolls (or takes the average of) its own die.
 */
export function levelDice(character: ClassLevelInput): { die: number; label: string }[] {
    return classLevels(character).flatMap((entry) =>
        Array.from({ length: entry.level }, (_, index) => ({
            die: entry.class.hitDie || 8,
            label: `${entry.class.name} ${index + 1}`,
        })));
}

// ===== Spellcasting =====

type CasterType = NonNullable<Class["spellcaster"]>;

function casterTypeOf(entry: MulticlassEntry): CasterType | "third" | undefined {
    const type = entry.class.spellcaster;
    if (type && type !== "none" && type !== "None") return type;
    // Eldritch Knight and Arcane Trickster bring a third-caster's slots.
    if (entry.subclass?.isSpellcaster || entry.subclass?.spellcaster) return "third";
    return undefined;
}

/**
 * The spellcaster level the multiclass slot table reads: full casters count
 * every level, half casters half, third casters a third. 2014 rounds the half
 * casters down (the artificer up); 2024 rounds every half caster up. Pact
 * Magic keeps its own slots and is left out.
 */
export function multiclassCasterLevel(character: ClassLevelInput, ruleset: CharacterRuleset = "2024"): number {
    return classLevels(character).reduce((total, entry) => {
        switch (casterTypeOf(entry)) {
            case "full":
                return total + entry.level;
            case "half":
                return total + (ruleset === "2024" ? Math.ceil(entry.level / 2) : Math.floor(entry.level / 2));
            case "half-up":
                return total + Math.ceil(entry.level / 2);
            case "third":
                return total + Math.floor(entry.level / 3);
            default:
                return total;
        }
    }, 0);
}

/** How many of the character's classes have the Spellcasting feature (not Pact Magic). */
export function spellcastingClassCount(character: ClassLevelInput): number {
    return classLevels(character).filter((entry) => {
        const type = casterTypeOf(entry);
        return type && type !== "pact" && type !== "special";
    }).length;
}

/** The highest slot level a full caster of this spellcaster level has. */
export function maxSlotLevelForCasterLevel(casterLevel: number): number {
    if (casterLevel <= 0) return 0;
    return Math.min(9, Math.ceil(casterLevel / 2));
}

// ===== Spells =====

/**
 * Spells picked for a later class are marked with that class, so dropping or
 * re-levelling the class takes exactly its picks with it.
 */
export function multiclassSlotId(classId: string, slot: string): string {
    return `mc:${classId}:${slot}`;
}

export function multiclassSpellClass(spell: Pick<Spell, "selectionSlotId">): string | undefined {
    const match = /^mc:([^:]+):/.exec(spell.selectionSlotId ?? "");
    return match?.[1];
}

/** Drops the later-class picks of every class `keep` turns down. */
export function withoutMulticlassSpells(spells: Spell[], keep: (classId: string) => boolean): Spell[] {
    return spells.filter((spell) => {
        const classId = multiclassSpellClass(spell);
        return !classId || keep(classId);
    });
}
