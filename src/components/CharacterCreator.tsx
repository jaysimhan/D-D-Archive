import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, Check, Sparkles, User, BookOpen, Settings, Download, Shield, Heart, Package, Wand2, Edit, FileText } from "lucide-react";
import { Race, Class, Background, Spell, Item, AbilityScores, Source, Subrace, Subclass } from "../types/dnd-types";
import {
  RACES,
  SUBRACES,
  BACKGROUNDS,
} from "../data/comprehensive-library";
import { combinedClasses } from "../data/mock-classes";
import { mockSubclasses } from "../data/mock-subclasses";
import { mockBackgrounds } from "../data/mock-backgrounds";
import { mockSpells } from "../data/mock-spells";
import { mockItems } from "../data/mock-items";
import { CharacterSheet } from "./CharacterSheet";

type CreationStep =
  | "race"
  | "class"
  | "abilities"
  | "background"
  | "spells"
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
  equipment: Item[];
  personality: {
    traits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;
  };
}

export function CharacterCreator() {
  const [currentStep, setCurrentStep] = useState<CreationStep>("race");
  const [isComplete, setIsComplete] = useState(false);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: "",
    level: 1,
    abilityScores: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    selectedSpells: [],
    equipment: [],
    personality: {},
  });

  const steps: {
    id: CreationStep;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "race", label: "Race", icon: User },
    { id: "class", label: "Class", icon: Shield },
    { id: "abilities", label: "Abilities", icon: Heart },
    { id: "background", label: "Background", icon: BookOpen },
    { id: "spells", label: "Spells", icon: Sparkles },
    { id: "equipment", label: "Equipment", icon: Package },
    { id: "personality", label: "Personality", icon: User },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const canProgress = () => {
    switch (currentStep) {
      case "race":
        return !!characterData.race;
      case "class":
        return !!characterData.class;
      case "abilities":
        return true;
      case "background":
        return !!characterData.background;
      case "spells":
        return true; // Optional for non-spellcasters
      case "equipment":
        return true;
      case "personality":
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    // Skip spells step if not a spellcaster
    if (currentStep === "background" && !characterData.class?.spellcaster) {
      setCurrentStep("equipment");
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    }
  };

  const prevStep = () => {
    // Skip spells step when going back if not a spellcaster
    if (currentStep === "equipment" && !characterData.class?.spellcaster) {
      setCurrentStep("background");
    } else if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    }
  };

  const completeCharacter = () => {
    setIsComplete(true);
  };

  const editCharacter = () => {
    setIsComplete(false);
    setCurrentStep("race");
  };

  // If character is complete, show the character sheet
  if (isComplete) {
    return <CharacterSheet character={characterData} onEdit={editCharacter} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="w-8 h-8" />
            <h1 className="text-white">Character Creator</h1>
          </div>
          <p className="text-purple-100">
            Build your character step-by-step with intelligent rules validation
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              const isSkipped =
                step.id === "spells" && !characterData.class?.spellcaster;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-purple-700 text-white"
                          : isCompleted
                          ? "bg-green-500 text-white"
                          : isSkipped
                          ? "bg-gray-200 text-gray-400"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 ${
                        isActive ? "text-purple-700" : "text-gray-600"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isCompleted ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detail Preview Panel - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Character Preview
              </h3>
              
              <div className="space-y-4">
                {/* Character Name */}
                {characterData.name && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Name</span>
                    <p className="text-gray-900">{characterData.name}</p>
                  </div>
                )}

                {/* Level */}
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Level</span>
                  <p className="text-gray-900">Level {characterData.level}</p>
                </div>

                {/* Race */}
                {characterData.race && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Race</span>
                    <p className="text-gray-900">
                      {characterData.subrace ? `${characterData.subrace.name} (${characterData.race.name})` : characterData.race.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{characterData.race.description}</p>
                    {characterData.race.traits.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Traits:</span>
                        <ul className="text-sm text-gray-600 mt-1 space-y-1">
                          {characterData.race.traits.slice(0, 3).map((trait, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600 mt-1">•</span>
                              <span>{trait}</span>
                            </li>
                          ))}
                          {characterData.race.traits.length > 3 && (
                            <li className="text-xs text-gray-500">+{characterData.race.traits.length - 3} more...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Class */}
                {characterData.class && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Class</span>
                    <p className="text-gray-900">{characterData.class.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{characterData.class.description}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Hit Die:</span>
                        <span className="ml-1 text-gray-900">d{characterData.class.hitDie}</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <span className="text-gray-500">Primary:</span>
                        <span className="ml-1 text-gray-900">{characterData.class.primaryAbility.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Background */}
                {characterData.background && (
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Background</span>
                    <p className="text-gray-900">{characterData.background.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{characterData.background.description}</p>
                  </div>
                )}

                {/* Empty State */}
                {!characterData.race && !characterData.class && !characterData.background && !characterData.name && (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Your character details will appear here as you make selections</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Character Name Input */}
          {currentStep !== "race" && (
            <div className="mb-6">
              <label className="block text-sm mb-2 text-gray-700">
                Character Name
              </label>
              <input
                type="text"
                value={characterData.name}
                onChange={(e) =>
                  setCharacterData({ ...characterData, name: e.target.value })
                }
                placeholder="Enter character name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Step Content */}
          {currentStep === "race" && (
            <RaceStep
              selectedRace={characterData.race}
              selectedSubrace={characterData.subrace}
              onSelectRace={(race) =>
                setCharacterData({ ...characterData, race, subrace: undefined })
              }
              onSelectSubrace={(subrace) =>
                setCharacterData({ ...characterData, subrace })
              }
            />
          )}

          {currentStep === "class" && (
            <ClassStep
              selected={characterData.class}
              selectedSubclass={characterData.subclass}
              level={characterData.level}
              onSelect={(classData) =>
                setCharacterData({ ...characterData, class: classData, subclass: undefined })
              }
              onSubclassSelect={(subclass) =>
                setCharacterData({ ...characterData, subclass })
              }
              onLevelChange={(level) =>
                setCharacterData({ ...characterData, level })
              }
            />
          )}

          {currentStep === "abilities" && (
            <AbilityScoreStep
              scores={characterData.abilityScores}
              race={characterData.race}
              subrace={characterData.subrace}
              onScoresChange={(abilityScores) =>
                setCharacterData({ ...characterData, abilityScores })
              }
            />
          )}

          {currentStep === "background" && (
            <BackgroundStep
              selected={characterData.background}
              onSelect={(background) =>
                setCharacterData({ ...characterData, background })
              }
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
              onEquipmentChange={(equipment) =>
                setCharacterData({ ...characterData, equipment })
              }
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
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={completeCharacter}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Check className="w-5 h-5" />
                Complete Character
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!canProgress()}
                className="flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

// Step Components
function RaceStep({
  selectedRace,
  selectedSubrace,
  onSelectRace,
  onSelectSubrace,
}: {
  selectedRace?: Race;
  selectedSubrace?: Subrace;
  onSelectRace: (race: Race) => void;
  onSelectSubrace: (subrace: Subrace) => void;
}) {
  const availableRaces = RACES;

  const availableSubraces = selectedRace?.subraces
    ? SUBRACES.filter((sr) => selectedRace.subraces?.includes(sr.id))
    : [];

  return (
    <div>
      <h2 className="text-gray-900 mb-2">Choose Your Race</h2>
      <p className="text-gray-600 mb-6">
        Your race determines your character's physical traits and natural abilities
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Races List */}
        <div>
          <h3 className="text-sm text-gray-700 mb-3">Select Race</h3>
          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {availableRaces.map((race) => (
              <button
                key={race.id}
                onClick={() => onSelectRace(race)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedRace?.id === race.id
                    ? "border-purple-700 bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <h3 className="text-gray-900 mb-1">{race.name}</h3>
                <p className="text-sm text-gray-600">{race.size}, {race.speed} ft</p>
                {race.subraces && race.subraces.length > 0 && (
                  <p className="text-xs text-purple-600 mt-1">{race.subraces.length} subraces available</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subraces List */}
        <div>
          <h3 className="text-sm text-gray-700 mb-3">
            {availableSubraces.length > 0 ? "Select Subrace (Optional)" : "No Subraces"}
          </h3>
          {availableSubraces.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {availableSubraces.map((subrace) => (
                <button
                  key={subrace.id}
                  onClick={() => onSelectSubrace(subrace)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedSubrace?.id === subrace.id
                      ? "border-purple-700 bg-purple-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <h4 className="text-gray-900 mb-1">{subrace.name}</h4>
                  <p className="text-sm text-gray-600">{subrace.description.substring(0, 80)}...</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-gray-500">
                {selectedRace
                  ? "This race has no subraces"
                  : "Select a race to view available subraces"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClassStep({
  selected,
  selectedSubclass,
  level,
  onSelect,
  onSubclassSelect,
  onLevelChange,
}: {
  selected?: Class;
  selectedSubclass?: Subclass;
  level: number;
  onSelect: (classData: Class) => void;
  onSubclassSelect: (subclass: Subclass) => void;
  onLevelChange: (level: number) => void;
}) {
  const availableClasses = combinedClasses;
  
  const availableSubclasses = selected
    ? mockSubclasses.filter((sc) => sc.parentClassId === selected.id)
    : [];

  return (
    <div>
      <h2 className="text-gray-900 mb-2">Choose Your Class</h2>
      <p className="text-gray-600 mb-6">
        Your class determines your abilities, skills, and role in the party
      </p>

      <div className="mb-6">
        <label className="block text-sm mb-2 text-gray-700">Starting Level</label>
        <input
          type="number"
          min="1"
          max="20"
          value={level}
          onChange={(e) => onLevelChange(parseInt(e.target.value) || 1)}
          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes List */}
        <div>
          <h3 className="text-sm text-gray-700 mb-3">Select Class</h3>
          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {availableClasses.map((classData) => (
              <button
                key={classData.id}
                onClick={() => onSelect(classData)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selected?.id === classData.id
                    ? "border-purple-700 bg-purple-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <h3 className="text-gray-900 mb-1">{classData.name}</h3>
                <p className="text-sm text-gray-600">
                  d{classData.hitDie} • {classData.primaryAbility.join("/")}
                </p>
                {classData.spellcaster && (
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    {classData.spellcaster} Caster
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Subclasses List */}
        <div>
          <h3 className="text-sm text-gray-700 mb-3">
            {availableSubclasses.length > 0 && level >= 3
              ? "Select Subclass (Optional)"
              : level < 3
              ? "Subclass (Level 3+)"
              : "No Subclasses"}
          </h3>
          {availableSubclasses.length > 0 && level >= 3 ? (
            <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2">
              {availableSubclasses.map((subclass) => (
                <button
                  key={subclass.id}
                  onClick={() => onSubclassSelect(subclass)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    selectedSubclass?.id === subclass.id
                      ? "border-purple-700 bg-purple-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <h4 className="text-gray-900 mb-1">{subclass.name}</h4>
                  <p className="text-sm text-gray-600">{subclass.description.substring(0, 80)}...</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {subclass.edition}
                    </span>
                    <span className="text-xs text-gray-500">
                      {subclass.features.length} features
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-gray-500">
                {!selected
                  ? "Select a class to view available subclasses"
                  : level < 3
                  ? "Subclass selection becomes available at level 3"
                  : "This class has no subclasses"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AbilityScoreStep({
  scores,
  race,
  subrace,
  onScoresChange,
}: {
  scores: AbilityScores;
  race?: Race;
  subrace?: Subrace;
  onScoresChange: (scores: AbilityScores) => void;
}) {
  const abilities: (keyof AbilityScores)[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  const getRacialBonus = (ability: keyof AbilityScores): number => {
    let bonus = 0;
    if (race?.abilityScoreIncrease[ability]) {
      bonus += race.abilityScoreIncrease[ability] || 0;
    }
    if (subrace?.abilityScoreIncrease[ability]) {
      bonus += subrace.abilityScoreIncrease[ability] || 0;
    }
    return bonus;
  };

  const getFinalScore = (ability: keyof AbilityScores): number => {
    return scores[ability] + getRacialBonus(ability);
  };

  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div>
      <h2 className="text-gray-900 mb-2">Assign Ability Scores</h2>
      <p className="text-gray-600 mb-6">
        Set your base ability scores (racial bonuses will be applied automatically)
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {abilities.map((ability) => {
          const racialBonus = getRacialBonus(ability);
          const finalScore = getFinalScore(ability);

          return (
            <div key={ability} className="p-4 border border-gray-300 rounded-lg">
              <label className="block text-gray-900 mb-2">{ability}</label>
              <input
                type="number"
                min="3"
                max="18"
                value={scores[ability]}
                onChange={(e) =>
                  onScoresChange({
                    ...scores,
                    [ability]: parseInt(e.target.value) || 10,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2"
              />
              {racialBonus > 0 && (
                <p className="text-xs text-gray-600 mb-1">
                  Racial Bonus: +{racialBonus}
                </p>
              )}
              <p className="text-sm text-gray-900">
                Final: {finalScore} ({getModifier(finalScore)})
              </p>
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
  const availableBackgrounds = BACKGROUNDS;

  return (
    <div>
      <h2 className="text-gray-900 mb-2">Choose Your Background</h2>
      <p className="text-gray-600 mb-6">
        Your background provides proficiencies, equipment, and a unique feature
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableBackgrounds.map((background) => (
          <button
            key={background.id}
            onClick={() => onSelect(background)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selected?.id === background.id
                ? "border-purple-700 bg-purple-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <h3 className="text-gray-900 mb-2">{background.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{background.description.substring(0, 100)}...</p>
            <p className="text-xs text-gray-600">
              Skills: {background.skillProficiencies.join(", ")}
            </p>
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
  const maxSpellLevel = Math.min(9, Math.ceil(level / 2));
  const availableSpells = mockSpells.filter(
    (spell) =>
      spell.classes.includes(classData.id) &&
      (spell.level === 0 || spell.level <= maxSpellLevel)
  );

  // Spell suggestions based on class
  const getSuggestedSpells = (): Spell[] => {
    const suggestions: Spell[] = [];
    const cantrips = availableSpells.filter(s => s.level === 0);
    const leveledSpells = availableSpells.filter(s => s.level > 0);

    // Common useful spells by class
    const spellPriorities: Record<string, string[]> = {
      wizard: ['mage-armor', 'shield', 'fireball', 'lightning-bolt', 'detect-magic', 'identify', 'magic-missile'],
      cleric: ['cure-wounds', 'healing-word', 'bless', 'spiritual-weapon', 'guiding-bolt'],
      druid: ['goodberry', 'healing-word', 'entangle', 'moonbeam', 'flame-blade'],
      sorcerer: ['mage-armor', 'shield', 'fireball', 'lightning-bolt', 'magic-missile'],
      warlock: ['eldritch-blast', 'hex', 'armor-of-agathys', 'hellish-rebuke'],
      bard: ['healing-word', 'faerie-fire', 'thunderwave', 'heat-metal'],
      paladin: ['cure-wounds', 'bless', 'shield-of-faith'],
      ranger: ['hunters-mark', 'cure-wounds', 'goodberry']
    };

    const priorities = spellPriorities[classData.id] || [];
    
    // Add 3-4 cantrips if available
    if (cantrips.length > 0) {
      const cantripCount = Math.min(4, cantrips.length);
      for (let i = 0; i < cantripCount && i < cantrips.length; i++) {
        suggestions.push(cantrips[i]);
      }
    }

    // Add priority spells
    for (const spellId of priorities) {
      const spell = leveledSpells.find(s => s.id === spellId);
      if (spell && suggestions.length < 10) {
        suggestions.push(spell);
      }
    }

    // Fill with other leveled spells
    const numToAdd = Math.min(10 - suggestions.length, leveledSpells.length);
    for (let i = 0; i < numToAdd; i++) {
      if (!suggestions.find(s => s.id === leveledSpells[i].id)) {
        suggestions.push(leveledSpells[i]);
      }
    }

    return suggestions.slice(0, 10);
  };

  const suggestedSpells = getSuggestedSpells();

  const toggleSpell = (spell: Spell) => {
    if (selectedSpells.find((s) => s.id === spell.id)) {
      onSpellsChange(selectedSpells.filter((s) => s.id !== spell.id));
    } else {
      onSpellsChange([...selectedSpells, spell]);
    }
  };

  const useSuggestedSpells = () => {
    onSpellsChange(suggestedSpells);
  };

  const isSuggested = (spell: Spell) => {
    return suggestedSpells.find(s => s.id === spell.id);
  };

  return (
    <div>
      <h2 className="text-gray-900 mb-2">Select Spells</h2>
      <p className="text-gray-600 mb-6">
        Choose spells for your {classData.name} (Level {level}, up to level {maxSpellLevel} spells)
      </p>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Selected: <span className="text-gray-900">{selectedSpells.length} spells</span>
        </p>
        <button
          onClick={useSuggestedSpells}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Use Suggested Spells
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
        {availableSpells.map((spell) => {
          const isSelected = selectedSpells.find((s) => s.id === spell.id);
          const suggested = isSuggested(spell);
          return (
            <button
              key={spell.id}
              onClick={() => toggleSpell(spell)}
              className={`p-3 border-2 rounded-lg text-left transition-all relative ${
                isSelected
                  ? "border-purple-700 bg-purple-50"
                  : suggested
                  ? "border-yellow-400 bg-yellow-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {suggested && !isSelected && (
                <span className="absolute top-2 right-2 text-xs px-2 py-0.5 bg-yellow-200 text-yellow-800 rounded-full">
                  Suggested
                </span>
              )}
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm text-gray-900 pr-16">{spell.name}</h4>
                {isSelected && <Check className="w-4 h-4 text-purple-700 absolute top-3 right-3" />}
              </div>
              <p className="text-xs text-gray-600">
                {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`} • {spell.school}
              </p>
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
  const availableItems = mockItems.filter((item) => !item.magical);

  const toggleItem = (item: Item) => {
    if (equipment.find((e) => e.id === item.id)) {
      onEquipmentChange(equipment.filter((e) => e.id !== item.id));
    } else {
      onEquipmentChange([...equipment, item]);
    }
  };

  return (
    <div>
      <h2 className="text-gray-900 mb-2">Select Equipment</h2>
      <p className="text-gray-600 mb-6">
        Choose starting equipment for your character
      </p>

      <p className="text-sm text-gray-700 mb-4">
        Selected: {equipment.length} items
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
        {availableItems.map((item) => {
          const isSelected = equipment.find((e) => e.id === item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggleItem(item)}
              className={`p-3 border-2 rounded-lg text-left transition-all ${
                isSelected
                  ? "border-purple-700 bg-purple-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm text-gray-900">{item.name}</h4>
                {isSelected && <Check className="w-4 h-4 text-purple-700" />}
              </div>
              <p className="text-xs text-gray-600">{item.type}</p>
              {item.cost && (
                <p className="text-xs text-gray-600 mt-1">
                  {item.cost.amount} {item.cost.currency}
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
  onPersonalityChange: (personality: {
    traits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;
  }) => void;
}) {
  return (
    <div>
      <h2 className="text-gray-900 mb-2">Define Your Character</h2>
      <p className="text-gray-600 mb-6">
        Add personality traits, ideals, bonds, and flaws to bring your character to life
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-gray-700">
            Personality Traits
          </label>
          <textarea
            value={personality.traits || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, traits: e.target.value })
            }
            placeholder="How does your character behave?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">Ideals</label>
          <textarea
            value={personality.ideals || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, ideals: e.target.value })
            }
            placeholder="What does your character believe in?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">Bonds</label>
          <textarea
            value={personality.bonds || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, bonds: e.target.value })
            }
            placeholder="What ties your character to the world?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-gray-700">Flaws</label>
          <textarea
            value={personality.flaws || ""}
            onChange={(e) =>
              onPersonalityChange({ ...personality, flaws: e.target.value })
            }
            placeholder="What are your character's weaknesses?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}