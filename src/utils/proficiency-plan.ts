/**
 * Works out what a character is *given* and what they still have to *choose*.
 *
 * Proficiencies in D&D arrive from five places — species, class, subclass,
 * background and feats — and each hands over either a fixed list ("light
 * armour, shields") or a choice from one ("two skills from this list"). The
 * plan below is that reading of a character: every fixed grant with the source
 * that gave it, and every outstanding choice with the options it allows.
 *
 * Whatever the player picks is kept separately, keyed by choice, so changing
 * class later drops only the picks that class was offering. `resolveProficiencies`
 * flattens grants and picks back into the shape the sheet and the PDF read.
 */

import {
    ARMOR_CATEGORIES,
    ARTISAN_TOOLS,
    canonicalName,
    CHOICE_PLACEHOLDER,
    ChoiceKind,
    CLASS_RULES,
    FEAT_RULES,
    GAMING_SETS,
    grantFromFeatText,
    MARTIAL_WEAPONS,
    MUSICAL_INSTRUMENTS,
    OTHER_TOOLS,
    RARE_LANGUAGES,
    RuleChoice,
    RuleGrant,
    SECRET_LANGUAGES,
    SIMPLE_WEAPONS,
    SKILLS,
    STANDARD_LANGUAGES,
    SUBCLASS_RULES,
    TOOL_CHOICE_PHRASES,
    WEAPON_CATEGORIES,
} from "../data/proficiency-rules";
import type { CharacterData } from "../types/character-creator";
import type { ProficiencyRule } from "../types/dnd-types";

export type ProficiencyKind = "skill" | "tool" | "language" | "armor" | "weapon";

/** One proficiency a character simply has, and the feature that granted it. */
export interface GrantedProficiency {
    kind: ProficiencyKind;
    name: string;
    source: string;
    /** True when the granting feature doubles the proficiency bonus. */
    expertise?: boolean;
}

/** One outstanding decision: "choose 2 skills from the cleric's list". */
export interface PlanChoice {
    id: string;
    kind: ChoiceKind;
    count: number;
    /** Every name this choice will accept, before other picks are subtracted. */
    options: string[];
    source: string;
    /** Names the pool in the step, e.g. "artisan's tools". */
    optionsLabel?: string;
    /** Picks here are doubled as well as granted (Blessings of Knowledge). */
    withExpertise?: boolean;
    /** An aside the step shows under the choice. */
    note?: string;
}

export interface ProficiencyPlan {
    granted: GrantedProficiency[];
    choices: PlanChoice[];
    /**
     * Sources the Archive holds no proficiency data for — most of its homebrew
     * classes. The step names them rather than inventing a kit for them.
     */
    silentSources: string[];
}

/** What the player has picked, keyed by `PlanChoice.id`. */
export type ProficiencySelections = Record<string, string[]>;

/** Proficiencies added by hand, outside anything the rules grant. */
export interface CustomProficiencies {
    skills: string[];
    expertise: string[];
    languages: string[];
    tools: string[];
    armor: string[];
    weapons: string[];
}

export const EMPTY_CUSTOM: CustomProficiencies = {
    skills: [],
    expertise: [],
    languages: [],
    tools: [],
    armor: [],
    weapons: [],
};

const ALL_WEAPONS = [...WEAPON_CATEGORIES, ...SIMPLE_WEAPONS, ...MARTIAL_WEAPONS];

/** Languages a feature will let you choose; the secret ones are only taught. */
export const CHOOSABLE_LANGUAGES = [...STANDARD_LANGUAGES, ...RARE_LANGUAGES].filter(
    (language) => !SECRET_LANGUAGES.includes(language),
);

const TOOL_NAMES = [...ARTISAN_TOOLS, ...MUSICAL_INSTRUMENTS, ...GAMING_SETS, ...OTHER_TOOLS];

const SKILL_SET = new Set<string>(SKILLS);

