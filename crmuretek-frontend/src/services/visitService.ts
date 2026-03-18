import api from "./api";

export const visitService = {
  // This handles: GET /api/visits
  getAll: async () => {
    const response = await api.get("/visits");
    return response.data;
  },

  // This handles: POST /api/visits
  create: async (visitData: any) => {
    const response = await api.post("/visits", visitData);
    return response.data;
  },

  // This handles: PUT /api/visits/{id}/date

  updateDate: async (id: number, visitDate: any) => {
    const response = await api.patch(`/visits/${id}/date`, { visitDate });
    return response.data;
  },

  // This handles: PATCH /api/visits/{id}/status
  updateStatus: async (id: number, status: string) => {
    const response = await api.patch(`/visits/${id}/status`, { status });
    return response.data;
  },

  // This handles: DELETE /api/visits/{id}
  delete: async (id: number) => {
    return await api.delete(`/visits/${id}`);
  },

  // This handles: UPDATE /api/visits/{id}/observation
  updateObservations: async (id: number, observation: string) => {
    const response = await api.patch(`/visits/${id}/observations`, {
      observations: observation,
    });
    return response.data;
  },
};
