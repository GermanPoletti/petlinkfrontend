import React, { useEffect, useMemo, useRef, useState } from "react";
import * as classes from "./LocationAutocomplete.module.css";

// Autocomplete básico de ubicación.
// Validación: "país, estado/provincia, ciudad" (3 partes separadas por coma).
// Nota: Para producción, integrar API como Mapbox Places, Google Places o Nominatim.
export default function LocationAutocomplete({ label = "Ubicación", placeholder, value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (open && rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  function isValidLocation(v) {
    const parts = (v || "").split(",").map((p) => p.trim()).filter(Boolean);
    return parts.length === 3; // país, estado/provincia, ciudad
  }

  function clear() {
    setQuery("");
    onChange?.("");
  }

  return (
    <div className={`${classes.root} ${className || ""}`} ref={rootRef}>
      <label className={classes.label}>
        {label} <span className={classes.required}>*</span>
      </label>
      <div className={`${classes.inputRow} ${isValidLocation(query) ? classes.valid : classes.invalid}`}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange?.(e.target.value);
          }}
          placeholder={placeholder || "País, Provincia, Ciudad"}
          className={classes.input}
        />
        {!!query && (
          <button type="button" className={classes.clear} onClick={clear} aria-label="Limpiar">
            ×
          </button>
        )}
      </div>
      <div className={classes.hints}>
        <button type="button" className={classes.hintBtn} onClick={() => setOpen((o) => !o)}>
          {open ? "Ocultar sugerencias" : "Mostrar sugerencias"}
        </button>
        <span className={classes.helper}>Formato: País, Estado/Provincia, Ciudad</span>
      </div>
    </div>
  );
}