/**
 * What a new character starts out carrying: the class and background kits, the
 * gold that comes with them, and what living costs. The Archive's documents
 * carry none of this for classes, and for backgrounds only prose (most 2024
 * backgrounds just read "50 GP"), so the Player's Handbook kits live here.
 *
 * The two rulesets hand out equipment differently:
 * - 2024: the class and the background each offer a kit with some gold (A,
 *   sometimes B) or gold alone; each is chosen on its own.
 * - 2014: the class kit is a list of "(a) or (b)" picks, and the background
 *   adds its own list with a pouch of gold. A player may instead roll the
 *   class's starting wealth and buy everything, giving up both kits.
 *
 * Item names are the catalogue's (srd-equipment-catalogue.ts) so a kit's
 * contents can be priced and looked up; anything the catalogue has no entry
 * for — a trophy, a letter — is carried by its own name.
 */

/** A slot the player fills with any one item of a kind. */
export type PickKind =
    | "Simple Weapon"
    | "Simple Melee Weapon"
    | "Martial Weapon"
    | "Martial Melee Weapon"
    | "Musical Instrument"
    | "Artisan's Tools"
    | "Gaming Set"
    | "Arcane Focus"
    | "Druidic Focus"
    | "Holy Symbol";

export type KitLine =
    | { item: string; quantity?: number }
    | { pick: PickKind; quantity?: number }
    /** 2014's "(a) … or (b) …": each alternative is its own list of lines. */
    | { oneOf: KitLine[][] };

export interface KitOption {
    /** "A", "B" — or "kit" and "wealth" for 2014. */
    id: string;
    lines: KitLine[];
    gp: number;
    /** 2014 starting wealth: roll `dice`d4, times `multiplier` gp. */
    wealth?: { dice: number; multiplier: number };
}

const item = (name: string, quantity?: number): KitLine => (quantity ? { item: name, quantity } : { item: name });
const pick = (kind: PickKind, quantity?: number): KitLine => (quantity ? { pick: kind, quantity } : { pick: kind });
const oneOf = (...alternatives: KitLine[][]): KitLine => ({ oneOf: alternatives });
const gold = (gp: number): KitOption => ({ id: "B", lines: [], gp });

/* ------------------------------------------------------------------ */
/* Classes, 2024                                                       */
/* ------------------------------------------------------------------ */

