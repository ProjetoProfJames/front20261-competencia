"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import { apiRequest } from "@/lib/api";
import { getCurrentUser, hasAnyProfile } from "@/lib/auth";

const emptyForm = {
  projetoId: "",
  nota: "",
  comentario: "",
};

function userLabel(user) {
  return user?.username ? `${user.username} (${user.email})` : user?.email || "-";
}

function formatNota(nota) {
  if (nota === null || nota === undefined || nota === "") {
    return "-";
  }

  return Number(nota).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
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

function projetoLabel(projeto) {
  if (!projeto) {
    return "-";
  }

  const grupo = projeto.grupoProjeto?.nome ? ` - ${projeto.grupoProjeto.nome}` : "";
  return `${projeto.nome}${grupo}`;
}

export default function AvaliacoesProjetosPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [projetos, setProjetos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingAvaliacao, setEditingAvaliacao] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const canEvaluate = hasAnyProfile(currentUser, ["PROFESSOR", "AVALIADOR_EXTERNO"]);

  const ownAvaliacoesByProjeto = useMemo(() => {
    return new Map(
      avaliacoes
        .filter((avaliacao) => avaliacao.avaliador?.id === currentUser?.id)
        .map((avaliacao) => [avaliacao.projeto?.id, avaliacao])
    );
  }, [avaliacoes, currentUser]);

  const columns = useMemo(() => [
    {
      key: "projeto",
      label: "Projeto",
      render: (avaliacao) => avaliacao.projeto?.nome || "-",
    },
    {
      key: "avaliador",
      label: "Avaliador",
      render: (avaliacao) => userLabel(avaliacao.avaliador),
    },
    {
      key: "nota",
      label: "Nota",
      render: (avaliacao) => <span className="badge">{formatNota(avaliacao.nota)}</span>,
    },
    { key: "comentario", label: "Comentário" },
  ], []);

  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      const [projetosData, avaliacoesData] = await Promise.all([
        apiRequest("/projetos"),
        apiRequest("/avaliacoes"),
      ]);

      setProjetos(projetosData || []);
      setAvaliacoes(avaliacoesData || []);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [loadData]);

  const openCreateForm = (projetoId = "") => {
    const ownAvaliacao = ownAvaliacoesByProjeto.get(Number(projetoId));

    if (ownAvaliacao) {
      openEditForm(ownAvaliacao);
      return;
    }

    setEditingAvaliacao(null);
    setForm({ ...emptyForm, projetoId: projetoId ? String(projetoId) : "" });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const openEditForm = (avaliacao) => {
    setEditingAvaliacao(avaliacao);
    setForm({
      projetoId: avaliacao.projeto?.id ? String(avaliacao.projeto.id) : "",
      nota: avaliacao.nota ? String(avaliacao.nota) : "",
      comentario: avaliacao.comentario || "",
    });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingAvaliacao(null);
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
    const nota = Number(form.nota);

    if (!form.projetoId) {
      validationErrors.projetoId = "Selecione o projeto.";
    }

    if (form.nota === "") {
      validationErrors.nota = "Informe a nota.";
    } else if (Number.isNaN(nota) || nota < 0 || nota > 10) {
      validationErrors.nota = "A nota deve estar entre 0 e 10.";
    }

    if (!form.comentario.trim()) {
      validationErrors.comentario = "Informe um comentário.";
    } else if (form.comentario.trim().length > 2000) {
      validationErrors.comentario = "O comentário deve ter até 2000 caracteres.";
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
        nota: Number(form.nota),
        comentario: form.comentario.trim(),
      };

      if (editingAvaliacao) {
        await apiRequest(`/projetos/${form.projetoId}/avaliacoes/${editingAvaliacao.id}`, {
          method: "PUT",
          body,
        });
        setStatus({ type: "success", message: "Avaliação atualizada com sucesso." });
      } else {
        await apiRequest(`/projetos/${form.projetoId}/avaliacoes`, {
          method: "POST",
          body,
        });
        setStatus({ type: "success", message: "Avaliação cadastrada com sucesso." });
      }

      closeForm();
      await loadData();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const canEditAvaliacao = (avaliacao) => {
    return canEvaluate && avaliacao.avaliador?.id === currentUser?.id;
  };

  const renderProjetoActions = (projeto) => {
    const avaliacao = ownAvaliacoesByProjeto.get(projeto.id);

    return (
      <Button
        variant={avaliacao ? "secondary" : "primary"}
        onClick={() => openCreateForm(projeto.id)}
      >
        {avaliacao ? "Editar nota" : "Avaliar"}
      </Button>
    );
  };

  const renderAvaliacaoActions = (avaliacao) => {
    if (!canEditAvaliacao(avaliacao)) {
      return <span className="muted">Sem ações</span>;
    }

    return (
      <Button variant="secondary" onClick={() => openEditForm(avaliacao)}>
        Editar
      </Button>
    );
  };

  const projectColumns = useMemo(() => [
    {
      key: "nome",
      label: "Projeto",
      render: (projeto) => (
        <div className="stacked-cell">
          <strong>{projetoLabel(projeto)}</strong>
          <span>{projeto.local?.nome || "-"} - {formatDateTime(projeto.horarioInicio)} até {formatDateTime(projeto.horarioFim)}</span>
          <span>{projeto.turma?.nome || "-"}</span>
        </div>
      ),
    },
    {
      key: "professorOrientador",
      label: "Orientador",
      render: (projeto) => userLabel(projeto.professorOrientador),
    },
    {
      key: "minhaNota",
      label: "Minha nota",
      render: (projeto) => formatNota(ownAvaliacoesByProjeto.get(projeto.id)?.nota),
    },
  ], [ownAvaliacoesByProjeto]);

  return (
    <AuthenticatedLayout>
      <section className="page-header">
        <div className="page-title">
          <h1>Avaliação de Projetos</h1>
          <p>Atribua notas de 0 a 10 aos projetos apresentados.</p>
        </div>
        {canEvaluate && (
          <div className="page-actions">
            <Button onClick={() => openCreateForm()}>Nova avaliação</Button>
          </div>
        )}
      </section>

      {status && <div className={`status status-${status.type}`}>{status.message}</div>}

      {formOpen && canEvaluate && (
        <section className="panel">
          <h2>{editingAvaliacao ? "Editar avaliação" : "Cadastrar avaliação"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="projetoId">
                  Projeto
                  <span className="required-mark">*</span>
                </label>
                <select
                  id="projetoId"
                  name="projetoId"
                  value={form.projetoId}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.projetoId)}
                  disabled={Boolean(editingAvaliacao)}
                >
                  <option value="">Selecione</option>
                  {projetos.map((projeto) => (
                    <option key={projeto.id} value={projeto.id}>
                      {projetoLabel(projeto)}
                    </option>
                  ))}
                </select>
                {errors.projetoId && <span className="field-error">{errors.projetoId}</span>}
              </div>
              <FormInput
                label="Nota"
                type="number"
                name="nota"
                value={form.nota}
                onChange={handleChange}
                error={errors.nota}
                required
                min={0}
                max={10}
                step="0.1"
              />
              <div className="form-field form-field-wide">
                <label htmlFor="comentario">
                  Comentário
                  <span className="required-mark">*</span>
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={form.comentario}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.comentario)}
                  maxLength={2000}
                />
                {errors.comentario && <span className="field-error">{errors.comentario}</span>}
              </div>
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

      {canEvaluate && (
        <section className="panel">
          <h2>Projetos disponíveis</h2>
          {loading ? (
            <p className="muted">Carregando projetos...</p>
          ) : (
            <Table
              columns={projectColumns}
              rows={projetos}
              emptyMessage="Nenhum projeto encontrado."
              renderActions={renderProjetoActions}
            />
          )}
        </section>
      )}

      <section className="panel">
        <h2>Avaliações registradas</h2>
        {loading ? (
          <p className="muted">Carregando avaliações...</p>
        ) : (
          <Table
            columns={columns}
            rows={avaliacoes}
            emptyMessage="Nenhuma avaliação encontrada."
            renderActions={canEvaluate ? renderAvaliacaoActions : undefined}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
