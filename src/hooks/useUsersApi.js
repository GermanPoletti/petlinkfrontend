import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as userApi from "../services/userService";

export const useUsersApi = () => {
  const queryClient = useQueryClient();

  // --------------------
  // QUERIES
  // --------------------
  const useGetAllUsers = () =>
    useQuery({
      queryKey: ["users"],
      queryFn: userApi.getAllUsers,
    });

  const useGetMe = () =>
    useQuery({
      queryKey: ["me"],
      queryFn: userApi.getMe,
    });

    const useGetMyRole = (role) =>
    useQuery({
      queryKey: ["myRole", role],
      queryFn: () => userApi.getMyRole(role),
    });

  const useGetUserById = (user_id) =>
    useQuery({
      queryKey: ["user", user_id],
      queryFn: () => userApi.getUserById(user_id),
      enabled: !!user_id,
    });



  const useGetUsersCount = () => 
    useQuery({
      queryKey: ["countUsers"], 
      queryFn: () => userApi.countAllUsers(),
      refetchInterval: 10000,
  });


const downloadUsersExcel = async (startDate, endDate) => {
    
      const blob = await userApi.exportUsersToExcel(startDate, endDate);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `usuarios_${startDate}_a_${endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    
  };
  

  // --------------------
  // MUTATIONS
  // --------------------
  const deleteMe = useMutation({
    mutationFn: userApi.deleteMe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const patchMe = useMutation({
    mutationFn: (data) => userApi.patchMe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const patchUserRole = useMutation({
    mutationFn: ({ user_id, role_id }) => userApi.patchUserRole(user_id, role_id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteUser = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    useGetAllUsers,
    useGetMe,
    useGetUserById,
    useGetMyRole,
    useGetUsersCount,
    downloadUsersExcel,
    deleteMe,
    patchMe,
    patchUserRole,
    deleteUser,
  };
};