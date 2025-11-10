import React, { useEffect, useMemo, useRef, useState } from "react";
import * as classes from "./CategoryDropdown.module.css";

// Dropdown genérico para selección de categorías (o cualquier lista).
// Props:
// - label: texto del label del control
// - items: array de strings o { label, value }
// - value: valor seleccionado
// - onChange: callback(value)
// - placeholder: texto cuando no hay selección
// - direction: 'down' | 'up' (default: 'down')
export default function CategoryDropdown({
  label = "Categoría",
  items = [],
  value = null,
  onChange,
  placeholder = "Selecciona",
  direction = "down",
  className,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const normalized = useMemo(() =>
    items.map((it) => (typeof it === "string" ? { label: it, value: it } : it)),
  [items]);

  const selected = useMemo(() => normalized.find((it) => it.value === value) || null, [normalized, value]);

  useEffect(() => {
    function onDocClick(e) {
      if (open && rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div className={`${classes.dropdown} ${className || ""}`} ref={rootRef}>
      <label className={classes.label}>
        {label} <span className={classes.required}>*</span>
      </label>
      <button className={classes.control} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span className={classes.value}>{selected ? selected.label : placeholder}</span>
        <span className={`${classes.chevron} ${open ? classes.chevronUp : classes.chevronDown}`}>▾</span>
      </button>
      {open && (
        <div className={`${classes.menu} ${direction === "up" ? classes.menuUp : classes.menuDown}`} role="listbox">
          {normalized.length === 0 && (
            <div className={classes.empty}>Sin opciones</div>
          )}
          {normalized.map((it) => (
            <button
              key={it.value}
              role="option"
              className={`${classes.option} ${selected && selected.value === it.value ? classes.selected : ""}`}
              onClick={() => { onChange?.(it.value); setOpen(false); }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}