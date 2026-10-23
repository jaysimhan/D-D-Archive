import type { Background } from "../../../types/dnd-types";
import { entryPath } from "../categories";
import { Section, Prose, StatGrid, SourceTags, LinkChips, FeaturesByLevel, ProficiencyRules } from "./parts";

export function BackgroundEntry({ background }: { background: Background }) {
  const feats = (background.feats || []).filter((feat) => feat?.id);
  const expanded = (background.expandedSpells || []).filter((spell) => spell?.id);

  return (
    <div className="space-y-6">
      <SourceTags entity={background} />
      <Prose text={background.description} className="max-w-3xl" />

      <StatGrid
        stats={[
          { label: "Skills", value: background.skillProficiencies?.join(", ") || undefined },
          { label: "Tools", value: background.toolProficiencies?.join(", ") || undefined },
          { label: "Languages", value: background.languages ? `${background.languages} of your choice` : undefined },
          { label: "Feat", value: feats.length ? feats.map((feat) => feat.name).join(", ") : undefined },
        ]}
      />

      {(background.proficiencies || []).length > 0 && (
        <Section title="Proficiencies">
          <ProficiencyRules rules={background.proficiencies} />
        </Section>
      )}

      {background.feature?.name && (
        <Section title={`Feature: ${background.feature.name}`}>
          <Prose text={background.feature.description} />
        </Section>
      )}

      {(background.equipment || []).length > 0 && (
        <Section title="Starting Equipment">
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            {background.equipment.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Section>
      )}

      {(background.traits || []).length > 0 && (
        <Section title="Traits">
          <FeaturesByLevel features={background.traits!.map((trait) => ({ ...trait, level: 0 }))} />
        </Section>
      )}

      {feats.length > 0 && (
        <Section title="Feat Granted">
          <LinkChips links={feats.map((feat) => ({ key: feat.id, label: feat.name, to: entryPath("feats", feat.id) }))} />
        </Section>
      )}

      {expanded.length > 0 && (
        <Section title="Expanded Spells" aside="Added to your class spell list">
          <LinkChips links={expanded.map((spell) => ({ key: spell.id, label: spell.name, to: entryPath("spells", spell.id) }))} />
        </Section>
      )}
    </div>
  );
}
