import React from "react";
import * as classes from "./Cards.module.css";

// Función auxiliar para formatear la fecha a 'YYYY-MM-DD HH:mm:ss'
const formatToSQLDateTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Tarjeta del feed con estilo acorde al look & feel
export const FeedCard = ({
  title,
  category,
  description,
  imageUrl,
  location,
  publishedAt,
  className,
  onClick,
}) => {
  return (
    <article
      className={`${classes.card} ${className || ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter") onClick(); } : undefined}
    >
      <div className={classes.content}>
        <h3 className={classes.title}>{title}</h3>
        {category && <p className={classes.category}>{category}</p>}
        <p className={classes.description}>{description}</p>
        <div className={classes.metaRow}>
          <span className={classes.location}>📍 {location}</span>
          <span className={classes.published}>Publicado: {formatToSQLDateTime(publishedAt)}</span>
        </div>
      </div>
      {imageUrl && (
        <div className={classes.imageWrap}>
          <img className={classes.image} src={imageUrl} alt="Imagen de la publicación" />
        </div>
      )}
    </article>
  );
};

// Lista de tarjetas con snap scroll de 4 en 4
export const CardsFeed = ({ items = [], onCardClick }) => {
  const pages = [];
  for (let i = 0; i < items.length; i += 4) {
    pages.push(items.slice(i, i + 4));
  }

  return (
    <div className={classes.feedContainer}>
      {pages.map((pageItems, idx) => (
        <section key={idx} className={classes.page} aria-label={`Página ${idx + 1}`}>
          <div className={classes.grid}>
            {pageItems.map((it, j) => (
              <FeedCard
                key={`${idx}-${j}`}
                {...it}
                category={it.category}
                onClick={onCardClick ? () => onCardClick(it) : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

// Compatibilidad con nombre previo
export const Cards = FeedCard;