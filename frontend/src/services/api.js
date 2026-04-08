import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ── Animals ───────────────────────────────────────────────
export const animalsAPI = {
  getAll: (params) => api.get('/animals', { params }),
  getOne: (id) => api.get(`/animals/${id}`),
  create: (data) => api.post('/animals', data),
  update: (id, data) => api.put(`/animals/${id}`, data),
  delete: (id) => api.delete(`/animals/${id}`),
  getMedicalHistory: (id) => api.get(`/animals/${id}/medical`),
};

// ── Adoptions ─────────────────────────────────────────────
export const adoptionsAPI = {
  getAll: (params) => api.get('/adoptions', { params }),
  create: (data) => api.post('/adoptions', data),
  approve: (id, data) => api.patch(`/adoptions/${id}/approve`, data),
  reject: (id, data) => api.patch(`/adoptions/${id}/reject`, data),
};

// ── Adopters ──────────────────────────────────────────────
export const adoptersAPI = {
  getAll: () => api.get('/adopters'),
};

// ── Donations ─────────────────────────────────────────────
export const donationsAPI = {
  getAll: (params) => api.get('/donations', { params }),
  create: (data) => api.post('/donations', data),
  getSummary: () => api.get('/donations/summary'),
};

// ── Volunteers ────────────────────────────────────────────
export const volunteersAPI = {
  getAll: () => api.get('/volunteers'),
  create: (data) => api.post('/volunteers', data),
  assign: (data) => api.post('/volunteers/assign', data),
  getAssignments: (id) => api.get(`/volunteers/${id}/assignments`),
  completeAssignment: (id) => api.patch(`/volunteers/assignments/${id}/complete`),
};

// ── Medical ───────────────────────────────────────────────
export const medicalAPI = {
  getAll: () => api.get('/medical'),
  getByAnimal: (animalId) => api.get(`/medical/${animalId}`),
  create: (data) => api.post('/medical', data),
};

// ── Dashboard ─────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
