import React from "react";
import * as classes from "./DonatorPanel.module.css";
import badgeCat from "@/assets/images/badge-Cat.png";

// Panel de donadores: mobile-first. Muestra ranking y/o mensaje con imagen.
// Props soportadas:
// - donorRank: posición en el ranking
// - donorsTotal: total de donadores
// - message: override manual del texto
// - imageUrl | imageSrc: imagen a mostrar (fallback: badgeCat)
export const DonatorPanel = ({
  donorRank,
  donorsTotal,
  message,
  imageUrl,
  imageSrc,
  alt = "Donaciones",
}) => {
  const img = imageUrl || imageSrc || badgeCat;
  const text = message ||
    (typeof donorRank === "number" && typeof donorsTotal === "number"
      ? `Ranking de donadores: #${donorRank} de ${donorsTotal}`
      : typeof donorsTotal === "number"
      ? `Estás entre los ${donorsTotal} donadores!`
      : "Estás entre los donadores!");

  return (
    <div className={classes.panel}>
      <div className={classes.text}>{text}</div>
      {img && <img className={classes.image} src={img} alt={alt} loading="lazy" />}
    </div>
  );
};

export default DonatorPanel;