import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
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
  // INFINITE SCROLL (NUEVO)
  // --------------------
  const useInfinitePosts = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: ["posts", "infinite", filters],
    queryFn: ({ pageParam = 0 }) =>
      postApi.getPosts({ ...filters, skip: pageParam, limit: 10 }),

    getNextPageParam: (lastPage, allPages) => {
      // allPages tiene todas las páginas cargadas
      const totalLoaded = allPages.flatMap(p => p.posts).length;
      
      // Si la última página trajo menos de 10 → no hay más
      if (lastPage.posts.length < 10) {
        return undefined;
      }
      
      // Si limit_reached es false → hay más
      if (!lastPage.limit_reached) {
        return totalLoaded; // ← skip para la próxima página
      }
      
      return undefined;
    },

    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
};

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
    useInfinitePosts,
    createPost,
    patchPost,
    deletePost,
    likePost,
  };
};