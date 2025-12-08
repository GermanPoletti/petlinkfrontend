import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data, 
  (err) => {
    // const message = err.response?.data?.detail || err.message;
    return Promise.reject(err);
  }
);

export default api;