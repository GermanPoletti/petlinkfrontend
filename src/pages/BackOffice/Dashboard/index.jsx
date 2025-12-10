import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import api from "@/services/api";
import BackOfficeTemplate from "@/components/UI/BackOfficeTemplate";
import { CardsMetricas } from "@/components/UI/CardsMetricas";
import { BtnSecondary } from "@/components/UI/Buttons";
import * as classes from "./Dashboard.module.css";
import RegisteredUsersChart from "@/components/UI/BackOfficeComponents/RegisteredUsersChart";
import { useToast } from "@/components/UI/Toast";

export default function BackOfficeDashboard() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  // Estados del formulario (edición en los inputs)
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formAggregation, setFormAggregation] = useState("day"); // "day" | "week" | "month"

  // Estados aplicados (los que consume el gráfico)
  const [appliedStartDate, setAppliedStartDate] = useState("");
  const [appliedEndDate, setAppliedEndDate] = useState("");
  const [appliedAggregation, setAppliedAggregation] = useState("day");

  // Preseleccionar últimos 7 días
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    const endStr = end.toISOString().slice(0, 10);
    const startStr = start.toISOString().slice(0, 10);
    // Inicializar formulario y valores aplicados iguales
    setFormEndDate(endStr);
    setFormStartDate(startStr);
    setAppliedEndDate(endStr);
    setAppliedStartDate(startStr);
    setAppliedAggregation("day");
  }, []);

  const validateRange = () => {
    if (!formStartDate || !formEndDate) {
      showToast("Selecciona fecha de inicio y fin", { type: "error" });
      return false;
    }
    const start = new Date(formStartDate);
    const end = new Date(formEndDate);
    const today = new Date(todayStr);
    if (start > end) {
      showToast("Rango inválido: inicio posterior al fin", { type: "error" });
      return false;
    }
    if (start > today || end > today) {
      showToast("No se permiten fechas futuras", { type: "error" });
      return false;
    }
    return true;
  };

  const onOpenChart = () => {
    setModalOpen(true);
  };

  const onCloseChart = () => setModalOpen(false);

  return (
    <BackOfficeTemplate>
      <main className={classes.page}>
        <h2 className={classes.title}>Dashboard</h2>
        <div className={classes.cardsGrid}>
          <CardsMetricas title="Usuarios" value={542} />
          <CardsMetricas title="Publicaciones" value={12345} />
          <CardsMetricas title="Reportes" value={15} />
        </div>

        <div className={classes.actionsRow}>
          <BtnSecondary text="Usuarios registrados por día" onClick={onOpenChart} />
        </div>

        {modalOpen && (
          <div className={classes.modalOverlay} onClick={onCloseChart}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <button className={classes.modalClose} onClick={onCloseChart} aria-label="Cerrar modal">✕</button>
              <h3 className={classes.modalTitle}>Usuarios registrados</h3>

              <div className={classes.filtersRow}>
              <label className={classes.filterItem}>
                <span className={classes.filterLabel}>Inicio</span>
                <input
                  type="date"
                  max={todayStr}
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                />
              </label>
              <label className={classes.filterItem}>
                <span className={classes.filterLabel}>Fin</span>
                <input
                  type="date"
                  max={todayStr}
                  value={formEndDate}
                  onChange={(e) => setFormEndDate(e.target.value)}
                />
              </label>
              <label className={classes.filterItem}>
                <span className={classes.filterLabel}>Agregación</span>
                <select value={formAggregation} onChange={(e) => setFormAggregation(e.target.value)}>
                  <option value="day">Por día</option>
                  <option value="week">Por semana</option>
                  <option value="month">Por mes</option>
                </select>
              </label>
              <div className={classes.filterActions}>
                <BtnSecondary
                  text="Actualizar"
                  size="sm"
                  onClick={() => {
                    if (!validateRange()) return;
                      // Aplicar los filtros al gráfico solo si pasa validación
                      setAppliedStartDate(formStartDate);
                      setAppliedEndDate(formEndDate);
                      setAppliedAggregation(formAggregation);
                  }}
                />
                <BtnSecondary
                  text="Descargar información"
                  size="sm"
                  onClick={async () => {
                    try {
                      if (!validateRange()) return;
                      // Llamar al backend para obtener usuarios en el rango
                      const res = await api.get("/admin/registered-users", {
                        params: { startDate: formStartDate, endDate: formEndDate },
                      });
                      const data = res?.data;
                      const users = Array.isArray(data) ? data : data?.users || [];
                      if (!users.length) {
                        showToast("No hay usuarios en el rango seleccionado", { type: "info" });
                        return;
                      }

                      // Agrupar totales por día
                      const countsByDay = new Map();
                      users.forEach((u) => {
                        const d = new Date(u.registeredAt);
                        const day = d.toISOString().slice(0, 10);
                        countsByDay.set(day, (countsByDay.get(day) || 0) + 1);
                      });

                      // Asegurar días faltantes con 0 dentro del rango
                      const start = new Date(formStartDate);
                      const end = new Date(formEndDate);
                      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                        const key = new Date(d).toISOString().slice(0, 10);
                        if (!countsByDay.has(key)) countsByDay.set(key, 0);
                      }

                      // Construir hoja Totales por día
                      const totalsRows = Array.from(countsByDay.entries())
                        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
                        .map(([fecha, total]) => ({ Fecha: fecha, "Total usuarios": total }));
                      const wsTotals = XLSX.utils.json_to_sheet(totalsRows);

                      // Construir hoja Usuarios (email + fecha)
                      const usersRows = users.map((u) => ({
                        Email: u.email,
                        "Fecha registro": new Date(u.registeredAt).toISOString().slice(0, 10),
                      }));
                      const wsUsers = XLSX.utils.json_to_sheet(usersRows);

                      // Crear workbook y guardar
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, wsTotals, "TotalesPorDia");
                      XLSX.utils.book_append_sheet(wb, wsUsers, "Usuarios");
                      const filename = `usuarios_registrados_${formStartDate}_a_${formEndDate}.xlsx`;
                      XLSX.writeFile(wb, filename);
                      showToast("Descarga generada", { type: "success" });
                    } catch (err) {
                      console.error(err);
                      const msg = err?.response?.data?.message || "Error al descargar información";
                      showToast(msg, { type: "error" });
                    }
                  }}
                />
              </div>
            </div>

              <RegisteredUsersChart startDate={appliedStartDate} endDate={appliedEndDate} aggregation={appliedAggregation} />
          </div>
        </div>
      )}
      </main>
    </BackOfficeTemplate>
  );
}
