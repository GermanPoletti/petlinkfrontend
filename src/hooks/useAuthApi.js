import { useMutation } from "@tanstack/react-query";
import * as authApi from "../services/authService";

export const useAuthApi = () => {
  const loginUser = useMutation({
    mutationFn: (data) =>
      authApi.loginUser(data),
  });

  const registerUser = useMutation({
    mutationFn: (data) =>
      authApi.registerUser(data),
  });

  const logoutUser = useMutation({
    mutationFn: () => authApi.logout(),
  });

  return { loginUser, registerUser, logoutUser };
};