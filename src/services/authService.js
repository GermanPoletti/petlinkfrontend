import api from './api';

export const registerUser = ({ email, password }) =>
  api.post('/auth/register', { email, password });

export const loginUser = ({ username, password }) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  return api.post("/auth/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const isAdmin = () => api.get("auth/is_admin");

export const logout = () => {
  const token = localStorage.getItem('authToken')
  localStorage.clear()
  if(token){
    api.post("/auth/logout").catch(() => {})
  }else{
    window.location.replace("/")  
  }
   
}