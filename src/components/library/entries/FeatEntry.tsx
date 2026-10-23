import type { Feat, Spell } from "../../../types/dnd-types";
import type { LibraryData } from "../useLibraryData";
import { entryPath } from "../categories";
import { Section, Prose, StatGrid, SourceTags, LinkChips, ProficiencyRules, SpellGrants, EntryLink, Tag, titleCase, ordinal } from "./parts";
import { featWeight } from "../../../utils/feats";

function prerequisiteLines(feat: Feat): string[] {
  const prereq = feat.prerequisites;
  if (!prereq) return [];
  return [
    prereq.level && prereq.level > 1 ? `${ordinal(prereq.level)} level` : undefined,
    ...abilityLines(prereq),
    prereq.race?.length ? `Race: ${prereq.race.map(titleCase).join(", ")}` : undefined,
    prereq.class?.length ? `Class: ${prereq.class.map(titleCase).join(", ")}` : undefined,
    ...(prereq.features || []).map((feature) => `Feature: ${feature}`),
  ].filter((line): line is string => Boolean(line));
}

/** "STR 13 or higher", or "STR or DEX 13 or higher" when any one will do. */
function abilityLines(prereq: NonNullable<Feat["prerequisites"]>): string[] {
  const entries = Object.entries(prereq.abilityScore || {}).filter(([, score]) => score);
  if (prereq.abilityScoreAnyOf && entries.length > 1) {
    return [`${orList(entries.map(([ability]) => ability))} ${entries[0][1]} or higher`];
  }
  return entries.map(([ability, score]) => `${ability} ${score} or higher`);
}

/** "INT, WIS, or CHA". */
function orList(options: string[]): string {
  if (options.length < 3) return options.join(" or ");
  return `${options.slice(0, -1).join(", ")}, or ${options[options.length - 1]}`;
}

export function FeatEntry({ feat, data, spellIndex }: { feat: Feat; data: LibraryData; spellIndex: Map<string, Spell> }) {
  const prerequisites = prerequisiteLines(feat);
  const benefits = feat.benefits || {};
  const fixedIncrease = Object.entries(benefits.abilityScoreIncrease || {}).map(([ability, amount]) => `${ability} +${amount}`);
  const flexible = benefits.flexibleAbilityIncrease;
  const backgrounds = data.backgrounds.filter((background) => (background.feats || []).some((granted) => granted?.id === feat.id));
  const weight = featWeight(feat);
  const sameCategory = data.feats.filter((other) => other.id !== feat.id && (other.featCategory ?? "General") === (feat.featCategory ?? "General")).slice(0, 16);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <SourceTags entity={feat} />
        <Tag tone="amber">{feat.featCategory ?? "General"} feat</Tag>
        <Tag tone={weight.kind === "half" ? "green" : "neutral"}>{weight.kind === "half" ? "Half feat" : "Full feat"}</Tag>
      </div>

      <StatGrid
        stats={[
          { label: "Category", value: feat.featCategory ?? "General" },
          { label: "Type", value: weight.kind === "half" ? "Half feat: a benefit plus +1 to an ability" : "Full feat: a benefit, no ability increase" },
          { label: "Prerequisite", value: prerequisites.length ? prerequisites.join("; ") : "None" },
          { label: "Ability Increase", value: fixedIncrease.length ? fixedIncrease.join(", ") : flexible ? `+${flexible.amount} to ${flexible.options?.length ? orList(flexible.options) : "any score"}` : undefined },
        ]}
      />

      <Section title="Description">
        <Prose text={feat.description} />
      </Section>

      {((benefits.features || []).length > 0 || (benefits.spells || []).length > 0) && (
        <Section title="Benefits">
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            {(benefits.features || []).map((line, i) => <li key={i}>{line}</li>)}
          </ul>
          {(benefits.spells || []).length > 0 && (
            <p className="text-sm text-gray-300 mt-3">
              <span className="text-brand-300">Spells: </span>
              {benefits.spells!.map((id, i) => (
                <span key={id}>{i > 0 && ", "}<EntryLink category="spells" id={spellIndex.has(id) ? id : undefined}>{spellIndex.get(id)?.name ?? titleCase(id)}</EntryLink></span>
              ))}
            </p>
          )}
        </Section>
      )}

      {(feat.grants || []).length > 0 && (
        <Section title="What It Grants">
          <ul className="space-y-2 text-sm text-gray-300">
            {feat.grants!.map((grant, i) => (
              <li key={i} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                {grant.grantType === "Specific Spell" && grant.grantedSpell && (
                  <>Learn <EntryLink category="spells" id={grant.grantedSpell.id}>{grant.grantedSpell.name}</EntryLink>{grant.slotCount ? `, castable ${grant.slotCount}× per long rest without a slot` : ""}.</>
                )}
                {grant.grantType === "Spell Slot" && (
                  <>
                    Learn {grant.slotCount ?? 1} {grant.slotLevel === 0 ? "cantrip" : `level ${grant.slotLevel ?? 1} spell`}
                    {grant.schoolRestrictions?.length ? ` from the ${grant.schoolRestrictions.join(" or ")} school` : ""}
                    {grant.classRestrictions?.length ? ` on the ${grant.classRestrictions.map(titleCase).join(" or ")} list` : ""}
                    {grant.spellRestrictions?.length ? (
                      <>: {grant.spellRestrictions.map((spell, j) => <span key={spell.id}>{j > 0 && ", "}<EntryLink category="spells" id={spell.id}>{spell.name}</EntryLink></span>)}</>
                    ) : "."}
                  </>
                )}
                {grant.grantType === "Resource Pool" && (
                  <>{grant.resourceName}: {grant.maxAmount ?? "—"} uses{grant.resetCondition ? `, regained on a ${grant.resetCondition}` : ""}.</>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {(feat.proficiencies || []).length > 0 && (
        <Section title="Proficiencies">
          <ProficiencyRules rules={feat.proficiencies} />
        </Section>
      )}

      {(feat.spells || []).length > 0 && (
        <Section title="Spells Granted">
          <SpellGrants grants={feat.spells} spellIndex={spellIndex} />
        </Section>
      )}

      {backgrounds.length > 0 && (
        <Section title="Granted By Backgrounds">
          <LinkChips links={backgrounds.map((background) => ({ key: background.id, label: background.name, to: entryPath("backgrounds", background.id) }))} />
        </Section>
      )}

      {sameCategory.length > 0 && (
        <Section title={`Other ${feat.featCategory ?? "General"} Feats`}>
          <LinkChips links={sameCategory.map((other) => ({ key: other.id, label: other.name, to: entryPath("feats", other.id) }))} />
        </Section>
      )}
    </div>
  );
}