export const CLASS_KITS_2024: Record<string, KitOption[]> = {
    artificer: [
        {
            id: "A",
            lines: [item("Studded Leather Armor"), item("Dagger"), item("Thieves' Tools"), item("Tinker's Tools"), item("Dungeoneer's Pack")],
            gp: 16,
        },
        gold(150),
    ],
    barbarian: [
        { id: "A", lines: [item("Greataxe"), item("Handaxe", 4), item("Explorer's Pack")], gp: 15 },
        gold(75),
    ],
    bard: [
        { id: "A", lines: [item("Leather Armor"), item("Dagger", 2), pick("Musical Instrument"), item("Entertainer's Pack")], gp: 19 },
        gold(90),
    ],
    cleric: [
        { id: "A", lines: [item("Chain Shirt"), item("Shield"), item("Mace"), pick("Holy Symbol"), item("Priest's Pack")], gp: 7 },
        gold(110),
    ],
    druid: [
        {
            id: "A",
            // The quarterstaff doubles as the druidic focus.
            lines: [item("Leather Armor"), item("Shield"), item("Sickle"), item("Quarterstaff"), item("Explorer's Pack"), item("Herbalism Kit")],
            gp: 9,
        },
        gold(50),
    ],
    fighter: [
        { id: "A", lines: [item("Chain Mail"), item("Greatsword"), item("Flail"), item("Javelin", 8), item("Dungeoneer's Pack")], gp: 4 },
        {
            id: "B",
            lines: [
                item("Studded Leather Armor"), item("Scimitar"), item("Shortsword"), item("Longbow"),
                item("Arrows (20)"), item("Quiver"), item("Dungeoneer's Pack"),
            ],
            gp: 11,
        },
        { id: "C", lines: [], gp: 155 },
    ],
    monk: [
        // The tool is the one the monk chose to be proficient with.
        { id: "A", lines: [item("Spear"), item("Dagger", 5), oneOf([pick("Artisan's Tools")], [pick("Musical Instrument")]), item("Explorer's Pack")], gp: 11 },
        gold(50),
    ],
    paladin: [
        {
            id: "A",
            lines: [item("Chain Mail"), item("Shield"), item("Longsword"), item("Javelin", 6), pick("Holy Symbol"), item("Priest's Pack")],
            gp: 9,
        },
        gold(150),
    ],
    ranger: [
        {
            id: "A",
            lines: [
                item("Studded Leather Armor"), item("Scimitar"), item("Shortsword"), item("Longbow"), item("Arrows (20)"),
                item("Quiver"), item("Sprig of Mistletoe (Druidic Focus)"), item("Explorer's Pack"),
            ],
            gp: 7,
        },
        gold(150),
    ],
    rogue: [
        {
            id: "A",
            lines: [
                item("Leather Armor"), item("Dagger", 2), item("Shortsword"), item("Shortbow"), item("Arrows (20)"),
                item("Quiver"), item("Thieves' Tools"), item("Burglar's Pack"),
            ],
            gp: 8,
        },
        gold(100),
    ],
    sorcerer: [
        { id: "A", lines: [item("Spear"), item("Dagger", 2), item("Crystal (Arcane Focus)"), item("Dungeoneer's Pack")], gp: 28 },
        gold(50),
    ],
    warlock: [
        {
            id: "A",
            lines: [
                item("Leather Armor"), item("Sickle"), item("Dagger", 2), item("Orb (Arcane Focus)"),
                item("Book (occult lore)"), item("Scholar's Pack"),
            ],
            gp: 15,
        },
        gold(100),
    ],
    wizard: [
        {
            id: "A",
            // The quarterstaff doubles as the arcane focus.
            lines: [item("Dagger", 2), item("Quarterstaff"), item("Robe"), item("Spellbook"), item("Scholar's Pack")],
            gp: 5,
        },
        gold(55),
    ],
};

/* ------------------------------------------------------------------ */
/* Classes, 2014                                                       */
/* ------------------------------------------------------------------ */

const lightCrossbow = [item("Light Crossbow"), item("Bolts (20)")];

