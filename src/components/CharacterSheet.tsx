import React, { useRef } from 'react';
import { User, Shield, Heart, Package, BookOpen, Sparkles, Download, Edit, FileText, Wand2, Loader2 } from "lucide-react";
import { Race, Class, Background, Spell, Item, AbilityScores, Subrace, Subclass, Feat } from "../types/dnd-types";
import { useSpells } from "../hooks/useSanityData";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFDocument } from './pdf/PDFDocument';

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
  feats: Feat[];
  proficiencies: {
    skills: string[];
    tools: string[];
    languages: string[];
  };
  expertise: string[];
  details: {
    gender?: string;
    age?: number;
    height?: string;
    weight?: string;
    appearance?: string;
    backstory?: string;
    personalityTraits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;
    allies?: string;
    additionalFeatures?: string;
    alignment?: string;
  };
}

export function CharacterSheet({
  character,
  onEdit,
}: {
  character: CharacterData;
  onEdit: () => void;
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const { data: allSanitySpells } = useSpells();

  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getRacialBonus = (ability: keyof AbilityScores): number => {
    let bonus = 0;
    if (character.race?.abilityScoreIncrease[ability]) {
      bonus += character.race.abilityScoreIncrease[ability] || 0;
    }
    if (character.subrace?.abilityScoreIncrease[ability]) {
      bonus += character.subrace.abilityScoreIncrease[ability] || 0;
    }
    return bonus;
  };

  const getFinalScore = (ability: keyof AbilityScores): number => {
    return character.abilityScores[ability] + getRacialBonus(ability);
  };

  const getKnownSpells = (): (Spell & { source?: string })[] => {
    const spells: (Spell & { source?: string })[] = [...character.selectedSpells.map(s => ({ ...s, source: 'Class' }))];

    // Add fixed racial spells
    const racialSpells = [
      ...(character.race?.racialKnownSpells || []),
      ...(character.subrace?.racialKnownSpells || [])
    ];

    if (allSanitySpells) {
      racialSpells.forEach(rs => {
        // Check level requirement
        if (character.level >= rs.level) {
          const spell = allSanitySpells.find(s => s.id === rs.spellId);
          if (spell) {
            // Avoid duplicates if already selected (shouldn't happen for racial known)
            if (!spells.find(s => s.id === spell.id)) {
              spells.push({ ...spell, source: 'Race' });
            }
          }
        }
      });
    }

    return spells;
  };

  const allSpells = getKnownSpells();

  // Removed html2canvas/jspdf logic

  return (
    <div ref={contentRef} className="min-h-screen bg-zinc-950 text-gray-300 font-sans selection:bg-brand-500/30">
      {/* Header */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-brand-900/20 rounded-lg border border-brand-500/20">
                  <FileText className="w-6 h-6 text-brand-500" />
                </div>
                <h1 className="text-2xl font-bold font-serif text-gray-100">Character Sheet</h1>
              </div>
              <p className="text-gray-400 pl-11">
                <span className="text-white font-semibold">{character.name || 'Unnamed Character'}</span> <span className="text-zinc-600 px-2">•</span> Level {character.level} {character.class?.name || 'Adventurer'}
              </p>
            </div>
            <div className="flex gap-3" data-html2canvas-ignore="true">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-gray-200 border border-zinc-700 rounded-lg transition-all hover:border-gray-600 shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Character
              </button>
              <PDFDownloadLink
                document={<PDFDocument character={character} />}
                fileName={`${character.name || 'character'}-sheet.pdf`}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all shadow-lg shadow-brand-900/20 hover:shadow-brand-900/40 border border-brand-500"
              >
                {({ loading }) => (
                  <>
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                    {loading ? 'Preparing...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Character Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Basic Info Card */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <User className="w-5 h-5 text-zinc-500" />
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Character Name</span>
                <p className="text-white font-medium pl-1 border-l-2 border-brand-500/50 mt-1">{character.name || 'Unnamed'}</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Race</span>
                <p className="text-gray-300 mt-0.5">
                  {character.subrace ? `${character.subrace.name} (${character.race?.name})` : character.race?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Class</span>
                <p className="text-gray-300 mt-0.5">
                  {character.subclass ? `${character.class?.name} (${character.subclass.name})` : character.class?.name || 'Unknown'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Level</span>
                  <p className="text-gray-300 mt-0.5">Level {character.level}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Background</span>
                  <p className="text-gray-300 mt-0.5">{character.background?.name || 'Unknown'}</p>
                </div>
              </div>

              {character.details.alignment && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Alignment</span>
                  <p className="text-gray-300 mt-0.5">{character.details.alignment}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-zinc-800/50">
                {character.details.gender && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Gender</span>
                    <p className="text-gray-400 text-sm">{character.details.gender}</p>
                  </div>
                )}
                {character.details.age && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Age</span>
                    <p className="text-gray-400 text-sm">{character.details.age}</p>
                  </div>
                )}
                {character.details.height && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Height</span>
                    <p className="text-gray-400 text-sm">{character.details.height}</p>
                  </div>
                )}
                {character.details.weight && (
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Weight</span>
                    <p className="text-gray-400 text-sm">{character.details.weight}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Combat Stats Card */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 space-y-6 shadow-sm">
            <div>
              <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
                <Shield className="w-5 h-5 text-zinc-500" />
                Combat Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between gap-4">
                  <div className="flex-1 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800 text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Hit Die</span>
                    <p className="text-white font-mono text-lg">d{character.class?.hitDie || 6}</p>
                  </div>
                  <div className="flex-1 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800 text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">HP (Max)</span>
                    <p className="text-emerald-400 font-bold font-mono text-lg">
                      {character.class?.hitDie ? Math.floor((character.class.hitDie + getFinalScore('CON') - 10) / 2 * character.level) : 'N/A'}
                    </p>
                  </div>
                  <div className="flex-1 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800 text-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Prof. Bonus</span>
                    <p className="text-brand-400 font-bold font-mono text-lg">+{Math.ceil(character.level / 4) + 1}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">Saving Throws</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as (keyof AbilityScores)[]).map(ability => {
                      const isProficient = character.class?.savingThrows.includes(ability);
                      const mod = Math.floor((getFinalScore(ability) - 10) / 2);
                      const save = mod + (isProficient ? (Math.ceil(character.level / 4) + 1) : 0);
                      return (
                        <div key={ability} className={`text-xs p-1.5 rounded text-center border transition-all ${isProficient ? 'bg-brand-900/20 border-brand-500/30 text-brand-300 font-semibold' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                          {ability}: {save >= 0 ? '+' : ''}{save} {isProficient && '★'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Skills</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                {[
                  { name: "Acrobatics", ab: "DEX" }, { name: "Animal Handling", ab: "WIS" }, { name: "Arcana", ab: "INT" },
                  { name: "Athletics", ab: "STR" }, { name: "Deception", ab: "CHA" }, { name: "History", ab: "INT" },
                  { name: "Insight", ab: "WIS" }, { name: "Intimidation", ab: "CHA" }, { name: "Investigation", ab: "INT" },
                  { name: "Medicine", ab: "WIS" }, { name: "Nature", ab: "INT" }, { name: "Perception", ab: "WIS" },
                  { name: "Performance", ab: "CHA" }, { name: "Persuasion", ab: "CHA" }, { name: "Religion", ab: "INT" },
                  { name: "Sleight of Hand", ab: "DEX" }, { name: "Stealth", ab: "DEX" }, { name: "Survival", ab: "WIS" }
                ].map(skill => {
                  // Check proficiency
                  const bgProfs = character.background?.skillProficiencies || [];
                  const raceTraits = character.race?.traits || [];
                  // Simple check for race traits matching "Proficiency in Skill" or "Skill Name"
                  const raceProfs = raceTraits.filter(t => t.description.includes(`Proficiency in ${skill.name}`) || t.name === "Keen Senses" && skill.name === "Perception");
                  const isProficient = bgProfs.includes(skill.name) || raceProfs.length > 0;

                  const mod = Math.floor((getFinalScore(skill.ab as keyof AbilityScores) - 10) / 2);
                  const total = mod + (isProficient ? (Math.ceil(character.level / 4) + 1) : 0);

                  return (
                    <div key={skill.name} className="flex justify-between items-center group hover:bg-zinc-800/30 rounded px-1 -mx-1 transition-colors">
                      <span className={`text-gray-500 group-hover:text-gray-300 transition-colors ${isProficient ? 'font-medium text-brand-300' : ''}`}>{skill.name} <span className="text-[10px] text-zinc-600">({skill.ab})</span></span>
                      <span className={`font-mono text-xs px-1.5 rounded ${isProficient ? 'bg-brand-900/20 text-brand-400' : 'text-zinc-600'}`}>
                        {total >= 0 ? '+' : ''}{total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Sparkles className="w-5 h-5 text-zinc-500" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Speed</span>
                <p className="text-gray-200 text-lg font-mono mt-0.5">{character.race?.speed || 30} <span className="text-sm text-zinc-500">ft</span></p>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Size</span>
                <p className="text-gray-200 mt-0.5">{character.race?.size || 'Medium'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-zinc-950/50 p-3 rounded border border-zinc-800">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Spells</span>
                  <p className="text-white font-medium text-xl mt-1">{allSpells.length}</p>
                </div>
                <div className="bg-zinc-950/50 p-3 rounded border border-zinc-800">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Items</span>
                  <p className="text-white font-medium text-xl mt-1">{character.equipment.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 mb-8 shadow-sm">
          <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-zinc-500" />
            Ability Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as (keyof AbilityScores)[]).map((ability) => {
              const finalScore = getFinalScore(ability);
              const modifier = getModifier(finalScore);
              const racialBonus = getRacialBonus(ability);

              return (
                <div key={ability} className="text-center p-4 border border-zinc-800 bg-zinc-950/50 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">{ability}</span>
                  <div className="text-3xl font-mono text-gray-100 mb-1">{modifier}</div>
                  <div className="text-xs text-gray-500">
                    Score: {finalScore}
                    {racialBonus > 0 && (
                      <span className="text-[10px] text-brand-400 block mt-0.5">({character.abilityScores[ability]} + {racialBonus})</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spells */}
        {allSpells.length > 0 && (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-zinc-500" />
              Spells ({allSpells.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSpells.map((spell) => (
                <div key={spell.id} className="p-4 border border-zinc-800 bg-zinc-950/30 rounded-lg hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-gray-200 font-medium">{spell.name}</h4>
                    <span className="text-[10px] px-2 py-1 bg-zinc-800 text-gray-400 rounded-full border border-zinc-700">
                      {spell.level === 0 ? 'Cantrip' : `L${spell.level}`}
                    </span>
                  </div>
                  {spell.source === 'Race' && (
                    <span className="text-[10px] inline-block px-2 py-0.5 bg-brand-900/30 text-brand-300 rounded mb-2 border border-brand-900/50">Racial</span>
                  )}
                  <p className="text-xs text-gray-500 font-mono mb-2">{spell.school}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{spell.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment */}
        {character.equipment.length > 0 && (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-zinc-500" />
              Equipment ({character.equipment.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {character.equipment.map((item) => (
                <div key={item.id} className="p-3 border border-zinc-800 bg-zinc-950/30 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="text-gray-200 text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.type}</p>
                  </div>
                  {item.cost && (
                    <span className="text-xs text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
                      {item.cost.amount} {item.cost.currency}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Class Features */}
        {character.class && character.class.features.length > 0 && (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-zinc-500" />
              Class & Subclass Features
            </h3>
            <ul className="space-y-4">
              {character.class.features.filter(f => f.level <= character.level).map((feature, idx) => (
                <li key={`class-${idx}`} className="border-b border-zinc-800/50 last:border-0 pb-3 last:pb-0">
                  <h4 className="text-brand-400 font-medium text-sm mb-1">{feature.name} <span className="text-xs text-zinc-600 font-normal ml-1">(Level {feature.level})</span></h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </li>
              ))}
              {character.subclass && character.subclass.features.filter(f => f.level <= character.level).map((feature, idx) => (
                <li key={`subclass-${idx}`} className="border-b border-zinc-800/50 last:border-0 pb-3 last:pb-0">
                  <h4 className="text-purple-400 font-medium text-sm mb-1">{feature.name} <span className="text-xs text-zinc-600 font-normal ml-1">({character.subclass?.name})</span></h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Racial Traits */}
        {character.race && character.race.traits.length > 0 && (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-zinc-500" />
              Racial Traits
            </h3>
            <ul className="space-y-3">
              {character.race.traits.map((trait, idx) => (
                <li key={idx} className="flex flex-col gap-1 pb-3 border-b border-zinc-800/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-500">•</span>
                    <span className="font-medium text-gray-200 text-sm">{trait.name}</span>
                  </div>
                  <p className="text-sm text-gray-400 pl-4 leading-relaxed">{trait.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Details & Personality */}
        {(character.details.personalityTraits || character.details.ideals ||
          character.details.bonds || character.details.flaws) && (
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 mb-8 shadow-sm">
              <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-zinc-500" />
                Personality & Traits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.details.personalityTraits && (
                  <div className="bg-zinc-950/30 p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Personality Traits</h4>
                    <p className="text-gray-300 text-sm italic">"{character.details.personalityTraits}"</p>
                  </div>
                )}
                {character.details.ideals && (
                  <div className="bg-zinc-950/30 p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Ideals</h4>
                    <p className="text-gray-300 text-sm italic">"{character.details.ideals}"</p>
                  </div>
                )}
                {character.details.bonds && (
                  <div className="bg-zinc-950/30 p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Bonds</h4>
                    <p className="text-gray-300 text-sm italic">"{character.details.bonds}"</p>
                  </div>
                )}
                {character.details.flaws && (
                  <div className="bg-zinc-950/30 p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Flaws</h4>
                    <p className="text-gray-300 text-sm italic">"{character.details.flaws}"</p>
                  </div>
                )}
                {character.details.backstory && (
                  <div className="col-span-1 md:col-span-2 mt-4 bg-zinc-950/30 p-4 rounded-lg border border-zinc-800/50">
                    <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-2 font-semibold">Backstory</h4>
                    <p className="text-gray-400 text-sm whitespace-pre-wrap leading-relaxed">{character.details.backstory}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Feats */}
        {character.feats && character.feats.length > 0 && (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 mb-8 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-zinc-500" />
              Feats
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {character.feats.map((feat, idx) => (
                <div key={idx} className="p-4 border border-zinc-800 bg-zinc-950/30 rounded-lg">
                  <h4 className="text-amber-400 font-medium mb-1">{feat.name}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Background Details */}
        {character.background && (
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-200 font-serif text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-zinc-500" />
              Background: {character.background.name}
            </h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-3xl">{character.background.description}</p>
            <div>
              <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-semibold">Skill Proficiencies</h4>
              <div className="flex flex-wrap gap-2">
                {character.background.skillProficiencies.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-zinc-800 text-gray-300 rounded border border-zinc-700 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
