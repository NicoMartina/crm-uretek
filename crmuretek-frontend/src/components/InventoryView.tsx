import { useEffect, useState } from "react";
import { inventoryService } from "../services/inventoryService";
import type { Inventory } from "../types/Inventory";

export const InventoryView = () => {
  const [data, setData] = useState<Inventory | null>(null);

  useEffect(() => {
    inventoryService.getInventory().then(setData).catch(console.error);
  }, []);

  if (!data) return <div>Cargando inventario...</div>;

  return (
    <div className="inventory-card">
      <h2>Stock de Materiales</h2>
      <p>ISO: {data.iso_stock} kg</p>
      <p>Resina: {data.resina_stock} kg</p>
    </div>
  );
};
