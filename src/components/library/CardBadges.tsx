import type { Edition } from "../../types/dnd-types";
import { sourceLabel, sourceBadgeColor, type HasSource } from "../../utils/source-label";

export function editionLabel(edition?: Edition | string): string {
  return edition === "Both" ? "2014 & 2024" : edition || "—";
}

/** The rules edition, as a small pill that sits beside a card's title. */
export function EditionBadge({ edition }: { edition?: Edition | string }) {
  return (
    <span
      title={edition === "Both" ? "Works with the 2014 and 2024 rules" : `${edition} rules`}
      className="text-[11px] leading-none px-2 py-1 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700 whitespace-nowrap shrink-0"
    >
      {editionLabel(edition)}
    </span>
  );
}

/** The book an entry comes from, on one line; the full name shows on hover when it is cut short. */
export function SourceBadge({ entity }: { entity: HasSource }) {
  const label = sourceLabel(entity);
  return (
    <span
      title={label}
      className={`inline-block self-start w-fit max-w-full truncate align-top text-[11px] leading-none px-2 py-1 rounded-full ${sourceBadgeColor(entity.source)}`}
    >
      {label}
    </span>
  );
}
