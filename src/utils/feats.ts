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
import { isMetamagicFeat } from "./combat-progression";

/**
 * Feats a character may take, and what the ones they took actually do.
 *
 * The Archive stores a feat as prose plus a handful of structured fields, so
 * everything mechanical — how many feats are on offer, whether this character
 * qualifies, what the half feats add to an ability score — is worked out here
 * rather than in each step and again on the sheet.
 */

// ===== Slots =====

/** Levels that trade an Ability Score Improvement for another feat. */
export const ASI_LEVELS = [4, 8, 12, 16, 19];

/** The abilities in the order every panel lists them. */
export const ABILITIES: AbilityScore[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

/**
 * Humans get a second level-1 feat from Versatile, which the species documents
 * describe in prose rather than as a structured trait, so the name is what
 * identifies them.
 */
export function isHumanSpecies(race: Race | undefined, subrace?: Subrace): boolean {
    const names = [race?.name, race?.id, subrace?.name, subrace?.id];
    return names.some((name) => typeof name === "string" && name.trim().toLowerCase().startsWith("human"));
}

/**
 * How many feats a character has to spend.
 *
 * The Archive draws no line between Origin feats and the rest: a feat is a
 * feat, and any of them may be taken at level 1 under either ruleset. Everyone
 * gets one, Humans get two, and each Ability Score Improvement level adds
 * another — which only matters if the creator's level cap ever rises past 3.
 */
export function featBudget(level: number, race?: Race, subrace?: Subrace): number {
    return 1 + (isHumanSpecies(race, subrace) ? 1 : 0)
        + ASI_LEVELS.filter((asiLevel) => level >= asiLevel).length;
}

// ===== Categories =====

/**
 * Feats predating the 2024 split carry no category. Those that read as level-1
 * background picks are treated as Origin feats so a level-1 character has
 * something to spend their first slot on; everything else counts as General.
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
}

const ABILITY_LABELS: Record<AbilityScore, string> = {
    STR: "Strength", DEX: "Dexterity", CON: "Constitution",
    INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma",
};

export function hasSpellcasting(context: PrerequisiteContext): boolean {
    const { class: classData, subclass } = context;
    return Boolean(
        classData?.isSpellcaster ||
        (classData?.spellcaster && !["none", "None", "false"].includes(String(classData.spellcaster))) ||
        subclass?.isSpellcaster ||
        subclass?.spellcaster,
    );
}

/**
 * One reason a character falls short of a feat.
 *
 * `advisory` reasons do not block the pick. Ability scores are the case that
 * matters: the creator asks for feats before it asks for scores, so a
 * Strength 13 prerequisite is a note to come back to, not a locked button.
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

    for (const ability of ABILITIES) {
        const required = prerequisites?.abilityScore?.[ability];
        if (required && (context.abilityScores?.[ability] ?? 0) < required) {
            reasons.push({
                kind: "ability",
                advisory: true,
                text: `Needs ${ABILITY_LABELS[ability]} ${required}`,
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
        const owned = [context.class?.id, context.class?.name, context.subclass?.id, context.subclass?.name]
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

    // A feat is never taken twice; only 2024's Ability Score Improvement repeats.
    const alreadyTaken = (context.feats ?? []).some(
        (taken) => taken.id !== feat.id && taken.name.trim().toLowerCase() === feat.name.trim().toLowerCase(),
    );
    if (alreadyTaken && !/ability score improvement/i.test(feat.name)) {
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

    if (held >= cap) delete current[ability];
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
 * Feats that still fit the budget, in the order they were taken.
 *
 * Levelling down, or swapping away from Human, takes slots back; without this
 * a character built at level 20 would keep all seven feats — and their ability
 * increases — after being set back to level 1.
 */
export function trimFeatsToBudget(feats: Feat[], level: number, race?: Race, subrace?: Subrace): Feat[] {
    return feats.slice(0, featBudget(level, race, subrace));
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
