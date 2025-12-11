import React from 'react';
import styles from './BtnSecondary.module.css';

export function BtnSecondary({ className = '', divClassName, text, onClick, size = 'md' }) {
  const sizeClass = size === 'sm' ? styles.sm : '';
  const labelClass = divClassName || (size === 'sm' ? styles.labelSm : styles.label);
  return (
    <button type='button' className={`${styles.btnSecondary} ${sizeClass} ${className}`} onClick={onClick}>
      <span className={labelClass}>{text}</span>
    </button>
  );
}