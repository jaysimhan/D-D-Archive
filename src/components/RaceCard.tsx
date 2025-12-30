import { Race } from "../types/dnd-types";
import { Users, Gauge, Languages } from "lucide-react";
import { useState } from "react";
import { urlFor } from "../lib/sanity";

interface RaceCardProps {
  race: Race;
}

export function RaceCard({ race }: RaceCardProps) {
  const [expanded, setExpanded] = useState(false);

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

  const getAbilityScoreText = () => {
    // Check if race uses flexible ability scores (Tasha's rules)
    if (race.flexibleAbilityScores) {
      return "+2/+1 or +1/+1/+1";
    }
    if (!race.abilityScoreIncrease) {
      return "None";
    }
    const increases = Object.entries(race.abilityScoreIncrease)
      .filter(([_, value]) => value && value > 0)
      .map(([ability, value]) => `${ability} +${value}`);
    return increases.length > 0 ? increases.join(", ") : "None";
  };

  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
      {/* Image Section */}
      {race.image && (
        <div className="w-full aspect-[3/2] rounded-lg mb-3 overflow-hidden bg-black/40 border border-zinc-800">
          <img
            src={urlFor(race.image)?.width(600).height(400).url() || ''}
            alt={race.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-gray-100 mb-1 font-serif">{race.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
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
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700">
            {race.edition}
          </span>
        </div>
      </div>

      {/* Ability Score Increases */}
      <div className="mb-3 p-2 bg-green-950/30 rounded-lg border border-green-800/50">
        <p className="text-sm text-gray-200">
          <span>Ability Scores: </span>
          <span className="text-green-400">{getAbilityScoreText()}</span>
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">
        {expanded
          ? race.description
          : `${race.description.substring(0, 120)}${race.description.length > 120 ? "..." : ""
          }`}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-brand-400 hover:text-brand-300 mb-3 flex items-center gap-1"
      >
        {expanded ? "Show Less" : "Show Details"}
      </button>

      {/* Traits */}
      {expanded && race.traits && race.traits.length > 0 && (
        <div className="mt-3 mb-3">
          <p className="text-sm text-gray-200 mb-1">Racial Traits:</p>
          <div className="space-y-3">
            {(race.traits || []).map((trait, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-gray-200 block">{trait.name}</span>
                <span className="text-gray-400">{trait.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      <div className="mt-3 pt-3 border-t border-zinc-800">
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <Languages className="w-4 h-4 mt-0.5" />
          <span>{(race.languages || []).join(", ")}</span>
        </div>
      </div>

      {/* Subraces */}
      {race.subraces && race.subraces.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">
            <span>Subraces: </span>
            <span className="text-gray-300">{race.subraces.length} available</span>
          </p>
        </div>
      )}
    </div>
  );
}