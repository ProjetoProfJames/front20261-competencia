'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function TurmasPage() {
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cursoId: "",
    periodoId: ""
  });

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    try {
      // Busca turmas, cursos e períodos em paralelo
      const [resTurmas, resCursos, resPeriodos] = await Promise.all([
        fetch("http://localhost:8080/api/turmas", { headers }),
        fetch("http://localhost:8080/api/cursos", { headers }),
        fetch("http://localhost:8080/api/periodos", { headers })
      ]);

      const dataTurmas = await resTurmas.json();
      const dataCursos = await resCursos.json();
      const dataPeriodos = await resPeriodos.json();

      setTurmas(dataTurmas || []);
      setCursos(dataCursos || []);
      setPeriodos(dataPeriodos || []);
    } catch (err) {
      console.error("Erro ao carregar dados da tela de turmas:", err);
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

  const handleEdit = (turma) => {
    setEditingId(turma.id);
    setFormData({
      nome: turma.nome,
      cursoId: turma.curso?.id || turma.cursoId || "",
      periodoId: turma.periodo?.id || turma.periodoId || ""
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
      console.error("Erro ao deletar turma:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const url = editingId 
      ? `http://localhost:8080/api/turmas/${editingId}`
      : "http://localhost:8080/api/turmas";
      
    const method = editingId ? "PUT" : "POST";

    // Envia o payload estruturado com IDs numéricos/valores corretos
    const payload = {
      nome: formData.nome,
      cursoId: parseInt(formData.cursoId),
      periodoId: parseInt(formData.periodoId)
    };

    try {
      await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ nome: "", cursoId: "", periodoId: "" });
      fetchData();
    } catch (err) {
      console.error("Erro ao salvar turma:", err);
    }
  };

  const headers = ["ID", "Turma", "Curso", "Período Letivo", "Ações"];

  const rows = turmas.map((turma) => [
    turma.id,
    turma.nome,
    turma.curso?.nome || turma.cursoNome || "Não informado",
    turma.periodo?.nome || turma.periodoNome || "Não informado",
    <div key={turma.id} className="flex gap-2">
      <Button onClick={() => handleEdit(turma)}>Editar</Button>
      <Button variant="danger" onClick={() => handleDelete(turma.id)}>Excluir</Button>
    </div>
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Turmas</h1>
        {!isFormOpen && (
          <Button onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ nome: "", cursoId: "", periodoId: "" }); }}>
            Nova Turma
          </Button>
        )}
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 max-w-md">
          <h2 className="text-xl mb-4 font-semibold">{editingId ? "Editar Turma" : "Nova Turma"}</h2>
          <div className="flex flex-col gap-4">
            <FormInput
              label="Nome da Turma"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />

            {/* Seleção do Curso */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Curso</label>
              <select
                name="cursoId"
                value={formData.cursoId}
                onChange={handleInputChange}
                required
                className="border rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um curso...</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>
                ))}
              </select>
            </div>

            {/* Seleção do Período */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Período Letivo</label>
              <select
                name="periodoId"
                value={formData.periodoId}
                onChange={handleInputChange}
                required
                className="border rounded p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um período...</option>
                {periodos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

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