const CLASS_KIT_LINES_2014: Record<string, KitLine[]> = {
    artificer: [
        pick("Simple Weapon"),
        pick("Simple Weapon"),
        ...lightCrossbow,
        oneOf([item("Studded Leather Armor")], [item("Scale Mail")]),
        item("Thieves' Tools"),
        item("Dungeoneer's Pack"),
    ],
    barbarian: [
        oneOf([item("Greataxe")], [pick("Martial Melee Weapon")]),
        oneOf([item("Handaxe", 2)], [pick("Simple Weapon")]),
        item("Explorer's Pack"),
        item("Javelin", 4),
    ],
    bard: [
        oneOf([item("Rapier")], [item("Longsword")], [pick("Simple Weapon")]),
        oneOf([item("Diplomat's Pack")], [item("Entertainer's Pack")]),
        oneOf([item("Lute")], [pick("Musical Instrument")]),
        item("Leather Armor"),
        item("Dagger"),
    ],
    cleric: [
        oneOf([item("Mace")], [item("Warhammer")]),
        oneOf([item("Scale Mail")], [item("Leather Armor")], [item("Chain Mail")]),
        oneOf(lightCrossbow, [pick("Simple Weapon")]),
        oneOf([item("Priest's Pack")], [item("Explorer's Pack")]),
        item("Shield"),
        pick("Holy Symbol"),
    ],
    druid: [
        oneOf([item("Shield")], [pick("Simple Weapon")]),
        oneOf([item("Scimitar")], [pick("Simple Melee Weapon")]),
        item("Leather Armor"),
        item("Explorer's Pack"),
        pick("Druidic Focus"),
    ],
    fighter: [
        oneOf([item("Chain Mail")], [item("Leather Armor"), item("Longbow"), item("Arrows (20)")]),
        oneOf([pick("Martial Weapon"), item("Shield")], [pick("Martial Weapon"), pick("Martial Weapon")]),
        oneOf(lightCrossbow, [item("Handaxe", 2)]),
        oneOf([item("Dungeoneer's Pack")], [item("Explorer's Pack")]),
    ],
    monk: [
        oneOf([item("Shortsword")], [pick("Simple Weapon")]),
        oneOf([item("Dungeoneer's Pack")], [item("Explorer's Pack")]),
        item("Dart", 10),
    ],
    paladin: [
        oneOf([pick("Martial Weapon"), item("Shield")], [pick("Martial Weapon"), pick("Martial Weapon")]),
        oneOf([item("Javelin", 5)], [pick("Simple Melee Weapon")]),
        oneOf([item("Priest's Pack")], [item("Explorer's Pack")]),
        item("Chain Mail"),
        pick("Holy Symbol"),
    ],
    ranger: [
        oneOf([item("Scale Mail")], [item("Leather Armor")]),
        oneOf([item("Shortsword", 2)], [pick("Simple Melee Weapon"), pick("Simple Melee Weapon")]),
        oneOf([item("Dungeoneer's Pack")], [item("Explorer's Pack")]),
        item("Longbow"),
        item("Quiver"),
        item("Arrows (20)"),
    ],
    rogue: [
        oneOf([item("Rapier")], [item("Shortsword")]),
        oneOf([item("Shortbow"), item("Quiver"), item("Arrows (20)")], [item("Shortsword")]),
        oneOf([item("Burglar's Pack")], [item("Dungeoneer's Pack")], [item("Explorer's Pack")]),
        item("Leather Armor"),
        item("Dagger", 2),
        item("Thieves' Tools"),
    ],
    sorcerer: [
        oneOf(lightCrossbow, [pick("Simple Weapon")]),
        oneOf([item("Component Pouch")], [pick("Arcane Focus")]),
        oneOf([item("Dungeoneer's Pack")], [item("Explorer's Pack")]),
        item("Dagger", 2),
    ],
    warlock: [
        oneOf(lightCrossbow, [pick("Simple Weapon")]),
        oneOf([item("Component Pouch")], [pick("Arcane Focus")]),
        oneOf([item("Scholar's Pack")], [item("Dungeoneer's Pack")]),
        item("Leather Armor"),
        pick("Simple Weapon"),
        item("Dagger", 2),
    ],
    wizard: [
        oneOf([item("Quarterstaff")], [item("Dagger")]),
        oneOf([item("Component Pouch")], [pick("Arcane Focus")]),
        oneOf([item("Scholar's Pack")], [item("Explorer's Pack")]),
        item("Spellbook"),
    ],
};

/** PHB "Starting Wealth by Class": dice of d4, times the multiplier in gp. */
const STARTING_WEALTH_2014: Record<string, { dice: number; multiplier: number }> = {
    artificer: { dice: 5, multiplier: 10 },
    barbarian: { dice: 2, multiplier: 10 },
    bard: { dice: 5, multiplier: 10 },
    cleric: { dice: 5, multiplier: 10 },
    druid: { dice: 2, multiplier: 10 },
    fighter: { dice: 5, multiplier: 10 },
    monk: { dice: 5, multiplier: 1 },
    paladin: { dice: 5, multiplier: 10 },
    ranger: { dice: 5, multiplier: 10 },
    rogue: { dice: 4, multiplier: 10 },
    sorcerer: { dice: 3, multiplier: 10 },
    warlock: { dice: 4, multiplier: 10 },
    wizard: { dice: 4, multiplier: 10 },
};

