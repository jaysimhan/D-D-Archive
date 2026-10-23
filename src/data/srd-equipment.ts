/**
 * The equipment the character sheet can look up and do arithmetic with.
 *
 * The Archive's item documents are a sample rather than the rules: a few dozen
 * entries, with damage and armor values written as prose or not at all. The
 * sheet needs every weapon's damage and properties and every armor's AC to
 * work out attacks and Armor Class, so the SRD's numbers live here and the
 * Archive's documents are merged in on top (see useSheetSuggestions).
 *
 * Mechanics only, from the SRD 5.2 (CC-BY-4.0). A handful of well-known magic
 * items from outside the SRD are listed by name with the bonus they grant, so
 * a spell save DC still adds up for the casters who carry them.
 */

export type WeaponCategory = "Simple" | "Martial";
export type WeaponKind = "Melee" | "Ranged";

export interface WeaponStats {
  name: string;
  category: WeaponCategory;
  kind: WeaponKind;
  /** "1d8", "2d6", or a flat "1" for the blowgun. "" for the net. */
  damage: string;
  damageType: string;
  /** Two-handed damage, for Versatile weapons. */
  versatile?: string;
  finesse?: boolean;
  light?: boolean;
  heavy?: boolean;
  twoHanded?: boolean;
  reach?: boolean;
  loading?: boolean;
  /** Normal and long range in feet, for Thrown and Ammunition weapons. */
  range?: [number, number];
  thrown?: boolean;
  mastery?: string;
}

const w = (
  name: string,
  category: WeaponCategory,
  kind: WeaponKind,
  damage: string,
  damageType: string,
  extra: Partial<WeaponStats> = {},
): WeaponStats => ({ name, category, kind, damage, damageType, ...extra });

