import React from "react";
import * as classes from "./FilaUsuarioRow.module.css";
import { useUser } from "@/context/UserContext";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";

export const FilaUsuarioRow = ({ user, onView, onBan, onEdit }) => {
  const {userId: currentUserId} = useUser()
  return (
    <div className={classes.row}>
      <div className={classes.cellId}>{user.id}</div>
      <div className={classes.cellEmail}>{user.email}</div>
      <div className={classes.cellRol}>{(user.role_id == 1 ? "Usuario" : user.role_id == 2 ? "Moderador" : "Administrador")}</div>
      <div className={classes.cellAcciones}>
        {user.id != currentUserId && user.id != 1 ? 
          <BtnSecondary text="Editar Rol" size="sm" onClick={() => { console.log('Click on Edit Role', user); onEdit?.(user); }} />
          : <BtnSecondary disabled={true}text="Editar Rol" size="sm" onClick={() => { console.log('Click on Edit Role', user); onEdit?.(user); }} />
        }
        <BtnSecondary text="Ver" size="sm" onClick={() => onView?.(user)} />
        {user.id != currentUserId && user.id != 1 ? 
          <BtnDanger text="Banear" size="sm" onClick={() => onBan?.(user)} /> 
          : <BtnDanger disabled={true} text="Banear" size="sm" onClick={() => onBan?.(user)} /> 
        }
      </div>
    </div>
  );
};

export default FilaUsuarioRow;