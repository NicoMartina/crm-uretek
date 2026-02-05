// 1. Define the shape of the data (Like a Java Model)
export interface Inventory {
  iso_stock: number;
  resina_stock: number;
  lastUpdated: string;
}

const API_BASE_URL = "http://localhost:8080/api/inventory";

export const inventoryService = {
  // GET current stock
  getInventory: async (): Promise<Inventory> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch inventory");
    return response.json();
  },

  // POST add stock
  addStock: async (type: "iso" | "resina", amount: number): Promise<void> => {
    const endpoint = type === "iso" ? "/add-iso" : "/add-resina";
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) throw new Error("Failed to update stock");
  },
};
