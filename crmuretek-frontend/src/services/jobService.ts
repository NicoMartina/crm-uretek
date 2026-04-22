import api from "./api";
import type { DashboardSummary } from "../types/DashboardSummary";
import type { Job } from "../types/Job";
import type { JobFormData } from "../types/JobFormData";
import type { StatsData } from "../types/StatsData";

export const jobService = {
  getAll: async () => {
    const response = await api.get<Job[]>("/jobs");
    return response.data;
  },

  create: async (jobData: JobFormData) => {
    const response = await api.post<Job>("/jobs", jobData);
    return response.data;
  },

  update: async (id: number, jobData: JobFormData) => {
    const response = await api.put<Job>(`/jobs/${id}`, jobData);
    return response.data;
  },

  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: number) => {
    return await api.delete(`/jobs/${id}`);
  },

  //should be in a separate service but for simplicity we can keep it here. We'll move it later.
  getDashboardSummary: async () => {
    const response = await api.get<DashboardSummary>("/dashboard/summary");
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<StatsData>("/dashboard/stats");
    return response.data;
  },
};
