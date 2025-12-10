import { Item } from "../types/dnd-types";
import { Package, Coins, Weight, Star } from "lucide-react";
import { useState } from "react";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "Official":
        return "bg-blue-100 text-blue-800";
      case "Homebrew":
        return "bg-purple-100 text-purple-800";
      case "Unofficial":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-600";
      case "Uncommon":
        return "text-green-600";
      case "Rare":
        return "text-blue-600";
      case "Very Rare":
        return "text-purple-600";
      case "Legendary":
        return "text-orange-600";
      case "Artifact":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{item.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {item.type}
            </span>
            {item.magical && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Star className={`w-4 h-4 ${getRarityColor(item.rarity)}`} />
                  <span className={getRarityColor(item.rarity)}>{item.rarity}</span>
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getSourceBadgeColor(
              item.source
            )}`}
          >
            {item.source}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
            {item.edition}
          </span>
        </div>
      </div>

      {/* Item Stats */}
      <div className="flex gap-4 mb-3 text-sm text-gray-600">
        {item.cost && (
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-600" />
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
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
            Requires Attunement
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-700 mb-3">
        {expanded
          ? item.description
          : `${item.description.substring(0, 120)}${
              item.description.length > 120 ? "..." : ""
            }`}
      </p>

      {item.description.length > 120 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-800 mb-3"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}

      {/* Properties */}
      {expanded && item.properties && item.properties.length > 0 && (
        <div className="mt-3">
          <p className="text-sm text-gray-900 mb-1">Properties:</p>
          <div className="flex flex-wrap gap-2">
            {item.properties.map((prop, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
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
