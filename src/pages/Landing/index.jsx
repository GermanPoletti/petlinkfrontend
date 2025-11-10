import React from "react";
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import { BtnSecondary } from "@/components/UI/Buttons/BtnSecondary";
import landingDog from "@/assets/images/landing-dog.png";
import landingCat from "@/assets/images/landing-cat.png";
import * as classes from "./landing.module.css";
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  // Tu función handleLogin (aunque ya no se usa en el botón)
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    // Contenedor principal: ahora usa flex-column para apilar header y main
    <div className={classes.landingPage}>
      
      {/* ===== HEADER ===== */}
      {/* El header ahora es el contenedor flex que organiza sus hijos */}
      <div className={classes.headerBackground}>
        
        {/* Hijo 1: Logo */}
        <div className={classes.logo}>PetLink</div>

        {/* Hijo 2: Botón */}
        <BtnSecondary
          className={classes.btnSecondary}
          divClassName={classes.btnSecondaryText}
          text="Iniciar Sesión"
          onClick={() => {
            navigate('/login');
          }}
        />
      </div>

      {/* ===== CONTENIDO PRINCIPAL (NUEVO) ===== */}
      {/* Este 'main' es el contenedor Grid para las 2 columnas */}
      <main className={classes.mainContent}>

        {/* --- COLUMNA 1: TEXTO --- */}
        {/* Reutilizamos tu contentContainer, pero ahora es una columna del grid */}
        <div className={classes.contentContainer}>
          <p className={classes.mainHeading}>
            Donde cada gesto de ayuda encuentra su conexión
          </p>

          <p className={classes.subHeading}>
            Somos la comunidad 100% dedicada a mascotas. Publica tu necesidad u
            ofrece ayuda (transporte, donaciones, refugio) y conecta con otros.
            Aquí tu publicación se ve
          </p>

          <p className={classes.subHeading}>
            Aquí tu publicación se ve
          </p>

          <BtnPrimary
            className={classes.btnPrimary}
            divClassName={classes.btnPrimaryText}
            onClick={() => navigate('/inicio')}
            propiedad1="predeterminado"
            text="Explorar publicaciones"
          />
        </div>

        {/* --- COLUMNA 2: IMÁGENES (NUEVO) --- */}
        {/* Este 'imageContainer' es la 2da columna del grid */}
        {/* Usará position: relative para contener las imágenes */}
        <div className={classes.imageContainer}>
          <div className={classes.backgroundShape} />
          <img className={classes.landingDog} alt="Perro" src={landingDog} />
          <img className={classes.landingCat} alt="Gato" src={landingCat} />
        </div>
        
      </main>
    </div>
  );
};