'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Table from "@/components/Table";
import Button from "@/components/Button";
import { api } from "@/services/api";

export default function ProjetosPage() {
  const router = useRouter();

  const [projetos, setProjetos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { label: "ID", key: "id" },
    { label: "Projeto", key: "nome" },
    { label: "Descricao", key: "descricao" },
    { label: "Turma", key: "turma" },
    { label: "Semestre", key: "semestre" },
    { label: "Professor Orientador", key: "professor" },
    { label: "Alunos", key: "alunos" },
    { label: "Local", key: "local" },
    { label: "Horario", key: "horario" },
  ];

  useEffect(() => {
    carregarProjetos();
  }, []);

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  };

  const carregarProjetos = async () => {
    try {
      const response = await api.get("/projetos");
      const projetosApi = response.data || [];

      const projetosFormatados = projetosApi.map((projeto) => ({
        id: projeto.id,
        nome: projeto.nome || "-",
        descricao: projeto.descricao || "-",
        turma: projeto.turma?.nome || "-",
        semestre: projeto.semestre?.nome || "-",
        professor: projeto.professorOrientador?.username || "-",
        alunos: projeto.integrantes?.map((aluno) => aluno.username).join(", ") || "-",
        local: projeto.local?.nome || "-",
        horario: `${formatarData(projeto.horarioInicio)} ate ${formatarData(projeto.horarioFim)}`,
      }));

      setProjetos(projetosFormatados);
    } catch (err) {
      console.error("Erro ao buscar projetos:", err);
      setError("Nao foi possivel carregar a lista de projetos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (projeto) => {
    router.push(`/projetos/cadastro?id=${projeto.id}`);
  };

  const handleDelete = async (projeto) => {
    const confirmacao = window.confirm(`Deseja excluir o projeto "${projeto.nome}"?`);

    if (!confirmacao) return;

    try {
      await api.delete(`/projetos/${projeto.id}`);
      setProjetos((prev) => prev.filter((item) => item.id !== projeto.id));
      alert("Projeto excluido com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir projeto:", err);
      alert(err.message || "Erro ao tentar excluir projeto.");
    }
  };

  return (
    <PageLayout
      title="Projetos"
      subtitle="Projetos cadastrados no sistema"
      topRightAction={
        <Button href="/projetos/cadastro" className="btn-secondary">
          Novo Projeto
        </Button>
      }
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          Carregando projetos...
        </div>
      ) : (
        <Table
          data={projetos}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}
