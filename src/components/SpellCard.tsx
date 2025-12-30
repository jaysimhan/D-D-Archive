import { Spell } from "../types/dnd-types";
import { Sparkles, Clock, Target, Zap } from "lucide-react";
import { useState } from "react";

interface SpellCardProps {
  spell: Spell;
}

export function SpellCard({ spell }: SpellCardProps) {
  const [expanded, setExpanded] = useState(false);

  const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "Official":
        return "bg-blue-900/50 text-blue-300 border border-blue-700";
      case "Homebrew":
        return "bg-brand-900/50 text-brand-300 border border-brand-700";
      case "Unofficial":
        return "bg-zinc-800 text-gray-400 border border-zinc-700";
      default:
        return "bg-zinc-800 text-gray-400 border border-zinc-700";
    }
  };

  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-gray-100 mb-1 font-serif">{spell.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{levelText}</span>
            <span>•</span>
            <span>{spell.school}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getSourceBadgeColor(
              spell.source
            )}`}
          >
            {spell.source}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700">
            {spell.edition}
          </span>
        </div>
      </div>

      {/* Quick Info Icons */}
      <div className="flex gap-4 mb-3 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{spell.castingTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-4 h-4" />
          <span>{spell.range}</span>
        </div>
        {spell.concentration && (
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Concentration</span>
          </div>
        )}
        {spell.ritual && (
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Ritual</span>
          </div>
        )}
      </div>

      {/* Components */}
      <div className="text-sm text-gray-400 mb-3">
        <span>Components: </span>
        {spell.components?.verbal && <span className="font-medium text-gray-300">V </span>}
        {spell.components?.somatic && <span className="font-medium text-gray-300">S </span>}
        {spell.components?.material && (
          <span className="font-medium text-gray-300">
            M
            {spell.components.materialDescription &&
              ` (${spell.components.materialDescription})`}
          </span>
        )}
        {!spell.components && <span className="text-gray-500 italic">None</span>}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">
        {expanded
          ? spell.description
          : `${spell.description.substring(0, 150)}${spell.description.length > 150 ? "..." : ""
          }`}
      </p>

      {spell.description.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-brand-400 hover:text-brand-300 mb-3"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Higher Levels */}
      {expanded && spell.higherLevels && (
        <div className="mt-3 p-3 bg-brand-950/30 rounded-lg border border-brand-900/50">
          <p className="text-sm text-gray-200">
            <span className="font-medium">At Higher Levels: </span>
            <span className="text-gray-400">{spell.higherLevels}</span>
          </p>
        </div>
      )}

      {/* Classes that can cast this spell */}
      <div className="mt-3 pt-3 border-t border-zinc-800">
        <p className="text-xs text-gray-500">
          <span>Available to: </span>
          {(spell.classes || []).map((c, i) => (
            <span key={c} className="text-gray-400">
              {c.charAt(0).toUpperCase() + c.slice(1)}
              {i < (spell.classes || []).length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}