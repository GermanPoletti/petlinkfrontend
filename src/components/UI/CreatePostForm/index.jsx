import React, { useMemo, useRef, useState } from "react";
import * as classes from "./CreatePostForm.module.css";
import { BtnPrimary } from "@/components/UI/Buttons";
import { BtnSecondary } from "@/components/UI/Buttons";
import CategoryDropdown from "@/components/UI/Dropdown/CategoryDropdown";
import LocationAutocomplete from "@/components/UI/CreatePostForm/LocationAutocomplete";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/UI/Toast";

export default function CreatePostForm({ type = "oferta" }) {
  const navigate = useNavigate();
  const { showToast } = useToast?.() || { showToast: () => {} };

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const maxTitle = 30;
  const fileInputRef = useRef(null);

  const categories = useMemo(() => [
    "Adopción",
    "Tránsito",
    "Alimentos/Donación",
    "Veterinaria",
    "Pérdidas/Encontrados",
  ], []);

  const valid = useMemo(() => {
    const hasTitle = title.trim().length > 0 && title.trim().length <= maxTitle;
    const hasCategory = !!category;
    const hasLocation = validateLocation(location);
    const hasMessage = message.trim().length > 0;
    return hasTitle && hasCategory && hasLocation && hasMessage;
  }, [title, category, location, message]);

  function validateLocation(value) {
    const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
    return parts.length === 3; // país, estado/provincia, ciudad
  }

  function onAttachClick() {
    fileInputRef.current?.click();
  }

  function onFilesSelected(e) {
    const sel = Array.from(e.target.files || []);
    setFiles(sel);
  }

  function onSubmit() {
    if (!valid) {
      showToast?.("Completa los campos obligatorios", { type: "error" });
      return;
    }
    const confirm = window.confirm("¿Deseas publicar esta " + (type === "propuesta" ? "propuesta" : "oferta") + "?");
    if (!confirm) return;
    // TODO: Enviar al backend. Por ahora redirigimos a Mis Publicaciones
    showToast?.("Publicación creada", { type: "success" });
    navigate("/mis-publicaciones");
  }

  return (
    <form className={classes.form} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {/* Encabezado dinámico */}
      <h1 className={classes.titleHeading}>
        {type === "propuesta" ? "Publicar propuesta" : "Publicar oferta"}
      </h1>

      {/* Título */}
      <div className={classes.fieldGroup}>
        <label className={classes.label}>
          Título <span className={classes.required}>*</span>
        </label>
        <div className={classes.inputWithCounter}>
          <input
            type="text"
            className={classes.input}
            placeholder="Escribe un título"
            value={title}
            maxLength={maxTitle}
            onChange={(e) => setTitle(e.target.value)}
            aria-required
          />
          <span className={classes.counter}>{title.length}/{maxTitle}</span>
        </div>
      </div>

      {/* Categoría */}
      <CategoryDropdown
        label="Categoría"
        items={categories}
        value={category}
        onChange={setCategory}
        className={classes.dropdown}
      />

      {/* Ubicación */}
      <LocationAutocomplete
        label="Ubicación"
        placeholder="País, Estado/Provincia, Ciudad"
        value={location}
        onChange={setLocation}
        className={classes.location}
      />

      {/* Adjuntar archivos */}
      <div className={classes.attachRow}>
        <BtnSecondary text="Adjuntar Archivos" onClick={onAttachClick} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={onFilesSelected}
          className={classes.hiddenInput}
        />
        {files.length > 0 && (
          <span className={classes.attachInfo}>{files.length} archivo(s) seleccionado(s)</span>
        )}
      </div>

      {/* Mensaje */}
      <div className={classes.fieldGroup}>
        <label className={classes.label}>
          Mensaje <span className={classes.required}>*</span>
        </label>
        <textarea
          className={classes.textarea}
          rows={6}
          placeholder="Describe tu oferta o propuesta"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-required
        />
      </div>

      {/* Publicar */}
      <div className={classes.actions}>
        <BtnPrimary text="Publicar" onClick={onSubmit} />
      </div>
    </form>
  );
}