import type {
    AbilityScore,
    AbilityScores,
    CharacterRuleset,
    Class,
    Feat,
    FeatCategory,
    Race,
    Subclass,
    Subrace,
} from "../types/dnd-types";
import type { CharacterData } from "../types/character-creator";
import { isMetamagicFeat } from "./combat-progression";
import { classLevels, type MulticlassEntry } from "./multiclass";

/**
 * Feats a character may take, and what the ones they took actually do.
 *
 * The Archive stores a feat as prose plus a handful of structured fields, so
 * everything mechanical — how many feats are on offer, whether this character
 * qualifies, what the half feats add to an ability score — is worked out here
 * rather than in each step and again on the sheet.
 */

// ===== Slots =====

/**
 * Class levels with an Ability Score Improvement, where the character takes
 * either the improvement or a feat. Fighters and Rogues get extra ones; under
 * 2024 the level-19 one is the Epic Boon, which may still be any feat.
 */
const ASI_LEVELS = [4, 8, 12, 16, 19];
const EXTRA_ASI_LEVELS: Record<string, number[]> = {
    fighter: [6, 14],
    rogue: [10],
};

export function asiLevelsFor(classId: string | undefined, level: number): number[] {
    return [...ASI_LEVELS, ...(EXTRA_ASI_LEVELS[classId ?? ""] ?? [])]
        .filter((asiLevel) => asiLevel <= level)
        .sort((a, b) => a - b);
}

/** A class level whose improvement is the 2024 Epic Boon. */
export function isEpicBoonSlot(classLevel: number, ruleset?: CharacterRuleset): boolean {
    return ruleset === "2024" && classLevel === 19;
}

/** One Ability Score Improvement the character has to spend. */
export interface ImprovementSlot {
    /** What a feat taken here records as `takenAt`. */
    takenAt: number | `${string}:${number}`;
    classId: string;
    className: string;
    classLevel: number;
    epicBoon: boolean;
}

/**
 * Every improvement the character has earned, class by class. Improvements
 * come from class levels, not character level: a Fighter 6 / Wizard 4 has the
 * Fighter's at 4 and 6 and the Wizard's at 4. The first class keys its slots
 * by level alone, so a single-class character's choices survive a change of
 * class; extra classes key theirs as "wizard:4".
 */
export function improvementSlots(
    character: Pick<CharacterData, "class" | "subclass" | "level" | "multiclasses" | "ruleset">,
): ImprovementSlot[] {
    return classLevels(character).flatMap((entry, index) =>
        asiLevelsFor(entry.class.id, entry.level).map((classLevel) => ({
            takenAt: index === 0 ? classLevel : `${entry.class.id}:${classLevel}` as const,
            classId: entry.class.id,
            className: entry.class.name,
            classLevel,
            epicBoon: isEpicBoonSlot(classLevel, character.ruleset),
        })),
    );
}

/** The abilities in the order every panel lists them. */
export const ABILITIES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/**
 * Humans are named in prose rather than as a structured trait, so the name is
 * what identifies them.
 */
export function isHumanSpecies(race: Race | undefined, subrace?: Subrace): boolean {
    const names = [race?.name, race?.id, subrace?.name, subrace?.id];
    return names.some((name) => typeof name === "string" && name.trim().toLowerCase().startsWith("human"));
}

/**
 * A 2024 Human's Versatile trait grants an Origin feat at level 1. The 2014
 * Human is the standard one (+1 to every score); the Archive has no Variant
 * Human, so no 2014 species hands out a feat.
 */
export function speciesGrantsOriginFeat(ruleset: CharacterRuleset | undefined, race?: Race, subrace?: Subrace): boolean {
    return ruleset === "2024" && isHumanSpecies(race, subrace);
}

/** The feat a character took for one choice, if they have taken one. */
export function featTakenAt(feats: Feat[], takenAt: Feat["takenAt"]): Feat | undefined {
    return feats.find((feat) => feat.takenAt === takenAt);
}

// ===== The Ability Score Improvement itself =====

const ASI_ID_PREFIX = "ability-score-improvement@";

/**
 * The improvement is stored as a feat so the +2 flows through the same
 * ability-choice bookkeeping as a half feat's +1. In 2024 it is a feat in its
 * own right; in 2014 it is a class feature the sheet keeps off its feat list.
 */
