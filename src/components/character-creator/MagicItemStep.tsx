import { useState, useMemo, useEffect } from "react";
import { CharacterRuleset, Item } from "../../types/dnd-types";
import { useItems } from "../../hooks/useSanityData";
import { SearchBar } from "../SearchBar";
import { SearchFilters } from "../../types/dnd-types";
import { searchItems } from "../../utils/search-utils";
import {
    MAX_ATTUNED_ITEMS,
    STARTING_RARITIES,
    fitsBudget,
    highestBonus,
    highestRarity,
    magicItemBudget,
    rarityRank,
} from "../../utils/magic-item-budget";
import { ItemCard } from "../ItemCard";
import { WeaponTags } from "./WeaponTags";
import { Info, Sparkles, X } from "lucide-react";

interface MagicItemStepProps {
    ruleset: CharacterRuleset;
    magicItems: Item[];
    /** Ids of the chosen items the character is attuned to. */
    attunedItemIds: string[];
    onMagicItemsChange: (items: Item[], attunedItemIds: string[]) => void;
    level: number;
    /** The character's weapon training, to mark which magic weapons they're proficient with. */
    weaponProficiencies?: string[];
}

const RARITY_COLORS = ["text-gray-300", "text-green-400", "text-blue-400", "text-purple-400", "text-orange-400"];

/**
 * How full each rarity's slots are. Items are seated rarest first, each in a
 * slot of its own rarity or, failing that, the lowest free slot above it.
 */
function slotsUsed(items: Item[], budget: number[]): number[] {
    const used = budget.map(() => 0);
    const ranks = items.map(rarityRank).filter((rank) => rank < budget.length).sort((a, b) => b - a);
    for (const rank of ranks) {
        const slot = budget.findIndex((count, index) => index >= rank && used[index] < count);
        if (slot !== -1) used[slot]++;
    }
    return used;
}

