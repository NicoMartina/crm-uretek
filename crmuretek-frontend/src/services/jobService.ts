import api from "./api";

export const jobService = {
  getAll: async () => {
    const response = await api.get("/jobs");
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    return await api.delete(`/jobs/${id}`);
  },
};
