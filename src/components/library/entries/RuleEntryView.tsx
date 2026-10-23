import type { RuleEntry } from "../../../data/srd-rules-reference";
import { WEAPONS, type WeaponStats } from "../../../data/srd-equipment";
import type { LibraryData } from "../useLibraryData";
import { entryPath } from "../categories";
import { itemKey } from "../library-items";
import { Section, LinkChips, Tag } from "./parts";

/** Whether a weapon has the property, mastery or damage type a rules entry describes. */
function weaponMatches(rule: RuleEntry, weapon: WeaponStats): boolean {
  switch (rule.kind) {
    case "Weapon Mastery":
      return weapon.mastery === rule.weaponKey;
    case "Damage Type":
      return weapon.damageType === rule.weaponKey;
    case "Weapon Property":
      if (rule.weaponKey === "ammunition") return Boolean(weapon.range && !weapon.thrown);
      if (rule.weaponKey === "range") return Boolean(weapon.range);
      return Boolean(weapon[rule.weaponKey as keyof WeaponStats]);
    default:
      return false;
  }
}

export function RuleEntryView({ rule, data }: { rule: RuleEntry; data: LibraryData }) {
  const itemsByKey = new Map(data.items.map((item) => [itemKey(item.name), item]));
  const weapons = rule.kind === "Condition" ? [] : WEAPONS.filter((weapon) => weaponMatches(rule, weapon));
  const keywords = rule.keywords || [];
  const spells = keywords.length
    ? data.spells.filter((spell) => {
        const text = `${spell.description} ${spell.higherLevels ?? ""}`.toLowerCase();
        return keywords.some((keyword) => text.includes(keyword));
      })
    : [];
  const siblings = data.rules.filter((other) => other.kind === rule.kind && other.id !== rule.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Tag tone="amber">{rule.kind}</Tag>
        <Tag>System Reference Document 5.2</Tag>
      </div>

      <Section title="Rules">
        <ul className="space-y-3">
          {rule.rules.map((line, i) => (
            <li key={i} className="flex gap-3 text-gray-300 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        {rule.note2014 && (
          <div className="mt-4 p-3 rounded-lg border border-zinc-700 bg-zinc-950/40 text-sm text-gray-400">
            <span className="text-gray-200 font-medium">2014 rules: </span>{rule.note2014}
          </div>
        )}
      </Section>

      {weapons.length > 0 && (
        <Section title="Weapons" aside={`${weapons.length} weapons`}>
          <LinkChips links={weapons.map((weapon) => {
            const item = itemsByKey.get(itemKey(weapon.name));
            return { key: weapon.name, label: weapon.name, to: item ? entryPath("equipment", item.id) : undefined };
          })} />
        </Section>
      )}

      {spells.length > 0 && (
        <Section title="Spells That Mention It" aside={`${spells.length} spells`}>
          <LinkChips links={spells.map((spell) => ({ key: spell.id, label: spell.name, to: entryPath("spells", spell.id) }))} />
        </Section>
      )}

      {siblings.length > 0 && (
        <Section title={`Other ${rule.kind === "Weapon Property" ? "Weapon Properties" : `${rule.kind}s`}`}>
          <LinkChips links={siblings.map((other) => ({ key: other.id, label: other.name, to: entryPath("rules", other.id) }))} />
        </Section>
      )}
    </div>
  );
}
