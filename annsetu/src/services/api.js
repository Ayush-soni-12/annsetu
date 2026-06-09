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
export const signupNgo = (data) => API.post("/auth/signup/ngo", data);
export const login = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// ─── NGO APIs ─────────────────────────────────────────────────
export const getAllNgos = (params) => API.get("/ngos", { params });   // ?city=Delhi
export const getNgoById = (id) => API.get(`/ngos/${id}`);
export const getMyNgoProfile = () => API.get("/ngos/my-profile");
export const updateMyNgoProfile = (data) => API.put("/ngos/my-profile", data);
export const getNgoDonations = () => API.get("/ngos/donations");

// ─── Donation APIs ────────────────────────────────────────────
export const createDonation = (data) => API.post("/donations", data);
export const getMyDonations = () => API.get("/donations/my");
export const getMyStats = () => API.get("/donations/stats");

// ─── Global Stats ─────────────────────────────────────────────
export const getGlobalStats = () => API.get("/stats");
export const getDonationById = (id) => API.get(`/donations/${id}`);
export const uploadImage = (formData) => API.post("/upload", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// ─── AI APIs ──────────────────────────────────────────────────
export const analyzeFoodSafety = (data) => API.post("/ai/food-safety", data);
export const matchDonation = (data) => API.post("/ai/match-donation", data);

// ─── Admin APIs ───────────────────────────────────────────────
export const getAdminUsers = () => API.get("/admin/users");
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);
export const getAdminNgos = () => API.get("/admin/ngos");
export const approveAdminNgo = (id) => API.put(`/admin/ngos/${id}/approve`);
export const deleteAdminNgo = (id) => API.delete(`/admin/ngos/${id}`);
export const getAdminDonations = () => API.get("/admin/donations");
export const updateAdminDonationStatus = (id, data) => API.put(`/admin/donations/${id}/status`, data);
export const deleteAdminDonation = (id) => API.delete(`/admin/donations/${id}`);

export default API;
