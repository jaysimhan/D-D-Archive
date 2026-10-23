import {
  ARMOR,
  ARMOR_ALIASES,
  MAGIC_ITEMS,
  WEAPONS,
  WEAPON_ALIASES,
  type ArmorStats,
  type MagicItem,
  type MagicItemEffect,
  type WeaponStats,
} from "../data/srd-equipment";

/**
 * The arithmetic behind the character sheet's combat numbers: weapon and
 * unarmed attacks, Armor Class, class-feature save DCs and spellcasting.
 *
 * Every rule the sheet applies comes from one of two places. Rules everyone
 * plays with — a Monk's Martial Arts, Unarmored Defense, a Hexblade's Hex
 * Warrior — are written down here. Everything else is read out of the
 * Archive's own prose: a homebrew species whose natural armor is "AC 13 + Dex
 * (max 2)" or a subclass that lets you "use Intelligence instead of Strength
 * or Dexterity" works without anyone teaching the sheet about it.
 *
 * Where the rules leave a choice to the player — Strength or Dexterity for a
 * finesse weapon, the spellcasting ability a feat lets you pick — the sheet
 * takes the best one: the answer a player would have picked themselves, and
 * still theirs to overwrite on the sheet.
 */

/* ------------------------------------------------------------------ */
/* Abilities                                                           */
/* ------------------------------------------------------------------ */

export const ABILITIES = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const;
export type Ability = (typeof ABILITIES)[number];

export const ABILITY_NAMES: Record<Ability, string> = {
  STR: "Strength",
  DEX: "Dexterity",
  CON: "Constitution",
  INT: "Intelligence",
  WIS: "Wisdom",
  CHA: "Charisma",
};

export type Modifiers = Partial<Record<string, number | null>>;

const ABILITY_KEYS: Record<string, string> = {
  strength: "STR",
  dexterity: "DEX",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

/** "Wisdom", "wis" or "WIS" → "WIS". Anything else keeps its first three letters. */
export function normalizeAbilityKey(value?: string) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return ABILITY_KEYS[normalized] ?? normalized.slice(0, 3).toUpperCase();
}

function asAbility(value?: string): Ability | undefined {
  const key = normalizeAbilityKey(value);
  return (ABILITIES as readonly string[]).includes(key ?? "") ? (key as Ability) : undefined;
}

/** Modifiers are always written with their sign, "+0" included. */
export function formatModifier(modifier: number) {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/** A bonus added to a die roll: "+3", "-1", or nothing at all for zero. */
function formatAddend(value: number) {
  return value === 0 ? "" : value > 0 ? `+${value}` : `${value}`;
}

function modifierOf(modifiers: Modifiers, ability: string) {
  const modifier = modifiers[ability];
  return typeof modifier === "number" ? modifier : null;
}

/** The best of several abilities the rules let the player choose between. */
export function bestAbility(abilities: readonly Ability[], modifiers: Modifiers): Ability | undefined {
  let best: Ability | undefined;
  let bestModifier = -Infinity;
  for (const ability of abilities) {
    const modifier = modifierOf(modifiers, ability);
    if (modifier !== null && modifier > bestModifier) {
      best = ability;
      bestModifier = modifier;
    }
  }
  return best ?? abilities[0];
}

const ABILITY_WORD =
  /\b(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma|STR|DEX|CON|INT|WIS|CHA|Str|Dex|Con|Int|Wis|Cha)\b/g;

function abilitiesIn(text: string): Ability[] {
  const found: Ability[] = [];
  for (const match of text.matchAll(ABILITY_WORD)) {
    const ability = asAbility(match[1]);
    if (ability && !found.includes(ability)) found.push(ability);
  }
  return found;
}

function sentences(text?: string) {
  return (text ?? "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* Names                                                               */
/* ------------------------------------------------------------------ */

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * "+1 Longsword", "Longsword, +1" and "Longsword +1 (Monk Weapon)" are all a
 * longsword with a +1 bonus. The parenthetical is the player's own note.
 */
function parseItemName(raw: string) {
  const bonusMatch = /(?:^|[\s,])\+([1-9])(?=[\s,)]|$)/.exec(raw);
  const text = raw
    .replace(/\([^)]*\)/g, " ")
    .replace(/(?:^|[\s,])\+[1-9](?=[\s,)]|$)/g, " ")
    .replace(/[,]+/g, " ");
  return { text: normalizeName(text), bonus: bonusMatch ? Number(bonusMatch[1]) : 0 };
}

