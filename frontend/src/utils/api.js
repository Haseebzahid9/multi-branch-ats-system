import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Inject token from storage on every request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('njp_user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('njp_user');
      window.location.href = '/signin';
    }
    return Promise.reject(err);
  }
);

export default api;