/** The full pool a choice draws on when the granting feature names no list. */
function defaultOptions(kind: ChoiceKind): string[] {
    switch (kind) {
        case "skill":
        case "expertise":
            return [...SKILLS];
        case "tool":
            return TOOL_NAMES;
        case "language":
            return CHOOSABLE_LANGUAGES;
        case "armor":
            return ARMOR_CATEGORIES;
        case "weapon":
            return ALL_WEAPONS;
        case "skillOrTool":
            return [...SKILLS, ...TOOL_NAMES];
    }
}

export function isSkillName(name: string): boolean {
    return SKILL_SET.has(name);
}

/* ------------------------------------------------------------------ */
/* Building the plan                                                   */
/* ------------------------------------------------------------------ */

class PlanBuilder {
    granted: GrantedProficiency[] = [];
    choices: PlanChoice[] = [];
    silentSources: string[] = [];

    /** Fixed grants already handed out, so a second one can be spent elsewhere. */
    private seen = new Map<string, string>();

    add(sourceId: string, sourceLabel: string, grant: RuleGrant): void {
        this.addFixed(sourceId, sourceLabel, "skill", grant.skills);
        this.addFixed(sourceId, sourceLabel, "tool", grant.tools);
        this.addFixed(sourceId, sourceLabel, "language", grant.languages);
        this.addFixed(sourceId, sourceLabel, "armor", grant.armor);
        this.addFixed(sourceId, sourceLabel, "weapon", grant.weapons);

        this.addFixed(sourceId, sourceLabel, "skill", grant.expertise, true);

        (grant.choices ?? []).forEach((choice, index) => {
            this.addChoice(`${sourceId}#${index}`, sourceLabel, choice);
        });
    }

    addChoice(id: string, sourceLabel: string, choice: RuleChoice): void {
        if (!choice.count || choice.count < 1) return;
        const options = (choice.options?.length ? choice.options : defaultOptions(choice.kind))
            .map((option) => canonicalName(option))
            .filter((option, index, all) => option && all.indexOf(option) === index);

        this.choices.push({
            id,
            kind: choice.kind,
            count: choice.count,
            options,
            source: sourceLabel,
            optionsLabel: choice.optionsLabel,
            withExpertise: choice.withExpertise,
            note: choice.note,
        });
    }

    private addFixed(
        sourceId: string,
        sourceLabel: string,
        kind: ProficiencyKind,
        names: string[] | undefined,
        expertise = false,
    ): void {
        (names ?? []).forEach((raw, index) => {
            const name = canonicalName(raw);
            if (!name) return;

            const key = `${kind}:${name.toLowerCase()}`;
            const heldBy = this.seen.get(key);
            if (heldBy) {
                // A feature that doubles a skill the character already has is
                // doing its job; only the proficiency would be wasted.
                if (expertise) {
                    this.granted.push({ kind, name, source: sourceLabel, expertise: true });
                    return;
                }
                // "If you gain a proficiency you already have, you can choose a
                // different one of the same kind." Worth offering for skills and
                // tools, where the pool is wide; a second helping of light armour
                // is just noise.
                if (kind === "skill" || kind === "tool") {
                    this.addChoice(`${sourceId}!dup${index}`, sourceLabel, {
                        kind,
                        count: 1,
                        note: `${heldBy} already granted ${name}, so this one goes elsewhere.`,
                    });
                }
                return;
            }

            this.seen.set(key, sourceLabel);
            this.granted.push({ kind, name, source: sourceLabel, ...(expertise ? { expertise } : {}) });
        });
    }
}

/**
 * Turns a Sanity `proficiencyRule` into the shape the tables use.
 *
 * Two quirks in the live data are ironed out here: a rule can be marked fixed
 * while carrying a count smaller than its list — which is a choice, however it
 * was tagged — and a rule can carry no list at all, which grants nothing and is
 * dropped.
 */
