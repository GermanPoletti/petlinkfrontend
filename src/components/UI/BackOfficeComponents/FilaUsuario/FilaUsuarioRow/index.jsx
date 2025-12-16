import React from "react";
import * as classes from "./FilaUsuarioRow.module.css";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";

export const FilaUsuarioRow = ({ user, onView, onBan, onEdit }) => {
  return (
    <div className={classes.row}>
      <div className={classes.cellId}>{user.id}</div>
      <div className={classes.cellEmail}>{user.email}</div>
      <div className={classes.cellRol}>{(user.role_id == 1 ? "Usuario" : user.role_id == 2 ? "Moderador" : "Administrador")}</div>
      <div className={classes.cellAcciones}>
        <BtnSecondary text="Editar Rol" size="sm" onClick={() => { console.log('Click on Edit Role', user); onEdit?.(user); }} />
        <BtnSecondary text="Ver" size="sm" onClick={() => onView?.(user)} />
        <BtnDanger text="Banear" size="sm" onClick={() => onBan?.(user)} />
      </div>
    </div>
  );
};

export default FilaUsuarioRow;