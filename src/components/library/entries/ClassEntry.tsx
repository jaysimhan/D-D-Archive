import type { Class, Spell, SpellGrant } from "../../../types/dnd-types";
import { SPELL_SLOTS_BY_LEVEL } from "../../../types/dnd-types";
import type { LibraryData } from "../useLibraryData";
import { entryPath } from "../categories";
import { classRulesFor, type RuleGrant } from "../../../data/proficiency-rules";
import { grantRows } from "../../../utils/proficiency-plan";
import { proficiencyBonusAtLevel } from "../../../utils/combat-progression";
import { subclassLevelFor } from "../../../utils/class-progression";
import { HeroImage, Section, Prose, StatGrid, SourceTags, LinkChips, FeaturesByLevel, ProficiencyRules, SpellGrants, featureAnchor, titleCase, ordinal } from "./parts";

const CASTER_LABEL: Record<string, string> = {
  full: "Full caster",
  half: "Half caster",
  "half-up": "Half caster",
  third: "Third caster",
  pact: "Pact Magic",
  special: "Special",
};

/** Which slot table a caster type follows; pact and special casters keep their own. */
const SLOT_TABLE: Record<string, keyof typeof SPELL_SLOTS_BY_LEVEL> = { full: "full", half: "half", "half-up": "half", third: "third" };

function RuleGrantList({ grant }: { grant: RuleGrant }) {
  const rows = grantRows(grant);
  if (rows.length === 0) return null;
  return (
    <ul className="space-y-1.5 text-sm text-gray-300">
      {rows.map(({ label, value }) => (
        <li key={label}><span className="text-brand-300">{label}: </span>{value}</li>
      ))}
    </ul>
  );
}