const FIXED_KEYS: Record<ProficiencyKind, "skills" | "tools" | "languages" | "armor" | "weapons"> = {
    skill: "skills",
    tool: "tools",
    language: "languages",
    armor: "armor",
    weapon: "weapons",
};

export function grantFromRules(rules: ProficiencyRule[] | undefined): RuleGrant | null {
    if (!rules?.length) return null;

    const grant: RuleGrant = {};
    const choices: RuleChoice[] = [];

    for (const rule of rules) {
        const kind = ruleKind(rule);
        if (!kind) continue;

        const options = (rule.skillOptions ?? rule.toolOptions ?? rule.languageOptions
            ?? rule.armorOptions ?? rule.weaponOptions ?? rule.options ?? [])
            .filter((option): option is string => typeof option === "string" && option.trim().length > 0);

        const count = rule.count ?? 1;
        const isChoice = rule.mode === "choice" || (options.length > count && rule.count !== undefined);

        if (isChoice) {
            choices.push({
                kind,
                count: Math.max(1, count),
                options: options.length ? options : undefined,
                optionsLabel: rule.description,
            });
            continue;
        }

        if (!options.length) continue; // A fixed rule with no list grants nothing.
        const key = FIXED_KEYS[kind];
        grant[key] = [...(grant[key] ?? []), ...options];
    }

    if (choices.length) grant.choices = choices;
    return Object.keys(grant).length ? grant : null;
}

function ruleKind(rule: ProficiencyRule): ProficiencyKind | null {
    switch (rule.type) {
        case "skill":
            return "skill";
        case "tool":
            return "tool";
        case "language":
            return "language";
        case "armor":
            return "armor";
        case "weapon":
            return "weapon";
        default:
            return null; // Saving throws come from the class itself.
    }
}

type PlanInput = Pick<
    CharacterData,
    "race" | "subrace" | "class" | "subclass" | "background" | "feats" | "level"
>;

export function buildProficiencyPlan(character: PlanInput): ProficiencyPlan {
    const builder = new PlanBuilder();
    const level = character.level || 1;

    // --- Species ---------------------------------------------------------
    const race = character.race;
    if (race) {
        const languages: string[] = [];
        let languageChoices = 0;
        for (const entry of race.languages ?? []) {
            if (typeof entry !== "string" || !entry.trim()) continue;
            // Species write the choice the rules give them in among the fixed
            // languages, as "one other" or "any one language".
            if (CHOICE_PLACEHOLDER.test(entry.trim())) languageChoices += 1;
            else languages.push(entry.trim());
        }
        builder.add(`race:${race.id}`, race.name, {
            languages,
            ...(languageChoices ? { choices: [{ kind: "language", count: languageChoices }] } : {}),
        });

        const fromRules = grantFromRules(race.proficiencies);
        if (fromRules) builder.add(`race-rules:${race.id}`, race.name, fromRules);
    }

    const subrace = character.subrace;
    if (subrace) {
        const fromRules = grantFromRules(subrace.proficiencies);
        if (fromRules) builder.add(`subrace:${subrace.id}`, subrace.name, fromRules);
    }

    // --- Background ------------------------------------------------------
    const background = character.background;
    if (background) {
        const label = `${background.name} (background)`;
        const fromRules = grantFromRules(background.proficiencies);
        if (fromRules) {
            builder.add(`bg-rules:${background.id}`, label, fromRules);
        } else {
            builder.add(`bg:${background.id}`, label, backgroundGrant(background));
        }
    }

    // --- Class -----------------------------------------------------------
    const classData = character.class;
    if (classData) {
        const rules = CLASS_RULES[classData.id] ?? CLASS_RULES[classData.name.toLowerCase()];
        const fromRules = grantFromRules(classData.proficiencies);

        if (rules) {
            builder.add(`class:${classData.id}`, classData.name, rules.base);
            for (const leveled of rules.byLevel ?? []) {
                if (level < leveled.level) continue;
                builder.add(
                    `class:${classData.id}:L${leveled.level}`,
                    `${classData.name} — ${leveled.feature}`,
                    leveled.grant,
                );
            }
        } else if (fromRules) {
            builder.add(`class-rules:${classData.id}`, classData.name, fromRules);
        } else {
            builder.silentSources.push(`${classData.name} (class)`);
        }
    }

    // --- Subclass --------------------------------------------------------
    const subclass = character.subclass;
    if (subclass) {
        const leveledGrants = SUBCLASS_RULES[subclass.id];
        const fromRules = grantFromRules(subclass.proficiencies);

        if (leveledGrants) {
            for (const leveled of leveledGrants) {
                if (level < leveled.level) continue;
                builder.add(
                    `subclass:${subclass.id}:L${leveled.level}`,
                    `${subclass.name} — ${leveled.feature}`,
                    leveled.grant,
                );
            }
        } else if (fromRules) {
            builder.add(`subclass-rules:${subclass.id}`, subclass.name, fromRules);
        }
    }

    // --- Feats -----------------------------------------------------------
    for (const feat of character.feats ?? []) {
        const grant =
            FEAT_RULES[feat.name]
            ?? grantFromRules(feat.proficiencies)
            ?? grantFromFeatText(feat.benefits?.features ?? []);
        if (grant) builder.add(`feat:${feat.id || feat.name}`, `${feat.name} (feat)`, grant);
    }

    return {
        granted: builder.granted,
        choices: builder.choices,
        silentSources: builder.silentSources,
    };
}

