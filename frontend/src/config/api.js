export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const API_URL = `${API_BASE_URL}/api/v1`;

export const authHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
