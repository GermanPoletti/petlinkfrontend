import React, { useEffect, useMemo, useRef, useState } from "react";
import * as classes from "./CreatePostForm.module.css";
import { BtnPrimary } from "@/components/UI/Buttons";
import { BtnSecondary } from "@/components/UI/Buttons";
import CategoryDropdown from "@/components/UI/Dropdown/CategoryDropdown";
import LocationAutocomplete from "@/components/UI/CreatePostForm/LocationAutocomplete";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/UI/Toast";
import { usePostsApi } from "@/hooks/usePostsApi";

export default function CreatePostForm({ type = "oferta", mode = "create", initialData = {} }) {
  const navigate = useNavigate();
  const { showToast } = useToast?.() || { showToast: () => {} };
  const { createPost } = usePostsApi();

  const [title, setTitle] = useState(initialData.title || "");
  const [category, setCategory] = useState(initialData.category || null);
  const [location, setLocation] = useState(initialData.location || "");
  const [message, setMessage] = useState(initialData.description || "");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

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
    const hasLocation = validateLocation(location) || true;
    const hasMessage = message.trim().length > 0;
    console.log(hasTitle, hasCategory,hasLocation,hasMessage);
    
    return hasTitle && hasCategory && hasLocation && hasMessage;
  }, [title, category, location, message]);

  function validateLocation(value) {
    const parts = value.split(",").map((p) => p.trim()).filter(Boolean);
    return parts.length === 3; // país, estado/provincia, ciudad
  }

  function onAttachClick() {
    fileInputRef.current?.click();
  }

  const MAX_FILES = 6;
  const MAX_SIZE_MB = 5; // por archivo

  function onFilesSelected(e) {
    const incoming = Array.from(e.target.files || []);
    const merged = [...files, ...incoming];
    const filtered = merged.filter((f) => f.size <= MAX_SIZE_MB * 1024 * 1024).slice(0, MAX_FILES);
    if (incoming.length !== filtered.length - files.length) {
      showToast?.(`Algunos archivos superan ${MAX_SIZE_MB}MB y fueron omitidos`, { type: "warning" });
    }
    if (merged.length > MAX_FILES) {
      showToast?.(`Máximo ${MAX_FILES} archivos permitidos`, { type: "warning" });
    }
    setFiles(filtered);
  }

  useEffect(() => {
    const urls = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews(urls);
    return () => { urls.forEach((u) => URL.revokeObjectURL(u.url)); };
  }, [files]);

  function removeFile(idx) {
    const next = files.slice();
    next.splice(idx, 1);
    setFiles(next);
  }

  function onSubmit() {
  if (!valid) {
    showToast?.("Completa los campos obligatorios", { type: "error" });
    return;
  }

  const parts = location.split(",").map(p => p.trim());
  // if (parts.length !== 3) {
  //   showToast?.("Ubicación inválida", { type: "error" });
  //   return;
  // }

  const [city_id, province, city] = parts;

  const postData = {
    title: title.trim(),
    message: message.trim(),
    category,
    city_id,
    province,
    city,
    post_type_id: type === "oferta" ? 1 : type === "necesidad" ? 2 : null, // "oferta" o "propuesta"
  };

  createPost.mutate(postData, {
    onSuccess: async (newPost) => {
      showToast?.("Publicación creada", { type: "success" });

      // // Si hay archivos → subirlos después
      // if (files.length > 0) {
      //   try {
      //     await uploadMedia.mutateAsync({
      //       postId: newPost.id,
      //       files,
      //     });
      //     showToast?.("Imágenes subidas", { type: "success" });
      //   } catch (err) {
      //     showToast?.("Post creado pero error al subir imágenes", { type: "warning" });
      //   }
      // }

      // Navegar al feed o al detalle
      const route = type === "propuesta" ? "/propuestas" : "/ofertas";
      navigate(route, { replace: true });
    },
    onError: (err) => {
      showToast?.("Error al crear publicación", { type: "error" });
    },
  });
}

  return (
    <form className={classes.form} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {/* Encabezado dinámico */}
      <h1 className={classes.titleHeading}>
        {mode === "edit" ? "Modificar publicación" : (type === "propuesta" ? "Publicar propuesta" : "Publicar oferta")}
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
        <BtnSecondary text="Adjuntar Archivos" onClick={onAttachClick} size="sm" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={onFilesSelected}
          className={classes.hiddenInput}
        />
        {files.length > 0 && (
          <span className={classes.attachInfo}>{files.length} archivo(s) (máx {MAX_FILES}, {MAX_SIZE_MB}MB c/u)</span>
        )}
      </div>

      {previews.length > 0 && (
        <div className={classes.previewGrid}>
          {previews.map((p, idx) => (
            <div key={idx} className={classes.previewItem}>
              {p.file.type.startsWith("image/") ? (
                <img src={p.url} alt={`archivo ${idx+1}`} className={classes.previewThumb} />
              ) : (
                <video src={p.url} className={classes.previewThumb} muted />
              )}
              <button type="button" className={classes.removeBtn} onClick={() => removeFile(idx)}>✕</button>
            </div>
          ))}
        </div>
      )}

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
        <BtnPrimary 
          text={mode === "edit" ? "Guardar cambios" : "Publicar"} 
          type="submit"  
          size="sm" 
          disabled={createPost.isPending}
        />
        {createPost.isPending && <span className={classes.loading}>Publicando...</span>}
      </div>
    </form>
  );
}