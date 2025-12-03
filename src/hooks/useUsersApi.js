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

  const useGetUserById = (user_id) =>
    useQuery({
      queryKey: ["user", user_id],
      queryFn: () => userApi.getUserById(user_id),
      enabled: !!user_id,
    });

  // --------------------
  // MUTATIONS
  // --------------------
  const deleteMe = useMutation({
    mutationFn: userApi.deleteMe,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["me"] }),
  });

  const patchMe = useMutation({
    mutationFn: userApi.patchMe,
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
    deleteMe,
    patchMe,
    patchUserRole,
    deleteUser,
  };
};