export const WEAPONS: WeaponStats[] = [
  // Simple melee
  w("Club", "Simple", "Melee", "1d4", "Bludgeoning", { light: true, mastery: "Slow" }),
  w("Dagger", "Simple", "Melee", "1d4", "Piercing", { finesse: true, light: true, thrown: true, range: [20, 60], mastery: "Nick" }),
  w("Greatclub", "Simple", "Melee", "1d8", "Bludgeoning", { twoHanded: true, mastery: "Push" }),
  w("Handaxe", "Simple", "Melee", "1d6", "Slashing", { light: true, thrown: true, range: [20, 60], mastery: "Vex" }),
  w("Javelin", "Simple", "Melee", "1d6", "Piercing", { thrown: true, range: [30, 120], mastery: "Slow" }),
  w("Light Hammer", "Simple", "Melee", "1d4", "Bludgeoning", { light: true, thrown: true, range: [20, 60], mastery: "Nick" }),
  w("Mace", "Simple", "Melee", "1d6", "Bludgeoning", { mastery: "Sap" }),
  w("Quarterstaff", "Simple", "Melee", "1d6", "Bludgeoning", { versatile: "1d8", mastery: "Topple" }),
  w("Sickle", "Simple", "Melee", "1d4", "Slashing", { light: true, mastery: "Nick" }),
  w("Spear", "Simple", "Melee", "1d6", "Piercing", { thrown: true, range: [20, 60], versatile: "1d8", mastery: "Sap" }),
  // Simple ranged
  w("Dart", "Simple", "Ranged", "1d4", "Piercing", { finesse: true, thrown: true, range: [20, 60], mastery: "Vex" }),
  w("Light Crossbow", "Simple", "Ranged", "1d8", "Piercing", { range: [80, 320], loading: true, twoHanded: true, mastery: "Slow" }),
  w("Shortbow", "Simple", "Ranged", "1d6", "Piercing", { range: [80, 320], twoHanded: true, mastery: "Vex" }),
  w("Sling", "Simple", "Ranged", "1d4", "Bludgeoning", { range: [30, 120], mastery: "Slow" }),
  // Martial melee
  w("Battleaxe", "Martial", "Melee", "1d8", "Slashing", { versatile: "1d10", mastery: "Topple" }),
  w("Flail", "Martial", "Melee", "1d8", "Bludgeoning", { mastery: "Sap" }),
  w("Glaive", "Martial", "Melee", "1d10", "Slashing", { heavy: true, reach: true, twoHanded: true, mastery: "Graze" }),
  w("Greataxe", "Martial", "Melee", "1d12", "Slashing", { heavy: true, twoHanded: true, mastery: "Cleave" }),
  w("Greatsword", "Martial", "Melee", "2d6", "Slashing", { heavy: true, twoHanded: true, mastery: "Graze" }),
  w("Halberd", "Martial", "Melee", "1d10", "Slashing", { heavy: true, reach: true, twoHanded: true, mastery: "Cleave" }),
  w("Lance", "Martial", "Melee", "1d10", "Piercing", { heavy: true, reach: true, twoHanded: true, mastery: "Topple" }),
  w("Longsword", "Martial", "Melee", "1d8", "Slashing", { versatile: "1d10", mastery: "Sap" }),
  w("Maul", "Martial", "Melee", "2d6", "Bludgeoning", { heavy: true, twoHanded: true, mastery: "Topple" }),
  w("Morningstar", "Martial", "Melee", "1d8", "Piercing", { mastery: "Sap" }),
  w("Pike", "Martial", "Melee", "1d10", "Piercing", { heavy: true, reach: true, twoHanded: true, mastery: "Push" }),
  w("Rapier", "Martial", "Melee", "1d8", "Piercing", { finesse: true, mastery: "Vex" }),
  w("Scimitar", "Martial", "Melee", "1d6", "Slashing", { finesse: true, light: true, mastery: "Nick" }),
  w("Shortsword", "Martial", "Melee", "1d6", "Piercing", { finesse: true, light: true, mastery: "Vex" }),
  w("Trident", "Martial", "Melee", "1d8", "Piercing", { thrown: true, range: [20, 60], versatile: "1d10", mastery: "Topple" }),
  w("Warhammer", "Martial", "Melee", "1d8", "Bludgeoning", { versatile: "1d10", mastery: "Push" }),
  w("War Pick", "Martial", "Melee", "1d8", "Piercing", { versatile: "1d10", mastery: "Sap" }),
  w("Whip", "Martial", "Melee", "1d4", "Slashing", { finesse: true, reach: true, mastery: "Slow" }),
  // Martial ranged
  w("Blowgun", "Martial", "Ranged", "1", "Piercing", { range: [25, 100], loading: true, mastery: "Vex" }),
  w("Hand Crossbow", "Martial", "Ranged", "1d6", "Piercing", { range: [30, 120], light: true, loading: true, mastery: "Vex" }),
  w("Heavy Crossbow", "Martial", "Ranged", "1d10", "Piercing", { range: [100, 400], heavy: true, loading: true, twoHanded: true, mastery: "Push" }),
  w("Longbow", "Martial", "Ranged", "1d8", "Piercing", { range: [150, 600], heavy: true, twoHanded: true, mastery: "Slow" }),
  w("Musket", "Martial", "Ranged", "1d12", "Piercing", { range: [40, 120], loading: true, twoHanded: true, mastery: "Slow" }),
  w("Pistol", "Martial", "Ranged", "1d10", "Piercing", { range: [30, 90], loading: true, mastery: "Vex" }),
  // 2014 only: thrown, and does no damage.
  w("Net", "Martial", "Ranged", "", "", { thrown: true, range: [5, 15] }),
];

/** Names the sheet may be written with, mapped to the weapon they mean. */
export const WEAPON_ALIASES: Record<string, string> = {
  "crossbow, light": "Light Crossbow",
  "crossbow, hand": "Hand Crossbow",
  "crossbow, heavy": "Heavy Crossbow",
  "hammer, light": "Light Hammer",
  "warpick": "War Pick",
  "staff": "Quarterstaff",
  "short sword": "Shortsword",
  "long sword": "Longsword",
  "great sword": "Greatsword",
  "great axe": "Greataxe",
  "long bow": "Longbow",
  "short bow": "Shortbow",
  "darts": "Dart",
  "javelins": "Javelin",
  "daggers": "Dagger",
  "handaxes": "Handaxe",
};

export type ArmorCategory = "Light" | "Medium" | "Heavy" | "Shield";

export interface ArmorStats {
  name: string;
  category: ArmorCategory;
  /** Base AC; the shield's is the bonus it adds. */
  base: number;
  /** Most Dexterity adds; undefined adds it all, 0 adds none. */
  dexCap?: number;
  strength?: number;
  stealthDisadvantage?: boolean;
}

