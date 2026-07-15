import axios from "axios";

// All requests go through the Vite dev proxy to the Express API (see vite.config.js)
const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bookstore_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
