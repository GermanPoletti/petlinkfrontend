import React from "react";
import * as classes from "./BtnPropuestas.module.css";
import PropTypes from "prop-types";

// 1. Props simplificados (igual que BtnPrimary)
export const BtnPropuestas = ({ className, divClassName, text, onClick, active = false }) => {
  
  // 2. Eliminamos useReducer, onMouseEnter, onMouseLeave

  return (
    // 3. Convertimos de <div> a <button> para accesibilidad
    <button
      className={`${classes.btnPropuestas} ${active ? classes.active : ""} ${className || ""}`}
      onClick={onClick}
    >
      <div
        // 4. Usamos divClassName para el texto, igual que BtnPrimary
        className={`${classes.label} ${divClassName || ""}`}
      >
        {/* 5. Usamos un prop para el texto, en lugar de "Propuestas" fijo */}
        {text}
      </div>
    </button>
  );
};

BtnPropuestas.propTypes = {
  className: PropTypes.string,
  divClassName: PropTypes.string,
  text: PropTypes.string.isRequired, // Hacemos 'text' requerido
  onClick: PropTypes.func,
  active: PropTypes.bool,
};

// Valor por defecto si no se provee texto
BtnPropuestas.defaultProps = {
  text: "Necesidad",
};