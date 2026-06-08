"use client";

import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function SemestresPage() {
  const [semestres, setSemestres] = useState([]);
  const [nome, setNome] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    carregarSemestres();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const carregarSemestres = async () => {
    try {
      const resposta = await api.get("/semestres", {}, { headers: getAuthHeaders() });
      setSemestres(resposta.data || []);
    } catch (err) {
      setError("Não foi possível carregar os períodos letivos.");
    }
  };

  const resetForm = () => {
    setNome("");
    setDataInicio("");
    setDataFim("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSalvar = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!nome || !dataInicio || !dataFim) {
      setError("Preencha nome, data de início e data de término.");
      return;
    }

    if (dataInicio > dataFim) {
      setError("A data de início deve ser anterior ou igual à data de término.");
      return;
    }

    const payload = {
      nome,
      dataInicio,
      dataFim,
    };

    try {
      if (editingId) {
        await api.put(`/semestres/${editingId}`, payload, { headers: getAuthHeaders() });
        setSuccess("Período letivo atualizado com sucesso.");
      } else {
        await api.post("/semestres", payload, { headers: getAuthHeaders() });
        setSuccess("Período letivo cadastrado com sucesso.");
      }
      resetForm();
      carregarSemestres();
    } catch (err) {
      setError("Erro ao salvar o período letivo.");
    }
  };

  const handleEditar = (semestre) => {
    setEditingId(semestre.id);
    setNome(semestre.nome || "");
    setDataInicio(semestre.dataInicio || "");
    setDataFim(semestre.dataFim || "");
    setError("");
    setSuccess("");
  };

  const handleExcluir = async (id) => {
    if (!confirm("Deseja remover este período letivo?")) {
      return;
    }

    try {
      await api.delete(`/semestres/${id}`, { headers: getAuthHeaders() });
      setSuccess("Período letivo removido com sucesso.");
      carregarSemestres();
    } catch (err) {
      setError("Erro ao remover o período letivo.");
    }
  };

  return (
    <div>
      <h2>Gestão de Períodos Letivos</h2>
      <p>Cadastre e atualize semestres para organizar os períodos de apresentação de projetos.</p>

      <form onSubmit={handleSalvar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>{editingId ? "Editar Período" : "Novo Período"}</h3>
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>{success}</p>}

        <div style={{ display: "grid", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nome do período letivo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" style={{ padding: "0.8rem 2rem" }}>
              {editingId ? "Salvar alteração" : "Cadastrar período"}
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
        <h3>Períodos Cadastrados</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Início</th>
              <th>Término</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {semestres.map((semestre) => (
              <tr key={semestre.id}>
                <td>{semestre.id}</td>
                <td>{semestre.nome}</td>
                <td>{semestre.dataInicio}</td>
                <td>{semestre.dataFim}</td>
                <td>
                  <button type="button" onClick={() => handleEditar(semestre)}>Editar</button>
                  <button type="button" onClick={() => handleExcluir(semestre.id)} style={{ backgroundColor: "#dc3545" }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {semestres.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhum período letivo encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
