import React from "react";
import * as classes from "./FilaModeradorRow.module.css";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";

export const FilaModeradorRow = ({ user, onEdit, onSuspend, onActivate }) => {

  
  const isModerator = user.role_id === 2;
  const isActive = user.status_id === 1;
  const isInactive = user.status_id === 2;

  return (
    <div className={classes.row}>
      <div className={classes.cellId}>{user.id}</div>
      <div className={classes.cellEmail}>{user.email}</div>
      <div className={classes.cellEstado}>{user.status}</div>
      <div className={classes.cellAcciones}>
        {isModerator && isActive && (
          <>
            <BtnSecondary text="Editar" size="sm" onClick={() => onEdit?.(user)} />
            <BtnDanger text="Suspender" size="sm" onClick={() => onSuspend?.(user)} />
          </>
        )}
        {isInactive && (
          <BtnSecondary text="Activar" size="sm" onClick={() => onActivate?.(user)} />
        )}
        {!isModerator && !isInactive && (
          <BtnSecondary text="Activar" size="sm" onClick={() => onActivate?.(user)} />
        )}
      </div>
    </div>
  );
};

export default FilaModeradorRow;