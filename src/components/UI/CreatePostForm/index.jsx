import React, { useEffect, useMemo, useRef, useState } from "react";
import * as classes from "./CreatePostForm.module.css";
import { BtnPrimary, BtnSecondary } from "@/components/UI/Buttons";
import CategoryDropdown from "@/components/UI/Dropdown/CategoryDropdown";
import LocationAutocomplete from "@/components/UI/CreatePostForm/LocationAutocomplete";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/UI/Toast";
import { usePostsApi } from "@/hooks/usePostsApi";

export default function CreatePostForm({ type = "oferta", mode = "create", initialData = {} }) {

  const navigate = useNavigate();
  const { showToast } = useToast?.() || { showToast: () => {} };
  const { createPost, patchPost } = usePostsApi();

  const [title, setTitle] = useState(initialData.title || "");
  const [category, setCategory] = useState(initialData.category || null);
  const [location, setLocation] = useState(initialData.location || "");
  const [message, setMessage] = useState(initialData.description || "");
  const [file, setFile] = useState(initialData.image_url);
  const [preview, setPreview] = useState(null);

  const maxTitle = 30;
  const fileInputRef = useRef(null);

  const categories = useMemo(
    () => ["Adopción", "Tránsito", "Alimentos/Donación", "Veterinaria", "Pérdidas/Encontrados"],
    []
  );

  const valid = useMemo(() => {
    const hasTitle = title.trim().length > 0 && title.trim().length <= maxTitle;
    const hasCategory = !!category;
    const hasMessage = message.trim().length > 0;
    return hasTitle && hasCategory && hasMessage;
  }, [title, category, message]);

  function onAttachClick() {
    fileInputRef.current?.click();
  }

  const MAX_SIZE_MB = 5;

  function onFileSelected(e) {
    const f = e.target.files?.[0];

    if (!f) return;

    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast?.(`El archivo supera ${MAX_SIZE_MB}MB`, { type: "warning" });
      return;
    }

    setFile(f);
  }

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview({ file, url });

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function removeFile() {
    setFile(null);
  }

  function onSubmit() {
    if (!valid) {
      showToast?.("Completa los campos obligatorios", { type: "error" });
      return;
    }

    const postData = {
      title: title.trim(),
      message: message.trim(),
      category,
      city_name: location.split(",")[0]?.trim(),
      post_type_id: type === "oferta" ? 1 : 2,
    };

    const formData = new FormData();
    formData.append("post_data", JSON.stringify(postData));

    if (file) {
      formData.append("file", file);
    }
    if(mode == "edit"){
      const post_id = initialData?.id
      
      patchPost.mutate({post_id, data: formData}, {
        onSuccess: () => {
          showToast?.("Publicación modificada", { type: "success" });
          const route = "/mis-publicaciones";
          navigate(route, { replace: true });
        },
        onError: () => {
          showToast?.("Error al crear publicación", { type: "error" });
        },
      });
    }else{
      createPost.mutate(formData, {
        onSuccess: () => {
          showToast?.("Publicación creada", { type: "success" });
          const route = type === "necesidad" ? "/propuestas" : "/ofertas";
          navigate(route, { replace: true });
        },
        onError: () => {
          showToast?.("Error al crear publicación", { type: "error" });
        },
      });

    }
  }

  return (
    <form className={classes.form} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>

      <h1 className={classes.titleHeading}>
        {mode === "edit" ? "Modificar publicación" : `Publicar ${type}`}
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

      {/* Adjuntar archivo */}
      <div className={classes.attachRow}>
        <BtnSecondary text="Adjuntar Archivo" onClick={onAttachClick} size="sm" />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelected}
          className={classes.hiddenInput}
        />
        {file && <span className={classes.attachInfo}>1 archivo (máx {MAX_SIZE_MB}MB)</span>}
      </div>

      {preview && (
        <div className={classes.previewGrid}>
          <div className={classes.previewItem}>
            <img src={preview.url} alt="archivo" className={classes.previewThumb} />
            <button type="button" className={classes.removeBtn} onClick={removeFile}>✕</button>
          </div>
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
          placeholder="Describe tu oferta o necesidad"
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
          disabled={createPost.isPending || patchPost.isPending}
        />
        {createPost.isPending || patchPost.isPending && <span className={classes.loading}>{mode === "edit" ? "Guardando cambios..." : "Publicando..."}</span>}
      </div>

    </form>
  );
}