export const ARMOR: ArmorStats[] = [
  { name: "Padded Armor", category: "Light", base: 11, stealthDisadvantage: true },
  { name: "Leather Armor", category: "Light", base: 11 },
  { name: "Studded Leather Armor", category: "Light", base: 12 },
  { name: "Hide Armor", category: "Medium", base: 12, dexCap: 2 },
  { name: "Chain Shirt", category: "Medium", base: 13, dexCap: 2 },
  { name: "Scale Mail", category: "Medium", base: 14, dexCap: 2, stealthDisadvantage: true },
  { name: "Breastplate", category: "Medium", base: 14, dexCap: 2 },
  { name: "Half Plate Armor", category: "Medium", base: 15, dexCap: 2, stealthDisadvantage: true },
  { name: "Ring Mail", category: "Heavy", base: 14, dexCap: 0, stealthDisadvantage: true },
  { name: "Chain Mail", category: "Heavy", base: 16, dexCap: 0, strength: 13, stealthDisadvantage: true },
  { name: "Splint Armor", category: "Heavy", base: 17, dexCap: 0, strength: 15, stealthDisadvantage: true },
  { name: "Plate Armor", category: "Heavy", base: 18, dexCap: 0, strength: 15, stealthDisadvantage: true },
  { name: "Shield", category: "Shield", base: 2 },
];

export const ARMOR_ALIASES: Record<string, string> = {
  "padded": "Padded Armor",
  "leather": "Leather Armor",
  "studded leather": "Studded Leather Armor",
  "studded": "Studded Leather Armor",
  "hide": "Hide Armor",
  "half plate": "Half Plate Armor",
  "half-plate": "Half Plate Armor",
  "splint": "Splint Armor",
  "splint mail": "Splint Armor",
  "plate": "Plate Armor",
  "plate mail": "Plate Armor",
  "full plate": "Plate Armor",
  "breast plate": "Breastplate",
};

/* ------------------------------------------------------------------ */
/* Magic items                                                         */
/* ------------------------------------------------------------------ */

/**
 * What a magic item does to the numbers on the sheet. Everything here is
 * optional: most items change nothing the sheet adds up, and are listed only
 * so they can be found.
 */
export interface MagicItemEffect {
  /** Flat bonus to AC, wherever it comes from (Ring of Protection). */
  ac?: number;
  /** AC bonus only with no armor and no shield (Bracers of Defense). */
  acUnarmored?: number;
  /** A base AC of its own, plus Dexterity, worn without armor (Robe of the Archmagi). */
  unarmoredBase?: number;
  spellAttack?: number;
  spellDc?: number;
  /** A class feature's save DC (Dragonhide Belt for a monk's focus). */
  classDc?: number;
  /** The classes, by Archive id, whose spells or features the bonus applies to. */
  classes?: string[];
  /** Magic armor: the armor it is, and how much it adds. */
  armor?: string;
  armorBonus?: number;
  /** A magic shield's bonus over a shield's own +2. */
  shieldBonus?: number;
  /** A magic weapon: the weapon it is when the name doesn't say. */
  weapon?: string;
  weaponBonus?: number;
  /** Damage the weapon always adds, e.g. "2d6 Fire" for an ignited Flame Tongue. */
  extraDamage?: string;
  /** Makes the base weapon Finesse (Sun Blade). */
  finesse?: boolean;
  /** Replaces the weapon's damage type (Sun Blade deals radiant). */
  damageType?: string;
  /** Bonus to Unarmed Strike attack and damage (Wraps of Unarmed Power). */
  unarmed?: number;
  /** Damage bonus with these weapons only (Bracers of Archery). */
  damageBonus?: { amount: number; weapons: string[] };
}

export interface MagicItem {
  name: string;
  attunement?: boolean;
  effect?: MagicItemEffect;
}

const plusTiers = (
  name: (bonus: number) => string,
  effect: (bonus: number) => MagicItemEffect,
  attunement = false,
): MagicItem[] => [1, 2, 3].map((bonus) => ({ name: name(bonus), attunement, effect: effect(bonus) }));

const plain = (...names: string[]): MagicItem[] => names.map((name) => ({ name }));
const attuned = (...names: string[]): MagicItem[] => names.map((name) => ({ name, attunement: true }));

