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
      .then((response) => response.json())
      .then((apiResponse) => {
        if (apiResponse && apiResponse.data) {
          setCursos(apiResponse.data);
        } else {
          setCursos(apiResponse || []);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (curso) => {
    setEditingId(curso.id);
    setFormData({
      nome: curso.nome || "",
      sigla: curso.sigla || ""
    });
    setIsFormOpen(true);
  };

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ nome: "", sigla: "" });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:8080/api/cursos/${editingId}` 
      : "http://localhost:8080/api/cursos";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na requisição.");
        }
        return response.json();
      })
      .then(() => {
        alert(editingId ? "Curso atualizado com sucesso!" : "Curso criado com sucesso!");
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ nome: "", sigla: "" });
        fetchCursos();
      })
      .catch((error) => {
        console.error("Erro no submit:", error);
        alert("Erro ao processar a requisição.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este curso?")) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/cursos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir curso.");
        }
        alert("Curso excluído com sucesso!");
        fetchCursos();
      })
      .catch((error) => {
        console.error("Erro na exclusão:", error);
        alert("Erro ao excluir curso.");
      });
  };

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Sigla", accessor: "sigla" },
    { 
      header: "Ações", 
      render: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="button" onClick={() => handleEditClick(row)}>Editar</Button>
          <Button type="button" onClick={() => handleDelete(row.id)}>Excluir</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>Gestão de Cursos</h1>
        
        <Button type="button" onClick={handleToggleForm}>
          {isFormOpen ? "Voltar para Lista" : "+ Novo Curso"}
        </Button>
      </div>
      
      {isFormOpen ? (
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", marginTop: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>
            {editingId ? "Editar Curso" : "Cadastrar Novo Curso"}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
            <FormInput label="Nome do Curso" type="text" name="nome" value={formData.nome} onChange={handleInputChange} />
            <FormInput label="Sigla" type="text" name="sigla" value={formData.sigla} onChange={handleInputChange} />

            <Button type="submit">{editingId ? "Atualizar Curso" : "Salvar Curso"}</Button>
          </form>
        </div>
      ) : (
        loading ? (
          <p>Carregando cursos...</p>
        ) : (
          <Table columns={columns} data={cursos} />
        )
      )}
    </div>
  );
}
