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
  dataInicio: "",
  dataFim: "",
};

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default function PeriodosLetivosPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingPeriodo, setEditingPeriodo] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = currentUser?.profile === "ADMIN";

  const columns = useMemo(() => [
    { key: "nome", label: "Período Letivo" },
    {
      key: "dataInicio",
      label: "Início",
      render: (periodo) => formatDate(periodo.dataInicio),
    },
    {
      key: "dataFim",
      label: "Fim",
      render: (periodo) => formatDate(periodo.dataFim),
    },
    { key: "updatedBy", label: "Atualizado por" },
  ], []);

  const loadPeriodos = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/semestres");
      setPeriodos(data || []);
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
      loadPeriodos();
    } else {
      setLoading(false);
    }
  }, [loadPeriodos]);

  const openCreateForm = () => {
    setEditingPeriodo(null);
    setForm(emptyForm);
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const openEditForm = (periodo) => {
    setEditingPeriodo(periodo);
    setForm({
      nome: periodo.nome || "",
      dataInicio: periodo.dataInicio || "",
      dataFim: periodo.dataFim || "",
    });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingPeriodo(null);
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
    const nome = form.nome.trim();

    if (!nome) {
      validationErrors.nome = "Informe o nome do período letivo.";
    } else if (nome.length > 120) {
      validationErrors.nome = "O nome deve ter até 120 caracteres.";
    }

    if (!form.dataInicio) {
      validationErrors.dataInicio = "Informe a data de início.";
    }

    if (!form.dataFim) {
      validationErrors.dataFim = "Informe a data de fim.";
    }

    if (form.dataInicio && form.dataFim && form.dataFim < form.dataInicio) {
      validationErrors.dataFim = "A data de fim deve ser maior ou igual à data de início.";
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
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
      };

      if (editingPeriodo) {
        await apiRequest(`/semestres/${editingPeriodo.id}`, {
          method: "PUT",
          body,
        });

        setStatus({ type: "success", message: "Período letivo atualizado com sucesso." });
      } else {
        await apiRequest("/semestres", {
          method: "POST",
          body,
        });

        setStatus({ type: "success", message: "Período letivo cadastrado com sucesso." });
      }

      closeForm();
      await loadPeriodos();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (periodo) => {
    const confirmed = window.confirm(`Deseja excluir o período letivo ${periodo.nome}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(periodo.id);
    setStatus(null);

    try {
      await apiRequest(`/semestres/${periodo.id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Período letivo excluído com sucesso." });
      await loadPeriodos();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const renderActions = (periodo) => (
    <div className="row-actions">
      <Button variant="secondary" onClick={() => openEditForm(periodo)}>
        Editar
      </Button>
      <Button
        variant="danger"
        onClick={() => handleDelete(periodo)}
        disabled={deletingId === periodo.id}
      >
        {deletingId === periodo.id ? "Excluindo..." : "Excluir"}
      </Button>
    </div>
  );

  return (
    <AuthenticatedLayout>
      <section className="page-header">
        <div className="page-title">
          <h1>Períodos Letivos</h1>
          <p>Cadastre e consulte os períodos letivos usados nas turmas.</p>
        </div>
        {isAdmin && (
          <div className="page-actions">
            <Button onClick={openCreateForm}>Novo período</Button>
          </div>
        )}
      </section>

      {status && <div className={`status status-${status.type}`}>{status.message}</div>}

      {formOpen && isAdmin && (
        <section className="panel">
          <h2>{editingPeriodo ? "Editar período letivo" : "Cadastrar período letivo"}</h2>
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
                placeholder="Exemplo: 2026/1"
              />
              <FormInput
                label="Data de início"
                type="date"
                name="dataInicio"
                value={form.dataInicio}
                onChange={handleChange}
                error={errors.dataInicio}
                required
              />
              <FormInput
                label="Data de fim"
                type="date"
                name="dataFim"
                value={form.dataFim}
                onChange={handleChange}
                error={errors.dataFim}
                required
              />
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
          <p className="muted">Carregando períodos letivos...</p>
        ) : (
          <Table
            columns={columns}
            rows={periodos}
            emptyMessage="Nenhum período letivo encontrado."
            renderActions={isAdmin ? renderActions : undefined}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
