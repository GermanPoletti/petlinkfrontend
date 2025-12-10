import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import * as classes from "./NavBar.module.css";

import { BtnOfertas } from "@/components/UI/Buttons/BtnOfertas";
import { BtnHome } from "@/components/UI/Buttons/BtnHome";
import backarrowIcon from "@/assets/images/icons/backarrow.png";
import { useAuthApi } from "@/hooks/useAuthApi";
import defaultAvatar from "@/assets/images/icons/Profile.png";
import chatIcon from "@/assets/images/icons/Chat.png";
import { useChat } from "@/context/ChatContext";
import { MenuDesplegable } from "@/components/UI/Menu";
import { useToast } from "@/components/UI/Toast";
import { BtnPropuestas } from "@/components/UI/Buttons/BtnPropuestas";


export const NavBar = ({ userImageUrl, onProfileClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const rightGroupRef = useRef(null);
  const { toggleChat } = useChat();
  const { showToast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const { logoutUser, useIsAdmin } = useAuthApi();

  const handleLogout = () => {


    logoutUser.mutate(undefined,{
      onSuccess: () => {
          console.log("logedout")
          showToast("Logged Out", { type: "success" });
          navigate("/");
        },
        onError: (error) => {
          const msg = error.response?.data?.detail || "Error al desloguear";
          showToast(msg, { type: "error" });
        
      } 
    })

    // try {
    //   localStorage.removeItem("authToken");
    //   localStorage.removeItem("user");
    // } catch (e) {}
    // navigate("/", { replace: true });
    // showToast("Sesión cerrada", { type: "success" });
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuOpen && rightGroupRef.current && !rightGroupRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const { data: adminData, isLoading, error } = useIsAdmin;

 useEffect(() => {
  const checkAdmin = () => {
    try {
      setIsAdmin(adminData.is_admin);
    } catch {
      setIsAdmin(false);
    }
  };

  // // Ejecutar al montar
  checkAdmin();

  // // Escuchar cambios de URL (cuando cambias ?dev=admin)
  // const handleLocationChange = () => checkAdmin();
  // window.addEventListener("popstate", handleLocationChange);
  // window.addEventListener("pushstate", handleLocationChange); // si usas navigate

  // return () => {
  //   window.removeEventListener("popstate", handleLocationChange);
  //   window.removeEventListener("pushstate", handleLocationChange);
  // };
}, [adminData]);

  return (
    <div className={classes.navbar}>
      {/* Izquierda: Home */}
      <div className={classes.leftGroup}>
                <BtnHome onClick={() => navigate("/inicio")} />
        <button className={classes.backButton} onClick={() => navigate(-1)} aria-label="Volver atrás">
          <img src={backarrowIcon} alt="Volver" className={classes.backIcon} />
        </button>
      </div>

      {/* Centro: Propuestas y Ofertas, siempre centrados */}
      <div className={classes.centerGroup}>
        {isAdmin && (
          <BtnPropuestas
            active={location.pathname.startsWith("/back-office")}
            text="Back Office"
            onClick={() => navigate("/back-office/dashboard")}
          />
        )}
        <BtnPropuestas
          className={classes.btnPropuestas}
          active={location.pathname === "/propuestas"}
          text="Propuestas"
          onClick={() => navigate("/propuestas")}
        />
        <BtnOfertas
          className={classes.btnOfertas}
          active={location.pathname === "/ofertas"}
          text="Ofertas"
          onClick={() => navigate("/ofertas")}
        />
      </div>

      {/* Derecha: Chat + Perfil */}
      <div className={classes.rightGroup} ref={rightGroupRef}>
        <button
          className={classes.chatButton}
          onClick={() => toggleChat()}
          aria-label="Abrir/Cerrar chat"
        >
          <img src={chatIcon} alt="Chat" className={classes.chatIcon} />
        </button>
        <button
          className={classes.profileButton}
          onClick={() => {
            setMenuOpen((o) => !o);
            onProfileClick?.();
          }}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <img
            className={classes.userImage}
            alt="Imagen de perfil"
            src={userImageUrl || defaultAvatar}
          />
        </button>

        <MenuDesplegable
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          items={[
            { label: "Perfil", onClick: () => navigate("/perfil") },
            { label: "Configuración", onClick: () => navigate("/configuracion") },
            { label: "Mis Publicaciones", onClick: () => navigate("/mis-publicaciones") },
            { label: "Cerrar Sesión", onClick: handleLogout },
          ]}
        />
      </div>
    </div>
  );
};
