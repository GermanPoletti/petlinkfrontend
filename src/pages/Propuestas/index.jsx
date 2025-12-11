import React from "react";
import PostsFeedPage from "@/components/UI/PostsFeed/PostsFeedPage";

function Propuestas() {
  return (
    <PostsFeedPage
      type="Necesidades"
      postTypeId={2}
      title="necesidades"
      detailRoutePrefix="propuesta-ampliada"
      noMoreText="No hay más propuestas"
    />
  );
}

export default Propuestas;