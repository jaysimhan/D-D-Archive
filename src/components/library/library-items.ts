import type { Item, ItemType } from "../../types/dnd-types";
import { ARMOR, WEAPONS, type ArmorStats, type WeaponStats } from "../../data/srd-equipment";
import {
  ADVENTURING_GEAR_CATALOGUE,
  ARMOR_PRICES,
  MOUNTS_AND_VEHICLES,
  TOOL_CATALOGUE,
  WEAPON_PRICES,
  type CatalogueEntry,
} from "../../data/srd-equipment-catalogue";
import { SRD_MAGIC_ITEMS, type SrdMagicItem } from "../../data/srd-magic-items";

const SRD_52 = "System Reference Document 5.2";
const SRD_51 = "System Reference Document 5.1";

/** Archive names that differ from the SRD's for the same item. */
const NAME_ALIASES: Record<string, string> = {
  beltofgiantstrengthhillgiant: "beltofhillgiantstrength",
  beltofgiantstrengthstonegiant: "beltofstonegiantstrength",
  beltofgiantstrengthfrostgiant: "beltoffrostgiantstrength",
  beltofgiantstrengthfiregiant: "beltoffiregiantstrength",
  beltofgiantstrengthcloudgiant: "beltofcloudgiantstrength",
  beltofgiantstrengthstormgiant: "beltofstormgiantstrength",
  ironbandsofbinding: "ironbands",
  ammunitionofslaying: "arrowofslaying",
};

