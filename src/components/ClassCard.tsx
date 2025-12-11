import { Class } from "../types/dnd-types";
import { Sword, Sparkles, Heart, Shield } from "lucide-react";
import { useState } from "react";

interface ClassCardProps {
  classData: Class;
}

export function ClassCard({ classData }: ClassCardProps) {
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

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{classData.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {classData.spellcaster && (
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {classData.spellcaster.charAt(0).toUpperCase() +
                  classData.spellcaster.slice(1)}{" "}
                Caster
              </span>
            )}
            {!classData.spellcaster && (
              <span className="flex items-center gap-1">
                <Sword className="w-4 h-4" />
                Martial
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getSourceBadgeColor(
              classData.source
            )}`}
          >
            {classData.source}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
            {classData.edition}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1 text-gray-700">
          <Heart className="w-4 h-4 text-red-500" />
          <span>d{classData.hitDie || 6}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-700">
          <Shield className="w-4 h-4 text-blue-500" />
          <span>
            Saves: {classData.savingThrows?.join(", ") || "None"}
          </span>
        </div>
      </div>

      {/* Primary Abilities */}
      <div className="mb-3">
        <span className="text-sm text-gray-600">Primary: </span>
        <span className="text-sm text-gray-900">
          {classData.primaryAbility?.join(" or ") || "None"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">
        {expanded
          ? classData.description
          : `${classData.description.substring(0, 120)}${classData.description.length > 120 ? "..." : ""
          }`}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-blue-600 hover:text-blue-800 mb-3 flex items-center gap-1"
      >
        {expanded ? "Show Less" : "Show Details"}
      </button>

      {/* Key Features */}
      {expanded && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-gray-900">Key Features:</p>
          <div className="space-y-1">
            {classData.features.map((feature, i) => (
              <div key={i} className="text-sm pl-3 border-l-2 border-blue-500">
                <span className="text-gray-900">{feature.name}</span>
                <span className="text-gray-600"> (Level {feature.level})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subclasses */}
      {classData.subclasses && classData.subclasses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span>Subclasses: </span>
            <span className="text-gray-900">{classData.subclasses.length} available</span>
          </p>
        </div>
      )}
    </div>
  );
}