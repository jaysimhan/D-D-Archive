import { Spell } from "../types/dnd-types";
import { Sparkles, Clock, Target, Zap } from "lucide-react";
import { useState } from "react";
import { EditionBadge, SourceBadge } from "./library/CardBadges";
import { slugLabel } from "../utils/search-utils";
import { CardTitle, ViewEntryLink } from "./library/ViewEntryLink";

interface SpellCardProps {
  spell: Spell;
  /** The spell's own page, when shown in the Library. */
  href?: string;
}

export function SpellCard({ spell, href }: SpellCardProps) {
  const [expanded, setExpanded] = useState(false);

  const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;


  return (
    <div className="h-full flex flex-col border border-zinc-800 rounded-lg p-4 hover:shadow-lg hover:shadow-brand-900/20 transition-shadow bg-zinc-900/60">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-100 mb-1 font-serif break-words"><CardTitle href={href}>{spell.name}</CardTitle></h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{levelText}</span>
              <span>•</span>
              <span>{spell.school}</span>
            </div>
          </div>
          <EditionBadge edition={spell.edition} />
        </div>
        <SourceBadge entity={spell} />
      </div>

      {/* Quick Info Icons */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3 text-sm text-gray-400">
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
        {!spell.components?.verbal && !spell.components?.somatic && !spell.components?.material && <span className="text-gray-500 italic">None</span>}
      </div>

      {/* Description */}
      <p className={`text-sm text-gray-300 mb-3 ${expanded ? "" : "line-clamp-3"}`}>{spell.description}</p>

      {spell.description.length > 150 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="self-start text-sm text-brand-400 hover:text-brand-300 mb-3"
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

      {/* Pushes the footer to the bottom so cards in a row line up */}
      <div className="flex-1" />

      {/* Classes that can cast this spell */}
      <div className="mt-3 pt-3 border-t border-zinc-800">
        <p className="text-xs text-gray-500">
          <span>Available to: </span>
          {(spell.classes || []).map((c, i) => (
            <span key={c} className="text-gray-400">
              {slugLabel(c)}
              {i < (spell.classes || []).length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        {(spell.subclasses?.length || 0) > 0 && (
          <p className="mt-1 text-xs text-gray-500">
            <span>Granted by: </span>
            {spell.subclasses!.map((subclass, index) => (
              <span key={subclass} className="text-gray-400">
                {subclass.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                {index < spell.subclasses!.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </div>
      <ViewEntryLink href={href} />
    </div>
  );
}
