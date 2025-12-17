import React from 'react';
import styles from './BtnSecondary.module.css';

export function BtnSecondary({ disabled = false, className = '', divClassName, text, onClick, size = 'md' }) {
  const sizeClass = size === 'sm' ? styles.sm : '';
  const labelClass = divClassName || (size === 'sm' ? styles.labelSm : styles.label);
  return (
    <button disabled={disabled} type='button' className={`${styles.btnSecondary} ${sizeClass} ${className}`} onClick={onClick} title={disabled ? "No tienes permisos suficientes" : null}>
      <span className={labelClass}>{text}</span>
    </button>
  );
}