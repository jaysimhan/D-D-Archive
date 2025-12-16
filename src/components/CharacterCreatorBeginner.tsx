import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Race } from "../types/dnd-types";
import { CharacterData, CreationStep } from "../types/character-creator";
import {
  RACES,
  SUBRACES,
  SUBCLASSES as mockSubclasses,
} from "../data/comprehensive-library";
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

export function CharacterCreator() {
  const [currentStep, setCurrentStep] = useState<CreationStep>("name");
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
    }
  });

  // All races including subraces as individual options
  const allRaces = useMemo(() => {
    const raceList: Race[] = [...RACES];
    SUBRACES.forEach(subrace => {
      const parentRace = RACES.find(r => r.id === subrace.parentRaceId);
      if (parentRace) {
        raceList.push({
          ...subrace,
          name: `${subrace.name}`,
          description: subrace.description || parentRace.description,
          id: subrace.id,
          source: subrace.source,
          edition: subrace.edition,
          version: subrace.version,
          abilityScoreIncrease: {
            ...parentRace.abilityScoreIncrease,
            ...subrace.abilityScoreIncrease
          },
          size: parentRace.size,
          speed: parentRace.speed,
          traits: [...parentRace.traits, ...(subrace.traits || [])],
          languages: parentRace.languages,
          racialSpellChoices: subrace.racialSpellChoices || parentRace.racialSpellChoices,
        } as Race);
      }
    });
    // Deduplicate races by name
    const seenNames = new Set<string>();
    const uniqueRaces: Race[] = [];

    for (const r of raceList) {
      // Filter out races without Ability Score Increases
      const hasASI = r.abilityScoreIncrease && Object.values(r.abilityScoreIncrease).some(v => v !== 0);
      if (!hasASI) continue;

      if (r.id === "tortle" || r.id === "satyr") {
        if (!seenNames.has(r.name)) {
          seenNames.add(r.name);
          uniqueRaces.push(r);
        }
      } else {
        // Default checking for name duplicates for all races
        if (!seenNames.has(r.name)) {
          seenNames.add(r.name);
          uniqueRaces.push(r);
        }
      }
    }

    return uniqueRaces;
  }, []);

  // Fetch subclasses here for the check
  const { data: sanitySubclasses } = useSubclasses();

  const allSubclasses = useMemo(() => {
    const sanity = sanitySubclasses || [];
    const mock = mockSubclasses || [];
    const sanityIds = new Set(sanity.map(s => s.id));
    return [...sanity, ...mock.filter(s => !sanityIds.has(s.id))];
  }, [sanitySubclasses]);

  const steps: CreationStep[] = useMemo(() => {
    const baseSteps: CreationStep[] = ["name", "race", "class"];

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

    baseSteps.push("feats"); // Feats Moved BEFORE abilities
    baseSteps.push("abilities");
    baseSteps.push("proficiencies"); // Added Proficiencies
    baseSteps.push("background");

    // Check for spell-granting feats
    const spellFeats = ["Magic Initiate", "Aberrant Dragonmark", "Fey Touched", "Shadow Touched", "Telekinetic"];
    const hasSpellFeat = characterData.feats.some(f => spellFeats.some(sf => f.name.includes(sf)));

    // Check for racial spell choices or known spells
    const hasRacialSpells = (characterData.race?.racialSpellChoices && characterData.race.racialSpellChoices.length > 0) ||
      (characterData.subrace?.racialSpellChoices && characterData.subrace.racialSpellChoices.length > 0) ||
      (characterData.race?.racialKnownSpells && characterData.race.racialKnownSpells.length > 0) ||
      (characterData.subrace?.racialKnownSpells && characterData.subrace.racialKnownSpells.length > 0);

    if (characterData.class?.spellcaster || characterData.subclass?.spellcaster || hasSpellFeat || hasRacialSpells) {
      baseSteps.push("spells");
    }

    baseSteps.push("equipment", "personality");

    return baseSteps;
  }, [characterData.class, characterData.level, characterData.feats, characterData.race, characterData.subrace, allSubclasses]);

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
      case "name":
        return characterData.name.trim().length > 0;
      case "race":
        return !!characterData.race;
      case "class":
        return !!characterData.class;
      case "subclass":
        return !!characterData.subclass;
      case "abilities":
        return true;
      case "background":
        return !!characterData.background;
      case "spells":
        return characterData.selectedSpells.length > 0;
      case "feats":
        return true;
      case "proficiencies":
        return true;
      case "equipment":
        return true;
      case "personality":
        return true;
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
            {currentStep === "name" && <NameStep characterData={characterData} setCharacterData={setCharacterData} />}
            {currentStep === "race" && (
              <RaceStep
                race={characterData.race}
                subrace={characterData.subrace}
                onChange={(race, subrace) =>
                  setCharacterData({ ...characterData, race, subrace })
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
                subrace={characterData.subrace}
                feats={characterData.feats}
                onScoresChange={(abilityScores) =>
                  setCharacterData({ ...characterData, abilityScores })
                }
              />
            )}
            {currentStep === "proficiencies" && (
              <ProficiencyStep
                proficiencies={characterData.proficiencies || { skills: [], languages: ["Common"], tools: [], armor: [], weapons: [] }}
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
            {currentStep === "spells" && (
              !!characterData.class?.spellcaster ||
              !!characterData.subclass?.spellcaster ||
              characterData.feats.some(f => f.name.includes("Magic Initiate") || f.name.includes("Aberrant Dragonmark")) ||
              (characterData.race?.racialSpellChoices && characterData.race.racialSpellChoices.length > 0) ||
              (characterData.subrace?.racialSpellChoices && characterData.subrace.racialSpellChoices.length > 0) ||
              (characterData.race?.racialKnownSpells && characterData.race.racialKnownSpells.length > 0) ||
              (characterData.subrace?.racialKnownSpells && characterData.subrace.racialKnownSpells.length > 0)
            ) && (
                <SpellSelectionStep
                  classData={characterData.class!}
                  level={characterData.level}
                  selectedSpells={characterData.selectedSpells}
                  race={characterData.race}
                  subrace={characterData.subrace}
                  onSpellsChange={(spells) =>
                    setCharacterData({ ...characterData, selectedSpells: spells })
                  }
                  feats={characterData.feats}
                  subclass={characterData.subclass}
                  magicInitiateClass={characterData.magicInitiateClass}
                  onMagicInitiateClassChange={(cls) => setCharacterData({ ...characterData, magicInitiateClass: cls })}
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
              <PersonalityStep
                personality={characterData.personality}
                onPersonalityChange={(personality) =>
                  setCharacterData({ ...characterData, personality })
                }
              />
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
