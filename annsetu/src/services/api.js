import axios from "axios";

// All API calls go to this base URL
const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Automatically attach JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth APIs ────────────────────────────────────────────────
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ─── Donation APIs ────────────────────────────────────────────
export const createDonation = (data) => API.post("/donations", data);
export const getMyDonations = () => API.get("/donations/my");
export const getDonationById = (id) => API.get(`/donations/${id}`);
export const uploadImage = (formData) => API.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

export default API;
