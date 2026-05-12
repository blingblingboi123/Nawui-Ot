import axios from "axios";

export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || API_URL,
  withCredentials: true,
});

export default api;