/**
 * The legacy background fields, read as rules.
 *
 * Skills are fixed. Tools are free text, and often a choice written out in
 * words ("One type of artisan's tools"). Languages are a count of extra
 * languages the background teaches; 2024 backgrounds don't record one, so the
 * two the 2024 Handbook gives every character are offered instead.
 */
function backgroundGrant(background: NonNullable<CharacterData["background"]>): RuleGrant {
    const grant: RuleGrant = { skills: [], tools: [] };
    const choices: RuleChoice[] = [];

    for (const entry of background.skillProficiencies ?? []) {
        if (typeof entry !== "string" || !entry.trim()) continue;
        if (!isSkillName(canonicalName(entry)) && CHOICE_PLACEHOLDER.test(entry.trim())) {
            choices.push({ kind: "skill", count: 1 });
        } else {
            grant.skills!.push(entry);
        }
    }

    for (const entry of background.toolProficiencies ?? []) {
        if (typeof entry !== "string" || !entry.trim()) continue;
        const phrase = TOOL_CHOICE_PHRASES.find(
            ({ pattern }) => pattern.test(entry) && /\b(one|two|three|a|any)\b/i.test(entry),
        );
        if (phrase) {
            choices.push({ kind: "tool", count: 1, options: phrase.options, optionsLabel: phrase.label });
        } else {
            grant.tools!.push(entry);
        }
    }

    const languageCount = typeof background.languages === "number"
        ? background.languages
        : background.edition === "2024"
            ? 2
            : 0;
    if (languageCount > 0) choices.push({ kind: "language", count: languageCount });

    if (choices.length) grant.choices = choices;
    return grant;
}

/* ------------------------------------------------------------------ */
/* Reading the plan against what the player picked                     */
/* ------------------------------------------------------------------ */

/** Everything known so far of one kind, whether granted or picked. */
function heldNames(
    plan: ProficiencyPlan,
    selections: ProficiencySelections,
    kind: ProficiencyKind,
    exceptChoiceId?: string,
): Set<string> {
    const held = new Set<string>();
    for (const grant of plan.granted) {
        if (grant.kind === kind) held.add(grant.name.toLowerCase());
    }
    for (const choice of plan.choices) {
        if (choice.id === exceptChoiceId) continue;
        const picks = selections[choice.id] ?? [];
        for (const pick of picks) {
            if (choice.kind === kind) held.add(pick.toLowerCase());
            else if (choice.kind === "skillOrTool" && kind === (isSkillName(pick) ? "skill" : "tool")) {
                held.add(pick.toLowerCase());
            }
        }
    }
    return held;
}

