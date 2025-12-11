import React, { useEffect, useState } from "react";
import BackOfficeTemplate from "@/components/UI/BackOfficeTemplate";
import * as classes from "./Reportes.module.css";
import FilaReporte from "@/components/UI/BackOfficeComponents/FilaReporte";
import FilaReporteRow from "@/components/UI/BackOfficeComponents/FilaReporte/FilaReporteRow";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";
import { useReportsApi } from "@/hooks/useReportsApi";
import { useToast } from "@/components/UI/Toast";
import { useUsersApi } from "@/hooks/useUsersApi"
import { usePostsApi } from "@/hooks/usePostsApi"


export default function BackOfficeReportes() {
  const { showToast } = useToast();
  const { useListReports, approveReport, dismissReport } = useReportsApi();
  const { useGetUserById } = useUsersApi();
  const { useGetPostById } = usePostsApi();

  const { 
    data: reports = [], 
    isLoading, 
    error 
  } = useListReports();

  const useHandleFetchReportdata = (userId, postId) => {
    const {
      data: reportingUserData,
      isLoading: userDataIsLoading,
      error: userError,
    } = useGetUserById(userId)
    
    const {
        data: reportingPostData,
        isLoading: postDataIsLoading,
        error: postError,
    } = useGetPostById(postId)

    return {reportingUserData, userDataIsLoading, userError, reportingPostData, postDataIsLoading, postError}
  }

  





  
  /*
  data:
  post_id
  reporting_user_id




  */


  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Búsqueda por ID (igual que antes, pero con datos reales)
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? reports
        .filter((r) => r.id?.toString().toLowerCase().includes(normalized))
        .sort((a, b) => {
          const ia = a.id?.toString().toLowerCase() || "";
          const ib = b.id?.toString().toLowerCase() || "";
          const score = (x) => (x === normalized ? 3 : x.startsWith(normalized) ? 2 : 1);
          return score(ib) - score(ia);
        })
    : reports;

  const onResolve = (report) => {
    setSelected(report);
    setModalOpen(true);
  };

  const onDiscard = (report) => {
    if (!report?.id) return;
    dismissReport.mutate(report.id, {
      onSuccess: () => {
        showToast(`Reporte ${report.id} descartado`, { type: "success" });
      },
      onError: () => {
        showToast("Error al descartar reporte", { type: "error" });
      }
    });
  };

  const confirmResolve = () => {
    if (!selected?.id) return;
    approveReport.mutate(selected.id, {
      onSuccess: () => {
        showToast(`Reporte ${selected.id} resuelto y post oculto`, { type: "success" });
        setModalOpen(false);
        setSelected(null);
      },
      onError: () => {
        showToast("Error al resolver reporte", { type: "error" });
        setModalOpen(false);
        setSelected(null);
      }
    });
  };

  // Loading y error
  if (isLoading) return <BackOfficeTemplate><div className={classes.loading}>Cargando reportes...</div></BackOfficeTemplate>;
  if (error) return <BackOfficeTemplate><div className={classes.error}>Error al cargar reportes</div></BackOfficeTemplate>;

  return (
    <BackOfficeTemplate>
      <main className={classes.page}>
        <div className={classes.searchRow}>
          <input
            className={classes.searchInput}
            type="search"
            placeholder="Buscar por ID de reporte..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar reporte por ID"
          />
        </div>

        <h2 className={classes.title}>Reportes ({reports.length})</h2>

        <div className={classes.table}>
          <FilaReporte />
          <div className={classes.rows}>
            {filtered.length === 0 ? (
              <div className={classes.noResults}>
                {normalized ? "No se encontraron reportes" : "No hay reportes pendientes"}
              </div>
            ) : (
              filtered.map((report) => (
                <FilaReporteRow
                  handleFetchReportdata = {useHandleFetchReportdata}
                  key={report.id}
                  report={report}
                  onResolve={() => onResolve(report)}
                  onDiscard={() => onDiscard(report)}
                />
              ))
            )}
          </div>
        </div>

        {modalOpen && selected && (
          <div className={classes.modalOverlay} onClick={() => setModalOpen(false)}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <h3 className={classes.modalTitle}>Confirmar resolución</h3>
              <div className={classes.modalBody}>
                <div className={classes.modalRow}><span className={classes.modalLabel}>ID:</span> {selected.id}</div>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>
                    Post ID:
                  </span> {selected.postId || selected.post?.id}
                </div>
                <div className={classes.modalRow}><span className={classes.modalLabel}>Título:</span> {selected.postTitle || selected.post?.title || "Sin título"}</div>
                <div className={classes.modalRow}><span className={classes.modalLabel}>Reportado por:</span> {selected.reporterEmail || selected.reporter?.email}</div>
                <div className={classes.modalRow}><span className={classes.modalLabel}>Motivo:</span> {selected.reason}</div>
              </div>
              <div className={classes.modalActions}>
                <BtnSecondary text="Cancelar" size="sm" onClick={() => setModalOpen(false)} />
                <BtnDanger text="Resolver y ocultar post" size="sm" onClick={confirmResolve} />
              </div>
            </div>
          </div>
        )}
      </main>
    </BackOfficeTemplate>
  );
}