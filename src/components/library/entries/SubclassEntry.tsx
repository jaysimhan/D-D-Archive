import type { Subclass, Spell } from "../../../types/dnd-types";
import type { LibraryData } from "../useLibraryData";
import { entryPath } from "../categories";
import { SUBCLASS_RULES } from "../../../data/proficiency-rules";
import { HeroImage, Section, Prose, StatGrid, SourceTags, LinkChips, FeaturesByLevel, ProficiencyRules, SpellGrants, EntryLink, titleCase } from "./parts";

export function SubclassEntry({ subclass, data, spellIndex }: { subclass: Subclass; data: LibraryData; spellIndex: Map<string, Spell> }) {
  const parent = data.classes.find((c) => c.id === subclass.parentClassId);
  const siblings = data.subclasses.filter((other) => other.parentClassId === subclass.parentClassId && other.id !== subclass.id);
  const grantedSpells = data.spells.filter((spell) => (spell.subclasses || []).includes(subclass.id));
  const leveledGrants = SUBCLASS_RULES[subclass.id] || [];
  const levels = (subclass.features || []).map((feature) => feature.level).filter(Boolean);

  return (
    <div className="space-y-6">
      <HeroImage image={subclass.image} alt={subclass.name} />
      <SourceTags entity={subclass} />
      <Prose text={subclass.description} className="max-w-3xl" />

      <StatGrid
        stats={[
          { label: "Class", value: <EntryLink category="classes" id={parent?.id}>{parent?.name ?? titleCase(subclass.parentClassId || "Unknown")}</EntryLink> },
          { label: "Feature Levels", value: levels.length ? Array.from(new Set(levels)).sort((a, b) => a - b).join(", ") : undefined },
          { label: "Spellcasting", value: subclass.magicType || (subclass.isSpellcaster ? "Yes" : undefined) },
          { label: "Casting Ability", value: subclass.magicAbility || subclass.spellcastingAbility },
        ]}
      />

      {subclass.magicDescription && (
        <Section title="Spellcasting">
          <Prose text={subclass.magicDescription} />
        </Section>
      )}

      <Section title="Subclass Features" aside={`${(subclass.features || []).length} recorded`}>
        <FeaturesByLevel features={subclass.features} />
      </Section>

      {((subclass.proficiencies || []).length > 0 || leveledGrants.length > 0) && (
        <Section title="Proficiencies Gained">
          <ProficiencyRules rules={subclass.proficiencies} />
          {leveledGrants.length > 0 && (
            <ul className="space-y-1.5 text-sm text-gray-300 mt-2">
              {leveledGrants.map((grant, i) => {
                const parts = [
                  grant.grant.armor?.join(", "),
                  grant.grant.weapons?.join(", "),
                  grant.grant.tools?.join(", "),
                  grant.grant.skills?.join(", "),
                  grant.grant.languages?.join(", "),
                  ...(grant.grant.choices || []).map((choice) => `choose ${choice.count} ${choice.optionsLabel ?? choice.kind}${choice.options?.length && !choice.optionsLabel ? ` (${choice.options.join(", ")})` : ""}`),
                ].filter(Boolean);
                return (
                  <li key={i}><span className="text-brand-300">{grant.feature} (level {grant.level}): </span>{parts.join("; ")}</li>
                );
              })}
            </ul>
          )}
        </Section>
      )}

      {(subclass.spells || []).length > 0 && (
        <Section title="Spells Granted">
          <SpellGrants grants={subclass.spells} spellIndex={spellIndex} />
        </Section>
      )}

      {grantedSpells.length > 0 && (
        <Section title="Expanded Spell List" aside={`${grantedSpells.length} spells`}>
          <LinkChips links={grantedSpells
            .slice()
            .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
            .map((spell) => ({ key: spell.id, label: `${spell.name}${spell.level ? ` (${spell.level})` : " (cantrip)"}`, to: entryPath("spells", spell.id) }))} />
        </Section>
      )}

      {siblings.length > 0 && (
        <Section title={`Other ${parent?.name ?? titleCase(subclass.parentClassId)} Subclasses`}>
          <LinkChips links={siblings.map((other) => ({ key: other.id, label: other.name, to: entryPath("subclasses", other.id) }))} />
        </Section>
      )}
    </div>
  );
}
