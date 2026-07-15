'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { createLocal, deleteLocal, getLocais, getStoredAuth, updateLocal } from "@/lib/api";

const emptyLocal = { numero: "" };

export default function LocaisPage() {
  const router = useRouter();
  const [locais, setLocais] = useState([]);
  const [form, setForm] = useState(emptyLocal);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useState(getStoredAuth);
  const profile = auth?.user?.profile;

  useEffect(() => {
    if (!auth) {
      router.replace("/login");
      return;
    }

    if (!["ADMIN", "COORDENADOR", "PROFESSOR", "ALUNO"].includes(profile)) {
      router.replace("/");
      return;
    }

    loadLocais();
  }, [auth, profile, router]);

  const loadLocais = async () => {
    setLoading(true);
    try {
      const data = await getLocais();
      setLocais(data || []);
    } catch (err) {
      setError(err.message || "Não foi possível carregar locais.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyLocal);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.numero.trim()) {
      setError("Informe o número ou nome do local.");
      return;
    }

    try {
      if (editingId) {
        await updateLocal(editingId, { numero: form.numero });
        setMessage("Local atualizado com sucesso.");
      } else {
        await createLocal({ numero: form.numero });
        setMessage("Local cadastrado com sucesso.");
      }

      resetForm();
      loadLocais();
    } catch (err) {
      setError(err.message || "Não foi possível salvar o local.");
    }
  };

  const handleEdit = (local) => {
    setEditingId(local.id);
    setForm({ numero: local.numero });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja remover este local?")) {
      return;
    }

    try {
      await deleteLocal(id);
      setMessage("Local removido.");
      loadLocais();
    } catch (err) {
      setError(err.message || "Não foi possível remover o local.");
    }
  };

  return (
    <AppShell>
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Locais de apresentação</h2>
            <p>Cadastre os locais disponíveis para os projetos.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Número / nome do local
            <input name="numero" value={form.numero} onChange={handleChange} required />
          </label>
          <div className="actions-row">
            <button type="submit" className="primary-button">{editingId ? "Salvar" : "Cadastrar"}</button>
            <button type="button" className="ghost-button" onClick={resetForm}>Limpar</button>
          </div>
        </form>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {loading ? <p>Carregando...</p> : null}

        <table className="data-table">
          <thead>
            <tr>
              <th>Local</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {locais.map((local) => (
              <tr key={local.id}>
                <td>{local.numero}</td>
                <td>
                  <button type="button" className="ghost-button" onClick={() => handleEdit(local)}>
                    Editar
                  </button>
                  <button type="button" className="ghost-button" onClick={() => handleDelete(local.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
