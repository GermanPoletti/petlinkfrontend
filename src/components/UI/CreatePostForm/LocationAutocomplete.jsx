import React, { useEffect, useMemo, useRef, useState } from "react";
import * as classes from "./LocationAutocomplete.module.css";

// Autocomplete básico de ubicación.
// Validación: "país, estado/provincia, ciudad" (3 partes separadas por coma).
// Nota: Para producción, integrar API como Mapbox Places, Google Places o Nominatim.
export default function LocationAutocomplete({ label = "Ubicación", placeholder, value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const rootRef = useRef(null);

  const suggestions = useMemo(() => {
    // Sugerencias mock locales. Reemplazar por API.
    const base = [
      "Argentina, Buenos Aires, Zárate",
      "Argentina, Buenos Aires, Campana",
      "Argentina, Buenos Aires, Baradero",
      "Argentina, Buenos Aires, Alsina",
      "Argentina, Córdoba, Córdoba",
      "Argentina, Santa Fe, Rosario",
    ];
    if (!query) return base.slice(0, 4);
    const q = query.toLowerCase();
    return base.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

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
          onChange={(e) => { setQuery(e.target.value); onChange?.(e.target.value); }}
          placeholder={placeholder}
          className={classes.input}
        />
        {!!query && (
          <button type="button" className={classes.clear} onClick={clear} aria-label="Limpiar">×</button>
        )}
      </div>
      {open && (
        <div className={classes.menu}>
          {suggestions.map((s) => (
            <button key={s} className={classes.option} onClick={() => { setQuery(s); onChange?.(s); setOpen(false); }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className={classes.hints}>
        <button type="button" className={classes.hintBtn} onClick={() => setOpen((o) => !o)}>
          {open ? "Ocultar sugerencias" : "Mostrar sugerencias"}
        </button>
        <span className={classes.helper}>Formato: País, Estado/Provincia, Ciudad</span>
      </div>
    </div>
  );
}