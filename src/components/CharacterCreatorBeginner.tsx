import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Check, Crown, Loader2, RotateCcw } from "lucide-react";
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
import { metamagicChoiceLimit } from "../utils/combat-progression";
import { pruneFeatAbilityChoices, trimFeatsToBudget } from "../utils/feats";
import { finalAbilityScores } from "../utils/ability-scores";

// Import Step Components
import { NameStep } from "./character-creator/NameStep";
import { RulesetStep } from "./character-creator/RulesetStep";
import { RaceStep } from "./character-creator/RaceStep";
import { ClassStep } from "./character-creator/ClassStep";
import { SubclassStep } from "./character-creator/SubclassStep";
import { AbilityScoreStep } from "./character-creator/AbilityScoreStep";
import { BackgroundStep } from "./character-creator/BackgroundStep";
import { SpellSelectionStep } from "./character-creator/SpellSelectionStep";
import { EquipmentStep } from "./character-creator/EquipmentStep";
import { PersonalityStep } from "./character-creator/PersonalityStep";
import { FeatSelectionStep } from "./character-creator/FeatSelectionStep";
import { ProficiencyStep } from "./character-creator/ProficiencyStep";
import { HitPointsStep } from "./character-creator/HitPointsStep";
import { MagicItemStep } from "./character-creator/MagicItemStep";

