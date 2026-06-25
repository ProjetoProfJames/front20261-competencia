'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    sigla: "",
    coordenadorId: "",
    professorIds: []
  });

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      const [resCursos, resUsuarios] = await Promise.all([
        fetch("http://localhost:8080/api/cursos", { headers }),
        fetch("http://localhost:8080/api/users", { headers })
      ]);

      const dataCursos = await resCursos.json();
      const dataUsuarios = await resUsuarios.json();

      setCursos(Array.isArray(dataCursos) ? dataCursos : dataCursos.content || dataCursos.data || []);
      setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : dataUsuarios.content || dataUsuarios.data || []);
    } catch (err) {
      setCursos([]);
      setUsuarios([]);
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
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFormData((prev) => ({ ...prev, professorIds: values }));
  };

  const handleEdit = (curso) => {
    setEditingId(curso.id);
    setFormData({ 
      nome: curso.nome, 
      sigla: curso.sigla,
      coordenadorId: curso.coordenador?.id || curso.coordenadorId || "",
      professorIds: curso.professores?.map(p => p.id) || curso.professorIds || []
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir este curso?")) return;
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:8080/api/cursos/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Erro ao deletar curso.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const url = editingId 
      ? `http://localhost:8080/api/cursos/${editingId}`
      : "http://localhost:8080/api/cursos";
      
    const method = editingId ? "PUT" : "POST";

    const payload = {
      nome: formData.nome,
      sigla: formData.sigla,
      coordenadorId: formData.coordenadorId ? parseInt(formData.coordenadorId) : null,
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
        throw new Error("Falha ao salvar");
      }

      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ nome: "", sigla: "", coordenadorId: "", professorIds: [] });
      fetchData();
    } catch (err) {
      alert("Erro ao salvar curso. Verifique se preencheu todos os dados corretamente.");
    }
  };

  const isCoordenador = (u) => u.perfil === "COORDENADOR" || u.profile === "COORDENADOR" || u.role === "COORDENADOR";
  const isProfessor = (u) => u.perfil === "PROFESSOR" || u.profile === "PROFESSOR" || u.role === "PROFESSOR";

  const coordenadores = usuarios.filter(isCoordenador);
  const professores = usuarios.filter(isProfessor);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Nome", accessor: "nome" },
    { header: "Sigla", accessor: "sigla" },
    { 
      header: "Ações", 
      render: (curso) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => handleEdit(curso)}>Editar</Button>
          <Button variant="danger" onClick={() => handleDelete(curso.id)}>Excluir</Button>
        </div>
      )
    }
  ];

  return (
    <div className="container" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="title">Cadastro de Cursos</h1>
        {!isFormOpen && (
          <Button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ nome: "", sigla: "", coordenadorId: "", professorIds: [] }); }}>
            + Novo Curso
          </Button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "20px", textAlign: "left", maxWidth: "600px", alignSelf: "center" }}>
          <h2 className="subtitle">{editingId ? "Editar Curso" : "Novo Curso"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <FormInput
              label="Nome do Curso"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Sigla"
              name="sigla"
              value={formData.sigla}
              onChange={handleInputChange}
              required
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Coordenador</label>
              <select
                name="coordenadorId"
                value={formData.coordenadorId}
                onChange={handleInputChange}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white" }}
              >
                <option value="">Selecione um coordenador...</option>
                {coordenadores.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome || c.username || c.email}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Professores (Segure Ctrl/Cmd para selecionar vários)</label>
              <select
                name="professorIds"
                multiple
                value={formData.professorIds}
                onChange={handleMultiSelectChange}
                required
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white", minHeight: "80px" }}
              >
                {professores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome || p.username || p.email}</option>
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

      {loading ? <p>Carregando...</p> : <Table columns={columns} data={cursos} />}
    </div>
  );
}
