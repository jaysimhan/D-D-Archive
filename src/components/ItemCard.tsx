import { Item } from "../types/dnd-types";
import { Package, Coins, Weight, Star } from "lucide-react";
import { useState } from "react";

interface ItemCardProps {
  item: Item;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ItemCard({ item, isSelected, onClick }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  const displaySource = (item.source === "Tasha's Cauldron of Everything" || item.source === "Tasha's Cauldron of Everythings")
    ? "Unofficial"
    : item.source;

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "Official":
        return "bg-blue-900/50 text-blue-300 border border-blue-700";
      case "Homebrew":
        return "bg-brand-900/50 text-brand-300 border border-brand-700";
      case "Unofficial":
        return "bg-zinc-800 text-gray-400 border border-zinc-700";
      default:
        // Default to Unofficial style for mapped sources like Tasha's if they fall through, or unknown
        return "bg-zinc-800 text-gray-400 border border-zinc-700";
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-400";
      case "Uncommon":
        return "text-green-400";
      case "Rare":
        return "text-blue-400";
      case "Very Rare":
        return "text-purple-400";
      case "Legendary":
        return "text-orange-400";
      case "Artifact":
        return "text-brand-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-5 transition-all ${isSelected
        ? "border-brand-500 bg-brand-900/20 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
        : "border-zinc-800 bg-zinc-900/60 hover:shadow-lg hover:shadow-brand-900/20 hover:border-zinc-600"
        } ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-gray-100 mb-1 font-serif text-[18px] line-clamp-2 pr-2 leading-tight">{item.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 whitespace-nowrap overflow-hidden">
            <span className="flex items-center gap-1 min-w-0 flex-shrink">
              <Package className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.type}</span>
            </span>
            {item.magical && (
              <>
                <span className="flex-shrink-0">•</span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Star className={`w-4 h-4 ${getRarityColor(item.rarity)}`} />
                  <span className={getRarityColor(item.rarity)}>{item.rarity}</span>
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <span
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getSourceBadgeColor(
              displaySource
            )}`}
          >
            {displaySource}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-gray-400 border border-zinc-700 whitespace-nowrap">
            {item.edition}
          </span>
        </div>
      </div>

      {/* Item Stats */}
      <div className="flex gap-4 mb-3 text-sm text-gray-400">
        {item.cost && (
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span>
              {item.cost.amount} {item.cost.currency}
            </span>
          </div>
        )}
        {item.weight !== undefined && (
          <div className="flex items-center gap-1">
            <Weight className="w-4 h-4" />
            <span>{item.weight} lb</span>
          </div>
        )}
        {item.requiresAttunement && (
          <span className="text-xs px-2 py-1 bg-brand-900/50 text-brand-300 rounded-full border border-brand-700">
            Requires Attunement
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">
        {expanded
          ? item.description
          : `${item.description.substring(0, 120)}${item.description.length > 120 ? "..." : ""
          }`}
      </p>

      {item.description.length > 120 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
          className="text-sm text-brand-400 hover:text-brand-300 mb-3"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Properties */}
      {expanded && item.properties && item.properties.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-200 mb-1">Properties:</p>
          <div className="flex flex-wrap gap-2">
            {item.properties.map((prop, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-blue-900/50 text-blue-300 rounded-full border border-blue-700"
              >
                {prop}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
