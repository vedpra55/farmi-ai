import axios from "axios";

const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${serverUrl}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default api;
