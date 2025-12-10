import React, { useEffect, useState } from "react";
import BackOfficeTemplate from "@/components/UI/BackOfficeTemplate";
import * as classes from "./Usuarios.module.css";
import FilaUsuario from "@/components/UI/BackOfficeComponents/FilaUsuario";
import FilaUsuarioRow from "@/components/UI/BackOfficeComponents/FilaUsuario/FilaUsuarioRow";
import { useUsersApi } from "@/hooks/useUsersApi";
import { useToast } from "@/components/UI/Toast";
import { BtnSecondary } from "@/components/UI/Buttons";

export default function BackOfficeUsuarios() {
  const { showToast } = useToast();
  const { useGetAllUsers, deleteUser } = useUsersApi();

  const { data: users, isLoading, error } = useGetAllUsers();
  useEffect(() => console.log(users), [users]);
  
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Búsqueda por email
  const normalized = query.trim().toLowerCase();
  const filteredUsers = normalized
    ? users
        .filter((u) => u.email?.toLowerCase().includes(normalized))
        .sort((a, b) => {
          const ea = a.email?.toLowerCase() || "";
          const eb = b.email?.toLowerCase() || "";
          const score = (e) => (e === normalized ? 3 : e.startsWith(normalized) ? 2 : 1);
          return score(eb) - score(ea);
        })
    : users;

  const handleView = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleBan = (user) => {
    if (!user?.id) return;
    if (window.confirm(`¿Estás seguro de banear a ${user.email}?`)) {
      deleteUser.mutate(user.id, {
        onSuccess: () => showToast(`Usuario ${user.email} baneado`, { type: "success" }),
        onError: () => showToast("Error al banear", { type: "error" }),
      });
    }
  };

  

  if (isLoading) return <BackOfficeTemplate><div className={classes.loading}>Cargando usuarios...</div></BackOfficeTemplate>;
  if (error) return <BackOfficeTemplate><div className={classes.error}>Error al cargar usuarios</div></BackOfficeTemplate>;

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
          />
        </div>

        <h2 className={classes.title}>Usuarios ({users.length})</h2>

        <div className={classes.table}>
          <FilaUsuario />
          <div className={classes.rows}>
            {filteredUsers.length === 0 ? (
              <div className={classes.noResults}>
                {normalized ? "No se encontraron usuarios" : "No hay usuarios"}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <FilaUsuarioRow
                  key={user.id}
                  user={user}
                  onView={() => handleView(user)}
                  onBan={() => handleBan(user)}
                />
              ))
            )}
          </div>
        </div>

        {/* MODAL DETALLE DE USUARIO */}
        {modalOpen && selectedUser && (
          <div className={classes.modalOverlay} onClick={() => setModalOpen(false)}>
            <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
              <button
                className={classes.modalClose}
                onClick={() => setModalOpen(false)}
                aria-label="Cerrar"
              >
                ×
              </button>

              <h3 className={classes.modalTitle}>Detalle del usuario</h3>

              <div className={classes.modalBody}>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>ID:</span> {selectedUser.id}
                </div>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>Email:</span> {selectedUser.email}
                </div>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>Nombre:</span> {selectedUser.user_info?.first_name || "—"}
                </div>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>Apellido:</span> {selectedUser.user_info?.last_name || "—"}
                </div>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>Username:</span> {selectedUser.user_info?.username || "Sin username"}
                </div>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>Rol:</span> 
                  <strong style={{ color: selectedUser.role === "admin" ? "#e74c3c" : "#27ae60" }}>
                    {(selectedUser.role_id == 1 ? "Usuario" : selectedUser.role_id == 2 ? "Moderador" : "Administrador") || "usuario"}
                  </strong>
                </div>
                <div className={classes.modalRow}>
                  <span className={classes.modalLabel}>Registrado el:</span> 
                  {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : "—"}
                </div>
              </div>

              <div className={classes.modalActions}>
                <BtnSecondary text="Cerrar" size="sm" onClick={() => setModalOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </main>
    </BackOfficeTemplate>
  );
}