import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-API-Version": "1"
  }
});

api.interceptors.request.use(
  (config) => {
    config.headers["X-API-Version"] = "1";
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthPage = window.location.pathname.includes("/login") || 
                       window.location.pathname.includes("/auth/callback");
    
    if (error.response?.status === 401 && !isAuthPage) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;