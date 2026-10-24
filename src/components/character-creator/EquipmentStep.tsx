import { useEffect, useMemo, useState } from "react";
import { Coins, Dices, Minus, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import type { Background, CharacterRuleset, Class, Race } from "../../types/dnd-types";
import type { CharacterData, EquipmentItem, StartingEquipmentChoices } from "../../types/character-creator";
import { useItems } from "../../hooks/useSanityData";
import { LIFESTYLES, type KitLine, type KitOption } from "../../data/starting-equipment";
import {
    buildEquipment,
    equipmentCatalogue,
    formatCopper,
    pickOptions,
    pickValue,
    summarizeStartingEquipment,
    toCoins,
    type CatalogueItem,
    type ShopGroup,
} from "../../utils/starting-equipment";
import { weaponProficiency } from "../../utils/weapon-proficiency";
import { WeaponTags } from "./WeaponTags";

type EquipmentPatch = Pick<CharacterData, "equipment" | "startingEquipment" | "currency" | "lifestyle">;

const SHOP_GROUPS: ("All" | ShopGroup)[] = ["All", "Weapons", "Armor", "Gear", "Tools", "Mounts & Vehicles"];

/** What a kit line reads as, for an option's summary: "8 Javelins", "any martial weapon". */
function lineText(line: KitLine): string {
    if ("item" in line) return line.quantity ? `${line.quantity} × ${line.item}` : line.item;
    if ("pick" in line) return `${line.quantity ? `${line.quantity} × ` : ""}any ${line.pick.toLowerCase()}`;
    return line.oneOf.map((alternative) => alternative.map(lineText).join(" + ")).join(" or ");
}

function optionTitle(option: KitOption, kind: "class" | "background", ruleset: CharacterRuleset): string {
    if (option.wealth) return "Starting wealth";
    if (ruleset === "2014") return kind === "class" ? "Class equipment" : "Background equipment";
    return option.lines.length ? `Option ${option.id}` : `Option ${option.id}: gold only`;
}

function optionSummary(option: KitOption): string {
    if (option.wealth) {
        const { dice, multiplier } = option.wealth;
        return `Roll ${dice}d4${multiplier > 1 ? ` × ${multiplier}` : ""} GP and buy your own gear`;
    }
    const gold = option.gp ? `${option.gp} GP` : "";
    return [option.lines.map(lineText).join(", "), gold].filter(Boolean).join(", ");
}

/** Equipment as compared between renders: one line per item, with its count. */
const signature = (items: EquipmentItem[]) =>
    items.map((item) => `${item.id}|${item.name}|${item.type}|${item.quantity ?? 1}`).join("\n");

// Equipment Step
export function EquipmentStep({
    equipment,
    ruleset,
    classData,
    race,
    background,
    armorProficiencies = [],
    toolProficiencies = [],
    weaponProficiencies,
    choices: storedChoices,
    currency,
    lifestyle,
    onChange,
}: {
    equipment: EquipmentItem[];
    ruleset: CharacterRuleset;
    classData?: Class;
    race?: Race;
    background?: Background;
    armorProficiencies?: string[];
    toolProficiencies?: string[];
    /** The character's weapon training, to mark which weapons they're proficient with. */
    weaponProficiencies?: string[];
    choices?: StartingEquipmentChoices;
    currency?: CharacterData["currency"];
    lifestyle?: string;
    onChange: (patch: Partial<EquipmentPatch>) => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [group, setGroup] = useState<"All" | ShopGroup>("All");
    const { data: allItems } = useItems(ruleset);
    const catalogue = equipmentCatalogue(ruleset);

    // A draft from before the shop kept its gear as a plain list; that gear
    // is carried over as bought, at list price.
    const choices = useMemo<StartingEquipmentChoices>(() => {
        if (storedChoices) return storedChoices;
        const purchases = equipment.map((item) => ({
            name: item.name,
            quantity: item.quantity ?? 1,
            unitCost: catalogue.get(item.name.toLowerCase())?.cost ?? 0,
        }));
        return purchases.length ? { purchases } : {};
    }, [storedChoices, equipment, catalogue]);

    const summary = summarizeStartingEquipment({
        ruleset,
        classId: classData?.id,
        background,
        choices,
        tools: toolProficiencies,
    });
    const purchases = choices.purchases ?? [];
    const picks = choices.picks ?? {};

    const update = (next: Partial<StartingEquipmentChoices>) => onChange({ startingEquipment: { ...choices, ...next } });
    const setPick = (key: string, value: string) => update({ picks: { ...picks, [key]: value } });

    // The pack and the purse follow from the choices; written back whenever
    // they change, including when the Archive's item documents arrive.
    const derivedEquipment = useMemo(
        () =>
            buildEquipment(
                [...summary.kitItems, ...purchases.map(({ name, quantity }) => ({ name, quantity }))],
                ruleset,
                allItems ?? [],
            ),
        [summary.kitItems, purchases, ruleset, allItems],
    );
    const derivedCurrency = toCoins(summary.remaining);
    const derivedSignature = signature(derivedEquipment);
    // Keyed on the content rather than the arrays, which are new every render.
    useEffect(() => {
        const sameEquipment = derivedSignature === signature(equipment);
        const sameCurrency =
            currency?.gp === derivedCurrency.gp &&
            currency?.sp === derivedCurrency.sp &&
            currency?.cp === derivedCurrency.cp;
        if (sameEquipment && sameCurrency && storedChoices) return;
        onChange({ equipment: derivedEquipment, currency: derivedCurrency, startingEquipment: choices });
    }, [derivedSignature, derivedCurrency.gp, derivedCurrency.sp, derivedCurrency.cp]);

    /* ---------------- Shop ---------------- */

    const shopItems = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return [...catalogue.values()]
            .filter((entry) => group === "All" || entry.group === group)
            .filter((entry) => !term || entry.name.toLowerCase().includes(term))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [catalogue, group, searchTerm]);

    const owned = (name: string) => equipment.find((item) => item.name === name)?.quantity ?? 0;

    const changePurchase = (entry: { name: string; cost: number }, delta: number) => {
        const existing = purchases.find((purchase) => purchase.name === entry.name);
        const quantity = (existing?.quantity ?? 0) + delta;
        const rest = purchases.filter((purchase) => purchase.name !== entry.name);
        update({
            purchases:
                quantity > 0
                    ? [...rest, { name: entry.name, quantity, unitCost: existing?.unitCost ?? entry.cost }]
                    : rest,
        });
    };

    const inheritedArmor = useMemo(
        () =>
            [
                ...armorProficiencies,
                ...(race?.proficiencies || [])
                    .filter((rule) => rule.type === "armor" && rule.mode === "fixed")
                    .flatMap((rule) => rule.armorOptions || rule.options || []),
            ].map((name) => name.toLowerCase()),
        [armorProficiencies, race],
    );

    const isNotRecommended = (entry: CatalogueItem) => {
        if (!classData || entry.type !== "Armor") return false;
        const archive = allItems?.find((item) => item.name === entry.name);
        const armorKind = archive?.properties?.find((property) => /^(light|medium|heavy) armor$/i.test(property));
        const isProficient = !!armorKind && inheritedArmor.includes(armorKind.toLowerCase());
        return ["monk", "wizard", "sorcerer"].includes(classData.id) && !isProficient;
    };

    /* ---------------- Kits ---------------- */

    const rollWealth = (option: KitOption) => {
        if (!option.wealth) return;
        let total = 0;
        for (let die = 0; die < option.wealth.dice; die++) total += 1 + Math.floor(Math.random() * 4);
        update({ wealth: total * option.wealth.multiplier });
    };

    const renderLines = (lines: KitLine[], path: string) => (
        <ul className="space-y-2">
            {lines.map((line, index) => {
                const key = `${path}/${index}`;
                if ("item" in line) {
                    return (
                        <li key={key} className="text-sm text-gray-200">
                            {line.quantity ? `${line.quantity} × ` : ""}
                            {line.item}
                        </li>
                    );
                }
                if ("pick" in line) {
                    const value = pickValue(line.pick, key, picks, ruleset, toolProficiencies);
                    return (
                        <li key={key} className="flex flex-wrap items-center gap-2 text-sm text-gray-200">
                            {line.quantity ? `${line.quantity} ×` : ""}
                            <select
                                value={value}
                                onChange={(e) => setPick(key, e.target.value)}
                                className={`rounded-md border bg-zinc-900 px-2 py-1 text-sm text-white ${
                                    value ? "border-zinc-700" : "border-amber-500/70"
                                }`}
                            >
                                <option value="" disabled>
                                    Choose any {line.pick.toLowerCase()}…
                                </option>
                                {pickOptions(line.pick, ruleset).map((name) => (
                                    <option key={name} value={name}>
                                        {name}
                                        {weaponProficiencies &&
                                        weaponProficiency({ name, type: "Weapon" }, weaponProficiencies) === "not-proficient"
                                            ? " (not proficient)"
                                            : ""}
                                    </option>
                                ))}
                            </select>
                        </li>
                    );
                }
                const chosen = Number(picks[key] ?? 0);
                return (
                    <li key={key} className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {line.oneOf.map((alternative, alternativeIndex) => (
                                <button
                                    key={alternativeIndex}
                                    type="button"
                                    aria-pressed={chosen === alternativeIndex}
                                    onClick={() => setPick(key, String(alternativeIndex))}
                                    className={`rounded-md border px-2.5 py-1 text-left text-xs font-medium transition-colors ${
                                        chosen === alternativeIndex
                                            ? "border-brand-500 bg-brand-900/30 text-white"
                                            : "border-zinc-700 bg-zinc-800 text-gray-400 hover:border-zinc-500"
                                    }`}
                                >
                                    {alternative.map(lineText).join(" + ")}
                                </button>
                            ))}
                        </div>
                        {line.oneOf[chosen]?.some((inner) => !("item" in inner)) && (
                            <div className="border-l-2 border-zinc-800 pl-3">
                                {renderLines(line.oneOf[chosen], `${key}.${chosen}`)}
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    const renderKit = (
        kind: "class" | "background",
        title: string,
        options: KitOption[],
        selected: KitOption | undefined,
        pathPrefix: string,
        forgone = false,
    ) => (
        <section className={`rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 ${forgone ? "opacity-50" : ""}`}>
            <h3 className="mb-3 font-serif text-lg font-semibold text-white">{title}</h3>
            {forgone ? (
                <p className="text-sm text-gray-400">
                    Taking starting wealth gives up the background&apos;s equipment and gold too.
                </p>
            ) : (
                <>
                    {options.length > 1 && (
                        <div className="mb-4 grid gap-2 sm:grid-cols-2">
                            {options.map((option) => {
                                const isSelected = option.id === selected?.id;
                                return (
                                    <button
                                        key={option.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            update(kind === "class" ? { classOption: option.id } : { backgroundOption: option.id })
                                        }
                                        className={`rounded-lg border p-3 text-left transition-all ${
                                            isSelected
                                                ? "border-brand-500 bg-brand-900/30"
                                                : "border-zinc-800 bg-zinc-900/60 hover:border-brand-500/50"
                                        }`}
                                    >
                                        <span className={`block text-sm font-semibold ${isSelected ? "text-brand-400" : "text-gray-200"}`}>
                                            {optionTitle(option, kind, ruleset)}
                                        </span>
                                        <span className="mt-1 block text-xs leading-relaxed text-gray-400">
                                            {optionSummary(option)}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    {selected?.wealth ? (
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => rollWealth(selected)}
                                className="inline-flex items-center gap-2 rounded-lg border border-brand-500/60 bg-brand-900/30 px-3 py-2 text-sm font-medium text-white hover:bg-brand-900/50"
                            >
                                <Dices className="h-4 w-4" />
                                Roll {selected.wealth.dice}d4{selected.wealth.multiplier > 1 ? ` × ${selected.wealth.multiplier}` : ""}
                            </button>
                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                <input
                                    type="number"
                                    min={0}
                                    value={choices.wealth ?? ""}
                                    onChange={(e) => update({ wealth: Math.max(0, Number(e.target.value) || 0) })}
                                    placeholder="0"
                                    className="w-24 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-white"
                                />
                                GP
                            </label>
                        </div>
                    ) : selected ? (
                        <>
                            {selected.lines.length > 0 && renderLines(selected.lines, `${pathPrefix}:${selected.id}`)}
                            {selected.gp > 0 && (
                                <p className="mt-2 text-sm font-medium text-amber-300">+ {selected.gp} GP</p>
                            )}
                        </>
                    ) : null}
                </>
            )}
        </section>
    );

    const selectedLifestyle = LIFESTYLES.find((tier) => tier.name === lifestyle);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="text-center">
                <h2 className="text-white text-3xl font-bold mb-2 font-serif">Starting Equipment</h2>
                <p className="text-gray-400">Take your kits, spend your gold, and choose how you live</p>
            </div>

            {/* Purse */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-center">
                {[
                    ["Starting gold", summary.budget],
                    ["Spent", summary.spent],
                    ["Remaining", summary.remaining],
                ].map(([label, amount]) => (
                    <div key={label as string}>
                        <p className="text-xs uppercase tracking-wider text-gray-400">{label}</p>
                        <p
                            className={`font-semibold ${
                                label === "Remaining" && (amount as number) < 0 ? "text-red-400" : "text-amber-300"
                            }`}
                        >
                            {formatCopper(amount as number)}
                        </p>
                    </div>
                ))}
            </div>
            {summary.openPicks > 0 && (
                <p className="text-center text-sm text-amber-400">
                    {summary.openPicks} kit {summary.openPicks === 1 ? "choice" : "choices"} still to make below.
                </p>
            )}

            {/* Kits */}
            {!classData ? (
                <p className="text-sm text-gray-400">Choose a class to see its starting kit.</p>
            ) : summary.classOptions.length ? (
                renderKit("class", `Class kit · ${classData.name}`, summary.classOptions, summary.classOption, `class:${classData.id}`)
            ) : (
                <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                    <h3 className="mb-2 font-serif text-lg font-semibold text-white">Class kit · {classData.name}</h3>
                    <p className="mb-3 text-sm text-gray-400">
                        The rules list no starting kit for this class. Enter the gold your DM agrees on and buy your gear below.
                    </p>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                        <Coins className="h-4 w-4 text-amber-300" />
                        <input
                            type="number"
                            min={0}
                            value={choices.wealth ?? ""}
                            onChange={(e) => update({ wealth: Math.max(0, Number(e.target.value) || 0) })}
                            placeholder="0"
                            className="w-24 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-white"
                        />
                        GP
                    </label>
                </section>
            )}

            {background &&
                (summary.backgroundOptions.length ? (
                    renderKit(
                        "background",
                        `Background kit · ${background.name}`,
                        summary.backgroundOptions,
                        summary.backgroundOption,
                        `background:${background.name.toLowerCase()}`,
                        summary.backgroundForgone,
                    )
                ) : (
                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                        <h3 className="mb-1 font-serif text-lg font-semibold text-white">Background kit · {background.name}</h3>
                        <p className="text-sm text-gray-400">This background lists no equipment.</p>
                    </section>
                ))}

            {/* Lifestyle */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <h3 className="mb-1 font-serif text-lg font-semibold text-white">Lifestyle</h3>
                <p className="mb-3 text-sm text-gray-400">What you spend each day between adventures.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {LIFESTYLES.map((tier) => {
                        const isSelected = tier.name === lifestyle;
                        return (
                            <button
                                key={tier.name}
                                type="button"
                                aria-pressed={isSelected}
                                // Clicking the chosen lifestyle again clears it.
                                onClick={() => onChange({ lifestyle: isSelected ? undefined : tier.name })}
                                className={`rounded-lg border p-2 text-left transition-colors ${
                                    isSelected
                                        ? "border-brand-500 bg-brand-900/30"
                                        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-600"
                                }`}
                            >
                                <span className={`block text-sm font-semibold ${isSelected ? "text-brand-400" : "text-gray-200"}`}>
                                    {tier.name}
                                </span>
                                <span className="block text-xs text-amber-300/80">
                                    {tier.costPerDay ? `${formatCopper(tier.costPerDay)} / day` : "Free"}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {selectedLifestyle && <p className="mt-3 text-sm text-gray-400">{selectedLifestyle.description}</p>}
            </section>

            {/* Shop */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2 font-serif text-lg font-semibold text-white">
                        <ShoppingBag className="h-5 w-5 text-brand-400" />
                        Shop
                    </h3>
                    <span className="text-sm text-amber-300">{formatCopper(summary.remaining)} to spend</span>
                </div>

                {purchases.length > 0 && (
                    <ul className="mb-4 divide-y divide-zinc-800 rounded-lg border border-zinc-800">
                        {purchases.map((purchase) => (
                            <li key={purchase.name} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                                <span className="text-gray-200">
                                    {purchase.name}
                                    <span className="ml-2 text-xs text-gray-500">{formatCopper(purchase.unitCost)} each</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        aria-label={`Sell one ${purchase.name}`}
                                        onClick={() => changePurchase({ name: purchase.name, cost: purchase.unitCost }, -1)}
                                        className="rounded p-1 text-gray-400 hover:bg-zinc-800 hover:text-white"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-6 text-center text-white">{purchase.quantity}</span>
                                    <button
                                        type="button"
                                        aria-label={`Buy another ${purchase.name}`}
                                        disabled={purchase.unitCost > summary.remaining}
                                        onClick={() => changePurchase({ name: purchase.name, cost: purchase.unitCost }, 1)}
                                        className="rounded p-1 text-gray-400 hover:bg-zinc-800 hover:text-white disabled:opacity-30"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Return all ${purchase.name}`}
                                        onClick={() =>
                                            changePurchase({ name: purchase.name, cost: purchase.unitCost }, -purchase.quantity)
                                        }
                                        className="rounded p-1 text-gray-500 hover:bg-zinc-800 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mb-3 flex flex-wrap gap-2">
                    {SHOP_GROUPS.map((name) => (
                        <button
                            key={name}
                            type="button"
                            aria-pressed={group === name}
                            onClick={() => setGroup(name)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${
                                group === name
                                    ? "border-brand-500 bg-brand-900/30 text-white"
                                    : "border-zinc-700 text-gray-400 hover:border-zinc-500"
                            }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
                <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search the shop..."
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 py-2 pl-9 pr-3 text-white placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <ul className="grid max-h-[28rem] grid-cols-1 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
                    {shopItems.map((entry) => {
                        const notRecommended = isNotRecommended(entry);
                        const count = owned(entry.name);
                        const affordable = entry.cost <= summary.remaining;
                        return (
                            <li
                                key={entry.name}
                                className={`flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 ${
                                    notRecommended ? "opacity-60" : ""
                                }`}
                            >
                                <div className="min-w-0">
                                    <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-gray-200">
                                        {entry.name}
                                        {notRecommended && (
                                            <span className="rounded border border-zinc-700 bg-zinc-800 px-1 text-[10px] text-gray-500">
                                                Not Rec.
                                            </span>
                                        )}
                                        {count > 0 && (
                                            <span className="rounded bg-brand-900/40 px-1 text-[10px] text-brand-300">
                                                Have {count}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-xs text-amber-300/80">{formatCopper(entry.cost)}</p>
                                    {entry.type === "Weapon" && (
                                        <div className="mt-1.5">
                                            <WeaponTags item={entry} training={weaponProficiencies} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    disabled={!affordable}
                                    onClick={() => changePurchase(entry, 1)}
                                    title={affordable ? undefined : "Not enough gold"}
                                    className="shrink-0 rounded-md border border-zinc-700 px-2.5 py-1 text-xs font-medium text-gray-200 hover:border-brand-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Buy
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>

            {/* Inventory */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                <h3 className="mb-3 font-serif text-lg font-semibold text-white">
                    Your inventory <span className="text-sm font-normal text-gray-500">({equipment.length} items)</span>
                </h3>
                {equipment.length ? (
                    <ul className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                        {equipment.map((item) => (
                            <li key={item.id} className="flex justify-between gap-2 text-gray-300">
                                <span>
                                    {item.name}
                                    {weaponProficiencies && weaponProficiency(item, weaponProficiencies) === "not-proficient" && (
                                        <span className="ml-2 text-xs text-red-300/80">not proficient</span>
                                    )}
                                </span>
                                {(item.quantity ?? 1) > 1 && <span className="text-gray-500">× {item.quantity}</span>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">Nothing yet.</p>
                )}
            </section>
        </div>
    );
}

