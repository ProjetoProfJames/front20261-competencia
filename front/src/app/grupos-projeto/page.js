"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import { apiRequest } from "@/lib/api";
import { getCurrentUser, hasAnyProfile } from "@/lib/auth";

const emptyForm = {
  nome: "",
  turmaId: "",
  professorOrientadorId: "",
  alunoIds: [],
};

const emptyProjetoForm = {
  nome: "",
  descricao: "",
  grupoProjetoId: "",
  localId: "",
  horarioInicio: "",
  horarioFim: "",
};

function userLabel(user) {
  return user?.username ? `${user.username} (${user.email})` : user?.email || "-";
}

function userNames(users = []) {
  return users.length > 0 ? users.map(userLabel).join(", ") : "-";
}

function cursoNames(cursos = []) {
  return cursos.length > 0 ? cursos.map((curso) => curso.nome).join(", ") : "-";
}

function turmaLabel(turma) {
  if (!turma) {
    return "-";
  }

  const cursos = cursoNames(turma.cursos);
  const semestre = turma.semestre?.nome || "-";
  return `${turma.nome} - ${cursos} - ${semestre}`;
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function toDatetimeLocal(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function toInstant(value) {
  return value ? new Date(value).toISOString() : null;
}

function formatProjeto(projeto) {
  if (!projeto) {
    return <span className="muted">Sem projeto vinculado</span>;
  }

  return (
    <div className="stacked-cell">
      <strong>{projeto.nome}</strong>
      <span>{projeto.local?.nome || "-"} - {formatDateTime(projeto.horarioInicio)} até {formatDateTime(projeto.horarioFim)}</span>
    </div>
  );
}

export default function GruposProjetoPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [projetoForm, setProjetoForm] = useState(emptyProjetoForm);
  const [editingGrupo, setEditingGrupo] = useState(null);
  const [selectedProjetoGrupo, setSelectedProjetoGrupo] = useState(null);
  const [editingProjeto, setEditingProjeto] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [projetoFormOpen, setProjetoFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [projetoErrors, setProjetoErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingProjeto, setSavingProjeto] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canManage = hasAnyProfile(currentUser, ["PROFESSOR", "COORDENADOR", "ADMIN"]);

  const selectedTurma = useMemo(() => {
    return turmas.find((turma) => String(turma.id) === form.turmaId);
  }, [form.turmaId, turmas]);

  const columns = useMemo(() => [
    { key: "nome", label: "Grupo" },
    {
      key: "turma",
      label: "Turma / curso / período",
      render: (grupo) => (
        <div className="stacked-cell">
          <strong>{grupo.turma?.nome || "-"}</strong>
          <span>{cursoNames(grupo.turma?.cursos)} - {grupo.turma?.semestre?.nome || "-"}</span>
        </div>
      ),
    },
    {
      key: "professorOrientador",
      label: "Orientador",
      render: (grupo) => userLabel(grupo.professorOrientador),
    },
    {
      key: "alunos",
      label: "Alunos",
      render: (grupo) => userNames(grupo.alunos),
    },
    {
      key: "projeto",
      label: "Projeto / local / horário",
      render: (grupo) => formatProjeto(grupo.projeto),
    },
  ], []);

  const loadGrupos = useCallback(async (searchValue = "") => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      const data = await apiRequest(`/grupos-projeto${params.toString() ? `?${params}` : ""}`);
      setGrupos(data || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true);

    try {
      const [turmasData, locaisData] = await Promise.all([
        apiRequest("/turmas"),
        apiRequest("/locais"),
      ]);
      setTurmas(turmasData || []);
      setLocais(locaisData || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user) {
      loadGrupos();
      loadOptions();
    } else {
      setLoading(false);
    }
  }, [loadGrupos, loadOptions]);

  const openCreateForm = () => {
    setEditingGrupo(null);
    setForm(emptyForm);
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const openEditForm = (grupo) => {
    setEditingGrupo(grupo);
    setForm({
      nome: grupo.nome || "",
      turmaId: grupo.turma?.id ? String(grupo.turma.id) : "",
      professorOrientadorId: grupo.professorOrientador?.id ? String(grupo.professorOrientador.id) : "",
      alunoIds: (grupo.alunos || []).map((aluno) => String(aluno.id)),
    });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingGrupo(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(false);
  };

  const closeProjetoForm = () => {
    setSelectedProjetoGrupo(null);
    setEditingProjeto(null);
    setProjetoForm(emptyProjetoForm);
    setProjetoErrors({});
    setProjetoFormOpen(false);
  };

  const openProjetoForm = async (grupo) => {
    const projeto = grupo.projeto;

    setSelectedProjetoGrupo(grupo);
    setEditingProjeto(projeto || null);
    setProjetoForm({
      nome: projeto?.nome || grupo.nome || "",
      descricao: "",
      grupoProjetoId: String(grupo.id),
      localId: projeto?.local?.id ? String(projeto.local.id) : "",
      horarioInicio: toDatetimeLocal(projeto?.horarioInicio),
      horarioFim: toDatetimeLocal(projeto?.horarioFim),
    });
    setProjetoErrors({});
    setStatus(null);
    setProjetoFormOpen(true);

    if (!projeto?.id) {
      return;
    }

    try {
      const data = await apiRequest(`/projetos/${projeto.id}`);
      setEditingProjeto(data);
      setProjetoForm({
        nome: data?.nome || projeto.nome || grupo.nome || "",
        descricao: data?.descricao || "",
        grupoProjetoId: String(grupo.id),
        localId: data?.local?.id ? String(data.local.id) : "",
        horarioInicio: toDatetimeLocal(data?.horarioInicio),
        horarioFim: toDatetimeLocal(data?.horarioFim),
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleChange = (event) => {
    const { name, value, selectedOptions } = event.target;

    if (name === "turmaId") {
      setForm((currentForm) => ({
        ...currentForm,
        turmaId: value,
        professorOrientadorId: "",
        alunoIds: [],
      }));
      setErrors((currentErrors) => ({
        ...currentErrors,
        turmaId: "",
        professorOrientadorId: "",
        alunoIds: "",
      }));
      return;
    }

    if (name === "alunoIds") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setForm((currentForm) => ({ ...currentForm, alunoIds: values }));
      setErrors((currentErrors) => ({ ...currentErrors, alunoIds: "" }));
      return;
    }

    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const handleProjetoChange = (event) => {
    const { name, value } = event.target;
    setProjetoForm((currentForm) => ({ ...currentForm, [name]: value }));
    setProjetoErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const nome = form.nome.trim();

    if (!nome) {
      validationErrors.nome = "Informe o nome do grupo.";
    } else if (nome.length > 120) {
      validationErrors.nome = "O nome deve ter até 120 caracteres.";
    }

    if (!form.turmaId) {
      validationErrors.turmaId = "Selecione a turma.";
    }

    if (!form.professorOrientadorId) {
      validationErrors.professorOrientadorId = "Selecione o professor orientador.";
    }

    if (form.alunoIds.length < 3 || form.alunoIds.length > 7) {
      validationErrors.alunoIds = "Selecione entre 3 e 7 alunos.";
    }

    return validationErrors;
  };

  const validateProjetoForm = () => {
    const validationErrors = {};
    const nome = projetoForm.nome.trim();
    const descricao = projetoForm.descricao.trim();

    if (!nome) {
      validationErrors.nome = "Informe o nome do projeto.";
    } else if (nome.length > 160) {
      validationErrors.nome = "O nome deve ter até 160 caracteres.";
    }

    if (!descricao) {
      validationErrors.descricao = "Informe a descrição do projeto.";
    } else if (descricao.length > 2000) {
      validationErrors.descricao = "A descrição deve ter até 2000 caracteres.";
    }

    if (!projetoForm.localId) {
      validationErrors.localId = "Selecione o local de apresentação.";
    }

    if (!projetoForm.horarioInicio) {
      validationErrors.horarioInicio = "Informe o horário de início.";
    }

    if (!projetoForm.horarioFim) {
      validationErrors.horarioFim = "Informe o horário de fim.";
    }

    if (projetoForm.horarioInicio && projetoForm.horarioFim && projetoForm.horarioFim <= projetoForm.horarioInicio) {
      validationErrors.horarioFim = "O fim deve ser depois do início.";
    }

    return validationErrors;
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
      const body = {
        nome: form.nome.trim(),
        turmaId: Number(form.turmaId),
        professorOrientadorId: Number(form.professorOrientadorId),
        alunoIds: form.alunoIds.map(Number),
      };

      if (editingGrupo) {
        await apiRequest(`/grupos-projeto/${editingGrupo.id}`, {
          method: "PUT",
          body,
        });
        setStatus({ type: "success", message: "Grupo atualizado com sucesso." });
      } else {
        await apiRequest("/grupos-projeto", {
          method: "POST",
          body,
        });
        setStatus({ type: "success", message: "Grupo cadastrado com sucesso." });
      }

      closeForm();
      await loadGrupos(search);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleProjetoSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateProjetoForm();
    setProjetoErrors(validationErrors);
    setStatus(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSavingProjeto(true);

    try {
      const body = {
        nome: projetoForm.nome.trim(),
        descricao: projetoForm.descricao.trim(),
        grupoProjetoId: Number(projetoForm.grupoProjetoId),
        localId: Number(projetoForm.localId),
        horarioInicio: toInstant(projetoForm.horarioInicio),
        horarioFim: toInstant(projetoForm.horarioFim),
      };

      if (editingProjeto?.id) {
        await apiRequest(`/projetos/${editingProjeto.id}`, {
          method: "PUT",
          body,
        });
        setStatus({ type: "success", message: "Apresentação atualizada com sucesso." });
      } else {
        await apiRequest("/projetos", {
          method: "POST",
          body,
        });
        setStatus({ type: "success", message: "Apresentação cadastrada com sucesso." });
      }

      closeProjetoForm();
      await loadGrupos(search);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingProjeto(false);
    }
  };

  const handleDelete = async (grupo) => {
    const confirmed = window.confirm(`Deseja excluir o grupo ${grupo.nome}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(grupo.id);
    setStatus(null);

    try {
      await apiRequest(`/grupos-projeto/${grupo.id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Grupo excluído com sucesso." });
      await loadGrupos(search);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await loadGrupos(search);
  };

  const clearSearch = async () => {
    setSearch("");
    await loadGrupos("");
  };

  const canEditGrupo = (grupo) => {
    return hasAnyProfile(currentUser, ["COORDENADOR", "ADMIN"])
      || (
        currentUser?.profile === "PROFESSOR"
        && (
          grupo.professorOrientador?.id === currentUser?.id
          || grupo.professorOrientador?.email === currentUser?.email
        )
      );
  };

  const renderActions = (grupo) => {
    if (!canEditGrupo(grupo)) {
      return <span className="muted">Sem ações</span>;
    }

    return (
      <div className="row-actions">
        <Button variant="secondary" onClick={() => openProjetoForm(grupo)} disabled={loadingOptions}>
          {grupo.projeto ? "Editar apresentação" : "Registrar apresentação"}
        </Button>
        <Button variant="secondary" onClick={() => openEditForm(grupo)}>
          Editar
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDelete(grupo)}
          disabled={deletingId === grupo.id}
        >
          {deletingId === grupo.id ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    );
  };

  return (
    <AuthenticatedLayout>
      <section className="page-header">
        <div className="page-title">
          <h1>Grupos de Projeto</h1>
          <p>Cadastre grupos por turma, orientador e componentes.</p>
        </div>
        {canManage && (
          <div className="page-actions">
            <Button onClick={openCreateForm} disabled={loadingOptions}>
              Novo grupo
            </Button>
          </div>
        )}
      </section>

      {status && <div className={`status status-${status.type}`}>{status.message}</div>}

      <section className="panel">
        <h2>Pesquisa</h2>
        <form onSubmit={handleSearch}>
          <div className="form-grid">
            <FormInput
              label="Buscar"
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Aluno, professor, turma, curso ou semestre"
            />
          </div>
          <div className="form-actions">
            <Button type="submit" disabled={loading}>
              Pesquisar
            </Button>
            <Button type="button" variant="secondary" onClick={clearSearch} disabled={loading || !search}>
              Limpar
            </Button>
          </div>
        </form>
      </section>

      {formOpen && canManage && (
        <section className="panel">
          <h2>{editingGrupo ? "Editar grupo" : "Cadastrar grupo"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormInput
                label="Nome do grupo"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                error={errors.nome}
                required
                maxLength={120}
              />
              <div className="form-field">
                <label htmlFor="turmaId">
                  Turma
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="turmaId"
                  name="turmaId"
                  value={form.turmaId}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.turmaId)}
                >
                  <option value="">Selecione</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turmaLabel(turma)}
                    </option>
                  ))}
                </select>
                {errors.turmaId && <span className="field-error">{errors.turmaId}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="professorOrientadorId">
                  Professor orientador
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="professorOrientadorId"
                  name="professorOrientadorId"
                  value={form.professorOrientadorId}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.professorOrientadorId)}
                  disabled={!selectedTurma}
                >
                  <option value="">Selecione</option>
                  {(selectedTurma?.professores || []).map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {userLabel(professor)}
                    </option>
                  ))}
                </select>
                {errors.professorOrientadorId && <span className="field-error">{errors.professorOrientadorId}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="alunoIds">
                  Alunos do grupo
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="alunoIds"
                  name="alunoIds"
                  value={form.alunoIds}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.alunoIds)}
                  disabled={!selectedTurma}
                  multiple
                >
                  {(selectedTurma?.alunos || []).map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {userLabel(aluno)}
                    </option>
                  ))}
                </select>
                {errors.alunoIds && <span className="field-error">{errors.alunoIds}</span>}
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" disabled={saving || loadingOptions}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm} disabled={saving}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      )}

      {projetoFormOpen && selectedProjetoGrupo && canEditGrupo(selectedProjetoGrupo) && (
        <section className="panel">
          <h2>{editingProjeto ? "Editar apresentação" : "Registrar apresentação"}</h2>
          <form onSubmit={handleProjetoSubmit}>
            <div className="form-grid">
              <FormInput
                label="Nome do projeto"
                name="nome"
                value={projetoForm.nome}
                onChange={handleProjetoChange}
                error={projetoErrors.nome}
                required
                maxLength={160}
              />
              <div className="form-field">
                <label htmlFor="localId">
                  Local
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="localId"
                  name="localId"
                  value={projetoForm.localId}
                  onChange={handleProjetoChange}
                  aria-invalid={Boolean(projetoErrors.localId)}
                >
                  <option value="">Selecione</option>
                  {locais.map((local) => (
                    <option key={local.id} value={local.id}>
                      {local.numero}
                    </option>
                  ))}
                </select>
                {projetoErrors.localId && <span className="field-error">{projetoErrors.localId}</span>}
              </div>
              <FormInput
                label="Início da apresentação"
                type="datetime-local"
                name="horarioInicio"
                value={projetoForm.horarioInicio}
                onChange={handleProjetoChange}
                error={projetoErrors.horarioInicio}
                required
              />
              <FormInput
                label="Fim da apresentação"
                type="datetime-local"
                name="horarioFim"
                value={projetoForm.horarioFim}
                onChange={handleProjetoChange}
                error={projetoErrors.horarioFim}
                required
              />
              <div className="form-field form-field-wide">
                <label htmlFor="descricao">
                  Descrição
                  <span className="required-mark">*</span>
                </label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={projetoForm.descricao}
                  onChange={handleProjetoChange}
                  aria-invalid={Boolean(projetoErrors.descricao)}
                  maxLength={2000}
                />
                {projetoErrors.descricao && <span className="field-error">{projetoErrors.descricao}</span>}
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" disabled={savingProjeto || loadingOptions}>
                {savingProjeto ? "Salvando..." : "Salvar apresentação"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeProjetoForm} disabled={savingProjeto}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <h2>Listagem</h2>
        {loading ? (
          <p className="muted">Carregando grupos...</p>
        ) : (
          <Table
            columns={columns}
            rows={grupos}
            emptyMessage="Nenhum grupo encontrado."
            renderActions={canManage ? renderActions : undefined}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
