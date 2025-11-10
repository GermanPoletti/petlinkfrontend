import PropTypes from "prop-types";
import React from "react";
import * as classes from "./BtnBack.module.css";
import backIcon from "@/assets/images/icons/backarrow.png";

export const BtnBack = ({ className, onClick, alt = "Volver" }) => {
  return (
    <button
      className={`${classes.btnBack} ${className || ""}`}
      onClick={onClick}
      aria-label={alt}
      type="button"
    >
      <img src={backIcon} alt={alt} className={classes.icon} />
    </button>
  );
};

BtnBack.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  alt: PropTypes.string,
};

export default BtnBack;