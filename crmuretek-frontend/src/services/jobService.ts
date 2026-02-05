import api from "./api";

export const jobService = {
  getAll: async () => {
    const response = await api.get("/jobs");
    return response.data;
  },

  // This is the part that was missing!
  create: async (jobData: any) => {
    const response = await api.post("/jobs", jobData);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    return await api.delete(`/jobs/${id}`);
  },

  // Add this inside the jobService object in src/services/jobService.ts
  getMaterialTotal: async (): Promise<number> => {
    const response = await api.get("/jobs/stats/material-total");
    return response.data;
  },
};
