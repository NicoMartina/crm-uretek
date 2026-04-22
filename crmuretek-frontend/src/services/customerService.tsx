import api from "./api";
import type { Customer } from "../types/Customer";
import type { CustomerFormData } from "../types/CustomerFormData";

export const customerService = {
  getAll: async () => {
    const response = await api.get<Customer[]>("/customers");
    return response.data;
  },
  create: async (data: CustomerFormData) => {
    const res = await api.post<Customer>("/customers", data);
    return res.data;
  },
  delete: async (id: number) => {
    return await api.delete(`/customers/${id}`);
  },
  update: async (id: number, data: CustomerFormData) => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },
};
