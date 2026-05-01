// API Service - Axios instance with interceptors
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 / refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefresh } = res.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefresh);
          original.headers.Authorization = `Bearer ${accessToken}`;
          return api(original);
        }
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login:  (data) => api.post('/auth/login', data),
  logout: ()     => api.post('/auth/logout'),
  getMe:  ()     => api.get('/auth/me')
};

// Kundali APIs
export const kundaliAPI = {
  generate:      (data) => api.post('/kundali/generate', data),
  getAll:        ()     => api.get('/kundali/my-kundalis'),
  getById:       (id)   => api.get(`/kundali/${id}`),
  delete:        (id)   => api.delete(`/kundali/${id}`),
  getAIExplain:  (id)   => api.post(`/kundali/${id}/ai-explain`)
};

// Payment APIs
export const paymentAPI = {
  createOrder:   ()     => api.post('/payment/create-order'),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getHistory:    ()     => api.get('/payment/history')
};

// Chat APIs
export const chatAPI = {
  send:        (data)      => api.post('/chat/message', data),
  getHistory:  (kundaliId) => api.get(`/chat/history/${kundaliId}`),
  clearHistory:(kundaliId) => api.delete(`/chat/history/${kundaliId}`)
};

// User APIs
export const userAPI = {
  getProfile:   () => api.get('/user/profile'),
  updateProfile:(data) => api.put('/user/profile', data),
  getAIUsage:   () => api.get('/user/ai-usage')
};