export const MAGIC_ITEMS: MagicItem[] = [
  // Bonus tiers
  ...plusTiers((n) => `Armor, +${n}`, (n) => ({ armorBonus: n })),
  ...plusTiers((n) => `Shield, +${n}`, (n) => ({ shieldBonus: n })),
  ...plusTiers((n) => `Weapon, +${n}`, (n) => ({ weaponBonus: n })),
  ...plusTiers((n) => `Ammunition, +${n}`, (n) => ({ weaponBonus: n })),
  ...plusTiers((n) => `Wand of the War Mage, +${n}`, (n) => ({ spellAttack: n }), true),
  ...plusTiers((n) => `Rod of the Pact Keeper, +${n}`, (n) => ({ spellAttack: n, spellDc: n, classes: ["warlock"] }), true),
  ...plusTiers((n) => `Amulet of the Devout, +${n}`, (n) => ({ spellAttack: n, spellDc: n, classes: ["cleric", "paladin"] }), true),
  ...plusTiers((n) => `Arcane Grimoire, +${n}`, (n) => ({ spellAttack: n, spellDc: n, classes: ["wizard"] }), true),
  ...plusTiers((n) => `Bloodwell Vial, +${n}`, (n) => ({ spellAttack: n, spellDc: n, classes: ["sorcerer"] }), true),
  ...plusTiers((n) => `Moon Sickle, +${n}`, (n) => ({ spellAttack: n, spellDc: n, classes: ["druid", "ranger"], weapon: "Sickle", weaponBonus: n }), true),
  ...plusTiers((n) => `All-Purpose Tool, +${n}`, (n) => ({ spellAttack: n, spellDc: n, classes: ["artificer"] }), true),
  ...plusTiers((n) => `Rhythm-Maker's Drum, +${n}`, (n) => ({ spellAttack: n, spellDc: n, classes: ["bard"] }), true),
  ...plusTiers((n) => `Dragonhide Belt, +${n}`, (n) => ({ classDc: n, classes: ["monk"] }), true),
  ...plusTiers((n) => `Wraps of Unarmed Power, +${n}`, (n) => ({ unarmed: n })),

  // Armor and shields
  { name: "Adamantine Armor" },
  { name: "Mithral Armor" },
  { name: "Armor of Invulnerability", attunement: true, effect: { armor: "Plate Armor" } },
  { name: "Armor of Resistance", attunement: true },
  { name: "Armor of Vulnerability", attunement: true, effect: { armor: "Plate Armor" } },
  { name: "Demon Armor", attunement: true, effect: { armor: "Plate Armor", armorBonus: 1 } },
  { name: "Dragon Scale Mail", attunement: true, effect: { armor: "Scale Mail", armorBonus: 1 } },
  { name: "Dwarven Plate", effect: { armor: "Plate Armor", armorBonus: 2 } },
  { name: "Efreeti Chain", attunement: true, effect: { armor: "Chain Mail", armorBonus: 3 } },
  { name: "Elven Chain", effect: { armor: "Chain Shirt", armorBonus: 1 } },
  { name: "Glamoured Studded Leather", effect: { armor: "Studded Leather Armor", armorBonus: 1 } },
  { name: "Plate Armor of Etherealness", attunement: true, effect: { armor: "Plate Armor" } },
  { name: "Animated Shield", attunement: true, effect: { shieldBonus: 0 } },
  { name: "Arrow-Catching Shield", attunement: true, effect: { shieldBonus: 0 } },
  { name: "Sentinel Shield", effect: { shieldBonus: 0 } },
  { name: "Shield of Missile Attraction", attunement: true, effect: { shieldBonus: 0 } },
  { name: "Spellguard Shield", attunement: true, effect: { shieldBonus: 0 } },

  // Weapons
  { name: "Berserker Axe", attunement: true, effect: { weapon: "Battleaxe", weaponBonus: 1 } },
  { name: "Dagger of Venom", effect: { weapon: "Dagger", weaponBonus: 1 } },
  { name: "Dancing Sword", attunement: true, effect: { weapon: "Longsword" } },
  { name: "Defender", attunement: true, effect: { weapon: "Longsword", weaponBonus: 3 } },
  { name: "Dragon Slayer", effect: { weapon: "Longsword", weaponBonus: 1 } },
  { name: "Dwarven Thrower", attunement: true, effect: { weapon: "Warhammer", weaponBonus: 3 } },
  { name: "Flame Tongue", attunement: true, effect: { weapon: "Longsword", extraDamage: "2d6 Fire" } },
  { name: "Frost Brand", attunement: true, effect: { weapon: "Longsword", extraDamage: "1d6 Cold" } },
  { name: "Giant Slayer", effect: { weapon: "Greataxe", weaponBonus: 1 } },
  { name: "Hammer of Thunderbolts", effect: { weapon: "Maul", weaponBonus: 1 } },
  { name: "Holy Avenger", attunement: true, effect: { weapon: "Longsword", weaponBonus: 3 } },
  { name: "Javelin of Lightning", effect: { weapon: "Javelin" } },
  { name: "Luck Blade", attunement: true, effect: { weapon: "Longsword", weaponBonus: 1 } },
  { name: "Mace of Disruption", attunement: true, effect: { weapon: "Mace" } },
  { name: "Mace of Smiting", effect: { weapon: "Mace", weaponBonus: 1 } },
  { name: "Mace of Terror", attunement: true, effect: { weapon: "Mace" } },
  { name: "Nine Lives Stealer", attunement: true, effect: { weapon: "Longsword", weaponBonus: 2 } },
  { name: "Oathbow", attunement: true, effect: { weapon: "Longbow" } },
  { name: "Scimitar of Speed", attunement: true, effect: { weapon: "Scimitar", weaponBonus: 2 } },
  { name: "Sun Blade", attunement: true, effect: { weapon: "Longsword", weaponBonus: 2, finesse: true, damageType: "Radiant" } },
  { name: "Sword of Life Stealing", attunement: true, effect: { weapon: "Longsword" } },
  { name: "Sword of Sharpness", attunement: true, effect: { weapon: "Longsword" } },
  { name: "Sword of Wounding", attunement: true, effect: { weapon: "Longsword" } },
  { name: "Trident of Fish Command", attunement: true, effect: { weapon: "Trident" } },
  { name: "Vicious Weapon" },
  { name: "Vorpal Sword", attunement: true, effect: { weapon: "Longsword", weaponBonus: 3 } },
  { name: "Weapon of Warning", attunement: true },
  { name: "Rod of Lordly Might", attunement: true, effect: { weapon: "Mace", weaponBonus: 3 } },
  { name: "Arrow of Slaying" },

  // Staffs (each is also a quarterstaff)
  { name: "Staff of Power", attunement: true, effect: { ac: 2, spellAttack: 2, weapon: "Quarterstaff", weaponBonus: 2 } },
  { name: "Staff of the Magi", attunement: true, effect: { spellAttack: 2, weapon: "Quarterstaff", weaponBonus: 2 } },
  { name: "Staff of the Woodlands", attunement: true, effect: { spellAttack: 2, classes: ["druid"], weapon: "Quarterstaff", weaponBonus: 2 } },
  { name: "Staff of Striking", attunement: true, effect: { weapon: "Quarterstaff", weaponBonus: 3 } },
  { name: "Staff of Thunder and Lightning", attunement: true, effect: { weapon: "Quarterstaff", weaponBonus: 2 } },
  { name: "Staff of Withering", attunement: true, effect: { weapon: "Quarterstaff" } },
  ...attuned("Staff of Charming", "Staff of Fire", "Staff of Frost", "Staff of Healing", "Staff of Swarming Insects", "Staff of the Python"),

  // Protection and spellcasting
  { name: "Ring of Protection", attunement: true, effect: { ac: 1 } },
  { name: "Cloak of Protection", attunement: true, effect: { ac: 1 } },
  { name: "Ioun Stone (Protection)", attunement: true, effect: { ac: 1 } },
  { name: "Bracers of Defense", attunement: true, effect: { acUnarmored: 2 } },
  { name: "Bracers of Archery", attunement: true, effect: { damageBonus: { amount: 2, weapons: ["Longbow", "Shortbow"] } } },
  { name: "Robe of the Archmagi", attunement: true, effect: { unarmoredBase: 15, spellAttack: 2, spellDc: 2 } },

  // Rings
  ...attuned(
    "Ring of Animal Influence", "Ring of Djinni Summoning", "Ring of Elemental Command", "Ring of Evasion",
    "Ring of Feather Falling", "Ring of Free Action", "Ring of Invisibility", "Ring of Jumping",
    "Ring of Mind Shielding", "Ring of Regeneration", "Ring of Resistance", "Ring of Shooting Stars",
    "Ring of Spell Storing", "Ring of Spell Turning", "Ring of Swimming", "Ring of Telekinesis",
    "Ring of the Ram", "Ring of Warmth", "Ring of Water Walking", "Ring of X-ray Vision",
  ),
  ...plain("Ring of Three Wishes"),

  // Rods and wands
  ...attuned("Rod of Absorption", "Rod of Alertness", "Rod of Rulership", "Wand of Binding", "Wand of Fear",
    "Wand of Fireballs", "Wand of Lightning Bolts", "Wand of Paralysis", "Wand of Polymorph", "Wand of Wonder",
    "Wand of Web", "Wand of Enemy Detection"),
  ...plain("Immovable Rod", "Rod of Security", "Wand of Magic Detection", "Wand of Magic Missiles", "Wand of Secrets"),

  // Potions and oils
  ...plain(
    "Potion of Healing", "Potion of Greater Healing", "Potion of Superior Healing", "Potion of Supreme Healing",
    "Potion of Animal Friendship", "Potion of Clairvoyance", "Potion of Climbing", "Potion of Diminution",
    "Potion of Flying", "Potion of Gaseous Form", "Potion of Growth", "Potion of Heroism",
    "Potion of Invisibility", "Potion of Mind Reading", "Potion of Poison", "Potion of Resistance",
    "Potion of Speed", "Potion of Water Breathing", "Potion of Longevity", "Potion of Vitality",
    "Potion of Hill Giant Strength", "Potion of Frost Giant Strength", "Potion of Stone Giant Strength",
    "Potion of Fire Giant Strength", "Potion of Cloud Giant Strength", "Potion of Storm Giant Strength",
    "Oil of Etherealness", "Oil of Sharpness", "Oil of Slipperiness", "Philter of Love",
    "Elixir of Health", "Restorative Ointment", "Universal Solvent", "Sovereign Glue",
    "Dust of Disappearance", "Dust of Dryness", "Dust of Sneezing and Choking",
  ),
  ...plain(
    "Spell Scroll (Cantrip)", "Spell Scroll (Level 1)", "Spell Scroll (Level 2)", "Spell Scroll (Level 3)",
    "Spell Scroll (Level 4)", "Spell Scroll (Level 5)", "Spell Scroll (Level 6)", "Spell Scroll (Level 7)",
    "Spell Scroll (Level 8)", "Spell Scroll (Level 9)",
  ),

  // Wondrous items
  ...attuned(
    "Amulet of Health", "Amulet of Proof against Detection and Location", "Amulet of the Planes",
    "Belt of Dwarvenkind", "Belt of Hill Giant Strength", "Belt of Stone Giant Strength",
    "Belt of Frost Giant Strength", "Belt of Fire Giant Strength", "Belt of Cloud Giant Strength",
    "Belt of Storm Giant Strength", "Boots of Levitation", "Boots of Speed", "Boots of Striding and Springing",
    "Boots of the Winterlands", "Brooch of Shielding", "Cape of the Mountebank", "Circlet of Blasting",
    "Cloak of Arachnida", "Cloak of Displacement", "Cloak of Elvenkind", "Cloak of the Bat",
    "Crystal Ball", "Dimensional Shackles", "Eyes of Charming", "Gauntlets of Ogre Power", "Gem of Seeing",
    "Gloves of Missile Snaring", "Gloves of Swimming and Climbing", "Hat of Disguise", "Headband of Intellect",
    "Helm of Brilliance", "Helm of Telepathy", "Helm of Teleportation", "Ioun Stone (Absorption)",
    "Ioun Stone (Agility)", "Ioun Stone (Awareness)", "Ioun Stone (Fortitude)", "Ioun Stone (Greater Absorption)",
    "Ioun Stone (Insight)", "Ioun Stone (Intellect)", "Ioun Stone (Leadership)", "Ioun Stone (Mastery)",
    "Ioun Stone (Regeneration)", "Ioun Stone (Reserve)", "Ioun Stone (Strength)", "Ioun Stone (Sustenance)",
    "Mantle of Spell Resistance", "Medallion of Thoughts", "Necklace of Prayer Beads", "Pearl of Power",
    "Periapt of Health", "Periapt of Proof against Poison", "Periapt of Wound Closure", "Pipes of Haunting",
    "Pipes of the Sewers", "Robe of Eyes", "Robe of Scintillating Colors", "Robe of Stars", "Scarab of Protection",
    "Slippers of Spider Climbing", "Stone of Good Luck (Luckstone)", "Talisman of Pure Good",
    "Talisman of the Sphere", "Talisman of Ultimate Evil", "Wings of Flying", "Winged Boots",
    "Boots of Elvenkind", "Cloak of the Manta Ray", "Goggles of Night", "Helm of Comprehending Languages",
  ),
  ...plain(
    "Apparatus of the Crab", "Bag of Beans", "Bag of Devouring", "Bag of Holding", "Bag of Tricks",
    "Bead of Force", "Bowl of Commanding Water Elementals", "Brazier of Commanding Fire Elementals",
    "Broom of Flying", "Candle of Invocation", "Carpet of Flying", "Censer of Controlling Air Elementals",
    "Chime of Opening", "Cube of Force", "Cubic Gate", "Decanter of Endless Water", "Deck of Illusions",
    "Deck of Many Things", "Efficient Quiver", "Efreeti Bottle", "Elemental Gem", "Eversmoking Bottle",
    "Eyes of Minute Seeing", "Eyes of the Eagle", "Feather Token", "Figurine of Wondrous Power",
    "Folding Boat", "Gem of Brightness", "Handy Haversack", "Horn of Blasting", "Horn of Valhalla",
    "Horseshoes of a Zephyr", "Horseshoes of Speed", "Instant Fortress", "Iron Bands", "Iron Flask",
    "Lantern of Revealing", "Manual of Bodily Health", "Manual of Gainful Exercise", "Manual of Golems",
    "Manual of Quickness of Action", "Marvelous Pigments", "Mirror of Life Trapping", "Necklace of Adaptation",
    "Necklace of Fireballs", "Portable Hole", "Robe of Useful Items", "Rope of Climbing", "Rope of Entanglement",
    "Sphere of Annihilation", "Stone of Controlling Earth Elementals", "Tome of Clear Thought",
    "Tome of Leadership and Influence", "Tome of Understanding", "Well of Many Worlds", "Wind Fan",
    "Alchemy Jug", "Cap of Water Breathing", "Driftglobe", "Ever-Burning Torch", "Gloves of Thievery",
    "Hat of Many Spells", "Quiver of Ehlonna",
  ),
];

