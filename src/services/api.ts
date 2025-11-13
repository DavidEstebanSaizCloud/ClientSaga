import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://api.example.com",
  timeout: 8000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Hook for refreshing tokens/logging out in the future
      console.warn("Unauthorized request", error.config?.url);
    }
    return Promise.reject(error);
  },
);

export default api;
