import axios from "axios";
import api from "./api";

export const leadsService = {
  // Get all customers
  getAll: async () => {
    const response = await api.get("/leads");
    return response.data;
  },

  create: async (data: any) => {
    const res = await api.post("/leads", data);
    return res.data;
  },

  // Delete a customer
  delete: async (id: number) => {
    return await api.delete(`/leads/${id}`);
  },

  // Update a customer (for scheduling visits, etc.)
  update: async (id: number, data: any) => {
    const response = await api.put(`/leads/${id}`, data);
    return response.data;
  },
};
