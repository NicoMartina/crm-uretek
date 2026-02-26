import api from "./api";

export const jobService = {
  getAll: async () => {
    const response = await api.get("/jobs");
    return response.data;
  },

  create: async (jobData: any) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  update: async (id: number, jobData: any) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    return await api.delete(`/jobs/${id}`);
  },

  getMaterialTotal: async (): Promise<number> => {
    const response = await api.get("/jobs/stats/material-total");
    return response.data;
  },

  //should be in a separate service but for simplicity we can keep it here. We'll move it later.
  getDashboardSummary: async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },
};
