'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [professores, setProfessores] = useState([]);
  
  const [form, setForm] = useState({ 
    id: null, 
    nome: "", 
    semestreId: "", 
    disciplinaId: "", 
    cursoIds: [], 
    professorIds: [] 
  });
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      const [resTurmas, resSemestres, resCursos, resDisciplinas, resUsers] = await Promise.all([
        fetch("/api/turmas", { headers }),
        fetch("/api/semestres", { headers }),
        fetch("/api/cursos", { headers }),
        fetch("/api/disciplinas", { headers }),
        fetch("/api/users", { headers })
      ]);

      if (resTurmas.ok) setTurmas((await resTurmas.json()).data || []);
      if (resSemestres.ok) setSemestres((await resSemestres.json()).data || []);
      if (resCursos.ok) setCursos((await resCursos.json()).data || []);
      if (resDisciplinas.ok) setDisciplinas((await resDisciplinas.json()).data || []);
      
      if (resUsers.ok) {
        const users = (await resUsers.json()).data || [];
        setProfessores(users.filter(u => u.profile === "PROFESSOR" || u.tipo === "PROFESSOR"));
      }
    } catch (err) {
      setError("Erro ao buscar dados do servidor.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultipleSelect = (field, id) => {
    setForm(prev => {
      const list = prev[field];
      const isSelected = list.includes(id);
      const newList = isSelected ? list.filter(item => item !== id) : [...list, id];
      return { ...prev, [field]: newList };
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.nome || !form.semestreId || !form.disciplinaId || form.cursoIds.length === 0 || form.professorIds.length === 0) {
      setError("Por favor, preencha todos os campos e selecione os relacionamentos necessários.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/turmas/${form.id}` : "/api/turmas";
      const method = form.id ? "PUT" : "POST";

      const payload = {
        nome: form.nome,
        semestreId: parseInt(form.semestreId),
        disciplinaId: parseInt(form.disciplinaId),
        cursoIds: form.cursoIds,
        professorIds: form.professorIds
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage("Turma salva com sucesso!");
        setForm({ id: null, nome: "", semestreId: "", disciplinaId: "", cursoIds: [], professorIds: [] });
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json();
        setError(resBody.message || "Erro ao salvar a turma.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (turma) => {
    setForm({
      id: turma.id,
      nome: turma.nome || "",
      semestreId: turma.semestre ? turma.semestre.id : "",
      disciplinaId: turma.disciplina ? turma.disciplina.id : "",
      cursoIds: turma.cursos ? turma.cursos.map(c => c.id) : [],
      professorIds: turma.professores ? turma.professores.map(p => p.id) : []
    });
  };

  const handleExcluir = async (turma) => {
    setError("");
    setSuccessMessage("");

    if (!window.confirm(`Deseja realmente excluir a turma ${turma.nome}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/turmas/${turma.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        setSuccessMessage("Registro excluído com sucesso!");
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json();
        setError(resBody.message || "Erro ao excluir: possui vínculos ativos.");
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container container-flex-layout" style={{ maxWidth: "1000px", width: "100%" }}>
      <h1>Gerenciamento de Turmas</h1>
      
      <form onSubmit={handleSalvar} className="card form-full-width">
        <h2>{form.id ? "Editar Turma" : "Nova Turma"}</h2>
        {error && <div className="alert-message error-box">{error}</div>}
        {successMessage && <div className="alert-message success-box">{successMessage}</div>}
        
        <FormInput label="Nome da Turma" type="text" name="nome" value={form.nome} onChange={handleChange} />
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Semestre Letivo</label>
            <select className="input-field" name="semestreId" value={form.semestreId} onChange={handleChange}>
              <option value="">Selecione o semestre...</option>
              {semestres.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Disciplina</label>
            <select className="input-field" name="disciplinaId" value={form.disciplinaId} onChange={handleChange}>
              <option value="">Selecione a disciplina...</option>
              {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Cursos Vinculados</label>
          <div style={{ maxHeight: "120px", overflowY: "auto", border: "1px solid var(--border-color)", padding: "0.5rem", borderRadius: "var(--radius)", backgroundColor: "#fff" }}>
            {cursos.map(c => (
              <label key={c.id} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={form.cursoIds.includes(c.id)}
                  onChange={() => handleMultipleSelect('cursoIds', c.id)}
                  style={{ marginRight: "0.5rem" }}
                />
                {c.nome}
              </label>
            ))}
            {cursos.length === 0 && <span style={{ color: "#666" }}>Nenhum curso cadastrado.</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Professores da Turma</label>
          <div style={{ maxHeight: "120px", overflowY: "auto", border: "1px solid var(--border-color)", padding: "0.5rem", borderRadius: "var(--radius)", backgroundColor: "#fff" }}>
            {professores.map(p => (
              <label key={p.id} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={form.professorIds.includes(p.id)}
                  onChange={() => handleMultipleSelect('professorIds', p.id)}
                  style={{ marginRight: "0.5rem" }}
                />
                {p.username} ({p.email})
              </label>
            ))}
            {professores.length === 0 && <span style={{ color: "#666" }}>Nenhum professor cadastrado.</span>}
          </div>
        </div>
        
        <Button type="submit">Salvar</Button>
      </form>

      <div className="table-scroll-container" style={{ maxHeight: "400px" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Semestre</th>
              <th>Disciplina</th>
              <th style={{ width: "150px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.nome}</td>
                <td>{t.semestre?.nome || "N/A"}</td>
                <td>{t.disciplina?.nome || "N/A"}</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEditar(t)} className="btn-action edit">Editar</button>
                    <button onClick={() => handleExcluir(t)} className="btn-action delete">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}