/* ------------------------------------------------------------------ */
/* Gear and treasure                                                   */
/* ------------------------------------------------------------------ */

export const ADVENTURING_GEAR: string[] = [
  "Abacus", "Acid", "Alchemist's Fire", "Antitoxin", "Arrows (20)", "Backpack", "Ball Bearings",
  "Barrel", "Basket", "Bedroll", "Bell", "Blanket", "Block and Tackle", "Bolts (20)", "Book",
  "Bottle, Glass", "Bucket", "Burglar's Pack", "Caltrops", "Candle", "Case, Crossbow Bolt",
  "Case, Map or Scroll", "Chain (10 feet)", "Chalk", "Chest", "Climber's Kit", "Clothes, Common",
  "Clothes, Costume", "Clothes, Fine", "Clothes, Traveler's", "Component Pouch", "Crowbar",
  "Crystal (Arcane Focus)", "Diplomat's Pack", "Dungeoneer's Pack", "Entertainer's Pack",
  "Explorer's Pack", "Firearm Bullets (10)", "Fishing Tackle", "Flask", "Grappling Hook",
  "Hammer", "Hammer, Sledge", "Healer's Kit", "Holy Symbol (Amulet)", "Holy Symbol (Emblem)",
  "Holy Symbol (Reliquary)", "Holy Water", "Hourglass", "Hunting Trap", "Ink", "Ink Pen", "Jug",
  "Ladder", "Lamp", "Lantern, Bullseye", "Lantern, Hooded", "Lock", "Magnifying Glass", "Manacles",
  "Map", "Mess Kit", "Mirror", "Needles (50)", "Oil", "Orb (Arcane Focus)", "Paper", "Parchment",
  "Perfume", "Pick, Miner's", "Piton", "Poison, Basic", "Pole", "Pot, Iron", "Pouch", "Priest's Pack",
  "Quiver", "Ram, Portable", "Rations (1 day)", "Robe", "Rod (Arcane Focus)", "Rope, Hempen (50 feet)",
  "Rope, Silk (50 feet)", "Sack", "Scale, Merchant's", "Scholar's Pack", "Sealing Wax", "Shovel",
  "Signal Whistle", "Signet Ring", "Sling Bullets (20)", "Soap", "Spellbook", "Spikes, Iron",
  "Sprig of Mistletoe (Druidic Focus)", "Spyglass", "Staff (Arcane Focus)", "String", "Tent",
  "Tinderbox", "Torch", "Vial", "Wand (Arcane Focus)", "Waterskin", "Whetstone",
  "Wooden Staff (Druidic Focus)", "Yew Wand (Druidic Focus)",
];

