import axios from 'axios';

// Your ASP.NET Backend URL (from Swagger)
const API_BASE = 'https://localhost:7134/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== HALLS ==========
export const getHalls = (params) => api.get('/Halls', { params });
export const getHallById = (id) => api.get(`/Halls/${id}`);
export const createHall = (data) => api.post('/Halls', data);

// ========== BOOKINGS ==========
export const getBookings = () => api.get('/Bookings');
export const getUserBookings = (userId) => api.get(`/Bookings/user/${userId}`);
export const createBooking = (data) => api.post('/Bookings', data);
export const updateBookingStatus = (id, status) => api.put(`/Bookings/${id}/status`, JSON.stringify(status), {
  headers: { 'Content-Type': 'application/json' }
});

// ========== AUTH ==========
export const login = (data) => api.post('/Auth/login', data);
export const register = (data) => api.post('/Auth/register', data);

// ========== CONTACTS ==========
export const sendContact = (data) => api.post('/Contacts', data);

export default api;