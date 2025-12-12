import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  // eslint-disable-next-line no-console
  console.error(
    "API base URL not set. Please set VITE_API_BASE_URL in your environment (Vercel Environment Variables)."
  );
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post("/auth/login", { email, password }),

  register: (email, password, name, role) =>
    api.post("/auth/register", { email, password, name, role }),

  getMe: () => api.get("/auth/me"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default api;
