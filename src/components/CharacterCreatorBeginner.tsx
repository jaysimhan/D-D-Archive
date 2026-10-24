import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, ArrowLeft, Check, Crown, Loader2, RotateCcw } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { CharacterData, CreationStep, isCreationStep } from "../types/character-creator";

import {
  clearDraft,
  createEmptyCharacter,
  loadDraft,
  saveCompletedSheet,
  saveDraft,
  type CreatorDraft,
} from "../lib/character-storage";
import { useBackgrounds, useClasses, useFeats, useRaces, useSpells, useSubclasses } from "../hooks/useSanityData";
import {
  buildProficiencyPlan,
  chosenFeatureOption,
  EMPTY_CUSTOM,
  pruneSelections,
  resolveProficiencies,
} from "../utils/proficiency-plan";
import {
  collectCharacterSpells,
  refreshCharacterSpellData,
  withoutSpellSource,
} from "../utils/character-spells";
import { subclassLevelFor } from "../utils/class-progression";
import { classRulesFor } from "../data/proficiency-rules";
import { metamagicChoiceLimit } from "../utils/combat-progression";
import {
  earnedFeats,
  featTakenAt,
  improvementSlots,
  pruneFeatAbilityChoices,
  speciesGrantsOriginFeat,
  unfinishedImprovements,
} from "../utils/feats";
import type { Feat } from "../types/dnd-types";
import { abilityScoresBlocker, finalAbilityScores } from "../utils/ability-scores";

// Import Step Components
import { NameStep } from "./character-creator/NameStep";
import { RulesetStep } from "./character-creator/RulesetStep";
import { RaceStep } from "./character-creator/RaceStep";
import { SubspeciesStep, subspeciesBlocker } from "./character-creator/SubspeciesStep";
import { subspeciesFor } from "../data/subspecies";
import { ClassStep, featureChoiceAnchor } from "./character-creator/ClassStep";
import { SubclassesStep } from "./character-creator/SubclassStep";
import { AbilityScoreStep, type ScoreGeneration } from "./character-creator/AbilityScoreStep";
import { BackgroundStep } from "./character-creator/BackgroundStep";
import { SpellSelectionStep } from "./character-creator/SpellSelectionStep";
import { EquipmentStep } from "./character-creator/EquipmentStep";
import { PersonalityStep } from "./character-creator/PersonalityStep";
import { FeatSelectionStep } from "./character-creator/FeatSelectionStep";
import { ProficiencyStep } from "./character-creator/ProficiencyStep";
import { HitPointsStep } from "./character-creator/HitPointsStep";
import { MulticlassSpells } from "./character-creator/MulticlassSpells";
import {
  classLevels,
  isMulticlassed,
  levelDice,
  primaryClassLevel,
  unmetMulticlassPrerequisites,
  withoutMulticlassSpells,
  type MulticlassEntry,
} from "../utils/multiclass";
import { casterTypeOf } from "../utils/spellcasting-progression";
import { MagicItemStep } from "./character-creator/MagicItemStep";

/**
 * Swaps in a new feat list and lets go of what the old one carried: the
 * ability points a dropped feat placed, Metamagic picks past the new limit,
 * and spells chosen through feats, which are picked again on the Spells step.
 */
function changeFeats(character: CharacterData, feats: Feat[]): CharacterData {
  const sameFeats = feats.length === character.feats.length
    && feats.every((feat) => character.feats.some((held) => held.id === feat.id && held.takenAt === feat.takenAt));
  return {
    ...character,
    feats,
    featAbilityChoices: pruneFeatAbilityChoices(feats, character.featAbilityChoices),
    metamagicChoices: (character.metamagicChoices || []).slice(
      0,
      metamagicChoiceLimit(character.class?.id ?? "", character.level, feats, character.ruleset),
    ),
    selectedSpells: sameFeats
      ? character.selectedSpells
      : withoutSpellSource(character.selectedSpells, "Feat", "Magic Initiate", "Aberrant Dragonmark"),
  };
}

/**
 * After a change of level, class or species, keeps only the feats the
 * character still earns: improvements above the new level, a Fighter's extra
 * ones after switching class, or a Human's Versatile feat after switching
 * species all go.
 */
function settleFeats(character: CharacterData): CharacterData {
  const feats = earnedFeats(character);
  return feats.length === character.feats.length ? { ...character, feats } : changeFeats(character, feats);
}

