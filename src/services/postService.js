import  api  from "./api"; 


export const createPost = (data) => 
  api.post("/posts/", data);

export const getPosts = (filters) => 
  api.get("/posts/", { params: filters });

export const searchPosts = (keyword) =>
  api.get("/posts/search", { params: { keyword } });

export const getPostsByUser = (user_id) =>
  api.get(`/posts/${user_id}`);

export const getPostById = (post_id) =>
  api.get(`/posts/${post_id}`);

export const patchPost = (post_id, data) =>
  api.patch(`/posts/${post_id}`, data);

export const deletePost = (post_id) =>
  api.delete(`/posts/${post_id}`);

export const likePost = (post_id) =>
  api.post(`/posts/${post_id}/like`);