export function abilityScoreImprovement(slot: ImprovementSlot["takenAt"], ruleset: CharacterRuleset | undefined): Feat {
    return {
        id: `${ASI_ID_PREFIX}${slot}`,
        name: "Ability Score Improvement",
        description: "Increase one ability score by 2, or two ability scores by 1 each. This can't raise a score above 20.",
        source: "Official",
        edition: ruleset ?? "2024",
        version: 1,
        featCategory: "General",
        benefits: {
            flexibleAbilityIncrease: { amount: 2, maxPerAbility: 2, options: [] },
            features: ["+2 to one ability score, or +1 to two"],
        },
        takenAt: slot,
    };
}

export function isAbilityScoreImprovement(feat: Feat): boolean {
    return feat.id.startsWith(ASI_ID_PREFIX);
}

/** The Archive's own 2024 "Ability Score Improvement" document, which the slot offers as its own option. */
function isArchiveAsiDocument(feat: Feat): boolean {
    return !isAbilityScoreImprovement(feat) && /^ability score improvement$/i.test(feat.name.trim());
}

// ===== What a choice may be spent on =====

/**
 * Feats offered at an Ability Score Improvement. 2014 has no feat categories
 * of its own: Fighting Styles are class features and the DMG's boons are DM
 * rewards, so neither is a feat there. In 2024 any feat the character
 * qualifies for will do, Epic Boons only from level 19.
 */
export function featsForImprovement(feats: Feat[], ruleset: CharacterRuleset | undefined): Feat[] {
    return feats.filter((feat) => {
        if (isArchiveAsiDocument(feat)) return false;
        const category = featCategoryOf(feat);
        if (ruleset === "2014") return category !== "Epic Boon" && category !== "Fighting Style";
        return true;
    });
}

/** A 2024 Human's Versatile pick: Origin feats only. */
export function featsForSpecies(feats: Feat[]): Feat[] {
    return feats.filter((feat) => featCategoryOf(feat) === "Origin");
}

/**
 * The feats a character has actually earned, in a stable order: background,
 * then species, then each improvement level. Anything left over — a slot above
 * the new level, a class change that moved the Fighter's extra improvements,
 * a feat picked under the old level-1 rules — is dropped.
 */
export function earnedFeats(
    character: Pick<CharacterData, "feats" | "level" | "ruleset" | "class" | "subclass" | "multiclasses" | "race" | "subrace" | "background">,
): Feat[] {
    const fromBackground = new Set((character.background?.feats ?? []).map((feat) => feat.id));
    const slots = improvementSlots(character).map((slot) => slot.takenAt);
    const speciesFeat = speciesGrantsOriginFeat(character.ruleset, character.race, character.subrace);
    const order = (feat: Feat) =>
        feat.takenAt === undefined ? -2 : feat.takenAt === "species" ? -1 : slots.indexOf(feat.takenAt);

    return character.feats
        .filter((feat) => {
            if (feat.takenAt === undefined) return fromBackground.has(feat.id);
            if (feat.takenAt === "species") return speciesFeat;
            return slots.includes(feat.takenAt);
        })
        .sort((a, b) => order(a) - order(b));
}

/** Improvements still waiting on a choice, or on where its points go. */
export function unfinishedImprovements(
    character: Pick<CharacterData, "feats" | "featAbilityChoices" | "level" | "ruleset" | "class" | "subclass" | "multiclasses">,
): ImprovementSlot[] {
    return improvementSlots(character).filter((slot) => {
        const taken = featTakenAt(character.feats, slot.takenAt);
        return !taken || unspentAbilityPoints(taken, character.featAbilityChoices) > 0;
    });
}

// ===== Categories =====

/**
 * Feats predating the 2024 split carry no category. Those named among the 2024
 * Origin feats are treated as Origin; everything else counts as General.
 */
const ORIGIN_FEAT_NAMES = new Set([
    "alert", "crafter", "healer", "lucky", "magic initiate", "musician",
    "savage attacker", "skilled", "tavern brawler", "tough",
]);

export function featCategoryOf(feat: Feat): FeatCategory {
    if (feat.featCategory) return feat.featCategory;
    const name = feat.name.trim().toLowerCase();
    if (ORIGIN_FEAT_NAMES.has(name)) return "Origin";
    if (name.startsWith("epic boon")) return "Epic Boon";
    if (/^fighting style\b/.test(name)) return "Fighting Style";
    return "General";
}

// ===== Prerequisites =====

