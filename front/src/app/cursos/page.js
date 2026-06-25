'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    sigla: ""
  });

  const fetchCursos = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:8080/api/cursos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCursos(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar cursos:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (curso) => {
    setEditingId(curso.id);
    setFormData({ nome: curso.nome, sigla: curso.sigla });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Deseja realmente excluir este curso?")) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/cursos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(() => fetchCursos())
      .catch((err) => console.error("Erro ao deletar curso:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const url = editingId 
      ? `http://localhost:8080/api/cursos/${editingId}`
      : "http://localhost:8080/api/cursos";
      
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(() => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ nome: "", sigla: "" });
        fetchCursos();
      })
      .catch((err) => console.error("Erro ao salvar curso:", err));
  };

  const headers = ["ID", "Nome", "Sigla", "Ações"];

  const rows = cursos.map((curso) => [
    curso.id,
    curso.nome,
    curso.sigla,
    <div key={curso.id} className="flex gap-2">
      <Button onClick={() => handleEdit(curso)}>Editar</Button>
      <Button variant="danger" onClick={() => handleDelete(curso.id)}>Excluir</Button>
    </div>
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Cursos</h1>
        {!isFormOpen && (
          <Button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ nome: "", sigla: "" }); }}>
            Novo Curso
          </Button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 max-w-md">
          <h2 className="text-xl mb-4 font-semibold">{editingId ? "Editar Curso" : "Novo Curso"}</h2>
          <div className="flex flex-col gap-4">
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
            <div className="flex gap-2 mt-2">
              <Button type="submit">Salvar</Button>
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </form>
      )}

      {loading ? <p>Carregando...</p> : <Table headers={headers} rows={rows} />}
    </div>
  );
}
