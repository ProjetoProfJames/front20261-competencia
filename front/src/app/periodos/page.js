'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function PeriodosPage() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: ""
  });

  const fetchPeriodos = () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/periodos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((apiResponse) => {
        if (apiResponse && apiResponse.data) {
          setPeriodos(apiResponse.data);
        } else {
          setPeriodos(apiResponse || []);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (periodo) => {
    setEditingId(periodo.id);
    setFormData({
      nome: periodo.nome || ""
    });
    setIsFormOpen(true);
  };

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ nome: "" });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:8080/api/periodos/${editingId}` 
      : "http://localhost:8080/api/periodos";

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
        alert(editingId ? "Período atualizado com sucesso!" : "Período criado com sucesso!");
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ nome: "" });
        fetchPeriodos();
      })
      .catch((error) => {
        console.error("Erro no submit:", error);
        alert("Erro ao processar a requisição.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este período?")) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/periodos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir período.");
        }
        alert("Período excluído com sucesso!");
        fetchPeriodos();
      })
      .catch((error) => {
        console.error("Erro na exclusão:", error);
        alert("Erro ao excluir período.");
      });
  };

  const columns = [
    { header: "Nome (Ex: 2026/1)", accessor: "nome" },
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
        <h1 style={{ color: '#333', margin: 0 }}>Gestão de Períodos Letivos</h1>
        
        <Button type="button" onClick={handleToggleForm}>
          {isFormOpen ? "Voltar para Lista" : "+ Novo Período"}
        </Button>
      </div>
      
      {isFormOpen ? (
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", marginTop: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>
            {editingId ? "Editar Período" : "Cadastrar Novo Período"}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
            <FormInput label="Período Letivo (Ex: 2026/1)" type="text" name="nome" value={formData.nome} onChange={handleInputChange} />

            <Button type="submit">{editingId ? "Atualizar Período" : "Salvar Período"}</Button>
          </form>
        </div>
      ) : (
        loading ? (
          <p>Carregando períodos...</p>
        ) : (
          <Table columns={columns} data={periodos} />
        )
      )}
    </div>
  );
}
