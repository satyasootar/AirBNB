import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // your backend URL
  headers: { "Content-Type": "application/json" },
});

// Request interceptor → attach access token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers["Authorization"] = `AIRBNB ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle expired access token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if token expired & we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("No refresh token found");

        // ask backend for a new access token
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        // save and update header
        localStorage.setItem("access", newAccess);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;

        // retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // optional: force logout user here
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
