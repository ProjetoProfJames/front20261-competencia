"use client";

import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [cursoIds, setCursoIds] = useState("");
  const [disciplinaId, setDisciplinaId] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [professorIds, setProfessorIds] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [turmasResp, cursosResp, semestresResp, disciplinasResp, usuariosResp] = await Promise.all([
        api.get("/api/turmas"),
        api.get("/api/cursos"),
        api.get("/api/semestres"),
        api.get("/api/disciplinas"),
        api.get("/api/users"),
      ]);

      setTurmas(turmasResp.data || []);
      setCursos(cursosResp.data || []);
      setSemestres(semestresResp.data || []);
      setDisciplinas(disciplinasResp.data || []);
      setUsuarios(usuariosResp.data || []);
    } catch (err) {
      setError("Não foi possível carregar os dados de turma. Verifique a conexão com o servidor.");
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
    setCursoIds("");
    setDisciplinaId("");
    setSemestreId("");
    setProfessorIds("");
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSalvar = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!nome || !cursoIds.trim() || !disciplinaId || !semestreId || !professorIds.trim()) {
      setError("Preencha todos os campos obrigatórios da turma.");
      return;
    }

    const cursoIdList = parseIdList(cursoIds);
    const professorIdList = parseIdList(professorIds);

    if (cursoIdList.length === 0 || professorIdList.length === 0) {
      setError("Informe IDs válidos para curso(s) e professor(es).");
      return;
    }

    const payload = {
      nome,
      cursoIds: [...new Set(cursoIdList)],
      disciplinaId: Number(disciplinaId),
      semestreId: Number(semestreId),
      professorIds: [...new Set(professorIdList)],
    };

    try {
      if (editingId) {
        await api.put(`/api/turmas/${editingId}`, payload);
        setSuccess("Turma atualizada com sucesso.");
      } else {
        await api.post("/api/turmas", payload);
        setSuccess("Turma cadastrada com sucesso.");
      }
      resetForm();
      carregarDados();
    } catch (err) {
      setError("Erro ao salvar a turma. Verifique os dados e tente novamente.");
    }
  };

  const handleEditar = (turma) => {
    setEditingId(turma.id);
    setNome(turma.nome || "");
    setCursoIds((turma.cursos || []).map((curso) => curso.id).join(", "));
    setDisciplinaId(turma.disciplina?.id || "");
    setSemestreId(turma.semestre?.id || "");
    setProfessorIds((turma.professores || []).map((prof) => prof.id).join(", "));
    setError("");
    setSuccess("");
  };

  const handleExcluir = async (id) => {
    if (!confirm("Deseja remover esta turma?")) {
      return;
    }

    try {
      await api.delete(`/api/turmas/${id}`);
      setSuccess("Turma removida com sucesso.");
      carregarDados();
    } catch (err) {
      setError("Erro ao remover a turma.");
    }
  };

  return (
    <div>
      <h2>Gestão de Turmas</h2>
      <p>Cadastre e atualize turmas com curso, disciplina, semestre e professores.</p>

      <form onSubmit={handleSalvar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>{editingId ? "Editar Turma" : "Nova Turma"}</h3>
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>{success}</p>}

        <div style={{ display: "grid", gap: "1rem" }}>
          <input
            type="text"
            placeholder="Nome da turma"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <select value={disciplinaId} onChange={(e) => setDisciplinaId(e.target.value)}>
            <option value="">Selecione a disciplina</option>
            {disciplinas.map((disciplina) => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </option>
            ))}
          </select>

          <select value={semestreId} onChange={(e) => setSemestreId(e.target.value)}>
            <option value="">Selecione o semestre</option>
            {semestres.map((semestre) => (
              <option key={semestre.id} value={semestre.id}>
                {semestre.nome}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="IDs de cursos separados por vírgula"
            value={cursoIds}
            onChange={(e) => setCursoIds(e.target.value)}
          />

          <input
            type="text"
            placeholder="IDs de professores separados por vírgula"
            value={professorIds}
            onChange={(e) => setProfessorIds(e.target.value)}
          />

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" style={{ padding: "0.8rem 2rem" }}>
              {editingId ? "Salvar alteração" : "Cadastrar turma"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ padding: "0.8rem 2rem", backgroundColor: "#6c757d" }}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: "1rem", color: "#333" }}>
          <p style={{ fontSize: "0.9rem" }}>
            Dica: use vírgulas para separar IDs. Exemplo: <strong>1, 2, 3</strong>.
          </p>
          <p style={{ fontSize: "0.9rem" }}>
            Se você precisar consultar IDs, abra as páginas de cursos, semestres e usuários.
          </p>
        </div>
      </form>

      <section>
        <h3>Turmas Cadastradas</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Cursos</th>
              <th>Disciplina</th>
              <th>Semestre</th>
              <th>Professores</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((turma) => (
              <tr key={turma.id}>
                <td>{turma.id}</td>
                <td>{turma.nome}</td>
                <td>{(turma.cursos || []).map((curso) => curso.nome).join(", ") || "-"}</td>
                <td>{turma.disciplina?.nome || "-"}</td>
                <td>{turma.semestre?.nome || "-"}</td>
                <td>{(turma.professores || []).map((prof) => prof.username || prof.email).join(", ") || "-"}</td>
                <td>
                  <button type="button" onClick={() => handleEditar(turma)}>Editar</button>
                  <button type="button" onClick={() => handleExcluir(turma.id)} style={{ backgroundColor: "#dc3545" }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {turmas.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Nenhuma turma encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}