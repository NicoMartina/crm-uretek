import api from "./api";
import type { Lead } from "../types/Lead";
import type { LeadFormData } from "../types/LeadFormData";
import type { LeadUpdateData } from "../types/LeadUpdateData";

export const leadsService = {
  // Get all customers
  getAll: async () => {
    const response = await api.get<Lead[]>("/leads");
    return response.data;
  },

  create: async (data: LeadFormData) => {
    const res = await api.post<Lead>("/leads", data);
    return res.data;
  },

  // Delete a customer
  delete: async (id: number) => {
    return await api.delete(`/leads/${id}`);
  },

  // Update a customer (for scheduling visits, etc.)
  update: async (id: number, data: LeadUpdateData) => {
    const response = await api.put<Lead>(`/leads/${id}`, data);
    return response.data;
  },
};
