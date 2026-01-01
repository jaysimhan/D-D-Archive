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
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-gray-100 mb-1 font-serif">{subclass.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-400" />
                {subclass.parentClassId.charAt(0).toUpperCase() +
                  subclass.parentClassId.slice(1)}{" "}
                Subclass
              </span>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700 shrink-0">
            {subclass.edition}
          </span>
        </div>
        {/* Source badge - separate row to accommodate long text */}
        <div
          className={`text-xs px-3 py-2 rounded-lg ${getSourceBadgeColor(
            subclass.source
          )} w-full`}
        >
          <span>{subclass.source}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">
        {expanded
          ? subclass.description
          : `${subclass.description.substring(0, 120)}${subclass.description.length > 120 ? "..." : ""
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
          <p className="text-sm text-gray-200 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Key Features:
          </p>
          <div className="space-y-3">
            {subclass.features.map((feature, i) => (
              <div key={i} className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700 shadow-sm">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold text-brand-400">{feature.name}</span>
                  <span className="text-xs text-gray-500 font-medium bg-zinc-900 px-2 py-0.5 rounded border border-zinc-700">Level {feature.level}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Count */}
      {!expanded && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p className="text-xs text-gray-500">
            <span>Features: </span>
            <span className="text-gray-300">{subclass.features.length} total</span>
          </p>
        </div>
      )}
    </div>
  );
}
