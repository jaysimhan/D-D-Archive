import { useMemo, useState } from "react";
import { Check, ChevronDown, Info, Lock, ScrollText, Search } from "lucide-react";
import { CharacterData } from "../../types/character-creator";
import { useItems } from "../../hooks/useSanityData";
import { ARMOR_CATEGORIES, SKILL_GROUPS, SKILLS } from "../../data/proficiency-rules";
import {
    availableOptions,
    buildProficiencyPlan,
    buildSkillViews,
    CHOOSABLE_LANGUAGES,
    describeChoice,
    EMPTY_CUSTOM,
    outstandingPicks,
    placeablePicks,
    PlanChoice,
    ProficiencyKind,
    ProficiencyPlan,
    ProficiencySelections,
    remainingPicks,
    SkillView,
} from "../../utils/proficiency-plan";

/**
 * Proficiencies & Languages.
 *
 * Nothing here is bought: the character's species, class, subclass, background
 * and feats hand out every proficiency, either outright or as "choose N from
 * this list", and this step is where those choices are made. Grants are shown
 * locked with the feature that gave them, and a skill the character has no
 * claim on cannot be taken at all. Expertise appears only where a feature
 * grants it — a rogue's two skills at 1st level, a bard's at 2nd, a ranger's
 * Deft Explorer, a wizard's Scholar, the Knowledge domain's blessing.
 */
