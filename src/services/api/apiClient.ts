import axios from "axios";
import { getJwtToken } from "@/shared/utils/cookieUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getJwtToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 401 || status === 403) {
                console.warn(`Unauthorized (${status})`);
            } else if (status === 404) {
                console.warn("Resource not found");
            }

        }
        throw error;
    }
);

export default apiClient;