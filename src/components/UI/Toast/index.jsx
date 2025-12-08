import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import * as classes from "./Toast.module.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // AQUÍ ESTÁ LA CLAVE: useCallback
  const showToast = useCallback((message, { type = "info", duration = 3000 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []); // ← dependencias vacías → NUNCA cambia

  // Ahora el objeto también está memoizado y depende de showToast estable
  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={classes.toastContainer} aria-live="polite" aria-atomic>
        {toasts.map((t) => (
          <div key={t.id} className={`${classes.toast} ${classes[t.type] || ""}`} role="status">
            <span className={classes.message}>{t.message}</span>
            <button className={classes.closeBtn} onClick={() => removeToast(t.id)} aria-label="Cerrar">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}