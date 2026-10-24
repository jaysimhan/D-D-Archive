/**
 * Weapon groups and the training that covers them.
 *
 * Every weapon is tagged Simple or Martial, Melee or Ranged, plus its
 * properties (Finesse, Light, Heavy …), and a proficiency can name any of
 * those: "Simple Weapons", "Martial Ranged Weapons", "Martial Weapons that
 * have the Finesse or Light property", "Firearms", or a single weapon.
 */
import { Item } from "../types/dnd-types";
import { WEAPONS, WEAPON_ALIASES, type WeaponCategory, type WeaponKind, type WeaponStats } from "../data/srd-equipment";
import { SRD_MAGIC_ITEMS } from "../data/srd-magic-items";

/** What's needed to place an item in its weapon groups; a shop line's name and type will do. */
export type WeaponLike = Pick<Item, "name" | "type"> &
    Partial<Pick<Item, "baseItem" | "weaponCategory" | "weaponRange" | "properties">>;

export interface WeaponTags {
    name: string;
    category?: WeaponCategory;
    kind?: WeaponKind;
    /** "Finesse", "Light", "Heavy", "Two-Handed", "Reach", "Thrown", "Loading", "Versatile", "Ammunition". */
    properties: string[];
}

/** How well a character's training covers a weapon, or a magic weapon that can be one of several. */
export type WeaponProficiency = "proficient" | "partial" | "not-proficient";

const PROPERTY_NAMES = ["Finesse", "Light", "Heavy", "Two-Handed", "Reach", "Thrown", "Loading", "Versatile", "Ammunition"];
const FIREARMS = ["Musket", "Pistol"];

const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, " ").trim();

export function tagsFromStats(weapon: WeaponStats): WeaponTags {
    const flags: [boolean | undefined, string][] = [
        [weapon.finesse, "Finesse"],
        [weapon.light, "Light"],
        [weapon.heavy, "Heavy"],
        [weapon.twoHanded, "Two-Handed"],
        [weapon.reach, "Reach"],
        [weapon.thrown, "Thrown"],
        [weapon.loading, "Loading"],
        [Boolean(weapon.versatile), "Versatile"],
        [Boolean(weapon.range) && !weapon.thrown, "Ammunition"],
    ];
    return {
        name: weapon.name,
        category: weapon.category,
        kind: weapon.kind,
        properties: flags.filter(([on]) => on).map(([, name]) => name),
    };
}

const WEAPON_BY_NAME = new Map<string, WeaponStats>([
    ...WEAPONS.map((weapon) => [normalize(weapon.name), weapon] as const),
    ...Object.entries(WEAPON_ALIASES).map(([alias, name]) => [alias, WEAPONS.find((weapon) => weapon.name === name)!] as const),
]);

/**
 * The weapons a base-item line allows: "Longsword", or a group such as
 * "Any Sword", "Any Axe or Sword", "Any Melee Weapon", "Any Simple or Martial
 * Weapon". Ammunition isn't a weapon of its own, so it allows none.
 */
function weaponsForBase(base: string): WeaponStats[] {
    const text = normalize(base);
    const exact = WEAPON_BY_NAME.get(text);
    if (exact) return [exact];
    if (!text.startsWith("any ") || /ammunition/.test(text)) return [];

    // The 2014-only Net does no damage and isn't anyone's magic weapon.
    let weapons = WEAPONS.filter((weapon) => weapon.damage);
    if (/\bmelee\b/.test(text)) weapons = weapons.filter((weapon) => weapon.kind === "Melee");
    if (/\branged\b/.test(text)) weapons = weapons.filter((weapon) => weapon.kind === "Ranged");
    const families = [
        /\bswords?\b/.test(text) && /sword|rapier|scimitar/i,
        /\baxes?\b/.test(text) && /axe/i,
        /\bbows?\b/.test(text) && /bow$/i,
    ].filter((family): family is RegExp => Boolean(family));
    if (families.length) weapons = weapons.filter((weapon) => families.some((family) => family.test(weapon.name)));
    const damage = /deals (\w+) damage/.exec(text)?.[1];
    if (damage) weapons = weapons.filter((weapon) => weapon.damageType.toLowerCase() === damage);
    return weapons;
}

