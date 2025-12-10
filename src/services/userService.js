import api from './api';

export const getAllUsers = () => api.get("/users/");
export const getMe = () => api.get("/users/me");
export const deleteMe = () => api.delete("/users/me");
export const patchMe = (data) => api.patch("/users/me", data);
export const patchUserRole = (user_id, role_id) =>
    api.patch(`/users/${user_id}/role`, null, { params: { role_id } })

export const deleteUser = (user_id) => api.delete(`/users/${user_id}`);
export const getUserById = (user_id) =>api.get(`/users/${user_id}`);
