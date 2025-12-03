import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as postApi from "../services/postService"; // Corregido el path

export const usePostsApi = () => {
  const queryClient = useQueryClient();

  // --------------------
  // QUERIES
  // --------------------
  const useGetPosts = (filters) =>
    useQuery({
      queryKey: ["posts", filters],
      queryFn: () => postApi.getPosts(filters),
    });

  const useGetPostById = (post_id) =>
    useQuery({
      queryKey: ["post", post_id],
      queryFn: () => postApi.getPostById(post_id),
      enabled: !!post_id,
    });

  const useGetPostsByUser = (user_id) =>
    useQuery({
      queryKey: ["postsByUser", user_id],
      queryFn: () => postApi.getPostsByUser(user_id),
      enabled: !!user_id,
    });

  // --------------------
  // MUTATIONS
  // --------------------
  const createPost = useMutation({
    mutationFn: postApi.createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const patchPost = useMutation({
    mutationFn: ({ post_id, data }) => postApi.patchPost(post_id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });

  const deletePost = useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", variables] });
    },
  });

  const likePost = useMutation({
    mutationFn: postApi.likePost,
    onSuccess: (_, post_id) => {
      queryClient.invalidateQueries({ queryKey: ["post", post_id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    useGetPosts,
    useGetPostById,
    useGetPostsByUser,
    createPost,
    patchPost,
    deletePost,
    likePost,
  };
};