export function CharacterCreator() {
  const navigate = useNavigate();
  const { step: stepParam } = useParams<{ step: string }>();
  // The draft is read straight into initial state: localStorage is synchronous,
  // so the very first render already knows which steps this character has
  // earned and no step ever mounts against an empty character.
  // Drafts from before improvements existed may hold feats picked freely at
  // level 1; settling drops whatever the character no longer earns.
  const [characterData, setCharacterData] = useState<CharacterData>(() => {
    const draft = loadDraft()?.character;
    return draft ? settleFeats(draft) : createEmptyCharacter();
  });

  // Fetch subclasses here for the check
  const { data: sanitySubclasses, loading: subclassesLoading } = useSubclasses(characterData.ruleset);
  const { data: sanityClasses } = useClasses(characterData.ruleset);
  const { data: sanityRaces } = useRaces(characterData.ruleset);
  const { data: sanityFeats } = useFeats(characterData.ruleset);
  const { data: sanitySpells } = useSpells(characterData.ruleset);
  const { data: sanityBackgrounds } = useBackgrounds(characterData.ruleset);

  const allSubclasses = useMemo(() => {
    return sanitySubclasses || [];
  }, [sanitySubclasses]);

  // Drafts intentionally store complete objects so they work offline, but the
  // archive may have repaired a spell school or grant since the draft was
  // saved. Refresh matching records by id and retain local-only/homebrew data.
  useEffect(() => {
    if (!sanityClasses.length && !sanityRaces.length && !sanitySubclasses.length &&
        !sanityFeats.length && !sanitySpells.length && !sanityBackgrounds.length) return;
    setCharacterData((current) => refreshCharacterSpellData(current, {
      classes: sanityClasses,
      races: sanityRaces,
      subclasses: sanitySubclasses,
      feats: sanityFeats,
      spells: sanitySpells,
      backgrounds: sanityBackgrounds,
    }));
  }, [sanityClasses, sanityRaces, sanitySubclasses, sanityFeats, sanitySpells, sanityBackgrounds]);

  // Each class, starting class first, that has reached its subclass level and
  // has subclasses in the Archive to choose from.
  const subclassEntries = useMemo(
    () => classLevels(characterData).filter((entry) =>
      entry.level >= subclassLevelFor(entry.class, characterData.ruleset)
      && allSubclasses.some((subclass) => subclass.parentClassId === entry.class.id)),
    [characterData.class, characterData.subclass, characterData.level, characterData.multiclasses, characterData.ruleset, allSubclasses],
  );

  const steps: CreationStep[] = useMemo(() => {
    const baseSteps: CreationStep[] = ["ruleset", "class"];

    // One subclass step covers every class that has reached its subclass level.
    if (subclassEntries.length > 0) baseSteps.push("subclass");

    baseSteps.push("race");
    if (subspeciesFor(characterData.race?.id, characterData.ruleset)) baseSteps.push("subspecies");
    baseSteps.push("background");
    baseSteps.push("abilities");
    // Ability Score Improvements start at level 4: each is a +2/+1+1 or a feat,
    // chosen once the base scores they build on are known.
    if (improvementSlots(characterData).length > 0) baseSteps.push("feats");
    baseSteps.push("proficiencies");

    // Add spells step if class is spellcaster OR race is spellcaster OR subclass is spellcaster
    const isClassCaster = characterData.class?.isSpellcaster === true || (characterData.class?.spellcaster && characterData.class.spellcaster !== 'none' && characterData.class.spellcaster !== 'None');
    const isRaceCaster = characterData.race?.isSpellcaster === true || (characterData.subrace?.spells?.length ?? 0) > 0;
    const isSubclassCaster = characterData.subclass?.isSpellcaster === true || characterData.subclass?.spellcaster === true;
    const hasFeatSpells = characterData.feats.some((feat) =>
      (feat.spells?.length ?? 0) > 0 ||
      feat.grants?.some((grant) => grant.grantType === "Specific Spell" || grant.grantType === "Spell Slot"),
    );

    // A later class that casts brings the spells step too.
    const isMulticlassCaster = classLevels(characterData)
      .slice(1)
      .some((entry) => casterTypeOf(entry.class, entry.subclass) !== "none");

    if (isClassCaster || isRaceCaster || isSubclassCaster || hasFeatSpells || isMulticlassCaster) {
      baseSteps.push("spells");
    }

    // New Steps
    baseSteps.push("hp");
    baseSteps.push("equipment");

    // Magic Item Step (Level 3+)
    if (characterData.level >= 3) {
      baseSteps.push("magic-item");
    }

    baseSteps.push("personality"); // Matches "Character Details"

    return baseSteps;
  }, [
    characterData.class,
    characterData.level,
    characterData.feats,
    characterData.race,
    characterData.subrace,
    characterData.ruleset,
    characterData.subclass,
    characterData.multiclasses,
    allSubclasses,
    subclassEntries,
  ]);

  const unmetPrerequisites = unmetMulticlassPrerequisites(characterData, finalAbilityScores(characterData));
  const multiclassPrerequisitesMet = unmetPrerequisites.length === 0;
  // The last step that can still change the scores is where they are checked.
  const prerequisiteStep: CreationStep = steps.includes("feats") ? "feats" : "abilities";

  /**
   * Every class with its level, starting class first. The character level is
   * their sum; a class that drops out, or a starting class that changes, takes
   * its spell picks with it, and improvements it no longer earns go too.
   */
  const setClasses = (entries: MulticlassEntry[]) => {
    const [first, ...rest] = entries;
    if (!first) return;
    const ruleset = characterData.ruleset;
    const reached = (entry: MulticlassEntry) =>
      entry.subclass && entry.level >= subclassLevelFor(entry.class, ruleset) ? entry.subclass : undefined;
    const before = classLevels(characterData);
    const firstChanged = first.class.id !== before[0]?.class.id || first.level !== before[0]?.level;
    const unchanged = new Set(rest
      .filter((entry) => before.some((old, index) => index > 0 && old.class.id === entry.class.id && old.level === entry.level))
      .map((entry) => entry.class.id));

    setCharacterData(settleFeats({
      ...characterData,
      class: first.class,
      subclass: reached(first),
      level: entries.reduce((total, entry) => total + entry.level, 0),
      multiclasses: rest.length ? rest.map((entry) => ({ ...entry, subclass: reached(entry) })) : undefined,
      selectedSpells: withoutMulticlassSpells(
        firstChanged
          ? withoutSpellSource(characterData.selectedSpells, "Class", "Subclass")
          : characterData.selectedSpells,
        (classId) => unchanged.has(classId),
      ),
    }));
  };

  // A 2024 cleric or druid has to settle their Divine or Primal Order before
  // leaving the class step. Later classes need theirs too; subclasses come next.
  const missingFeatureChoices = classLevels(characterData).flatMap((entry) => {
    const featureChoice = classRulesFor(entry.class, characterData.ruleset)?.featureChoice;
    return featureChoice
      && entry.level >= featureChoice.level
      && !characterData.classFeatureChoices?.[featureChoice.feature]
      ? [{ className: entry.class.name, ...featureChoice }]
      : [];
  });

  /** Why a step can't be left yet, in words for the player; null when it can. */
  const stepBlocker = (step: CreationStep | undefined): string | null => {
    const prerequisitesNote = "Your multiclass needs higher ability scores — see the note above.";
    switch (step) {
      case "ruleset":
        return characterData.ruleset === "2014" || characterData.ruleset === "2024"
          ? null
          : "Choose the 2014 or 2024 rules.";
      case "race":
        if (!characterData.race) return "Choose a species.";
        // A 2024 Human's Versatile Origin feat is part of picking the species.
        return speciesGrantsOriginFeat(characterData.ruleset, characterData.race, characterData.subrace)
          && !featTakenAt(characterData.feats, "species")
          ? `Choose the Origin feat your ${characterData.race.name} gets.`
          : null;
      case "subspecies":
        return subspeciesBlocker(characterData);
      case "class": {
        if (!characterData.class) return "Choose a class.";
        const [first, ...more] = missingFeatureChoices;
        if (!first) return null;
        const options = first.options.map((option) => option.name).join(" or ");
        return `Choose your ${first.className}'s ${first.feature} (${options})${more.length ? `, and ${more.length} more` : ""}.`;
      }
      case "subclass": {
        const missing = subclassEntries.filter((entry) => !entry.subclass).map((entry) => entry.class.name);
        return missing.length ? `Choose a subclass for your ${missing.join(" and ")}.` : null;
      }
      case "background":
        return characterData.background ? null : "Choose a background.";
      case "feats": {
        // Every improvement needs a choice, and every point it hands out a home.
        // Improvements can lift a score to 13, so multiclass prerequisites are
        // judged here when the character has any.
        const [slot, ...more] = unfinishedImprovements(characterData);
        if (slot) {
          const where = slot.epicBoon
            ? `your Epic Boon at ${slot.className} level ${slot.classLevel}`
            : `your ${slot.className} level ${slot.classLevel} improvement`;
          return `Finish ${where} — pick a feat or place its ability points${more.length ? ` (${more.length} more after it)` : ""}.`;
        }
        return multiclassPrerequisitesMet ? null : prerequisitesNote;
      }
      case "abilities":
        return abilityScoresBlocker(characterData)
          ?? (steps.includes("feats") || multiclassPrerequisitesMet ? null : prerequisitesNote);
      case "proficiencies":
      case "spells":
      case "hp":
      case "equipment":
      case "magic-item":
        return null;
      case "personality":
        return characterData.name.trim() ? null : "Enter your character's name.";
      default:
        return "This step isn't available yet.";
    }
  };

  const canLeaveStep = (step: CreationStep | undefined): boolean => stepBlocker(step) === null;

  // Now that each step is its own URL, one can be typed in or bookmarked out of
  // turn. Reachable ground stops at the first step still missing a choice, so
  // /creator/spells cannot be opened before there is a class to cast with.
  const furthestStepIndex = useMemo(() => {
    const blockedAt = steps.findIndex((step) => !canLeaveStep(step));
    return blockedAt === -1 ? steps.length - 1 : blockedAt;
  }, [steps, characterData]);

  const requestedIndex = isCreationStep(stepParam) ? steps.indexOf(stepParam) : -1;
  const isStepAllowed = requestedIndex >= 0 && requestedIndex <= furthestStepIndex;
  const currentStep: CreationStep | undefined = isStepAllowed
    ? steps[requestedIndex]
    : undefined;
  const currentStepIndex = isStepAllowed ? requestedIndex : -1;

  // Every edit is written back, so a refresh — or a browser reloading the tab on
  // its own — picks up on the same step with the same character. The name and
  // personality fields report on every keystroke, so the write waits a moment
  // rather than re-serialising the whole character letter by letter.
  const pendingDraft = useRef<CreatorDraft | null>(null);
  useEffect(() => {
    if (!currentStep) return;
    pendingDraft.current = { character: characterData, step: currentStep };
    const handle = window.setTimeout(() => {
      saveDraft(characterData, currentStep);
      pendingDraft.current = null;
    }, 400);
    return () => window.clearTimeout(handle);
  }, [characterData, currentStep]);

  // Leaving the creator cancels that timer, so anything it was still holding is
  // written on the way out — otherwise the last edit before Complete or Back
  // would be the one edit the draft never kept.
  useEffect(
    () => () => {
      const pending = pendingDraft.current;
      if (pending) saveDraft(pending.character, pending.step);
    },
    [],
  );

  // Proficiencies are not typed in, they are read off the character: species,
  // class, subclass, background and feats grant them, and the player only fills
  // in the choices those features leave open. Keeping the reading here rather
  // than inside the step means a class swapped after the fact still drops the
  // picks it was offering, even if the player never opens the step again.
  useEffect(() => {
    const plan = buildProficiencyPlan(characterData);
    const choices = pruneSelections(plan, characterData.proficiencyChoices ?? {});
    const proficiencies = resolveProficiencies(
      plan,
      choices,
      characterData.customProficiencies ?? EMPTY_CUSTOM,
    );

    setCharacterData((prev) => {
      const sameChoices =
        JSON.stringify(prev.proficiencyChoices ?? {}) === JSON.stringify(choices);
      const sameProficiencies =
        JSON.stringify(prev.proficiencies) === JSON.stringify(proficiencies);
      if (sameChoices && sameProficiencies) return prev;
      return { ...prev, proficiencies, proficiencyChoices: choices };
    });
  }, [characterData]);

  // Each step is a real navigation now; without this a long step would open
  // already scrolled to wherever the previous one was left.
  useEffect(() => {
    if (currentStep) window.scrollTo({ top: 0 });
  }, [currentStep]);

  // Stable, because the ability step listens to the dice roller through it;
  // the function form keeps a roll landing late from undoing a newer edit.
  const updateScoreGeneration = useCallback(
    (patch: ScoreGeneration) => setCharacterData((prev) => ({ ...prev, ...patch })),
    [],
  );

  const updateFromPicker = useCallback(
    (update: (prev: CharacterData) => Partial<CharacterData>) =>
      setCharacterData((prev) => ({ ...prev, ...update(prev) })),
    [],
  );

  const goToStep = (step: CreationStep) => navigate(`/creator/${step}`);

  const nextStep = () => {
    if (currentStepIndex >= 0 && currentStepIndex < steps.length - 1) {
      goToStep(steps[currentStepIndex + 1]);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      goToStep(steps[currentStepIndex - 1]);
    }
  };

  const blocker = stepBlocker(currentStep);
  const canProgress = () => blocker === null;

  const completeCharacter = () => {
    saveCompletedSheet({
      ...characterData,
      selectedSpells: collectCharacterSpells(characterData),
    });
    navigate("/character-sheet");
  };

  const selectRuleset = (ruleset: "2014" | "2024") => {
    setCharacterData((previous) => {
      if (previous.ruleset === ruleset) return previous;
      // Drafts created before rulesets existed keep every choice. The player
      // can review them against the selected ruleset instead of losing work.
      if (!previous.ruleset) return { ...previous, ruleset };
      const fresh = createEmptyCharacter();
      return {
        ...fresh,
        ruleset,
        name: previous.name,
        personality: previous.personality,
      };
    });
  };

  const startOver = () => {
    if (!window.confirm("Discard this character and start from the beginning?")) return;
    clearDraft();
    setCharacterData(createEmptyCharacter());
    navigate(`/creator/${steps[0]}`, { replace: true });
  };

  if (!currentStep) {
    // The subclass step only joins the running order once Sanity has answered
    // on which classes have subclasses, so a refresh on /creator/subclass waits
    // for that answer rather than being bounced off a step that does exist.
    if (subclassesLoading) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      );
    }
    return <Navigate to={`/creator/${steps[furthestStepIndex]}`} replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand-500/30">
      {/* Dark Fantasy Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-brand-950/20 to-zinc-950"></div>
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 0, 60, 0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}></div>
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-900/10 to-transparent"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-brand-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-950">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-lg bg-brand-900/30 hover:bg-brand-900/50 border border-brand-800/30 transition-colors">
                <ArrowLeft className="w-5 h-5 text-brand-400" />
              </Link>
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center border-2 border-brand-400/50 shadow-lg">
                    <Crown className="w-5 h-5 text-brand-100" />
                  </div>
                </div>
                <div>
                  <h1 className="text-white text-2xl md:text-3xl font-serif tracking-wide">Character Creator</h1>
                  <p className="text-brand-400/60 text-sm">Create your D&D character (Levels 1-20)</p>
                </div>
              </div>
              {/* Progress is kept between visits now, so there has to be a way
                  to put a half-finished character down and begin another. */}
              <button
                onClick={startOver}
                className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm text-gray-400 hover:text-white rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Start Over</span>
              </button>
            </div>
          </div>
        </div>

        {/* Top Navigation */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-brand-900/30 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium border border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-brand-400 font-medium capitalize ml-2">
                {currentStep === "feats" ? "ASI or Feat" : currentStep.replace("-", " ")}
              </span>
            </div>

            <span title={blocker ?? undefined} className="flex items-center gap-4">
              {currentStepIndex === steps.length - 1 ? (
                <button
                  onClick={completeCharacter}
                  disabled={!canProgress()}
                  aria-describedby={blocker ? "step-blocker" : undefined}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm border border-green-500/50"
                >
                  <Check className="w-4 h-4" />
                  Complete
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProgress()}
                  aria-describedby={blocker ? "step-blocker" : undefined}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm border border-brand-500/50"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg border border-brand-900/30">
            <div className="p-4 md:p-8 min-h-[600px]">
              {/* Step Content */}

              {/* A class feature that must be picked holds Next; the pick sits
                  far down the class details, so say what it is and go there. */}
              {currentStep === "class" && characterData.class && missingFeatureChoices.length > 0 && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-brand-600/70 bg-brand-950/40 p-4 text-sm text-brand-100 flex flex-wrap items-center gap-3"
                >
                  <AlertTriangle className="w-5 h-5 shrink-0 text-brand-400" />
                  <p className="flex-1 min-w-[12rem]">
                    <span className="font-semibold">You can't continue yet:</span>{" "}
                    {missingFeatureChoices.map(({ className, feature, options }, index) => (
                      <span key={feature}>
                        {index > 0 && "; "}
                        choose your {className}&apos;s {feature} ({options.map((option) => option.name).join(" or ")})
                      </span>
                    ))}
                    .
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(featureChoiceAnchor(missingFeatureChoices[0].feature))
                        ?.scrollIntoView({ behavior: "smooth", block: "center" })
                    }
                    className="rounded-lg border border-brand-500/60 bg-brand-900/40 px-3 py-1.5 font-medium text-white hover:bg-brand-900/60"
                  >
                    Show me
                  </button>
                </div>
              )}

              {/* Multiclass prerequisites: a warning wherever scores can still
                  change, and the reason Next is held on the step that checks. */}
              {(currentStep === "abilities" || currentStep === "feats") && unmetPrerequisites.length > 0 && (
                <div
                  role="alert"
                  className={`mb-6 rounded-xl border p-4 text-sm flex gap-3 ${currentStep === prerequisiteStep
                    ? "border-brand-600/70 bg-brand-950/40 text-brand-100"
                    : "border-amber-700/60 bg-amber-950/30 text-amber-100"
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${currentStep === prerequisiteStep ? "text-brand-400" : "text-amber-400"}`} />
                  <div className="flex-1">
                    <p className="font-semibold">
                      {currentStep === prerequisiteStep
                        ? "You can't continue yet: your multiclass needs these scores."
                        : "Heads up: your multiclass needs these scores."}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {unmetPrerequisites.map(({ classData, eitherOne, shortfalls }) => (
                        <li key={classData.id}>
                          <span className="font-semibold">{classData.name}:</span>{" "}
                          {shortfalls.map(({ ability, name, have, need }, index) => (
                            <span key={ability}>
                              {index > 0 && (eitherOne ? " or " : ", ")}
                              {name} <span className="font-mono">{have}</span> → needs{" "}
                              <span className="font-mono font-semibold">{need}</span>
                              <span className="opacity-70"> (+{need - have})</span>
                            </span>
                          ))}
                          {eitherOne && shortfalls.length > 1 && <span className="opacity-70"> — either one is enough</span>}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 opacity-75">
                      {currentStep === "feats"
                        ? "Take an Ability Score Improvement in one of these, go back to Ability Scores, or change your class levels."
                        : prerequisiteStep === "feats"
                          ? "Raise them here, or with an Ability Score Improvement in the next step. You won't be able to continue past it until they're met."
                          : "Raise them here, or change your class levels, to continue."}
                      {" "}Scores count species, background and feat bonuses.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === "ruleset" && (
                <RulesetStep
                  selected={characterData.ruleset}
                  onSelect={selectRuleset}
                  leveling={characterData.leveling ?? "xp"}
                  onLevelingChange={(leveling) =>
                    setCharacterData((previous) => ({ ...previous, leveling }))
                  }
                />
              )}

              {currentStep === "race" && (
                <RaceStep
                  ruleset={characterData.ruleset!}
                  race={characterData.race}
                  character={characterData}
                  onProficiencyChange={updateFromPicker}
                  onChange={(race) => {
                    // Only a 2024 Human gets the Versatile feat, so moving away
                    // from Human takes it — and anything it granted — back.
                    setCharacterData(settleFeats({
                      ...characterData,
                      race,
                      subrace: undefined,
                      selectedSpells: withoutSpellSource(characterData.selectedSpells, "Racial"),
                    }));
                  }}
                  onSpeciesFeatChange={(feat) => setCharacterData(changeFeats(characterData, [
                    ...characterData.feats.filter((taken) => taken.takenAt !== "species"),
                    ...(feat ? [{ ...feat, takenAt: "species" as const }] : []),
                  ]))}
                />
              )}
              {currentStep === "subspecies" && characterData.race && (
                <SubspeciesStep
                  ruleset={characterData.ruleset!}
                  character={characterData}
                  onSubraceChange={(subrace) => setCharacterData((prev) => ({ ...prev, subrace }))}
                  onProficiencyChange={updateFromPicker}
                />
              )}
              {currentStep === "class" && (
                <ClassStep
                  ruleset={characterData.ruleset!}
                  selected={characterData.class}
                  subclass={characterData.subclass}
                  multiclasses={characterData.multiclasses}
                  onClassesChange={setClasses}
                  level={characterData.level}
                  featureChoices={characterData.classFeatureChoices}
                  onFeatureChoice={(feature, option) => {
                    if (characterData.classFeatureChoices?.[feature] === option) return;
                    // Thaumaturge and Magician add a cantrip, so the class's picks start over.
                    setCharacterData({
                      ...characterData,
                      classFeatureChoices: { ...characterData.classFeatureChoices, [feature]: option },
                      selectedSpells: withoutSpellSource(characterData.selectedSpells, "Class"),
                    });
                  }}
                  onSelect={(classData) =>
                    // Fighters and Rogues have extra improvement levels, so a
                    // class change can take some choices back.
                    setCharacterData(settleFeats({
                      ...characterData,
                      class: classData,
                      subclass: undefined,
                      classFeatureChoices: undefined,
                      // A class can't be taken twice, so it leaves the multiclass list.
                      multiclasses: characterData.multiclasses?.filter((entry) => entry.class.id !== classData.id),
                      selectedSpells: withoutMulticlassSpells(
                        withoutSpellSource(characterData.selectedSpells, "Class", "Subclass"),
                        (classId) => classId !== classData.id,
                      ),
                    }))
                  }
                  onLevelChange={(level) => {
                    // The total moves the starting class's levels. Below what
                    // the later classes hold, they give levels back from the last.
                    // Before a class is picked the level is simply held; the
                    // class takes it when chosen.
                    if (!characterData.class) {
                      setCharacterData(settleFeats({ ...characterData, level }));
                      return;
                    }
                    const entries = classLevels(characterData);
                    const surplus = entries.reduce((total, entry) => total + entry.level, 0) - level;
                    const next = entries.map((entry) => ({ ...entry }));
                    next[0].level -= surplus;
                    for (let index = next.length - 1; index > 0 && next[0].level < 1; index -= 1) {
                      const give = Math.min(next[index].level, 1 - next[0].level);
                      next[index].level -= give;
                      next[0].level += give;
                    }
                    // Levelling down hands improvement levels back, so anything
                    // taken there goes — along with the ability points it placed.
                    setClasses(next.filter((entry, index) => index === 0 || entry.level > 0));
                  }}
                />
              )}
              {currentStep === "subclass" && (
                <SubclassesStep
                  entries={subclassEntries}
                  ruleset={characterData.ruleset!}
                  onSelect={(classId, subclass) => setCharacterData((prev) => prev.class?.id === classId
                    ? {
                      ...prev,
                      subclass,
                      selectedSpells: withoutSpellSource(prev.selectedSpells, "Subclass"),
                    }
                    : {
                      ...prev,
                      multiclasses: prev.multiclasses?.map((entry) =>
                        entry.class.id === classId ? { ...entry, subclass } : entry),
                    })}
                />
              )}
              {currentStep === "feats" && (
                <FeatSelectionStep
                  character={characterData}
                  onChange={({ feats, featAbilityChoices }) =>
                    setCharacterData({ ...changeFeats(characterData, feats), featAbilityChoices })
                  }
                />
              )}
              {currentStep === "abilities" && (
                <AbilityScoreStep
                  ruleset={characterData.ruleset}
                  background={characterData.background}
                  scores={characterData.abilityScores}
                  race={characterData.race}
                  feats={characterData.feats}
                  onScoresChange={(abilityScores) =>
                    setCharacterData({ ...characterData, abilityScores })
                  }
                  racialBonusAllocation={characterData.racialBonusAllocation}
                  onRacialBonusChange={(racialBonusAllocation) =>
                    setCharacterData({ ...characterData, racialBonusAllocation })
                  }
                  subrace={characterData.subrace}
                  featAbilityChoices={characterData.featAbilityChoices}
                  method={characterData.abilityScoreMethod}
                  rolledScores={characterData.rolledAbilityScores}
                  assignment={characterData.abilityScoreAssignment}
                  onGenerationChange={updateScoreGeneration}
                />
              )}
              {currentStep === "proficiencies" && (
                <ProficiencyStep
                  ruleset={characterData.ruleset!}
                  character={characterData}
                  onChange={(patch) =>
                    setCharacterData((prev) => ({
                      ...prev,
                      ...(typeof patch === "function" ? patch(prev) : patch),
                    }))
                  }
                />
              )}
              {currentStep === "background" && (
                <BackgroundStep
                  ruleset={characterData.ruleset!}
                  selected={characterData.background}
                  onSelect={(background) => {
                    const previousGranted = new Set((characterData.background?.feats || []).map((feat) => feat.id));
                    const manualFeats = characterData.feats.filter((feat) => !previousGranted.has(feat.id));
                    const feats = [...manualFeats, ...(background.feats || [])].filter(
                      (feat, index, list) => list.findIndex((candidate) => candidate.id === feat.id) === index,
                    );
                    setCharacterData({
                      ...characterData,
                      background,
                      feats,
                      racialBonusAllocation: characterData.ruleset === "2024" ? {} : characterData.racialBonusAllocation,
                      magicInitiateClass: background.originFeatSpellList || undefined,
                      selectedSpells: withoutSpellSource(characterData.selectedSpells, "Feat", "Class"),
                      featSpellcastingAbilities: {
                        ...characterData.featSpellcastingAbilities,
                        ...Object.fromEntries((background.feats || [])
                          .filter((feat) => feat.name.startsWith("Strixhaven Initiate"))
                          .map((feat) => [feat.id, "CHA"])),
                      },
                    });
                  }}
                />
              )}
              {currentStep === "spells" && characterData.class && (
                <SpellSelectionStep
                  originFeatSpellList={characterData.background?.originFeatSpellList}
                  ruleset={characterData.ruleset!}
                  classData={characterData.class}
                  level={characterData.level}
                  selectedSpells={characterData.selectedSpells}
                  race={characterData.race}
                  onSpellsChange={(spells) =>
                    setCharacterData({ ...characterData, selectedSpells: spells })
                  }
                  feats={characterData.feats}
                  subclass={characterData.subclass}
                  subrace={characterData.subrace}
                  background={characterData.background}
                  magicInitiateClass={characterData.magicInitiateClass}
                  onMagicInitiateClassChange={(cls) => setCharacterData({
                    ...characterData,
                    magicInitiateClass: cls,
                    selectedSpells: withoutSpellSource(characterData.selectedSpells, "Magic Initiate"),
                  })}
                  metamagicChoices={characterData.metamagicChoices}
                  onMetamagicChange={(metamagicChoices) => setCharacterData({ ...characterData, metamagicChoices })}
                  classLevel={primaryClassLevel(characterData)}
                  bonusCantrips={chosenFeatureOption(
                    classRulesFor(characterData.class, characterData.ruleset)?.featureChoice,
                    characterData.classFeatureChoices,
                    primaryClassLevel(characterData),
                  )?.bonusCantrip ? 1 : 0}
                  abilityScores={finalAbilityScores(characterData)}
                  featSpellcastingAbilities={characterData.featSpellcastingAbilities}
                  onFeatSpellcastingAbilityChange={(featId, ability) => setCharacterData({
                    ...characterData,
                    featSpellcastingAbilities: { ...characterData.featSpellcastingAbilities, [featId]: ability },
                  })}
                />
              )}
              {currentStep === "spells" && (
                <MulticlassSpells
                  entries={classLevels(characterData).slice(1)}
                  ruleset={characterData.ruleset!}
                  abilityScores={finalAbilityScores(characterData)}
                  selectedSpells={characterData.selectedSpells}
                  onSpellsChange={(spells) => setCharacterData((prev) => ({ ...prev, selectedSpells: spells }))}
                />
              )}
              {currentStep === "hp" && (
                <HitPointsStep
                  finalConScore={finalAbilityScores(characterData).CON}
                  classData={characterData.class}
                  abilityScores={characterData.abilityScores}
                  level={characterData.level}
                  race={characterData.race}
                  subrace={characterData.subrace}
                  feats={characterData.feats}
                  racialBonusAllocation={characterData.racialBonusAllocation}
                  hpRolls={characterData.hpRolls}
                  levelDice={isMulticlassed(characterData) ? levelDice(characterData) : undefined}
                  onHpRollsChange={(rolls) => setCharacterData(prev => ({ ...prev, hpRolls: rolls }))}
                  onMaxHpChange={(val) =>
                    setCharacterData(prev => ({ ...prev, hpMax: val }))
                  }
                />
              )}
              {currentStep === "equipment" && (
                <EquipmentStep
                  ruleset={characterData.ruleset!}
                  equipment={characterData.equipment}
                  classData={characterData.class}
                  race={characterData.race}
                  background={characterData.background}
                  armorProficiencies={characterData.proficiencies?.armor}
                  toolProficiencies={characterData.proficiencies?.tools}
                  weaponProficiencies={characterData.proficiencies?.weapons}
                  choices={characterData.startingEquipment}
                  currency={characterData.currency}
                  lifestyle={characterData.lifestyle}
                  onChange={(patch) => setCharacterData((prev) => ({ ...prev, ...patch }))}
                />
              )}
              {currentStep === "magic-item" && (
                <MagicItemStep
                  ruleset={characterData.ruleset!}
                  magicItems={characterData.magicItems || []}
                  attunedItemIds={characterData.attunedItemIds || []}
                  weaponProficiencies={characterData.proficiencies?.weapons}
                  onMagicItemsChange={(magicItems, attunedItemIds) => setCharacterData({ ...characterData, magicItems, attunedItemIds })}
                  level={characterData.level}
                />
              )}
              {currentStep === "personality" && (
                <div className="space-y-6">
                  <div className="max-w-xl mx-auto space-y-4">
                    <h2 className="text-xl font-bold text-center text-white">Final Details</h2>
                    <div>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-zinc-900 border-2 border-zinc-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-white placeholder-gray-400 shadow-md transition-all hover:border-zinc-500 hover:bg-zinc-800"
                        placeholder="Enter your character's name..."
                        value={characterData.name}
                        onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <PersonalityStep
                    personality={characterData.personality}
                    onPersonalityChange={(personality) =>
                      setCharacterData({ ...characterData, personality })
                    }
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="sticky bottom-0 z-10 bg-black/80 backdrop-blur-sm -mx-8 -mb-8 px-4 md:px-8 py-4 md:py-6 border-t border-brand-900/30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] mt-8">
                {/* Navigation Buttons Row */}
                <div className="flex justify-between items-center gap-3 relative">
                  <button
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-white/10 text-sm md:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    Previous
                  </button>

                  {/* Why Next is held, beside it; a disabled button can't show
                      its own tooltip everywhere, so the wrapper carries it. */}
                  <p
                    id="step-blocker"
                    role="status"
                    className={`flex-1 min-w-0 flex items-center justify-end gap-2 text-right text-xs md:text-sm text-amber-300 ${blocker ? "" : "invisible"}`}
                  >
                    {blocker && <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />}
                    <span className="line-clamp-2">{blocker}</span>
                  </p>

                  <span title={blocker ?? undefined} className="shrink-0">
                    {currentStepIndex === steps.length - 1 ? (
                      <button
                        onClick={completeCharacter}
                        disabled={!canProgress()}
                        aria-describedby={blocker ? "step-blocker" : undefined}
                        className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md border border-green-500/50 text-sm md:text-base"
                      >
                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={nextStep}
                        disabled={!canProgress()}
                        aria-describedby={blocker ? "step-blocker" : undefined}
                        className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md border border-brand-500/50 text-sm md:text-base"
                      >
                        Next
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
      .font-serif {
        font-family: 'Cinzel', serif;
      }
    `}</style>
    </div>
  );
}
