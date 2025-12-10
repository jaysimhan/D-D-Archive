import { Race } from "../types/dnd-types";
import { Users, Gauge, Languages } from "lucide-react";
import { useState } from "react";

interface RaceCardProps {
  race: Race;
}

export function RaceCard({ race }: RaceCardProps) {
  const [expanded, setExpanded] = useState(false);

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

  const getAbilityScoreText = () => {
    if (!race.abilityScoreIncrease) {
      return "None";
    }
    const increases = Object.entries(race.abilityScoreIncrease)
      .filter(([_, value]) => value && value > 0)
      .map(([ability, value]) => `${ability} +${value}`);
    return increases.length > 0 ? increases.join(", ") : "None";
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{race.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {race.size}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Gauge className="w-4 h-4" />
              {race.speed} ft
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getSourceBadgeColor(
              race.source
            )}`}
          >
            {race.source}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
            {race.edition}
          </span>
        </div>
      </div>

      {/* Ability Score Increases */}
      <div className="mb-3 p-2 bg-green-50 rounded-lg">
        <p className="text-sm text-gray-900">
          <span>Ability Scores: </span>
          <span className="text-green-700">{getAbilityScoreText()}</span>
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">
        {expanded
          ? race.description
          : `${race.description.substring(0, 120)}${
              race.description.length > 120 ? "..." : ""
            }`}
      </p>

      {race.description.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 mb-3"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Traits */}
      {expanded && race.traits && race.traits.length > 0 && (
        <div className="mt-3 mb-3">
          <p className="text-sm text-gray-900 mb-1">Racial Traits:</p>
          <div className="flex flex-wrap gap-2">
            {race.traits.map((trait, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Languages className="w-4 h-4 mt-0.5" />
          <span>{race.languages.join(", ")}</span>
        </div>
      </div>

      {/* Subraces */}
      {race.subraces && race.subraces.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-600">
            <span>Subraces: </span>
            <span className="text-gray-900">{race.subraces.length} available</span>
          </p>
        </div>
      )}
    </div>
  );
}