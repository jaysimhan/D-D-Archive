import type { Item } from "../types/dnd-types";

type Cost = NonNullable<Item["cost"]>;

const GP_PER: Record<Cost["currency"], number> = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 };

/** A price in gold pieces, so items priced in different coins can be compared. */
export function goldValue(cost?: Item["cost"]): number | undefined {
  if (!cost || typeof cost.amount !== "number") return undefined;
  return cost.amount * (GP_PER[cost.currency] ?? 1);
}

/** "15 gp", "5 sp", "1,500 gp". Undefined when the item has no listed price. */
export function formatCost(cost?: Item["cost"]): string | undefined {
  if (!cost || typeof cost.amount !== "number") return undefined;
  return `${cost.amount.toLocaleString("en-US")} ${cost.currency || "gp"}`;
}

/** The price restated in gold when it is quoted in another coin: "5 sp" → "0.5 gp". */
export function goldEquivalent(cost?: Item["cost"]): string | undefined {
  const gp = goldValue(cost);
  if (gp === undefined || !cost || cost.currency === "gp") return undefined;
  return `${Number(gp.toFixed(2)).toLocaleString("en-US")} gp`;
}
