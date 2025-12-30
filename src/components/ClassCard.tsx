import { Class } from "../types/dnd-types";
import { Sword, Sparkles, Heart, Shield, User } from "lucide-react";
import { useState } from "react";
import { urlFor } from "../lib/sanity";

interface ClassCardProps {
  classData: Class;
}

export function ClassCard({ classData }: ClassCardProps) {
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

  return (
    <div className="border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
      {/* Image Section */}
      {classData.image && (
        <div className="w-full aspect-[3/2] rounded-lg mb-3 overflow-hidden bg-black/40 border border-zinc-800">
          <img
            src={urlFor(classData.image)?.width(600).height(400).url() || ''}
            alt={classData.name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-gray-100 mb-1 font-serif">{classData.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {classData.spellcaster && (
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-400" />
                {classData.spellcaster.charAt(0).toUpperCase() +
                  classData.spellcaster.slice(1)}{" "}
                Caster
              </span>
            )}
            {!classData.spellcaster && (
              <span className="flex items-center gap-1">
                <Sword className="w-4 h-4 text-gray-500" />
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
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700">
            {classData.edition}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1 text-gray-400">
          <Heart className="w-4 h-4 text-brand-500" />
          <span>d{classData.hitDie || 6}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>
            Saves: {classData.savingThrows?.join(", ") || "None"}
          </span>
        </div>
      </div>

      {/* Primary Abilities */}
      <div className="mb-3">
        <span className="text-sm text-gray-500">Primary: </span>
        <span className="text-sm text-gray-300">
          {classData.primaryAbility?.join(" or ") || "None"}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">
        {expanded
          ? classData.description
          : `${classData.description.substring(0, 120)}${classData.description.length > 120 ? "..." : ""
          }`}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-brand-400 hover:text-brand-300 mb-3 flex items-center gap-1"
      >
        {expanded ? "Show Less" : "Show Details"}
      </button>

      {/* Key Features */}
      {expanded && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-gray-200">Key Features:</p>
          <div className="space-y-1">
            {(classData.features || []).map((feature, i) => (
              <div key={i} className="text-sm pl-3 border-l-2 border-brand-500">
                <span className="text-gray-200">{feature.name}</span>
                <span className="text-gray-500"> (Level {feature.level})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subclasses */}
      {classData.subclasses && classData.subclasses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p className="text-xs text-gray-500">
            <span>Subclasses: </span>
            <span className="text-gray-300">{classData.subclasses.length} available</span>
          </p>
        </div>
      )}
    </div>
  );
}