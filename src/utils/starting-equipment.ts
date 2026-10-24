import {
    ADVENTURING_GEAR_CATALOGUE,
    ARMOR_PRICES,
    MOUNTS_AND_VEHICLES,
    TOOL_CATALOGUE,
    WEAPON_PRICES,
    type Coin,
} from "../data/srd-equipment-catalogue";
import { WEAPONS } from "../data/srd-equipment";
import {
    BACKGROUND_KITS_2014,
    BACKGROUND_KITS_2024,
    CLASS_KITS_2014,
    CLASS_KITS_2024,
    type KitLine,
    type KitOption,
    type PickKind,
} from "../data/starting-equipment";
import type { Background, CharacterRuleset, Item, ItemType } from "../types/dnd-types";
import type { EquipmentItem, StartingEquipmentChoices } from "../types/character-creator";

/* ------------------------------------------------------------------ */
/* Money                                                               */
/* ------------------------------------------------------------------ */

const COPPER: Record<Coin | "ep", number> = { cp: 1, sp: 10, ep: 50, gp: 100, pp: 1000 };

export function toCopper(amount: number, coin: Coin | "ep"): number {
    return Math.round(amount * COPPER[coin]);
}

/** Copper as the coins a purse would hold: gold, then silver, then copper. */
export function toCoins(copper: number): { gp: number; sp: number; cp: number } {
    const total = Math.max(0, Math.round(copper));
    return { gp: Math.floor(total / 100), sp: Math.floor((total % 100) / 10), cp: total % 10 };
}

/** "12 GP 5 SP", "4 CP", "0 GP". Negative amounts keep their sign. */
export function formatCopper(copper: number): string {
    const { gp, sp, cp } = toCoins(Math.abs(copper));
    const parts = [gp && `${gp.toLocaleString("en-US")} GP`, sp && `${sp} SP`, cp && `${cp} CP`].filter(Boolean);
    return `${copper < 0 ? "−" : ""}${parts.join(" ") || "0 GP"}`;
}

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

export type ShopGroup = "Weapons" | "Armor" | "Gear" | "Tools" | "Mounts & Vehicles";

export interface CatalogueItem {
    name: string;
    /** Price in copper. */
    cost: number;
    type: ItemType;
    group: ShopGroup;
    weight?: number;
    description: string;
    toolKind?: string;
}

const catalogueCache = new Map<CharacterRuleset, Map<string, CatalogueItem>>();

/** Everything a shop sells under a ruleset, keyed by lowercased name. */
export function equipmentCatalogue(ruleset: CharacterRuleset): Map<string, CatalogueItem> {
    const cached = catalogueCache.get(ruleset);
    if (cached) return cached;

    const inRuleset = (edition?: string) => !edition || edition === ruleset;
    const entries: CatalogueItem[] = [
        ...Object.entries(WEAPON_PRICES)
            .filter(([, entry]) => inRuleset(entry.edition))
            .map(([name, entry]) => ({
                name,
                cost: toCopper(...entry.cost),
                type: "Weapon" as const,
                group: "Weapons" as const,
                weight: entry.weight,
                description: "",
            })),
        ...Object.entries(ARMOR_PRICES).map(([name, entry]) => ({
            name,
            cost: toCopper(...entry.cost),
            type: "Armor" as const,
            group: "Armor" as const,
            weight: entry.weight,
            description: entry.don,
        })),
        ...ADVENTURING_GEAR_CATALOGUE.filter((entry) => inRuleset(entry.edition) && entry.cost).map((entry) => ({
            name: entry.name,
            cost: toCopper(...entry.cost!),
            type: "Adventuring Gear" as const,
            group: "Gear" as const,
            weight: entry.weight,
            description: entry.description,
        })),
        ...TOOL_CATALOGUE.filter((entry) => inRuleset(entry.edition) && entry.cost).map((entry) => ({
            name: entry.name,
            cost: toCopper(...entry.cost!),
            type: "Tool" as const,
            group: "Tools" as const,
            weight: entry.weight,
            description: entry.description,
            toolKind: entry.kind,
        })),
        ...MOUNTS_AND_VEHICLES.filter((entry) => inRuleset(entry.edition) && entry.cost).map((entry) => ({
            name: entry.name,
            cost: toCopper(...entry.cost!),
            type: "Mount & Vehicle" as const,
            group: "Mounts & Vehicles" as const,
            weight: entry.weight,
            description: entry.description,
        })),
    ];
    const catalogue = new Map(entries.map((entry) => [entry.name.toLowerCase(), entry]));
    catalogueCache.set(ruleset, catalogue);
    return catalogue;
}