/** Every skill the character is proficient in, granted or picked. */
export function proficientSkills(plan: ProficiencyPlan, selections: ProficiencySelections): Set<string> {
    return heldNames(plan, selections, "skill");
}

/**
 * The options a choice can still take: its own pool, less anything the
 * character already has from elsewhere, and — for expertise — less any skill
 * they are not actually proficient in.
 */
export function availableOptions(
    plan: ProficiencyPlan,
    choice: PlanChoice,
    selections: ProficiencySelections,
): string[] {
    const picks = new Set((selections[choice.id] ?? []).map((pick) => pick.toLowerCase()));

    if (choice.kind === "expertise") {
        const proficient = proficientSkills(plan, selections);
        const doubled = expertiseNames(plan, selections, choice.id);
        return choice.options.filter(
            (option) => proficient.has(option.toLowerCase())
                && !doubled.has(option.toLowerCase())
                && !picks.has(option.toLowerCase()),
        );
    }

    if (choice.kind === "skillOrTool") {
        const skills = heldNames(plan, selections, "skill", choice.id);
        const tools = heldNames(plan, selections, "tool", choice.id);
        return choice.options.filter((option) => {
            const held = isSkillName(option) ? skills : tools;
            return !held.has(option.toLowerCase()) && !picks.has(option.toLowerCase());
        });
    }

    const held = heldNames(plan, selections, choice.kind as ProficiencyKind, choice.id);
    return choice.options.filter(
        (option) => !held.has(option.toLowerCase()) && !picks.has(option.toLowerCase()),
    );
}

/** Skills whose proficiency bonus is already doubled. */
function expertiseNames(
    plan: ProficiencyPlan,
    selections: ProficiencySelections,
    exceptChoiceId?: string,
): Set<string> {
    const doubled = new Set<string>();
    for (const grant of plan.granted) {
        if (grant.kind === "skill" && grant.expertise) doubled.add(grant.name.toLowerCase());
    }
    for (const choice of plan.choices) {
        const doubles = choice.kind === "expertise" || choice.withExpertise;
        if (!doubles || choice.id === exceptChoiceId) continue;
        for (const pick of selections[choice.id] ?? []) doubled.add(pick.toLowerCase());
    }
    return doubled;
}

/**
 * Drops picks that no longer hold up — a skill that left the class's list when
 * the class changed, expertise in a skill the character is no longer proficient
 * in, anything over a choice's count, and picks for choices that are gone.
 *
 * Returns the same object when nothing had to change, so it can be called on
 * every render without setting state in a loop.
 */
export function pruneSelections(
    plan: ProficiencyPlan,
    selections: ProficiencySelections,
): ProficiencySelections {
    const pruned: ProficiencySelections = {};
    let changed = false;

    const byId = new Map(plan.choices.map((choice) => [choice.id, choice]));
    for (const id of Object.keys(selections)) {
        if (!byId.has(id)) changed = true;
    }

    // Expertise leans on the skill picks, so settle the others first.
    const ordered = [...plan.choices].sort(
        (a, b) => Number(a.kind === "expertise") - Number(b.kind === "expertise"),
    );

    for (const choice of ordered) {
        const picks = selections[choice.id] ?? [];
        if (!picks.length) continue;

        const kept: string[] = [];
        for (const pick of picks) {
            if (kept.length >= choice.count) break;
            const legal = availableOptions(plan, choice, { ...pruned, [choice.id]: kept });
            const match = legal.find((option) => option.toLowerCase() === pick.toLowerCase());
            if (match) kept.push(match);
        }

        if (kept.length !== picks.length || kept.some((pick, index) => pick !== picks[index])) {
            changed = true;
        }
        if (kept.length) pruned[choice.id] = kept;
    }

    return changed ? pruned : selections;
}

