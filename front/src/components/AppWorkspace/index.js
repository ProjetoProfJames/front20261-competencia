'use client';

import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import { apiRequest } from "@/lib/api";
import {
  listarProjetos,
  criarProjeto,
  editarProjeto,
  deletarProjeto,
  listarAvaliacoesPorProjeto,
  criarAvaliacao,
  editarAvaliacao,
  deletarAvaliacao,
} from "@/services/projetoService";

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
  { id: "projetos", label: "Projetos", roles: ["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO"] },
];

const profileOptions = ["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO", "AVALIADOR_EXTERNO"];

const projetoFormInicial = {
  nome: "",
  descricao: "",
  turmaId: "",
  semestreId: "",
  professorOrientadorId: "",
  integranteIds: [],
  localId: "",
  horarioInicio: "",
  horarioFim: "",
};

const turmasMock = [{ id: 1, nome: "T1-Estatistica" }];
const semestresMock = [{ id: 1, nome: "2026/1" }];

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

  const [projetos, setProjetos] = useState([]);
  const [loadingProjetos, setLoadingProjetos] = useState(false);
  const [projetoForm, setProjetoForm] = useState(projetoFormInicial);
  const [editandoProjetoId, setEditandoProjetoId] = useState(null);
  const [projetoAvaliacaoId, setProjetoAvaliacaoId] = useState(null);
  const [projetoAvaliacaoNome, setProjetoAvaliacaoNome] = useState("");
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacaoForm, setAvaliacaoForm] = useState({ nota: "", comentario: "" });
  const [editandoAvaliacaoId, setEditandoAvaliacaoId] = useState(null);

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
    await Promise.all([loadUsers(), loadLocais(), loadProjetos()]);
  }

  async function loadUsers() {
    if (!canViewUsers) return;
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

  async function loadProjetos() {
    setLoadingProjetos(true);
    try {
      const data = await listarProjetos();
      setProjetos(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotice(error.message || "Erro ao carregar projetos");
    } finally {
      setLoadingProjetos(false);
    }
  }

  async function loadAvaliacoes(projetoId) {
    try {
      const data = await listarAvaliacoesPorProjeto(projetoId);
      setAvaliacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      setNotice(error.message || "Erro ao carregar avaliações");
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

  function handleProjetoFormChange(event) {
    const { name, value } = event.target;
    setProjetoForm((current) => ({ ...current, [name]: value }));
  }

  function handleIntegrantesChange(event) {
    const selecionados = Array.from(event.target.selectedOptions).map((o) => Number(o.value));
    setProjetoForm((current) => ({ ...current, integranteIds: selecionados }));
  }

  function handleAvaliacaoFormChange(event) {
    const { name, value } = event.target;
    setAvaliacaoForm((current) => ({ ...current, [name]: value }));
  }

  function toDatetimeLocal(isoString) {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
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
        const payload = { username: userForm.username.trim(), profile: userForm.profile };
        if (userForm.password.trim()) payload.password = userForm.password;
        await apiRequest(`/api/users/${editingUserId}`, { method: "PUT", body: payload, token: session.token });
        setNotice("Usuário atualizado com sucesso");
      } else {
        await apiRequest("/api/users", {
          method: "POST",
          body: { username: userForm.username.trim(), email: userForm.email.trim().toLowerCase(), password: userForm.password, profile: userForm.profile },
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
        await apiRequest(`/api/locais/${editingLocalId}`, { method: "PUT", body: { numero: localForm.numero.trim() }, token: session.token });
        setNotice("Local atualizado com sucesso");
      } else {
        await apiRequest("/api/locais", { method: "POST", body: { numero: localForm.numero.trim() }, token: session.token });
        setNotice("Local cadastrado com sucesso");
      }
      setEditingLocalId(null);
      setLocalForm({ numero: "" });
      await loadLocais();
    } catch (error) {
      setNotice(error.message || "Não foi possível salvar o local");
    }
  }

  async function handleProjetoSubmit(event) {
    event.preventDefault();
    if (!projetoForm.nome || !projetoForm.turmaId || !projetoForm.semestreId || !projetoForm.professorOrientadorId || !projetoForm.localId || !projetoForm.horarioInicio || !projetoForm.horarioFim) {
      setNotice("Preencha todos os campos obrigatórios.");
      return;
    }
    if (projetoForm.integranteIds.length < 2 || projetoForm.integranteIds.length > 6) {
      setNotice("O grupo deve ter entre 2 e 6 integrantes.");
      return;
    }
    try {
      const payload = {
        ...projetoForm,
        turmaId: Number(projetoForm.turmaId),
        semestreId: Number(projetoForm.semestreId),
        professorOrientadorId: Number(projetoForm.professorOrientadorId),
        localId: Number(projetoForm.localId),
        horarioInicio: new Date(projetoForm.horarioInicio).toISOString(),
        horarioFim: new Date(projetoForm.horarioFim).toISOString(),
      };
      if (editandoProjetoId) {
        await editarProjeto(editandoProjetoId, payload);
        setNotice("Projeto atualizado com sucesso");
      } else {
        await criarProjeto(payload);
        setNotice("Projeto criado com sucesso");
      }
      setEditandoProjetoId(null);
      setProjetoForm(projetoFormInicial);
      await loadProjetos();
      setActiveSection("projetos");
    } catch (error) {
      setNotice(error.message || "Não foi possível salvar o projeto");
    }
  }

  async function handleAvaliacaoSubmit(event) {
    event.preventDefault();
    if (!avaliacaoForm.nota || !avaliacaoForm.comentario) {
      setNotice("Preencha a nota e o comentário.");
      return;
    }
    if (Number(avaliacaoForm.nota) < 0 || Number(avaliacaoForm.nota) > 10) {
      setNotice("A nota deve ser entre 0 e 10.");
      return;
    }
    try {
      const payload = { nota: Number(avaliacaoForm.nota), comentario: avaliacaoForm.comentario };
      if (editandoAvaliacaoId) {
        await editarAvaliacao(projetoAvaliacaoId, editandoAvaliacaoId, payload);
        setNotice("Avaliação atualizada com sucesso");
      } else {
        await criarAvaliacao(projetoAvaliacaoId, payload);
        setNotice("Avaliação criada com sucesso");
      }
      setEditandoAvaliacaoId(null);
      setAvaliacaoForm({ nota: "", comentario: "" });
      await loadAvaliacoes(projetoAvaliacaoId);
    } catch (error) {
      setNotice(error.message || "Não foi possível salvar a avaliação");
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

  function editProjeto(projeto) {
    setEditandoProjetoId(projeto.id);
    setProjetoForm({
      nome: projeto.nome ?? "",
      descricao: projeto.descricao ?? "",
      turmaId: projeto.turma?.id ?? "",
      semestreId: projeto.semestre?.id ?? "",
      professorOrientadorId: projeto.professorOrientador?.id ?? "",
      integranteIds: projeto.integrantes?.map((i) => i.id) ?? [],
      localId: projeto.local?.id ?? "",
      horarioInicio: projeto.horarioInicio ? toDatetimeLocal(projeto.horarioInicio) : "",
      horarioFim: projeto.horarioFim ? toDatetimeLocal(projeto.horarioFim) : "",
    });
    setActiveSection("projetos-form");
  }

  function abrirAvaliacoes(projeto) {
    setProjetoAvaliacaoId(projeto.id);
    setProjetoAvaliacaoNome(projeto.nome);
    setAvaliacaoForm({ nota: "", comentario: "" });
    setEditandoAvaliacaoId(null);
    loadAvaliacoes(projeto.id);
    setActiveSection("projetos-avaliacoes");
  }

  function editAvaliacao(avaliacao) {
    setEditandoAvaliacaoId(avaliacao.id);
    setAvaliacaoForm({ nota: avaliacao.nota, comentario: avaliacao.comentario });
  }

  async function deleteUser(userId) {
    if (!isAdmin) {
      setNotice("Apenas administradores podem excluir usuários");
      return;
    }
    if (!window.confirm("Deseja excluir este usuário?")) return;
    try {
      await apiRequest(`/api/users/${userId}`, { method: "DELETE", token: session.token });
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
    if (!window.confirm("Deseja excluir este local?")) return;
    try {
      await apiRequest(`/api/locais/${localId}`, { method: "DELETE", token: session.token });
      setNotice("Local excluído com sucesso");
      await loadLocais();
    } catch (error) {
      setNotice(error.message || "Não foi possível excluir o local");
    }
  }

  async function deleteProjeto(projetoId) {
    if (!window.confirm("Deseja excluir este projeto?")) return;
    try {
      await deletarProjeto(projetoId);
      setNotice("Projeto excluído com sucesso");
      await loadProjetos();
    } catch (error) {
      setNotice(error.message || "Não foi possível excluir o projeto");
    }
  }

  async function deleteAvaliacao(avaliacaoId) {
    if (!window.confirm("Deseja excluir esta avaliação?")) return;
    try {
      await deletarAvaliacao(projetoAvaliacaoId, avaliacaoId);
      setNotice("Avaliação excluída com sucesso");
      await loadAvaliacoes(projetoAvaliacaoId);
    } catch (error) {
      setNotice(error.message || "Não foi possível excluir a avaliação");
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

  function resetProjetoForm() {
    setEditandoProjetoId(null);
    setProjetoForm(projetoFormInicial);
  }

  function resetAvaliacaoForm() {
    setEditandoAvaliacaoId(null);
    setAvaliacaoForm({ nota: "", comentario: "" });
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
            <div>
              <strong>{projetos.length}</strong>
              <span>Projetos</span>
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

  function renderProjetos() {
    return (
      <section className="content-stack">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">CRUD</span>
              <h2>Projetos</h2>
            </div>
            <Button type="button" variant="secondary" onClick={() => { resetProjetoForm(); setActiveSection("projetos-form"); }}>
              Novo projeto
            </Button>
          </div>
          <Table
            columns={["Nome", "Turma", "Professor Orientador", "Integrantes", "Ações"]}
            rows={projetos}
            loading={loadingProjetos}
            emptyMessage="Nenhum projeto encontrado."
            renderRow={(projeto) => (
              <tr key={projeto.id}>
                <td>{projeto.nome}</td>
                <td>{projeto.turma?.nome ?? "-"}</td>
                <td>{projeto.professorOrientador?.username ?? "-"}</td>
                <td>{projeto.integrantes?.length ?? 0} aluno(s)</td>
                <td>
                  <div className="row-actions">
                    <Button type="button" variant="ghost" onClick={() => editProjeto(projeto)}>Editar</Button>
                    <Button type="button" variant="ghost" onClick={() => abrirAvaliacoes(projeto)}>Avaliações</Button>
                    <Button type="button" variant="danger" onClick={() => deleteProjeto(projeto.id)}>Excluir</Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </article>
      </section>
    );
  }

  function renderProjetoForm() {
    return (
      <section className="content-stack">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">CRUD</span>
              <h2>{editandoProjetoId ? "Editar Projeto" : "Novo Projeto"}</h2>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                resetProjetoForm();
                setActiveSection("projetos");
              }}
            >
              Voltar
            </Button>
          </div>

          <form className="form-grid" onSubmit={handleProjetoSubmit}>
            <FormInput
              label="Nome"
              name="nome"
              value={projetoForm.nome}
              onChange={handleProjetoFormChange}
              placeholder="Nome do projeto"
              required
            />
            <FormInput
              label="Descrição"
              name="descricao"
              value={projetoForm.descricao}
              onChange={handleProjetoFormChange}
              placeholder="Descrição do projeto"
            />

            <FormInput
              label="Turma"
              as="select"
              name="turmaId"
              value={projetoForm.turmaId}
              onChange={handleProjetoFormChange}
              required
            >
              <option value="">Selecione</option>
              {turmasMock.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </FormInput>

            <FormInput
              label="Semestre"
              as="select"
              name="semestreId"
              value={projetoForm.semestreId}
              onChange={handleProjetoFormChange}
              required
            >
              <option value="">Selecione</option>
              {semestresMock.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </FormInput>

            <FormInput
              label="Professor Orientador"
              as="select"
              name="professorOrientadorId"
              value={projetoForm.professorOrientadorId}
              onChange={handleProjetoFormChange}
              required
            >
              <option value="">Selecione</option>
              {users
                .filter((u) => u.profile === "PROFESSOR")
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.username}
                  </option>
                ))}
            </FormInput>

            <div className="field">
              <span className="field__label">
                Integrantes (selecione entre 2 e 6)
              </span>
              {users
                .filter((u) => u.profile === "ALUNO")
                .map((a) => (
                  <label
                    key={a.id}
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      color: "#f5efe6",
                      marginBottom: "6px",
                    }}
                  >
                    <input
                      type="checkbox"
                      value={a.id}
                      checked={projetoForm.integranteIds.includes(a.id)}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setProjetoForm((prev) => ({
                          ...prev,
                          integranteIds: e.target.checked
                            ? [...prev.integranteIds, id]
                            : prev.integranteIds.filter((i) => i !== id),
                        }));
                      }}
                    />
                    {a.username}
                  </label>
                ))}
            </div>

            <FormInput
              label="Local"
              as="select"
              name="localId"
              value={projetoForm.localId}
              onChange={handleProjetoFormChange}
              required
            >
              <option value="">Selecione</option>
              {locais.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.numero}
                </option>
              ))}
            </FormInput>

            <FormInput
              label="Horário de Início"
              type="datetime-local"
              name="horarioInicio"
              value={projetoForm.horarioInicio}
              onChange={handleProjetoFormChange}
              required
            />
            <FormInput
              label="Horário de Fim"
              type="datetime-local"
              name="horarioFim"
              value={projetoForm.horarioFim}
              onChange={handleProjetoFormChange}
              required
            />

            <div className="form-actions">
              <Button type="submit">Salvar projeto</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  resetProjetoForm();
                  setActiveSection("projetos");
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </article>
      </section>
    );
  }

  function renderAvaliacoes() {
    return (
      <section className="content-stack">
        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">Avaliações</span>
              <h2>{projetoAvaliacaoNome}</h2>
            </div>
            <Button type="button" variant="secondary" onClick={() => { setActiveSection("projetos"); setProjetoAvaliacaoId(null); }}>
              Voltar
            </Button>
          </div>
          <Table
            columns={["Avaliador", "Nota", "Comentário", "Ações"]}
            rows={avaliacoes}
            emptyMessage="Nenhuma avaliação cadastrada."
            renderRow={(avaliacao) => (
              <tr key={avaliacao.id}>
                <td>{avaliacao.avaliador?.username ?? "-"}</td>
                <td>{avaliacao.nota}</td>
                <td>{avaliacao.comentario}</td>
                <td>
                  <div className="row-actions">
                    <Button type="button" variant="ghost" onClick={() => editAvaliacao(avaliacao)}>Editar</Button>
                    <Button type="button" variant="danger" onClick={() => deleteAvaliacao(avaliacao.id)}>Excluir</Button>
                  </div>
                </td>
              </tr>
            )}
          />
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <span className="panel__eyebrow">CRUD</span>
              <h2>{editandoAvaliacaoId ? "Editar Avaliação" : "Nova Avaliação"}</h2>
            </div>
          </div>
          <form className="form-grid" onSubmit={handleAvaliacaoSubmit}>
            <FormInput label="Nota (0 a 10)" type="number" name="nota" value={avaliacaoForm.nota} onChange={handleAvaliacaoFormChange} placeholder="Ex.: 8.5" required />
            <FormInput label="Comentário" name="comentario" value={avaliacaoForm.comentario} onChange={handleAvaliacaoFormChange} placeholder="Comentário sobre o projeto" required />
            <div className="form-actions">
              <Button type="submit">{editandoAvaliacaoId ? "Salvar alterações" : "Adicionar avaliação"}</Button>
              {editandoAvaliacaoId ? <Button type="button" variant="secondary" onClick={resetAvaliacaoForm}>Cancelar edição</Button> : null}
            </div>
          </form>
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

  const activeSectionLabel = activeSection === "projetos-form"
    ? (editandoProjetoId ? "Editar Projeto" : "Novo Projeto")
    : activeSection === "projetos-avaliacoes"
    ? "Avaliações"
    : currentSection?.label || "Painel";

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
            <button key={section.id} className={activeSection === section.id || (section.id === "projetos" && ["projetos-form", "projetos-avaliacoes"].includes(activeSection)) ? "nav-item nav-item--active" : "nav-item"} onClick={() => setActiveSection(section.id)}>
              <span>{section.label}</span>
              <small>{section.id === "usuarios" || section.id === "locais" || section.id === "projetos" ? "" : "Em breve"}</small>
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
            <h2>{activeSectionLabel}</h2>
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
        {activeSection === "projetos" ? renderProjetos() : null}
        {activeSection === "projetos-form" ? renderProjetoForm() : null}
        {activeSection === "projetos-avaliacoes" ? renderAvaliacoes() : null}
        {activeSection !== "dashboard" && activeSection !== "usuarios" && activeSection !== "locais" && activeSection !== "projetos" && activeSection !== "projetos-form" && activeSection !== "projetos-avaliacoes" ? renderPlaceholder(currentSection?.label || "Seção") : null}
      </section>
    </main>
  );
}