/** The names a "pick" slot offers, in the order the rules list them. */
export function pickOptions(kind: PickKind, ruleset: CharacterRuleset): string[] {
    const catalogue = [...equipmentCatalogue(ruleset).values()];
    const weapons = (category: "Simple" | "Martial", meleeOnly = false) =>
        WEAPONS.filter(
            (weapon) =>
                weapon.category === category &&
                (!meleeOnly || weapon.kind === "Melee") &&
                equipmentCatalogue(ruleset).has(weapon.name.toLowerCase()),
        ).map((weapon) => weapon.name);
    switch (kind) {
        case "Simple Weapon":
            return weapons("Simple");
        case "Simple Melee Weapon":
            return weapons("Simple", true);
        case "Martial Weapon":
            return weapons("Martial");
        case "Martial Melee Weapon":
            return weapons("Martial", true);
        case "Musical Instrument":
        case "Artisan's Tools":
        case "Gaming Set":
            return catalogue.filter((entry) => entry.toolKind === kind).map((entry) => entry.name);
        case "Arcane Focus":
        case "Druidic Focus":
            return catalogue.filter((entry) => entry.name.endsWith(`(${kind})`)).map((entry) => entry.name);
        case "Holy Symbol":
            return catalogue.filter((entry) => entry.name.startsWith("Holy Symbol (")).map((entry) => entry.name);
    }
}

/* ------------------------------------------------------------------ */
/* Kits                                                                */
/* ------------------------------------------------------------------ */

export function classKitOptions(ruleset: CharacterRuleset, classId?: string): KitOption[] {
    if (!classId) return [];
    return (ruleset === "2014" ? CLASS_KITS_2014 : CLASS_KITS_2024)[classId] ?? [];
}

export function backgroundKitOptions(ruleset: CharacterRuleset, background?: Background): KitOption[] {
    if (!background) return [];
    const known = (ruleset === "2014" ? BACKGROUND_KITS_2014 : BACKGROUND_KITS_2024)[background.name.trim().toLowerCase()];
    if (known) return known;
    const parsed = parseBackgroundEquipment(background.equipment ?? [], ruleset);
    // Every 2024 background offers 50 GP in place of its kit, written down or not.
    if (ruleset === "2024" && !parsed.some((option) => option.id === "B")) {
        return [...parsed.filter((option) => option.lines.length), { id: "B", lines: [], gp: 50 }];
    }
    return parsed;
}

/** A kit line with its picks made: what it puts in the pack, and any slot still open. */
export interface ResolvedLine {
    name: string;
    quantity: number;
}

/**
 * The tools a slot can default to: the one the character is already
 * proficient with ("Gaming Set (same as above)" in the 2024 backgrounds).
 */
function defaultPick(kind: PickKind, ruleset: CharacterRuleset, tools: string[]): string | undefined {
    const known = new Set(tools.map((tool) => tool.trim().toLowerCase()));
    return pickOptions(kind, ruleset).find((option) => known.has(option.toLowerCase()));
}

/**
 * Walk a kit's lines with the player's picks, keyed by each line's path
 * ("class:fighter:A/2", "…/2.1/0" inside an alternative). An alternative
 * defaults to the first; a pick defaults to a tool the character knows, and
 * otherwise stays open and adds nothing.
 */
