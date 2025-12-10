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
    // SI ES 401 → sacamos al usuario y cortamos todo
    if (err.response?.status === 401) {
      localStorage.clear()
      // Forzamos salida sin romper React Query
      window.location.replace("/");
      // No devolvemos nada más → React Query ve error pero ya estamos afuera
    }
    // Dejamos que el error siga su camino normal (React Query lo va a manejar)
    return Promise.reject(err);
});

export default api;