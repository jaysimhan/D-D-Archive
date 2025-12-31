import { useState, useMemo } from "react";
import { Item } from "../../types/dnd-types";
import { useItems } from "../../hooks/useSanityData";
import { SearchBar } from "../SearchBar";
import { SearchFilters } from "../../types/dnd-types";
import { searchItems } from "../../utils/search-utils";
import { ItemCard } from "../ItemCard";
import { Info } from "lucide-react";

interface MagicItemStepProps {
    magicItem: Item[]; // Current selection (array for consistency with other steps, but usually 1)
    onMagicItemChange: (items: Item[]) => void;
    level: number;
}

export function MagicItemStep({ magicItem, onMagicItemChange, level }: MagicItemStepProps) {
    const { data: allItems, loading } = useItems();
    const [filters, setFilters] = useState<SearchFilters>({
        query: "",
        itemCategory: "Magic Items",
    });

    // Filter for Magic Items only
    const magicItems = useMemo(() => {
        if (!allItems) return [];
        return allItems.filter(item =>
            ["Potion", "Scroll", "Wondrous Item", "Ring", "Rod", "Staff", "Wand"].includes(item.type)
        );
    }, [allItems]);

    // Apply search filters
    const filteredItems = useMemo(() => {
        return searchItems(magicItems, filters);
    }, [magicItems, filters]);

    const handleToggle = (item: Item) => {
        // Single selection for Magic Item (usually) - or allow multiple?
        // User request: "where a character can search and add one magic item"
        // So we enforce single selection.

        const isSelected = magicItem.some((i) => i.id === item.id);

        if (isSelected) {
            onMagicItemChange([]);
        } else {
            onMagicItemChange([item]);
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
                    <h2 className="text-3xl font-bold text-white font-serif">Choose a Magic Item</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        As a level {level} adventurer, you have acquired a magical item on your journeys.
                        Select one item to better aid you in your upcoming quests.
                    </p>
                </div>

                {/* Info Box */}
                <div className="bg-brand-900/20 border border-brand-500/30 rounded-lg p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                        <p className="text-brand-100 font-medium">Starting Magic Item</p>
                        <p className="text-sm text-brand-200/70">
                            For this campaign, higher-level characters start with one magic item of their choice.
                            Choose wisely, as this item will be a key part of your arsenal.
                        </p>
                    </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-6 space-y-6">
                    <SearchBar
                        filters={filters}
                        onFiltersChange={setFilters}
                        showMagicItemFilters={true}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[400px]">
                        {filteredItems.map((item) => {
                            const isSelected = magicItem.some((i) => i.id === item.id);
                            return (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    isSelected={isSelected}
                                    onClick={() => handleToggle(item)}
                                />
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
