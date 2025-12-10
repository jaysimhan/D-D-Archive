import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, User, Search, Sparkles } from "lucide-react";
import { Race, Class, Background, Spell, Item, AbilityScores, Subclass } from "../types/dnd-types";
import { species as RACES } from "../data/mock-races";
import { SUBRACES, BACKGROUNDS } from "../data/comprehensive-library";
import { combinedClasses } from "../data/mock-classes";
import { mockSubclasses } from "../data/mock-subclasses";
import { mockBackgrounds } from "../data/mock-backgrounds";
import { beginnerSpells } from "../data/beginner-spells";
import { mockItems } from "../data/mock-items";
import { CharacterSheet } from "./CharacterSheet";

type CreationStep =
  | "name"
  | "race"
  | "class"
  | "subclass"
  | "abilities"
  | "background"
  | "spells"
  | "equipment"
  | "personality";

interface CharacterData {
  name: string;
  race?: Race;
  class?: Class;
  subclass?: Subclass;
  level: number;
  background?: Background;
  abilityScores: AbilityScores;
  selectedSpells: Spell[];
  equipment: Item[];
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
    equipment: [],
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
        } as Race);
      }
    });
    return raceList;
  }, []);

  const steps: CreationStep[] = useMemo(() => {
    const baseSteps: CreationStep[] = ["name", "race", "class"];

    // Add subclass step if character level requires it
    if (characterData.class) {
      const subclassLevel = characterData.class.id === "cleric" ||
        characterData.class.id === "sorcerer" ||
        characterData.class.id === "warlock" ? 1 :
        characterData.class.id === "wizard" ? 2 : 3;

      if (characterData.level >= subclassLevel) {
        baseSteps.push("subclass");
      }
    }

    baseSteps.push("abilities", "background");

    if (characterData.class?.spellcaster) {
      baseSteps.push("spells");
    }

    baseSteps.push("equipment", "personality");

    return baseSteps;
  }, [characterData.class, characterData.level]);

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
      case "equipment":
        return characterData.equipment.length > 0;
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
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${index < currentStepIndex
                    ? "bg-green-500 border-green-500 text-white"
                    : index === currentStepIndex
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                    }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-1 ${index < currentStepIndex ? "bg-green-500" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-gray-700 font-medium capitalize">{currentStep.replace("-", " ")}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="p-8">
            {/* Step Content */}
            {currentStep === "name" && <NameStep characterData={characterData} setCharacterData={setCharacterData} />}
            {currentStep === "race" && (
              <RaceStep
                allRaces={allRaces}
                selectedRace={characterData.race}
                onSelectRace={(race) => setCharacterData({ ...characterData, race })}
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
            {currentStep === "spells" && !!characterData.class?.spellcaster && (
              <SpellSelectionStep
                classData={characterData.class}
                level={characterData.level}
                selectedSpells={characterData.selectedSpells}
                onSpellsChange={(selectedSpells) =>
                  setCharacterData({ ...characterData, selectedSpells })
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
              <PersonalityStep
                personality={characterData.personality}
                onPersonalityChange={(personality) =>
                  setCharacterData({ ...characterData, personality })
                }
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
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

// Race Step with Search
function RaceStep({
  allRaces,
  selectedRace,
  onSelectRace,
}: {
  allRaces: Race[];
  selectedRace?: Race;
  onSelectRace: (race: Race) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRaces = useMemo(() => {
    return allRaces.filter((race) =>
      race.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allRaces, searchTerm]);

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your Race</h2>
        <p className="text-gray-600">Select from {allRaces.length} available races</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search races..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredRaces.map((race) => (
          <button
            key={race.id}
            onClick={() => onSelectRace(race)}
            className={`text-left p-4 border-2 rounded-lg transition-all ${selectedRace?.id === race.id
              ? "border-indigo-600 bg-indigo-50 shadow-md"
              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
          >
            <h3 className="text-gray-900 font-semibold text-lg mb-1">{race.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{race.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                Speed: {race.speed} ft
              </span>
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                {race.size}
              </span>
              {race.edition && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {race.edition}
                </span>
              )}
            </div>
          </button>
        ))}
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

  const filteredClasses = useMemo(() => {
    return combinedClasses.filter((classData) =>
      classData.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your Class</h2>
        <p className="text-gray-600">Select your character's profession and level (1-3)</p>
      </div>

      {/* Level Selector */}
      <div className="mb-6 max-w-xs mx-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
        {filteredClasses.map((classData) => (
          <button
            key={classData.id}
            onClick={() => onSelect(classData)}
            className={`text-left p-4 border-2 rounded-lg transition-all ${selected?.id === classData.id
              ? "border-indigo-600 bg-indigo-50 shadow-md"
              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
          >
            <h3 className="text-gray-900 font-semibold text-lg mb-1">{classData.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{classData.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                Hit Die: d{classData.hitDie}
              </span>
              {classData.spellcaster && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {classData.spellcaster} Caster
                </span>
              )}
              {classData.edition && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {classData.edition}
                </span>
              )}
            </div>
          </button>
        ))}
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

  const subclassLevel = classData.id === "cleric" ||
    classData.id === "sorcerer" ||
    classData.id === "warlock" ? 1 :
    classData.id === "wizard" ? 2 : 3;

  const availableSubclasses = useMemo(() => {
    return mockSubclasses.filter((sc) => sc.parentClassId === classData.id);
  }, [classData.id]);

  const filteredSubclasses = useMemo(() => {
    return availableSubclasses.filter((subclass) =>
      subclass.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableSubclasses, searchTerm]);

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
    <div>
      <div className="text-center mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredSubclasses.map((subclass) => (
          <button
            key={subclass.id}
            onClick={() => onSelect(subclass)}
            className={`text-left p-4 border-2 rounded-lg transition-all ${selectedSubclass?.id === subclass.id
              ? "border-indigo-600 bg-indigo-50 shadow-md"
              : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
          >
            <h3 className="text-gray-900 font-semibold text-lg mb-2">{subclass.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{subclass.description}</p>
            <div className="text-xs text-gray-500">
              <strong className="text-gray-700">Features:</strong>
              <ul className="mt-1 space-y-1">
                {subclass.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx}>
                    Level {feature.level}: {feature.name}
                  </li>
                ))}
              </ul>
            </div>
            {subclass.edition && (
              <div className="mt-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {subclass.edition}
                </span>
              </div>
            )}
          </button>
        ))}
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

  const filteredBackgrounds = useMemo(() => {
    return mockBackgrounds.filter((bg) =>
      bg.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Choose Your Background</h2>
        <p className="text-gray-600">Your character's history and skills</p>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
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
            <p className="text-sm text-gray-600 line-clamp-3">{background.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Spell Selection Step - Only spells available for level 1-3
function SpellSelectionStep({
  classData,
  level,
  selectedSpells,
  onSpellsChange,
}: {
  classData: Class;
  level: number;
  selectedSpells: Spell[];
  onSpellsChange: (spells: Spell[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Determine max spell level based on class and level
  const getMaxSpellLevel = (classId: string, charLevel: number): number => {
    // Full casters (Wizard, Sorcerer, Cleric, Druid, Bard): Spell level = (Character level + 1) / 2
    if (['wizard', 'sorcerer', 'cleric', 'druid', 'bard'].includes(classId)) {
      return Math.floor((charLevel + 1) / 2);
    }
    // Half casters (Paladin, Ranger): Get spells at level 2
    if (['paladin', 'ranger'].includes(classId)) {
      return charLevel >= 2 ? 1 : 0;
    }
    // Third casters (Eldritch Knight, Arcane Trickster): Get spells at level 3
    if (['fighter', 'rogue'].includes(classId)) {
      return charLevel >= 3 ? 1 : 0;
    }
    // Warlock: Special case with pact magic
    if (classId === 'warlock') {
      return Math.floor((charLevel + 1) / 2);
    }
    return 0;
  };

  const maxSpellLevel = getMaxSpellLevel(classData.id, level);

  const availableSpells = useMemo(() => {
    return beginnerSpells.filter(
      (spell) => spell.classes.includes(classData.id) && spell.level <= maxSpellLevel
    );
  }, [classData.id, maxSpellLevel]);

  const filteredSpells = useMemo(() => {
    return availableSpells.filter((spell) =>
      spell.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableSpells, searchTerm]);

  const toggleSpell = (spell: Spell) => {
    if (selectedSpells.find((s) => s.id === spell.id)) {
      onSpellsChange(selectedSpells.filter((s) => s.id !== spell.id));
    } else {
      onSpellsChange([...selectedSpells, spell]);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h2 className="text-gray-900 text-2xl font-bold mb-2">Select Your Spells</h2>
        <p className="text-gray-600">Choose spells up to level {maxSpellLevel}</p>
        <p className="text-sm text-purple-700 mt-2 font-medium">
          Selected: {selectedSpells.length} spells | Available: {availableSpells.length} spells
        </p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search spells..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2">
        {filteredSpells.map((spell) => {
          const isSelected = selectedSpells.find((s) => s.id === spell.id);
          return (
            <button
              key={spell.id}
              onClick={() => toggleSpell(spell)}
              className={`text-left p-3 border-2 rounded-lg transition-all ${isSelected
                ? "border-purple-600 bg-purple-50 shadow-md"
                : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-gray-900 font-semibold">{spell.name}</h4>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-900 rounded font-medium">
                  {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-1">{spell.description}</p>
              {spell.edition && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {spell.edition}
                </span>
              )}
            </button>
          );
        })}
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
    return availableItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableItems, searchTerm]);

  const toggleItem = (item: Item) => {
    if (equipment.find((i) => i.id === item.id)) {
      onEquipmentChange(equipment.filter((i) => i.id !== item.id));
    } else {
      onEquipmentChange([...equipment, item]);
    }
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
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`text-left p-3 border-2 rounded-lg transition-all ${isSelected
                ? "border-indigo-600 bg-indigo-50 shadow-md"
                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-gray-900 font-semibold">{item.name}</h4>
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