export interface PrerequisiteContext {
    level: number;
    ruleset?: CharacterRuleset;
    abilityScores?: AbilityScores;
    race?: Race;
    subrace?: Subrace;
    class?: Class;
    subclass?: Subclass;
    feats?: Feat[];
    /** Armor the character is trained with, for "Medium Armor training" and the like. */
    armor?: string[];
    /** The choice being made, so the feat already in it doesn't count as taken twice. */
    takenAt?: Feat["takenAt"];
    /**
     * Every class with its own level, for a multiclassed character. Without
     * it, `class` and `subclass` are read as one class at `level`.
     */
    classes?: MulticlassEntry[];
}

/** The classes a prerequisite is checked against. */
function contextClasses(context: PrerequisiteContext): MulticlassEntry[] {
    if (context.classes?.length) return context.classes;
    return context.class ? [{ class: context.class, subclass: context.subclass, level: context.level }] : [];
}

/** Class levels that grant the Fighting Style feature, in both rulesets. */
const FIGHTING_STYLE_LEVELS: Record<string, number> = { fighter: 1, paladin: 2, ranger: 2 };

/** Feats the rules let a character take more than once. */
const REPEATABLE = new Set(["ability score improvement", "elemental adept"]);

const ABILITY_LABELS: Record<AbilityScore, string> = {
    STR: "Strength", DEX: "Dexterity", CON: "Constitution",
    INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma",
};

export function hasSpellcasting(context: PrerequisiteContext): boolean {
    return contextClasses(context).some(({ class: classData, subclass }) => Boolean(
        classData?.isSpellcaster ||
        (classData?.spellcaster && !["none", "None", "false"].includes(String(classData.spellcaster))) ||
        subclass?.isSpellcaster ||
        subclass?.spellcaster,
    ));
}

/**
 * One reason a character falls short of a feat.
 *
 * `advisory` reasons do not block the pick. Feats are chosen after ability
 * scores, so every reason checked here is a hard one; the flag stays for
 * prerequisites that may one day be read without the scores to hand.
 */
export interface UnmetPrerequisite {
    kind: "level" | "ability" | "race" | "class" | "feature" | "duplicate";
    text: string;
    advisory: boolean;
}

/**
 * Why a character cannot take a feat, as lines fit for a tooltip. An empty
 * array means they qualify. Unknown prerequisite text is not guessed at — only
 * the ones with a structured meaning are enforced.
 */
