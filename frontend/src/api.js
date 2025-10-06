import axios from 'axios';

// Create axios instance with base URL from environment
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

// Request interceptor to add auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/login/', { username, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile/');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  getMetricsSummary: async () => {
    const response = await api.get('/services/charts/summary/');
    return response.data;
  },

  getSalesData: async () => {
    const response = await api.get('/services/charts/sales/');
    return response.data;
  },

  getTopProducts: async () => {
    const response = await api.get('/services/charts/top-products/');
    return response.data;
  },

  uploadData: async (formData) => {
    const response = await api.post('/services/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  askQuestion: async (question) => {
    const response = await api.post('/services/q/ask/', { question });
    return response.data;
  },

  getAlerts: async () => {
    const response = await api.get('/services/alerts/');
    return response.data;
  },

  getInsights: async () => {
    const response = await api.get('/services/insights/');
    return response.data;
  },

  getForecasts: async () => {
    const response = await api.get('/services/forecasts/');
    return response.data;
  },

  logout: async (refreshToken) => {
    const response = await api.post('/logout/', { refresh_token: refreshToken });
    return response.data;
  },
};

export default api;
