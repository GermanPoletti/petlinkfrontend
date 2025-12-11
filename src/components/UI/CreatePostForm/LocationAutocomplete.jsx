import React, { useEffect, useRef, useState } from "react";
import * as classes from "./LocationAutocomplete.module.css";

export default function LocationAutocomplete({ label = "Ubicación", placeholder, value, onChange, className }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const rootRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (open && rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    async function fetchSuggestions() {
      try {
        const response = await fetch(
        `https://apis.datos.gob.ar/georef/api/localidades?provincia=06&nombre=${encodeURIComponent(query)}&max=10`
      );
        const data = await response.json();
        if (data.localidades) {
          // Convertimos a formato "Localidad, Provincia"
          const formatted = data.localidades.map(
            (loc) => `${loc.nombre}, ${loc.provincia.nombre}`
          );
          setSuggestions(formatted);
        }
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    }

    fetchSuggestions();
  }, [query]);

  function isValidLocation(v) {
    const parts = (v || "").split(",").map((p) => p.trim()).filter(Boolean);
    return parts.length === 2; // Localidad, Provincia
  }

  function clear() {
    setQuery("");
    onChange?.("");
    setSuggestions([]);
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
            setOpen(true);
          }}
          placeholder={placeholder || "Localidad, Provincia"}
          className={classes.input}
        />
        {!!query && (
          <button type="button" className={classes.clear} onClick={clear} aria-label="Limpiar">
            ×
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className={classes.suggestions}>
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                setQuery(s);
                onChange?.(s);
                setOpen(false);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      <div className={classes.hints}>
        <button type="button" className={classes.hintBtn} onClick={() => setOpen((o) => !o)}>
          {open ? "Ocultar sugerencias" : "Mostrar sugerencias"}
        </button>
        <span className={classes.helper}>Formato: Localidad, Provincia</span>
      </div>
    </div>
  );
}
