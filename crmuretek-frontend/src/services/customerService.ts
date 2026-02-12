import axios from "axios";
import api from "./api";

export const customerService = {
  // Get all customers
  getAll: async () => {
    const response = await api.get("/customers");
    return response.data;
  },

  create: async (data: any) => {
    const res = await axios.post(`/customers`, data);
    return res.data;
  },

  // Delete a customer
  delete: async (id: number) => {
    return await api.delete(`/customers/${id}`);
  },

  // Update a customer (for scheduling visits, etc.)
  update: async (id: number, data: any) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
};
