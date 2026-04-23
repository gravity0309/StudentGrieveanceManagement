import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('gms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerStudent = (data) => API.post('/register', data);
export const loginStudent = (data) => API.post('/login', data);

// Grievances
export const submitGrievance = (data) => API.post('/grievances', data);
export const getAllGrievances = () => API.get('/grievances');
export const getGrievanceById = (id) => API.get(`/grievances/${id}`);
export const updateGrievance = (id, data) => API.put(`/grievances/${id}`, data);
export const deleteGrievance = (id) => API.delete(`/grievances/${id}`);
export const searchGrievances = (title) => API.get(`/grievances/search?title=${title}`);

export default API;
