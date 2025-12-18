import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
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
      const subclassLevel = characterData.class.id === "cleric" ||
        characterData.class.id === "sorcerer" ||
        characterData.class.id === "warlock" ? 1 :
        characterData.class.id === "wizard" ? 2 : 3;

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
    baseSteps.push("spells");

    // New Steps
    baseSteps.push("hp"); // We need to add 'hp' to CreationStep type or use a loose string for now, but better to update type. 
    // Wait, I can't update type easily in this call. I will cast or hope TS ignores if I don't update type file? 
    // No, I should update type file first or use "equipment" as next known.
    // I will add "hp" to the types/character-creator.ts file in a separate call.
    // For now let's assume I will do that.
    baseSteps.push("equipment");
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
      case "hp": // New
        return true;
      case "equipment":
        return true;
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-gray-900 text-3xl mb-1">Beginner Character Creator</h1>
          <p className="text-gray-600">Create your first D&D character (Levels 1-3)</p>
        </div>
      </div>

      {/* Top Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-gray-700 font-medium capitalize ml-2">{currentStep.replace("-", " ")}</span>
          </div>

          <div className="flex items-center gap-4">
            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={completeCharacter}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Check className="w-4 h-4" />
                Complete
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProgress()}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm"
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
        <div className="bg-white rounded-xl shadow-lg border">
          <div className="p-4 md:p-8">
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
            {currentStep === "personality" && (
              <div className="space-y-6">
                <div className="max-w-xl mx-auto space-y-4">
                  <h2 className="text-xl font-bold text-center">Final Details</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Character Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter character name..."
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
            <div className="sticky bottom-0 z-10 bg-white -mx-8 -mb-8 px-8 py-6 border-t shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStepIndex === steps.length - 1 ? (
                <button
                  onClick={completeCharacter}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
                >
                  <Check className="w-5 h-5" />
                  Complete Character
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProgress()}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
