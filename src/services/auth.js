import api from './api';

export async function registerUser({ email, password }) {
  const res = await api.post('/auth/register', { email, password });
  return res.data;
}

export async function loginUser({ username, password }) {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const res = await api.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
}