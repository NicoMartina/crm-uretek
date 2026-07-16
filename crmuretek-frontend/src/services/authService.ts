import api from "./api";

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password });
    const token = response.data;
    localStorage.setItem("token", token);
    return token;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};
