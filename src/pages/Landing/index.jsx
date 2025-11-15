import React, { useState, useEffect } from "react";
import { BtnPrimary } from "@/components/UI/Buttons/BtnPrimary";
import { BtnSecondary } from "@/components/UI/Buttons/BtnSecondary";
import landingDog from "@/assets/images/landing-dog.png";
import landingCat from "@/assets/images/landing-cat.png";
import logoPopCat from "@/assets/images/icons/logo-pop-cat.png"; // Importar el nuevo logo
import * as classes from "./landing.module.css";
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        <div className={classes.logoContainer}>
          <img src={logoPopCat} alt="PetLink Logo" className={classes.logo} />
          <div className={classes.logoText}>PetLink</div>
        </div>

        {/* Hijo 2: Botones de acción */}
        <div className={classes.headerButtons}>
          <BtnPrimary
            className={classes.btnPrimary}
            divClassName={classes.btnPrimaryText}
            text={windowWidth <= 447 ? "Registrar" : "Registrarse"}
            onClick={() => {
              navigate('/register');
            }}
          />
          <BtnSecondary
            className={classes.btnSecondary}
            divClassName={classes.btnSecondaryText}
            text={windowWidth <= 447 ? "Iniciar" : "Iniciar Sesión"}
            onClick={() => {
              navigate('/login');
            }}
          />
        </div>
      </div>

      {/* ===== CONTENIDO PRINCIPAL (NUEVO) ===== */}
      {/* Este 'main' es el contenedor Grid para las 2 columnas */}
      {/* Usará position: relative para contener las imágenes */}
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
            onClick={() => {
              try {
                const hasUser = !!localStorage.getItem('user');
                const hasToken = !!localStorage.getItem('authToken');
                if (!hasUser && !hasToken) {
                  navigate('/register');
                } else {
                  navigate('/inicio');
                }
              } catch (e) {
                navigate('/register');
              }
            }}
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