export function resolveKit(
    lines: KitLine[],
    path: string,
    picks: Record<string, string>,
    ruleset: CharacterRuleset,
    tools: string[],
): { items: ResolvedLine[]; open: number } {
    const items: ResolvedLine[] = [];
    let open = 0;
    lines.forEach((line, index) => {
        const key = `${path}/${index}`;
        if ("item" in line) {
            items.push({ name: line.item, quantity: line.quantity ?? 1 });
        } else if ("pick" in line) {
            const chosen = picks[key] ?? defaultPick(line.pick, ruleset, tools);
            if (chosen) items.push({ name: chosen, quantity: line.quantity ?? 1 });
            else open += 1;
        } else {
            const alternative = Number(picks[key] ?? 0);
            const inner = resolveKit(line.oneOf[alternative] ?? line.oneOf[0], `${key}.${alternative}`, picks, ruleset, tools);
            items.push(...inner.items);
            open += inner.open;
        }
    });
    return { items, open };
}

/** The value a pick slot shows: what was chosen, or the tool it defaults to. */
export function pickValue(
    kind: PickKind,
    key: string,
    picks: Record<string, string>,
    ruleset: CharacterRuleset,
    tools: string[],
): string {
    return picks[key] ?? defaultPick(kind, ruleset, tools) ?? "";
}

/* ------------------------------------------------------------------ */
/* Selection → money and inventory                                     */
/* ------------------------------------------------------------------ */

export interface StartingEquipmentSummary {
    classOptions: KitOption[];
    backgroundOptions: KitOption[];
    classOption?: KitOption;
    backgroundOption?: KitOption;
    /** 2014 starting wealth gives up the background's kit as well as the class's. */
    backgroundForgone: boolean;
    /** Gold from the kits and any starting wealth, in copper. */
    budget: number;
    spent: number;
    remaining: number;
    /** What the kits put in the pack, before anything is bought. */
    kitItems: ResolvedLine[];
    /** Pick slots nobody has filled yet. */
    openPicks: number;
}

export function summarizeStartingEquipment({
    ruleset,
    classId,
    background,
    choices,
    tools,
}: {
    ruleset: CharacterRuleset;
    classId?: string;
    background?: Background;
    choices: StartingEquipmentChoices;
    tools: string[];
}): StartingEquipmentSummary {
    const picks = choices.picks ?? {};
    const classOptions = classKitOptions(ruleset, classId);
    const backgroundOptions = backgroundKitOptions(ruleset, background);
    const classOption = classOptions.find((option) => option.id === choices.classOption) ?? classOptions[0];
    const backgroundOption =
        backgroundOptions.find((option) => option.id === choices.backgroundOption) ?? backgroundOptions[0];
    const backgroundForgone = !!classOption?.wealth;

    const fromClass = classOption
        ? resolveKit(classOption.lines, `class:${classId}:${classOption.id}`, picks, ruleset, tools)
        : { items: [], open: 0 };
    const fromBackground =
        backgroundOption && !backgroundForgone
            ? resolveKit(
                  backgroundOption.lines,
                  `background:${background?.name.toLowerCase()}:${backgroundOption.id}`,
                  picks,
                  ruleset,
                  tools,
              )
            : { items: [], open: 0 };

    // A class with no kit in the rules (homebrew) starts with whatever gold
    // the table agrees on; 2014's rolled wealth is kept the same way.
    const wealth = classOption?.wealth || !classOption ? (choices.wealth ?? 0) : 0;
    const budget =
        toCopper((classOption?.gp ?? 0) + wealth, "gp") +
        (backgroundForgone ? 0 : toCopper(backgroundOption?.gp ?? 0, "gp"));
    const spent = (choices.purchases ?? []).reduce((total, purchase) => total + purchase.unitCost * purchase.quantity, 0);

    return {
        classOptions,
        backgroundOptions,
        classOption,
        backgroundOption,
        backgroundForgone,
        budget,
        spent,
        remaining: budget - spent,
        kitItems: [...fromClass.items, ...fromBackground.items],
        openPicks: fromClass.open + fromBackground.open,
    };
}

