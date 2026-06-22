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

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [cursosResp, usuariosResp] = await Promise.all([
        api.get("/api/cursos"),
        api.get("/api/users"),
      ]);

      setCursos(cursosResp.data || []);
      setUsuarios(usuariosResp.data || []);
    } catch (err) {
      setError("Não foi possível carregar cursos e usuários.");
    }
  };

  const parseIdList = (value) =>
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map(Number)
      .filter((number) => !Number.isNaN(number));

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
      setError("Preencha nome, coordenador e professor(es).");
      return;
    }

    const professores = parseIdList(professorIds);

    if (professores.length === 0) {
      setError("Informe ao menos um ID de professor válido.");
      return;
    }

    const payload = {
      nome,
      coordenadorId: Number(coordenadorId),
      professorIds: [...new Set(professores)],
    };

    try {
      if (editingId) {
        await api.put(`/api/cursos/${editingId}`, payload);
        setSuccess("Curso atualizado com sucesso.");
      } else {
        await api.post("/api/cursos", payload);
        setSuccess("Curso cadastrado com sucesso.");
      }

      resetForm();
      carregarDados();
    } catch (err) {
      setError("Erro ao salvar o curso. Verifique os dados e tente novamente.");
    }
  };

  const handleEditar = (curso) => {
    setEditingId(curso.id);
    setNome(curso.nome || "");
    setCoordenadorId(curso.coordenador?.id || curso.coordenadorId || "");
    setProfessorIds((curso.professores || []).map((professor) => professor.id).join(", "));
    setError("");
    setSuccess("");
  };

  const handleExcluir = async (id) => {
    if (!confirm("Deseja remover este curso?")) {
      return;
    }

    try {
      await api.delete(`/api/cursos/${id}`);
      setSuccess("Curso removido com sucesso.");
      carregarDados();
    } catch (err) {
      setError("Erro ao remover o curso.");
    }
  };

  return (
    <div>
      <h2>Gestão de Cursos</h2>
      <p>Cadastre e atualize cursos com coordenador e professores responsáveis.</p>

      <form onSubmit={handleSalvar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>{editingId ? "Editar Curso" : "Novo Curso"}</h3>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

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
                {usuario.nome || usuario.username || usuario.email} (ID: {usuario.id})
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
              <button type="button" onClick={resetForm} style={{ padding: "0.8rem 2rem", backgroundColor: "#6c757d" }}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        <p style={{ fontSize: "0.9rem", color: "#333" }}>
          Use vírgulas para separar professores. Exemplo: <strong>1, 2, 3</strong>.
        </p>
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
                <td>{curso.coordenador?.username || curso.coordenador?.nome || curso.coordenador?.email || "-"}</td>
                <td>{(curso.professores || []).map((professor) => professor.username || professor.nome || professor.email).join(", ") || "-"}</td>
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
