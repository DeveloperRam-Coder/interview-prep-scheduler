import axios from 'axios';

// In dev, use relative /api so Vite proxy forwards to backend. In prod, set VITE_API_URL.
const API_BASE =
  import.meta.env.VITE_API_URL != null && import.meta.env.VITE_API_URL !== ''
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
