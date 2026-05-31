'use client';

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import { apiRequest } from "@/lib/api";

const roleLabels = {
  ADMIN: "Administrador",
  COORDENADOR: "Coordenador",
  PROFESSOR: "Professor",
  ALUNO: "Aluno",
  AVALIADOR_EXTERNO: "Avaliador externo",
};

const availableSections = [
  { id: "dashboard", label: "Painel", roles: ["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO", "AVALIADOR_EXTERNO"] },
  { id: "usuarios", label: "Usuários", roles: ["ADMIN", "PROFESSOR"] },
  { id: "locais", label: "Locais", roles: ["ADMIN", "COORDENADOR", "PROFESSOR"] },
  { id: "cursos", label: "Cursos", roles: ["ADMIN", "COORDENADOR", "PROFESSOR"] },
  { id: "semestres", label: "Períodos Letivos", roles: ["ADMIN", "COORDENADOR", "PROFESSOR"] },
  { id: "turmas", label: "Turmas", roles: ["ADMIN", "COORDENADOR", "PROFESSOR"] },
];

const profileOptions = ["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO", "AVALIADOR_EXTERNO"];

export default function AppWorkspace({ session, onLogout }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLocais, setLoadingLocais] = useState(false);
  const [notice, setNotice] = useState("");
  const [userForm, setUserForm] = useState({ username: "", email: "", password: "", profile: "ALUNO" });
  const [editingUserId, setEditingUserId] = useState(null);
  const [localForm, setLocalForm] = useState({ numero: "" });
  const [editingLocalId, setEditingLocalId] = useState(null);

  const profile = session?.user?.profile;
  const userName = session?.user?.username || "Usuário";
  const isAdmin = profile === "ADMIN";
  const canManageLocais = profile === "ADMIN" || profile === "COORDENADOR";
  const canViewUsers = profile === "ADMIN" || profile === "PROFESSOR";

  const sections = useMemo(() => availableSections.filter((section) => section.roles.includes(profile)), [profile]);

  useEffect(() => {
    setActiveSection(sections[0]?.id || "dashboard");
  }, [sections]);

  useEffect(() => {
    refreshData();
  }, []);

  async function refreshData() {
    await Promise.all([loadUsers(), loadLocais()]);
  }

  async function loadUsers() {
    if (!canViewUsers) {
      return;
    }

    setLoadingUsers(true);
    try {
      const data = await apiRequest("/api/users", { token: session.token });
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotice(error.message || "Erro ao carregar usuários");
    } finally {
      setLoadingUsers(false);
    }
  }

  async function loadLocais() {
    setLoadingLocais(true);
    try {
      const data = await apiRequest("/api/locais", { token: session.token });
      setLocais(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotice(error.message || "Erro ao carregar locais");
    } finally {
      setLoadingLocais(false);
    }
  }

  function handleUserChange(event) {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  }

  function handleLocalChange(event) {
    const { name, value } = event.target;
    setLocalForm((current) => ({ ...current, [name]: value }));
  }

  async function handleUserSubmit(event) {
    event.preventDefault();

    if (!isAdmin && !editingUserId) {
      setNotice("Apenas administradores podem criar usuários");
      return;
    }

    if (!userForm.username.trim() || !userForm.email.trim() || (!editingUserId && !userForm.password.trim())) {
      setNotice("Preencha os campos obrigatórios do usuário");
      return;
    }

    try {
      if (editingUserId) {
        const payload = {
          username: userForm.username.trim(),
          profile: userForm.profile,
        };

        if (userForm.password.trim()) {
          payload.password = userForm.password;
        }

        await apiRequest(`/api/users/${editingUserId}`, {
          method: "PUT",
          body: payload,
          token: session.token,
        });
        setNotice("Usuário atualizado com sucesso");
      } else {
        await apiRequest("/api/users", {
          method: "POST",
          body: {
            username: userForm.username.trim(),
            email: userForm.email.trim().toLowerCase(),
            password: userForm.password,
            profile: userForm.profile,
          },
          token: session.token,
        });
        setNotice("Usuário criado com sucesso");
      }

      setEditingUserId(null);
      setUserForm({ username: "", email: "", password: "", profile: "ALUNO" });
      await loadUsers();
    } catch (error) {
      setNotice(error.message || "Não foi possível salvar o usuário");
    }
  }

  async function handleLocalSubmit(event) {
    event.preventDefault();

    if (!canManageLocais) {
      setNotice("Seu perfil não permite alterar locais");
      return;
    }

    if (!localForm.numero.trim()) {
      setNotice("Informe o número ou identificação do local");
      return;
    }

    try {
      if (editingLocalId) {
        await apiRequest(`/api/locais/${editingLocalId}`, {
          method: "PUT",
          body: { numero: localForm.numero.trim() },
          token: session.token,
        });
        setNotice("Local atualizado com sucesso");
      } else {
        await apiRequest("/api/locais", {
          method: "POST",
          body: { numero: localForm.numero.trim() },
          token: session.token,
        });
        setNotice("Local cadastrado com sucesso");
      }

      setEditingLocalId(null);
      setLocalForm({ numero: "" });
      await loadLocais();
    } catch (error) {
      setNotice(error.message || "Não foi possível salvar o local");
    }
  }

  function editUser(user) {
    setActiveSection("usuarios");
    setEditingUserId(user.id);
    setUserForm({ username: user.username || "", email: user.email || "", password: "", profile: user.profile || "ALUNO" });
  }

  function editLocal(local) {
    setActiveSection("locais");
    setEditingLocalId(local.id);
    setLocalForm({ numero: local.numero || "" });
  }

  async function deleteUser(userId) {
    if (!isAdmin) {
      setNotice("Apenas administradores podem excluir usuários");
      return;
    }

    if (!window.confirm("Deseja excluir este usuário?")) {
      return;
    }

    try {
      await apiRequest(`/api/users/${userId}`, {
        method: "DELETE",
        token: session.token,
      });
      setNotice("Usuário excluído com sucesso");
      await loadUsers();
    } catch (error) {
      setNotice(error.message || "Não foi possível excluir o usuário");
    }
  }

  async function deleteLocal(localId) {
    if (!canManageLocais) {
      setNotice("Seu perfil não permite excluir locais");
      return;
    }

    if (!window.confirm("Deseja excluir este local?")) {
      return;
    }

    try {
      await apiRequest(`/api/locais/${localId}`, {
        method: "DELETE",
        token: session.token,
      });
      setNotice("Local excluído com sucesso");
      await loadLocais();
    } catch (error) {
      setNotice(error.message || "Não foi possível excluir o local");
    }
  }

  function resetUserForm() {
    setEditingUserId(null);
    setUserForm({ username: "", email: "", password: "", profile: "ALUNO" });
  }

  function resetLocalForm() {
    setEditingLocalId(null);
    setLocalForm({ numero: "" });
  }

  function renderDashboard() {
    return (
      <section className="workspace-grid">
        <article className="hero-card">
          <span className="hero-card__eyebrow">Acesso autenticado</span>
          <h2>Gestão de projetos integradores</h2>
          <p>Você está conectado como {userName} ({roleLabels[profile] || profile}). Aqui você administra os cadastros base da tarefa 1.</p>
          <div className="hero-card__stats">
            <div>
              <strong>{users.length}</strong>
              <span>Usuários</span>
            </div>
            <div>
              <strong>{locais.length}</strong>
              <span>Locais</span>
            </div>
          </div>
        </article>

        <article className="info-card">
          <h3>Atalhos</h3>
          <p>Use o menu lateral para abrir o CRUD disponível para o seu perfil.</p>
          <div className="quick-links">
            {sections.map((section) => (
              <button key={section.id} className={activeSection === section.id ? "quick-link quick-link--active" : "quick-link"} onClick={() => setActiveSection(section.id)}>
                {section.label}
              </button>
            ))}
          </div>
        </article>
      </section>
    );
  }

  function renderUsers() {
    return (
      <section className="content-stack">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">CRUD</span>
              <h2>Usuários</h2>
            </div>
            <Button type="button" variant="secondary" onClick={resetUserForm}>
              Novo cadastro
            </Button>
          </div>

          <form className="form-grid" onSubmit={handleUserSubmit}>
            <FormInput label="Nome" name="username" value={userForm.username} onChange={handleUserChange} placeholder="Nome do usuário" required />
            <FormInput label="Email" type="email" name="email" value={userForm.email} onChange={handleUserChange} placeholder="email@exemplo.com" disabled={Boolean(editingUserId)} required={!editingUserId} helperText={editingUserId ? "O backend atual não permite alterar o email" : "Será usado no login"} />
            <FormInput label={editingUserId ? "Nova senha" : "Senha"} type="password" name="password" value={userForm.password} onChange={handleUserChange} placeholder={editingUserId ? "Deixe em branco para manter" : "Senha com pelo menos 6 caracteres"} required={!editingUserId} />
            <FormInput label="Perfil" as="select" name="profile" value={userForm.profile} onChange={handleUserChange} required>
              {profileOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </FormInput>

            <div className="form-actions">
              <Button type="submit" disabled={loadingUsers}>Salvar usuário</Button>
              {editingUserId ? <Button type="button" variant="secondary" onClick={resetUserForm}>Cancelar edição</Button> : null}
            </div>
          </form>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">Listagem</span>
              <h3>Usuários cadastrados</h3>
            </div>
          </div>

          <Table
            columns={["Nome", "Email", "Perfil", "Ações"]}
            rows={users}
            loading={loadingUsers}
            emptyMessage="Nenhum usuário encontrado."
            renderRow={(user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{roleLabels[user.profile] || user.profile}</td>
                <td>
                  <div className="row-actions">
                    <Button type="button" variant="ghost" onClick={() => editUser(user)}>Editar</Button>
                    {isAdmin ? <Button type="button" variant="danger" onClick={() => deleteUser(user.id)}>Excluir</Button> : null}
                  </div>
                </td>
              </tr>
            )}
          />
        </article>
      </section>
    );
  }

  function renderLocais() {
    return (
      <section className="content-stack">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">CRUD</span>
              <h2>Locais de apresentação</h2>
            </div>
            <Button type="button" variant="secondary" onClick={resetLocalForm}>
              Novo local
            </Button>
          </div>

          <form className="form-grid" onSubmit={handleLocalSubmit}>
            <FormInput label="Identificação do local" name="numero" value={localForm.numero} onChange={handleLocalChange} placeholder="Ex.: Auditório 01" required />

            <div className="form-actions">
              <Button type="submit" disabled={loadingLocais}>Salvar local</Button>
              {editingLocalId ? <Button type="button" variant="secondary" onClick={resetLocalForm}>Cancelar edição</Button> : null}
            </div>
          </form>
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">Listagem</span>
              <h3>Locais cadastrados</h3>
            </div>
          </div>

          <Table
            columns={["Identificação", "Ações"]}
            rows={locais}
            loading={loadingLocais}
            emptyMessage="Nenhum local encontrado."
            renderRow={(local) => (
              <tr key={local.id}>
                <td>{local.numero}</td>
                <td>
                  <div className="row-actions">
                    <Button type="button" variant="ghost" onClick={() => editLocal(local)}>Editar</Button>
                    {canManageLocais ? <Button type="button" variant="danger" onClick={() => deleteLocal(local.id)}>Excluir</Button> : null}
                  </div>
                </td>
              </tr>
            )}
          />
        </article>
      </section>
    );
  }

  function renderPlaceholder(sectionLabel) {
    return (
      <section className="panel panel--placeholder">
        <span className="panel__eyebrow">Em construção</span>
        <h2>{sectionLabel}</h2>
        <p>Esta área fica pronta nas próximas tarefas do grupo. Por enquanto a base de autenticação, usuários e locais já está integrada ao backend.</p>
      </section>
    );
  }

  const currentSection = sections.find((section) => section.id === activeSection) || sections[0];

  return (
    <main className="workspace-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__eyebrow">PIE Manager</span>
          <h1>Gestão escolar</h1>
          <p>Menu principal da área autenticada.</p>
        </div>

        <nav className="sidebar__nav">
          {sections.map((section) => (
            <button key={section.id} className={activeSection === section.id ? "nav-item nav-item--active" : "nav-item"} onClick={() => setActiveSection(section.id)}>
              <span>{section.label}</span>
              <small>{section.id === "usuarios" || section.id === "locais" ? "CRUD ativo" : "Em breve"}</small>
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div>
            <strong>{userName}</strong>
            <span>{roleLabels[profile] || profile}</span>
          </div>
          <Button type="button" variant="secondary" onClick={onLogout} fullWidth>
            Sair
          </Button>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="topbar">
          <div>
            <span className="topbar__eyebrow">Sessão ativa</span>
            <h2>{currentSection?.label || "Painel"}</h2>
          </div>
          <div className="topbar__meta">
            <span>{userName}</span>
            <span>{roleLabels[profile] || profile}</span>
          </div>
        </header>

        {notice ? <div className="notice-box">{notice}</div> : null}

        {activeSection === "dashboard" ? renderDashboard() : null}
        {activeSection === "usuarios" ? renderUsers() : null}
        {activeSection === "locais" ? renderLocais() : null}
        {activeSection !== "dashboard" && activeSection !== "usuarios" && activeSection !== "locais" ? renderPlaceholder(currentSection?.label || "Seção") : null}
      </section>
    </main>
  );
}