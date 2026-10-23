import type { Item } from "../../../types/dnd-types";
import type { LibraryData } from "../useLibraryData";
import { entryPath } from "../categories";
import { ARMOR, MAGIC_ITEMS, WEAPONS } from "../../../data/srd-equipment";
import { weaponProperties, armorClassText } from "../library-items";
import { formatCost, goldEquivalent } from "../../../utils/item-cost";
import { HeroImage, Section, Prose, StatGrid, SourceTags, LinkChips, EntryLink, Tag } from "./parts";

const RARITY_TONE: Record<string, string> = {
  Common: "text-gray-300",
  Uncommon: "text-green-400",
  Rare: "text-blue-400",
  "Very Rare": "text-purple-400",
  Legendary: "text-orange-400",
  Artifact: "text-brand-400",
};

const byName = <T extends { name: string }>(list: T[], name?: string) =>
  name ? list.find((entry) => entry.name.toLowerCase() === name.toLowerCase()) : undefined;

/** What an item's name says about its rules: the SRD weapon or armor it is, or is built on. */
function baseStats(item: Item) {
  const found = byName(MAGIC_ITEMS, item.name);
  // "Any Sword" means just that: the sheet's stand-in weapon would misstate the item's rules.
  const magic = item.baseItem && /^any\b/i.test(item.baseItem) && found ? { ...found, effect: { ...found.effect, weapon: undefined, armor: undefined } } : found;
  const weapon = byName(WEAPONS, item.name) ?? byName(WEAPONS, item.baseItem) ?? byName(WEAPONS, magic?.effect?.weapon)
    ?? WEAPONS.find((w) => item.type === "Weapon" && new RegExp(`\\b${w.name}\\b`, "i").test(item.name));
  const armor = byName(ARMOR, item.name) ?? byName(ARMOR, item.baseItem) ?? byName(ARMOR, magic?.effect?.armor)
    ?? ARMOR.find((a) => item.type === "Armor" && new RegExp(`\\b${a.name}\\b`, "i").test(item.name));
  const bonus = item.magicBonus ?? magic?.effect?.weaponBonus ?? magic?.effect?.armorBonus ?? magic?.effect?.shieldBonus;
  return { weapon: item.type === "Weapon" || magic?.effect?.weapon ? weapon : undefined, armor: item.type === "Armor" || magic?.effect?.armor ? armor : undefined, bonus, magic };
}

export function ItemEntry({ item, data }: { item: Item; data: LibraryData }) {
  const { weapon, armor, bonus, magic } = baseStats(item);
  const raw = item as Item & { damage?: { diceCount?: number; diceType?: string; damageType?: string } };
  const damage = weapon?.damage
    ? `${weapon.damage}${bonus ? ` + ${bonus}` : ""} ${weapon.damageType}`
    : raw.damage?.diceType ? `${raw.damage.diceCount ?? 1}${raw.damage.diceType} ${raw.damage.damageType ?? ""}`.trim() : undefined;
  // The SRD's own wording first; an Archive property naming the same rule ("Versatile (1d8/1d10)") is dropped.
  const ruleProperties = weapon ? weaponProperties(weapon) : [];
  const ruleWords = new Set(ruleProperties.map((p) => p.split(" ")[0].toLowerCase()));
  const properties = [...ruleProperties, ...(item.properties || []).filter((p) => !ruleWords.has(p.split(" ")[0].toLowerCase()))];
  const listCategory = item.magical ? "magic-items" : "equipment";
  const baseItemName = weapon?.name ?? armor?.name;
  const baseItem = item.magical && baseItemName ? data.items.find((other) => !other.magical && other.name.toLowerCase() === baseItemName.toLowerCase()) : undefined;
  const variants = !item.magical ? data.items.filter((other) => other.magical && other.id !== item.id && baseStats(other)[item.type === "Armor" ? "armor" : "weapon"]?.name === item.name) : [];
  const sameType = data.items
    .filter((other) => other.id !== item.id && other.type === item.type && !!other.magical === !!item.magical)
    .slice(0, 18);
  const attunement = item.requiresAttunement || magic?.attunement;

  return (
    <div className="space-y-6">
      <HeroImage image={item.image} alt={item.name} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-gray-300 italic">
          {item.type}
          {item.magical && item.rarity && <>, <span className={RARITY_TONE[item.rarity] ?? ""}>{item.rarity.toLowerCase()}</span></>}
          {attunement && ` (requires attunement${item.attunementRequirement ? ` ${item.attunementRequirement}` : ""})`}
        </span>
        {item.toolCategory && <Tag>{item.toolCategory}</Tag>}
      </div>
      <SourceTags entity={item} />

      <StatGrid
        stats={[
          { label: "Cost", value: formatCost(item.cost) ? <>{formatCost(item.cost)}{goldEquivalent(item.cost) && <span className="text-gray-500"> ({goldEquivalent(item.cost)})</span>}</> : item.magical ? undefined : "—" },
          { label: "Weight", value: item.weight !== undefined && item.weight !== null ? `${item.weight} lb.` : undefined },
          { label: "Rarity", value: item.magical ? item.rarity : undefined },
          { label: "Attunement", value: item.magical ? (attunement ? (item.attunementRequirement ? `Required, ${item.attunementRequirement}` : "Required") : "Not required") : undefined },
          { label: "Base Item", value: !baseItem ? item.baseItem : undefined },
          { label: "Magic Bonus", value: bonus ? `+${bonus}` : undefined },
          { label: "Damage", value: damage },
          { label: "Category", value: weapon ? `${weapon.category} ${weapon.kind} Weapon` : armor ? (armor.category === "Shield" ? "Shield" : `${armor.category} Armor`) : undefined },
          { label: "Range", value: weapon?.range ? `${weapon.range[0]}/${weapon.range[1]} ft.` : undefined },
          { label: "Mastery", value: weapon?.mastery },
          { label: "Armor Class", value: armor ? armorClassText(armor, bonus) : item.armorClass?.base ? `${item.armorClass.base}` : undefined },
          { label: "Strength", value: armor?.strength ? `Str ${armor.strength}` : undefined },
          { label: "Stealth", value: armor?.stealthDisadvantage || item.armorClass?.stealthDisadvantage ? "Disadvantage" : undefined },
        ]}
      />

      {properties.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {properties.map((property) => <Tag key={property} tone="blue">{property}</Tag>)}
        </div>
      )}

      <Section title="Description">
        <Prose text={item.description} />
        {item.rulesText && (
          <div className="mt-4 p-3 rounded-lg border border-zinc-700 bg-zinc-950/40">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">SRD rules text</p>
            <Prose text={item.rulesText} className="text-sm" />
          </div>
        )}
        {item.notes && <p className="text-sm text-gray-400 mt-4 italic">{item.notes}</p>}
        {baseItem && (
          <p className="text-sm text-gray-400 mt-4">
            Built on: <EntryLink category="equipment" id={baseItem.id}>{baseItem.name}</EntryLink>
          </p>
        )}
      </Section>

      {variants.length > 0 && (
        <Section title="Magic Versions">
          <LinkChips links={variants.map((variant) => ({ key: variant.id, label: variant.name, to: entryPath("magic-items", variant.id) }))} />
        </Section>
      )}

      {sameType.length > 0 && (
        <Section title={`More ${item.magical ? "Magic " : ""}${item.type === "Adventuring Gear" ? "Adventuring Gear" : `${item.type}s`}`}>
          <LinkChips links={sameType.map((other) => ({ key: other.id, label: other.name, to: entryPath(listCategory, other.id) }))} />
        </Section>
      )}
    </div>
  );
}