/** Whether `needle` appears in `haystack` as whole words. */
function containsWords(haystack: string, needle: string) {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z])${escaped}(?:$|[^a-z])`).test(haystack);
}

/** The longest key of `table` that `text` names, so "half plate" beats "plate". */
function longestNamed<T>(text: string, table: Map<string, T>): T | undefined {
  let best: T | undefined;
  let bestLength = 0;
  for (const [key, value] of table) {
    if (key.length > bestLength && containsWords(text, key)) {
      best = value;
      bestLength = key.length;
    }
  }
  return best;
}

const MAGIC_BY_NAME = new Map(MAGIC_ITEMS.map((item) => [normalizeName(item.name), item]));

/** Magic items without a tier in their name, the ones a longer name can contain. */
const MAGIC_BY_BASE_NAME = new Map(
  MAGIC_ITEMS.filter((item) => !/, \+\d$/.test(item.name)).map((item) => [normalizeName(item.name), item]),
);

/**
 * The catalogue's magic item a sheet entry names, however it was written:
 * "Wand of the War Mage +1", "+2 Rod of the Pact Keeper", "Flame Tongue
 * Shortsword".
 */
export function findMagicItem(name: string): MagicItem | undefined {
  const exact = MAGIC_BY_NAME.get(normalizeName(name));
  if (exact) return exact;
  const { text, bonus } = parseItemName(name);
  if (bonus) {
    const tiered = MAGIC_BY_NAME.get(`${text}, +${bonus}`);
    if (tiered) return tiered;
  }
  return MAGIC_BY_NAME.get(text) ?? longestNamed(text, MAGIC_BY_BASE_NAME);
}

/* ------------------------------------------------------------------ */
/* Archive items                                                       */
/* ------------------------------------------------------------------ */

/** An Archive item document, as far as the sheet reads one. */
export interface ArchiveItemStats {
  name: string;
  type?: string;
  properties?: string[];
  magicBonus?: number;
  armorClass?: { base?: number; dexterityModifier?: "full" | "max2" | "none" };
}

const DICE = /\b(\d+d\d+)\b/i;
const DAMAGE_TYPES =
  /\b(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\b/i;

function titleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/** A homebrew weapon the Archive describes only in its property list. */
function weaponFromArchive(item: ArchiveItemStats): WeaponStats | undefined {
  const properties = (item.properties ?? []).join(" | ");
  const versatile = /versatile\s*\((\d+d\d+)(?:\s*\/\s*(\d+d\d+))?\)/i.exec(properties);
  const dice = DICE.exec(properties.replace(/versatile\s*\([^)]*\)/i, ""))?.[1] ?? versatile?.[1];
  if (!dice) return undefined;
  const range = /(?:thrown|ammunition)\s*\((\d+)\s*\/\s*(\d+)/i.exec(properties);
  const ranged = /\branged\b|ammunition/i.test(properties);
  return {
    name: item.name,
    category: /\bmartial\b/i.test(properties) ? "Martial" : "Simple",
    kind: ranged ? "Ranged" : "Melee",
    damage: dice,
    damageType: titleCase(DAMAGE_TYPES.exec(properties)?.[1] ?? ""),
    versatile: versatile?.[2],
    finesse: /\bfinesse\b/i.test(properties),
    light: /\blight\b(?! armor)/i.test(properties),
    heavy: /\bheavy\b(?! armor)/i.test(properties),
    twoHanded: /two-handed/i.test(properties),
    reach: /\breach\b/i.test(properties),
    thrown: /\bthrown\b/i.test(properties),
    range: range ? [Number(range[1]), Number(range[2])] : undefined,
  };
}

/** A homebrew armor the Archive describes in its property list or AC object. */
function armorFromArchive(item: ArchiveItemStats): ArmorStats | undefined {
  const properties = (item.properties ?? []).join(" | ");
  if (/\bshield\b/i.test(item.name)) return { name: item.name, category: "Shield", base: 2 };
  const category = /heavy armor/i.test(properties)
    ? "Heavy"
    : /medium armor/i.test(properties)
      ? "Medium"
      : "Light";
  const base = item.armorClass?.base ?? Number(/\bAC\s*(\d{2})\b/i.exec(properties)?.[1] ?? Number.NaN);
  if (!Number.isFinite(base)) return undefined;
  const dexterity = item.armorClass?.dexterityModifier;
  const dexCap =
    dexterity === "none" || category === "Heavy"
      ? 0
      : dexterity === "max2" || category === "Medium"
        ? 2
        : undefined;
  return { name: item.name, category, base, dexCap };
}

/* ------------------------------------------------------------------ */
/* Weapons and armor                                                   */
/* ------------------------------------------------------------------ */

const WEAPON_BY_NAME = new Map<string, WeaponStats>([
  ...WEAPONS.map((weapon) => [normalizeName(weapon.name), weapon] as const),
  ...Object.entries(WEAPON_ALIASES).map(
    ([alias, name]) => [alias, WEAPONS.find((weapon) => weapon.name === name)!] as const,
  ),
]);

export interface ResolvedWeapon extends WeaponStats {
  /** Magic bonus to attack and damage rolls. */
  bonus: number;
  extraDamage?: string;
}

function findWeapon(name: string) {
  const { text } = parseItemName(name);
  return WEAPON_BY_NAME.get(text) ?? longestNamed(text, WEAPON_BY_NAME);
}

/**
 * The weapon a row of the Actions table names, with any magic it carries, or
 * undefined for a row that isn't a weapon.
 */
export function resolveWeapon(name: string, archive: ArchiveItemStats[] = []): ResolvedWeapon | undefined {
  if (!name.trim()) return undefined;
  const magic = findMagicItem(name)?.effect;
  const { bonus } = parseItemName(name);
  const archiveItem = archive.find((item) => item.type === "Weapon" && normalizeName(item.name) === normalizeName(name));

  const base =
    findWeapon(name) ??
    (magic?.weapon ? findWeapon(magic.weapon) : undefined) ??
    (archiveItem ? weaponFromArchive(archiveItem) : undefined);
  if (!base) return undefined;

  const archiveBonus =
    archiveItem?.magicBonus ??
    Number(/\+(\d)\s+(?:to hit|weapon)/i.exec((archiveItem?.properties ?? []).join(" "))?.[1] ?? 0);

  return {
    ...base,
    finesse: base.finesse || magic?.finesse,
    damageType: magic?.damageType ?? base.damageType,
    bonus: bonus || magic?.weaponBonus || archiveBonus || 0,
    extraDamage: magic?.extraDamage,
  };
}

const ARMOR_BY_NAME = new Map<string, ArmorStats>([
  ...ARMOR.map((armor) => [normalizeName(armor.name), armor] as const),
  ...Object.entries(ARMOR_ALIASES).map(
    ([alias, name]) => [alias, ARMOR.find((armor) => armor.name === name)!] as const,
  ),
]);

export interface ResolvedArmor extends ArmorStats {
  bonus: number;
}

/** The armor or shield an entry names, with its magic bonus. */
export function resolveArmor(name: string, archive: ArchiveItemStats[] = []): ResolvedArmor | undefined {
  if (!name.trim()) return undefined;
  const magic = findMagicItem(name)?.effect;
  const { text, bonus } = parseItemName(name);
  const archiveItem = archive.find((item) => item.type === "Armor" && normalizeName(item.name) === normalizeName(name));

  const base =
    ARMOR_BY_NAME.get(text) ??
    ARMOR_BY_NAME.get(`${text} armor`) ??
    (magic?.armor ? ARMOR_BY_NAME.get(normalizeName(magic.armor)) : undefined) ??
    (magic?.shieldBonus !== undefined ? ARMOR_BY_NAME.get("shield") : undefined) ??
    longestNamed(text, ARMOR_BY_NAME) ??
    (archiveItem ? armorFromArchive(archiveItem) : undefined);
  if (!base) return undefined;

  const magicBonus = base.category === "Shield" ? magic?.shieldBonus : magic?.armorBonus;
  return { ...base, bonus: bonus || magicBonus || archiveItem?.magicBonus || 0 };
}

/* ------------------------------------------------------------------ */
/* The character's rules                                               */
/* ------------------------------------------------------------------ */

export interface RulesFeature {
  level?: number;
  name: string;
  description?: string;
}

export interface RulesInput {
  ruleset?: "2014" | "2024";
  totalLevel: number;
  modifiers: Modifiers;
  classes: {
    id: string;
    name: string;
    level: number;
    spellcastingAbility?: string;
    primaryAbility?: string[];
    /** The weapons the class always trains with; null where the Archive doesn't say. */
    weaponProficiencies?: string[] | null;
    features?: RulesFeature[];
    /** The class table's Martial Arts or Fisticuffs die, by level. */
    unarmedDice?: { level: number; die?: string }[];
  }[];
  subclasses: {
    name: string;
    parentClassId?: string;
    /** The level of the class the subclass belongs to. */
    level: number;
    spellcastingAbility?: string;
    magicAbility?: string;
    grantsSpells?: boolean;
    features?: RulesFeature[];
  }[];
  species: { name: string; traits?: { name: string; description?: string }[] }[];
  feats: {
    name: string;
    description?: string;
    benefits?: string[];
    grantsSpells?: boolean;
    /** The ability the player picked for the feat's spells, where the creator recorded it. */
    spellcastingAbility?: string;
    /** The class list Magic Initiate draws on, where the name doesn't say. */
    spellList?: string;
    /** "Sage" — the background that granted it, when it was not chosen as a feat. */
    fromBackground?: string;
  }[];
  /** The Class and Subclass Features panels, for choices written in there. */
  featureText?: string;
  /** Page 1's Weapons block, one entry a line. */
  weaponTraining?: string[];
  magicItems?: { name: string; attuned: boolean }[];
  archiveItems?: ArchiveItemStats[];
}

/** A way of working out AC: base + abilities (each up to a cap) + bonus. */
export interface AcFormula {
  base: number;
  abilities: { ability: Ability; cap?: number }[];
  allowsShield: boolean;
  /** Iron Chin holds in light armor too. */
  allowsLightArmor?: boolean;
}

export interface DcEntry {
  ability: Ability;
  bonus: number;
}

export interface CastingEntry {
  source: string;
  ability: Ability;
  classId?: string;
}

export interface SheetRules {
  input: RulesInput;
  /** Every magic item whose benefits are live: attuned, or needing no attunement. */
  activeItems: { name: string; effect: MagicItemEffect }[];
  feats: Set<string>;
  /** Abilities every weapon attack may use on top of the usual (Hex Warrior). */
  weaponAbilities: Ability[];
  /** Abilities a Monk weapon may use (Martial Arts). */
  monkWeaponAbilities: Ability[];
  unarmedAbilities: Ability[];
  unarmedDie?: { die: string; type: string };
  martialArtsDie?: string;
  fisticuffsDie?: string;
  isProficient: (weapon: WeaponStats) => boolean;
  acFormulas: AcFormula[];
  /** AC bonuses that hold whatever is worn (Warforged's Integrated Protection). */
  flatAc: number;
  skillDcs: DcEntry[];
  casting: CastingEntry[];
  /** Spell save DC and spell attack bonuses by casting ability; "*" applies to all. */
  spellBonuses: { dc: Record<string, number>; attack: Record<string, number> };
}

/** 2024 backgrounds grant an origin feat; 2014 ones do not. */
export const BACKGROUND_ORIGIN_FEATS: Record<string, string> = {
  acolyte: "Magic Initiate (Cleric)",
  artisan: "Crafter",
  charlatan: "Skilled",
  criminal: "Alert",
  entertainer: "Musician",
  farmer: "Tough",
  guard: "Alert",
  guide: "Magic Initiate (Druid)",
  hermit: "Healer",
  merchant: "Lucky",
  noble: "Skilled",
  sage: "Magic Initiate (Wizard)",
  sailor: "Tavern Brawler",
  scribe: "Skilled",
  soldier: "Savage Attacker",
  wayfarer: "Lucky",
};

/** Magic Initiate (2014) casts with the class's own ability; 2024 keeps that as its default. */
const CLASS_CASTING_ABILITY: Record<string, Ability> = {
  bard: "CHA",
  cleric: "WIS",
  druid: "WIS",
  paladin: "CHA",
  ranger: "WIS",
  sorcerer: "CHA",
  warlock: "CHA",
  wizard: "INT",
  artificer: "INT",
};

/** Class-feature save DC abilities where the class's prose doesn't name one. */
const CLASS_SAVE_ABILITIES: Record<string, Ability[]> = {
  barbarian: ["STR"],
  bard: ["CHA"],
  cleric: ["WIS"],
  druid: ["WIS"],
  fighter: ["STR", "DEX"],
  monk: ["WIS"],
  paladin: ["CHA"],
  ranger: ["WIS"],
  rogue: ["DEX"],
  sorcerer: ["CHA"],
  warlock: ["CHA"],
  wizard: ["INT"],
  artificer: ["INT"],
};

/** The Martial Arts die by Monk level, for a class table the Archive lacks. */
function martialArtsDieAt(level: number, ruleset?: string) {
  const sizes = ruleset === "2014" ? [4, 6, 8, 10] : [6, 8, 10, 12];
  return `1d${sizes[level >= 17 ? 3 : level >= 11 ? 2 : level >= 5 ? 1 : 0]}`;
}

function averageOf(dice?: string) {
  const match = /^(\d+)d(\d+)$/i.exec(dice ?? "");
  if (!match) return Number(dice) || 0;
  return (Number(match[1]) * (Number(match[2]) + 1)) / 2;
}

function biggerDie(a: string | undefined, b: string | undefined) {
  if (!a) return b;
  if (!b) return a;
  return averageOf(b) > averageOf(a) ? b : a;
}

function reached<T extends RulesFeature>(features: T[] | undefined, level: number) {
  return (features ?? []).filter((feature) => !feature.level || feature.level <= level);
}

/** Features of a class or subclass that someone else's — a pet's, a form's — numbers are about. */
const NOT_THE_CHARACTER =
  /\b(?:form|forms|wild shape|companion|familiar|summon\w*|steel defender|homunculus|apparatus|device|construct|drake|steed|mount|its AC|it has|shifted|raging|reaction|bonus action|as an action|curl|withdraw)\b/i;

const AC_FORMULA =
  /(?:\bAC|\bArmor Class)\s*(?:equals|is|=|of|:)?\s*(\d{2})\b((?:\s*\+\s*(?:your\s+)?[A-Za-z]+(?:\s+modifier)?(?:\s*\(max(?:imum)?\s*(?:of\s*)?\+?\d\))?)*)/i;

/** "While wearing no armor, your AC equals 10 + DEX modifier + CON modifier." */
function acFormulaIn(sentence: string): AcFormula | undefined {
  if (NOT_THE_CHARACTER.test(sentence)) return undefined;
  const match = AC_FORMULA.exec(sentence);
  if (!match) return undefined;
  const base = Number(match[1]);
  if (base < 10 || base > 20) return undefined;

  const abilities: AcFormula["abilities"] = [];
  for (const part of match[2].matchAll(/\+\s*(?:your\s+)?([A-Za-z]+)(?:\s+modifier)?(?:\s*\(max(?:imum)?\s*(?:of\s*)?\+?(\d)\))?/gi)) {
    const ability = asAbility(part[1]);
    // "10 + your proficiency bonus" is some other rule; leave it alone.
    if (!ability) return undefined;
    abilities.push({ ability, cap: part[2] === undefined ? undefined : Number(part[2]) });
  }
  return {
    base,
    abilities,
    allowsShield: !/\b(?:no|without)\s+(?:a\s+)?shield|not\s+(?:wielding|using|holding|carrying)\s+(?:a\s+)?shield/i.test(sentence),
    allowsLightArmor: /light (?:armor )?or no armor/i.test(sentence) || undefined,
  };
}

/** "+1 to Armor Class", and nothing that only holds while something else is true. */
function flatAcIn(sentence: string) {
  if (NOT_THE_CHARACTER.test(sentence) || /\b(?:while|when|if|against)\b/i.test(sentence)) return 0;
  const match = /\+(\d)\s+(?:bonus\s+)?(?:to\s+)?(?:your\s+)?(?:Armor Class|AC)\b/i.exec(sentence);
  return match ? Number(match[1]) : 0;
}

/** The abilities a "save DC = 8 + …" clause is worked out from. */
function dcAbilitiesIn(sentence: string): Ability[] {
  if (!/\bDC\b/i.test(sentence) || /spell save DC/i.test(sentence)) return [];
  const clause = /8\s*\+([^.;)]*)/.exec(sentence);
  return clause ? abilitiesIn(clause[1]) : [];
}

/** "Wisdom is your spellcasting ability", "using Intelligence as your spellcasting ability". */
function castingAbilitiesIn(sentence: string): Ability[] {
  if (!/(?:\b(?:is|as)\s+(?:your|its|the)\s+spellcasting ability|spellcasting ability\s+(?:is|for)\b)/i.test(sentence)) {
    return [];
  }
  return abilitiesIn(sentence.split(/spellcasting ability/i).slice(0, 2).join(" "));
}

const ATTACK_INSTEAD =
  /\buse\s+(?:your\s+)?([A-Za-z]+)(?:\s+modifier)?,?\s+instead of\s+(?:your\s+)?(?:Strength|Dexterity)(?:\s+or\s+(?:Strength|Dexterity))?,?\s+for\s+(?:the\s+|their\s+|its\s+|this weapon's\s+|your\s+)?attack/gi;
const ATTACK_USE = /\buse\s+(?:your\s+)?([A-Za-z]+)(?:\s+modifier)?\s+for\s+(?:the\s+|their\s+|its\s+|your\s+)?attack and damage rolls/gi;

/** "Use Dexterity instead of Strength for attack and damage rolls", and where it holds. */
function attackAbilitiesIn(feature: RulesFeature) {
  const found: { ability: Ability; scope: "unarmed" | "monk" | "weapon" }[] = [];
  for (const sentence of sentences(feature.description)) {
    const scope = /astral/i.test(feature.name) || /unarmed/i.test(sentence)
      ? "unarmed"
      : /monk weapon/i.test(sentence)
        ? "monk"
        : "weapon";
    for (const pattern of [ATTACK_INSTEAD, ATTACK_USE]) {
      for (const match of sentence.matchAll(pattern)) {
        const ability = asAbility(match[1]);
        // Strength is every attack's default; only an alternative is news.
        if (ability && ability !== "STR") found.push({ ability, scope });
      }
    }
  }
  return found;
}

/** An Unarmed Strike die a trait grants: "your unarmed strikes deal 1d6 slashing damage". */
function unarmedDieIn(sentence: string) {
  if (!/unarmed strike/i.test(sentence)) return undefined;
  const dice = DICE.exec(sentence)?.[1];
  if (!dice) return undefined;
  return { die: dice.toLowerCase(), type: titleCase(DAMAGE_TYPES.exec(sentence)?.[1] ?? "Bludgeoning") };
}

function featNamed(feats: Set<string>, ...names: string[]) {
  return names.some((name) => feats.has(name));
}

/** Everything about this character the attack, AC and DC arithmetic depends on. */
export function buildSheetRules(input: RulesInput): SheetRules {
  const { modifiers, ruleset } = input;
  const best = (abilities: Ability[]) => bestAbility(abilities, modifiers);

  const activeItems = (input.magicItems ?? []).flatMap((entry) => {
    if (!entry.name.trim()) return [];
    const item = findMagicItem(entry.name);
    if (!item?.effect || (item.attunement && !entry.attuned)) return [];
    // A tier written beside the name ("Ring of Protection +2") is the player's.
    return [{ name: entry.name, effect: item.effect }];
  });

  const feats = new Set(input.feats.map((feat) => normalizeName(feat.name)));
  const featureText = normalizeName(input.featureText ?? "");

  const classFeatures = input.classes.flatMap((item) =>
    reached(item.features, item.level).map((feature) => ({ ...feature, classId: item.id })),
  );
  const subclassFeatures = input.subclasses.flatMap((item) => reached(item.features, item.level));
  const traits = input.species.flatMap((item) => item.traits ?? []);
  const featTexts = input.feats.map((feat) => ({
    feat,
    text: [feat.description, ...(feat.benefits ?? [])].filter(Boolean).join("\n"),
  }));

  /* Attack abilities ------------------------------------------------ */

  const weaponAbilities: Ability[] = [];
  const monkWeaponAbilities: Ability[] = [];
  const unarmedAbilities: Ability[] = [];
  const add = (list: Ability[], ability: Ability) => {
    if (!list.includes(ability)) list.push(ability);
  };

  const classIds = new Set(input.classes.map((item) => item.id));
  const subclassNames = input.subclasses.map((item) => normalizeName(item.name));
  const hasSubclass = (pattern: RegExp) => subclassNames.some((name) => pattern.test(name));

  if (classIds.has("monk")) {
    add(unarmedAbilities, "DEX");
    add(monkWeaponAbilities, "DEX");
  }
  if (hasSubclass(/astral self/)) add(unarmedAbilities, "WIS");
  if (hasSubclass(/hexblade/) || featureText.includes("pact of the blade")) add(weaponAbilities, "CHA");
  if (hasSubclass(/battle smith/)) add(weaponAbilities, "INT");

  for (const feature of [...classFeatures, ...subclassFeatures]) {
    for (const { ability, scope } of attackAbilitiesIn(feature)) {
      if (scope === "unarmed") add(unarmedAbilities, ability);
      else if (scope === "monk") add(monkWeaponAbilities, ability);
      else add(weaponAbilities, ability);
    }
  }

  /* Unarmed Strike die ---------------------------------------------- */

  let martialArtsDie: string | undefined;
  let fisticuffsDie: string | undefined;
  for (const item of input.classes) {
    const fromTable = item.unarmedDice
      ?.filter((row) => row.level <= item.level && row.die && DICE.test(row.die))
      .sort((a, b) => b.level - a.level)[0]?.die;
    if (item.id === "monk") {
      martialArtsDie = ruleset === "2014" ? martialArtsDieAt(item.level, ruleset) : fromTable ?? martialArtsDieAt(item.level);
    } else if (item.id === "pugilist") {
      fisticuffsDie = fromTable ?? martialArtsDieAt(item.level);
    } else if (fromTable) {
      martialArtsDie = biggerDie(martialArtsDie, fromTable);
    }
  }

  let unarmedDie: SheetRules["unarmedDie"];
  const offerUnarmed = (die: string | undefined, type = "Bludgeoning") => {
    if (die && (!unarmedDie || averageOf(die) > averageOf(unarmedDie.die))) unarmedDie = { die, type };
  };
  offerUnarmed(martialArtsDie);
  offerUnarmed(fisticuffsDie);
  if (featNamed(feats, "tavern brawler")) offerUnarmed("1d4");
  for (const trait of traits) {
    for (const sentence of sentences(trait.description)) {
      const found = unarmedDieIn(sentence);
      if (found) offerUnarmed(found.die, found.type);
    }
  }

  /* Weapon proficiency ---------------------------------------------- */

  const training = [
    ...input.classes.flatMap((item) => item.weaponProficiencies ?? []),
    ...(input.weaponTraining ?? []),
  ].map(normalizeName);
  for (const feature of [...classFeatures, ...subclassFeatures]) {
    for (const match of (feature.description ?? "").matchAll(/proficiency with (simple|martial) weapons/gi)) {
      training.push(`${match[1].toLowerCase()} weapons`);
    }
  }
  // Nothing to go on — no class the Archive describes, nothing written in —
  // and the sheet assumes what nearly every character's weapons are: trained.
  const knowsTraining = training.length > 0 || input.classes.some((item) => item.weaponProficiencies);
  const isProficient = (weapon: WeaponStats) => {
    if (!knowsTraining) return true;
    const category = weapon.category.toLowerCase();
    const name = normalizeName(weapon.name);
    return training.some((entry) => {
      const singular = entry.replace(/s$/, "");
      return (
        entry === `${category} weapons` ||
        entry === category ||
        (category === "martial" && /martial (melee )?weapons with the light property/.test(entry) && weapon.light && weapon.kind === "Melee") ||
        singular === name ||
        entry === name ||
        containsWords(entry, name)
      );
    });
  };

  /* Armor Class ----------------------------------------------------- */

  const acFormulas: AcFormula[] = [];
  const addFormula = (formula: AcFormula | undefined) => {
    if (!formula) return;
    const key = JSON.stringify(formula);
    if (!acFormulas.some((existing) => JSON.stringify(existing) === key)) acFormulas.push(formula);
  };
  if (classIds.has("barbarian")) {
    addFormula({ base: 10, abilities: [{ ability: "DEX" }, { ability: "CON" }], allowsShield: true });
  }
  if (classIds.has("monk")) {
    addFormula({ base: 10, abilities: [{ ability: "DEX" }, { ability: "WIS" }], allowsShield: false });
  }
  if (classIds.has("adept")) {
    addFormula({ base: 10, abilities: [{ ability: "DEX" }, { ability: "CHA" }], allowsShield: false });
  }
  if (classIds.has("pugilist")) {
    addFormula({ base: 12, abilities: [{ ability: "CON" }], allowsShield: false, allowsLightArmor: true });
  }
  if (classIds.has("sorcerer") && hasSubclass(/draconic/)) {
    addFormula(
      ruleset === "2014"
        ? { base: 13, abilities: [{ ability: "DEX" }], allowsShield: true }
        : { base: 10, abilities: [{ ability: "DEX" }, { ability: "CHA" }], allowsShield: true },
    );
  }
  let flatAc = 0;
  for (const feature of [...classFeatures, ...subclassFeatures, ...traits]) {
    for (const sentence of sentences(feature.description)) {
      const formula = acFormulaIn(sentence);
      if (formula) addFormula(formula);
    }
  }
  for (const trait of traits) {
    for (const sentence of sentences(trait.description)) flatAc += flatAcIn(sentence);
  }

  /* Class-feature save DCs ------------------------------------------ */

  const skillDcs: DcEntry[] = [];
  const addDc = (ability: Ability | undefined, bonus = 0) => {
    if (ability && !skillDcs.some((entry) => entry.ability === ability && entry.bonus === bonus)) {
      skillDcs.push({ ability, bonus });
    }
  };
  const itemClassDc = (classId: string) =>
    activeItems.reduce(
      (total, { effect }) => total + (effect.classDc && effect.classes?.includes(classId) ? effect.classDc : 0),
      0,
    );

  for (const item of input.classes) {
    const fromText = reached(item.features, item.level).flatMap((feature) =>
      sentences(feature.description).flatMap(dcAbilitiesIn),
    );
    const abilities = fromText.length
      ? fromText
      : CLASS_SAVE_ABILITIES[item.id] ??
        [asAbility(item.spellcastingAbility)].filter((ability): ability is Ability => Boolean(ability));
    const fallback = (item.primaryAbility ?? []).map(asAbility).filter((ability): ability is Ability => Boolean(ability));
    addDc(best(abilities.length ? abilities : fallback), itemClassDc(item.id));
  }
  for (const text of [
    ...subclassFeatures.map((feature) => feature.description),
    ...traits.map((trait) => trait.description),
    ...featTexts.map(({ text }) => text),
  ]) {
    for (const sentence of sentences(text)) {
      const abilities = dcAbilitiesIn(sentence);
      if (abilities.length) addDc(best(abilities));
    }
  }

  /* Spellcasting ---------------------------------------------------- */

  const casting: CastingEntry[] = [];
  const addCasting = (source: string, ability: Ability | undefined, classId?: string) => {
    if (ability && !casting.some((entry) => entry.source === source && entry.ability === ability)) {
      casting.push({ source, ability, classId });
    }
  };
  const castingFromText = (text?: string) => {
    for (const sentence of sentences(text)) {
      const abilities = castingAbilitiesIn(sentence);
      if (abilities.length) return best(abilities);
    }
    return undefined;
  };

  for (const item of input.classes) {
    addCasting(item.name, asAbility(item.spellcastingAbility), item.id);
  }
  for (const item of input.subclasses) {
    // A caster class's own subclasses say nothing here and add nothing;
    // Eldritch Knight, or a Warrior of Shadow's illusions, name the ability.
    const ability =
      asAbility(item.spellcastingAbility ?? item.magicAbility) ??
      reached(item.features, item.level).map((feature) => castingFromText(feature.description)).find(Boolean);
    addCasting(item.name, ability, item.parentClassId);
  }
  for (const item of input.species) {
    const ability = (item.traits ?? []).map((trait) => castingFromText(trait.description)).find(Boolean);
    addCasting(item.name, ability);
  }
  for (const { feat, text } of featTexts) {
    const name = normalizeName(feat.name);
    const listClass =
      /initiate\s*\((\w+)\)/.exec(name)?.[1] ??
      (name.startsWith("magic initiate") && feat.spellList ? feat.spellList.trim().toLowerCase() : undefined);
    const ability =
      asAbility(feat.spellcastingAbility) ??
      (listClass ? CLASS_CASTING_ABILITY[listClass] : undefined) ??
      (name.startsWith("artificer initiate") ? "INT" : undefined) ??
      castingFromText(text) ??
      (feat.grantsSpells ? best(["INT", "WIS", "CHA"]) : undefined);
    if (feat.grantsSpells || castingFromText(text)) addCasting(feat.name, ability);
  }

  const spellBonuses: SheetRules["spellBonuses"] = { dc: {}, attack: {} };
  for (const { effect } of activeItems) {
    if (!effect.spellAttack && !effect.spellDc) continue;
    const abilities = effect.classes
      ? casting.filter((entry) => entry.classId && effect.classes!.includes(entry.classId)).map((entry) => entry.ability)
      : ["*"];
    for (const ability of new Set(abilities)) {
      if (effect.spellDc) spellBonuses.dc[ability] = (spellBonuses.dc[ability] ?? 0) + effect.spellDc;
      if (effect.spellAttack) spellBonuses.attack[ability] = (spellBonuses.attack[ability] ?? 0) + effect.spellAttack;
    }
  }

  return {
    input,
    activeItems,
    feats,
    weaponAbilities,
    monkWeaponAbilities,
    unarmedAbilities,
    unarmedDie,
    martialArtsDie,
    fisticuffsDie,
    isProficient,
    acFormulas,
    flatAc,
    skillDcs,
    casting,
    spellBonuses,
  };
}

/* ------------------------------------------------------------------ */
/* Armor Class                                                         */
/* ------------------------------------------------------------------ */

/** One way the AC can be worked out; the sheet shows the best. */
export interface AcCandidate {
  base: number;
  abilities: { ability: Ability; cap?: number }[];
  bonus: number;
}

const NO_SHIELD = /^(?:none|no|n\/?a|-|—|x|0)$/i;

/** Several entries in one field: "Chain Mail / Shield", or one per line. */
function entriesOf(value: string) {
  return value
    .split(/[\n/;]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function candidateValue(candidate: AcCandidate, modifiers: Modifiers) {
  let total = candidate.base + candidate.bonus;
  for (const { ability, cap } of candidate.abilities) {
    const modifier = modifierOf(modifiers, ability);
    if (modifier === null) return null;
    total += cap === undefined ? modifier : Math.min(modifier, cap);
  }
  return total;
}

/**
 * Armor Class from what is worn — the Armor and Shield fields, and any armor
 * among the magic items — and every formula the character has to choose from:
 * Unarmored Defense, natural armor, the Robe of the Archmagi. The best wins.
 *
 * The candidates are returned as well as the answer, so the HTML download can
 * keep picking the best of them as the ability scores change.
 */
export function armorClass(rules: SheetRules, armorField: string, shieldField: string) {
  const { modifiers } = rules.input;
  const archive = rules.input.archiveItems ?? [];
  const worn: ResolvedArmor[] = [];
  let shieldBonus = 0;
  let hasShield = false;

  const consider = (armor: ResolvedArmor | undefined) => {
    if (!armor) return;
    if (armor.category === "Shield") {
      hasShield = true;
      shieldBonus = Math.max(shieldBonus, armor.base + armor.bonus);
    } else {
      worn.push(armor);
    }
  };
  entriesOf(armorField).forEach((entry) => consider(resolveArmor(entry, archive)));
  for (const entry of entriesOf(shieldField)) {
    if (NO_SHIELD.test(entry)) continue;
    const shield = resolveArmor(entry, archive);
    // Anything else written there — "Yes", "Proficient" — is a plain shield.
    consider(shield?.category === "Shield" ? shield : { ...ARMOR_BY_NAME.get("shield")!, bonus: 0 });
  }
  for (const item of rules.activeItems) {
    const armor = resolveArmor(item.name, archive);
    if (armor && (item.effect.armor || item.effect.armorBonus || item.effect.shieldBonus !== undefined)) consider(armor);
  }

  const mediumArmorMaster = featNamed(rules.feats, "medium armor master");
  const itemAc = rules.activeItems.reduce((total, { effect }) => total + (effect.ac ?? 0), 0);
  // "Armor, +1" among the magic items is whatever armor the Armor field names.
  const genericArmorBonus = rules.activeItems.reduce(
    (most, { name, effect }) => (/^\s*(?:\+\d\s+)?armor\b/i.test(name) ? Math.max(most, effect.armorBonus ?? 0) : most),
    0,
  );
  const candidates: AcCandidate[] = [];

  const armored = worn.length > 0;
  for (const armor of worn) {
    const cap = armor.category === "Medium" && mediumArmorMaster ? 3 : armor.dexCap;
    candidates.push({
      base: armor.base + (armor.bonus || genericArmorBonus),
      abilities: cap === 0 ? [] : [{ ability: "DEX", cap }],
      bonus: 0,
    });
  }
  const lightOnly = armored && worn.every((armor) => armor.category === "Light");
  if (!armored) candidates.push({ base: 10, abilities: [{ ability: "DEX" }], bonus: 0 });
  for (const formula of rules.acFormulas) {
    if (hasShield && !formula.allowsShield) continue;
    if (armored && !(formula.allowsLightArmor && lightOnly)) continue;
    candidates.push({ base: formula.base, abilities: formula.abilities, bonus: 0 });
  }
  if (!armored) {
    for (const { effect } of rules.activeItems) {
      if (effect.unarmoredBase) candidates.push({ base: effect.unarmoredBase, abilities: [{ ability: "DEX" }], bonus: 0 });
    }
  }

  const bracers = !armored && !hasShield
    ? rules.activeItems.reduce((total, { effect }) => total + (effect.acUnarmored ?? 0), 0)
    : 0;
  const defense = armored && featNamed(rules.feats, "defense", "fighting style: defense") ? 1 : 0;
  const flat = (hasShield ? shieldBonus : 0) + itemAc + rules.flatAc + bracers + defense;
  for (const candidate of candidates) candidate.bonus += flat;

  let value: number | null = null;
  for (const candidate of candidates) {
    const total = candidateValue(candidate, modifiers);
    if (total !== null && (value === null || total > value)) value = total;
  }
  return { value: value === null ? "" : `${value}`, candidates };
}

/* ------------------------------------------------------------------ */
/* Save DCs and spellcasting                                           */
/* ------------------------------------------------------------------ */

/** "WIS+1" — how a DC's ability and bonus travel to the HTML download. */
export function abilityToken(ability: string, bonus: number) {
  return `${ability}${bonus ? formatModifier(bonus) : ""}`;
}

/**
 * The class-feature save DCs, one per ability behind them. A single DC reads
 * as a bare number, as the sheet always has; several are labelled, "14 WIS /
 * 13 CON", since a Monk's Focus and a Dragonborn's breath are different rolls.
 */
export function skillSaveDc(rules: SheetRules, proficiencyBonus: number | null) {
  const { modifiers } = rules.input;
  const entries = rules.skillDcs.flatMap((entry) => {
    const modifier = modifierOf(modifiers, entry.ability);
    return proficiencyBonus === null || modifier === null
      ? []
      : [{ ...entry, dc: 8 + proficiencyBonus + modifier + entry.bonus }];
  });
  const value =
    entries.length === 1
      ? `${entries[0].dc}`
      : entries.map((entry) => `${entry.dc} ${entry.ability}`).join(" / ");
  return {
    value,
    tokens: rules.skillDcs.map((entry) => abilityToken(entry.ability, entry.bonus)).join(" / "),
  };
}

/** The bonus a casting ability's spells get from magic items, DC or attack. */
export function spellBonusFor(bonuses: Record<string, number>, ability: string) {
  return (bonuses[ability] ?? 0) + (bonuses["*"] ?? 0);
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

export interface ActionStats {
  attack: string;
  damage: string;
  range: string;
}

export interface ActionContext {
  rules: SheetRules;
  proficiencyBonus: number | null;
}

/**
 * Monk weapons. 2024: simple melee weapons, and martial melee weapons with the
 * Light property. 2014: simple melee weapons that are neither Two-Handed nor
 * Heavy, and shortswords.
 */
function isMonkWeapon(weapon: WeaponStats, ruleset?: string) {
  if (weapon.kind !== "Melee") return false;
  if (ruleset === "2014") {
    return (weapon.category === "Simple" && !weapon.twoHanded && !weapon.heavy) || weapon.name.toLowerCase() === "shortsword";
  }
  return weapon.category === "Simple" || Boolean(weapon.light);
}

/** Pugilist weapons: simple melee weapons without Two-Handed, and whips. */
function isPugilistWeapon(weapon: WeaponStats) {
  return (weapon.kind === "Melee" && weapon.category === "Simple" && !weapon.twoHanded) || /\bwhip\b/i.test(weapon.name);
}

function damageText(die: string, addend: number, type: string) {
  if (!die) return "";
  if (!DICE.test(die)) return `${Math.max(1, Number(die) + addend)}${type ? ` ${type}` : ""}`;
  return `${die}${formatAddend(addend)}${type ? ` ${type}` : ""}`;
}

function rangeText(weapon: WeaponStats) {
  const range = weapon.range ? `${weapon.range[0]}/${weapon.range[1]} ft` : "";
  if (weapon.kind === "Ranged") return range;
  const melee = weapon.reach ? "10 ft" : "5 ft";
  return weapon.thrown && range ? `${melee} · ${range}` : melee;
}

/** Attack bonus, damage and range for a weapon the Actions table names. */
export function weaponAction(name: string, context: ActionContext): ActionStats | undefined {
  const { rules, proficiencyBonus } = context;
  const { modifiers, ruleset } = rules.input;
  const weapon = resolveWeapon(name, rules.input.archiveItems);
  if (!weapon) return undefined;

  const candidates: Ability[] = [weapon.kind === "Ranged" ? "DEX" : "STR"];
  if (weapon.finesse) candidates.push("STR", "DEX");
  const monkWeapon = rules.martialArtsDie !== undefined && isMonkWeapon(weapon, ruleset);
  if (monkWeapon) candidates.push(...rules.monkWeaponAbilities);
  candidates.push(...rules.weaponAbilities);
  const ability = bestAbility(candidates, modifiers)!;
  const modifier = modifierOf(modifiers, ability);

  let die = weapon.damage;
  let versatile = weapon.versatile;
  if (monkWeapon) {
    die = biggerDie(die, rules.martialArtsDie)!;
    versatile = versatile && biggerDie(versatile, rules.martialArtsDie);
  }
  // A Pugilist can't use a weapon's Finesse property with Fisticuffs.
  if (rules.fisticuffsDie && isPugilistWeapon(weapon) && ability !== "DEX") {
    die = biggerDie(die, rules.fisticuffsDie)!;
    versatile = versatile && biggerDie(versatile, rules.fisticuffsDie);
  }

  const feats = rules.feats;
  const ranged = weapon.kind === "Ranged";
  const archery = ranged && featNamed(feats, "archery", "fighting style: archery") ? 2 : 0;
  const dueling = !ranged && !weapon.twoHanded && featNamed(feats, "dueling", "fighting style: dueling") ? 2 : 0;
  const itemDamage = rules.activeItems.reduce((total, { effect }) => {
    const bonus = effect.damageBonus;
    return bonus && bonus.weapons.some((item) => normalizeName(item) === normalizeName(weapon.name))
      ? total + bonus.amount
      : total;
  }, 0);

  const proficient = rules.isProficient(weapon);
  const attack =
    modifier === null || proficiencyBonus === null
      ? ""
      : formatModifier(modifier + (proficient ? proficiencyBonus : 0) + weapon.bonus + archery);

  let damage = "";
  if (modifier !== null && die) {
    const addend = modifier + weapon.bonus + itemDamage;
    const oneHanded = damageText(die, addend + dueling, "");
    const twoHanded = versatile ? damageText(versatile, addend, "") : "";
    damage = [twoHanded ? `${oneHanded} / ${twoHanded}` : oneHanded, weapon.damageType].filter(Boolean).join(" ");
    if (weapon.extraDamage) damage += ` + ${weapon.extraDamage}`;
  }

  return { attack, damage, range: rangeText(weapon) };
}

/** Whether an Actions row means the character's own fists. */
export function isUnarmedStrike(name: string) {
  return /\bunarmed\b|\bfists?\b|\bpunch(?:es)?\b/i.test(name);
}

/** The Unarmed Strike, with whatever die and ability the character's rules give it. */
export function unarmedAction(context: ActionContext): ActionStats {
  const { rules, proficiencyBonus } = context;
  const { modifiers } = rules.input;
  const ability = bestAbility(["STR", ...rules.unarmedAbilities], modifiers)!;
  const modifier = modifierOf(modifiers, ability);
  const bonus = rules.activeItems.reduce((total, { effect }) => total + (effect.unarmed ?? 0), 0);

  const attack =
    modifier === null || proficiencyBonus === null ? "" : formatModifier(modifier + proficiencyBonus + bonus);
  const die = rules.unarmedDie;
  const damage =
    modifier === null
      ? ""
      : die
        ? damageText(die.die, modifier + bonus, die.type)
        : `${Math.max(1, 1 + modifier + bonus)} Bludgeoning`;
  return { attack, damage, range: "5 ft" };
}

/** A spell as the Actions table reads one. */
export interface ActionSpell {
  level: number;
  range?: string;
  description?: string;
  /** Where the Archive keeps a cantrip's damage scaling. */
  higherLevels?: string;
}

/**
 * A spell in the Actions table: its attack bonus or save DC, the damage it
 * opens with (cantrips scaled to the character's level), and its range.
 */
export function spellAction(
  spell: ActionSpell,
  context: ActionContext,
  casting: { attack: string; dc: string },
): ActionStats {
  const description = spell.description ?? "";
  const attack = /spell attack/i.test(description)
    ? casting.attack
    : /saving throw|\bsave\b/i.test(description) && casting.dc
      ? `DC ${casting.dc}`
      : "";

  let damage = "";
  const hit = /(\d+)d(\d+)(?:\s*\+\s*\d+)?\s+(\w+)\s+damage/i.exec(description);
  if (hit) {
    let count = Number(hit[1]);
    const increase = /damage increases by (\d+)d(\d+)/i.exec(`${description} ${spell.higherLevels ?? ""}`);
    if (spell.level === 0 && increase && increase[2] === hit[2]) {
      const level = context.rules.input.totalLevel;
      const tiers = (level >= 5 ? 1 : 0) + (level >= 11 ? 1 : 0) + (level >= 17 ? 1 : 0);
      count += tiers * Number(increase[1]);
    }
    const type = DAMAGE_TYPES.test(hit[3]) ? ` ${titleCase(hit[3])}` : "";
    damage = `${count}d${hit[2]}${type}`;
  }
  return { attack, damage, range: spell.range ?? "" };
}