export function CharacterCreator() {
  const navigate = useNavigate();
  const { step: stepParam } = useParams<{ step: string }>();
  // The draft is read straight into initial state: localStorage is synchronous,
  // so the very first render already knows which steps this character has
  // earned and no step ever mounts against an empty character.
  const [characterData, setCharacterData] = useState<CharacterData>(
    () => loadDraft()?.character ?? createEmptyCharacter(),
  );

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

  const steps: CreationStep[] = useMemo(() => {
    const baseSteps: CreationStep[] = ["ruleset", "race", "class"];

    // Add subclass step if character level requires it
    if (characterData.class) {
      const subclassLevel = subclassLevelFor(characterData.class, characterData.ruleset);

      // Check if there are any subclasses available for this class
      const hasSubclasses = allSubclasses.some(s => s.parentClassId === characterData.class?.id);

      if (characterData.level >= subclassLevel && hasSubclasses) {
        baseSteps.push("subclass");
      }
    }

    baseSteps.push("background");
    baseSteps.push("feats");
    baseSteps.push("abilities");
    baseSteps.push("proficiencies");

    // Add spells step if class is spellcaster OR race is spellcaster OR subclass is spellcaster
    const isClassCaster = characterData.class?.isSpellcaster === true || (characterData.class?.spellcaster && characterData.class.spellcaster !== 'none' && characterData.class.spellcaster !== 'None');
    const isRaceCaster = characterData.race?.isSpellcaster === true;
    const isSubclassCaster = characterData.subclass?.isSpellcaster === true || characterData.subclass?.spellcaster === true;
    const hasFeatSpells = characterData.feats.some((feat) =>
      (feat.spells?.length ?? 0) > 0 ||
      feat.grants?.some((grant) => grant.grantType === "Specific Spell" || grant.grantType === "Spell Slot"),
    );

    if (isClassCaster || isRaceCaster || isSubclassCaster || hasFeatSpells) {
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
    characterData.subclass,
    allSubclasses,
  ]);

  const canLeaveStep = (step: CreationStep | undefined): boolean => {
    switch (step) {
      case "ruleset":
        return characterData.ruleset === "2014" || characterData.ruleset === "2024";
      case "race":
        return !!characterData.race;
      case "class":
        return !!characterData.class;
      case "subclass":
        return !!characterData.subclass;
      case "background":
        return !!characterData.background;
      case "feats":
        return true;
      case "abilities":
        return true;
      case "proficiencies":
        return true;
      case "spells":
        return true;
      case "hp":
        return true;
      case "equipment":
        return true;
      case "magic-item":
        return true; // Optional? Or mandatory if step exists? Usually optional or they pick one.
      case "personality": // Character Details - Check Name
        return characterData.name.trim().length > 0;
      default:
        return false;
    }
  };

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

  const canProgress = () => canLeaveStep(currentStep);

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
                  <p className="text-brand-400/60 text-sm">Create your D&D character (Levels 1-3)</p>
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
              <span className="text-brand-400 font-medium capitalize ml-2">{currentStep.replace("-", " ")}</span>
            </div>

            <div className="flex items-center gap-4">
              {currentStepIndex === steps.length - 1 ? (
                <button
                  onClick={completeCharacter}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors text-sm font-medium shadow-sm border border-green-500/50"
                >
                  <Check className="w-4 h-4" />
                  Complete
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProgress()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm border border-brand-500/50"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
          <div className="bg-black/40 backdrop-blur-sm rounded-xl shadow-lg border border-brand-900/30">
            <div className="p-4 md:p-8 min-h-[600px]">
              {/* Step Content */}

              {currentStep === "ruleset" && (
                <RulesetStep
                  selected={characterData.ruleset}
                  onSelect={selectRuleset}
                />
              )}

              {currentStep === "race" && (
                <RaceStep
                  ruleset={characterData.ruleset!}
                  race={characterData.race}
                  onChange={(race) => {
                    // Only Humans get the second level-1 feat, so moving away
                    // from Human takes that slot — and its feat — back.
                    const feats = trimFeatsToBudget(characterData.feats, characterData.level, race);
                    setCharacterData({
                      ...characterData,
                      race,
                      subrace: undefined,
                      feats,
                      featAbilityChoices: pruneFeatAbilityChoices(feats, characterData.featAbilityChoices),
                      selectedSpells: withoutSpellSource(characterData.selectedSpells, "Racial"),
                    });
                  }}
                />
              )}
              {currentStep === "class" && (
                <ClassStep
                  ruleset={characterData.ruleset!}
                  selected={characterData.class}
                  level={characterData.level}
                  onSelect={(classData) =>
                    setCharacterData({
                      ...characterData,
                      class: classData,
                      subclass: undefined,
                      selectedSpells: withoutSpellSource(characterData.selectedSpells, "Class", "Subclass"),
                    })
                  }
                  onLevelChange={(level) => {
                    // Levelling down hands feat slots back, so anything that no
                    // longer fits goes — along with the ability points it placed.
                    const feats = trimFeatsToBudget(
                      characterData.feats,
                      level,
                      characterData.race,
                      characterData.subrace,
                    );
                    setCharacterData({
                      ...characterData,
                      level,
                      feats,
                      featAbilityChoices: pruneFeatAbilityChoices(feats, characterData.featAbilityChoices),
                      subclass: characterData.class && level >= subclassLevelFor(characterData.class, characterData.ruleset)
                        ? characterData.subclass
                        : undefined,
                      selectedSpells: withoutSpellSource(characterData.selectedSpells, "Class", "Subclass"),
                    });
                  }}
                />
              )}
              {currentStep === "subclass" && characterData.class && (
                <SubclassStep
                  ruleset={characterData.ruleset!}
                  classData={characterData.class}
                  selectedSubclass={characterData.subclass}
                  level={characterData.level}
                  onSelect={(subclass) => setCharacterData({
                    ...characterData,
                    subclass,
                    selectedSpells: withoutSpellSource(characterData.selectedSpells, "Subclass"),
                  })}
                />
              )}
              {currentStep === "feats" && (
                <FeatSelectionStep
                  ruleset={characterData.ruleset!}
                  selectedFeats={characterData.feats}
                  lockedFeatIds={(characterData.background?.feats || []).map((feat) => feat.id)}
                  classData={characterData.class}
                  subclass={characterData.subclass}
                  level={characterData.level}
                  race={characterData.race}
                  subrace={characterData.subrace}
                  abilityScores={finalAbilityScores(characterData)}
                  onFeatsChange={(feats) => setCharacterData({
                    ...characterData,
                    feats,
                    metamagicChoices: (characterData.metamagicChoices || []).slice(
                      0,
                      metamagicChoiceLimit(characterData.class?.id ?? "", characterData.level, feats),
                    ),
                    // A dropped feat takes its ability increase with it.
                    featAbilityChoices: pruneFeatAbilityChoices(feats, characterData.featAbilityChoices),
                    selectedSpells: withoutSpellSource(
                      characterData.selectedSpells,
                      "Feat",
                      "Magic Initiate",
                      "Aberrant Dragonmark",
                    ),
                  })}
                />
              )}
              {currentStep === "abilities" && (
                <AbilityScoreStep
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
                  onFeatAbilityChoicesChange={(featAbilityChoices) =>
                    setCharacterData({ ...characterData, featAbilityChoices })
                  }
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
                  featSpellcastingAbilities={characterData.featSpellcastingAbilities}
                  onFeatSpellcastingAbilityChange={(featId, ability) => setCharacterData({
                    ...characterData,
                    featSpellcastingAbilities: { ...characterData.featSpellcastingAbilities, [featId]: ability },
                  })}
                />
              )}
              {currentStep === "hp" && (
                <HitPointsStep
                  classData={characterData.class}
                  abilityScores={characterData.abilityScores}
                  level={characterData.level}
                  race={characterData.race}
                  subrace={characterData.subrace}
                  feats={characterData.feats}
                  racialBonusAllocation={characterData.racialBonusAllocation}
                  hpRolls={characterData.hpRolls}
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
                  armorProficiencies={characterData.proficiencies?.armor}
                  onEquipmentChange={(equipment) => setCharacterData({ ...characterData, equipment })}
                />
              )}
              {currentStep === "magic-item" && (
                <MagicItemStep
                  ruleset={characterData.ruleset!}
                  magicItem={characterData.magicItems || []}
                  onMagicItemChange={(items) => setCharacterData({ ...characterData, magicItems: items })}
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
                <div className="flex justify-between items-center relative">
                  <button
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-white/10 text-sm md:text-base"
                  >
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                    Previous
                  </button>

                  {currentStepIndex === steps.length - 1 ? (
                    <button
                      onClick={completeCharacter}
                      className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium shadow-md border border-green-500/50 text-sm md:text-base"
                    >
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                      Complete
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      disabled={!canProgress()}
                      className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-lg hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md border border-brand-500/50 text-sm md:text-base"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
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
