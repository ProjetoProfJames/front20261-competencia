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
    nome: "",
    dataInicio: "",
    dataFim: ""
  });

  const fetchPeriodos = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:8080/api/semestres", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((apiResponse) => {
        const dataList = Array.isArray(apiResponse) ? apiResponse : apiResponse.data || apiResponse.content || [];
        setPeriodos(dataList);
        setLoading(false);
      })
      .catch(() => {
        setPeriodos([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPeriodos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (periodo) => {
    setEditingId(periodo.id);
    setFormData({ 
      nome: periodo.nome, 
      dataInicio: periodo.dataInicio || "", 
      dataFim: periodo.dataFim || "" 
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Deseja realmente excluir este período letivo?")) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/semestres/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(() => fetchPeriodos())
      .catch(() => alert("Erro ao deletar período."));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const url = editingId 
      ? `http://localhost:8080/api/semestres/${editingId}`
      : "http://localhost:8080/api/semestres";
      
    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Falha ao salvar");
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ nome: "", dataInicio: "", dataFim: "" });
        fetchPeriodos();
      })
      .catch(() => alert("Erro ao salvar período."));
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Período", accessor: "nome" },
    { header: "Início", accessor: "dataInicio" },
    { header: "Fim", accessor: "dataFim" },
    { 
      header: "Ações", 
      render: (p) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => handleEdit(p)}>Editar</Button>
          <Button variant="danger" onClick={() => handleDelete(p.id)}>Excluir</Button>
        </div>
      )
    }
  ];

  return (
    <div className="container" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="title">Cadastro de Períodos Letivos</h1>
        {!isFormOpen && (
          <Button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ nome: "", dataInicio: "", dataFim: "" }); }}>
            + Novo Período
          </Button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "20px", textAlign: "left", maxWidth: "600px", alignSelf: "center" }}>
          <h2 className="subtitle">{editingId ? "Editar Período" : "Novo Período"}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <FormInput label="Nome" name="nome" value={formData.nome} onChange={handleInputChange} required />
            <FormInput label="Data Início" type="date" name="dataInicio" value={formData.dataInicio} onChange={handleInputChange} required />
            <FormInput label="Data Fim" type="date" name="dataFim" value={formData.dataFim} onChange={handleInputChange} required />
            
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Button type="submit">Salvar</Button>
              <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            </div>
          </div>
        </form>
      )}

      {loading ? <p>Carregando...</p> : <Table columns={columns} data={periodos} />}
    </div>
  );
}