/** What the SRD says a magic weapon is made from, matched on its name: "Weapon, +1, +2, or +3" → "Weapon, +1". */
function srdBaseItem(name: string): string | undefined {
    const stem = normalize(name).split(", +")[0];
    return SRD_MAGIC_ITEMS.find((entry) => entry.type === "Weapon" && normalize(entry.name).split(", +")[0] === stem)?.baseItem;
}

/** Tags written on the document itself, for homebrew and books the SRD table doesn't hold. */
function tagsFromDocument(item: WeaponLike): WeaponTags | undefined {
    const written = item.properties ?? [];
    const has = (word: string) => written.some((property) => normalize(property) === word.toLowerCase());
    const category = item.weaponCategory ?? (has("Martial") ? "Martial" : has("Simple") ? "Simple" : undefined);
    if (!category) return undefined;
    return {
        name: item.name,
        category,
        kind: item.weaponRange ?? (has("Ranged") ? "Ranged" : has("Melee") ? "Melee" : undefined),
        properties: PROPERTY_NAMES.filter((property) =>
            written.some((text) => normalize(text).startsWith(property.toLowerCase())),
        ),
    };
}

/**
 * The weapon an item is, or the several it could be when it's a magic weapon
 * of "any sword". Empty for anything that isn't a weapon.
 */
export function weaponOptions(item: WeaponLike): WeaponTags[] {
    if (item.type !== "Weapon") return [];
    const fromDocument = item.weaponCategory ? tagsFromDocument(item) : undefined;
    if (fromDocument) return [fromDocument];

    // "+1 Longsword" and "Longsword, +1" are both a longsword.
    const plain = item.name.replace(/^\+\d\s+/, "").replace(/,?\s*\+\d.*$/, "");
    const base = WEAPON_BY_NAME.has(normalize(plain)) ? plain : item.baseItem ?? srdBaseItem(item.name);
    const weapons = base ? weaponsForBase(base) : [];
    if (weapons.length) return weapons.map(tagsFromStats);

    const loose = tagsFromDocument(item);
    return loose ? [loose] : [];
}

/** The tags every option shares, for a card to show: "Martial", "Melee", "Finesse". */
export function sharedTags(options: WeaponTags[]): string[] {
    if (!options.length) return [];
    const [first, ...rest] = options;
    const tags = [first.category, first.kind, ...first.properties].filter((tag): tag is string => Boolean(tag));
    return tags.filter((tag) =>
        rest.every((option) => option.category === tag || option.kind === tag || option.properties.includes(tag)),
    );
}

/**
 * Whether one line of training covers a weapon. Understands categories,
 * melee or ranged, property groups and weapon names, singular or plural.
 */
export function trainingCovers(entry: string, weapon: WeaponTags): boolean {
    const text = normalize(entry);
    if (text === "firearms") return FIREARMS.includes(weapon.name);

    const group = /^(?:(simple|martial) )?(?:(melee|ranged) )?weapons?(?: (?:with|that have) the (.+?) propert(?:y|ies))?$/.exec(text);
    if (group && (group[1] || group[2] || group[3])) {
        const [, category, kind, properties] = group;
        if (category && weapon.category?.toLowerCase() !== category) return false;
        if (kind && weapon.kind?.toLowerCase() !== kind) return false;
        if (properties) {
            const wanted = properties.split(/\s*(?:,|\bor\b)\s*/).filter(Boolean);
            return weapon.properties.some((property) => wanted.includes(property.toLowerCase()));
        }
        return true;
    }
    if (text === "simple" || text === "martial") return weapon.category?.toLowerCase() === text;

    const name = normalize(weapon.name);
    return text === name || text.replace(/e?s$/, "") === name || text.replace(/s$/, "") === name;
}

/**
 * How a character's weapon training covers an item: every weapon it could be,
 * only some (a magic "any sword" they can pick a trained sword for), or none.
 * Undefined for anything that isn't a weapon.
 */
export function weaponProficiency(item: WeaponLike, training: string[]): WeaponProficiency | undefined {
    const options = weaponOptions(item);
    if (!options.length) return undefined;
    const trained = options.filter((option) => training.some((entry) => trainingCovers(entry, option)));
    if (trained.length === options.length) return "proficient";
    return trained.length ? "partial" : "not-proficient";
}