export function unmetPrerequisites(feat: Feat, context: PrerequisiteContext): UnmetPrerequisite[] {
    const reasons: UnmetPrerequisite[] = [];
    const prerequisites = feat.prerequisites;

    if (prerequisites?.level && context.level < prerequisites.level) {
        reasons.push({ kind: "level", advisory: false, text: `Requires level ${prerequisites.level}` });
    }

    const minimums = ABILITIES
        .map((ability) => ({ ability, required: prerequisites?.abilityScore?.[ability] ?? 0 }))
        .filter(({ required }) => required > 0);
    const meets = ({ ability, required }: { ability: AbilityScore; required: number }) =>
        (context.abilityScores?.[ability] ?? 0) >= required;
    const scoresKnown = context.abilityScores !== undefined;
    if (prerequisites?.abilityScoreAnyOf && minimums.length > 1) {
        if (!minimums.some(meets)) {
            reasons.push({
                kind: "ability",
                advisory: !scoresKnown,
                text: `Needs ${minimums.map(({ ability }) => ABILITY_LABELS[ability]).join(" or ")} ${minimums[0].required}`,
            });
        }
    } else {
        for (const minimum of minimums.filter((entry) => !meets(entry))) {
            reasons.push({
                kind: "ability",
                advisory: !scoresKnown,
                text: `Needs ${ABILITY_LABELS[minimum.ability]} ${minimum.required}`,
            });
        }
    }

    if (prerequisites?.race?.length) {
        const owned = [context.race?.id, context.race?.name, context.subrace?.id, context.subrace?.name]
            .filter(Boolean)
            .map((value) => String(value).toLowerCase());
        const allowed = prerequisites.race.map((value) => value.toLowerCase());
        if (!allowed.some((value) => owned.some((name) => name.includes(value) || value.includes(name)))) {
            reasons.push({
                kind: "race",
                advisory: false,
                text: `Requires species: ${prerequisites.race.join(", ")}`,
            });
        }
    }

    if (prerequisites?.class?.length) {
        const owned = contextClasses(context)
            .flatMap((entry) => [entry.class.id, entry.class.name, entry.subclass?.id, entry.subclass?.name])
            .filter(Boolean)
            .map((value) => String(value).toLowerCase());
        const allowed = prerequisites.class.map((value) => value.toLowerCase());
        if (!allowed.some((value) => owned.some((name) => name.includes(value) || value.includes(name)))) {
            reasons.push({
                kind: "class",
                advisory: false,
                text: `Requires class: ${prerequisites.class.join(", ")}`,
            });
        }
    }

    // "Spellcasting or Pact Magic" is the only feature prerequisite the Archive
    // can check; the rest name class features the creator does not track.
    // The Metamagic feats carry that prerequisite in print, but the 2024
    // document leaves the field empty, so it is applied on the name as well —
    // without it a Fighter could take a feat with nowhere to spend it.
    const featureLines = prerequisites?.features ?? [];
    const needsSpellcasting =
        featureLines.some((line) => /spellcasting|pact magic/i.test(line)) || isMetamagicFeat(feat);
    if (needsSpellcasting && !hasSpellcasting(context)) {
        reasons.push({
            kind: "feature",
            advisory: false,
            text: "Requires the Spellcasting or Pact Magic feature",
        });
    }

    const needsFightingStyle =
        featCategoryOf(feat) === "Fighting Style" || featureLines.some((line) => /fighting style/i.test(line));
    const hasFightingStyle = contextClasses(context).some((entry) => {
        const styleLevel = FIGHTING_STYLE_LEVELS[entry.class.id];
        return styleLevel !== undefined && entry.level >= styleLevel;
    });
    if (needsFightingStyle && !hasFightingStyle) {
        reasons.push({ kind: "feature", advisory: false, text: "Requires the Fighting Style feature" });
    }

    // "Medium Armor training" (2024) and "Proficiency with medium armor" (2014)
    // ask the same thing, and the creator knows the answer once proficiencies are read.
    if (context.armor) {
        const trained = context.armor.map((entry) => entry.toLowerCase());
        for (const line of featureLines) {
            const kind = line.match(/\b(light|medium|heavy) armor\b|\bshields?\b/i)?.[0].toLowerCase();
            if (!kind) continue;
            const needle = kind.startsWith("shield") ? "shield" : kind;
            const has = trained.some((entry) => entry.includes(needle) || (entry === "all armor" && needle !== "shield"));
            if (!has) reasons.push({ kind: "feature", advisory: false, text: `Requires ${line}` });
        }
    }

    // A feat is never taken twice, save the few the rules call repeatable.
    const name = feat.name.trim().toLowerCase();
    const alreadyTaken = (context.feats ?? []).some(
        (taken) => taken.takenAt !== context.takenAt && taken.name.trim().toLowerCase() === name,
    );
    if (alreadyTaken && !REPEATABLE.has(name)) {
        reasons.push({ kind: "duplicate", advisory: false, text: "Already taken" });
    }

    return reasons;
}

/** Reasons that actually stop the pick, ignoring the advisory ones. */
export function blockingPrerequisites(feat: Feat, context: PrerequisiteContext): UnmetPrerequisite[] {
    return unmetPrerequisites(feat, context).filter((reason) => !reason.advisory);
}

export function meetsPrerequisites(feat: Feat, context: PrerequisiteContext): boolean {
    return blockingPrerequisites(feat, context).length === 0;
}

// ===== Ability score increases =====

export function flexibleAbilityOptions(feat: Feat): AbilityScore[] {
    const flexible = feat.benefits?.flexibleAbilityIncrease;
    if (!flexible) return [];
    // An empty list is the Archive's shorthand for "any ability score".
    return flexible.options?.length ? flexible.options : ABILITIES;
}

export function flexibleAbilityAmount(feat: Feat): number {
    return feat.benefits?.flexibleAbilityIncrease?.amount ?? 0;
}

export function maxPerAbility(feat: Feat): number {
    return feat.benefits?.flexibleAbilityIncrease?.maxPerAbility ?? 1;
}

/** Feats whose increase the character still has to place. */
export function halfFeats(feats: Feat[]): Feat[] {
    return feats.filter((feat) => flexibleAbilityAmount(feat) > 0);
}

function pointsSpent(choice: Partial<AbilityScores> | undefined): number {
    return Object.values(choice ?? {}).reduce((total, value) => total + (value ?? 0), 0);
}