export interface ResolvedProficiencies {
    skills: { name: string; proficient: boolean; expertise: boolean }[];
    languages: string[];
    tools: string[];
    armor: string[];
    weapons: string[];
}

/**
 * Grants plus picks plus anything added by hand, in the shape the character
 * sheet and the PDF read. Every skill is listed so a sheet built from this can
 * index it directly, proficient or not.
 */
export function resolveProficiencies(
    plan: ProficiencyPlan,
    selections: ProficiencySelections,
    custom: CustomProficiencies = EMPTY_CUSTOM,
): ResolvedProficiencies {
    const skills = new Map<string, { proficient: boolean; expertise: boolean }>();
    const languages: string[] = [];
    const tools: string[] = [];
    const armor: string[] = [];
    const weapons: string[] = [];

    const addSkill = (name: string, expertise: boolean) => {
        const current = skills.get(name) ?? { proficient: false, expertise: false };
        skills.set(name, {
            proficient: true,
            expertise: current.expertise || expertise,
        });
    };

    const add = (kind: ProficiencyKind, name: string, expertise = false) => {
        if (!name) return;
        if (kind === "skill") {
            addSkill(name, expertise);
            return;
        }
        const bucket = kind === "language" ? languages : kind === "tool" ? tools : kind === "armor" ? armor : weapons;
        if (!bucket.some((held) => held.toLowerCase() === name.toLowerCase())) bucket.push(name);
    };

    for (const grant of plan.granted) add(grant.kind, grant.name, grant.expertise);

    for (const choice of plan.choices) {
        for (const pick of selections[choice.id] ?? []) {
            if (choice.kind === "expertise") {
                // The proficiency itself came from elsewhere; this only doubles it.
                if (skills.has(pick)) addSkill(pick, true);
                continue;
            }
            if (choice.kind === "skillOrTool") {
                add(isSkillName(pick) ? "skill" : "tool", pick);
                continue;
            }
            add(choice.kind as ProficiencyKind, pick, choice.withExpertise);
        }
    }

    for (const name of custom.skills) add("skill", name);
    for (const name of custom.expertise) if (skills.has(name)) addSkill(name, true);
    for (const name of custom.languages) add("language", name);
    for (const name of custom.tools) add("tool", name);
    for (const name of custom.armor) add("armor", name);
    for (const name of custom.weapons) add("weapon", name);

    return {
        skills: SKILLS.map((name) => ({
            name,
            proficient: skills.get(name)?.proficient ?? false,
            expertise: skills.get(name)?.expertise ?? false,
        })),
        languages,
        tools,
        armor,
        weapons,
    };
}

/* ------------------------------------------------------------------ */
/* The skill grid                                                      */
/* ------------------------------------------------------------------ */

export interface SkillView {
    name: string;
    proficient: boolean;
    /** The feature that granted it, or the one whose choice it was spent on. */
    source?: string;
    /** Set when the proficiency came from a choice and can be taken back. */
    fromChoiceId?: string;
    /** The choice that would take this skill, when it is still up for grabs. */
    openChoiceId?: string;
    expertise: boolean;
    expertiseSource?: string;
    expertiseFromChoiceId?: string;
    openExpertiseChoiceId?: string;
}

/**
 * Everything the skill grid needs about one skill: whether it is already
 * granted, which choice it was picked with, and which choice could still take
 * it. Choices are tried tightest-list-first, so a "choose any skill" allowance
 * is not spent on a skill that only the class's own list would have covered.
 */
