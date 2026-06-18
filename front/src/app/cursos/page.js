"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

const emptyForm = {
  nome: "",
  coordenadorId: "",
  professorIds: [],
};

const emptyDisciplinaForm = {
  nome: "",
  cursoId: "",
};

function userLabel(user) {
  return user?.username ? `${user.username} (${user.email})` : user?.email || "-";
}

function userNames(users = []) {
  return users.length > 0 ? users.map((user) => user.username || user.email).join(", ") : "-";
}

function disciplinaNames(disciplinas = []) {
  return disciplinas.length > 0 ? disciplinas.map((disciplina) => disciplina.nome).join(", ") : "-";
}

export default function CursosPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [disciplinaForm, setDisciplinaForm] = useState(emptyDisciplinaForm);
  const [editingCurso, setEditingCurso] = useState(null);
  const [editingDisciplina, setEditingDisciplina] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [disciplinaErrors, setDisciplinaErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingDisciplina, setSavingDisciplina] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingDisciplinaId, setDeletingDisciplinaId] = useState(null);

  const isAdmin = currentUser?.profile === "ADMIN";

  const coordenadores = useMemo(() => {
    return users.filter((user) => user.profile === "COORDENADOR");
  }, [users]);

  const professores = useMemo(() => {
    return users.filter((user) => user.profile === "PROFESSOR");
  }, [users]);

  const disciplinasByCurso = useMemo(() => {
    return disciplinas.reduce((map, disciplina) => {
      const cursoId = Number(disciplina.cursoId);
      const cursoDisciplinas = map.get(cursoId) || [];
      cursoDisciplinas.push(disciplina);
      map.set(cursoId, cursoDisciplinas);
      return map;
    }, new Map());
  }, [disciplinas]);

  const columns = useMemo(() => [
    { key: "nome", label: "Curso" },
    {
      key: "coordenador",
      label: "Coordenador",
      render: (curso) => userLabel(curso.coordenador),
    },
    {
      key: "professores",
      label: "Professores",
      render: (curso) => userNames(curso.professores),
    },
    {
      key: "disciplinas",
      label: "Disciplinas",
      render: (curso) => disciplinaNames(disciplinasByCurso.get(Number(curso.id))),
    },
    { key: "updatedBy", label: "Atualizado por" },
  ], [disciplinasByCurso]);

  const disciplinaColumns = useMemo(() => [
    { key: "nome", label: "Disciplina" },
    { key: "cursoNome", label: "Curso" },
    { key: "updatedBy", label: "Atualizado por" },
  ], []);

  const loadCursos = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/cursos");
      setCursos(data || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDisciplinas = useCallback(async () => {
    try {
      const data = await apiRequest("/disciplinas");
      setDisciplinas(data || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingOptions(true);

    try {
      const data = await apiRequest("/users");
      setUsers(data || []);
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
      loadCursos();
      loadDisciplinas();

      if (user.profile === "ADMIN") {
        loadUsers();
      }
    } else {
      setLoading(false);
    }
  }, [loadCursos, loadDisciplinas, loadUsers]);

  const openCreateForm = () => {
    setEditingCurso(null);
    setForm(emptyForm);
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const openEditForm = (curso) => {
    setEditingCurso(curso);
    setForm({
      nome: curso.nome || "",
      coordenadorId: curso.coordenador?.id ? String(curso.coordenador.id) : "",
      professorIds: (curso.professores || []).map((professor) => String(professor.id)),
    });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingCurso(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(false);
  };

  const resetDisciplinaForm = () => {
    setEditingDisciplina(null);
    setDisciplinaForm(emptyDisciplinaForm);
    setDisciplinaErrors({});
  };

  const openEditDisciplina = (disciplina) => {
    setEditingDisciplina(disciplina);
    setDisciplinaForm({
      nome: disciplina.nome || "",
      cursoId: disciplina.cursoId ? String(disciplina.cursoId) : "",
    });
    setDisciplinaErrors({});
    setStatus(null);
  };

  const handleChange = (event) => {
    const { name, value, selectedOptions } = event.target;

    if (name === "professorIds") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setForm((currentForm) => ({ ...currentForm, professorIds: values }));
      setErrors((currentErrors) => ({ ...currentErrors, professorIds: "" }));
      return;
    }

    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const handleDisciplinaChange = (event) => {
    const { name, value } = event.target;
    setDisciplinaForm((currentForm) => ({ ...currentForm, [name]: value }));
    setDisciplinaErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const nome = form.nome.trim();

    if (!nome) {
      validationErrors.nome = "Informe o nome do curso.";
    } else if (nome.length > 120) {
      validationErrors.nome = "O nome deve ter até 120 caracteres.";
    }

    if (!form.coordenadorId) {
      validationErrors.coordenadorId = "Selecione o coordenador.";
    }

    if (form.professorIds.length === 0) {
      validationErrors.professorIds = "Selecione ao menos um professor.";
    }

    return validationErrors;
  };

  const validateDisciplinaForm = () => {
    const validationErrors = {};
    const nome = disciplinaForm.nome.trim();

    if (!nome) {
      validationErrors.nome = "Informe o nome da disciplina.";
    } else if (nome.length > 120) {
      validationErrors.nome = "O nome deve ter até 120 caracteres.";
    }

    if (!disciplinaForm.cursoId) {
      validationErrors.cursoId = "Selecione o curso.";
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
        coordenadorId: Number(form.coordenadorId),
        professorIds: form.professorIds.map(Number),
      };

      if (editingCurso) {
        await apiRequest(`/cursos/${editingCurso.id}`, {
          method: "PUT",
          body,
        });

        setStatus({ type: "success", message: "Curso atualizado com sucesso." });
      } else {
        await apiRequest("/cursos", {
          method: "POST",
          body,
        });

        setStatus({ type: "success", message: "Curso cadastrado com sucesso." });
      }

      closeForm();
      await Promise.all([loadCursos(), loadDisciplinas()]);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDisciplinaSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateDisciplinaForm();
    setDisciplinaErrors(validationErrors);
    setStatus(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSavingDisciplina(true);

    try {
      const body = {
        nome: disciplinaForm.nome.trim(),
        cursoId: Number(disciplinaForm.cursoId),
      };

      if (editingDisciplina) {
        await apiRequest(`/disciplinas/${editingDisciplina.id}`, {
          method: "PUT",
          body,
        });

        setStatus({ type: "success", message: "Disciplina atualizada com sucesso." });
      } else {
        await apiRequest("/disciplinas", {
          method: "POST",
          body,
        });

        setStatus({ type: "success", message: "Disciplina cadastrada com sucesso." });
      }

      resetDisciplinaForm();
      await loadDisciplinas();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSavingDisciplina(false);
    }
  };

  const handleDelete = async (curso) => {
    const confirmed = window.confirm(`Deseja excluir o curso ${curso.nome}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(curso.id);
    setStatus(null);

    try {
      await apiRequest(`/cursos/${curso.id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Curso excluído com sucesso." });
      await Promise.all([loadCursos(), loadDisciplinas()]);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDisciplinaDelete = async (disciplina) => {
    const confirmed = window.confirm(`Deseja excluir a disciplina ${disciplina.nome}?`);

    if (!confirmed) {
      return;
    }

    setDeletingDisciplinaId(disciplina.id);
    setStatus(null);

    try {
      await apiRequest(`/disciplinas/${disciplina.id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Disciplina excluída com sucesso." });

      if (editingDisciplina?.id === disciplina.id) {
        resetDisciplinaForm();
      }

      await loadDisciplinas();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingDisciplinaId(null);
    }
  };

  const renderActions = (curso) => (
    <div className="row-actions">
      <Button variant="secondary" onClick={() => openEditForm(curso)}>
        Editar
      </Button>
      <Button
        variant="danger"
        onClick={() => handleDelete(curso)}
        disabled={deletingId === curso.id}
      >
        {deletingId === curso.id ? "Excluindo..." : "Excluir"}
      </Button>
    </div>
  );

  const renderDisciplinaActions = (disciplina) => (
    <div className="row-actions">
      <Button variant="secondary" onClick={() => openEditDisciplina(disciplina)}>
        Editar
      </Button>
      <Button
        variant="danger"
        onClick={() => handleDisciplinaDelete(disciplina)}
        disabled={deletingDisciplinaId === disciplina.id}
      >
        {deletingDisciplinaId === disciplina.id ? "Excluindo..." : "Excluir"}
      </Button>
    </div>
  );

  return (
    <AuthenticatedLayout>
      <section className="page-header">
        <div className="page-title">
          <h1>Cursos</h1>
          <p>Cadastre e consulte cursos, coordenadores e professores responsáveis.</p>
        </div>
        {isAdmin && (
          <div className="page-actions">
            <Button onClick={openCreateForm} disabled={loadingOptions}>
              Novo curso
            </Button>
          </div>
        )}
      </section>

      {status && <div className={`status status-${status.type}`}>{status.message}</div>}

      {formOpen && isAdmin && (
        <section className="panel">
          <h2>{editingCurso ? "Editar curso" : "Cadastrar curso"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormInput
                label="Nome"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                error={errors.nome}
                required
                maxLength={120}
              />
              <div className="form-field">
                <label htmlFor="coordenadorId">
                  Coordenador
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="coordenadorId"
                  name="coordenadorId"
                  value={form.coordenadorId}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.coordenadorId)}
                >
                  <option value="">Selecione</option>
                  {coordenadores.map((coordenador) => (
                    <option key={coordenador.id} value={coordenador.id}>
                      {userLabel(coordenador)}
                    </option>
                  ))}
                </select>
                {errors.coordenadorId && <span className="field-error">{errors.coordenadorId}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="professorIds">
                  Professores
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="professorIds"
                  name="professorIds"
                  value={form.professorIds}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.professorIds)}
                  multiple
                >
                  {professores.map((professor) => (
                    <option key={professor.id} value={professor.id}>
                      {userLabel(professor)}
                    </option>
                  ))}
                </select>
                {errors.professorIds && <span className="field-error">{errors.professorIds}</span>}
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

      {isAdmin && (
        <section className="panel">
          <h2>Disciplinas dos cursos</h2>
          <form onSubmit={handleDisciplinaSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="disciplinaNome">
                  Disciplina
                  <span className="required-mark">*</span>
                </label>
                <input
                  id="disciplinaNome"
                  name="nome"
                  value={disciplinaForm.nome}
                  onChange={handleDisciplinaChange}
                  aria-invalid={Boolean(disciplinaErrors.nome)}
                  maxLength={120}
                  placeholder="Exemplo: Estatística"
                />
                {disciplinaErrors.nome && <span className="field-error">{disciplinaErrors.nome}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="cursoId">
                  Curso
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="cursoId"
                  name="cursoId"
                  value={disciplinaForm.cursoId}
                  onChange={handleDisciplinaChange}
                  aria-invalid={Boolean(disciplinaErrors.cursoId)}
                >
                  <option value="">Selecione</option>
                  {cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nome}
                    </option>
                  ))}
                </select>
                {disciplinaErrors.cursoId && <span className="field-error">{disciplinaErrors.cursoId}</span>}
              </div>
            </div>
            <div className="form-actions">
              <Button type="submit" disabled={savingDisciplina || cursos.length === 0}>
                {savingDisciplina ? "Salvando..." : editingDisciplina ? "Atualizar disciplina" : "Adicionar disciplina"}
              </Button>
              {editingDisciplina && (
                <Button type="button" variant="secondary" onClick={resetDisciplinaForm} disabled={savingDisciplina}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>

          <Table
            columns={disciplinaColumns}
            rows={disciplinas}
            emptyMessage="Nenhuma disciplina cadastrada."
            renderActions={renderDisciplinaActions}
          />
        </section>
      )}

      <section className="panel">
        <h2>Listagem</h2>
        {loading ? (
          <p className="muted">Carregando cursos...</p>
        ) : (
          <Table
            columns={columns}
            rows={cursos}
            emptyMessage="Nenhum curso encontrado."
            renderActions={isAdmin ? renderActions : undefined}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
