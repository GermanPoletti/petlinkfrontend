import React from "react";
import * as classes from "./ContributionPanel.module.css";
import registerDog from "@/assets/images/register-Dog.png";

// Panel de contribuciones: Mobile-first. Muestra conteo y una imagen opcional.
// Props soportadas:
// - contributionsCount: número de veces que se contribuyó
// - countText: texto personalizado (si se quiere override)
// - imageUrl | imageSrc: imagen a mostrar (fallback: registerDog)
export const ContributionPanel = ({
  contributionsCount,
  countText,
  imageUrl,
  imageSrc,
  alt = "Contribución",
}) => {
  const img = imageUrl || imageSrc || registerDog;
  const text =
    typeof contributionsCount === "number"
      ? `Has contribuido a propuestas: ${contributionsCount} veces`
      : countText || "Has contribuido";

  return (
    <div className={classes.panel}>
      <div className={classes.text}>{text}</div>
      {img && <img className={classes.image} src={img} alt={alt} loading="lazy" />}
    </div>
  );
};

export default ContributionPanel;