export function MagicItemStep({ ruleset, magicItems, attunedItemIds, onMagicItemsChange, level, weaponProficiencies }: MagicItemStepProps) {
    const { data: allItems, loading } = useItems(ruleset);
    const [filters, setFilters] = useState<SearchFilters>({
        query: "",
        itemCategory: "Magic Items",
    });

    const budget = magicItemBudget(level);
    const cap = highestRarity(budget);
    const totalSlots = budget.reduce((sum, count) => sum + count, 0);
    const bonusCap = highestBonus(budget);
    const used = slotsUsed(magicItems, budget);
    const attunedCount = attunedItemIds.length;

    // A lower level than when these were chosen leaves fewer slots: drop the
    // latest picks until the rest fit, and any attunement that went with them.
    useEffect(() => {
        if (fitsBudget(magicItems, budget) && attunedItemIds.length <= MAX_ATTUNED_ITEMS) return;
        const kept = [...magicItems];
        while (kept.length > 0 && !fitsBudget(kept, budget)) kept.pop();
        const keptIds = new Set(kept.map((item) => item.id));
        onMagicItemsChange(kept, attunedItemIds.filter((id) => keptIds.has(id)).slice(0, MAX_ATTUNED_ITEMS));
    }, [budget, magicItems, attunedItemIds, onMagicItemsChange]);

    // Magic items the character's level can start with.
    const availableItems = useMemo(() => {
        if (!allItems) return [];
        return allItems.filter(item => {
            const isMagic = item.magical || ["Potion", "Scroll", "Wondrous Item", "Ring", "Rod", "Staff", "Wand"].includes(item.type);
            return isMagic && rarityRank(item) <= cap;
        });
    }, [allItems, cap]);

    // Apply search filters
    const filteredItems = useMemo(() => {
        return searchItems(availableItems, filters);
    }, [availableItems, filters]);

    const handleToggle = (item: Item) => {
        if (magicItems.some((i) => i.id === item.id)) {
            onMagicItemsChange(
                magicItems.filter((i) => i.id !== item.id),
                attunedItemIds.filter((id) => id !== item.id),
            );
            return;
        }
        const next = [...magicItems, item];
        if (!fitsBudget(next, budget)) return;
        // Attune straight away while a slot is free; the player can undo it below.
        const attune = item.requiresAttunement && attunedCount < MAX_ATTUNED_ITEMS;
        onMagicItemsChange(next, attune ? [...attunedItemIds, item.id] : attunedItemIds);
    };

    const toggleAttunement = (item: Item) => {
        if (attunedItemIds.includes(item.id)) {
            onMagicItemsChange(magicItems, attunedItemIds.filter((id) => id !== item.id));
        } else if (attunedCount < MAX_ATTUNED_ITEMS) {
            onMagicItemsChange(magicItems, [...attunedItemIds, item.id]);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 text-brand-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-white font-serif">Choose Magic Items</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        As a level {level} adventurer, you have gathered magical items on your journeys.
                        Choose up to {totalSlots} {totalSlots === 1 ? "item" : "items"} to aid you in your upcoming quests.
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-brand-900/20 border border-brand-500/30 rounded-lg p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                        <p className="text-brand-100 font-medium">Starting Magic Items</p>
                        <p className="text-sm text-brand-200/70">
                            Your share of what a four-player party gathers by level {level}, following the 2024 Dungeon Master's Guide.
                            A slot can also hold an item of a lower rarity
                            {bonusCap > 0 && <>, and weapons and armor go up to +{bonusCap}</>}.
                        </p>
                        <p className="text-sm text-brand-200/70">
                            You can be attuned to no more than {MAX_ATTUNED_ITEMS} items at once. An item that requires attunement
                            gives none of its magic until you attune to it.
                        </p>
                    </div>
                </div>

                {/* Slots left by rarity, and attunement */}
                <div className="flex flex-wrap items-center gap-2">
                    {budget.map((count, rank) => count > 0 && (
                        <span
                            key={rank}
                            className={`px-3 py-1 rounded-full border text-sm ${used[rank] >= count ? "border-zinc-800 text-gray-500" : "border-zinc-700 bg-zinc-900/60"}`}
                        >
                            <span className={used[rank] >= count ? "" : RARITY_COLORS[rank]}>{STARTING_RARITIES[rank]}</span>{" "}
                            <span className="text-gray-400">{used[rank]}/{count}</span>
                        </span>
                    ))}
                    <span
                        className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm ${attunedCount >= MAX_ATTUNED_ITEMS ? "border-brand-500/60 text-brand-300" : "border-zinc-700 text-gray-300"}`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Attuned {attunedCount}/{MAX_ATTUNED_ITEMS}
                    </span>
                </div>

                {/* Chosen items, with attunement */}
                {magicItems.length > 0 && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-2">
                        <p className="text-sm font-medium text-gray-300">Your items ({magicItems.length}/{totalSlots})</p>
                        {magicItems.map((item) => {
                            const attuned = attunedItemIds.includes(item.id);
                            const rank = rarityRank(item);
                            return (
                                <div key={item.id} className="flex items-center gap-3 rounded-lg bg-zinc-900/80 border border-zinc-800 px-3 py-2">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-100 truncate">{item.name}</p>
                                        <p className={`text-xs ${RARITY_COLORS[rank] ?? "text-gray-400"}`}>{item.rarity ?? STARTING_RARITIES[rank]}</p>
                                    </div>
                                    {item.requiresAttunement && (
                                        <button
                                            onClick={() => toggleAttunement(item)}
                                            disabled={!attuned && attunedCount >= MAX_ATTUNED_ITEMS}
                                            title={!attuned && attunedCount >= MAX_ATTUNED_ITEMS ? `Already attuned to ${MAX_ATTUNED_ITEMS} items` : undefined}
                                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${attuned
                                                ? "border-brand-500 bg-brand-900/40 text-brand-200"
                                                : "border-zinc-700 text-gray-400 hover:border-zinc-500"
                                                }`}
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            {attuned ? "Attuned" : "Attune"}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleToggle(item)}
                                        aria-label={`Remove ${item.name}`}
                                        className="p-1 text-gray-500 hover:text-gray-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-6 space-y-6">
                    <SearchBar
                        filters={filters}
                        onFiltersChange={setFilters}
                        filterSet="magic-items"
                        options={{
                            rarities: STARTING_RARITIES.slice(0, cap + 1),
                            bonuses: [1, 2, 3].filter((bonus) => bonus <= bonusCap),
                        }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
                        {filteredItems.map((item) => {
                            const isSelected = magicItems.some((i) => i.id === item.id);
                            const blocked = !isSelected && !fitsBudget([...magicItems, item], budget);
                            return (
                                <div
                                    key={item.id}
                                    className={blocked ? "opacity-40" : undefined}
                                    title={blocked ? `No ${item.rarity ?? "free"} slot left` : undefined}
                                >
                                    <ItemCard
                                        item={item}
                                        isSelected={isSelected}
                                        onClick={blocked ? undefined : () => handleToggle(item)}
                                        footer={<WeaponTags item={item} training={weaponProficiencies} />}
                                    />
                                </div>
                            );
                        })}

                        {filteredItems.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                                <p className="text-lg">No magic items found matching your filters.</p>
                                <button
                                    onClick={() => setFilters({ query: "", itemCategory: "Magic Items" })}
                                    className="mt-2 text-brand-400 hover:underline"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
