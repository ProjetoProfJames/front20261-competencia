"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import { apiRequest } from "@/lib/api";
import { getCurrentUser, hasAnyProfile } from "@/lib/auth";

const emptyForm = {
  numero: "",
};

export default function LocaisPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [locais, setLocais] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingLocal, setEditingLocal] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const canManage = hasAnyProfile(currentUser, ["ADMIN", "COORDENADOR"]);

  const columns = useMemo(() => [
    { key: "id", label: "ID" },
    { key: "numero", label: "Local" },
    { key: "updatedBy", label: "Atualizado por" },
  ], []);

  const loadLocais = useCallback(async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/locais");
      setLocais(data || []);
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
      loadLocais();
    } else {
      setLoading(false);
    }
  }, [loadLocais]);

  const openCreateForm = () => {
    setEditingLocal(null);
    setForm(emptyForm);
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const openEditForm = (local) => {
    setEditingLocal(local);
    setForm({ numero: local.numero || "" });
    setErrors({});
    setStatus(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setEditingLocal(null);
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
    const numero = form.numero.trim();

    if (!numero) {
      validationErrors.numero = "Informe o local.";
    } else if (numero.length > 40) {
      validationErrors.numero = "O local deve ter até 40 caracteres.";
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
      if (editingLocal) {
        await apiRequest(`/locais/${editingLocal.id}`, {
          method: "PUT",
          body: {
            numero: form.numero.trim(),
          },
        });

        setStatus({ type: "success", message: "Local atualizado com sucesso." });
      } else {
        await apiRequest("/locais", {
          method: "POST",
          body: {
            numero: form.numero.trim(),
          },
        });

        setStatus({ type: "success", message: "Local cadastrado com sucesso." });
      }

      closeForm();
      await loadLocais();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (local) => {
    const confirmed = window.confirm(`Deseja excluir o local ${local.numero}?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(local.id);
    setStatus(null);

    try {
      await apiRequest(`/locais/${local.id}`, { method: "DELETE" });
      setStatus({ type: "success", message: "Local excluído com sucesso." });
      await loadLocais();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  const renderActions = (local) => (
    <div className="row-actions">
      <Button variant="secondary" onClick={() => openEditForm(local)}>
        Editar
      </Button>
      <Button
        variant="danger"
        onClick={() => handleDelete(local)}
        disabled={deletingId === local.id}
      >
        {deletingId === local.id ? "Excluindo..." : "Excluir"}
      </Button>
    </div>
  );

  return (
    <AuthenticatedLayout>
      <section className="page-header">
        <div className="page-title">
          <h1>Locais de apresentação</h1>
          <p>Cadastre e consulte os locais disponíveis para apresentação dos projetos.</p>
        </div>
        {canManage && (
          <div className="page-actions">
            <Button onClick={openCreateForm}>Novo local</Button>
          </div>
        )}
      </section>

      {status && <div className={`status status-${status.type}`}>{status.message}</div>}

      {formOpen && canManage && (
        <section className="panel">
          <h2>{editingLocal ? "Editar local" : "Cadastrar local"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <FormInput
                label="Local"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                error={errors.numero}
                required
                maxLength={40}
                placeholder="Exemplo: A01"
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
          <p className="muted">Carregando locais...</p>
        ) : (
          <Table
            columns={columns}
            rows={locais}
            emptyMessage="Nenhum local encontrado."
            renderActions={canManage ? renderActions : undefined}
          />
        )}
      </section>
    </AuthenticatedLayout>
  );
}
