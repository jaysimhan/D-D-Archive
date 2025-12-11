import { User, Shield, Heart, Package, BookOpen, Sparkles, Download, Edit, FileText, Wand2 } from "lucide-react";
import { Race, Class, Background, Spell, Item, AbilityScores, Subrace, Subclass } from "../types/dnd-types";
import { expandedSpells as mockSpells } from "../data/expanded-spells";

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

export function CharacterSheet({
  character,
  onEdit,
}: {
  character: CharacterData;
  onEdit: () => void;
}) {
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

    racialSpells.forEach(rs => {
      // Check level requirement
      if (character.level >= rs.level) {
        const spell = mockSpells.find(s => s.id === rs.spellId);
        if (spell) {
          // Avoid duplicates if already selected (shouldn't happen for racial known)
          if (!spells.find(s => s.id === spell.id)) {
            spells.push({ ...spell, source: 'Race' });
          }
        }
      }
    });

    return spells;
  };

  const allSpells = getKnownSpells();

  const downloadPDF = () => {
    // Import jsPDF dynamically
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.text('D&D Character Sheet', 105, 20, { align: 'center' });

      // Character Info
      doc.setFontSize(12);
      doc.text(`Name: ${character.name || 'Unnamed'}`, 20, 35);
      doc.text(`Level: ${character.level}`, 20, 42);

      if (character.race) {
        const raceName = character.subrace
          ? `${character.subrace.name} (${character.race.name})`
          : character.race.name;
        doc.text(`Race: ${raceName}`, 20, 49);
      }

      if (character.class) {
        const className = character.subclass
          ? `${character.class.name} (${character.subclass.name})`
          : character.class.name;
        doc.text(`Class: ${className}`, 20, 56);
      }

      if (character.background) {
        doc.text(`Background: ${character.background.name}`, 20, 63);
      }

      // Ability Scores
      doc.setFontSize(14);
      doc.text('Ability Scores', 20, 75);
      doc.setFontSize(10);

      const abilities: (keyof AbilityScores)[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
      let yPos = 82;
      abilities.forEach((ability) => {
        const finalScore = getFinalScore(ability);
        const modifier = getModifier(finalScore);
        doc.text(`${ability}: ${finalScore} (${modifier})`, 20, yPos);
        yPos += 7;
      });

      // Spells (if applicable)
      const pdfSpells = allSpells; // Use calculated allSpells from closure
      if (pdfSpells.length > 0) {
        yPos += 5;
        doc.setFontSize(14);
        doc.text('Spells', 20, yPos);
        yPos += 7;
        doc.setFontSize(10);

        pdfSpells.slice(0, 15).forEach((spell) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          const spellLevel = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
          const sourceText = spell.source === 'Race' ? ' (Racial)' : '';
          doc.text(`${spell.name} (${spellLevel})${sourceText}`, 20, yPos);
          yPos += 7;
        });
      }

      // Equipment
      if (character.equipment.length > 0) {
        yPos += 5;
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(14);
        doc.text('Equipment', 20, yPos);
        yPos += 7;
        doc.setFontSize(10);

        character.equipment.slice(0, 15).forEach((item) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`• ${item.name}`, 20, yPos);
          yPos += 7;
        });
      }

      // Personality
      if (character.personality.traits || character.personality.ideals ||
        character.personality.bonds || character.personality.flaws) {
        yPos += 5;
        if (yPos > 220) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(14);
        doc.text('Personality', 20, yPos);
        yPos += 7;
        doc.setFontSize(10);

        if (character.personality.traits) {
          doc.text(`Traits: ${character.personality.traits.substring(0, 100)}`, 20, yPos, { maxWidth: 170 });
          yPos += 14;
        }
        if (character.personality.ideals) {
          doc.text(`Ideals: ${character.personality.ideals.substring(0, 100)}`, 20, yPos, { maxWidth: 170 });
          yPos += 14;
        }
      }

      // Save the PDF
      doc.save(`${character.name || 'character'}-sheet.pdf`);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8" />
                <h1 className="text-white">Character Sheet</h1>
              </div>
              <p className="text-purple-100">
                {character.name || 'Unnamed Character'} - Level {character.level} {character.class?.name || 'Adventurer'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
                Edit Character
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Character Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Character Name</span>
                <p className="text-gray-900">{character.name || 'Unnamed'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Race</span>
                <p className="text-gray-900">
                  {character.subrace ? `${character.subrace.name} (${character.race?.name})` : character.race?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Class</span>
                <p className="text-gray-900">
                  {character.subclass ? `${character.class?.name} (${character.subclass.name})` : character.class?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Level</span>
                <p className="text-gray-900">Level {character.level}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Background</span>
                <p className="text-gray-900">{character.background?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Combat Stats Card */}
          {/* Combat Stats & Proficiencies */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Combat Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">Hit Die</span>
                    <p className="text-gray-900">d{character.class?.hitDie || 6}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">HP (Est.)</span>
                    <p className="text-gray-900 font-bold text-green-700">
                      {character.class?.hitDie ? Math.floor((character.class.hitDie + getFinalScore('CON') - 10) / 2 * character.level) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide block">Prof. Bonus</span>
                    <p className="text-gray-900">+{Math.ceil(character.level / 4) + 1}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide mb-1 block">Saving Throws</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as (keyof AbilityScores)[]).map(ability => {
                      const isProficient = character.class?.savingThrows.includes(ability);
                      const mod = Math.floor((getFinalScore(ability) - 10) / 2);
                      const save = mod + (isProficient ? (Math.ceil(character.level / 4) + 1) : 0);
                      return (
                        <div key={ability} className={`text-xs p-1 rounded border ${isProficient ? 'bg-purple-50 border-purple-200 font-semibold' : 'border-gray-100 text-gray-500'}`}>
                          {ability}: {save >= 0 ? '+' : ''}{save} {isProficient && '★'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3">Skills</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
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
                    <div key={skill.name} className="flex justify-between items-center group">
                      <span className={`text-gray-600 ${isProficient ? 'font-medium text-purple-700' : ''}`}>{skill.name} <span className="text-[10px] text-gray-400">({skill.ab})</span></span>
                      <span className={`font-mono ${isProficient ? 'bg-purple-100 text-purple-800' : 'text-gray-500'} px-1.5 rounded textxs`}>
                        {total >= 0 ? '+' : ''}{total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Speed</span>
                <p className="text-gray-900">{character.race?.speed || 30} ft</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Size</span>
                <p className="text-gray-900">{character.race?.size || 'Medium'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Spells Known</span>
                <p className="text-gray-900">{allSpells.length} spells</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Equipment</span>
                <p className="text-gray-900">{character.equipment.length} items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ability Scores */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Ability Scores
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as (keyof AbilityScores)[]).map((ability) => {
              const finalScore = getFinalScore(ability);
              const modifier = getModifier(finalScore);
              const racialBonus = getRacialBonus(ability);

              return (
                <div key={ability} className="text-center p-4 border-2 border-gray-200 rounded-lg">
                  <span className="text-xs text-gray-500 uppercase tracking-wide block mb-2">{ability}</span>
                  <div className="text-3xl text-purple-700 mb-1">{modifier}</div>
                  <div className="text-sm text-gray-600">
                    Score: {finalScore}
                    {racialBonus > 0 && (
                      <span className="text-xs text-gray-500 block">({character.abilityScores[ability]} + {racialBonus})</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spells */}
        {allSpells.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Spells ({allSpells.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allSpells.map((spell) => (
                <div key={spell.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-gray-900">{spell.name}</h4>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {spell.level === 0 ? 'Cantrip' : `L${spell.level}`}
                    </span>
                  </div>
                  {spell.source === 'Race' && (
                    <span className="text-xs inline-block px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded mb-1">Racial</span>
                  )}
                  <p className="text-sm text-gray-600">{spell.school}</p>
                  <p className="text-xs text-gray-500 mt-2">{spell.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Equipment */}
        {character.equipment.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Equipment ({character.equipment.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {character.equipment.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-gray-900 mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{item.type}</p>
                  {item.cost && (
                    <p className="text-xs text-gray-500">
                      Cost: {item.cost.amount} {item.cost.currency}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Class Features */}
        {character.class && character.class.features.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Class & Subclass Features
            </h3>
            <ul className="space-y-4">
              {character.class.features.filter(f => f.level <= character.level).map((feature, idx) => (
                <li key={`class-${idx}`} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                  <h4 className="text-gray-900 font-medium text-sm">{feature.name} <span className="text-xs text-gray-500 font-normal">(Level {feature.level})</span></h4>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                </li>
              ))}
              {character.subclass && character.subclass.features.filter(f => f.level <= character.level).map((feature, idx) => (
                <li key={`subclass-${idx}`} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                  <h4 className="text-gray-900 font-medium text-sm">{feature.name} <span className="text-xs text-purple-600 font-normal">({character.subclass?.name})</span></h4>
                  <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Racial Traits */}
        {character.race && character.race.traits.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Racial Traits
            </h3>
            <ul className="space-y-2">
              {character.race.traits.map((trait, idx) => (
                <li key={idx} className="flex flex-col gap-1 pb-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">•</span>
                    <span className="font-medium text-gray-900">{trait.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 pl-4">{trait.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personality */}
        {(character.personality.traits || character.personality.ideals ||
          character.personality.bonds || character.personality.flaws) && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Personality
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {character.personality.traits && (
                  <div>
                    <h4 className="text-sm text-gray-700 mb-2">Personality Traits</h4>
                    <p className="text-gray-600">{character.personality.traits}</p>
                  </div>
                )}
                {character.personality.ideals && (
                  <div>
                    <h4 className="text-sm text-gray-700 mb-2">Ideals</h4>
                    <p className="text-gray-600">{character.personality.ideals}</p>
                  </div>
                )}
                {character.personality.bonds && (
                  <div>
                    <h4 className="text-sm text-gray-700 mb-2">Bonds</h4>
                    <p className="text-gray-600">{character.personality.bonds}</p>
                  </div>
                )}
                {character.personality.flaws && (
                  <div>
                    <h4 className="text-sm text-gray-700 mb-2">Flaws</h4>
                    <p className="text-gray-600">{character.personality.flaws}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Background Details */}
        {character.background && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Background: {character.background.name}
            </h3>
            <p className="text-gray-600 mb-4">{character.background.description}</p>
            <div>
              <h4 className="text-sm text-gray-700 mb-2">Skill Proficiencies</h4>
              <div className="flex flex-wrap gap-2">
                {character.background.skillProficiencies.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
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
