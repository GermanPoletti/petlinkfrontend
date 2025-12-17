import api from './api';

export const getAllUsers = () => api.get("/users/");
export const getMe = () => api.get("/users/me");
export const deleteMe = () => api.delete("/users/me");
export const patchMe = (data) => api.patch("/users/me", data);
export const patchUserRole = (user_id, role_id) =>
    api.patch(`/users/${user_id}/role`, null, { params: { role_id } })
export const countAllUsers = () => api.get("/users/count")
export const deleteUser = (user_id) => api.delete(`/users/${user_id}`);
export const getUserById = (user_id) =>api.get(`/users/${user_id}`);
export const getMyRole = (role) => {
  return api.get("/users/role", {
    params: { role }
  });
};

export const getUserRank = () => api.get("/users/ranking")

export const exportUsersToExcel = async (date_from, date_to) => {
  const response = await api.get("/users/export/excel", {
    params: {
      date_from,
      date_to,
    },
    responseType: "blob", // CLAVE: le dice a Axios que viene un archivo binario
  });

  return response.data; // ← esto es un Blob
};
