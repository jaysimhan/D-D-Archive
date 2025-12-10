import { Subclass } from "../types/dnd-types";
import { Sparkles, BookOpen } from "lucide-react";
import { useState } from "react";

interface SubclassCardProps {
  subclass: Subclass;
}

export function SubclassCard({ subclass }: SubclassCardProps) {
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
          <h3 className="text-gray-900 mb-1">{subclass.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {subclass.parentClassId.charAt(0).toUpperCase() +
                subclass.parentClassId.slice(1)}{" "}
              Subclass
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getSourceBadgeColor(
              subclass.source
            )}`}
          >
            {subclass.source}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
            {subclass.edition}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">
        {expanded
          ? subclass.description
          : `${subclass.description.substring(0, 120)}${
              subclass.description.length > 120 ? "..." : ""
            }`}
      </p>

      {subclass.description.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 mb-3"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Key Features */}
      {expanded && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Key Features:
          </p>
          <div className="space-y-1">
            {subclass.features.slice(0, 4).map((feature, i) => (
              <div key={i} className="text-sm pl-3 border-l-2 border-purple-500">
                <span className="text-gray-900">{feature.name}</span>
                <span className="text-gray-600"> (Level {feature.level})</span>
              </div>
            ))}
            {subclass.features.length > 4 && (
              <p className="text-xs text-gray-500 pl-3">
                +{subclass.features.length - 4} more features...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Feature Count */}
      {!expanded && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span>Features: </span>
            <span className="text-gray-900">{subclass.features.length} total</span>
          </p>
        </div>
      )}
    </div>
  );
}
