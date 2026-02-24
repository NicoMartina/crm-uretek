import axios from "axios";

// One place to change the URL for the whole app
const API_URL = "https://crm-uretek-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