export const CLASS_KITS_2014: Record<string, KitOption[]> = Object.fromEntries(
    Object.entries(CLASS_KIT_LINES_2014).map(([id, lines]) => [
        id,
        [
            { id: "kit", lines, gp: 0 },
            { id: "wealth", lines: [], gp: 0, wealth: STARTING_WEALTH_2014[id] },
        ],
    ]),
);

/* ------------------------------------------------------------------ */
/* Backgrounds                                                         */
/* ------------------------------------------------------------------ */

/** Every 2024 background offers its kit (A) or 50 GP (B). */
const background2024 = (lines: KitLine[], gp: number): KitOption[] => [{ id: "A", lines, gp }, gold(50)];

/** Keyed by lowercased background name, which is what the Archive and the PHB share. */
export const BACKGROUND_KITS_2024: Record<string, KitOption[]> = {
    acolyte: background2024(
        [item("Calligrapher's Supplies"), item("Book (prayers)"), pick("Holy Symbol"), item("Parchment", 10), item("Robe")],
        8,
    ),
    artisan: background2024([pick("Artisan's Tools"), item("Pouch", 2), item("Clothes, Traveler's")], 32),
    charlatan: background2024([item("Forgery Kit"), item("Clothes, Costume"), item("Clothes, Fine")], 15),
    criminal: background2024(
        [item("Dagger", 2), item("Thieves' Tools"), item("Crowbar"), item("Pouch", 2), item("Clothes, Traveler's")],
        16,
    ),
    entertainer: background2024(
        [item("Clothes, Costume", 2), item("Mirror"), item("Perfume"), item("Clothes, Traveler's"), pick("Musical Instrument")],
        11,
    ),
    farmer: background2024(
        [item("Sickle"), item("Carpenter's Tools"), item("Healer's Kit"), item("Pot, Iron"), item("Shovel"), item("Clothes, Traveler's")],
        30,
    ),
    guard: background2024(
        [
            item("Spear"), item("Light Crossbow"), item("Bolts (20)"), pick("Gaming Set"), item("Lantern, Hooded"),
            item("Manacles"), item("Quiver"), item("Clothes, Traveler's"),
        ],
        12,
    ),
    guide: background2024(
        [
            item("Shortbow"), item("Arrows (20)"), item("Cartographer's Tools"), item("Bedroll"), item("Quiver"),
            item("Tent"), item("Clothes, Traveler's"),
        ],
        3,
    ),
    hermit: background2024(
        [
            item("Quarterstaff"), item("Herbalism Kit"), item("Bedroll"), item("Book (philosophy)"), item("Lamp"),
            item("Oil", 3), item("Clothes, Traveler's"),
        ],
        16,
    ),
    merchant: background2024([item("Navigator's Tools"), item("Pouch", 2), item("Clothes, Traveler's")], 22),
    noble: background2024([pick("Gaming Set"), item("Clothes, Fine"), item("Perfume")], 29),
    sage: background2024(
        [item("Quarterstaff"), item("Calligrapher's Supplies"), item("Book (history)"), item("Parchment", 8), item("Robe")],
        8,
    ),
    sailor: background2024([item("Dagger"), item("Navigator's Tools"), item("Rope, Hempen (50 feet)"), item("Clothes, Traveler's")], 20),
    scribe: background2024(
        [item("Calligrapher's Supplies"), item("Clothes, Fine"), item("Lamp"), item("Oil", 3), item("Parchment", 12)],
        23,
    ),
    soldier: background2024(
        [
            item("Spear"), item("Shortbow"), item("Arrows (20)"), pick("Gaming Set"), item("Healer's Kit"),
            item("Quiver"), item("Clothes, Traveler's"),
        ],
        14,
    ),
    wayfarer: background2024(
        [item("Dagger", 2), item("Thieves' Tools"), pick("Gaming Set"), item("Bedroll"), item("Pouch", 2), item("Clothes, Traveler's")],
        16,
    ),
};

/** 2014 backgrounds have one kit, its gold in a belt pouch. */
const background2014 = (lines: KitLine[], gp: number): KitOption[] => [{ id: "kit", lines, gp }];

