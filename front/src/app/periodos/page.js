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
    nome: "" // Ex: "2026/1"
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
      .then((res) => res.json())
      .then((data) => {
        setPeriodos(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar períodos:", err);
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
    setFormData({ nome: periodo.nome });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm("Deseja realmente excluir este período letivo?")) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/periodos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(() => fetchPeriodos())
      .catch((err) => console.error("Erro ao deletar período:", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const url = editingId 
      ? `http://localhost:8080/api/periodos/${editingId}`
      : "http://localhost:8080/api/periodos";
      
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
        setFormData({ nome: "" });
        fetchPeriodos();
      })
      .catch((err) => console.error("Erro ao salvar período:", err));
  };

  const headers = ["ID", "Período Letivo", "Ações"];

  const rows = periodos.map((p) => [
    p.id,
    p.nome,
    <div key={p.id} className="flex gap-2">
      <Button onClick={() => handleEdit(p)}>Editar</Button>
      <Button variant="danger" onClick={() => handleDelete(p.id)}>Excluir</Button>
    </div>
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Períodos Letivos</h1>
        {!isFormOpen && (
          <Button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ nome: "" }); }}>
            Novo Período
          </Button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 max-w-md">
          <h2 className="text-xl mb-4 font-semibold">{editingId ? "Editar Período" : "Novo Período"}</h2>
          <div className="flex flex-col gap-4">
            <FormInput
              label="Nome do Período (Ex: 2026/1)"
              name="nome"
              value={formData.nome}
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
