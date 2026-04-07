import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ── Request interceptor → attach token ──────────────
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

// ── Response interceptor → handle 401 ───────────────
const PUBLIC_ENDPOINTS = ["/users/", "/token/", "/verify-email/", "/forgot-password/", "/generate-code/"];

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const requestUrl = error.config?.url || "";
        const isPublic = PUBLIC_ENDPOINTS.some((ep) => requestUrl.includes(ep));

        if (error.response?.status === 401 && !isPublic) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;