const slug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * The character's equipment: kit contents and purchases, one entry per item
 * with a quantity. Catalogue entries supply type and price; the Archive's own
 * document, where there is one, supplies properties and armor values the
 * sheet reads.
 */
export function buildEquipment(
    lines: ResolvedLine[],
    ruleset: CharacterRuleset,
    archiveItems: Item[],
): EquipmentItem[] {
    const catalogue = equipmentCatalogue(ruleset);
    const archive = new Map(
        archiveItems.filter((item) => !item.magical).map((item) => [item.name.trim().toLowerCase(), item]),
    );
    const totals = new Map<string, ResolvedLine>();
    for (const line of lines) {
        const key = line.name.toLowerCase();
        const existing = totals.get(key);
        totals.set(key, { name: existing?.name ?? line.name, quantity: (existing?.quantity ?? 0) + line.quantity });
    }

    return [...totals.values()].map(({ name, quantity }) => {
        const key = name.toLowerCase();
        // "Book (prayers)" is a Book: priced and weighed as one.
        const base = key.replace(/\s*\(.*\)$/, "");
        const entry = catalogue.get(key) ?? catalogue.get(base);
        const document = archive.get(key) ?? archive.get(base);
        const cost = entry ? toCoins(entry.cost) : undefined;
        return {
            ...document,
            id: document?.id ?? `kit-${slug(name)}`,
            name,
            type: entry?.type ?? document?.type ?? "Adventuring Gear",
            description: document?.description ?? entry?.description ?? "",
            magical: false,
            requiresAttunement: false,
            cost: document?.cost ?? (cost ? cheapestCoin(cost) : undefined),
            weight: document?.weight ?? entry?.weight,
            source: document?.source ?? "Official",
            edition: document?.edition ?? ruleset,
            version: document?.version ?? 1,
            quantity,
        };
    });
}

/** A price as one coin, the way the rules write it: 5 SP, not 0 GP 5 SP. */
function cheapestCoin({ gp, sp, cp }: { gp: number; sp: number; cp: number }): Item["cost"] {
    if (cp) return { amount: gp * 100 + sp * 10 + cp, currency: "cp" };
    if (sp) return { amount: gp * 10 + sp, currency: "sp" };
    return { amount: gp, currency: "gp" };
}

/* ------------------------------------------------------------------ */
/* Archive prose                                                       */
/* ------------------------------------------------------------------ */

const ALIASES: Record<string, string> = {
    "belt pouch": "Pouch",
    "bottle of black ink": "Ink",
    "bottle of ink": "Ink",
    "crossbow bolts": "Bolts (20)",
    bolts: "Bolts (20)",
    arrows: "Arrows (20)",
    "sling bullets": "Sling Bullets (20)",
    "blowgun needles": "Blowgun Needles (50)",
    rope: "Rope, Hempen (50 feet)",
    "hempen rope": "Rope, Hempen (50 feet)",
    "silk rope": "Rope, Silk (50 feet)",
    "50 feet of silk rope": "Rope, Silk (50 feet)",
    "50 feet of hempen rope": "Rope, Hempen (50 feet)",
    staff: "Quarterstaff",
    costume: "Clothes, Costume",
    rations: "Rations (1 day)",
};

