import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, User, Search, ScrollText, Dices, Sparkles } from "lucide-react";
import { Race, Class, Background, Spell, Item, AbilityScores, Subclass } from "../types/dnd-types";
import { species as RACES } from "../data/mock-races";
import { SUBRACES, BACKGROUNDS } from "../data/comprehensive-library";
import { combinedClasses } from "../data/mock-classes";
import { mockSubclasses } from "../data/mock-subclasses";
import { mockBackgrounds } from "../data/mock-backgrounds";
import { comprehensiveSpells as mockSpells } from "../data/comprehensive-spells";
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
    // Add subraces from the SUBRACES array
    SUBRACES.forEach(subrace => {
      const parentRace = RACES.find(r => r.id === subrace.parentRaceId);
      if (parentRace) {
        // Create a race entry for each subrace
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
        return true; // Can always progress
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
    <div className="min-h-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjViMjkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-amber-50">
      {/* Decorative Header */}
      <div className="bg-gradient-to-r from-amber-900 via-red-900 to-amber-900 border-b-4 border-amber-600 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Dices className="w-12 h-12 text-amber-200" />
            <div>
              <h1 className="text-white text-3xl font-serif mb-1">Character Creation</h1>
              <p className="text-amber-200 text-sm">Forge Your Legend</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="bg-gradient-to-b from-amber-100 to-amber-50 border-b-2 border-amber-300 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${index < currentStepIndex
                      ? "bg-green-600 border-green-600 text-white"
                      : index === currentStepIndex
                        ? "bg-amber-600 border-amber-600 text-white scale-110 shadow-lg"
                        : "bg-white border-amber-300 text-gray-400"
                    }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-1 ${index < currentStepIndex ? "bg-green-600" : "bg-amber-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 text-center">
            <span className="text-amber-900 font-serif text-lg capitalize">{currentStep.replace("-", " ")}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-2xl border-4 border-amber-800 overflow-hidden">
          {/* Decorative top border */}
          <div className="h-3 bg-gradient-to-r from-amber-600 via-red-700 to-amber-600"></div>

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
            {currentStep === "spells" && characterData.class?.spellcaster && (
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
            <div className="flex justify-between mt-8 pt-6 border-t-2 border-amber-200">
              <button
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-900 border-2 border-amber-600 rounded-lg hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-serif shadow-md"
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              {currentStepIndex === steps.length - 1 ? (
                <button
                  onClick={completeCharacter}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-700 to-green-600 text-white rounded-lg hover:from-green-800 hover:to-green-700 transition-all font-serif shadow-lg border-2 border-green-900"
                >
                  <Check className="w-5 h-5" />
                  Complete Character
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!canProgress()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-red-700 text-white rounded-lg hover:from-amber-800 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-serif shadow-lg border-2 border-amber-900"
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
        <User className="w-16 h-16 text-amber-700 mx-auto mb-4" />
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Name Your Hero</h2>
        <p className="text-gray-600">Every legend begins with a name</p>
      </div>

      <div className="max-w-md mx-auto">
        <label className="block text-amber-900 font-serif mb-3 text-lg">
          Character Name
        </label>
        <input
          type="text"
          value={characterData.name}
          onChange={(e) =>
            setCharacterData({ ...characterData, name: e.target.value })
          }
          placeholder="Enter your character's name..."
          className="w-full px-6 py-4 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-serif bg-amber-50/50"
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
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Choose Your Race</h2>
        <p className="text-gray-600">Your heritage shapes your destiny</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search races..."
          className="w-full pl-12 pr-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredRaces.map((race) => (
          <button
            key={race.id}
            onClick={() => onSelectRace(race)}
            className={`text-left p-4 border-2 rounded-lg transition-all ${selectedRace?.id === race.id
                ? "border-amber-600 bg-amber-50 shadow-lg ring-2 ring-amber-400"
                : "border-amber-300 hover:border-amber-500 hover:bg-amber-50/50"
              }`}
          >
            <h3 className="text-amber-900 font-serif text-lg mb-1">{race.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{race.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-900 rounded">
                Speed: {race.speed} ft
              </span>
              <span className="text-xs px-2 py-1 bg-amber-200 text-amber-900 rounded">
                {race.size}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Class Step with Search
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
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Choose Your Class</h2>
        <p className="text-gray-600">Your path to power and glory</p>
      </div>

      {/* Level Selector */}
      <div className="mb-6 max-w-xs mx-auto">
        <label className="block text-amber-900 font-serif mb-2">
          Character Level
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={level}
          onChange={(e) => onLevelChange(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
          className="w-full px-4 py-2 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif text-center"
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search classes..."
          className="w-full pl-12 pr-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2">
        {filteredClasses.map((classData) => (
          <button
            key={classData.id}
            onClick={() => onSelect(classData)}
            className={`text-left p-4 border-2 rounded-lg transition-all ${selected?.id === classData.id
                ? "border-amber-600 bg-amber-50 shadow-lg ring-2 ring-amber-400"
                : "border-amber-300 hover:border-amber-500 hover:bg-amber-50/50"
              }`}
          >
            <h3 className="text-amber-900 font-serif text-lg mb-1">{classData.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{classData.description}</p>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs px-2 py-1 bg-red-100 text-red-900 rounded">
                Hit Die: d{classData.hitDie}
              </span>
              {classData.spellcaster && (
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-900 rounded">
                  {classData.spellcaster} Caster
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Subclass Step (Separate from Class)
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
        <ScrollText className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <p className="text-amber-900 font-serif text-lg">
          Subclass selection unlocks at level {subclassLevel}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Choose Your {classData.name} Subclass</h2>
        <p className="text-gray-600">Specialize your path</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search subclasses..."
          className="w-full pl-12 pr-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredSubclasses.map((subclass) => (
          <button
            key={subclass.id}
            onClick={() => onSelect(subclass)}
            className={`text-left p-4 border-2 rounded-lg transition-all ${selectedSubclass?.id === subclass.id
                ? "border-amber-600 bg-amber-50 shadow-lg ring-2 ring-amber-400"
                : "border-amber-300 hover:border-amber-500 hover:bg-amber-50/50"
              }`}
          >
            <h3 className="text-amber-900 font-serif text-lg mb-2">{subclass.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{subclass.description}</p>
            <div className="text-xs text-gray-500">
              <strong>Features:</strong>
              <ul className="mt-1 space-y-1">
                {subclass.features.slice(0, 3).map((feature, idx) => (
                  <li key={idx}>
                    Level {feature.level}: {feature.name}
                  </li>
                ))}
              </ul>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Continue with other step components below...
// (I'll add the rest in the next parts due to length)

// Placeholder for remaining steps (will complete these)
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
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Assign Ability Scores</h2>
        <p className="text-gray-600">Determine your character's strengths</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(["STR", "DEX", "CON", "INT", "WIS", "CHA"] as (keyof AbilityScores)[]).map((ability) => {
          const racialBonus = race?.abilityScoreIncrease[ability] || 0;
          return (
            <div key={ability} className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
              <label className="block text-amber-900 font-serif mb-2">{ability}</label>
              <input
                type="number"
                min="8"
                max="18"
                value={scores[ability]}
                onChange={(e) =>
                  onScoresChange({
                    ...scores,
                    [ability]: Math.max(8, Math.min(18, parseInt(e.target.value) || 10)),
                  })
                }
                className="w-full px-3 py-2 border-2 border-amber-600 rounded focus:ring-2 focus:ring-amber-500 text-center"
              />
              {racialBonus > 0 && (
                <p className="text-xs text-green-700 mt-1">+{racialBonus} racial bonus</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Choose Your Background</h2>
        <p className="text-gray-600">Your past defines your skills</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search backgrounds..."
          className="w-full pl-12 pr-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
        {filteredBackgrounds.map((background) => (
          <button
            key={background.id}
            onClick={() => onSelect(background)}
            className={`text-left p-4 border-2 rounded-lg transition-all ${selected?.id === background.id
                ? "border-amber-600 bg-amber-50 shadow-lg ring-2 ring-amber-400"
                : "border-amber-300 hover:border-amber-500 hover:bg-amber-50/50"
              }`}
          >
            <h3 className="text-amber-900 font-serif text-lg mb-1">{background.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{background.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

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

  const availableSpells = useMemo(() => {
    return mockSpells.filter(
      (spell) => spell.classes.includes(classData.id) && spell.level <= level
    );
  }, [classData.id, level]);

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
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Select Your Spells</h2>
        <p className="text-gray-600">Choose your magical arsenal</p>
        <p className="text-sm text-purple-700 mt-2">Selected: {selectedSpells.length} spells</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search spells..."
          className="w-full pl-12 pr-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif"
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
                  : "border-amber-300 hover:border-amber-500 hover:bg-amber-50/50"
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-amber-900 font-serif">{spell.name}</h4>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-900 rounded">
                  {spell.level === 0 ? "Cantrip" : `L${spell.level}`}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{spell.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

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
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Select Equipment</h2>
        <p className="text-gray-600">Gear up for adventure</p>
        <p className="text-sm text-amber-700 mt-2">Selected: {equipment.length} items</p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search equipment..."
          className="w-full pl-12 pr-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif"
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
                  ? "border-amber-600 bg-amber-50 shadow-md"
                  : "border-amber-300 hover:border-amber-500 hover:bg-amber-50/50"
                }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-amber-900 font-serif">{item.name}</h4>
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
        <h2 className="text-amber-900 text-2xl font-serif mb-2">Define Your Personality</h2>
        <p className="text-gray-600">Bring your character to life</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-amber-900 font-serif mb-2">Personality Traits</label>
          <textarea
            value={personality.traits || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, traits: e.target.value })
            }
            placeholder="How does your character act and think?"
            className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-amber-900 font-serif mb-2">Ideals</label>
          <textarea
            value={personality.ideals || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, ideals: e.target.value })
            }
            placeholder="What principles guide your character?"
            className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-amber-900 font-serif mb-2">Bonds</label>
          <textarea
            value={personality.bonds || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, bonds: e.target.value })
            }
            placeholder="What ties bind your character to others?"
            className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-amber-900 font-serif mb-2">Flaws</label>
          <textarea
            value={personality.flaws || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, flaws: e.target.value })
            }
            placeholder="What weaknesses does your character have?"
            className="w-full px-4 py-3 border-2 border-amber-600 rounded-lg focus:ring-2 focus:ring-amber-500 bg-amber-50/50 font-serif resize-none"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