/** Points a half feat still has left to place. */
export function unspentAbilityPoints(
    feat: Feat,
    choices: Record<string, Partial<AbilityScores>> | undefined,
): number {
    return Math.max(0, flexibleAbilityAmount(feat) - pointsSpent(choices?.[feat.id]));
}

export function hasUnspentAbilityPoints(
    feats: Feat[],
    choices: Record<string, Partial<AbilityScores>> | undefined,
): boolean {
    return halfFeats(feats).some((feat) => unspentAbilityPoints(feat, choices) > 0);
}

/**
 * One click of an ability bubble. Points cycle rather than needing a separate
 * clear: a full ability wraps back to nothing so the pick can be moved.
 */
export function toggleFeatAbilityPoint(
    feat: Feat,
    ability: AbilityScore,
    choices: Record<string, Partial<AbilityScores>> | undefined,
): Record<string, Partial<AbilityScores>> {
    const next = { ...(choices ?? {}) };
    const current = { ...(next[feat.id] ?? {}) };
    const held = current[ability] ?? 0;
    const cap = Math.min(maxPerAbility(feat), flexibleAbilityAmount(feat));

    // A full ability, or one holding points when none are left, gives them back.
    if (held >= cap || (held > 0 && pointsSpent(current) >= flexibleAbilityAmount(feat))) delete current[ability];
    else if (pointsSpent(current) >= flexibleAbilityAmount(feat)) {
        // Nothing left to give: a single-point feat moves its point here.
        if (flexibleAbilityAmount(feat) === 1) {
            next[feat.id] = { [ability]: 1 };
            return next;
        }
        return next;
    } else current[ability] = held + 1;

    if (Object.keys(current).length) next[feat.id] = current;
    else delete next[feat.id];
    return next;
}

/**
 * Everything the character's feats add to their ability scores: the fixed
 * increases printed on the feat, plus the flexible ones they placed.
 */
export function featAbilityBonuses(
    feats: Feat[],
    choices: Record<string, Partial<AbilityScores>> | undefined,
): Record<AbilityScore, number> {
    const totals = { STR: 0, DEX: 0, CON: 0, INT: 0, WIS: 0, CHA: 0 };
    for (const feat of feats) {
        for (const ability of ABILITIES) {
            totals[ability] += feat.benefits?.abilityScoreIncrease?.[ability] ?? 0;
            totals[ability] += choices?.[feat.id]?.[ability] ?? 0;
        }
    }
    return totals;
}

/**
 * How a feat reads at a glance: a half feat raises an ability by 1 on top of
 * its benefit, a full feat gives only the benefit. Most 2024 General feats
 * became half feats; in 2014 most are full.
 */
export function featWeight(feat: Feat): { kind: "half" | "full"; label: string } {
    const fixed = ABILITIES.filter((ability) => (feat.benefits?.abilityScoreIncrease?.[ability] ?? 0) > 0);
    const flexible = flexibleAbilityAmount(feat) > 0 ? flexibleAbilityOptions(feat) : [];
    const raises = [...new Set([...fixed, ...flexible])];
    if (raises.length === 0) return { kind: "full", label: "Full feat" };
    const which = raises.length === ABILITIES.length ? "any" : raises.map((ability) => ABILITY_SHORT[ability]).join("/");
    return { kind: "half", label: `Half feat · +1 ${which}` };
}

const ABILITY_SHORT: Record<AbilityScore, string> = {
    STR: "Str", DEX: "Dex", CON: "Con", INT: "Int", WIS: "Wis", CHA: "Cha",
};

/** The highest a feat may raise a score: 30 for an Epic Boon, 20 for anything else. */
export function abilityCap(feat: Feat): number {
    return featCategoryOf(feat) === "Epic Boon" ? 30 : 20;
}

/** Drops picks belonging to feats the character no longer has. */
export function pruneFeatAbilityChoices(
    feats: Feat[],
    choices: Record<string, Partial<AbilityScores>> | undefined,
): Record<string, Partial<AbilityScores>> {
    if (!choices) return {};
    const kept: Record<string, Partial<AbilityScores>> = {};
    for (const feat of feats) {
        const choice = choices[feat.id];
        if (!choice) continue;
        // A feat whose options changed keeps only the abilities it still allows.
        const allowed = new Set<string>(flexibleAbilityOptions(feat));
        const filtered = Object.fromEntries(
            Object.entries(choice).filter(([ability, value]) => allowed.has(ability) && (value ?? 0) > 0),
        );
        if (Object.keys(filtered).length) kept[feat.id] = filtered;
    }
    return kept;
}
