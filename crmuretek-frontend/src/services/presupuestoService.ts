import api from "./api";
import type { Presupuesto } from "../types/Presupuesto";

export const presupuestoService = {
  getAll: async () => {
    const response = await api.get<Presupuesto[]>("/presupuestos");
    return response.data;
  },

  update: async (id: number, field: string, value: boolean) => {
    const response = await api.patch<Presupuesto>(
      `/presupuestos/${id}/status`,
      { field, value }
    );
    return response.data;
  },
};