export function itemKey(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return NAME_ALIASES[key] ?? key;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** A weapon's properties as the rules name them, e.g. "Thrown", "Versatile (1d10)". */
export function weaponProperties(weapon: WeaponStats): string[] {
  return [
    weapon.range && !weapon.thrown && "Ammunition",
    weapon.finesse && "Finesse",
    weapon.heavy && "Heavy",
    weapon.light && "Light",
    weapon.loading && "Loading",
    weapon.reach && "Reach",
    weapon.thrown && "Thrown",
    weapon.twoHanded && "Two-Handed",
    weapon.versatile && `Versatile (${weapon.versatile})`,
  ].filter((p): p is string => Boolean(p));
}

export function armorClassText(armor: ArmorStats, bonus = 0): string {
  if (armor.category === "Shield") return `+${armor.base + bonus}`;
  const base = armor.base + bonus;
  if (armor.dexCap === 0) return `${base}`;
  if (armor.dexCap !== undefined) return `${base} + Dex modifier (max ${armor.dexCap})`;
  return `${base} + Dex modifier`;
}

function base(entry: CatalogueEntry, type: ItemType): Item {
  return {
    id: slugify(entry.name),
    name: entry.name,
    type,
    description: entry.description,
    magical: false,
    requiresAttunement: false,
    cost: entry.cost ? { amount: entry.cost[0], currency: entry.cost[1] } : undefined,
    weight: entry.weight,
    source: "Official",
    sourceBook: entry.edition === "2014" ? SRD_51 : SRD_52,
    edition: entry.edition ?? "Both",
    version: 1,
  };
}

function weaponItem(weapon: WeaponStats): Item | undefined {
  const price = WEAPON_PRICES[weapon.name];
  if (!price) return undefined;
  const properties = weaponProperties(weapon);
  const range = weapon.range ? ` Range ${weapon.range[0]}/${weapon.range[1]} feet.` : "";
  const hit = weapon.damage ? `deals ${weapon.damage} ${weapon.damageType.toLowerCase()} damage on a hit` : "deals no damage; a Large or smaller creature it hits is Restrained until freed";
  const description =
    `A ${weapon.category.toLowerCase()} ${weapon.kind.toLowerCase()} weapon that ${hit}.` +
    (properties.length ? ` Properties: ${properties.join(", ")}.` : "") +
    range +
    (weapon.mastery ? ` Weapon Mastery (2024): ${weapon.mastery}.` : "");
  return {
    ...base({ name: weapon.name, cost: price.cost, weight: price.weight, description, edition: price.edition }, "Weapon"),
    properties,
  };
}

function armorItem(armor: ArmorStats): Item | undefined {
  const price = ARMOR_PRICES[armor.name];
  if (!price) return undefined;
  const kind = armor.category === "Shield" ? "A shield" : `${armor.category} armor`;
  const description =
    `${kind}. ${armor.category === "Shield" ? `Raises your Armor Class by ${armor.base}` : `Armor Class ${armorClassText(armor)}`}.` +
    (armor.strength ? ` Needs Strength ${armor.strength}, or your speed drops by 10 feet.` : "") +
    (armor.stealthDisadvantage ? " Imposes disadvantage on Dexterity (Stealth) checks." : "") +
    ` Takes ${price.don}.`;
  return {
    ...base({ name: armor.name, cost: price.cost, weight: price.weight, description }, "Armor"),
    armorClass: {
      base: armor.base,
      dexterityModifier: armor.dexCap === undefined ? "full" : armor.dexCap === 0 ? "none" : "max2",
      stealthDisadvantage: armor.stealthDisadvantage ?? false,
    },
  };
}

function magicItem(entry: SrdMagicItem): Item {
  return {
    id: slugify(entry.name),
    name: entry.name,
    type: entry.type,
    description: entry.description,
    magical: true,
    rarity: entry.rarity,
    requiresAttunement: Boolean(entry.attunement),
    attunementRequirement: typeof entry.attunement === "string" ? entry.attunement : undefined,
    magicBonus: entry.magicBonus,
    baseItem: entry.baseItem,
    notes: entry.note,
    source: "Official",
    sourceBook: SRD_52,
    edition: "Both",
    version: 1,
  };
}

/** Every mundane SRD item with a price, and every SRD magic item, built once. */
const CATALOGUE: Item[] = [
  ...WEAPONS.map(weaponItem),
  ...ARMOR.map(armorItem),
  ...ADVENTURING_GEAR_CATALOGUE.map((entry) => base(entry, "Adventuring Gear")),
  ...TOOL_CATALOGUE.map((entry) => ({
    ...base(entry, "Tool"),
    toolCategory: entry.kind,
    properties: entry.ability ? [`Ability: ${entry.ability}`] : undefined,
  })),
  ...MOUNTS_AND_VEHICLES.map((entry) => ({
    ...base(entry, "Mount & Vehicle"),
    properties: [entry.speed && `Speed ${entry.speed}`, entry.capacity && `Carries ${entry.capacity}`].filter((p): p is string => Boolean(p)),
  })),
  ...SRD_MAGIC_ITEMS.map(magicItem),
].filter((item): item is Item => Boolean(item));

const isBlank = (value: unknown) =>
  value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);

/**
 * The Archive's items with the SRD catalogue folded in. An Archive item keeps
 * every field it has; the catalogue only fills the gaps (a tool with no price,
 * a weapon with no properties). Catalogue items the Archive lacks are added.
 */
export function mergeLibraryItems(archive: Item[], extra: Item[] = []): Item[] {
  const byKey = new Map<string, Item>();
  const ids = new Set<string>();
  for (const item of archive) {
    byKey.set(itemKey(item.name), item);
    ids.add(item.id);
  }

  for (const entry of [...CATALOGUE, ...extra]) {
    const key = itemKey(entry.name);
    const existing = byKey.get(key);
    if (existing) {
      const filled: Item = { ...existing };
      // Magic items only: a mundane entry's text is generated from the stats the page already shows.
      if (entry.magical && entry.description.length > (existing.description?.length ?? 0) + 40) {
        filled.rulesText = entry.description;
      }
      for (const [field, value] of Object.entries(entry) as [keyof Item, unknown][]) {
        if (field === "id" || field === "source" || field === "sourceBook" || field === "edition") continue;
        if (isBlank(filled[field]) && !isBlank(value)) (filled as unknown as Record<string, unknown>)[field] = value;
      }
      byKey.set(key, filled);
      continue;
    }
    const id = ids.has(entry.id) ? `${entry.id}-srd` : entry.id;
    ids.add(id);
    byKey.set(key, { ...entry, id });
  }

  return Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name));
}
