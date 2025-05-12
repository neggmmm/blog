// api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Clear token and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 429:
          // Rate limit exceeded
          return Promise.reject(new Error('Too many requests. Please try again later.'));
        default:
          return Promise.reject(error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
