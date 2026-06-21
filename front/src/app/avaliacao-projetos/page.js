'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import Button from "@/components/Button";
import { api } from "@/services/api";

export default function AvaliacaoProjetosPage() {
  const router = useRouter();

  const [projetos, setProjetos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        turma: projeto.turma?.nome || "-",
        semestre: projeto.semestre?.nome || "-",
        professor: projeto.professorOrientador?.username || "-",
        alunos: projeto.integrantes?.map((aluno) => aluno.username).join(", ") || "-",
        local: projeto.local?.nome || "-",
        horario: `${formatarData(projeto.horarioInicio)} ate ${formatarData(projeto.horarioFim)}`,
      }));

      setProjetos(projetosFormatados);
    } catch (err) {
      console.error("Erro ao buscar projetos para avaliacao:", err);
      setError("Nao foi possivel carregar os projetos para avaliacao.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvaliar = (projeto) => {
    router.push(`/avaliacao-projetos/cadastro?projetoId=${projeto.id}`);
  };

  const projetosFiltrados = projetos.filter((projeto) => {
    const termo = searchTerm.trim().toLowerCase();

    if (!termo) return true;

    return Object.values(projeto).some((valor) =>
      String(valor).toLowerCase().includes(termo)
    );
  });

  return (
    <PageLayout
      title="Avaliacao de Projetos"
      subtitle="Selecione um projeto para registrar a avaliacao"
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          Carregando projetos...
        </div>
      ) : (
        <div className="table-wrapper">
          <div className="input-group">
            <input
              type="text"
              placeholder="Buscar por projeto, aluno, professor, turma ou semestre..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Projeto</th>
                  <th>Turma</th>
                  <th>Semestre</th>
                  <th>Professor Orientador</th>
                  <th>Alunos</th>
                  <th>Local</th>
                  <th>Horario</th>
                  <th style={{ textAlign: "center" }}>Acao</th>
                </tr>
              </thead>
              <tbody>
                {projetosFiltrados.length > 0 ? (
                  projetosFiltrados.map((projeto) => (
                    <tr key={projeto.id}>
                      <td>{projeto.id}</td>
                      <td>{projeto.nome}</td>
                      <td>{projeto.turma}</td>
                      <td>{projeto.semestre}</td>
                      <td>{projeto.professor}</td>
                      <td>{projeto.alunos}</td>
                      <td>{projeto.local}</td>
                      <td>{projeto.horario}</td>
                      <td className="table-actions">
                        <Button
                          type="button"
                          onClick={() => handleAvaliar(projeto)}
                          className="btn-secondary"
                        >
                          Avaliar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center", padding: "20px" }}>
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
