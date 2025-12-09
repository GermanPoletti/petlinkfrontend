import React from "react";
import PostsFeedPage from "@/components/UI/PostsFeed/PostsFeedPage";

function MyPosts() {
  return (
    <PostsFeedPage
      type="Mis Publicaciones"
      title="Mis Publicaciones"
      detailRoutePrefix="mi-publicacion-ampliada"
      userId={localStorage.getItem("userId")}
      noMoreText="No hay más publicaciones"
    />
  );
}

export default MyPosts;
