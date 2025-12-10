import React, { useEffect } from "react";
import * as classes from "./FilaReporteRow.module.css";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";

export const FilaReporteRow = ({ report, onResolve, onDiscard, handleFetchReportdata }) => {
  
  const {
    reportingUserData,
    userDataIsLoading,
    userError,
    reportingPostData, 
    postDataIsLoading, 
    postError
  } = handleFetchReportdata(report.reporting_user_id, report.post_id)
  useEffect(() => console.log(reportingPostData), [reportingPostData])
  
  
  return (
    <div className={classes.row}>
      <div className={classes.cellId}>{report.id}</div>
      <div className={classes.cellPost}>{postDataIsLoading ? "cargando" : reportingPostData.title}</div>
      <div className={classes.cellReporter}>{ userDataIsLoading ? "cargando" : (reportingUserData.user_data?.username || reportingUserData.email)}</div>
      <div className={classes.cellMotivo}>{report.reason}</div>
      <div className={classes.cellAcciones}>
        <BtnSecondary text="Resolver" size="sm" onClick={() => onResolve?.(report)} />
        <BtnDanger text="Descartar" size="sm" onClick={() => onDiscard?.(report)} />
      </div>
    </div>
  );
};

export default FilaReporteRow;