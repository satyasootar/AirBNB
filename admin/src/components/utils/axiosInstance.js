// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 100000,
    headers: { "Content-Type": "application/json" },
});

// Unique keys for token storage
const TOKENS_KEY = "admin_tokens_v1";

/** Save tokens to localStorage (call this after successful login) */
export function saveTokens(tokens) {
    if (!tokens) return;
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

/** Clear tokens */
export function clearTokens() {
    localStorage.removeItem(TOKENS_KEY);
}

/** Read tokens */
export function getTokens() {
    try {
        const raw = localStorage.getItem(TOKENS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        console.log("Error reading tokens: ", e);
        return null;
    }
}


axiosInstance.interceptors.request.use(
    (config) => {
        const tokens = getTokens();

        if (tokens && tokens.access) {
            config.headers.Authorization = `AIRBNB ${tokens.access}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if it's a 401 error and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Check if we're already trying to refresh to avoid infinite loops
            if (originalRequest.url?.includes('/token/refresh')) {
                // If refresh token also failed, clear tokens and redirect to login
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            try {
                const tokens = getTokens();
                if (tokens && tokens.refresh) {
                    // Call refresh token endpoint using axiosInstance to maintain baseURL
                    const response = await axiosInstance.post("/api/admin/token/refresh/", {
                        refresh: tokens.refresh
                    });

                    const newTokens = response.data;
                    saveTokens(newTokens);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `AIRBNB ${newTokens.access}`;
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.log("Token refresh failed: ", refreshError);
                // Refresh failed, clear tokens and redirect to login
                clearTokens();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;