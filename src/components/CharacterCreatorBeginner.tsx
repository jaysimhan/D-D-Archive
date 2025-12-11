import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, User, Search, Sparkles, Plus, Loader2 } from "lucide-react";
import { Race, Class, Background, Spell, Item, AbilityScores, Subclass, Feat, Subrace } from "../types/dnd-types";
import { RACES } from "../data/comprehensive-library";
import { SUBRACES, BACKGROUNDS, FEATS } from "../data/comprehensive-library";
import { combinedClasses } from "../data/mock-classes";
import { mockSubclasses } from "../data/mock-subclasses";
import { mockBackgrounds } from "../data/mock-backgrounds";
import { expandedSpells } from "../data/expanded-spells";
import { mockItems } from "../data/mock-items";
import { CharacterSheet } from "./CharacterSheet";
import { urlFor } from "../lib/sanity";
import { useClasses, useRaces, useSubclasses, useBackgrounds } from "../hooks/useSanityData";

type CreationStep =
  | "name"
  | "race"
  | "class"
  | "subclass"
  | "abilities"
  | "background"
  | "spells"
  | "feats"
  | "equipment"
  | "personality";

interface CharacterData {
  name: string;
  race?: Race;
  subrace?: Subrace;
  class?: Class;
  subclass?: Subclass;
  level: number;
  background?: Background;
  abilityScores: AbilityScores;
  selectedSpells: Spell[];
  feats: Feat[];
  equipment: Item[];
  magicInitiateClass?: string;
  personality: {
    traits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;
  };
}

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

  const steps: CreationStep[] = useMemo(() => {
    const baseSteps: CreationStep[] = ["name", "race", "class"];

    // Add subclass step if character level requires it
    if (characterData.class) {
      const subclassLevel = characterData.class.id === "cleric" ||
        characterData.class.id === "sorcerer" ||
        characterData.class.id === "warlock" ? 1 :
        characterData.class.id === "wizard" ? 2 : 3;

      // Check if there are any subclasses available for this class
      const hasSubclasses = mockSubclasses.some(s => s.parentClassId === characterData.class?.id);

      if (characterData.level >= subclassLevel && hasSubclasses) {
        baseSteps.push("subclass");
      }
    }

    baseSteps.push("abilities", "background");

    // Check for spell-granting feats
    const spellFeats = ["Magic Initiate", "Aberrant Dragonmark", "Fey Touched", "Shadow Touched", "Telekinetic"];
    const hasSpellFeat = characterData.feats.some(f => spellFeats.some(sf => f.name.includes(sf)));

    // Check for racial spell choices or known spells
    const hasRacialSpells = (characterData.race?.racialSpellChoices && characterData.race.racialSpellChoices.length > 0) ||
      (characterData.subrace?.racialSpellChoices && characterData.subrace.racialSpellChoices.length > 0) ||
      (characterData.race?.racialKnownSpells && characterData.race.racialKnownSpells.length > 0) ||
      (characterData.subrace?.racialKnownSpells && characterData.subrace.racialKnownSpells.length > 0);

    if (characterData.class?.spellcaster || hasSpellFeat || hasRacialSpells) {
      if (characterData.class?.spellcaster || characterData.subclass?.spellcaster) {
        baseSteps.push("spells");
      } else {
        baseSteps.push("feats");
      }
    } else {
      baseSteps.push("feats");
    }

    baseSteps.push("equipment", "personality");

    return baseSteps;
  }, [characterData.class, characterData.level, characterData.feats, characterData.race, characterData.subrace]);

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
        return true; // Feats are optional or determined by race/level, allowing skip if none selected is usually fine? Or enforcement? User just said "add a section". I'll default to allowing progress.
      case "equipment":
        return true; // Skippable as requested
      case "personality":
        return true;
      default:
        return false;
    }
  };

  const completeCharacter = () => {
    setIsComplete(true);
  };

  const editCharacter = () => {
    setIsComplete(false);
    setCurrentStep("name");
  };

  if (isComplete) {
    return <CharacterSheet character={characterData} onEdit={editCharacter} />;
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

      {/* Progress Tracker */}
      {/* Progress Tracker Removed as per request */}

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
            {currentStep === "abilities" && (
              <AbilityScoreStep
                scores={characterData.abilityScores}
                race={characterData.race}
                onScoresChange={(abilityScores) =>
                  setCharacterData({ ...characterData, abilityScores })
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
            {currentStep === "feats" && (
              <FeatSelectionStep
                selectedFeats={characterData.feats}
                onFeatsChange={(feats) => setCharacterData({ ...characterData, feats })}
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

// Name Step Component
function NameStep({
  characterData,
  setCharacterData,
}: {
  characterData: CharacterData;
  setCharacterData: (data: CharacterData) => void;
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <User className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Name Your Character</h2>
        <p className="text-gray-600">Choose a memorable name for your hero</p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-gray-700 font-medium mb-3">
          Character Name
        </label>
        <input
          type="text"
          value={characterData.name}
          onChange={(e) =>
            setCharacterData({ ...characterData, name: e.target.value })
          }
          placeholder="e.g., Aragorn, Gandalf, Legolas..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          autoFocus
        />
      </div>
    </div>
  );
}



// Class Step with Search - Limited to Level 1-3
function ClassStep({
  selected,
  level,
  onSelect,
  onLevelChange,
}: {
  selected?: Class;
  level: number;
  onSelect: (classData: Class) => void;
  onLevelChange: (level: number) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch classes from Sanity, fall back to mock data
  const { data: sanityClasses, loading: classesLoading } = useClasses();
  const allClasses = sanityClasses && sanityClasses.length > 0 ? sanityClasses : combinedClasses;

  const filteredClasses = useMemo(() => {
    return allClasses.filter((classData) =>
      classData.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allClasses]);

  // Use the class from allClasses to ensure we have Sanity image data
  const displayedClass = selected ? allClasses.find(c => c.id === selected.id) || selected : undefined;

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your Class</h2>
        <p className="text-gray-600">Select your character's profession and level (1-3)</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
        {/* Left Column: Grid */}
        <div className="flex-1 w-full">
          {/* Level Selector */}
          <div className="mb-6 max-w-xs">
            <label className="block text-gray-700 font-medium mb-2">
              Character Level (Beginner: 1-3)
            </label>
            <input
              type="number"
              min="1"
              max="3"
              value={level}
              onChange={(e) => onLevelChange(Math.max(1, Math.min(3, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg font-semibold"
            />
            <p className="text-xs text-gray-500 mt-1">Limited to levels 1-3 for beginner characters</p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search classes..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {classesLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="px-2 py-3 rounded-lg bg-gray-100 animate-pulse h-24 flex flex-col items-center justify-center gap-2">
                  <div className="h-5 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-14 bg-gray-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredClasses.map((classData) => {
                const isActive = selected?.id === classData.id;
                return (
                  <button
                    key={classData.id}
                    onClick={() => onSelect(classData)}
                    className={`
                    px-2 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center justify-center text-center h-24
                    ${isActive
                        ? 'bg-indigo-600 text-white shadow-md ring-1 ring-offset-1 ring-indigo-600'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                      }
                  `}
                  >
                    <span className="font-bold text-lg mb-1">{classData.name}</span>
                    {classData.spellcaster && (
                      <span className={`text-[10px] px-2 py-1 rounded-full ${isActive ? 'bg-indigo-500 text-white' : 'bg-purple-100 text-purple-700'}`}>
                        {classData.spellcaster}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Details Panel */}
        <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
          {selected ? (
            <div className="animate-in fade-in duration-200">
              {/* Image Section */}
              <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                {displayedClass?.image ? (
                  <img
                    src={urlFor(displayedClass.image)?.width(400).height(300).url() || ''}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <div className="text-center p-4">
                      <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <span className="text-xs text-gray-400">Class Icon</span>
                    </div>
                    <img
                      src={`/images/classes/${selected.id}.jpg`}
                      alt={selected.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-indigo-700 font-serif">{selected.name}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                  Hit Die: d{selected.hitDie}
                </span>
                {selected.spellcaster && (
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    {selected.spellcaster} Caster
                  </span>
                )}
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {selected.edition}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6 text-sm">{selected.description}</p>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Primary Ability</h4>
                  <p className="text-sm text-gray-600">{selected.primaryAbility.join(" or ")}</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Saving Throws</h4>
                  <p className="text-sm text-gray-600">{selected.savingThrows.join(", ")}</p>
                </div>
              </div>

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

// Subclass Step
function SubclassStep({
  classData,
  selectedSubclass,
  level,
  onSelect,
}: {
  classData: Class;
  selectedSubclass?: Subclass;
  level: number;
  onSelect: (subclass: Subclass) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch subclasses from Sanity, fall back to mock data
  const { data: sanitySubclasses, loading: subclassesLoading } = useSubclasses();

  const subclassLevel = classData.id === "cleric" ||
    classData.id === "sorcerer" ||
    classData.id === "warlock" ? 1 :
    classData.id === "wizard" ? 2 : 3;

  const availableSubclasses = useMemo(() => {
    const allSubclasses = sanitySubclasses && sanitySubclasses.length > 0 ? sanitySubclasses : mockSubclasses;
    return allSubclasses.filter((sc) => sc.parentClassId === classData.id);
  }, [classData.id, sanitySubclasses]);

  const filteredSubclasses = useMemo(() => {
    return availableSubclasses.filter((subclass) =>
      subclass.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableSubclasses, searchTerm]);

  // Use the subclass from availableSubclasses to ensure we have Sanity image data
  const displayedSubclass = selectedSubclass ? availableSubclasses.find(sc => sc.id === selectedSubclass.id) || selectedSubclass : undefined;

  if (level < subclassLevel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-2">
          Subclass selection unlocks at level {subclassLevel}
        </p>
        <p className="text-sm text-gray-500">
          Increase your character level to {subclassLevel} or higher to choose a subclass
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
      {/* Left Column: Grid */}
      <div className="flex-1 w-full">
        <div className="text-center lg:text-left mb-6">
          <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your {classData.name} Subclass</h2>
          <p className="text-gray-600">Specialize your character's abilities</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subclasses..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {subclassesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 border-2 border-gray-200 rounded-lg animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredSubclasses.map((subclass) => (
              <button
                key={subclass.id}
                onClick={() => onSelect(subclass)}
                className={`text-left p-4 border-2 rounded-lg transition-all ${selectedSubclass?.id === subclass.id
                  ? "border-indigo-600 bg-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
              >
                <h3 className="text-gray-900 font-semibold text-lg mb-1">{subclass.name}</h3>
                {subclass.edition && (
                  <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-700 rounded inline-block mb-2">
                    {subclass.edition}
                  </span>
                )}
                <p className="text-sm text-gray-600 line-clamp-2">{subclass.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Details Panel */}
      <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
        {selectedSubclass ? (
          <div className="animate-in fade-in duration-200">
            {/* Image Section */}
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
              {displayedSubclass?.image ? (
                <img
                  src={urlFor(displayedSubclass.image)?.width(400).height(300).url() || ''}
                  alt={selectedSubclass.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="text-center p-4">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <span className="text-xs text-gray-400">Subclass Icon</span>
                  </div>
                  <img
                    src={`/images/subclasses/${selectedSubclass.id}.jpg`}
                    alt={selectedSubclass.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-indigo-700 font-serif">{selectedSubclass.name}</h3>

            <p className="text-gray-700 leading-relaxed mb-6 text-sm">{selectedSubclass.description}</p>

            <div className="text-sm text-gray-500">
              <strong className="text-gray-900 block mb-2">Features:</strong>
              <ul className="space-y-3">
                {selectedSubclass.features.map((feature, idx) => (
                  <li key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <span className="font-semibold text-indigo-700 block mb-1">Level {feature.level}: {feature.name}</span>
                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            <p>Select a subclass to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Race Selection Step
function RaceStep({
  race,
  subrace,
  onChange,
}: {
  race?: Race;
  subrace?: Subrace;
  onChange: (race: Race, subrace?: Subrace) => void;
}) {
  const [showNonCore, setShowNonCore] = useState(true); // Default to true now to show expansions
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch races from Sanity
  const { data: sanityRaces, loading: racesLoading } = useRaces();
  const useSanityData = sanityRaces && sanityRaces.length > 0;

  // Flatten races and subraces logic (for local data only)
  const displayRaces = useMemo(() => {
    // If we have Sanity data, use it directly
    if (useSanityData) {
      let all = [...sanityRaces];

      // Filter by search term
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        all = all.filter(r => r.name.toLowerCase().includes(lower));
      }

      // Filter non-core if needed
      if (!showNonCore) {
        all = all.filter(r => r.source === "Player's Handbook" || r.source === "Official");
      }

      return all.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Fallback to local data with synthetic subrace logic
    const flattened: Race[] = [];

    // Helper to check if a race has specific flattened variants coming up
    const hasVariants = (id: string) => ["dwarf", "elf", "halfling", "gnome", "human"].includes(id);

    RACES.forEach(r => {
      // If it's a "Core" race that has explicit subraces in the UI (Hill/Mountain), hide the base?
      if (r.id === "dwarf") return;
      if (r.id === "elf") return;
      if (r.id === "halfling") return;
      if (r.id === "gnome") return;
      if (r.id === "human") return;

      flattened.push(r);
    });

    // Now inject Subraces as "Races"
    const subraceCards = SUBRACES.map(s => {
      // Find parent base stats
      const parent = RACES.find(r => r.id === s.parentRaceId);
      if (!parent) return null;

      // Create a synthetic Race object
      return {
        ...parent,
        id: s.id, // e.g. "hill-dwarf"
        name: s.name,
        description: s.description,
        abilityScoreIncrease: { ...parent.abilityScoreIncrease, ...s.abilityScoreIncrease },
        traits: [...parent.traits, ...s.traits],
        isSubrace: true, // Marker
        parentRaceId: s.parentRaceId
      } as Race & { isSubrace?: boolean, parentRaceId?: string };
    }).filter(Boolean) as Race[];

    // Add Human back explicitly if not treated as subrace
    const human = RACES.find(r => r.id === "human");
    if (human) flattened.push(human);

    // Merge
    let all = [...flattened, ...subraceCards];

    // Filter by search term
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      all = all.filter(r => r.name.toLowerCase().includes(lower));
    }

    // Sort? 
    // Filter non-core
    if (!showNonCore) {
      const coreIds = [
        "hill-dwarf", "mountain-dwarf", "high-elf", "wood-elf", "drow",
        "lightfoot-halfling", "stout-halfling", "human", "human-feat",
        "dragonborn", "tiefling", "half-orc", "half-elf", "gnome-forest", "gnome-rock"
      ];
      all = all.filter(r => coreIds.includes(r.id) || r.source === "Player's Handbook" || r.source === "Official");
    }

    return all.sort((a, b) => a.name.localeCompare(b.name));
  }, [showNonCore, searchTerm, useSanityData, sanityRaces]);

  // Use the race from displayRaces to ensure we have Sanity image data
  const displayedRace = race ? displayRaces.find(r => r.id === race.id) || race : undefined;

  const handleRaceClick = (r: Race) => {
    // If using Sanity data, just pass the race directly
    if (useSanityData) {
      onChange(r, undefined);
      return;
    }

    // Check if it's a subrace wrapper (for local data only)
    const isSynthetic = (r as any).isSubrace;
    if (isSynthetic) {
      const parent = RACES.find(p => p.id === (r as any).parentRaceId);
      const realSubrace = SUBRACES.find(s => s.id === r.id);
      if (parent && realSubrace) {
        onChange(parent, realSubrace);
        return;
      }
    }

    // Normal race
    onChange(r, undefined);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[600px]">
      {/* Left Column: Grid */}
      <div className="flex-1 w-full">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Race <span className="text-base font-normal text-gray-500 ml-2">Choose the character Race.</span></h2>

            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={showNonCore} onChange={e => setShowNonCore(e.target.checked)} />
                <div className={`block w-10 h-6 rounded-full transition-colors ${showNonCore ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showNonCore ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 text-sm font-medium text-gray-700">Enable non-core</div>
            </label>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search races..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {racesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="px-4 py-3 rounded bg-gray-100 animate-pulse h-[50px] flex items-center justify-center">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {displayRaces.map(r => {
              // Check if active (selected)
              let isActive = false;
              if (subrace) {
                isActive = r.id === subrace.id;
              } else if (race) {
                isActive = r.id === race.id;
              }

              return (
                <button
                  key={r.id}
                  onClick={() => handleRaceClick(r)}
                  className={`
                            px-4 py-3 rounded text-xs font-bold transition-all h-full min-h-[50px] flex items-center justify-center text-center leading-tight
                            ${isActive
                      ? 'bg-indigo-600 text-white shadow-md ring-1 ring-offset-1 ring-indigo-600'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                    }
                        `}
                >
                  {r.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Details Panel */}
      <div className="w-full lg:w-1/3 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
        {displayedRace ? (
          <div className="animate-in fade-in duration-200">
            {/* Image Section */}
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
              {displayedRace.image ? (
                <img
                  src={urlFor(displayedRace.image)?.width(400).height(300).url() || ''}
                  alt={displayedRace.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="text-center p-4">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <span className="text-xs text-gray-400">Race Appearance</span>
                  </div>
                  <img
                    src={`/images/races/${displayedRace.id}.jpg`}
                    alt={displayedRace.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-indigo-700">{displayedRace.name}</h3>

            <div className="space-y-4">
              <div>
                <span className="font-bold text-gray-900">Ability Score Increase.</span>{' '}
                <span className="text-gray-700">
                  {Object.entries(displayedRace.abilityScoreIncrease).map(([k, v]) => `${k} +${v}`).join(", ") || "None"}
                </span>
              </div>

              <div>
                <span className="font-bold text-gray-900">Size.</span>{' '}
                <span className="text-gray-700">{displayedRace.size}</span>
              </div>

              <div>
                <span className="font-bold text-gray-900">Speed.</span>{' '}
                <span className="text-gray-700">{displayedRace.speed} ft./round</span>
              </div>

              <div>
                <span className="font-bold text-gray-900">Languages.</span>{' '}
                <span className="text-gray-700">{displayedRace.languages?.join(", ") || "Common"}</span>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Traits.</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {displayedRace.traits.map((t, i) => (
                    <li key={i}>
                      <span className="font-semibold">{t.name}</span>: {t.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 italic">Source: {displayedRace.source}</p>
              </div>

              <p className="text-gray-700 mt-4 leading-relaxed">{displayedRace.description}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            <p>Select a race to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// Ability Score Step
function AbilityScoreStep({
  scores,
  race,
  onScoresChange,
}: {
  scores: AbilityScores;
  race?: Race;
  onScoresChange: (scores: AbilityScores) => void;
}) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Assign Ability Scores</h2>
        <p className="text-gray-600">Distribute points between 8-15 for each ability</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(["STR", "DEX", "CON", "INT", "WIS", "CHA"] as (keyof AbilityScores)[]).map((ability) => {
          const racialBonus = race?.abilityScoreIncrease[ability] || 0;
          const totalScore = scores[ability] + racialBonus;
          return (
            <div key={ability} className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <label className="block text-gray-700 font-semibold mb-2">{ability}</label>
              <input
                type="number"
                min="8"
                max="15"
                value={scores[ability]}
                onChange={(e) =>
                  onScoresChange({
                    ...scores,
                    [ability]: Math.max(8, Math.min(15, parseInt(e.target.value) || 10)),
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center font-semibold"
              />
              {racialBonus > 0 && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  +{racialBonus} racial bonus = {totalScore} total
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Background Step
function BackgroundStep({
  selected,
  onSelect,
}: {
  selected?: Background;
  onSelect: (background: Background) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch backgrounds from Sanity, fall back to mock data
  const { data: sanityBackgrounds, loading: backgroundsLoading } = useBackgrounds();
  const allBackgrounds = sanityBackgrounds && sanityBackgrounds.length > 0 ? sanityBackgrounds : mockBackgrounds;

  const filteredBackgrounds = useMemo(() => {
    return allBackgrounds.filter((bg) =>
      bg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allBackgrounds]);

  // Use the background from allBackgrounds to ensure we have Sanity image data
  const displayedBackground = selected ? allBackgrounds.find(bg => bg.id === selected.id) || selected : undefined;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start min-h-[500px]">
      {/* Left Column: Grid */}
      <div className="flex-1 w-full">
        <div className="text-center lg:text-left mb-6">
          <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your Background</h2>
          <p className="text-gray-600">Your character's history and skills</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search backgrounds..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {backgroundsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border-2 border-gray-200 rounded-lg animate-pulse">
                <div className="h-5 w-28 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredBackgrounds.map((background) => (
              <button
                key={background.id}
                onClick={() => onSelect(background)}
                className={`text-left p-4 border-2 rounded-lg transition-all ${selected?.id === background.id
                  ? "border-indigo-600 bg-indigo-50 shadow-md"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
              >
                <h3 className="text-gray-900 font-semibold text-lg mb-1">{background.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{background.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Details Panel */}
      <div className="w-full lg:w-5/12 lg:sticky lg:top-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm min-h-[400px]">
        {selected ? (
          <div className="animate-in fade-in duration-200">
            {/* Image Section */}
            <div className="w-full h-48 bg-gray-100 rounded-lg mb-6 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
              {displayedBackground?.image ? (
                <img
                  src={urlFor(displayedBackground.image)?.width(400).height(300).url() || ''}
                  alt={selected.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className="text-center p-4">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <span className="text-xs text-gray-400">Background Scene</span>
                  </div>
                  <img
                    src={`/images/backgrounds/${selected.id}.jpg`}
                    alt={selected.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-indigo-700 font-serif">{selected.name}</h3>
            <p className="text-gray-700 leading-relaxed mb-6 text-sm">{selected.description}</p>

            {/* Could add Skills, Tools, Languages here if available in Background object */}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            <p>Select a background to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Spell Selection Step - Slot Based
function SpellSelectionStep({
  classData,
  level,
  selectedSpells,
  onSpellsChange,
  feats,
  subclass,
  race,
  subrace, // Added subrace
  magicInitiateClass,
  onMagicInitiateClassChange
}: {
  classData: Class;
  level: number;
  selectedSpells: Spell[];
  onSpellsChange: (spells: Spell[]) => void;
  feats: Feat[];
  subclass?: Subclass;
  race?: Race;
  subrace?: Subrace;
  magicInitiateClass?: string;
  onMagicInitiateClassChange?: (cls: string) => void;
}) {
  const [activeSlot, setActiveSlot] = useState<{ level: number, index: number, source: string, choiceIndex?: number } | null>(null);

  // Magic Initiate Detection
  const hasMagicInitiate = feats.some(f => f.name.includes("Magic Initiate"));
  const hasAberrantDragonmark = feats.some(f => f.name.includes("Aberrant Dragonmark"));

  // Racial Magic Detection
  const racialChoices = [
    ...(race?.racialSpellChoices || []),
    ...(subrace?.racialSpellChoices || [])
  ];
  const hasRacialCantripChoice = racialChoices.length > 0;

  const minLevelLabel = (type: string) => {
    return type === 'at-will' ? 'At Will' : type;
  };

  // Helper to determine Class Slots
  const getClassCapacities = () => {
    let cantrips = 0;
    let level1 = 0;
    let level2 = 0;

    // Class Logic (Beginner: Level 1-3)
    if (["bard", "druid", "warlock"].includes(classData.id)) cantrips = 2;
    if (["cleric", "wizard", "sorcerer"].includes(classData.id)) cantrips = 3;
    if (level >= 4 && ["bard", "druid", "sorcerer", "warlock", "wizard"].includes(classData.id)) cantrips += 1;

    // Spells Known / Prepared
    if (classData.id === "bard") level1 = level + 3;
    if (classData.id === "sorcerer") level1 = level + 1;
    if (classData.id === "warlock") level1 = level + 1;
    if (classData.id === "ranger" && level >= 2) level1 = level;
    if (["cleric", "druid", "wizard"].includes(classData.id)) level1 = Math.max(1, level + 3);

    // Level 2 Spells
    if (["bard", "cleric", "druid", "sorcerer", "wizard"].includes(classData.id) && level >= 3) {
      level2 = 2;
      level1 -= 1;
    }

    return { cantrips, level1, level2 };
  };

  const classCapacities = getClassCapacities();

  const createSlots = (count: number, level: number, prefix: string, source: string) => {
    return Array.from({ length: count }).map((_, i) => ({
      level,
      index: i,
      id: `${prefix}-${i}`,
      source
    }));
  };

  const classSlots = [
    ...createSlots(classCapacities.cantrips, 0, "class-cantrip", "Class"),
    ...createSlots(classCapacities.level1, 1, "class-lvl1", "Class"),
    ...createSlots(classCapacities.level2, 2, "class-lvl2", "Class"),
  ];

  // Magic Initiate Slots
  const magicInitiateSlots = hasMagicInitiate ? [
    ...createSlots(2, 0, "feat-mi-cantrip", "Magic Initiate"),
    ...createSlots(1, 1, "feat-mi-lvl1", "Magic Initiate")
  ] : [];

  // Aberrant Dragonmark Slots
  const aberrantSlots = hasAberrantDragonmark ? [
    ...createSlots(1, 0, "feat-ab-cantrip", "Aberrant Dragonmark"),
    ...createSlots(1, 1, "feat-ab-lvl1", "Aberrant Dragonmark")
  ] : [];

  // Racial Spell Slots
  // Racial Spell Slots
  const racialSlots: { level: number, index: number, id: string, source: string, choiceIndex: number }[] = [];
  racialChoices.forEach((choice, idx) => {
    // Create slots for this choice
    for (let i = 0; i < choice.choose; i++) {
      racialSlots.push({
        level: choice.level || 0, // Default to cantrip if not specified
        index: racialSlots.length,
        id: `race-${idx}-${i}`,
        source: "Racial",
        choiceIndex: idx // Track which choice block this slot belongs to
      });
    }
  });


  const removeSpell = (spellId: string) => {
    onSpellsChange(selectedSpells.filter(s => s.id !== spellId));
  };

  const selectSpell = (spell: Spell) => {
    onSpellsChange([...selectedSpells, spell]);
    setActiveSlot(null);
  };

  const renderSlotGroup = (slots: any[], title: string, showClassSelector = false) => {
    if (slots.length === 0) return null;

    // Group slots by level for display within this section
    const levels = Array.from(new Set(slots.map(s => s.level))).sort((a, b) => a - b);

    return (
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {showClassSelector && onMagicInitiateClassChange && (
            <select
              value={magicInitiateClass || ""}
              onChange={(e) => onMagicInitiateClassChange(e.target.value)}
              className="px-3 py-1 text-sm border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="" disabled>Select Class...</option>
              <option value="bard">Bard</option>
              <option value="cleric">Cleric</option>
              <option value="druid">Druid</option>
              <option value="sorcerer">Sorcerer</option>
              <option value="warlock">Warlock</option>
              <option value="wizard">Wizard</option>
            </select>
          )}
        </div>

        {levels.map(lvl => {
          const lvlSlots = slots.filter(s => s.level === lvl);
          return (
            <div key={lvl} className="mb-4 last:mb-0">
              <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                {lvl === 0 ? "Cantrips" : `Level ${lvl} Spells`}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {lvlSlots.map((slot) => {
                  // Find spell in this slot position? 
                  // Logic: Assign first X spells of this level & source to these slots.
                  // But "source" isn't stored in Spell object currently.
                  // Temporary Fix: Tag spells as they are selected? 
                  // For now, allow mixing, OR simpler: Filter by ID if we stored it?
                  // Actually, we must identify which spell belongs to "Feat".
                  // Let's assume user fills them in order or we just list them.
                  // BETTER: Store `source` in Spell object? Or just visually list specific count.

                  // Current simplified approach:
                  // Filter spells that match the criteria (Class vs Feat)?
                  // We don't have source on Spell. 
                  // Let's rely on the user filling slots. 
                  // We will filter `selectedSpells` by level, and then slice?
                  // This is visually tricky if we don't know which is which.
                  // BUT for this task, the goal is separation. 
                  // Let's hack: The first X spells of Level Y are Class, next Z are Feat?
                  // No, that's brittle.
                  // Real solution needs `source` on selected spell.
                  // Assuming we can't change Spell type easily across app, let's use a local trick:
                  // When selecting a spell from "Feat" slot, we add a special property or ID suffix?
                  // Check `Spell` type import. It's in `dnd-types`.
                  // Let's assume we can't change `Spell` interface easily right now.
                  // We'll treat all selected spells as a pool and just fill slots sequentially for display.
                  // Ideally we mark them.
                  // For now: First fill Class slots, then Feat slots.

                  const globalLevelSpells = selectedSpells.filter(s => s.level === lvl);

                  // Determine index in global list
                  // Class slots: indices 0 to classCapacity-1
                  // Feat slots: indices classCapacity to classCapacity+featCapacity-1

                  let spellIndex = slot.index;
                  if (slot.source === "Feat") {
                    // Offset by class capacity for this level
                    const classCap = classCapacities[lvl === 0 ? "cantrips" : lvl === 1 ? "level1" : "level2"] || 0;
                    spellIndex += classCap;
                  }

                  const filledSpell = globalLevelSpells[spellIndex];

                  return (
                    <div key={slot.id} className="relative group">
                      {filledSpell ? (
                        <div className="p-3 bg-white border-2 border-purple-200 rounded-lg shadow-sm hover:border-red-300 transition-colors flex justify-between items-center group-hover:bg-red-50">
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{filledSpell.name}</div>
                            <div className="text-xs text-gray-500">{filledSpell.school}</div>
                          </div>
                          <button
                            onClick={() => removeSpell(filledSpell.id)}
                            className="text-gray-400 hover:text-red-600 p-1 flex-shrink-0"
                          >
                            <User className="w-4 h-4 rotate-45" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveSlot({ level: slot.level, index: slot.index, source: slot.source, choiceIndex: slot.choiceIndex })}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Select</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-[500px]">
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Prepare Your Spells</h2>
        <p className="text-gray-600">Select spells for your available slots.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {(classSlots.length > 0) && renderSlotGroup(classSlots, `${classData?.name || "Class"} Spells`)}

        {hasMagicInitiate && renderSlotGroup(magicInitiateSlots, "Magic Initiate Spells", true)}



        {hasAberrantDragonmark && renderSlotGroup(aberrantSlots, "Aberrant Dragonmark Spells")}

        {hasRacialCantripChoice && renderSlotGroup(racialSlots, "Racial Spell Choices")}

        {/* Fixed Racial Spells Display */}
        {(() => {
          const knownRacialSpells = [
            ...(race?.racialKnownSpells || []),
            ...(subrace?.racialKnownSpells || [])
          ].filter(s => s.level <= level); // Only show spells available at current level

          if (knownRacialSpells.length === 0) return null;

          return (
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-indigo-900">Innate Racial Magic</h3>
              </div>
              <p className="text-sm text-indigo-700 mb-4">
                Your lineage grants you these spells automatically. They do not count against your class spells.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {knownRacialSpells.map((known, idx) => {
                  const spell = expandedSpells.find(s => s.id === known.spellId);
                  if (!spell) return null;
                  return (
                    <div key={`${known.spellId}-${idx}`} className="p-3 bg-white border-2 border-indigo-300 rounded-lg opacity-90">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">{spell.name}</h4>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">Known</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {minLevelLabel(known.type || "at-will")} (Ability: {known.abilityScore})
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Spell Selection Modal */}
      {activeSlot !== null && (
        <SpellSelectionModal
          classData={classData}
          slotLevel={activeSlot.level}
          slotSource={activeSlot.source}
          onSelect={selectSpell}
          onClose={() => setActiveSlot(null)}
          currentSpells={selectedSpells}
          magicInitiateClass={magicInitiateClass}
          subclass={subclass}
          race={race}
          subrace={subrace}
          racialChoice={activeSlot.source === "Racial" && (activeSlot as any).choiceIndex !== undefined
            ? racialChoices[(activeSlot as any).choiceIndex]
            : undefined}
        />
      )}
    </div>
  );
}

function SpellSelectionModal({
  classData,
  slotLevel,
  slotSource,
  onSelect,
  onClose,
  currentSpells,
  magicInitiateClass,
  subclass,
  race,
  subrace,
  racialChoice
}: {
  classData: Class;
  slotLevel: number;
  slotSource: string;
  onSelect: (s: Spell) => void;
  onClose: () => void;
  currentSpells: Spell[];
  magicInitiateClass?: string;
  subclass?: Subclass;
  race?: Race;
  subrace?: Subrace; // Add subrace prop
  racialChoice?: { list: string[]; name: string; school?: string; level?: number }; // Specific choice block
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [divineSoulFilter, setDivineSoulFilter] = useState<"all" | "sorcerer" | "cleric">("all");

  // Determine if this is a Divine Soul selection scenario
  const isDivineSoulSelection = classData.id === "sorcerer" && subclass?.id === "divine-soul" && slotSource === "Class";

  // Available spells filter
  const spells = useMemo(() => {
    let targetClass = classData.id;

    // specialized logic for Divine Soul Class Slots
    if (isDivineSoulSelection) {
      return expandedSpells.filter(s =>
        s.level === slotLevel &&
        !currentSpells.find(existing => existing.id === s.id) &&
        (
          divineSoulFilter === "all" ? (s.classes.includes("sorcerer") || s.classes.includes("cleric")) :
            divineSoulFilter === "sorcerer" ? s.classes.includes("sorcerer") :
              divineSoulFilter === "cleric" ? s.classes.includes("cleric") : false
        )
      );
    }

    // If selecting for Feat, use the chosen magic initiate class
    if (slotSource === "Magic Initiate") {
      if (!magicInitiateClass) return []; // No spells if class not selected
      targetClass = magicInitiateClass;
    }

    if (slotSource === "Aberrant Dragonmark") {
      targetClass = "sorcerer";
    }

    // Racial Logic
    if (slotSource === "Racial" && racialChoice) {
      return expandedSpells.filter(s => {
        // Check level cap
        if (racialChoice.level !== undefined && s.level > racialChoice.level) return false;
        if (racialChoice.level === undefined && s.level !== 0) return false; // Default to cantrip

        // Check list/criteria
        return racialChoice.list.some(criteria => {
          if (criteria.startsWith("cantrip:")) {
            const cls = criteria.split(":")[1];
            return s.level === 0 && s.classes.includes(cls);
          }
          if (criteria === "any") return true;
          // Exact ID match
          return s.id === criteria;
        }) && !currentSpells.find(existing => existing.id === s.id);
      });
    }

    return expandedSpells.filter(s =>
      s.level === slotLevel &&
      ((slotSource === "Magic Initiate" || slotSource === "Aberrant Dragonmark" || slotSource === "Racial") ? true : (
        s.classes.includes(classData.id) ||
        classData.id === "bard"
        // Note: Divine Soul handled above in early return, so removed here to avoid conflict/duplication
      )) &&
      (slotSource === "Racial" ? (targetClass === "wizard" ? s.classes.includes("wizard") : true) : (s.classes.includes(targetClass) || targetClass === "bard")) &&
      !currentSpells.find(existing => existing.id === s.id)
    );
  }, [classData, slotLevel, currentSpells, slotSource, magicInitiateClass, subclass, race, isDivineSoulSelection, divineSoulFilter]);

  const filtered = spells.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Recommendations
  const recommended = ["magic-missile", "shield", "cure-wounds", "healing-word", "bless", "hex", "hunter-s-mark", "fireball", "eldritch-blast", "guidance"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 flex-wrap gap-2">
          <h3 className="font-bold text-lg text-gray-900">
            Select {slotLevel === 0 ? "Cantrip" : `Level ${slotLevel} Spell`}
            {slotSource === "Magic Initiate" && magicInitiateClass && <span className="text-purple-600 ml-2">({magicInitiateClass})</span>}
            {slotSource === "Aberrant Dragonmark" && <span className="text-red-600 ml-2">(Sorcerer)</span>}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full ml-auto">
            <User className="w-5 h-5 rotate-45" />
          </button>
        </div>

        {/* Divine Soul Toggle */}
        {isDivineSoulSelection && (
          <div className="px-4 pt-3 flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
              <button
                onClick={() => setDivineSoulFilter("all")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "all" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                All
              </button>
              <button
                onClick={() => setDivineSoulFilter("sorcerer")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "sorcerer" ? "bg-purple-100 text-purple-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Sorcerer
              </button>
              <button
                onClick={() => setDivineSoulFilter("cleric")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${divineSoulFilter === "cleric" ? "bg-amber-100 text-amber-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Cleric
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              autoFocus
              type="text"
              placeholder="Search spells..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          {slotSource === "Magic Initiate" && !magicInitiateClass && (
            <div className="mt-2 text-sm text-red-500">
              Please select a class for your Magic Initiate feat first.
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 grid grid-cols-1 gap-2">
          {filtered.map(spell => {
            const isRec = recommended.includes(spell.id) || spell.name.includes("Bolt");
            return (
              <button
                key={spell.id}
                onClick={() => onSelect(spell)}
                className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {spell.name}
                    {isRec && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full border border-yellow-200">Rec.</span>}
                  </div>
                  <span className="text-xs text-gray-500">{spell.school}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{spell.description}</p>
                {isDivineSoulSelection && (
                  <div className="mt-1 flex gap-1">
                    {spell.classes.includes("cleric") && <span className="text-[10px] px-1 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded">Cleric</span>}
                    {spell.classes.includes("sorcerer") && <span className="text-[10px] px-1 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded">Sorcerer</span>}
                  </div>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {slotSource === "Magic Initiate" && !magicInitiateClass ? "Select a class above." : `No spells found matching "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// Equipment Step
function EquipmentStep({
  equipment,
  classData,
  onEquipmentChange,
}: {
  equipment: Item[];
  classData?: Class;
  onEquipmentChange: (equipment: Item[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const availableItems = useMemo(() => {
    return mockItems.filter(
      (item) => item.type === "Weapon" || item.type === "Armor" || item.type === "Adventuring Gear"
    );
  }, []);

  const filteredItems = useMemo(() => {
    let items = availableItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Class-specific filtering/sorting suggestion
    if (classData) {
      // Monks, Wizards, Sorcerers typically don't wear armor
      if (["monk", "wizard", "sorcerer"].includes(classData.id)) {
        // Move armor to bottom or hide? User said "sort items like that".
        // Let's deprioritize Armor for them.
        items = items.sort((a, b) => {
          const aIsArmor = a.type === "Armor";
          const bIsArmor = b.type === "Armor";
          if (aIsArmor && !bIsArmor) return 1;
          if (!aIsArmor && bIsArmor) return -1;
          return 0;
        });
      }

      // Druids don't wear metal armor (simple check for "Plate", "Chain", "Ring" etc in description/name?)
      if (classData.id === "druid") {
        const isMetal = (i: Item) => i.type === "Armor" && (i.name.includes("Chain") || i.name.includes("Plate") || i.name.includes("Splint"));
        items = items.sort((a, b) => {
          if (isMetal(a) && !isMetal(b)) return 1;
          if (!isMetal(a) && isMetal(b)) return -1;
          return 0;
        });
      }
    }

    return items;
  }, [availableItems, searchTerm, classData]);

  const toggleItem = (item: Item) => {
    if (equipment.find((i) => i.id === item.id)) {
      onEquipmentChange(equipment.filter((i) => i.id !== item.id));
    } else {
      onEquipmentChange([...equipment, item]);
    }
  };

  const isNotRecommended = (item: Item) => {
    if (!classData) return false;
    if (["monk", "wizard", "sorcerer"].includes(classData.id) && item.type === "Armor") return true;
    // Add more logic as needed
    return false;
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Select Equipment</h2>
        <p className="text-gray-600">Choose your starting gear</p>
        <p className="text-sm text-indigo-700 mt-2 font-medium">Selected: {equipment.length} items</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search equipment..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2">
        {filteredItems.map((item) => {
          const isSelected = equipment.find((i) => i.id === item.id);
          const notRecommended = isNotRecommended(item);

          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`text-left p-3 border-2 rounded-lg transition-all ${isSelected
                ? "border-indigo-600 bg-indigo-50 shadow-md"
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                } ${notRecommended ? "opacity-60 order-last" : ""}`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-gray-900 font-semibold flex items-center gap-2">
                  {item.name}
                  {notRecommended && <span className="text-[10px] bg-gray-200 text-gray-500 px-1 rounded">Not Rec.</span>}
                </h4>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {item.type}
                </span>
              </div>
              {item.cost && (
                <p className="text-xs text-gray-600">
                  Cost: {item.cost.amount} {item.cost.currency}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Personality Step
function PersonalityStep({
  personality,
  onPersonalityChange,
}: {
  personality: {
    traits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;
  };
  onPersonalityChange: (personality: any) => void;
}) {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Define Your Personality</h2>
        <p className="text-gray-600">Bring your character to life (optional)</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Personality Traits</label>
          <textarea
            value={personality.traits || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, traits: e.target.value })
            }
            placeholder="How does your character act and think?"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Ideals</label>
          <textarea
            value={personality.ideals || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, ideals: e.target.value })
            }
            placeholder="What principles guide your character?"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Bonds</label>
          <textarea
            value={personality.bonds || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, bonds: e.target.value })
            }
            placeholder="What ties bind your character to others?"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Flaws</label>
          <textarea
            value={personality.flaws || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, flaws: e.target.value })
            }
            placeholder="What weaknesses does your character have?"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

// Feat Selection Step
function FeatSelectionStep({
  selectedFeats,
  onFeatsChange,
}: {
  selectedFeats: Feat[];
  onFeatsChange: (feats: Feat[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFeats = useMemo(() => {
    return FEATS.filter((feat) =>
      feat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleFeat = (feat: Feat) => {
    if (selectedFeats.find((f) => f.id === feat.id)) {
      onFeatsChange(selectedFeats.filter((f) => f.id !== feat.id));
    } else {
      // Limit to 1 feat
      if (selectedFeats.length >= 1) {
        // Replace existing
        onFeatsChange([feat]);
      } else {
        onFeatsChange([...selectedFeats, feat]);
      }
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-amber-600 mx-auto mb-3" />
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Select Feats</h2>
        <p className="text-gray-600">Choose feats to customize your character's abilities</p>
        <p className="text-sm text-gray-500 mt-2">
          (Optional) Select feats granted by your Race, Background, or Class Level.
        </p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search feats..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2">
        {filteredFeats.map((feat) => {
          const isSelected = selectedFeats.find((f) => f.id === feat.id);
          return (
            <button
              key={feat.id}
              onClick={() => toggleFeat(feat)}
              className={`text-left p-3 border-2 rounded-lg transition-all ${isSelected
                ? "border-amber-600 bg-amber-50 shadow-md"
                : "border-gray-200 hover:border-amber-300 hover:bg-gray-50"
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-gray-900 font-semibold">{feat.name}</h4>
                <div className="flex gap-1">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {feat.source}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{feat.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

