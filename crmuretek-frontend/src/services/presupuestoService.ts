import api from "./api";
import type { Presupuesto } from "../types/Presupuesto";
import type { PresupuestoFormData } from "../types/PresupuestoFormData";

export const presupuestoService = {
  getAll: async () => {
    const response = await api.get<Presupuesto[]>("/presupuestos");
    return response.data;
  },

  updateStatus: async (id: number, field: string, value: boolean) => {
    const response = await api.patch<Presupuesto>(
      `/presupuestos/${id}/status`,
      { field, value }
    );
    return response.data;
  },

  update: async (id: number, data: PresupuestoFormData) => {
    const response = await api.put<Presupuesto>(`/presupuestos/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    return await api.delete(`/presupuestos/${id}`);
  },
  create: async (data: PresupuestoFormData) => {
    const response = await api.post<Presupuesto>("/presupuestos", data);
    return response.data;
  },
};
