import React from "react";
import postImageFallback from "@/assets/images/landing-dog.png";
import * as classes from "./PostContainer.module.css";

// Contenedor de post ampliado con estilo de card (igual a Cards)
// Layout: contenido izquierda, imagen derecha, meta en el pie.
export const PostContainer = ({
  className,
  title = "",
  description = "",
  imageUrl,
  username,
  location = "",
  publishedAt = "",
  likesNumber,
  leftAction,
  rightAction,
}) => {
  
  return (
    <article className={`${classes.container} ${className || ""}`}>
      {/* Columna izquierda: contenido */}
      <div className={classes.content}>
        {title && <h3 className={classes.title}>{title}</h3>}
        {username && <p className={classes.username}>👤 {username}</p>}
        {description && <p className={classes.description}>{description}</p>}
      </div>

      {/* Columna derecha: imagen (si existe) */}
      {(imageUrl) && (
        <div className={classes.imageWrap}>
          <img
            className={classes.image}
            alt={title || "Imagen de la publicación"}
            src={imageUrl || null}
          />
        </div>
        
      )}
      <div className={classes.metaRow}>
          <span className={classes.location}>📍 {location}</span>
          <span className={classes.likeCount}>❤️{likesNumber}</span>
          {publishedAt && (
            <span className={classes.published}>Publicado: {publishedAt}</span>
          )}
        </div>

      {/* Fila de acciones: izquierda/derecha con misma dimensión y poco intrusivas */}
      {(leftAction || rightAction) && (
        <div className={classes.actions}>
          <div className={classes.leftAction}>{leftAction}</div>
          <div className={classes.rightAction}>{rightAction}</div>
        </div>
      )}
    </article>
  );
};