/** Level-by-level table: proficiency bonus, features, the class's own resources, and spell slots. */
function ProgressionTable({ classData }: { classData: Class }) {
  const byLevel = new Map<number, string[]>();
  for (const feature of classData.features || []) {
    if (!feature?.name) continue;
    const level = feature.level || 1;
    byLevel.set(level, [...(byLevel.get(level) || []), feature.name]);
  }
  const progression = new Map((classData.progression || []).map((row) => [row.level, row]));
  const resourceNames = Array.from(new Set((classData.progression || []).flatMap((row) => (row.resources || []).map((r) => r.name))));
  const slotTable = SLOT_TABLE[String(classData.spellcaster)];
  const slots = slotTable ? SPELL_SLOTS_BY_LEVEL[slotTable] : undefined;
  const maxSlotLevel = slots ? Math.max(...Object.values(slots).flatMap((row) => row.map((count, i) => (count > 0 ? i + 1 : 0)))) : 0;

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm border-collapse min-w-[560px]">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-zinc-800">
            <th className="py-2 pr-3 font-medium">Level</th>
            <th className="py-2 pr-3 font-medium">Prof.</th>
            <th className="py-2 pr-3 font-medium">Features</th>
            {resourceNames.map((name) => <th key={name} className="py-2 pr-3 font-medium whitespace-nowrap">{name}</th>)}
            {slots && Array.from({ length: maxSlotLevel }, (_, i) => (
              <th key={i} className="py-2 px-1 font-medium text-center">{ordinal(i + 1)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => {
            const row = progression.get(level);
            const names = row?.featureNames?.length ? row.featureNames : byLevel.get(level) || [];
            return (
              <tr key={level} className="border-b border-zinc-800/60 align-top">
                <td className="py-2 pr-3 text-gray-200 whitespace-nowrap">{ordinal(level)}</td>
                <td className="py-2 pr-3 text-gray-400">+{row?.proficiencyBonus ?? proficiencyBonusAtLevel(level)}</td>
                <td className="py-2 pr-3 text-gray-300">
                  {names.length === 0 ? <span className="text-gray-600">—</span> : names.map((name, j) => (
                    <span key={j}>
                      {j > 0 && ", "}
                      <a href={`#${featureAnchor({ name, level })}`} className="hover:text-brand-300">{name}</a>
                    </span>
                  ))}
                </td>
                {resourceNames.map((name) => (
                  <td key={name} className="py-2 pr-3 text-gray-400 whitespace-nowrap">{row?.resources?.find((r) => r.name === name)?.value ?? "—"}</td>
                ))}
                {slots && Array.from({ length: maxSlotLevel }, (_, i) => (
                  <td key={i} className="py-2 px-1 text-center text-gray-400">{slots[level][i] || "—"}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ClassSpellList({ spells }: { spells: Spell[] }) {
  const byLevel = new Map<number, Spell[]>();
  for (const spell of spells) byLevel.set(spell.level, [...(byLevel.get(spell.level) || []), spell]);
  const levels = Array.from(byLevel.keys()).sort((a, b) => a - b);
  return (
    <div className="space-y-2">
      {levels.map((level) => (
        <details key={level} className="group rounded-lg border border-zinc-800 bg-zinc-950/40" open={level <= 1}>
          <summary className="cursor-pointer select-none px-4 py-2.5 text-sm text-gray-200 flex justify-between">
            <span>{level === 0 ? "Cantrips" : `${ordinal(level)} Level`}</span>
            <span className="text-gray-500">{byLevel.get(level)!.length}</span>
          </summary>
          <div className="px-4 pb-4">
            <LinkChips links={byLevel.get(level)!.map((spell) => ({ key: spell.id, label: spell.name, to: entryPath("spells", spell.id) }))} />
          </div>
        </details>
      ))}
    </div>
  );
}

export function ClassEntry({ classData, data, spellIndex }: { classData: Class; data: LibraryData; spellIndex: Map<string, Spell> }) {
  const subclasses = data.subclasses.filter((subclass) => subclass.parentClassId === classData.id);
  const classSpells = data.spells.filter((spell) => (spell.classes || []).includes(classData.id));
  const rules = classRulesFor(classData, data.ruleset);
  const hasSanityRules = (classData.proficiencies || []).length > 0;
  const caster = classData.spellcaster && !["none", "None"].includes(String(classData.spellcaster)) ? CASTER_LABEL[classData.spellcaster] ?? titleCase(String(classData.spellcaster)) : undefined;
  const subclassLevel = subclassLevelFor(classData, data.ruleset);
  const hitDie = classData.hitDie || 8;
  const grants = (classData as Class & { spells?: SpellGrant[] }).spells;

  return (
    <div className="space-y-6">
      <HeroImage image={classData.image} alt={classData.name} />
      <SourceTags entity={classData} />
      <Prose text={classData.description} className="max-w-3xl" />

      <StatGrid
        stats={[
          { label: "Hit Die", value: `d${hitDie} per level` },
          { label: "Primary Ability", value: classData.primaryAbility?.join(" or ") },
          { label: "Saving Throws", value: classData.savingThrows?.join(", ") },
          { label: "Spellcasting", value: caster ? `${caster}${classData.spellcastingAbility ? ` (${classData.spellcastingAbility})` : ""}` : "None" },
          { label: "Subclass At", value: `${ordinal(subclassLevel)} level` },
          { label: "Subclasses", value: subclasses.length || undefined },
          { label: "Class Spells", value: classSpells.length || undefined },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Hit Points">
          <ul className="space-y-1.5 text-sm text-gray-300">
            <li><span className="text-brand-300">Hit Dice: </span>1d{hitDie} per {classData.name.toLowerCase()} level</li>
            <li><span className="text-brand-300">At 1st level: </span>{hitDie} + your Constitution modifier</li>
            <li><span className="text-brand-300">Higher levels: </span>1d{hitDie} (or {hitDie / 2 + 1}) + your Constitution modifier per level</li>
          </ul>
        </Section>
        <Section title="Proficiencies">
          {classData.savingThrows?.length > 0 && (
            <p className="text-sm text-gray-300 mb-1.5"><span className="text-brand-300">Saving Throws: </span>{classData.savingThrows.join(", ")}</p>
          )}
          {hasSanityRules ? <ProficiencyRules rules={classData.proficiencies} /> : rules ? <RuleGrantList grant={rules.base} /> : (
            <p className="text-sm text-gray-500 italic">No proficiencies are recorded for this class yet.</p>
          )}
        </Section>
      </div>

      {(classData.startingEquipment || []).length > 0 && (
        <Section title="Starting Equipment">
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            {classData.startingEquipment!.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </Section>
      )}

      <Section title={`The ${classData.name} Table`}>
        <ProgressionTable classData={classData} />
      </Section>

      <Section title="Class Features" aside={`${(classData.features || []).length} recorded`}>
        <FeaturesByLevel features={classData.features} />
      </Section>

      {(classData.traits || []).length > 0 && (
        <Section title="Traits">
          <FeaturesByLevel features={classData.traits!.map((trait) => ({ ...trait, level: 0 }))} />
        </Section>
      )}

      {(grants || []).length > 0 && (
        <Section title="Spells Granted">
          <SpellGrants grants={grants} spellIndex={spellIndex} />
        </Section>
      )}

      {subclasses.length > 0 && (
        <Section title="Subclasses" aside={`Chosen at ${ordinal(subclassLevel)} level`}>
          <LinkChips links={subclasses.map((subclass) => ({ key: subclass.id, label: subclass.name, to: entryPath("subclasses", subclass.id) }))} />
        </Section>
      )}

      {classSpells.length > 0 && (
        <Section title="Spell List" aside={`${classSpells.length} spells`}>
          <ClassSpellList spells={classSpells} />
        </Section>
      )}
    </div>
  );
}
