import React, { useEffect, useMemo, useState } from "react";
import BackOfficeTemplate from "@/components/UI/BackOfficeTemplate";
import { CardsMetricas } from "@/components/UI/CardsMetricas";
import { BtnSecondary } from "@/components/UI/Buttons";
import * as classes from "./Dashboard.module.css";
import RegisteredUsersChart from "@/components/UI/BackOfficeComponents/RegisteredUsersChart";
import { useToast } from "@/components/UI/Toast";
import { useUsersApi } from "@/hooks/useUsersApi";
import { usePostsApi } from "@/hooks/usePostsApi";
import { useReportsApi } from "@/hooks/useReportsApi";

export default function BackOfficeDashboard() {
  const { showToast } = useToast();
  
  const { downloadUsersExcel } = useUsersApi();

  
  const [loading, setLoading] = useState(false);
  // Contadores
  const { useGetUsersCount } = useUsersApi();
  const { useGetPostCount } = usePostsApi();
  const { useGetReportsCount } = useReportsApi();
  const { exportUsersToExcel } = useUsersApi(); 

  const { data: usersCountData, isLoading: loadingUsersCount } = useGetUsersCount();
  const { data: postsCountData, isLoading: loadingPosts } = useGetPostCount();
  const { data: reportsCount, isLoading: loadingReportCount } = useGetReportsCount();

  // Modal y fechas
  const [modalOpen, setModalOpen] = useState(false);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formAggregation, setFormAggregation] = useState("day");

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

    setFormStartDate(startStr);
    setFormEndDate(endStr);
    setAppliedStartDate(startStr);
    setAppliedEndDate(endStr);
  }, []);

  const validateRange = () => {
    if (!formStartDate || !formEndDate) {
      showToast("Selecciona ambas fechas", { type: "error" });
      return false;
    }
    if (formEndDate < formStartDate) {
      showToast("La fecha final debe ser mayor", { type: "error" });
      return false;
    }
    return true;
  };

  const handleDownload = async () => {
    if (!formStartDate || !formEndDate) {
      showToast("Faltan fechas", { type: "error" });
      return;
    }
    if (formEndDate < formStartDate) {
      showToast("La fecha final debe ser posterior", { type: "error" });
      return;
    }

    setLoading(true);
    try {
      await downloadUsersExcel(formStartDate, formEndDate);
      showToast("Excel descargado correctamente", { type: "success" });
    } catch (err) {
      showToast("Error al descargar el archivo", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackOfficeTemplate>
      <main className={classes.page}>
        <h2 className={classes.title}>Dashboard</h2>

        <div className={classes.cardsGrid}>
          <CardsMetricas 
            title="Usuarios" 
            value={loadingUsersCount ? "..." : (usersCountData || 0)} 
            loading={loadingUsersCount}
          />
          <CardsMetricas 
            title="Publicaciones" 
            value={loadingPosts ? "Cargando..." : (postsCountData || 0)} 
          />
          <CardsMetricas 
            title="Reportes" 
            value={loadingReportCount ? "Cargando..." : (reportsCount || 0)} 
          />
        </div>

        <div className={classes.actionsRow}>
          <BtnSecondary text="Usuarios registrados por día" onClick={() => setModalOpen(true)} />
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className={classes.modalOverlay} onClick={() => setModalOpen(false)}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
              <button className={classes.modalClose} onClick={() => setModalOpen(false)}>×</button>
              
              <h3 className={classes.modalTitle}>Usuarios registrados</h3>

              <div className={classes.filtersRow}>
                <label className={classes.filterItem}>
                  <span>Inicio</span>
                  <input 
                    type="date" 
                    max={todayStr} 
                    value={formStartDate} 
                    onChange={(e) => setFormStartDate(e.target.value)} 
                  />
                </label>
                <label className={classes.filterItem}>
                  <span>Fin</span>
                  <input 
                    type="date" 
                    max={todayStr} 
                    value={formEndDate} 
                    onChange={(e) => setFormEndDate(e.target.value)} 
                  />
                </label>
                <label className={classes.filterItem}>
                  <span>Agregación</span>
                  <select value={formAggregation} onChange={(e) => setFormAggregation(e.target.value)}>
                    <option value="day">Por día</option>
                    <option value="week">Por semana</option>
                    <option value="month">Por mes</option>
                  </select>
                </label>

                <div className={classes.filterActions}>
                  <BtnSecondary
                    text="Actualizar gráfico"
                    size="sm"
                    onClick={() => {
                      if (!validateRange()) return;
                      setAppliedStartDate(formStartDate);
                      setAppliedEndDate(formEndDate);
                      setAppliedAggregation(formAggregation);
                    }}
                  />
                  <BtnSecondary
                    text={exportUsersToExcel.isPending ? "Descargando..." : "Descargar información"}
                    size="sm"
                    onClick={handleDownload}
                    disabled={exportUsersToExcel.isPending}
                  />
                </div>
              </div>

              <RegisteredUsersChart 
                startDate={appliedStartDate} 
                endDate={appliedEndDate} 
                aggregation={appliedAggregation} 
              />
            </div>
          </div>
        )}
      </main>
    </BackOfficeTemplate>
  );
}