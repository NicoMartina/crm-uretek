import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const getJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};
