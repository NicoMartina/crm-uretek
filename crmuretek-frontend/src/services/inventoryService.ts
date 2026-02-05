import api from "./api"; // Import our central Axios config
import type { Inventory } from "../types/Inventory";

export const inventoryService = {
  // GET current stock
  getInventory: async (): Promise<Inventory> => {
    const response = await api.get("/inventory");
    return response.data;
  },

  // POST add stock
  addStock: async (type: "iso" | "resina", amount: number): Promise<void> => {
    // This matches your Java endpoints: /api/inventory/add-iso or /api/inventory/add-resina
    await api.post(`/inventory/add-${type}`, { amount });
  },
};
