import axios from "axios";

// One place to change the URL for the whole app
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
