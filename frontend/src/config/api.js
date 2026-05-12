import axios from "axios";

export const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "";

export const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;