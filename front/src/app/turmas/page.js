'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cursoIds: [],
    semestreId: "",
    disciplinaId: "",
    professorIds: []
  });

  const [isMatriculaModalOpen, setIsMatriculaModalOpen] = useState(false);
  const [turmaMatricula, setTurmaMatricula] = useState(null);
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userProfile = parsedUser.profile || parsedUser.perfil || parsedUser.role || "";
      setPerfil(userProfile.toUpperCase());
    }
  }, []);

  const podeEditarEstrutura = perfil === "PROFESSOR" || perfil === "ROLE_PROFESSOR";
  const podeExcluir = perfil === "PROFESSOR" || perfil === "ROLE_PROFESSOR" || perfil === "ADMIN" || perfil === "ROLE_ADMIN" || perfil === "COORDENADOR" || perfil === "ROLE_COORDENADOR";
  const podeMatricular = perfil === "PROFESSOR" || perfil === "ROLE_PROFESSOR" || perfil === "ADMIN" || perfil === "ROLE_ADMIN";

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      const fetchJson = async (url) => {
        try {
          const res = await fetch(url, { headers });
          return res.ok ? await res.json() : [];
        } catch (e) {
          return [];
        }
      };

      const [dataTurmas, dataCursos, dataSemestres, dataUsers, dataDisciplinas] = await Promise.all([
        fetchJson("http://localhost:8080/api/turmas"),
        fetchJson("http://localhost:8080/api/cursos"),
        fetchJson("http://localhost:8080/api/semestres"),
        fetchJson("http://localhost:8080/api/users"),
        fetchJson("http://localhost:8080/api/disciplinas")
      ]);

      const extractData = (data) => Array.isArray(data) ? data : data?.content || data?.data || [];

      setTurmas(extractData(dataTurmas));
      setCursos(extractData(dataCursos));
      setSemestres(extractData(dataSemestres));
      setUsuarios(extractData(dataUsers));
      setDisciplinas(extractData(dataDisciplinas));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, selectedOptions } = e.target;
    const values = Array.from(selectedOptions, option => option.value);
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleEdit = (turma) => {
    setEditingId(turma.id);
    setFormData({
      nome: turma.nome,
      cursoIds: turma.cursos?.map(c => c.id) || turma.cursoIds || [],
      semestreId: turma.semestre?.id || turma.semestreId || "",
      disciplinaId: turma.disciplina?.id || turma.disciplinaId || "",
      professorIds: turma.professores?.map(p => p.id) || turma.professorIds || []
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir esta turma?")) return;
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:8080/api/turmas/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Erro ao apagar turma.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = editingId
      ? `http://localhost:8080/api/turmas/${editingId}`
      : "http://localhost:8080/api/turmas";

    const method = editingId ? "PUT" : "POST";

    const payload = {
      nome: formData.nome,
      cursoIds: formData.cursoIds.map(id => parseInt(id)),
      semestreId: parseInt(formData.semestreId),
      disciplinaId: parseInt(formData.disciplinaId),
      professorIds: formData.professorIds.map(id => parseInt(id))
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error || "Erro de regra de negócio. Verifique os dados.";
        throw new Error(errorMessage);
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ nome: "", cursoIds: [], semestreId: "", disciplinaId: "", professorIds: [] });
      fetchData();
    } catch (err) {
      alert(`Falha ao guardar:\n${err.message}`);
    }
  };

  const abrirModalMatricula = (turma) => {
    setTurmaMatricula(turma);
    setAlunoSelecionadoId("");
    setIsMatriculaModalOpen(true);
  };

  const handleMatricularAluno = async (e) => {
    e.preventDefault();
    if (!alunoSelecionadoId) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/turmas/${turmaMatricula.id}/alunos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ alunoId: parseInt(alunoSelecionadoId) })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro desconhecido");
      }

      setAlunoSelecionadoId("");
      fetchData();

      const resTurma = await fetch(`http://localhost:8080/api/turmas/${turmaMatricula.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resTurma.ok) {
        const turmaAtualizada = await resTurma.json();
        setTurmaMatricula(turmaAtualizada.data || turmaAtualizada);
      }
    } catch (err) {
      alert(`Erro ao matricular aluno:\n${err.message}`);
    }
  };

  const handleRemoverAluno = async (alunoId) => {
    if (!confirm("Deseja realmente remover este aluno da turma?")) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:8080/api/turmas/${turmaMatricula.id}/alunos/${alunoId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Erro ao remover");
      fetchData();

      setTurmaMatricula(prev => ({
        ...prev,
        alunos: prev.alunos.filter(a => a.id !== alunoId)
      }));
    } catch (err) {
      alert("Erro ao remover aluno.");
    }
  };

  const professores = usuarios.filter(u => {
    const p = (u.profile || u.perfil || u.role || "").toUpperCase();
    return p === "PROFESSOR" || p === "ROLE_PROFESSOR";
  });

  const alunos = usuarios.filter(u => {
    const p = (u.profile || u.perfil || u.role || "").toUpperCase();
    return p === "ALUNO" || p === "ROLE_ALUNO";
  });

  // Eis a peneira inteligente em funcionamento!
  const alunosDisponiveis = turmaMatricula 
    ? alunos.filter(a => !(turmaMatricula.alunos || []).some(matriculado => matriculado.id === a.id))
    : [];

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Turma", accessor: "nome" },
    {
      header: "Semestre",
      render: (turma) => turma.semestre?.nome || turma.semestreNome || ""
    },
    {
      header: "Matriculados",
      render: (turma) => turma.alunos ? `${turma.alunos.length} aluno(s)` : "0 alunos"
    },
    {
      header: "Ações",
      render: (turma) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {podeMatricular && (
            <Button onClick={() => abrirModalMatricula(turma)} style={{ backgroundColor: "#28a745" }}>Matricular</Button>
          )}
          {podeEditarEstrutura && (
            <Button onClick={() => handleEdit(turma)}>Editar</Button>
          )}
          {podeExcluir && (
            <Button variant="danger" onClick={() => handleDelete(turma.id)}>Excluir</Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="container" style={{ alignItems: "stretch", justifyContent: "flex-start", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="title">Gestão de Turmas</h1>
        {!isFormOpen && podeEditarEstrutura && (
          <Button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ nome: "", cursoIds: [], semestreId: "", disciplinaId: "", professorIds: [] }); }}>
            + Nova Turma
          </Button>
        )}
      </div>

      {isFormOpen && podeEditarEstrutura && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "20px", textAlign: "left", maxWidth: "600px", alignSelf: "center" }}>
          <h2 className="subtitle">{editingId ? "Editar Estrutura da Turma" : "Nova Turma"}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <FormInput label="Nome da Turma" name="nome" value={formData.nome} onChange={handleInputChange} required />

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Cursos (Ctrl/Cmd para múltiplos)</label>
              <select name="cursoIds" multiple value={formData.cursoIds} onChange={handleMultiSelectChange} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white", minHeight: "60px" }}>
                {cursos.map((c) => <option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Semestre Letivo</label>
              <select name="semestreId" value={formData.semestreId} onChange={handleInputChange} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white" }}>
                <option value="">Selecione um semestre...</option>
                {semestres.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Disciplina</label>
              <select name="disciplinaId" value={formData.disciplinaId} onChange={handleInputChange} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white" }}>
                <option value="">Selecione uma disciplina...</option>
                {disciplinas.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Professores (Ctrl/Cmd para múltiplos)</label>
              <select name="professorIds" multiple value={formData.professorIds} onChange={handleMultiSelectChange} required style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white", minHeight: "60px" }}>
                {professores.map((p) => <option key={p.id} value={p.id}>{p.nome || p.username || p.email}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Button type="submit">Guardar</Button>
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </form>
      )}

      {loading ? <p>A carregar dados...</p> : <Table columns={columns} data={turmas} />}

      {isMatriculaModalOpen && turmaMatricula && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px", backgroundColor: "white", padding: "20px", borderRadius: "8px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2 className="subtitle" style={{ margin: 0 }}>Matrículas: {turmaMatricula.nome}</h2>
              <button onClick={() => setIsMatriculaModalOpen(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", fontWeight: "bold" }}>X</button>
            </div>

            <form onSubmit={handleMatricularAluno} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <select
                value={alunoSelecionadoId}
                onChange={(e) => setAlunoSelecionadoId(e.target.value)}
                required
                style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                <option value="">Selecione um aluno para matricular...</option>
                {alunosDisponiveis.map(a => <option key={a.id} value={a.id}>{a.nome || a.username} ({a.email})</option>)}
              </select>
              <Button type="submit" style={{ backgroundColor: "#28a745" }}>+ Adicionar</Button>
            </form>

            <hr style={{ borderTop: "1px solid #eee", marginBottom: "15px" }} />

            <h3 style={{ fontSize: "16px", marginBottom: "10px", color: "#333" }}>Alunos Matriculados ({turmaMatricula.alunos?.length || 0})</h3>
            <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #eee", borderRadius: "4px", padding: "10px", backgroundColor: "#fcfcfc" }}>
              {turmaMatricula.alunos && turmaMatricula.alunos.length > 0 ? (
                turmaMatricula.alunos.map(aluno => (
                  <div key={aluno.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
                    <span style={{ fontSize: "14px", color: "#555" }}>{aluno.nome || aluno.username}</span>
                    <button type="button" onClick={() => handleRemoverAluno(aluno.id)} style={{ backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}>Remover</button>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "13px", color: "#999", margin: 0, textAlign: "center" }}>Nenhum aluno matriculado nesta turma.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}