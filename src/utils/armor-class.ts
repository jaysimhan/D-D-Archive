import type { Item } from "../types/dnd-types";

export function calculateArmorClass(equipment: Item[], dexterityModifier: number): number {
  const wornArmor = equipment.find((item) => item.type === "Armor" && !item.name.toLowerCase().includes("shield"));
  let armorClass = 10 + dexterityModifier;

  if (wornArmor?.armorClass?.base != null) {
    const dexterity = wornArmor.armorClass.dexterityModifier === "none"
      ? 0
      : wornArmor.armorClass.dexterityModifier === "max2"
        ? Math.min(2, dexterityModifier)
        : dexterityModifier;
    armorClass = wornArmor.armorClass.base + dexterity + (wornArmor.magicBonus ?? 0);
  }

  const shieldBonus = equipment.some((item) => item.type === "Armor" && item.name.toLowerCase().includes("shield")) ? 2 : 0;
  return armorClass + shieldBonus;
}
