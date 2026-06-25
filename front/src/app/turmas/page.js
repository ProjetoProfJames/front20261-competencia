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
  cursoIds: [],
  disciplinaId: "",
  semestreId: "",
  professorIds: [],
};

function itemNames(items = []) {
  return items.length > 0 ? items.map((item) => item.nome).join(", ") : "-";
}

function userNames(users = []) {
  return users.length > 0 ? users.map((user) => user.username || user.email).join(", ") : "-";
}

function userLabel(user) {
  return user?.username ? `${user.username} (${user.email})` : user?.email || "-";
}

export default function TurmasPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingTurma, setEditingTurma] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);

  const canCreateEdit = currentUser?.profile === "PROFESSOR";
  const canDelete = hasAnyProfile(currentUser, ["PROFESSOR", "ADMIN"]);
  const canEnroll = currentUser?.profile === "ALUNO";

  const professores = useMemo(() => {
    return users.filter((user) => user.profile === "PROFESSOR");
  }, [users]);

  const selectedCursoIds = useMemo(() => {
    return form.cursoIds.map(Number);
  }, [form.cursoIds]);

  const availableDisciplinas = useMemo(() => {
    if (selectedCursoIds.length === 0) {
      return [];
    }

    return disciplinas.filter((disciplina) => selectedCursoIds.includes(Number(disciplina.cursoId)));
  }, [disciplinas, selectedCursoIds]);

  const columns = useMemo(() => [
    { key: "nome", label: "Turma" },
    {
      key: "cursos",
      label: "Cursos",
      render: (turma) => itemNames(turma.cursos),
    },
    {
      key: "disciplina",
      label: "Disciplina",
      render: (turma) => turma.disciplina?.nome || "-",
    },
    {
      key: "semestre",
      label: "Período",
      render: (turma) => turma.semestre?.nome || "-",
    },
    {
      key: "professores",
      label: "Professores",
      render: (turma) => userNames(turma.professores),
    },
    {
      key: "alunos",
      label: "Alunos",
      render: (turma) => turma.alunos?.length || 0,
    },
  ], []);

  const loadTurmas = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/turmas");
      setTurmas(data || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true);

    try {
      const [cursosData, semestresData, disciplinasData, usersData] = await Promise.all([
        apiRequest("/cursos"),
        apiRequest("/semestres"),
        apiRequest("/disciplinas"),
        apiRequest("/users"),
      ]);

      setCursos(cursosData || []);
      setSemestres(semestresData || []);
      setDisciplinas(disciplinasData || []);
      setUsers(usersData || []);
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
      loadTurmas();

      if (user.profile === "PROFESSOR") {
        loadOptions();
      }
    } else {
      setLoading(false);
    }
  }, [loadOptions, loadTurmas]);

  const openCreateForm = () => {
    setEditingTurma(null);
    setForm(emptyForm);
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const openEditForm = (turma) => {
    setEditingTurma(turma);
    setForm({
      nome: turma.nome || "",
      cursoIds: (turma.cursos || []).map((curso) => String(curso.id)),
      disciplinaId: turma.disciplina?.id ? String(turma.disciplina.id) : "",
      semestreId: turma.semestre?.id ? String(turma.semestre.id) : "",
      professorIds: (turma.professores || []).map((professor) => String(professor.id)),
    });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingTurma(null);
    setForm(emptyForm);
    setErrors({});
    setFormOpen(false);
  };

  const handleChange = (event) => {
    const { name, value, selectedOptions } = event.target;

    if (name === "cursoIds") {
      const values = Array.from(selectedOptions, (option) => option.value);
      const selectedIds = values.map(Number);

      setForm((currentForm) => {
        const selectedDisciplina = disciplinas.find((disciplina) => String(disciplina.id) === currentForm.disciplinaId);
        const keepDisciplina = selectedDisciplina && selectedIds.includes(Number(selectedDisciplina.cursoId));

        return {
          ...currentForm,
          cursoIds: values,
          disciplinaId: keepDisciplina ? currentForm.disciplinaId : "",
        };
      });
      setErrors((currentErrors) => ({ ...currentErrors, cursoIds: "", disciplinaId: "" }));
      return;
    }

    if (name === "professorIds") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setForm((currentForm) => ({ ...currentForm, professorIds: values }));
      setErrors((currentErrors) => ({ ...currentErrors, professorIds: "" }));
      return;
    }

    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const nome = form.nome.trim();

    if (!nome) {
      validationErrors.nome = "Informe o nome da turma.";
    } else if (nome.length > 120) {
      validationErrors.nome = "O nome deve ter até 120 caracteres.";
    }

    if (form.cursoIds.length === 0) {
      validationErrors.cursoIds = "Selecione ao menos um curso.";
    }

    if (!form.disciplinaId) {
      validationErrors.disciplinaId = "Selecione a disciplina.";
    }

    if (!form.semestreId) {
      validationErrors.semestreId = "Selecione o período letivo.";
    }

    if (form.professorIds.length === 0) {
      validationErrors.professorIds = "Selecione ao menos um professor.";
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
        cursoIds: form.cursoIds.map(Number),
        disciplinaId: Number(form.disciplinaId),
        semestreId: Number(form.semestreId),
        professorIds: form.professorIds.map(Number),
      };

      if (editingTurma) {
        await apiRequest(`/turmas/${editingTurma.id}`, {
          method: "PUT",
          body,
        });

        setStatus({ type: "success", message: "Turma atualizada com sucesso." });
      } else {
        await apiRequest("/turmas", {
          method: "POST",
          body,
        });

        setStatus({ type: "success", message: "Turma cadastrada com sucesso." });
      }

      closeForm();
      await loadTurmas();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (turma) => {
    const confirmed = window.confirm(`Deseja excluir a turma ${turma.nome}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(turma.id);
    setStatus(null);

    try {
      await apiRequest(`/turmas/${turma.id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Turma excluída com sucesso." });
      await loadTurmas();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const isCurrentAlunoEnrolled = (turma) => {
    return (turma.alunos || []).some((aluno) => (
      aluno.id === currentUser?.id || aluno.email === currentUser?.email
    ));
  };

  const handleEnroll = async (turma) => {
    setEnrollingId(turma.id);
    setStatus(null);

    try {
      await apiRequest(`/turmas/${turma.id}/matriculas`, { method: "POST" });
      setStatus({ type: "success", message: "Matrícula realizada com sucesso." });
      await loadTurmas();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setEnrollingId(null);
    }
  };

  const renderActions = (turma) => {
    const actions = [];

    if (canEnroll) {
      if (isCurrentAlunoEnrolled(turma)) {
        actions.push(
          <span key="enrolled" className="badge">
            Matriculado
          </span>
        );
      } else {
        actions.push(
          <Button
            key="enroll"
            onClick={() => handleEnroll(turma)}
            disabled={enrollingId === turma.id}
          >
            {enrollingId === turma.id ? "Matriculando..." : "Matricular"}
          </Button>
        );
      }
    }

    if (canCreateEdit) {
      actions.push(
        <Button key="edit" variant="secondary" onClick={() => openEditForm(turma)}>
          Editar
        </Button>
      );
    }

    if (canDelete) {
      actions.push(
        <Button
          key="delete"
          variant="danger"
          onClick={() => handleDelete(turma)}
          disabled={deletingId === turma.id}
        >
          {deletingId === turma.id ? "Excluindo..." : "Excluir"}
        </Button>
      );
    }

    return actions.length > 0 ? <div className="row-actions">{actions}</div> : <span className="muted">Sem ações</span>;
  };

  return (
    <AuthenticatedLayout>
      <section className="page-header">
        <div className="page-title">
          <h1>Turmas</h1>
          <p>Cadastre e consulte turmas vinculadas a cursos, disciplinas e períodos letivos.</p>
        </div>
        {canCreateEdit && (
          <div className="page-actions">
            <Button onClick={openCreateForm} disabled={loadingOptions}>
              Nova turma
            </Button>
          </div>
        )}
      </section>

      {status && <div className={`status status-${status.type}`}>{status.message}</div>}

      {formOpen && canCreateEdit && (
        <section className="panel">
          <h2>{editingTurma ? "Editar turma" : "Cadastrar turma"}</h2>
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
                <label htmlFor="cursoIds">
                  Cursos
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="cursoIds"
                  name="cursoIds"
                  value={form.cursoIds}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.cursoIds)}
                  multiple
                >
                  {cursos.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nome}
                    </option>
                  ))}
                </select>
                {errors.cursoIds && <span className="field-error">{errors.cursoIds}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="disciplinaId">
                  Disciplina
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="disciplinaId"
                  name="disciplinaId"
                  value={form.disciplinaId}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.disciplinaId)}
                  disabled={selectedCursoIds.length === 0}
                >
                  <option value="">Selecione</option>
                  {availableDisciplinas.map((disciplina) => (
                    <option key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome} - {disciplina.cursoNome}
                    </option>
                  ))}
                </select>
                {errors.disciplinaId && <span className="field-error">{errors.disciplinaId}</span>}
              </div>
              <div className="form-field">
                <label htmlFor="semestreId">
                  Período letivo
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="semestreId"
                  name="semestreId"
                  value={form.semestreId}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.semestreId)}
                >
                  <option value="">Selecione</option>
                  {semestres.map((semestre) => (
                    <option key={semestre.id} value={semestre.id}>
                      {semestre.nome}
                    </option>
                  ))}
                </select>
                {errors.semestreId && <span className="field-error">{errors.semestreId}</span>}
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

      <section className="panel">
        <h2>Listagem</h2>
        {loading ? (
          <p className="muted">Carregando turmas...</p>
        ) : (
          <Table
            columns={columns}
            rows={turmas}
            emptyMessage="Nenhuma turma encontrada."
            renderActions={canCreateEdit || canDelete || canEnroll ? renderActions : undefined}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
