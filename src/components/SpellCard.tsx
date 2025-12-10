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
        return "bg-blue-100 text-blue-800";
      case "Homebrew":
        return "bg-purple-100 text-purple-800";
      case "Unofficial":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{spell.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
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
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
            {spell.edition}
          </span>
        </div>
      </div>

      {/* Quick Info Icons */}
      <div className="flex gap-4 mb-3 text-sm text-gray-600">
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
            <Zap className="w-4 h-4 text-yellow-600" />
            <span>Concentration</span>
          </div>
        )}
        {spell.ritual && (
          <div className="flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Ritual</span>
          </div>
        )}
      </div>

      {/* Components */}
      <div className="text-sm text-gray-600 mb-3">
        <span>Components: </span>
        {spell.components?.verbal && <span className="font-medium">V </span>}
        {spell.components?.somatic && <span className="font-medium">S </span>}
        {spell.components?.material && (
          <span className="font-medium">
            M
            {spell.components.materialDescription &&
              ` (${spell.components.materialDescription})`}
          </span>
        )}
        {!spell.components && <span className="text-gray-500 italic">None</span>}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">
        {expanded
          ? spell.description
          : `${spell.description.substring(0, 150)}${
              spell.description.length > 150 ? "..." : ""
            }`}
      </p>

      {spell.description.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 mb-3"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Higher Levels */}
      {expanded && spell.higherLevels && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-900">
            <span>At Higher Levels: </span>
            <span className="text-gray-700">{spell.higherLevels}</span>
          </p>
        </div>
      )}

      {/* Classes that can cast this spell */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          <span>Available to: </span>
          {spell.classes.map((c, i) => (
            <span key={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
              {i < spell.classes.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}