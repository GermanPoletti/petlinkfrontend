import React, { useEffect, useState } from "react";
import BackOfficeTemplate from "@/components/UI/BackOfficeTemplate";
import * as classes from "./Moderadores.module.css";
import FilaModerador from "@/components/UI/BackOfficeComponents/FilaModerador";
import FilaModeradorRow from "@/components/UI/BackOfficeComponents/FilaModerador/FilaModeradorRow";
import { BtnSecondary, BtnDanger } from "@/components/UI/Buttons";
import {useUsersApi} from "@/hooks/useUsersApi"


export default function BackOfficeModeradores() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [editRole, setEditRole] = useState("user");
  const [editStatus, setEditStatus] = useState("inactivo");
  const {useGetMyRole } = useUsersApi()

 
  
  const {
    data: dataUsers,
    isLoading
  } = useGetMyRole("MODERATOR")


  


  useEffect(() => {
    try {
      const raw = localStorage.getItem("appUsers");
      const initial = raw ? JSON.parse(raw) : [
        { id: 1, name: "Emanuel", email: "emaordu1234@gmail.com", role: "admin" },
        { id: 2, name: "Ana Torres", email: "ana@petlink.app", role: "user" },
        { id: 3, name: "Carlos Díaz", email: "carlos@petlink.app", role: "moderator" },
      ];
      const withStatus = initial.map((u) => ({
        ...u,
        status: u.status || (u.role === "moderator" ? "activo" : "inactivo"),
      }));
      setUsers(withStatus);
      localStorage.setItem("appUsers", JSON.stringify(withStatus));
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "appUsers") {
        try {
          const next = e.newValue ? JSON.parse(e.newValue) : [];
          setUsers(next);
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? [...users]
        .filter((u) => u.email.toLowerCase().includes(normalized))
        .sort((a, b) => {
          const ea = a.email.toLowerCase();
          const eb = b.email.toLowerCase();
          const score = (x) => (x === normalized ? 3 : x.startsWith(normalized) ? 2 : 1);
          return score(eb) - score(ea);
        })
    : users;

  const persist = (next) => {
    setUsers(next);
    localStorage.setItem("appUsers", JSON.stringify(next));
  };

  const onEdit = (user) => {
    setSelected(user);
    setEditRole(user.role || "user");
    setEditStatus(user.status || "inactivo");
    setModalOpen(true);
  };

  const onSuspend = (user) => {
    const next = users.map((u) =>
      u.id === user.id ? { ...u, role: "user", status: "suspendido" } : u
    );
    persist(next);
  };

  const onActivate = (user) => {
    const next = users.map((u) =>
      u.id === user.id ? { ...u, role: "moderator", status: "activo" } : u
    );
    persist(next);
  };

  const saveEdit = () => {
    if (!selected) return;
    const next = users.map((u) =>
      u.id === selected.id ? { ...u, role: editRole, status: editStatus } : u
    );
    persist(next);
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <BackOfficeTemplate>
      <main className={classes.page}>
        <div className={classes.searchRow}>
          <input
            className={classes.searchInput}
            type="search"
            placeholder="Buscar por email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar usuario por email"
          />
        </div>
        <h2 className={classes.title}>Moderadores</h2>
        <div className={classes.table}>
          <FilaModerador />
          <div className={classes.rows}>
            {isLoading ? (
                <p>Loading...</p> // O cualquier indicador de carga que prefieras
              ) : (
                dataUsers && dataUsers.length > 0 && dataUsers.map((user) => (
                  <FilaModeradorRow
                    key={user.id}
                    user={user}
                    onEdit={onEdit}
                    onSuspend={onSuspend}
                    onActivate={onActivate}
                  />
                ))
              )}

          </div>
        </div>

        {modalOpen && selected && (
          <div className={classes.modalOverlay} onClick={() => setModalOpen(false)}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <h3 className={classes.modalTitle}>Editar usuario</h3>
              <div className={classes.modalBody}>
                <div className={classes.modalRow}><span className={classes.modalLabel}>ID:</span> {selected.id}</div>
                <div className={classes.modalRow}><span className={classes.modalLabel}>Email:</span> {selected.email}</div>

                <label className={classes.modalRow}>
                  <span className={classes.modalLabel}>Rol:</span>
                  <select
                    className={classes.select}
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  >
                    <option value="user">Usuario común</option>
                    <option value="moderator">Moderador</option>
                  </select>
                </label>

                <label className={classes.modalRow}>
                  <span className={classes.modalLabel}>Estado:</span>
                  <select
                    className={classes.select}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="suspendido">Suspendido</option>
                  </select>
                </label>
              </div>

              <div className={classes.modalActions}>
                <BtnSecondary text="Cancelar" size="sm" onClick={() => setModalOpen(false)} />
                <BtnDanger text="Guardar" size="sm" onClick={saveEdit} />
              </div>
            </div>
          </div>
        )}
      </main>
    </BackOfficeTemplate>
  );
}