export const TOOLS: string[] = [
  "Alchemist's Supplies", "Brewer's Supplies", "Calligrapher's Supplies", "Carpenter's Tools",
  "Cartographer's Tools", "Cobbler's Tools", "Cook's Utensils", "Glassblower's Tools", "Jeweler's Tools",
  "Leatherworker's Tools", "Mason's Tools", "Painter's Supplies", "Potter's Tools", "Smith's Tools",
  "Tinker's Tools", "Weaver's Tools", "Woodcarver's Tools", "Disguise Kit", "Forgery Kit", "Herbalism Kit",
  "Navigator's Tools", "Poisoner's Kit", "Thieves' Tools", "Dice Set", "Dragonchess Set", "Playing Card Set",
  "Three-Dragon Ante Set", "Bagpipes", "Drum", "Dulcimer", "Flute", "Horn", "Lute", "Lyre", "Pan Flute",
  "Shawm", "Viol",
];

/** Gemstones and art objects, by value, for the Treasure panel. */
export const TREASURE: string[] = [
  ...["Azurite", "Banded Agate", "Blue Quartz", "Eye Agate", "Hematite", "Lapis Lazuli", "Malachite",
    "Moss Agate", "Obsidian", "Rhodochrosite", "Tiger Eye", "Turquoise"].map((gem) => `${gem} (10 gp)`),
  ...["Bloodstone", "Carnelian", "Chalcedony", "Chrysoprase", "Citrine", "Jasper", "Moonstone", "Onyx",
    "Quartz", "Sardonyx", "Star Rose Quartz", "Zircon"].map((gem) => `${gem} (50 gp)`),
  ...["Amber", "Amethyst", "Chrysoberyl", "Coral", "Garnet", "Jade", "Jet", "Pearl", "Spinel",
    "Tourmaline"].map((gem) => `${gem} (100 gp)`),
  ...["Alexandrite", "Aquamarine", "Black Pearl", "Blue Spinel", "Peridot", "Topaz"].map((gem) => `${gem} (500 gp)`),
  ...["Black Opal", "Blue Sapphire", "Emerald", "Fire Opal", "Opal", "Star Ruby", "Star Sapphire",
    "Yellow Sapphire"].map((gem) => `${gem} (1,000 gp)`),
  ...["Black Sapphire", "Diamond", "Jacinth", "Ruby"].map((gem) => `${gem} (5,000 gp)`),
  "Silver Ewer (25 gp)", "Carved Bone Statuette (25 gp)", "Small Gold Bracelet (25 gp)",
  "Embroidered Silk Handkerchief (25 gp)", "Gold Locket with a Painted Portrait (25 gp)",
  "Gold Ring Set with Bloodstones (250 gp)", "Carved Ivory Statuette (250 gp)", "Large Gold Bracelet (250 gp)",
  "Silver Necklace with a Gemstone Pendant (250 gp)", "Bronze Crown (250 gp)", "Silk Robe with Gold Embroidery (250 gp)",
  "Silver Chalice Set with Moonstones (750 gp)", "Silver-Plated Steel Longsword with Jet in the Hilt (750 gp)",
  "Carved Harp of Exotic Wood (750 gp)", "Small Gold Idol (750 gp)", "Gold Dragon Comb with Red Garnets (750 gp)",
  "Fine Gold Chain Set with a Fire Opal (2,500 gp)", "Old Masterpiece Painting (2,500 gp)",
  "Embroidered Silk and Velvet Mantle (2,500 gp)", "Platinum Bracelet Set with a Sapphire (2,500 gp)",
  "Jeweled Gold Crown (7,500 gp)", "Jeweled Platinum Ring (7,500 gp)", "Small Gold Statuette with Rubies (7,500 gp)",
  "Gold Cup Set with Emeralds (7,500 gp)", "Gold Jewelry Box with Platinum Filigree (7,500 gp)",
  "Trade Bar, Silver (1 lb, 5 gp)", "Trade Bar, Gold (1 lb, 50 gp)", "Trade Bar, Platinum (1 lb, 500 gp)",
];
