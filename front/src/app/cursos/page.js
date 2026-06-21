'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [coordenadores, setCoordenadores] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", coordenadorId: "", professorIds: [] });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      const [resCursos, resUsers] = await Promise.all([
        fetch("/api/cursos", { headers }),
        fetch("/api/users", { headers })
      ]);

      if (resCursos.ok) {
        const data = await resCursos.json();
        setCursos(data.data || data || []);
      }

      if (resUsers.ok) {
        const data = await resUsers.json();
        const users = data.data || data || [];
        setCoordenadores(users.filter(u => u.profile === "COORDENADOR" || u.tipo === "COORDENADOR"));
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

  const handleProfessorToggle = (id) => {
    setForm(prev => {
      const isSelected = prev.professorIds.includes(id);
      const newIds = isSelected 
        ? prev.professorIds.filter(pid => pid !== id)
        : [...prev.professorIds, id];
      return { ...prev, professorIds: newIds };
    });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.nome || !form.coordenadorId || form.professorIds.length === 0) {
      setError("Por favor, preencha o nome, selecione um coordenador e pelo menos um professor.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/cursos/${form.id}` : "/api/cursos";
      const method = form.id ? "PUT" : "POST";

      const payload = {
        nome: form.nome,
        coordenadorId: parseInt(form.coordenadorId),
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
        setSuccessMessage("Curso salvo com sucesso!");
        setForm({ id: null, nome: "", coordenadorId: "", professorIds: [] });
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json();
        setError(resBody.message || "Erro ao salvar o registro no servidor.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (curso) => {
    setForm({
      id: curso.id,
      nome: curso.nome || "",
      coordenadorId: curso.coordenador ? curso.coordenador.id : "",
      professorIds: curso.professores ? curso.professores.map(p => p.id) : []
    });
  };

  const handleExcluir = async (curso) => {
    setError("");
    setSuccessMessage("");

    const confirmacao = window.confirm(`Deseja realmente excluir o curso ${curso.nome}?`);
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/cursos/${curso.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        setSuccessMessage("Registro excluído com sucesso!");
        fetchData();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json();
        setError(resBody.message || "Não é possível excluir: registro possui vínculos ativos.");
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container container-flex-layout" style={{ maxWidth: "1000px", width: "100%" }}>
      <h1>Gerenciamento de Cursos</h1>
      
      <form onSubmit={handleSalvar} className="card form-full-width">
        <h2>{form.id ? "Editar Curso" : "Novo Curso"}</h2>
        {error && <div className="alert-message error-box">{error}</div>}
        {successMessage && <div className="alert-message success-box">{successMessage}</div>}
        
        <FormInput label="Nome do Curso" type="text" name="nome" value={form.nome} onChange={handleChange} />
        
        <div className="form-group">
          <label>Coordenador do Curso</label>
          <select className="input-field" name="coordenadorId" value={form.coordenadorId} onChange={handleChange}>
            <option value="">Selecione um coordenador...</option>
            {coordenadores.map(c => (
              <option key={c.id} value={c.id}>{c.username} ({c.email})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Professores Vinculados</label>
          <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border-color)", padding: "0.5rem", borderRadius: "var(--radius)", backgroundColor: "#fff" }}>
            {professores.map(p => (
              <label key={p.id} style={{ display: "block", marginBottom: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                <input
                  type="checkbox"
                  checked={form.professorIds.includes(p.id)}
                  onChange={() => handleProfessorToggle(p.id)}
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
              <th>Coordenador</th>
              <th>Professores</th>
              <th style={{ width: "150px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.coordenador?.username || "N/A"}</td>
                <td>{c.professores?.length || 0} prof(s)</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEditar(c)} className="btn-action edit">Editar</button>
                    <button onClick={() => handleExcluir(c)} className="btn-action delete">Excluir</button>
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