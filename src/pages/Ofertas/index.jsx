import React from "react";
import PostsFeedPage from "@/components/UI/PostsFeed/PostsFeedPage";

function Ofertas() {
  return (
    <PostsFeedPage
      type="Ofertas"
      postTypeId={1}
      title="ofertas"
      detailRoutePrefix="oferta-ampliada"
      noMoreText="No hay más ofertas"
    />
  );
}

export default Ofertas;