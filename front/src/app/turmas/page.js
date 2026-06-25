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
      const [resTurmas, resCursos, resPeriodos] = await Promise.all([
        fetch("http://localhost:8080/api/turmas", { headers }),
        fetch("http://localhost:8080/api/cursos", { headers }),
        fetch("http://localhost:8080/api/periodos", { headers })
      ]);

      const dataTurmas = await resTurmas.json();
      const dataCursos = await resCursos.json();
      const dataPeriodos = await resPeriodos.json();

      setTurmas(dataTurmas.data || dataTurmas || []);
      setCursos(dataCursos.data || dataCursos || []);
      setPeriodos(dataPeriodos.data || dataPeriodos || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
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

  const handleEditClick = (turma) => {
    setEditingId(turma.id);
    setFormData({
      nome: turma.nome || "",
      cursoId: turma.curso?.id || turma.cursoId || "",
      periodoId: turma.periodo?.id || turma.periodoId || ""
    });
    setIsFormOpen(true);
  };

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ nome: "", cursoId: "", periodoId: "" });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:8080/api/turmas/${editingId}` 
      : "http://localhost:8080/api/turmas";

    const payload = {
      nome: formData.nome,
      cursoId: parseInt(formData.cursoId),
      periodoId: parseInt(formData.periodoId)
    };

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na requisição.");
        }
        return response.json();
      })
      .then(() => {
        alert(editingId ? "Turma atualizada com sucesso!" : "Turma criada com sucesso!");
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ nome: "", cursoId: "", periodoId: "" });
        fetchData();
      })
      .catch((error) => {
        console.error("Erro no submit:", error);
        alert("Erro ao processar a requisição.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta turma?")) return;
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/turmas/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir turma.");
        }
        alert("Turma excluída com sucesso!");
        fetchData();
      })
      .catch((error) => {
        console.error("Erro na exclusão:", error);
        alert("Erro ao excluir turma.");
      });
  };

  const columns = [
    { header: "Nome da Turma", accessor: "nome" },
    { 
      header: "Curso", 
      render: (row) => row.curso?.nome || row.cursoId || "Não Informado"
    },
    { 
      header: "Período", 
      render: (row) => row.periodo?.nome || row.periodoId || "Não Informado"
    },
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
        <h1 style={{ color: '#333', margin: 0 }}>Gestão de Turmas</h1>
        
        <Button type="button" onClick={handleToggleForm}>
          {isFormOpen ? "Voltar para Lista" : "+ Nova Turma"}
        </Button>
      </div>
      
      {isFormOpen ? (
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", marginTop: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>
            {editingId ? "Editar Turma" : "Cadastrar Nova Turma"}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
            <FormInput label="Nome da Turma" type="text" name="nome" value={formData.nome} onChange={handleInputChange} />

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Curso</label>
              <select 
                name="cursoId" 
                value={formData.cursoId} 
                onChange={handleInputChange} 
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px", backgroundColor: "#fff" }}
                required
              >
                <option value="">Selecione um curso...</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.sigla})</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Período Letivo</label>
              <select 
                name="periodoId" 
                value={formData.periodoId} 
                onChange={handleInputChange} 
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px", backgroundColor: "#fff" }}
                required
              >
                <option value="">Selecione um período...</option>
                {periodos.map((p) => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <Button type="submit">{editingId ? "Atualizar Turma" : "Salvar Turma"}</Button>
          </form>
        </div>
      ) : (
        loading ? (
          <p>Carregando turmas...</p>
        ) : (
          <Table columns={columns} data={turmas} />
        )
      )}
    </div>
  );
}
