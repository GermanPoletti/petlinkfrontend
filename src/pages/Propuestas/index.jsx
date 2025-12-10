import React from "react";
import PostsFeedPage from "@/components/UI/PostsFeed/PostsFeedPage";

function Propuestas() {
  return (
    <PostsFeedPage
      type="propuesta"
      postTypeId={2}
      title="Propuestas"
      detailRoutePrefix="propuesta-ampliada"
      noMoreText="No hay más propuestas"
    />
  );
}

export default Propuestas;