import { Class } from "../types/dnd-types";
import { Sword, Sparkles, Heart, Shield } from "lucide-react";
import { useState } from "react";
import { casterType, CASTER_TYPE_LABELS } from "../utils/search-utils";
import { EditionBadge, SourceBadge } from "./library/CardBadges";
import SanityImage from "./SanityImage";
import { CardTitle, ViewEntryLink } from "./library/ViewEntryLink";

interface ClassCardProps {
  classData: Class;
  /** The class's own page, when shown in the Library. */
  href?: string;
}

export function ClassCard({ classData, href }: ClassCardProps) {
  const [expanded, setExpanded] = useState(false);


  return (
    <div className="h-full flex flex-col border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
      {/* Image Section */}
      {classData.image && (
        <div className="w-full aspect-[3/2] rounded-lg mb-3 overflow-hidden bg-black/40 border border-zinc-800">
          <SanityImage
            imageAsset={classData.image}
            alt={classData.name}
            width={600}
            height={400}
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-100 mb-1 font-serif break-words"><CardTitle href={href}>{classData.name}</CardTitle></h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              {casterType(classData) !== "martial" ? (
                <span className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  {CASTER_TYPE_LABELS[casterType(classData)]}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Sword className="w-4 h-4 text-gray-500" />
                  Martial
                </span>
              )}
            </div>
          </div>
          <EditionBadge edition={classData.edition} />
        </div>
        <SourceBadge entity={classData} />
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm">
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
      <p className={`text-sm text-gray-300 mb-3 ${expanded ? "" : "line-clamp-3"}`}>{classData.description}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="self-start text-sm text-brand-400 hover:text-brand-300 mb-3 flex items-center gap-1"
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

      {/* Pushes the footer to the bottom so cards in a row line up */}
      <div className="flex-1" />

      {/* Subclasses */}
      {classData.subclasses && classData.subclasses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-800">
          <p className="text-xs text-gray-500">
            <span>Subclasses: </span>
            <span className="text-gray-300">{classData.subclasses.length} available</span>
          </p>
        </div>
      )}
      <ViewEntryLink href={href} />
    </div>
  );
}