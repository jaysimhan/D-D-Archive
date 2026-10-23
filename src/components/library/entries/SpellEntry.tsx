import { Zap, Sparkles } from "lucide-react";
import type { Spell } from "../../../types/dnd-types";
import type { LibraryData } from "../useLibraryData";
import { entryPath } from "../categories";
import { Section, Prose, StatGrid, Tag, SourceTags, LinkChips, titleCase, ordinal } from "./parts";

function components(spell: Spell): string {
  const parts = [
    spell.components?.verbal && "V",
    spell.components?.somatic && "S",
    spell.components?.material && "M",
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "None";
}

export function SpellEntry({ spell, data }: { spell: Spell; data: LibraryData }) {
  const classLinks = (spell.classes || []).map((classId) => {
    const match = data.classes.find((c) => c.id === classId.toLowerCase());
    return { key: classId, label: match?.name ?? titleCase(classId), to: match ? entryPath("classes", match.id) : undefined };
  });
  const subclassLinks = (spell.subclasses || []).map((subclassId) => {
    const match = data.subclasses.find((s) => s.id === subclassId);
    return { key: subclassId, label: match?.name ?? titleCase(subclassId), to: match ? entryPath("subclasses", match.id) : undefined };
  });
  // Neighbours at the same level and school, for browsing sideways.
  const related = data.spells
    .filter((other) => other.id !== spell.id && other.level === spell.level && other.school === spell.school)
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-300 italic">
          {spell.level === 0 ? `${spell.school} cantrip` : `${ordinal(spell.level)}-level ${spell.school.toLowerCase()}`}
        </span>
        {spell.concentration && <Tag tone="amber"><Zap className="w-3 h-3 mr-1" />Concentration</Tag>}
        {spell.ritual && <Tag tone="brand"><Sparkles className="w-3 h-3 mr-1" />Ritual</Tag>}
      </div>
      <SourceTags entity={spell} />

      <StatGrid
        stats={[
          { label: "Casting Time", value: spell.castingTime },
          { label: "Range", value: spell.range },
          { label: "Components", value: components(spell) },
          { label: "Duration", value: spell.concentration && !/concentration/i.test(spell.duration || "") ? `Concentration, ${spell.duration}` : spell.duration },
        ]}
      />

      {spell.components?.material && spell.components.materialDescription && (
        <p className="text-sm text-gray-400"><span className="text-gray-300">Material: </span>{spell.components.materialDescription}</p>
      )}

      <Section title="Description">
        <Prose text={spell.description} />
        {spell.higherLevels && (
          <div className="mt-4 p-3 bg-brand-950/30 rounded-lg border border-brand-900/50">
            <p className="text-sm font-medium text-gray-100 mb-1">{spell.level === 0 ? "Cantrip Upgrade" : "Using a Higher-Level Spell Slot"}</p>
            <Prose text={spell.higherLevels} className="text-sm" />
          </div>
        )}
      </Section>

      {(classLinks.length > 0 || subclassLinks.length > 0) && (
        <Section title="Who Can Cast It">
          {classLinks.length > 0 && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Class spell lists</p>
              <LinkChips links={classLinks} />
            </div>
          )}
          {subclassLinks.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Granted by subclasses</p>
              <LinkChips links={subclassLinks} />
            </div>
          )}
        </Section>
      )}

      {related.length > 0 && (
        <Section title={`More ${spell.level === 0 ? "" : `${ordinal(spell.level)}-Level `}${spell.school} ${spell.level === 0 ? "Cantrips" : "Spells"}`}>
          <LinkChips links={related.map((other) => ({ key: other.id, label: other.name, to: entryPath("spells", other.id) }))} />
        </Section>
      )}
    </div>
  );
}