export const BACKGROUND_KITS_2014: Record<string, KitOption[]> = {
    acolyte: background2014(
        [
            pick("Holy Symbol"), oneOf([item("Prayer Book")], [item("Prayer Wheel")]), item("Stick of Incense", 5),
            item("Vestments"), item("Clothes, Common"), item("Pouch"),
        ],
        15,
    ),
    charlatan: background2014(
        [
            item("Clothes, Fine"), item("Disguise Kit"),
            oneOf(
                [item("Stoppered Bottle of Colored Liquid", 10)],
                [item("Weighted Dice")],
                [item("Deck of Marked Cards")],
                [item("Signet Ring of an Imaginary Duke")],
            ),
            item("Pouch"),
        ],
        15,
    ),
    criminal: background2014([item("Crowbar"), item("Clothes, Common (dark, with hood)"), item("Pouch")], 15),
    entertainer: background2014(
        [pick("Musical Instrument"), item("Favor of an Admirer"), item("Clothes, Costume"), item("Pouch")],
        15,
    ),
    "folk hero": background2014(
        [pick("Artisan's Tools"), item("Shovel"), item("Pot, Iron"), item("Clothes, Common"), item("Pouch")],
        10,
    ),
    "guild artisan": background2014(
        [pick("Artisan's Tools"), item("Letter of Introduction from Your Guild"), item("Clothes, Traveler's"), item("Pouch")],
        15,
    ),
    hermit: background2014(
        [item("Scroll Case of Notes"), item("Winter Blanket"), item("Clothes, Common"), item("Herbalism Kit")],
        5,
    ),
    noble: background2014([item("Clothes, Fine"), item("Signet Ring"), item("Scroll of Pedigree"), item("Purse")], 25),
    outlander: background2014(
        [item("Quarterstaff"), item("Hunting Trap"), item("Trophy from an Animal You Killed"), item("Clothes, Traveler's"), item("Pouch")],
        10,
    ),
    sage: background2014(
        [
            item("Ink"), item("Quill"), item("Small Knife"), item("Letter from a Dead Colleague"),
            item("Clothes, Common"), item("Pouch"),
        ],
        10,
    ),
    sailor: background2014(
        [item("Club"), item("Rope, Silk (50 feet)"), item("Lucky Charm"), item("Clothes, Common"), item("Pouch")],
        10,
    ),
    soldier: background2014(
        [
            item("Insignia of Rank"), item("Trophy from a Fallen Enemy"), oneOf([item("Dice Set")], [item("Playing Card Set")]),
            item("Clothes, Common"), item("Pouch"),
        ],
        10,
    ),
    urchin: background2014(
        [
            item("Small Knife"), item("Map of the City You Grew Up In"), item("Pet Mouse"),
            item("Token to Remember Your Parents By"), item("Clothes, Common"), item("Pouch"),
        ],
        10,
    ),
};

/* ------------------------------------------------------------------ */
/* Lifestyle                                                           */
/* ------------------------------------------------------------------ */

export interface Lifestyle {
    name: string;
    /** Cost per day, in copper. */
    costPerDay: number;
    description: string;
}

/** The same seven tiers and prices in both rulesets. */
export const LIFESTYLES: Lifestyle[] = [
    { name: "Wretched", costPerDay: 0, description: "Living on the streets, in the rain, at the mercy of everyone." },
    { name: "Squalid", costPerDay: 10, description: "A leaky stable or a mud-floored hut; disease and danger are close." },
    { name: "Poor", costPerDay: 20, description: "Simple food and lodging in a flophouse or a common room." },
    { name: "Modest", costPerDay: 100, description: "An inn room or a modest flat; not hungry, not wanting." },
    { name: "Comfortable", costPerDay: 200, description: "A small cottage or a private room at a fine inn." },
    { name: "Wealthy", costPerDay: 400, description: "A suite at the best inn or a townhouse with servants." },
    { name: "Aristocratic", costPerDay: 1000, description: "A mansion, fine food, and the society of the powerful. 10 GP a day at least." },
];
