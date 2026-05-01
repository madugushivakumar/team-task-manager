import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // important if using cookies (optional)
});

// ==============================
// REQUEST INTERCEPTOR
// Automatically attach token
// ==============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// Handle errors globally
// ==============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired / Unauthorized
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      
      // Remove invalid token
      localStorage.removeItem("token");

      // Optional redirect
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default API;