export function buildSkillViews(
    plan: ProficiencyPlan,
    selections: ProficiencySelections,
): Record<string, SkillView> {
    const views: Record<string, SkillView> = {};
    for (const name of SKILLS) {
        views[name] = { name, proficient: false, expertise: false };
    }

    for (const grant of plan.granted) {
        if (grant.kind !== "skill") continue;
        const view = views[grant.name];
        if (!view) continue;
        view.proficient = true;
        view.source = view.source ?? grant.source;
        if (grant.expertise) {
            view.expertise = true;
            view.expertiseSource = view.expertiseSource ?? grant.source;
        }
    }

    for (const choice of plan.choices) {
        for (const pick of selections[choice.id] ?? []) {
            const view = views[pick];
            if (!view) continue;
            if (choice.kind === "expertise") {
                view.expertise = true;
                view.expertiseSource = choice.source;
                view.expertiseFromChoiceId = choice.id;
            } else if (choice.kind === "skill" || choice.kind === "skillOrTool") {
                view.proficient = true;
                view.source = choice.source;
                view.fromChoiceId = choice.id;
                if (choice.withExpertise) {
                    view.expertise = true;
                    view.expertiseSource = choice.source;
                }
            }
        }
    }

    const openSkillChoices = plan.choices
        .filter((choice) => choice.kind === "skill" || choice.kind === "skillOrTool")
        .filter((choice) => (selections[choice.id] ?? []).length < choice.count)
        .sort((a, b) => a.options.length - b.options.length);

    const openExpertiseChoices = plan.choices
        .filter((choice) => choice.kind === "expertise")
        .filter((choice) => (selections[choice.id] ?? []).length < choice.count)
        .sort((a, b) => a.options.length - b.options.length);

    for (const name of SKILLS) {
        const view = views[name];
        if (!view.proficient) {
            const choice = openSkillChoices.find((candidate) =>
                availableOptions(plan, candidate, selections).includes(name),
            );
            view.openChoiceId = choice?.id;
        }
        if (view.proficient && !view.expertise) {
            const choice = openExpertiseChoices.find((candidate) =>
                availableOptions(plan, candidate, selections).includes(name),
            );
            view.openExpertiseChoiceId = choice?.id;
        }
    }

    return views;
}

/** How many picks a choice is still owed. */
export function remainingPicks(choice: PlanChoice, selections: ProficiencySelections): number {
    return Math.max(0, choice.count - (selections[choice.id] ?? []).length);
}

/**
 * How many of those picks the player can actually make.
 *
 * A choice can run out of legal options — a domain that grants two skills from
 * a list of four the character already has three of, expertise with nothing
 * left to double. Counting those as outstanding leaves a number on screen with
 * nowhere to spend it, so they are counted at what is really on offer and the
 * step marks them as stuck instead.
 */
export function placeablePicks(
    plan: ProficiencyPlan,
    choice: PlanChoice,
    selections: ProficiencySelections,
): number {
    return Math.min(
        remainingPicks(choice, selections),
        availableOptions(plan, choice, selections).length,
    );
}

/** Total picks still on offer across the plan, for the step's header. */
export function outstandingPicks(plan: ProficiencyPlan, selections: ProficiencySelections): number {
    return plan.choices.reduce(
        (total, choice) => total + placeablePicks(plan, choice, selections),
        0,
    );
}

/** A short description of a choice, e.g. "Choose 2 skills". */
export function describeChoice(choice: PlanChoice): string {
    const from = choice.optionsLabel
        ? ` from ${choice.optionsLabel}`
        : choice.options.length < defaultOptions(choice.kind).length
            ? " from a set list"
            : "";

    if (choice.kind === "expertise") {
        return `Expertise in ${choice.count} ${choice.count === 1 ? "skill" : "skills"}${from}`;
    }
    if (choice.kind === "skillOrTool") {
        return `Choose ${choice.count} ${choice.count === 1 ? "skill or tool" : "skills or tools"}${from}`;
    }
    if (choice.kind === "armor") {
        return `Choose ${choice.count} armor training${from}`;
    }
    const noun = { skill: "skill", tool: "tool", language: "language", weapon: "weapon" }[choice.kind];
    return `Choose ${choice.count} ${choice.count === 1 ? noun : `${noun}s`}${from}`;
}
