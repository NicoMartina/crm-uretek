import { useEffect, useState } from "react";
import { inventoryService, type Inventory } from "../services/inventoryService";

export const InventoryView = () => {
  const [data, setData] = useState<Inventory | null>(null);

  useEffect(() => {
    inventoryService.getInventory().then(setData).catch(console.error);
  }, []);

  if (!data) return <div>Cargando inventario...</div>;

  return (
    <div className="inventory-card">
      <h2>Stock de Materiales</h2>
      <p>ISO: {data.isoStock} kg</p>
      <p>Resina: {data.resinaStock} kg</p>
    </div>
  );
};
