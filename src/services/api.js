import axios from "axios";

// Your ASP.NET Backend URL (from Swagger)
const API_BASE = "https://localhost:7134/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== HALLS ==========

// Simple cache: stores the last unfiltered halls response for 60 seconds.
// Invalidated automatically on any mutation so admin always sees fresh data.
let _hallsCache = null;
let _hallsCacheAt = 0;
const HALLS_TTL = 60_000;

export const getHalls = (params) => {
  const now = Date.now();
  // Only cache unfiltered list calls
  if (!params && _hallsCache && now - _hallsCacheAt < HALLS_TTL) {
    return Promise.resolve(_hallsCache);
  }
  return api.get("/Halls", { params }).then((res) => {
    if (!params) { _hallsCache = res; _hallsCacheAt = Date.now(); }
    return res;
  });
};

const _bustHallsCache = () => { _hallsCache = null; _hallsCacheAt = 0; };

export const getHallById = (id) => api.get(`/Halls/${id}`);
export const createHall  = (data)    => api.post("/Halls", data).then(r => { _bustHallsCache(); return r; });
export const updateHall  = (id, data) => api.put(`/Halls/${id}`, data).then(r => { _bustHallsCache(); return r; });
export const deleteHall  = (hallID)  => api.delete(`/Halls/${hallID}`).then(r => { _bustHallsCache(); return r; });

// ========== BOOKINGS ==========
export const getBookings = () => api.get("/Bookings");
export const checkHallAvailability = (hallId, date) =>
  api.get(`/Bookings/check`, { params: { hallId, date } });
// NOTE: endpoint uses lowercase "user"
export const getUserBookings = (userId) => api.get(`/Bookings/user/${userId}`);
export const createBooking = (data) => api.post("/Bookings", data);
export const updateBookingStatus = (id, status) =>
  api.put(`/Bookings/${id}/status`, { status }, {
    headers: { "Content-Type": "application/json" },
  });
// Convenience wrapper — MyBookingsPage calls this to cancel a booking
export const cancelBooking = (id) => updateBookingStatus(id, "Cancelled");

// ========== AUTH ==========
// NOTE: endpoint uses lowercase "login"
export const login = (data) => api.post("/Auth/login", data);
export const register = (data) => api.post("/Auth/register", data);

// ========== CONTACTS ==========
export const sendContact      = (data) => api.post("/Contacts", data);
export const getContacts      = ()     => api.get("/Contacts");
export const markContactRead  = (id)   => api.put(`/Contacts/${id}/read`);
export const deleteContact    = (id)   => api.delete(`/Contacts/${id}`);

export default api;