export function ProficiencyStep({
    character,
    onChange,
}: {
    character: CharacterData;
    /**
     * A patch, or a function of the character as it stands. Every pick here goes
     * through the function form: two taps in quick succession would otherwise
     * both build their patch from the same snapshot, and the first would be lost.
     */
    onChange: (
        patch: Partial<CharacterData> | ((prev: CharacterData) => Partial<CharacterData>),
    ) => void;
}) {
    const plan = useMemo(() => buildProficiencyPlan(character), [
        character.race,
        character.subrace,
        character.class,
        character.subclass,
        character.background,
        character.feats,
        character.level,
    ]);

    const selections: ProficiencySelections = character.proficiencyChoices ?? {};
    const custom = character.customProficiencies ?? EMPTY_CUSTOM;
    const skillViews = useMemo(() => buildSkillViews(plan, selections), [plan, selections]);

    /**
     * Every edit re-reads the character it is editing, so the picks are always
     * spent against what is actually stored rather than what was on screen when
     * the tap landed.
     */
    const mutate = (
        mutator: (
            current: ProficiencySelections,
            views: Record<string, SkillView>,
        ) => ProficiencySelections,
    ) =>
        onChange((prev) => {
            const current = prev.proficiencyChoices ?? {};
            return { proficiencyChoices: mutator(current, buildSkillViews(plan, current)) };
        });

    const withPicks = (
        current: ProficiencySelections,
        choiceId: string,
        picks: string[],
    ): ProficiencySelections => {
        const next = { ...current };
        if (picks.length) next[choiceId] = picks;
        else delete next[choiceId];
        return next;
    };

    /** Taking a skill spends it against the choice that can still take it. */
    const toggleSkill = (name: string) =>
        mutate((current, views) => {
            const view = views[name];
            if (view.fromChoiceId) {
                let next = withPicks(
                    current,
                    view.fromChoiceId,
                    (current[view.fromChoiceId] ?? []).filter((pick) => pick !== name),
                );
                // Expertise rides on the proficiency, so it goes with it.
                for (const choice of plan.choices) {
                    if (choice.kind !== "expertise") continue;
                    next = withPicks(
                        next,
                        choice.id,
                        (next[choice.id] ?? []).filter((pick) => pick !== name),
                    );
                }
                return next;
            }
            if (view.openChoiceId) {
                return withPicks(current, view.openChoiceId, [
                    ...(current[view.openChoiceId] ?? []),
                    name,
                ]);
            }
            return current;
        });

    const toggleExpertise = (name: string) =>
        mutate((current, views) => {
            const view = views[name];
            if (view.expertiseFromChoiceId) {
                return withPicks(
                    current,
                    view.expertiseFromChoiceId,
                    (current[view.expertiseFromChoiceId] ?? []).filter((pick) => pick !== name),
                );
            }
            if (view.openExpertiseChoiceId) {
                return withPicks(current, view.openExpertiseChoiceId, [
                    ...(current[view.openExpertiseChoiceId] ?? []),
                    name,
                ]);
            }
            return current;
        });

    /** One slot of a "choose N" list, set to a name or emptied again. */
    const setSlot = (choice: PlanChoice, slot: number, value: string) =>
        mutate((current) => {
            const picks = [...(current[choice.id] ?? [])];
            if (value) picks[slot] = value;
            else picks.splice(slot, 1);
            return withPicks(current, choice.id, picks.filter(Boolean).slice(0, choice.count));
        });

    const setCustom = (kind: keyof typeof EMPTY_CUSTOM, values: string[]) =>
        onChange((prev) => ({
            customProficiencies: { ...(prev.customProficiencies ?? EMPTY_CUSTOM), [kind]: values },
        }));

    const grantedOf = (kind: ProficiencyKind) => plan.granted.filter((grant) => grant.kind === kind);
    const choicesOf = (...kinds: PlanChoice["kind"][]) =>
        plan.choices.filter((choice) => kinds.includes(choice.kind));

    const skillChoices = choicesOf("skill", "skillOrTool", "expertise");
    const languageChoices = choicesOf("language");
    const toolChoices = choicesOf("tool");
    const gearChoices = choicesOf("armor", "weapon");

    /** Where each outstanding choice is filled in, for the header's shortcuts. */
    const sectionOf = (choice: PlanChoice): { id: string; label: string } => {
        if (choice.kind === "language") return { id: SECTIONS.languages, label: "Languages" };
        if (choice.kind === "tool") return { id: SECTIONS.tools, label: "Tools" };
        if (choice.kind === "armor" || choice.kind === "weapon") {
            return { id: SECTIONS.gear, label: "Armor & Weapons" };
        }
        return { id: SECTIONS.skills, label: "Skills" };
    };

    const outstanding = outstandingPicks(plan, selections);
    const openChoices = plan.choices.filter((choice) => placeablePicks(plan, choice, selections) > 0);
    const stuckChoices = plan.choices.filter(
        (choice) => remainingPicks(choice, selections) > 0 && placeablePicks(plan, choice, selections) === 0,
    );
    const hasSource = Boolean(character.race || character.class || character.background);

    // A barbarian has no expertise to hand out, so the column is left off
    // entirely rather than shown as eighteen dead toggles.
    const hasExpertise =
        plan.choices.some((choice) => choice.kind === "expertise" || choice.withExpertise)
        || plan.granted.some((grant) => grant.expertise);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <ScrollText className="w-12 h-12 text-brand-500 mx-auto mb-3" />
                <h2 className="text-white text-3xl font-bold mb-2 font-serif">Proficiencies &amp; Languages</h2>
                <p className="text-gray-400">
                    Your species, class, subclass, background and feats grant these.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Anything they leave open is listed below for you to choose.
                </p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* What is left to do, and where to do it. */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                    {!hasSource ? (
                        <p className="text-sm text-gray-500 text-center">
                            Pick a species, class and background first.
                        </p>
                    ) : outstanding === 0 ? (
                        <p className="text-sm text-green-400 flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            Everything your features offer has been chosen.
                        </p>
                    ) : (
                        <>
                            <p className="text-sm text-gray-300 mb-3">
                                <span className="font-bold text-brand-400 text-lg mr-1">{outstanding}</span>
                                {outstanding === 1 ? "choice left" : "choices left"} — pick up where you like:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {openChoices.map((choice) => {
                                    const section = sectionOf(choice);
                                    const left = placeablePicks(plan, choice, selections);
                                    return (
                                        <button
                                            key={choice.id}
                                            onClick={() => scrollToSection(section.id)}
                                            title={`${describeChoice(choice)} — fill this in under ${section.label}`}
                                            className={`px-3 py-1.5 rounded-lg text-xs border text-left transition-all ${choice.kind === "expertise"
                                                ? "border-amber-700/60 bg-amber-950/40 text-amber-200 hover:border-amber-500"
                                                : "border-brand-700/60 bg-brand-950/40 text-brand-200 hover:border-brand-500"
                                                }`}
                                        >
                                            <span className="font-semibold">{choice.source}</span>
                                            {" · "}
                                            {describeChoice(choice)}
                                            <span className="opacity-70"> · {left} left</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {stuckChoices.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                            {stuckChoices.map((choice) => (
                                <p key={choice.id} className="text-xs text-gray-500">
                                    <span className="font-semibold text-gray-400">{choice.source}</span>
                                    {" — "}
                                    {describeChoice(choice)}: nothing left to pick, since your other
                                    features already cover that list.
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {plan.silentSources.length > 0 && (
                    <div className="flex gap-3 items-start bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 text-sm">
                        <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <p className="text-amber-200/80">
                            The Archive records no proficiencies for{" "}
                            <span className="font-semibold">{plan.silentSources.join(", ")}</span>. Add
                            whatever it grants under <span className="italic">Added by hand</span> at the
                            bottom of this step.
                        </p>
                    </div>
                )}

                {/* ---------------- Skills ---------------- */}
                <section id={SECTIONS.skills} className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
                    <SectionHeading
                        title="Skills"
                        left={sumPlaceable(plan, skillChoices, selections)}
                    />

                    {skillChoices.length === 0 ? (
                        <p className="text-sm text-gray-500 italic mb-4">
                            Nothing you have chosen so far offers a skill choice.
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500 mb-4">
                            Tap a skill to take it.{" "}
                            {hasExpertise && (
                                <>
                                    <span className="text-amber-400 font-semibold">×2</span> marks expertise —
                                    a doubled proficiency bonus.{" "}
                                </>
                            )}
                            A <Lock className="w-3 h-3 inline-block -mt-0.5" /> means a feature granted it, so
                            it cannot be given up. Greyed skills are on none of your lists.
                        </p>
                    )}

                    <div className="space-y-4">
                        {SKILL_GROUPS.map((group) => (
                            <div key={group.ability}>
                                <h4 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 pl-1">
                                    {group.label}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {group.skills.map((name) => (
                                        <SkillRow
                                            key={name}
                                            view={skillViews[name]}
                                            showExpertise={hasExpertise}
                                            onToggle={() => toggleSkill(name)}
                                            onToggleExpertise={() => toggleExpertise(name)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ---------------- Languages ---------------- */}
                <ChoiceSection
                    id={SECTIONS.languages}
                    title="Languages"
                    emptyText="No language beyond what your species speaks."
                    granted={grantedOf("language")}
                    choices={languageChoices}
                    plan={plan}
                    selections={selections}
                    onSlotChange={setSlot}
                />

                {/* ---------------- Tools ---------------- */}
                <ChoiceSection
                    id={SECTIONS.tools}
                    title="Tools"
                    emptyText="No tool proficiencies."
                    granted={grantedOf("tool")}
                    choices={toolChoices}
                    plan={plan}
                    selections={selections}
                    onSlotChange={setSlot}
                />

                {/* ---------------- Armor and weapons ---------------- */}
                <section id={SECTIONS.gear} className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
                    <SectionHeading
                        title="Armor & Weapons"
                        left={sumPlaceable(plan, gearChoices, selections)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-2 text-xs uppercase tracking-wider">
                                Armor training
                            </h4>
                            <GrantList granted={grantedOf("armor")} emptyText="No armor training." />
                            <Slots
                                choices={choicesOf("armor")}
                                plan={plan}
                                selections={selections}
                                onSlotChange={setSlot}
                            />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-2 text-xs uppercase tracking-wider">
                                Weapons
                            </h4>
                            <GrantList granted={grantedOf("weapon")} emptyText="No weapon proficiencies." />
                            <Slots
                                choices={choicesOf("weapon")}
                                plan={plan}
                                selections={selections}
                                onSlotChange={setSlot}
                            />
                        </div>
                    </div>
                </section>

                {/* ---------------- Anything the rules here miss ---------------- */}
                <CustomSection
                    custom={custom}
                    skillsProficient={SKILLS.filter((name) => skillViews[name].proficient)}
                    onChange={setCustom}
                />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

const SECTIONS = {
    skills: "proficiency-skills",
    languages: "proficiency-languages",
    tools: "proficiency-tools",
    gear: "proficiency-gear",
};

function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sumPlaceable(
    plan: ProficiencyPlan,
    choices: PlanChoice[],
    selections: ProficiencySelections,
): number {
    return choices.reduce((total, choice) => total + placeablePicks(plan, choice, selections), 0);
}

function SectionHeading({ title, left }: { title: string; left?: number }) {
    return (
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-zinc-700 pb-2">
            <h3 className="text-lg font-bold text-gray-200 font-serif">{title}</h3>
            {left !== undefined && left > 0 && (
                <span className="text-xs px-2 py-1 rounded-lg bg-brand-950/50 border border-brand-800/60 text-brand-300">
                    {left} to choose
                </span>
            )}
        </div>
    );
}

/**
 * One skill, as a card in the same idiom as the class and feat pickers: the row
 * itself takes the proficiency, and expertise sits beside it as a "×2".
 */
function SkillRow({
    view,
    showExpertise,
    onToggle,
    onToggleExpertise,
}: {
    view: SkillView;
    showExpertise: boolean;
    onToggle: () => void;
    onToggleExpertise: () => void;
}) {
    const granted = view.proficient && !view.fromChoiceId;
    const chosen = view.proficient && Boolean(view.fromChoiceId);
    const available = !view.proficient && Boolean(view.openChoiceId);

    const expertiseGranted = view.expertise && !view.expertiseFromChoiceId;
    const expertiseOpen = Boolean(view.expertiseFromChoiceId) || Boolean(view.openExpertiseChoiceId);

    const rowClass = granted
        ? "border-brand-800/50 bg-brand-950/30"
        : chosen
            ? "border-brand-500 bg-brand-900/30 shadow-[0_0_15px_rgba(220,38,38,0.15)]"
            : available
                ? "border-zinc-800 bg-zinc-900/40 hover:border-brand-500/50 hover:bg-zinc-800"
                : "border-zinc-900 bg-zinc-900/20";

    return (
        <div className={`flex items-center gap-2 border rounded-lg transition-all ${rowClass}`}>
            <button
                onClick={onToggle}
                disabled={granted || (!view.proficient && !available)}
                title={
                    granted
                        ? `Granted by ${view.source}`
                        : chosen
                            ? `Taken with ${view.source} — tap to give it back`
                            : available
                                ? "Take this skill"
                                : "Not on a list you can choose from"
                }
                className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-lg ${granted
                    ? "cursor-default"
                    : available || chosen
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    }`}
            >
                <span
                    className={`font-semibold block truncate ${view.proficient
                        ? granted ? "text-brand-200" : "text-brand-300"
                        : available ? "text-gray-300" : "text-gray-600"
                        }`}
                >
                    {view.name}
                </span>
                {view.source && (
                    <span
                        className="text-[10px] text-gray-500 flex items-center gap-1 truncate"
                        title={view.source}
                    >
                        {granted && <Lock className="w-2.5 h-2.5 shrink-0" />}
                        <span className="truncate">{view.source}</span>
                    </span>
                )}
            </button>

            {showExpertise && (view.expertise || expertiseOpen) && (
                <button
                    onClick={onToggleExpertise}
                    disabled={expertiseGranted}
                    title={
                        expertiseGranted
                            ? `Doubled by ${view.expertiseSource}`
                            : view.expertise
                                ? `Expertise from ${view.expertiseSource} — tap to undo`
                                : "Expertise: double your proficiency bonus"
                    }
                    className={`mr-2 shrink-0 px-2 py-1 rounded-md text-xs font-bold border transition-all ${view.expertise
                        ? expertiseGranted
                            ? "border-amber-700/60 bg-amber-950/50 text-amber-300/90 cursor-default"
                            : "border-amber-500 bg-amber-900/40 text-amber-300"
                        : "border-zinc-700 text-gray-500 hover:border-amber-500/60 hover:text-amber-400"
                        }`}
                >
                    ×2
                </button>
            )}

            {view.proficient && (
                <Check
                    className={`w-4 h-4 mr-3 shrink-0 ${granted ? "text-brand-500/70" : "text-brand-400"}`}
                />
            )}
        </div>
    );
}

function GrantList({
    granted,
    emptyText,
}: {
    granted: { name: string; source: string; expertise?: boolean }[];
    emptyText: string;
}) {
    if (!granted.length) return <p className="text-sm text-gray-500 italic">{emptyText}</p>;

    return (
        <div className="flex flex-wrap gap-2">
            {granted.map((grant) => (
                <span
                    key={`${grant.name}-${grant.source}`}
                    title={`Granted by ${grant.source}`}
                    className="bg-brand-950/30 text-brand-200 px-2.5 py-1 rounded-lg text-sm flex items-center gap-1.5 border border-brand-800/50"
                >
                    <Lock className="w-3 h-3 text-brand-500/70" />
                    {grant.name}
                    <span className="text-[10px] text-gray-500 max-w-[9rem] truncate">{grant.source}</span>
                </span>
            ))}
        </div>
    );
}

/** The "choose N" dropdowns of one or more choices. */
function Slots({
    choices,
    plan,
    selections,
    onSlotChange,
}: {
    choices: PlanChoice[];
    plan: ProficiencyPlan;
    selections: ProficiencySelections;
    onSlotChange: (choice: PlanChoice, slot: number, value: string) => void;
}) {
    if (!choices.length) return null;

    return (
        <div className="space-y-3 mt-3">
            {choices.map((choice) => {
                const picks = selections[choice.id] ?? [];
                const open = availableOptions(plan, choice, selections);
                const stuck = remainingPicks(choice, selections) > 0 && open.length === 0;

                return (
                    <div key={choice.id}>
                        <p className="text-xs text-gray-400 mb-1.5">
                            <span className="font-semibold text-gray-300">{choice.source}</span>
                            {" — "}
                            {describeChoice(choice)}
                            {choice.note && <span className="text-gray-500 italic"> {choice.note}</span>}
                            {stuck && (
                                <span className="text-gray-500 italic">
                                    {" "}
                                    · nothing left to pick from that list
                                </span>
                            )}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: choice.count }).map((_, slot) => {
                                const value = picks[slot] ?? "";
                                return (
                                    <select
                                        key={slot}
                                        value={value}
                                        onChange={(event) => onSlotChange(choice, slot, event.target.value)}
                                        className={`px-3 py-2 bg-zinc-800 border rounded-lg text-sm transition-colors focus:ring-2 focus:ring-brand-500 ${value
                                            ? "border-zinc-700 text-white"
                                            : "border-brand-800/60 text-gray-400 hover:border-brand-500/60"
                                            }`}
                                    >
                                        <option value="">Choose…</option>
                                        {value && <option value={value}>{value}</option>}
                                        {open.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ChoiceSection({
    id,
    title,
    emptyText,
    granted,
    choices,
    plan,
    selections,
    onSlotChange,
}: {
    id: string;
    title: string;
    emptyText: string;
    granted: { name: string; source: string }[];
    choices: PlanChoice[];
    plan: ProficiencyPlan;
    selections: ProficiencySelections;
    onSlotChange: (choice: PlanChoice, slot: number, value: string) => void;
}) {
    return (
        <section id={id} className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800">
            <SectionHeading title={title} left={sumPlaceable(plan, choices, selections)} />
            <GrantList granted={granted} emptyText={emptyText} />
            <Slots choices={choices} plan={plan} selections={selections} onSlotChange={onSlotChange} />
        </section>
    );
}

/**
 * A way out for everything the Archive cannot answer for: homebrew classes that
 * record no proficiencies, a table ruling, a species language no list carries.
 * Kept apart from the granted lists so it is always clear what came from the
 * rules and what came from the table.
 */
function CustomSection({
    custom,
    skillsProficient,
    onChange,
}: {
    custom: NonNullable<CharacterData["customProficiencies"]>;
    skillsProficient: string[];
    onChange: (kind: keyof NonNullable<CharacterData["customProficiencies"]>, values: string[]) => void;
}) {
    const [open, setOpen] = useState(false);
    const [searchType, setSearchType] = useState<"tools" | "armor" | "weapons">("tools");
    const [searchTerm, setSearchTerm] = useState("");
    const [language, setLanguage] = useState("");
    const { data: allItems, loading: itemsLoading } = useItems();

    const added =
        custom.skills.length + custom.expertise.length + custom.languages.length
        + custom.tools.length + custom.armor.length + custom.weapons.length;

    const itemOptions = useMemo(() => {
        if (searchType === "armor") {
            const fromArchive = (allItems ?? []).filter((item) => item.type === "Armor").map((item) => item.name);
            return [...ARMOR_CATEGORIES, ...fromArchive];
        }
        const type = searchType === "tools" ? "Tool" : "Weapon";
        return (allItems ?? []).filter((item) => item.type === type).map((item) => item.name);
    }, [allItems, searchType]);

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const matches = term
            ? itemOptions.filter((name) => name.toLowerCase().includes(term))
            : itemOptions;
        return matches.slice(0, 20);
    }, [itemOptions, searchTerm]);

    const addItem = (name: string) => {
        const current = custom[searchType];
        if (!current.includes(name)) onChange(searchType, [...current, name]);
        setSearchTerm("");
    };

    const addLanguage = () => {
        const name = language.trim();
        if (name && !custom.languages.includes(name)) {
            onChange("languages", [...custom.languages, name]);
        }
        setLanguage("");
    };

    const remove = (kind: keyof NonNullable<CharacterData["customProficiencies"]>, name: string) =>
        onChange(kind, custom[kind].filter((held) => held !== name));

    return (
        <section className="bg-zinc-900/40 rounded-xl border border-zinc-800">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-900/60 rounded-xl transition-colors"
            >
                <span className="text-sm font-semibold text-gray-300 font-serif">
                    Added by hand{added > 0 && <span className="text-gray-500"> · {added}</span>}
                </span>
                <span className="flex items-center gap-2 text-xs text-gray-500">
                    For homebrew and table rulings
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
                </span>
            </button>

            {open && (
                <div className="p-4 pt-0 space-y-5">
                    {/* Skills and expertise */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                                Skill proficiency
                            </label>
                            <select
                                value=""
                                onChange={(event) => {
                                    if (event.target.value) onChange("skills", [...custom.skills, event.target.value]);
                                }}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white"
                            >
                                <option value="">Add a skill…</option>
                                {SKILLS.filter((name) => !custom.skills.includes(name)).map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <ChipList names={custom.skills} onRemove={(name) => remove("skills", name)} />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                                Expertise
                            </label>
                            <select
                                value=""
                                onChange={(event) => {
                                    if (event.target.value) {
                                        onChange("expertise", [...custom.expertise, event.target.value]);
                                    }
                                }}
                                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white"
                            >
                                <option value="">Add expertise…</option>
                                {skillsProficient
                                    .filter((name) => !custom.expertise.includes(name))
                                    .map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                            </select>
                            <ChipList names={custom.expertise} onRemove={(name) => remove("expertise", name)} />
                        </div>
                    </div>

                    {/* Languages */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                            Language
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={language}
                                list="custom-languages"
                                onChange={(event) => setLanguage(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") addLanguage();
                                }}
                                placeholder="Add a language…"
                                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-brand-500"
                            />
                            <datalist id="custom-languages">
                                {CHOOSABLE_LANGUAGES.map((name) => (
                                    <option key={name} value={name} />
                                ))}
                            </datalist>
                            <button
                                onClick={addLanguage}
                                className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 text-sm"
                            >
                                Add
                            </button>
                        </div>
                        <ChipList names={custom.languages} onRemove={(name) => remove("languages", name)} />
                    </div>

                    {/* Tools, armor and weapons out of the Archive's items */}
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1.5">
                            Tools, armor &amp; weapons
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={searchType}
                                onChange={(event) => {
                                    setSearchType(event.target.value as typeof searchType);
                                    setSearchTerm("");
                                }}
                                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white"
                            >
                                <option value="tools">Tool</option>
                                <option value="armor">Armor</option>
                                <option value="weapons">Weapon</option>
                            </select>
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder={itemsLoading ? "Loading…" : `Search ${searchType}…`}
                                    disabled={itemsLoading}
                                    className="w-full pl-9 pr-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-gray-500 disabled:opacity-50 focus:ring-2 focus:ring-brand-500"
                                />
                                {searchTerm && (
                                    <div className="absolute top-full left-0 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-30">
                                        {filtered.length ? (
                                            filtered.map((name) => (
                                                <button
                                                    key={name}
                                                    onClick={() => addItem(name)}
                                                    className="w-full text-left px-4 py-2 hover:bg-zinc-700 text-gray-200 text-sm"
                                                >
                                                    {name}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500 text-sm">No results found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                            {(["tools", "armor", "weapons"] as const).map((kind) => (
                                <div key={kind}>
                                    <p className="text-[10px] uppercase tracking-wider text-gray-500">{kind}</p>
                                    <ChipList names={custom[kind]} onRemove={(name) => remove(kind, name)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

function ChipList({ names, onRemove }: { names: string[]; onRemove: (name: string) => void }) {
    if (!names.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {names.map((name) => (
                <span
                    key={name}
                    className="bg-zinc-800 text-gray-300 px-2 py-1 rounded text-sm flex items-center gap-1 border border-zinc-700"
                >
                    {name}
                    <button onClick={() => onRemove(name)} className="hover:text-white font-bold">
                        &times;
                    </button>
                </span>
            ))}
        </div>
    );
}
