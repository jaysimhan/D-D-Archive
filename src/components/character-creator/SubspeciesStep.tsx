import { useEffect, useMemo, useState } from "react";
import { Check, Search, Sparkles, User } from "lucide-react";
import type { AbilityScore, CharacterRuleset, Race, Spell, SpellGrant, Subrace } from "../../types/dnd-types";
import type { CharacterData } from "../../types/character-creator";
import { useRaces, useSpells } from "../../hooks/useSanityData";
import { speciesRulesFor, type RuleGrant, type SpeciesGrant } from "../../data/proficiency-rules";
import { subspeciesFor, type SubspeciesChoice, type SubspeciesOption } from "../../data/subspecies";
import { grantFromRules, grantRows } from "../../utils/proficiency-plan";
import SanityImage from "../SanityImage";
import { ClampedText } from "../ui/clamped-text";
import { PlanChoicePicker } from "./PlanChoicePicker";

const CASTING_ABILITIES: AbilityScore[] = ["INT", "WIS", "CHA"];
const ABILITY_NAMES: Record<string, string> = { INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma" };

/** The skill proficiencies a species grants, for an Ancestral Legacy to keep. */
function skillGrantOf(species: Race, ruleset: CharacterRuleset): RuleGrant | null {
    const grants = speciesRulesFor(species.id, ruleset)?.map(({ grant }) => grant)
        ?? [grantFromRules(species.proficiencies)].filter((grant): grant is RuleGrant => !!grant);
    const skills = grants.flatMap((grant) => grant.skills ?? []);
    const choices = grants.flatMap((grant) => grant.choices ?? []).filter((choice) => choice.kind === "skill");
    if (!skills.length && !choices.length) return null;
    return { skills, ...(choices.length ? { choices } : {}) };
}

/**
 * Builds the `subrace` a pick stands for. Spells are resolved against the
 * Archive by name so they reach the sheet like any other species spell; one
 * the Archive does not hold is left to the trait text.
 */
function buildSubrace({
    race,
    choice,
    option,
    ability,
    formerSpecies,
    ruleset,
    spellsByName,
}: {
    race: Race;
    choice: SubspeciesChoice;
    option: SubspeciesOption;
    ability?: AbilityScore;
    formerSpecies?: Race;
    ruleset: CharacterRuleset;
    spellsByName: Map<string, Spell>;
}): Subrace {
    let grants: SpeciesGrant[] | undefined = option.grants;
    const traits = option.traits;
    let name = option.name;

    if (choice.ancestralLegacy && option.id === "legacy" && formerSpecies) {
        // With no skills to keep, the lineage's own two skills apply instead.
        const kept = skillGrantOf(formerSpecies, ruleset);
        grants = [{
            feature: "Ancestral Legacy",
            grant: kept ?? { choices: [{ kind: "skill", count: 2 }] },
        }];
        name = `${formerSpecies.name} Legacy`;
    }

    const spells: SpellGrant[] = (option.spells ?? []).flatMap(({ name: spellName, level }) => {
        const spell = spellsByName.get(spellName.toLowerCase());
        if (!spell) return [];
        return [{
            name: spellName,
            level,
            mode: "fixed" as const,
            count: 1,
            specificSpells: [spell],
            ...(ability ? { ability: ability as SpellGrant["ability"] } : {}),
            ...(spell.level > 0 ? { recharge: "long-rest" as const } : {}),
        }];
    });

    return {
        id: `${race.id}:${option.id}${formerSpecies && option.id === "legacy" ? `:${formerSpecies.id}` : ""}`,
        parentRaceId: race.id,
        name,
        description: option.summary,
        source: race.source,
        edition: ruleset,
        version: 1,
        abilityScoreIncrease: {},
        traits,
        ruleGrants: grants,
        spellcastingAbility: ability,
        spells,
    };
}

export function SubspeciesStep({
    character,
    ruleset,
    onSubraceChange,
    onProficiencyChange,
}: {
    character: CharacterData;
    ruleset: CharacterRuleset;
    onSubraceChange: (subrace: Subrace | undefined) => void;
    onProficiencyChange: (update: (prev: CharacterData) => Partial<CharacterData>) => void;
}) {
    const race = character.race!;
    const choice = subspeciesFor(race.id, ruleset)!;
    const subrace = character.subrace;
    const [, selectedOptionId, formerId] = subrace?.id.split(":") ?? [];
    const selectedOption = choice.options.find((option) => option.id === selectedOptionId);

    const { data: spells } = useSpells(ruleset);
    const spellsByName = useMemo(
        () => new Map((spells ?? []).map((spell) => [spell.name.toLowerCase(), spell])),
        [spells],
    );
    const { data: races } = useRaces(ruleset);
    const formerOptions = useMemo(
        () => (races ?? [])
            .filter((other) => other.id !== race.id && !subspeciesFor(other.id, ruleset)?.ancestralLegacy)
            .sort((a, b) => a.name.localeCompare(b.name)),
        [races, race.id, ruleset],
    );

    const pick = (option: SubspeciesOption, ability = subrace?.spellcastingAbility, former?: Race) => {
        const needsFormer = choice.ancestralLegacy && option.id === "legacy";
        onSubraceChange(buildSubrace({
            race,
            choice,
            option,
            ability: choice.choosesSpellcastingAbility ? ability : undefined,
            formerSpecies: needsFormer ? former : undefined,
            ruleset,
            spellsByName,
        }));
    };
    const formerSpecies = formerOptions.find((other) => other.id === formerId);

    // A pick made before the spell list loaded is rebuilt once it has.
    useEffect(() => {
        if (!selectedOption?.spells?.length || (subrace?.spells?.length ?? 0) > 0 || spellsByName.size === 0) return;
        pick(selectedOption, subrace?.spellcastingAbility, formerSpecies);
    }, [spellsByName]);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <Sparkles className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                <h2 className="text-white text-3xl font-bold mb-3 font-serif">Choose Your {choice.feature}</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">{choice.intro}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
                {choice.options.map((option) => {
                    const active = option.id === selectedOptionId;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => pick(option, subrace?.spellcastingAbility, formerSpecies)}
                            className={`relative text-left p-4 rounded-xl border-2 transition-all ${active
                                ? "border-brand-500 bg-brand-950/60 shadow-[0_0_24px_rgba(220,38,38,0.2)]"
                                : "border-zinc-700 bg-zinc-900/60 hover:border-brand-700 hover:bg-zinc-900"
                            }`}
                        >
                            {active && (
                                <span className="absolute right-3 top-3 w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white" />
                                </span>
                            )}
                            <h3 className="text-lg text-white font-bold font-serif mb-1 pr-8">{option.name}</h3>
                            <p className="text-sm text-gray-400">{option.summary}</p>
                        </button>
                    );
                })}
            </div>

            {selectedOption && (
                <div className="mt-8 p-6 bg-zinc-900/60 border border-brand-900/30 rounded-xl space-y-5">
                    {choice.ancestralLegacy && selectedOption.id === "legacy" && (
                        <FormerSpeciesPicker
                            options={formerOptions}
                            selected={formerSpecies}
                            ruleset={ruleset}
                            onSelect={(former) => pick(selectedOption, undefined, former)}
                        />
                    )}

                    {choice.choosesSpellcastingAbility && (
                        <div>
                            <h4 className="font-bold text-brand-400 text-sm mb-2">Spellcasting ability for these spells</h4>
                            <div className="flex flex-wrap gap-2">
                                {CASTING_ABILITIES.map((ability) => (
                                    <button
                                        key={ability}
                                        type="button"
                                        onClick={() => pick(selectedOption, ability)}
                                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${subrace?.spellcastingAbility === ability
                                            ? "border-brand-500 bg-brand-900/40 text-brand-100"
                                            : "border-zinc-700 text-gray-300 hover:border-brand-500/60"
                                        }`}
                                    >
                                        {ABILITY_NAMES[ability]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {(subrace?.traits ?? []).map((trait) => (
                        <div key={trait.name}>
                            <h4 className="font-bold text-brand-400 text-sm">{trait.name}</h4>
                            <p className="text-sm text-gray-300">{trait.description}</p>
                        </div>
                    ))}

                    {(subrace?.spells ?? []).length > 0 && (
                        <div>
                            <h4 className="font-bold text-brand-400 text-sm mb-1">Spells</h4>
                            <ul className="text-sm text-gray-300 space-y-0.5">
                                {subrace!.spells!.map((grant) => (
                                    <li key={grant.name}>
                                        {grant.name}
                                        <span className="text-gray-500">
                                            {grant.level > 1 ? ` — from character level ${grant.level}` : " — from level 1"}
                                            {grant.level > character.level ? " (not yet reached)" : ""}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <PlanChoicePicker
                        character={character}
                        include={(planChoice) => !!subrace && !planChoice.duplicate
                            && planChoice.id.startsWith(`subrace:${subrace.id}`)}
                        onChange={onProficiencyChange}
                    />
                </div>
            )}
        </div>
    );
}

/** Whether the subspecies screen has everything it needs before moving on. */
/** What the subspecies step still needs, or null when it is done. */
export function subspeciesBlocker(character: Pick<CharacterData, "race" | "subrace" | "ruleset">): string | null {
    const choice = subspeciesFor(character.race?.id, character.ruleset);
    if (!choice) return null;
    const subrace = character.subrace;
    const missing = `Choose your ${choice.feature}.`;
    if (!subrace || subrace.parentRaceId !== character.race?.id) return missing;
    const [, optionId, formerId] = subrace.id.split(":");
    if (!choice.options.some((option) => option.id === optionId)) return missing;
    if (choice.choosesSpellcastingAbility && !subrace.spellcastingAbility) {
        return "Choose the spellcasting ability for your lineage's spells.";
    }
    if (choice.ancestralLegacy && optionId === "legacy" && !formerId) {
        return "Choose the species your Ancestral Legacy comes from.";
    }
    return null;
}

export function subspeciesComplete(character: Pick<CharacterData, "race" | "subrace" | "ruleset">): boolean {
    return subspeciesBlocker(character) === null;
}

/** Traits that give a speed an Ancestral Legacy carries over. */
const MOVEMENT_TRAIT = /\b(climb(ing)?|fly(ing)?|swim(ming)?)\s+speed\b/i;

/**
 * The Ancestral Legacy's former species: a searchable list, with the species
 * under the pointer (or the one chosen) previewed alongside — chiefly what
 * the character would keep from it.
 */
function FormerSpeciesPicker({
    options,
    selected,
    ruleset,
    onSelect,
}: {
    options: Race[];
    selected?: Race;
    ruleset: CharacterRuleset;
    onSelect: (species: Race) => void;
}) {
    const [query, setQuery] = useState("");
    const [hovered, setHovered] = useState<Race | undefined>();
    const shown = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return needle ? options.filter((species) => species.name.toLowerCase().includes(needle)) : options;
    }, [options, query]);

    const preview = hovered ?? selected;
    const kept = preview ? skillGrantOf(preview, ruleset) : null;
    const speeds = (preview?.traits ?? []).filter((trait) =>
        MOVEMENT_TRAIT.test(`${trait.name} ${trait.description}`) || /^(flight|swim|climb)/i.test(trait.name));

    return (
        <div>
            <h4 className="font-bold text-brand-400 text-sm mb-2">Former species</h4>
            {/* Both columns hold one height, so moving between species never
                resizes the panel and shoves the page around under the pointer. */}
            <div className="grid md:grid-cols-[1fr_280px] gap-4 md:h-[26rem]">
                <div className="flex flex-col min-h-0">
                    <div className="relative mb-3 shrink-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search species..."
                            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm text-white placeholder-gray-500"
                        />
                    </div>
                    <div
                        className="max-h-80 md:max-h-none md:flex-1 min-h-0 overflow-y-auto overscroll-contain grid grid-cols-2 sm:grid-cols-3 auto-rows-min gap-2 pr-1"
                        onMouseLeave={() => setHovered(undefined)}
                    >
                        {shown.map((species) => {
                            const active = selected?.id === species.id;
                            return (
                                <button
                                    key={species.id}
                                    type="button"
                                    onClick={() => onSelect(species)}
                                    onMouseEnter={() => setHovered(species)}
                                    onFocus={() => setHovered(species)}
                                    className={`px-2 py-2 rounded text-xs font-bold text-center leading-tight min-h-[40px] transition-all ${active
                                        ? "bg-brand-900/40 text-brand-100 ring-1 ring-brand-500 border border-brand-500"
                                        : "bg-zinc-900/40 text-gray-400 border border-zinc-800 hover:bg-zinc-800 hover:border-brand-500/50 hover:text-gray-200"
                                    }`}
                                >
                                    {species.name}
                                </button>
                            );
                        })}
                        {shown.length === 0 && (
                            <p className="col-span-full text-sm text-gray-500 italic py-4 text-center">No species match "{query}".</p>
                        )}
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 md:h-full overflow-y-auto">
                    {preview ? (
                        <>
                            <div className="w-full aspect-[3/2] bg-black/40 rounded-md mb-3 flex items-center justify-center overflow-hidden border border-zinc-800">
                                {preview.image ? (
                                    <SanityImage imageAsset={preview.image} alt={preview.name} width={400} height={267} className="w-full h-full object-cover" />
                                ) : preview.imageUrl ? (
                                    <img src={preview.imageUrl} alt={preview.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-zinc-700" />
                                )}
                            </div>
                            <h5 className="text-xl font-bold text-white font-serif mb-1 flex items-center gap-2">
                                <span className="truncate">{preview.name}</span>
                                {preview.id === selected?.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </h5>
                            <ClampedText text={preview.description} className="text-xs text-gray-400 mb-3" />
                            <h6 className="font-bold text-brand-400 text-xs uppercase tracking-wider mb-1">You keep</h6>
                            {kept ? (
                                <ul className="text-sm text-gray-300 space-y-0.5">
                                    {grantRows(kept).map((row) => (
                                        <li key={row.label}><span className="text-gray-200 font-semibold">{row.label}:</span> {row.value}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-400">No skills, so you gain two skills of your choice instead.</p>
                            )}
                            {speeds.length > 0 && (
                                <ul className="text-sm text-gray-300 space-y-0.5 mt-2">
                                    {speeds.map((trait) => (
                                        <li key={trait.name}><span className="text-gray-200 font-semibold">{trait.name}:</span> {trait.description}</li>
                                    ))}
                                </ul>
                            )}
                        </>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-8">Hover over a species to preview what you would keep.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