/** Match a kit's prose to a catalogue name: "fine clothes" → "Clothes, Fine". */
function catalogueName(text: string, ruleset: CharacterRuleset): string | undefined {
    const catalogue = equipmentCatalogue(ruleset);
    const plain = text.toLowerCase().replace(/’/g, "'").replace(/\s*\(.*\)$/, "").trim();
    const alias = ALIASES[plain];
    if (alias) return alias;
    const words = plain.split(/\s+/);
    const candidates = [
        plain,
        plain.replace(/es$/, ""),
        plain.replace(/s$/, ""),
        words.length > 1 ? `${words[words.length - 1]}, ${words.slice(0, -1).join(" ")}` : "",
    ];
    for (const candidate of candidates) {
        const entry = candidate && catalogue.get(candidate);
        if (entry) return entry.name;
    }
    return undefined;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** One item of prose — "2 Daggers", "a set of artisan's tools" — as a kit line. */
function parseKitItem(raw: string, ruleset: CharacterRuleset): KitLine | undefined {
    let text = raw.replace(/’/g, "'").trim().replace(/\.$/, "");
    if (!text) return undefined;
    if (/\bor\b/i.test(text) && !/\(.*\bor\b.*\)/.test(text)) {
        const alternatives = text
            .split(/\s+or\s+/i)
            .map((part) => parseKitItem(part, ruleset))
            .filter((line): line is KitLine => !!line);
        if (alternatives.length > 1) return { oneOf: alternatives.map((line) => [line]) };
    }
    text = text.replace(/^(a set of|a|an|one type of|one|the|some)\s+/i, "");
    const count = /^(\d+)\s+(.*)$/.exec(text);
    let quantity = count ? Number(count[1]) : 1;
    if (count) text = count[2];

    if (/artisan's tools/i.test(text)) return { pick: "Artisan's Tools" };
    if (/musical instrument/i.test(text)) return { pick: "Musical Instrument" };
    if (/gaming set/i.test(text)) return { pick: "Gaming Set" };
    if (/holy symbol/i.test(text)) return { pick: "Holy Symbol" };

    const name = catalogueName(text, ruleset);
    if (name) {
        // "20 Arrows" is one bundle of the catalogue's "Arrows (20)".
        const bundle = /\((\d+)\)$/.exec(name);
        if (bundle && quantity % Number(bundle[1]) === 0) quantity /= Number(bundle[1]);
        return quantity > 1 ? { item: name, quantity } : { item: name };
    }
    const label = capitalize(text);
    return quantity > 1 ? { item: label, quantity } : { item: label };
}

/** Gold in a line of prose: "15 gp", "a belt pouch containing 10 gp". */
const GOLD = /(\d+)\s*gp\b/i;

/**
 * Read a background's equipment the way the Archive writes it: the 2024
 * "Choose A or B: (A) …, 8 GP; or (B) 50 GP", or 2014's list of lines.
 */
export function parseBackgroundEquipment(lines: string[], ruleset: CharacterRuleset): KitOption[] {
    const text = lines.join("\n").replace(/’/g, "'");
    const choice = /\(A\)\s*([\s\S]*?);?\s*or\s*\(B\)\s*(\d+)\s*GP/i.exec(text);
    if (choice) {
        const parts = choice[1].split(/,\s*(?![^()]*\))/).map((part) => part.replace(/^and\s+/i, "").trim());
        const gp = parts.map((part) => GOLD.exec(part)).find(Boolean);
        const kit = parts
            .filter((part) => !GOLD.test(part))
            .map((part) => parseKitItem(part, ruleset))
            .filter((line): line is KitLine => !!line);
        return [
            { id: "A", lines: kit, gp: gp ? Number(gp[1]) : 0 },
            { id: "B", lines: [], gp: Number(choice[2]) },
        ];
    }

    // "50 GP (starting wealth option)" is the gold alone.
    if (lines.length === 1 && /^\s*\d+\s*gp\b/i.test(lines[0])) {
        return [{ id: ruleset === "2024" ? "B" : "kit", lines: [], gp: Number(GOLD.exec(lines[0])![1]) }];
    }

    let gp = 0;
    const kit: KitLine[] = [];
    for (const line of lines) {
        const coins = GOLD.exec(line);
        if (coins) {
            gp += Number(coins[1]);
            if (/pouch/i.test(line)) kit.push({ item: "Pouch" });
            continue;
        }
        const parsed = parseKitItem(line, ruleset);
        if (parsed) kit.push(parsed);
    }
    if (!kit.length && !gp) return [];
    return [{ id: ruleset === "2024" ? "A" : "kit", lines: kit, gp }];
}
