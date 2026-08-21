/**
 * `source` is the filterable Official/Unofficial/Homebrew classification; `sourceBook`
 * carries the attribution behind it ("Xanathar's Guide to Everything", "Kobold Press").
 * Badges show the book when there is one, since it is the more useful label, and fall
 * back to the classification for SRD content that names no particular book.
 */
export interface HasSource {
  source?: string;
  sourceBook?: string;
}

export function sourceLabel(entity: HasSource): string {
  return entity.sourceBook || entity.source || "Unofficial";
}

/** Colour keys off `source`, not the label, so every third-party book shares one style. */
export function sourceBadgeColor(source?: string): string {
  switch (source) {
    case "Official":
      return "bg-blue-900/50 text-blue-300 border border-blue-700";
    case "Homebrew":
      return "bg-brand-900/50 text-brand-300 border border-brand-700";
    default:
      return "bg-zinc-800 text-gray-400 border border-zinc-700";
  }
}
