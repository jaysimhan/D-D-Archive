import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { CharacterData, CreationStep } from "../types/character-creator";

import { CharacterSheet } from "./CharacterSheet";
import { useSubclasses } from "../hooks/useSanityData";

// Import Step Components
import { NameStep } from "./character-creator/NameStep";
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
  const [currentStep, setCurrentStep] = useState<CreationStep>("race");
  const [isComplete, setIsComplete] = useState(false);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: "",
    level: 1,
    abilityScores: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    selectedSpells: [],
    feats: [],
    equipment: [],
    magicItems: [],
    magicInitiateClass: undefined,
    personality: {},
    proficiencies: {
      skills: [],
      languages: ["Common"],
      tools: [],
      armor: [],
      weapons: []
    },
    racialBonusAllocation: {}
  });


  // Fetch subclasses here for the check
  const { data: sanitySubclasses } = useSubclasses();

  const allSubclasses = useMemo(() => {
    return sanitySubclasses || [];
  }, [sanitySubclasses]);

  const steps: CreationStep[] = useMemo(() => {
    const baseSteps: CreationStep[] = ["race", "class"];

    // Add subclass step if character level requires it
    if (characterData.class) {
      const subclassLevel = characterData.class.subclassLevel || 3;

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

    if (isClassCaster || isRaceCaster || isSubclassCaster) {
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
  }, [characterData.class, characterData.level, characterData.feats, characterData.race, allSubclasses]);

  const currentStepIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const canProgress = (): boolean => {
    switch (currentStep) {
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

  const completeCharacter = () => {
    setIsComplete(true);
  };

  const getSheetData = (): any => {
    // Map skills from object array to string array
    const skillNames = characterData.proficiencies?.skills
      .filter(s => s.proficient)
      .map(s => s.name) || [];

    const expertiseNames = characterData.proficiencies?.skills
      .filter(s => s.expertise)
      .map(s => s.name) || [];

    // Map personality to details
    const details = {
      personalityTraits: characterData.personality?.traits,
      ideals: characterData.personality?.ideals,
      bonds: characterData.personality?.bonds,
      flaws: characterData.personality?.flaws,
    };

    return {
      ...characterData,
      proficiencies: {
        skills: skillNames,
        tools: characterData.proficiencies?.tools || [],
        languages: characterData.proficiencies?.languages || [],
      },
      expertise: expertiseNames,
      details: details,
    };
  };

  if (isComplete) {
    return (
      <CharacterSheet
        character={getSheetData()}
        onEdit={() => setIsComplete(false)}
      />
    );
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
              <div className="flex items-center gap-3">
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

              {currentStep === "race" && (
                <RaceStep
                  race={characterData.race}
                  onChange={(race) =>
                    setCharacterData({ ...characterData, race })
                  }
                />
              )}
              {currentStep === "class" && (
                <ClassStep
                  selected={characterData.class}
                  level={characterData.level}
                  onSelect={(classData) =>
                    setCharacterData({ ...characterData, class: classData, subclass: undefined })
                  }
                  onLevelChange={(level) => setCharacterData({ ...characterData, level })}
                />
              )}
              {currentStep === "subclass" && characterData.class && (
                <SubclassStep
                  classData={characterData.class}
                  selectedSubclass={characterData.subclass}
                  level={characterData.level}
                  onSelect={(subclass) => setCharacterData({ ...characterData, subclass })}
                />
              )}
              {currentStep === "feats" && (
                <FeatSelectionStep
                  selectedFeats={characterData.feats}
                  onFeatsChange={(feats) => setCharacterData({ ...characterData, feats })}
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
                />
              )}
              {currentStep === "proficiencies" && (
                <ProficiencyStep
                  proficiencies={characterData.proficiencies || { skills: [], languages: ["Common"], tools: [], armor: [], weapons: [] }}
                  race={characterData.race}
                  classData={characterData.class}
                  subclass={characterData.subclass}
                  background={characterData.background}
                  feats={characterData.feats}
                  abilityScores={characterData.abilityScores}
                  subrace={characterData.subrace}
                  racialBonusAllocation={characterData.racialBonusAllocation}
                  onProficienciesChange={(proficiencies: any) =>
                    setCharacterData({ ...characterData, proficiencies })
                  }
                />
              )}
              {currentStep === "background" && (
                <BackgroundStep
                  selected={characterData.background}
                  onSelect={(background) => setCharacterData({ ...characterData, background })}
                />
              )}
              {currentStep === "spells" && characterData.class && (
                <SpellSelectionStep
                  classData={characterData.class}
                  level={characterData.level}
                  selectedSpells={characterData.selectedSpells}
                  race={characterData.race}
                  onSpellsChange={(spells) =>
                    setCharacterData({ ...characterData, selectedSpells: spells })
                  }
                  feats={characterData.feats}
                  subclass={characterData.subclass}
                  magicInitiateClass={characterData.magicInitiateClass}
                  onMagicInitiateClassChange={(cls) => setCharacterData({ ...characterData, magicInitiateClass: cls })}
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
                  equipment={characterData.equipment}
                  classData={characterData.class}
                  onEquipmentChange={(equipment) => setCharacterData({ ...characterData, equipment })}
                />
              )}
              {currentStep === "magic-item" && (
                <MagicItemStep
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
