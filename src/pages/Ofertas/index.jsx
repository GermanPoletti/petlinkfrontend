import React from "react";
import PostsFeedPage from "@/components/UI/PostsFeed/PostsFeedPage";

function Ofertas() {
  return (
    <PostsFeedPage
      type="oferta"
      postTypeId={1}
      title="Ofertas"
      detailRoutePrefix="oferta-ampliada"
      noMoreText="No hay más ofertas"
    />
  );
}

export default Ofertas;