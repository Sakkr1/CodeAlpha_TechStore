import axios from "axios";
import { increment, decrement } from "./loadingManager";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  increment();
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => { decrement(); return res; },
  (err) => { decrement(); return Promise.reject(err); }
);

export default api;
