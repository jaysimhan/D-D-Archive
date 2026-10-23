// Compare resolved content, not the underlying override containers or metadata.
const metadata = new Set(["rules2014", "rules2024", "sameForBoth", "rulesets", "ruleset", "rulesetKeys", "edition", "version", "versionNotes", "source", "sourceBook"]);
function content(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(content);
  if (value && typeof value === "object") return Object.fromEntries(
    Object.entries(value).filter(([key]) => !key.startsWith("_") && !metadata.has(key))
      .sort(([a], [b]) => a.localeCompare(b)).map(([key, entry]) => [key, content(entry)]),
  );
  return value;
}
export function editionsDiffer(legacy: unknown, modern: unknown): boolean {
  return !!legacy && !!modern && JSON.stringify(content(legacy)) !== JSON.stringify(content(modern));
}
