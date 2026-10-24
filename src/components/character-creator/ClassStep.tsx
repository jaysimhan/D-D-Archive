import { useEffect, useState, useMemo } from "react";
import { Check, ChevronDown, Minus, Plus, Search, X } from "lucide-react";
import { CharacterRuleset, Class, Subclass } from "../../types/dnd-types";
import { useClasses, useSubclasses } from "../../hooks/useSanityData";
import SanityImage from "../SanityImage";
import { subclassLevelFor } from "../../utils/class-progression";
import { ClampedText } from "../ui/clamped-text";
import { isOfficial } from "../../utils/source-label";
import { classRulesFor } from "../../data/proficiency-rules";
import { grantFromRules, grantRows } from "../../utils/proficiency-plan";
import { multiclassProficiencies, prerequisiteText, type MulticlassEntry } from "../../utils/multiclass";

const MAX_LEVEL = 20;

/** The element id of a class feature's pick, so the creator can scroll to it. */
export function featureChoiceAnchor(feature: string) {
    return `feature-choice-${feature.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

/**
 * The frame around a level stepper. Focus lightens the border and adds a soft
 * glow on the frame alone; the box inside opts out of the site's red focus
 * ring (`stepper-input` in index.css), so focus never draws a box in a box.
 */
const STEPPER_FRAME = "bg-zinc-900/50 border border-zinc-700 rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-150 focus-within:border-zinc-500 focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.18)]";

// Class Step with Search
export function ClassStep({
    selected,
    ruleset,
    level,
    featureChoices,
    subclass,
    multiclasses = [],
    onSelect,
    onLevelChange,
    onFeatureChoice,
    onClassesChange,
}: {
    selected?: Class;
    ruleset: CharacterRuleset;
    level: number;
    featureChoices?: Record<string, string>;
    onSelect: (classData: Class) => void;
    onLevelChange: (level: number) => void;
    onFeatureChoice: (feature: string, option: string) => void;
    /** The starting class's subclass, for its features in the class list. */
    subclass?: Subclass;
    /** Classes after the first; `level` above is the character's total. */
    multiclasses?: MulticlassEntry[];
    /** Every class with its level, starting class first; the levels sum to the character's. */
    onClassesChange: (entries: MulticlassEntry[]) => void;
}) {
    const extraLevels = multiclasses.reduce((total, entry) => total + entry.level, 0);
    const getSubclassLevel = (classData: Class): number => subclassLevelFor(classData, ruleset);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNonCore, setShowNonCore] = useState(false);
    // The starting-class grid stays open until a further class comes in.
    const [gridOpen, setGridOpen] = useState(multiclasses.length === 0);
    const [adding, setAdding] = useState(false);

    // Fetch subclasses for details display
    const { data: sanitySubclasses } = useSubclasses(ruleset);
    const allSubclasses = useMemo(() => sanitySubclasses || [], [sanitySubclasses]);

    const relatedSubclasses = useMemo(() => {
        if (!selected) return [];
        return allSubclasses.filter(s => s.parentClassId === selected.id);
    }, [selected, allSubclasses]);

    // Fetch classes from Sanity
    const { data: sanityClasses, loading: classesLoading } = useClasses(ruleset);
    const allClasses = useMemo(() => sanityClasses || [], [sanityClasses]);

    const filteredClasses = useMemo(() => {
        let classes = allClasses;

        // Filter non-core if needed
        if (!showNonCore) {
            classes = classes.filter(isOfficial);
        }

        // Filter by search term
        return classes.filter((classData) =>
            classData.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allClasses, showNonCore]);

    // Use the class from allClasses to ensure we have Sanity image data
    const displayedClass = selected ? allClasses.find(c => c.id === selected.id) || selected : undefined;

    // The official kit for this ruleset; homebrew classes carry their own rules.
    const classRules = selected ? classRulesFor(selected, ruleset) : undefined;
    const baseGrant = classRules?.base ?? grantFromRules(selected?.proficiencies);
    const proficiencyRows = baseGrant ? grantRows(baseGrant) : [];
    const featureChoice = classRules?.featureChoice;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
                <h2 className="text-white text-3xl font-bold mb-2 font-serif">Choose Your Class</h2>
                <p className="text-gray-400">Select your character's profession and level (1-20)</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
                {/* Left Column: Grid */}
                <div className="flex-1 w-full">
                    {/* Toggle and Level Selector Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        {/* Level Selector */}
                        <div className="max-w-xs">
                            <label htmlFor="character-level" className="block text-gray-300 font-medium mb-2">
                                Character Level
                            </label>
                            <div className={`flex items-center w-full ${STEPPER_FRAME}`}>
                                <button
                                    onClick={() => onLevelChange(Math.max(1, level - 1))}
                                    disabled={level <= 1}
                                    aria-label="Lower level"
                                    className={`px-4 py-2 text-xl font-bold transition-colors ${level <= 1 ? 'text-zinc-600 cursor-not-allowed' : 'text-gray-300 hover:bg-zinc-800 hover:text-white'}`}
                                >
                                    -
                                </button>
                                <LevelInput
                                    id="character-level"
                                    value={level}
                                    min={extraLevels + 1}
                                    max={MAX_LEVEL}
                                    onChange={onLevelChange}
                                    className="flex-1 min-w-0 bg-transparent text-center py-2 text-lg font-semibold text-white border-l border-r border-zinc-700/50 focus:outline-none"
                                />
                                <button
                                    onClick={() => onLevelChange(Math.min(MAX_LEVEL, level + 1))}
                                    disabled={level >= MAX_LEVEL}
                                    aria-label="Raise level"
                                    className={`px-4 py-2 text-xl font-bold transition-colors ${level >= MAX_LEVEL ? 'text-zinc-600 cursor-not-allowed' : 'text-gray-300 hover:bg-zinc-800 hover:text-white'}`}
                                >
                                    +
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Levels 1-20. Ability Score Improvements and feats start at level 4.</p>
                        </div>

                        {/* Non-core Toggle */}
                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={showNonCore} onChange={e => setShowNonCore(e.target.checked)} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${showNonCore ? 'bg-brand-600' : 'bg-zinc-700'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showNonCore ? 'transform translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-300 group-hover:text-brand-400 transition-colors">Enable non-core classes</div>
                        </label>
                    </div>

                    {/* Once a further class is being added, the starting class's
                        grid folds away to one line, and the same grid opens below. */}
                    {selected && !gridOpen ? (
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-4 py-3">
                            <p className="text-sm text-gray-400">
                                Starting class: <span className="font-serif font-bold text-lg text-gray-100 ml-1">{selected.name}</span>
                            </p>
                            <button
                                type="button"
                                onClick={() => { setGridOpen(true); setAdding(false); }}
                                className="text-sm text-brand-400 hover:text-brand-300"
                            >
                                Change
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search classes..."
                                    className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-white placeholder-gray-500"
                                />
                            </div>
                            <ClassCardGrid
                                classes={filteredClasses.filter((classData) =>
                                    !multiclasses.some((entry) => entry.class.id === classData.id))}
                                selectedId={selected?.id}
                                loading={classesLoading}
                                onPick={onSelect}
                            />
                        </>
                    )}

                    {selected && (
                        <ClassListPanel
                            entries={[{ class: selected, subclass, level: level - extraLevels }, ...multiclasses]}
                            ruleset={ruleset}
                            classes={showNonCore ? allClasses : allClasses.filter(isOfficial)}
                            subclasses={allSubclasses}
                            featureChoices={featureChoices}
                            onChange={onClassesChange}
                            onFeatureChoice={onFeatureChoice}
                            adding={adding}
                            onAddingChange={(open) => {
                                setAdding(open);
                                if (open) setGridOpen(false);
                            }}
                        />
                    )}
                </div>

                {/* Right Column: Details Panel */}
                <div className="w-full lg:w-5/12 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto p-6 bg-zinc-900/60 backdrop-blur-sm border border-brand-900/30 rounded-xl shadow-xl min-h-[400px]">
                    {selected ? (
                        <div className="animate-in fade-in duration-200">
                            {/* Image Section */}
                            {(displayedClass?.image || displayedClass?.imageUrl) && (
                                <div className="w-full aspect-[3/2] bg-black/40 rounded-lg mb-6 flex items-center justify-center overflow-hidden relative border border-zinc-800">
                                    {displayedClass.image ? (
                                        <SanityImage
                                            imageAsset={displayedClass.image}
                                            alt={displayedClass.name}
                                            width={600}
                                            height={400}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={displayedClass.imageUrl}
                                            alt={displayedClass.name}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-3xl font-bold text-white text-brand-500 font-serif">{selected.name}</h3>
                                {selected.spellcaster && selected.spellcaster !== "None" && selected.spellcaster !== "none" && (
                                    <span className="text-xs px-2 py-1 bg-brand-900/30 text-brand-300 border border-brand-500/30 rounded-full font-semibold">
                                        {selected.spellcaster} Caster
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs px-2 py-1 bg-red-900/20 text-red-400 border border-red-900/30 rounded-full font-semibold">
                                    Hit Die: d{selected.hitDie}
                                </span>
                                <span className="text-xs px-2 py-1 bg-zinc-800 text-gray-400 border border-zinc-700 rounded-full">
                                    {selected.edition}
                                </span>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-6 text-sm">{selected.description}</p>

                            <div className="pt-4 border-t border-brand-900/30 space-y-3">
                                <div>
                                    <h4 className="font-bold text-brand-400 text-sm">Primary Ability</h4>
                                    <p className="text-sm text-gray-300">{selected.primaryAbility.join(" or ")}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-400 text-sm">Saving Throws</h4>
                                    <p className="text-sm text-gray-300">{selected.savingThrows.join(", ")}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-brand-900/30 mt-4">
                                <h4 className="font-bold text-gray-200 text-sm mb-2">Proficiencies</h4>
                                {proficiencyRows.length > 0 ? (
                                    <dl className="space-y-2 text-sm">
                                        {proficiencyRows.map((row) => (
                                            <div key={row.label}>
                                                <dt className="font-bold text-brand-400">{row.label}</dt>
                                                <dd className="text-gray-300">{row.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No proficiencies are recorded for this class yet.</p>
                                )}
                                {(classRules?.byLevel ?? []).map((leveled) => (
                                    <p key={`${leveled.level}-${leveled.feature}`} className="text-xs text-gray-400 mt-3">
                                        <span className="text-brand-300 font-semibold">{leveled.feature}</span>
                                        {" "}(level {leveled.level}{leveled.level > level ? ", not yet reached" : ""}):{" "}
                                        {grantRows(leveled.grant).map((row) => `${row.label} — ${row.value}`).join(". ")}
                                    </p>
                                ))}
                            </div>

                            {featureChoice && level >= featureChoice.level && (() => {
                                const chosen = featureChoices?.[featureChoice.feature];
                                return (
                                    // A pick the step can't be left without, so it reads as one:
                                    // framed and flagged until made, then marked done.
                                    <div
                                        id={featureChoiceAnchor(featureChoice.feature)}
                                        role="radiogroup"
                                        aria-label={featureChoice.feature}
                                        className={`mt-4 scroll-mt-24 rounded-xl border-2 p-4 transition-colors ${chosen
                                            ? "border-emerald-600/50 bg-emerald-950/20"
                                            : "border-amber-500/70 bg-amber-950/25 shadow-[0_0_24px_rgba(245,158,11,0.15)]"
                                        }`}
                                    >
                                        <div className="mb-1 flex items-center justify-between gap-2">
                                            <h4 className="font-serif text-base font-bold text-white">{featureChoice.feature}</h4>
                                            {chosen ? (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-900/40 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                                                    <Check className="h-3 w-3" /> Chosen
                                                </span>
                                            ) : (
                                                <span className="animate-pulse rounded-full border border-amber-400/70 bg-amber-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-200">
                                                    Required
                                                </span>
                                            )}
                                        </div>
                                        <p className={`mb-3 text-xs ${chosen ? "text-gray-400" : "text-amber-200/90"}`}>
                                            {chosen
                                                ? `${selected?.name ?? "Your class"} takes ${chosen}. You can change it any time.`
                                                : `Pick one to continue — Next stays locked until you do.`}
                                        </p>
                                        <div className="grid gap-2">
                                            {featureChoice.options.map((option) => {
                                                const active = chosen === option.name;
                                                return (
                                                    <button
                                                        key={option.name}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={active}
                                                        onClick={() => onFeatureChoice(featureChoice.feature, option.name)}
                                                        className={`flex items-start gap-3 rounded-lg border-2 p-3 text-left transition-all ${active
                                                            ? "border-brand-500 bg-brand-900/40"
                                                            : "border-zinc-700 bg-zinc-900/70 hover:-translate-y-0.5 hover:border-brand-500/70 hover:bg-zinc-800"
                                                        }`}
                                                    >
                                                        <span
                                                            aria-hidden
                                                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-brand-400 bg-brand-500" : "border-zinc-500"}`}
                                                        >
                                                            {active && <Check className="h-3 w-3 text-white" />}
                                                        </span>
                                                        <span>
                                                            <span className={`font-serif text-sm font-semibold ${active ? "text-brand-100" : "text-gray-100"}`}>{option.name}</span>
                                                            <span className="mt-1 block text-xs text-gray-400">{option.summary}</span>
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}

                            {relatedSubclasses.length > 0 && (
                                <div className="pt-4 border-t border-brand-900/30 mt-4">
                                    <h4 className="font-bold text-gray-200 text-sm mb-2 flex items-center justify-between">
                                        Available Subclasses
                                        <span className="ml-2 text-xs font-normal text-gray-500 bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-700">
                                            Features unlock at Lv {getSubclassLevel(selected)}
                                        </span>
                                    </h4>
                                    <p className="text-xs text-brand-400/80 mb-3 font-medium italic">
                                        You chose your subclass at Level {getSubclassLevel(selected)}
                                    </p>
                                    <div className="space-y-3">
                                        {relatedSubclasses.map(sub => {
                                            const hasSpellcasting = sub.spellcaster || sub.magicType;
                                            return (
                                                <div
                                                    key={sub.id}
                                                    className={`p-3 rounded-lg border ${hasSpellcasting
                                                        ? 'bg-zinc-900/80 border-brand-500/30 shadow-inner shadow-brand-900/10'
                                                        : 'bg-zinc-900/40 border-zinc-800'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h5 className={`font-serif font-semibold text-sm ${hasSpellcasting ? 'text-brand-300' : 'text-gray-300'}`}>{sub.name}</h5>
                                                        {hasSpellcasting && (
                                                            <span className="text-xs px-2 py-0.5 bg-brand-900/50 text-brand-200 border border-brand-500/30 rounded-full font-semibold flex items-center gap-1 ml-auto">
                                                                ✨ Spellcaster
                                                            </span>
                                                        )}
                                                    </div>
                                                    {sub.magicType && (
                                                        <div className="mb-2 flex flex-wrap gap-1">
                                                            <span className="text-xs px-2 py-1 bg-amber-900/20 text-amber-500 border border-amber-900/30 rounded-full font-semibold">
                                                                {sub.magicType}
                                                            </span>
                                                            {sub.magicAbility && (
                                                                <span className="text-xs px-2 py-1 bg-blue-900/20 text-blue-400 border border-blue-900/30 rounded-full font-semibold">
                                                                    {sub.magicAbility}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {sub.magicDescription && (
                                                        <p className="text-xs text-brand-400/80 mb-1 italic">{sub.magicDescription}</p>
                                                    )}
                                                    <ClampedText text={sub.description} className="text-xs text-gray-500" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-12">
                            <p>Select a class to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Every class the character has, the starting class first, each with its own
 * level; the character level is their sum. Prerequisites are checked once the
 * ability scores (and any improvements) are settled, so a class can be
 * planned here before the scores that allow it exist.
 */
function ClassListPanel({
    entries,
    ruleset,
    classes,
    subclasses,
    featureChoices,
    onChange,
    onFeatureChoice,
    adding,
    onAddingChange,
}: {
    entries: MulticlassEntry[];
    ruleset: CharacterRuleset;
    classes: Class[];
    subclasses: Subclass[];
    featureChoices?: Record<string, string>;
    onChange: (entries: MulticlassEntry[]) => void;
    onFeatureChoice: (feature: string, option: string) => void;
    adding: boolean;
    onAddingChange: (adding: boolean) => void;
}) {
    const [query, setQuery] = useState("");
    const total = entries.reduce((sum, entry) => sum + entry.level, 0);
    const taken = new Set(entries.map((entry) => entry.class.id));
    const available = classes.filter((classData) => !taken.has(classData.id));
    const byId = new Map(classes.map((classData) => [classData.id, classData]));

    const update = (index: number, patch: Partial<MulticlassEntry>) =>
        onChange(entries.map((entry, at) => (at === index ? { ...entry, ...patch } : entry)));

    return (
        <div className="mt-6 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-4">
            {entries.map((entry, index) => {
                const starting = index === 0;
                const image = byId.get(entry.class.id) ?? entry.class;
                const maxLevel = MAX_LEVEL - (total - entry.level);
                const subclassLevel = subclassLevelFor(entry.class, ruleset);
                const options = subclasses.filter((subclass) => subclass.parentClassId === entry.class.id);
                const featureChoice = classRulesFor(entry.class, ruleset)?.featureChoice;
                const grant = starting ? undefined : multiclassProficiencies(entry.class, ruleset);
                const features = [
                    ...(entry.class.features ?? []).filter((feature) => feature.level <= entry.level),
                    ...(entry.subclass?.features ?? [])
                        .filter((feature) => feature.level <= entry.level)
                        .map((feature) => ({ ...feature, name: `${feature.name} (${entry.subclass!.name})` })),
                ].sort((a, b) => a.level - b.level);

                return (
                    <div key={entry.class.id} className="py-4 border-b border-zinc-800 last:border-b-0">
                        {starting && entries.length > 1 && (
                            <p className="text-center text-xs text-gray-500 mb-1">Starting Class</p>
                        )}
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                                {image.image ? (
                                    <SanityImage imageAsset={image.image} alt="" width={112} height={112} className="w-full h-full object-cover" />
                                ) : image.imageUrl ? (
                                    <img src={image.imageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-serif text-2xl text-brand-400">{entry.class.name[0]}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-bold text-2xl text-white truncate">{entry.class.name}</h3>
                                {!starting && (
                                    <p className="text-xs text-gray-500">Requires {prerequisiteText(entry.class)}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-sm font-semibold text-gray-300">Level</span>
                                <div className={`flex items-center ${STEPPER_FRAME}`}>
                                    <button
                                        type="button"
                                        aria-label={`Lower ${entry.class.name} level`}
                                        onClick={() => update(index, { level: entry.level - 1 })}
                                        disabled={entry.level <= 1}
                                        className="w-8 h-9 flex items-center justify-center text-gray-300 hover:bg-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <LevelInput
                                        value={entry.level}
                                        min={1}
                                        max={maxLevel}
                                        onChange={(next) => update(index, { level: next })}
                                        aria-label={`${entry.class.name} level`}
                                        className="w-10 h-9 bg-transparent text-center font-semibold text-white border-x border-zinc-700/50 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        aria-label={`Raise ${entry.class.name} level`}
                                        onClick={() => update(index, { level: entry.level + 1 })}
                                        disabled={entry.level >= maxLevel}
                                        className="w-8 h-9 flex items-center justify-center text-gray-300 hover:bg-zinc-800 disabled:text-zinc-600 disabled:hover:bg-transparent"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    aria-label={`Remove ${entry.class.name}`}
                                    title={starting && entries.length === 1 ? "Pick a different class above instead" : `Remove ${entry.class.name}`}
                                    onClick={() => onChange(entries.filter((_, at) => at !== index))}
                                    disabled={entries.length === 1}
                                    className="w-9 h-9 flex items-center justify-center text-brand-500 hover:text-brand-300 disabled:text-zinc-700"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {!starting && (
                            <div className="mt-3 space-y-2 text-sm">
                                <p className="text-xs text-gray-400">
                                    <span className="text-brand-300 font-semibold">Multiclass proficiencies: </span>
                                    {grant && grantRows(grant).length
                                        ? grantRows(grant).map((row) => `${row.label} — ${row.value}`).join(". ")
                                        : "none"}
                                </p>
                                {options.length > 0 && (
                                    <p className="text-xs text-gray-500">
                                        {entry.level >= subclassLevel
                                            ? `Subclass: ${entry.subclass?.name ?? "choose it in the next step"}.`
                                            : `Subclass at ${entry.class.name} level ${subclassLevel}, chosen in the subclass step.`}
                                    </p>
                                )}
                                {featureChoice && entry.level >= featureChoice.level && (
                                    <div id={featureChoiceAnchor(featureChoice.feature)} className="flex flex-wrap items-center gap-2 scroll-mt-24">
                                        <span className="text-gray-300">{featureChoice.feature}</span>
                                        {featureChoice.options.map((option) => (
                                            <button
                                                key={option.name}
                                                type="button"
                                                title={option.summary}
                                                onClick={() => onFeatureChoice(featureChoice.feature, option.name)}
                                                className={`px-2 py-1 rounded-md text-xs border ${featureChoices?.[featureChoice.feature] === option.name
                                                    ? "border-brand-500 bg-brand-900/40 text-brand-100"
                                                    : "border-zinc-700 text-gray-300 hover:border-brand-500/60"
                                                }`}
                                            >
                                                {option.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <details className="group mt-3">
                            <summary className="inline-flex items-center gap-1.5 cursor-pointer select-none list-none font-bold uppercase tracking-wide text-sm text-gray-200 border-b-2 border-brand-600 pb-1 [&::-webkit-details-marker]:hidden">
                                Class Features
                                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                            </summary>
                            {features.length ? (
                                <ul className="mt-3 space-y-2">
                                    {features.map((feature, at) => (
                                        <li key={`${feature.name}-${at}`} className="text-sm">
                                            <span className="text-gray-200 font-semibold">{feature.name}</span>
                                            <span className="text-xs text-gray-500"> · level {feature.level}</span>
                                            <ClampedText text={feature.description} className="text-xs text-gray-400" />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-3 text-sm text-gray-500 italic">No features recorded up to level {entry.level}.</p>
                            )}
                        </details>
                    </div>
                );
            })}

            <div className="py-4 border-t border-zinc-800">
                {total >= MAX_LEVEL ? (
                    <p className="text-sm text-gray-500">All 20 levels are assigned.</p>
                ) : !adding ? (
                    <button
                        type="button"
                        onClick={() => onAddingChange(true)}
                        className="text-brand-400 hover:text-brand-300 text-lg font-medium"
                    >
                        + Add Another Class
                    </button>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-300">Choose your next class. It starts at level 1.</p>
                            <button type="button" onClick={() => onAddingChange(false)} className="text-sm text-gray-500 hover:text-gray-300">Cancel</button>
                        </div>
                        <div className="mb-4 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search classes..."
                                className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-gray-500"
                            />
                        </div>
                        <ClassCardGrid
                            classes={available.filter((classData) => classData.name.toLowerCase().includes(query.trim().toLowerCase()))}
                            onPick={(classData) => {
                                onChange([...entries, { class: classData, level: 1 }]);
                                onAddingChange(false);
                                setQuery("");
                            }}
                            caption={(classData) => `Needs ${prerequisiteText(classData)}`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * A typed level, kept to its range. It applies on Enter or when the box loses
 * focus — applying each keystroke would pass through level 1 on the way to
 * 12 and drop every feat and class level above it. Left empty, the last
 * level comes back.
 */
function LevelInput({
    value,
    min,
    max,
    onChange,
    ...rest
}: {
    value: number;
    min: number;
    max: number;
    onChange: (level: number) => void;
    id?: string;
    className?: string;
    "aria-label"?: string;
}) {
    const [draft, setDraft] = useState(String(value));
    useEffect(() => setDraft(String(value)), [value]);

    const commit = () => {
        const parsed = Number.parseInt(draft, 10);
        const clamped = Number.isNaN(parsed) ? value : Math.min(max, Math.max(min, parsed));
        setDraft(String(clamped));
        if (clamped !== value) onChange(clamped);
    };

    return (
        <input
            {...rest}
            className={`stepper-input ${rest.className ?? ""}`}
            type="text"
            inputMode="numeric"
            value={draft}
            onChange={(event) => setDraft(event.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
            onBlur={commit}
            onKeyDown={(event) => {
                if (event.key === "Enter") commit();
                if (event.key === "Escape") setDraft(String(value));
            }}
            onFocus={(event) => event.target.select()}
        />
    );
}

/** The class cards, for the starting class and again for each further one. */
function ClassCardGrid({
    classes,
    selectedId,
    loading,
    onPick,
    caption,
}: {
    classes: Class[];
    selectedId?: string;
    loading?: boolean;
    onPick: (classData: Class) => void;
    caption?: (classData: Class) => string;
}) {
    return (
        <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20">
            <div className="p-4">
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="px-2 py-3 rounded-lg bg-zinc-900/50 animate-pulse h-24 flex flex-col items-center justify-center gap-2 border border-zinc-800">
                                <div className="h-5 w-20 bg-zinc-800 rounded"></div>
                                <div className="h-4 w-14 bg-zinc-800 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                ) : classes.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-6">No classes left to add.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {classes.map((classData) => {
                            const isActive = selectedId === classData.id;
                            const caster = classData.spellcaster && classData.spellcaster !== "None" && classData.spellcaster !== "none";
                            return (
                                <button
                                    key={classData.id}
                                    type="button"
                                    onClick={() => onPick(classData)}
                                    className={`px-2 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center text-center h-24 ${isActive
                                        ? "bg-brand-900/40 text-brand-100 shadow-[0_0_15px_rgba(220,38,38,0.3)] ring-1 ring-offset-0 ring-brand-500 border border-brand-500"
                                        : "bg-zinc-900/40 text-gray-400 border border-zinc-800 hover:bg-zinc-800 hover:border-brand-500/50 hover:text-gray-200"
                                    }`}
                                >
                                    <span className="font-bold text-lg mb-1 font-serif">{classData.name}</span>
                                    {caster && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${isActive ? "bg-brand-500 text-white" : "bg-zinc-800 text-brand-400 border border-brand-900/30"}`}>
                                            {classData.spellcaster}
                                        </span>
                                    )}
                                    {caption && <span className="text-[11px] text-gray-500 mt-1">{caption(classData)}</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
