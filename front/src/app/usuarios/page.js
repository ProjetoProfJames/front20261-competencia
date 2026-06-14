"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import { apiRequest } from "@/lib/api";
import { getCurrentUser, getSession, hasAnyProfile, setSession } from "@/lib/auth";

const profiles = ["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO", "AVALIADOR_EXTERNO"];

const emptyForm = {
  username: "",
  email: "",
  password: "",
  profile: "ALUNO",
};

function profileLabel(profile) {
  return profile.replace("_", " ");
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function UsuariosPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingUser, setEditingUser] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canAccessPage = hasAnyProfile(currentUser, ["ADMIN", "PROFESSOR"]);
  const isAdmin = currentUser?.profile === "ADMIN";

  const columns = useMemo(() => [
    { key: "username", label: "Nome" },
    { key: "email", label: "Email" },
    {
      key: "profile",
      label: "Perfil",
      render: (user) => <span className="badge">{profileLabel(user.profile)}</span>,
    },
  ], []);

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/users");
      setUsers(data || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (hasAnyProfile(user, ["ADMIN", "PROFESSOR"])) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [loadUsers]);

  const openCreateForm = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setForm({
      username: user.username || "",
      email: user.email || "",
      password: "",
      profile: user.profile || "ALUNO",
    });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const username = form.username.trim();
    const email = form.email.trim();

    if (!username) {
      validationErrors.username = "Informe o nome.";
    } else if (username.length > 120) {
      validationErrors.username = "O nome deve ter até 120 caracteres.";
    }

    if (!editingUser) {
      if (!email) {
        validationErrors.email = "Informe o email.";
      } else if (!validateEmail(email)) {
        validationErrors.email = "Informe um email válido.";
      } else if (email.length > 180) {
        validationErrors.email = "O email deve ter até 180 caracteres.";
      }
    }

    if (!editingUser && !form.password) {
      validationErrors.password = "Informe a senha.";
    } else if (form.password && (form.password.length < 6 || form.password.length > 120)) {
      validationErrors.password = "A senha deve ter entre 6 e 120 caracteres.";
    }

    if (isAdmin && !form.profile) {
      validationErrors.profile = "Selecione o perfil.";
    }

    return validationErrors;
  };

  const syncCurrentUser = (updatedUser) => {
    if (updatedUser?.id !== currentUser?.id) {
      return;
    }

    const session = getSession();

    if (session) {
      setSession({ ...session, user: updatedUser });
      setCurrentUser(updatedUser);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setStatus(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSaving(true);

    try {
      if (editingUser) {
        const body = {
          username: form.username.trim(),
        };

        if (form.password) {
          body.password = form.password;
        }

        if (isAdmin) {
          body.profile = form.profile;
        }

        const updatedUser = await apiRequest(`/users/${editingUser.id}`, {
          method: "PUT",
          body,
        });

        syncCurrentUser(updatedUser);
        setStatus({ type: "success", message: "Usuário atualizado com sucesso." });
      } else {
        await apiRequest("/users", {
          method: "POST",
          body: {
            username: form.username.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
            profile: form.profile,
          },
        });

        setStatus({ type: "success", message: "Usuário cadastrado com sucesso." });
      }

      closeForm();
      await loadUsers();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Deseja excluir o usuário ${user.username}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(user.id);
    setStatus(null);

    try {
      await apiRequest(`/users/${user.id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Usuário excluído com sucesso." });
      await loadUsers();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const canEditUser = (user) => {
    return isAdmin || user.id === currentUser?.id;
  };

  const renderActions = (user) => {
    const actions = [];

    if (canEditUser(user)) {
      actions.push(
        <Button key="edit" variant="secondary" onClick={() => openEditForm(user)}>
          Editar
        </Button>
      );
    }

    if (isAdmin && user.id !== currentUser?.id) {
      actions.push(
        <Button
          key="delete"
          variant="danger"
          onClick={() => handleDelete(user)}
          disabled={deletingId === user.id}
        >
          {deletingId === user.id ? "Excluindo..." : "Excluir"}
        </Button>
      );
    }

    return actions.length > 0 ? <div className="row-actions">{actions}</div> : <span className="muted">Sem ações</span>;
  };

  return (
    <AuthenticatedLayout requiredProfiles={["ADMIN", "PROFESSOR"]}>
      <section className="page-header">
        <div className="page-title">
          <h1>Usuários</h1>
          <p>Consulte e mantenha os usuários autorizados no sistema.</p>
        </div>
        {isAdmin && (
          <div className="page-actions">
            <Button onClick={openCreateForm}>Novo usuário</Button>
          </div>
        )}
      </section>

      {status && <div className={`status status-${status.type}`}>{status.message}</div>}

      {formOpen && canAccessPage && (
        <section className="panel">
          <h2>{editingUser ? "Editar usuário" : "Cadastrar usuário"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormInput
                label="Nome"
                name="username"
                value={form.username}
                onChange={handleChange}
                error={errors.username}
                required
                maxLength={120}
              />
              <FormInput
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                disabled={Boolean(editingUser)}
                required={!editingUser}
                maxLength={180}
              />
              <FormInput
                label={editingUser ? "Nova senha" : "Senha"}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                required={!editingUser}
                minLength={6}
                maxLength={120}
                autoComplete="new-password"
              />
              {isAdmin && (
                <div className="form-field">
                  <label htmlFor="profile">
                    Perfil
                    <span className="required-mark">*</span>
                  </label>
                  <select
                    id="profile"
                    name="profile"
                    value={form.profile}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.profile)}
                  >
                    {profiles.map((profile) => (
                      <option key={profile} value={profile}>
                        {profileLabel(profile)}
                      </option>
                    ))}
                  </select>
                  {errors.profile && <span className="field-error">{errors.profile}</span>}
                </div>
              )}
            </div>
            <div className="form-actions">
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <h2>Listagem</h2>
        {loading ? (
          <p className="muted">Carregando usuários...</p>
        ) : (
          <Table
            columns={columns}
            rows={users}
            emptyMessage="Nenhum usuário encontrado."
            renderActions={renderActions}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
