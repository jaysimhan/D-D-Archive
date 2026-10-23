import type { Race, Spell } from "../../../types/dnd-types";
import type { LibraryData } from "../useLibraryData";
import { entryPath } from "../categories";
import { HeroImage, Section, Prose, StatGrid, SourceTags, LinkChips, FeaturesByLevel, ProficiencyRules, SpellGrants, Tag, EntryLink, titleCase } from "./parts";

function abilityText(race: Race): string {
  const fixed = Object.entries(race.abilityScoreIncrease || {})
    .filter(([, value]) => value)
    .map(([ability, value]) => `${ability} ${value! > 0 ? "+" : ""}${value}`);
  if (race.flexibleAbilityScores) {
    return fixed.length ? `${fixed.join(", ")} — or +2/+1 (or +1/+1/+1) to any scores` : "+2/+1 or +1/+1/+1 to any scores";
  }
  return fixed.length ? fixed.join(", ") : "None";
}

export function RaceEntry({ race, data, spellIndex }: { race: Race; data: LibraryData; spellIndex: Map<string, Spell> }) {
  const subraces = (race.subraces || []).map((id) => {
    const match = data.races.find((other) => other.id === id);
    return { key: id, label: match?.name ?? titleCase(id), to: match ? entryPath("races", match.id) : undefined };
  });
  const knownSpells = race.racialKnownSpells || [];
  const spellChoices = race.racialSpellChoices || [];

  return (
    <div className="space-y-6">
      <HeroImage image={race.image} alt={race.name} />
      <div className="flex flex-wrap gap-2 items-center">
        <SourceTags entity={race} />
        {race.isCore && <Tag tone="blue">Core ancestry</Tag>}
      </div>
      <Prose text={race.description} className="max-w-3xl" />

      <StatGrid
        stats={[
          { label: "Ability Scores", value: abilityText(race) },
          { label: "Size", value: race.size },
          { label: "Speed", value: race.speed ? `${race.speed} ft.` : undefined },
          { label: "Languages", value: (race.languages || []).join(", ") || undefined },
          { label: "Spellcasting", value: race.isSpellcaster ? "Innate spells" : undefined },
        ]}
      />

      <Section title="Traits" aside={`${(race.traits || []).length} traits`}>
        <FeaturesByLevel features={(race.traits || []).map((trait) => ({ ...trait, level: 0 }))} />
      </Section>

      {(race.proficiencies || []).length > 0 && (
        <Section title="Proficiencies">
          <ProficiencyRules rules={race.proficiencies} />
        </Section>
      )}

      {((race.spells || []).length > 0 || knownSpells.length > 0 || spellChoices.length > 0) && (
        <Section title="Innate Spellcasting">
          <SpellGrants grants={race.spells} spellIndex={spellIndex} />
          {knownSpells.length > 0 && (
            <ul className="space-y-1.5 text-sm text-gray-300 mt-3">
              {knownSpells.map((known, i) => {
                const spell = spellIndex.get(known.spellId);
                return (
                  <li key={i}>
                    <span className="text-brand-300">Level {known.level}: </span>
                    <EntryLink category="spells" id={spell?.id}>{known.name || spell?.name || titleCase(known.spellId)}</EntryLink>
                    {known.type && <span className="text-gray-500"> ({known.type})</span>}
                  </li>
                );
              })}
            </ul>
          )}
          {spellChoices.length > 0 && (
            <ul className="space-y-1.5 text-sm text-gray-300 mt-3">
              {spellChoices.map((choice, i) => (
                <li key={i}><span className="text-brand-300">{choice.name}: </span>choose {choice.choose}{choice.school ? ` ${choice.school}` : ""}{choice.level === 0 ? " cantrip" : choice.level ? ` spell up to level ${choice.level}` : ""}</li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {subraces.length > 0 && (
        <Section title="Subraces">
          <LinkChips links={subraces} />
        </Section>
      )}
    </div>
  );
}
