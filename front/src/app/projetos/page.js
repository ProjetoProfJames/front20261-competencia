'use client';

import { useEffect, useState } from "react";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";
import Button from "@/components/Button";

export default function ListagemProjetos() {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState({
    componente: "",
    professor: "",
    turma: "",
    curso: "",
    semestre: "",
  });

  const carregarProjetos = async (parametrosBusca = {}) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();

    if (parametrosBusca.componente) params.append("componente", parametrosBusca.componente);
    if (parametrosBusca.professor) params.append("professor", parametrosBusca.professor);
    if (parametrosBusca.turma) params.append("turmaNome", parametrosBusca.turma);
    if (parametrosBusca.curso) params.append("cursoNome", parametrosBusca.curso);
    if (parametrosBusca.semestre) params.append("semestre", parametrosBusca.semestre);

    try {
      const res = await fetch(`http://localhost:8080/api/projetos?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      const extractedData = Array.isArray(data) ? data : data?.content || data?.data || [];
      setProjetos(extractedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProjetos({});
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    carregarProjetos(filtros);
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:8080/api/projetos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        setProjetos(projetos.filter((p) => p.id !== id));
      } else {
        alert("Erro ao excluir. O seu perfil pode não ter permissão.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      header: "Turma",
      render: (projeto) => projeto.turma?.nome || "Não informada"
    },
    {
      header: "Semestre",
      render: (projeto) => projeto.semestre?.nome || projeto.semestre?.periodo || "Não informado"
    },
    {
      header: "Professor Orientador",
      render: (projeto) => projeto.professorOrientador?.nome || projeto.professorOrientador?.username || "Não informado"
    },
    {
      header: "Alunos (Componentes)",
      render: (projeto) => projeto.integrantes && projeto.integrantes.length > 0
        ? projeto.integrantes.map((i) => i.nome || i.username).join(", ")
        : "Nenhum aluno"
    },
    {
      header: "Ações",
      render: (projeto) => (
        <Button variant="danger" onClick={() => handleDelete(projeto.id)}>
          Excluir
        </Button>
      )
    }
  ];

  return (
    <div className="container" style={{ alignItems: "stretch", justifyContent: "flex-start" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 className="title">Grupos de Projeto</h1>
      </div>

      <form onSubmit={handleSearch} className="card" style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <FormInput label="Componente" type="text" name="componente" value={filtros.componente} onChange={handleFiltroChange} />
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <FormInput label="Professor" type="text" name="professor" value={filtros.professor} onChange={handleFiltroChange} />
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <FormInput label="Turma" type="text" name="turma" value={filtros.turma} onChange={handleFiltroChange} />
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <FormInput label="Curso" type="text" name="curso" value={filtros.curso} onChange={handleFiltroChange} />
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <FormInput label="Semestre" type="text" name="semestre" value={filtros.semestre} onChange={handleFiltroChange} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit">Pesquisar</Button>
        </div>
      </form>

      {loading ? <p>A carregar projetos...</p> : <Table columns={columns} data={projetos} />}
    </div>
  );
}