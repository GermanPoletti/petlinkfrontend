import React, { useState, useRef, useEffect } from "react";
import * as classes from "./PagesTemplate.module.css";
import { NavBar } from "@/components/UI/NavBar";
import BtnNewPost from "@/components/UI/Buttons/BtnNewPost";
import { MenuDesplegable } from "@/components/UI/Menu";
import menuClasses from "@/components/UI/Menu/Menu.module.css";

// Plantilla de página: incluye NavBar al tope y botón flotante de nuevo post.
// Renderiza el contenido de la página vía children, manteniendo enfoque mobile-first.
export const PagesTemplate = ({ children, userImageUrl, onProfileClick, onNewPostClick, onSelectNewPostType }) => {
  const [newPostMenuOpen, setNewPostMenuOpen] = useState(false);
  const fabRef = useRef(null);

  // Cerrar al hacer click fuera del botón/menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (newPostMenuOpen && fabRef.current && !fabRef.current.contains(e.target)) {
        setNewPostMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [newPostMenuOpen]);

  return (
    <div className={classes.bgTemplate}>
      <NavBar userImageUrl={userImageUrl} onProfileClick={onProfileClick} />

      <div className={classes.content}>{children}</div>

      <div className={classes.fab} ref={fabRef}>
        <BtnNewPost onClick={() => setNewPostMenuOpen((o) => !o)} />
        <MenuDesplegable
          isOpen={newPostMenuOpen}
          onClose={() => setNewPostMenuOpen(false)}
          className={`${menuClasses.menuUp} ${menuClasses.neutral}`}
          items={[
            { label: "Publicar Oferta", onClick: () => onSelectNewPostType?.("oferta") || onNewPostClick?.("oferta") },
            { label: "Publicar Propuesta", onClick: () => onSelectNewPostType?.("propuesta") || onNewPostClick?.("propuesta") },
          ]}
        />
      </div>
    </div>
  );
};

export default PagesTemplate;