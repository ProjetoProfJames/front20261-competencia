"use client";

import { use, useEffect, useState } from "react";
import { api } from "@/services/api";

const initialForm = {
  nota: "",
  comentario: "",
};

function getAvaliador(avaliacao) {
  return avaliacao.avaliador?.username || avaliacao.avaliador?.nome || avaliacao.avaliador?.email || avaliacao.avaliadorId || "-";
}

export default function ProjetoAvaliacoesPage({ params }) {
  const { id: projectId } = use(params);

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (projectId) {
      carregarAvaliacoes();
    }
  }, [projectId]);

  const carregarAvaliacoes = async () => {
    try {
      setLoading(true);
      setError("");

      const resposta = await api.get("/api/avaliacoes", { projetoId: Number(projectId) });
      const dados = resposta?.data || [];
      setAvaliacoes(Array.isArray(dados) ? dados : [dados]);
    } catch (err) {
      setAvaliacoes([]);
      setError(err.message || "Não foi possível carregar as avaliações.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.nota) {
      setError("Informe a nota da avaliação.");
      return;
    }

    const payload = {
      nota: Number(form.nota),
      comentario: form.comentario,
    };

    try {
      if (editingId) {
        await api.put(`/api/projetos/${projectId}/avaliacoes/${editingId}`, payload);
        setSuccess("Avaliação atualizada com sucesso.");
      } else {
        await api.post(`/api/projetos/${projectId}/avaliacoes`, payload);
        setSuccess("Avaliação cadastrada com sucesso.");
      }

      resetForm();
      carregarAvaliacoes();
    } catch (err) {
      setError(err.message || "Erro ao salvar a avaliação.");
    }
  };

  const handleEditar = (avaliacao) => {
    setEditingId(avaliacao.id);
    setForm({
      nota: avaliacao.nota ?? "",
      comentario: avaliacao.comentario || "",
    });
    setError("");
    setSuccess("");
  };

  const handleExcluir = async (id) => {
    if (!confirm("Deseja remover esta avaliação?")) {
      return;
    }

    try {
      await api.delete(`/api/projetos/${projectId}/avaliacoes/${id}`);
      setSuccess("Avaliação removida com sucesso.");
      carregarAvaliacoes();
    } catch (err) {
      setError(err.message || "Erro ao remover a avaliação.");
    }
  };

  return (
    <div>
      <h2>Avaliações do Projeto #{projectId}</h2>
      <p>Cadastre, edite e acompanhe as avaliações vinculadas a este projeto.</p>

      <form onSubmit={handleSalvar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>{editingId ? "Editar Avaliação" : "Nova Avaliação"}</h3>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div style={{ display: "grid", gap: "1rem" }}>
          <input
            type="number"
            name="nota"
            placeholder="Nota"
            min="0"
            max="10"
            step="0.1"
            value={form.nota}
            onChange={handleChange}
          />

          <input
            type="text"
            name="comentario"
            placeholder="Comentário"
            value={form.comentario}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" style={{ padding: "0.8rem 2rem" }}>
              {editingId ? "Salvar alteração" : "Cadastrar avaliação"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: "0.8rem 2rem", backgroundColor: "#6c757d" }}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <section>
        <h3>Avaliações Cadastradas</h3>
        {loading ? (
          <p>Carregando avaliações...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Avaliador</th>
                <th>Nota</th>
                <th>Comentário</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.map((avaliacao) => (
                <tr key={avaliacao.id}>
                  <td>{avaliacao.id}</td>
                  <td>{getAvaliador(avaliacao)}</td>
                  <td>{avaliacao.nota}</td>
                  <td>{avaliacao.comentario || "Sem comentário"}</td>
                  <td>
                    <button type="button" onClick={() => handleEditar(avaliacao)}>Editar</button>
                    <button type="button" onClick={() => handleExcluir(avaliacao.id)} style={{ backgroundColor: "#dc3545" }}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {avaliacoes.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Nenhuma avaliação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
