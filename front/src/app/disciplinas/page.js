'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    cursoId: ""
  });

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      const [resDisciplinas, resCursos] = await Promise.all([
        fetch("http://localhost:8080/api/disciplinas", { headers }),
        fetch("http://localhost:8080/api/cursos", { headers })
      ]);

      const extrairDados = async (res) => {
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json) ? json : json.content || json.data || [];
      };

      setDisciplinas(await extrairDados(resDisciplinas));
      setCursos(await extrairDados(resCursos));
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

  const handleEdit = (disciplina) => {
    setEditingId(disciplina.id);
    setFormData({
      nome: disciplina.nome,
      cursoId: disciplina.curso?.id || disciplina.cursoId || ""
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir esta disciplina?")) return;
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:8080/api/disciplinas/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Erro ao deletar disciplina.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const url = editingId 
      ? `http://localhost:8080/api/disciplinas/${editingId}`
      : "http://localhost:8080/api/disciplinas";
      
    const method = editingId ? "PUT" : "POST";

    const payload = {
      nome: formData.nome,
      cursoId: parseInt(formData.cursoId)
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
        throw new Error("Falha ao salvar");
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ nome: "", cursoId: "" });
      fetchData();
    } catch (err) {
      alert("Erro ao salvar disciplina. Verifique se possui permissão para esta ação.");
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Disciplina", accessor: "nome" },
    { 
      header: "Curso Vinculado", 
      render: (d) => d.curso?.nome || d.cursoNome || "Não informado"
    },
    { 
      header: "Ações", 
      render: (disciplina) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => handleEdit(disciplina)}>Editar</Button>
          <Button variant="danger" onClick={() => handleDelete(disciplina.id)}>Excluir</Button>
        </div>
      )
    }
  ];

  return (
    <div className="container" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="title">Cadastro de Disciplinas</h1>
        {!isFormOpen && (
          <Button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ nome: "", cursoId: "" }); }}>
            + Nova Disciplina
          </Button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "20px", textAlign: "left", maxWidth: "600px", alignSelf: "center" }}>
          <h2 className="subtitle">{editingId ? "Editar Disciplina" : "Nova Disciplina"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <FormInput
              label="Nome da Disciplina (Ex: Banco de Dados)"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Curso</label>
              <select
                name="cursoId"
                value={formData.cursoId}
                onChange={handleInputChange}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white" }}
              >
                <option value="">Selecione um curso...</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Button type="submit">Salvar</Button>
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </form>
      )}

      {loading ? <p>Carregando...</p> : <Table columns={columns} data={disciplinas} />}
    </div>
  );
}