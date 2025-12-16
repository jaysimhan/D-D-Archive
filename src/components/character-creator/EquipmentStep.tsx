import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Class, Item } from "../../types/dnd-types";
import { ITEMS as mockItems } from "../../data/comprehensive-library";

// Equipment Step
export function EquipmentStep({
    equipment,
    classData,
    onEquipmentChange,
}: {
    equipment: Item[];
    classData?: Class;
    onEquipmentChange: (equipment: Item[]) => void;
}) {
    const [searchTerm, setSearchTerm] = useState("");

    const availableItems = useMemo(() => {
        return mockItems.filter(
            (item) => item.type === "Weapon" || item.type === "Armor" || item.type === "Adventuring Gear"
        );
    }, []);

    const filteredItems = useMemo(() => {
        let items = availableItems.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Class-specific filtering/sorting suggestion
        if (classData) {
            // Monks, Wizards, Sorcerers typically don't wear armor
            if (["monk", "wizard", "sorcerer"].includes(classData.id)) {
                // Move armor to bottom or hide? User said "sort items like that".
                // Let's deprioritize Armor for them.
                items = items.sort((a, b) => {
                    const aIsArmor = a.type === "Armor";
                    const bIsArmor = b.type === "Armor";
                    if (aIsArmor && !bIsArmor) return 1;
                    if (!aIsArmor && bIsArmor) return -1;
                    return 0;
                });
            }

            // Druids don't wear metal armor (simple check for "Plate", "Chain", "Ring" etc in description/name?)
            if (classData.id === "druid") {
                const isMetal = (i: Item) => i.type === "Armor" && (i.name.includes("Chain") || i.name.includes("Plate") || i.name.includes("Splint"));
                items = items.sort((a, b) => {
                    if (isMetal(a) && !isMetal(b)) return 1;
                    if (!isMetal(a) && isMetal(b)) return -1;
                    return 0;
                });
            }
        }

        return items;
    }, [availableItems, searchTerm, classData]);

    const toggleItem = (item: Item) => {
        if (equipment.find((i) => i.id === item.id)) {
            onEquipmentChange(equipment.filter((i) => i.id !== item.id));
        } else {
            onEquipmentChange([...equipment, item]);
        }
    };

    const isNotRecommended = (item: Item) => {
        if (!classData) return false;
        if (["monk", "wizard", "sorcerer"].includes(classData.id) && item.type === "Armor") return true;
        // Add more logic as needed
        return false;
    };

    return (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-gray-900 text-2xl font-bold mb-2">Select Equipment</h2>
                <p className="text-gray-600">Choose your starting gear</p>
                <p className="text-sm text-indigo-700 mt-2 font-medium">Selected: {equipment.length} items</p>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search equipment..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-2">
                {filteredItems.map((item) => {
                    const isSelected = equipment.find((i) => i.id === item.id);
                    const notRecommended = isNotRecommended(item);

                    return (
                        <button
                            key={item.id}
                            onClick={() => toggleItem(item)}
                            className={`text-left p-3 border-2 rounded-lg transition-all ${isSelected
                                ? "border-indigo-600 bg-indigo-50 shadow-md"
                                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                                } ${notRecommended ? "opacity-60 order-last" : ""}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-gray-900 font-semibold flex items-center gap-2">
                                    {item.name}
                                    {notRecommended && <span className="text-[10px] bg-gray-200 text-gray-500 px-1 rounded">Not Rec.</span>}
                                </h4>
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                    {item.type}
                                </span>
                            </div>
                            {item.cost && (
                                <p className="text-xs text-gray-600">
                                    Cost: {item.cost.amount} {item.cost.currency}
                                </p>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
