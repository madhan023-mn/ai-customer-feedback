import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("loop_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const isAuthEndpoint = error.config?.url?.includes("/auth/login") ||
                                   error.config?.url?.includes("/auth/register");
            if (!isAuthEndpoint) {
                localStorage.removeItem("loop_token");
                if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                    // Notify any listening auth listeners if needed
                    window.dispatchEvent(new Event("loop-auth-unauthorized"));
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;