import React from "react";
import PostsFeedPage from "@/components/UI/PostsFeed/PostsFeedPage";
import { useUser } from "../../context/UserContext";

function MyPosts() {
  const {userId} = useUser();
  return (
    <PostsFeedPage
      type="Mis Publicaciones"
      title="Mis Publicaciones"
      detailRoutePrefix="mi-publicacion-ampliada"
      userId={userId}
      noMoreText="No hay más publicaciones"
    />
  );
}

export default MyPosts;
