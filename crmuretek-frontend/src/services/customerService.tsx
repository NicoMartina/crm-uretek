import api from "./api";

export const customerService = {
  getAll: async () => {
    const response = await api.get("/customers");
    return response.data;
  },
  create: async (data: any) => {
    const res = await api.post("/customers", data);
    return res.data;
  },
  delete: async (id: number) => {
    return await api.delete(`/customers/${id}`);
  },
  update: async (id: number, data: any) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
};
