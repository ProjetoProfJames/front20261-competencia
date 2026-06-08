"use client";

import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [coordenadorId, setCoordenadorId] = useState("");
  const [professorIds, setProfessorIds] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCursos();
    carregarUsuarios();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  const carregarCursos = async () => {
    try {
      setLoading(true);
      const resposta = await api.get("/cursos", {}, { headers: getAuthHeaders() });
      setCursos(resposta.data || []);
    } catch (err) {
      setError("Não foi possível carregar os cursos.");
    } finally {
      setLoading(false);
    }
  };

  const carregarUsuarios = async () => {
    try {
      const resposta = await api.get("/users", {}, { headers: getAuthHeaders() });
      setUsuarios(resposta.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setNome("");
    setCoordenadorId("");
    setProfessorIds("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSalvar = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!nome || !coordenadorId || !professorIds.trim()) {
      setError("Preencha nome, coordenador e professores.");
      return;
    }

    const professorIdList = professorIds
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map(Number)
      .filter((value) => !Number.isNaN(value));

    if (professorIdList.length === 0) {
      setError("Informe pelo menos um ID de professor válido.");
      return;
    }

    const payload = {
      nome,
      coordenadorId: Number(coordenadorId),
      professorIds: [...new Set(professorIdList)],
    };

    try {
      if (editingId) {
        await api.put(`/cursos/${editingId}`, payload, { headers: getAuthHeaders() });
        setSuccess("Curso atualizado com sucesso.");
      } else {
        await api.post("/cursos", payload, { headers: getAuthHeaders() });
        setSuccess("Curso cadastrado com sucesso.");
      }
      resetForm();
      carregarCursos();
    } catch (err) {
      setError("Erro ao salvar o curso. Verifique os dados e tente novamente.");
    }
  };

  const handleEditar = (curso) => {
    setEditingId(curso.id);
    setNome(curso.nome || "");
    setCoordenadorId(curso.coordenador?.id || "");
    setProfessorIds((curso.professores || []).map((prof) => prof.id).join(", "));
    setError("");
    setSuccess("");
  };

  const handleCancelar = () => {
    resetForm();
  };

  const handleExcluir = async (id) => {
    if (!confirm("Deseja remover este curso?")) {
      return;
    }

    try {
      await api.delete(`/cursos/${id}`, { headers: getAuthHeaders() });
      setSuccess("Curso removido com sucesso.");
      carregarCursos();
    } catch (err) {
      setError("Erro ao remover o curso.");
    }
  };

  return (
    <div>
      <h2>Gestão de Cursos</h2>
      <p>Liste, cadastre e edite cursos com coordenador e professores associados.</p>

      <form onSubmit={handleSalvar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>{editingId ? "Editar Curso" : "Novo Curso"}</h3>
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>{success}</p>}

        <div style={{ display: "grid", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nome do curso"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <select value={coordenadorId} onChange={(e) => setCoordenadorId(e.target.value)}>
            <option value="">Selecione o coordenador</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome || usuario.username} ({usuario.profile})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="IDs de professores separados por vírgula"
            value={professorIds}
            onChange={(e) => setProfessorIds(e.target.value)}
          />

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" style={{ padding: "0.8rem 2rem" }}>
              {editingId ? "Salvar alteração" : "Cadastrar curso"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelar} style={{ padding: "0.8rem 2rem", backgroundColor: "#6c757d" }}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>

      <section>
        <h3>Cursos Cadastrados</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Coordenador</th>
              <th>Professores</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.id}</td>
                <td>{curso.nome}</td>
                <td>{curso.coordenador?.nome || curso.coordenador?.username || "-"}</td>
                <td>{(curso.professores || []).map((prof) => prof.username || prof.nome).join(", ") || "-"}</td>
                <td>
                  <button type="button" onClick={() => handleEditar(curso)}>Editar</button>
                  <button type="button" onClick={() => handleExcluir(curso.id)} style={{ backgroundColor: "#dc3545" }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhum curso encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
