import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({ baseURL: API_BASE });

let isRefreshing = false;
let subscribers = [];

function subscribe(cb) { subscribers.push(cb); }
function onRefreshed(token) { subscribers.forEach(cb => cb(token)); subscribers = []; }

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); window.location.href = '/login'; return Promise.reject(error); }
      if (isRefreshing) {
        return new Promise((resolve) => subscribe((token) => { originalRequest.headers.Authorization = `Bearer ${token}`; resolve(api(originalRequest)); }));
      }
      isRefreshing = true;
      try {
        const r = await axios.post(`${API_BASE}/api/token/refresh/`, { refresh });
        const newToken = r.data.access;
        localStorage.setItem('access_token', newToken);
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        onRefreshed(newToken);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (e) {
        isRefreshing = false;
        localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
