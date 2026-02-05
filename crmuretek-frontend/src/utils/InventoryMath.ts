import type { Inventory } from "../types/Inventory";

/**
 * Calculates how much total polyurethane mix can be made
 * based on the current ISO and Resin stock levels.
 */
export const calculatePossibleMix = (inventory: Inventory | null): number => {
  if (!inventory) return 0;

  // URETEK standard ratios: 63% ISO / 37% Resin
  const maxMixFromIso = inventory.iso_stock ? inventory.iso_stock / 0.63 : 0;
  const maxMixFromResina = inventory.resina_stock
    ? inventory.resina_stock / 0.37
    : 0;

  // The total is limited by whichever material runs out first
  return Math.min(maxMixFromIso, maxMixFromResina);
};
