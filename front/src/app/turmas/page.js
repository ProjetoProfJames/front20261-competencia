'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api';

export default function TurmasPage() {
  const router = useRouter();

  const [turmas, setTurmas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'nome' },
    { label: 'Cursos', key: 'cursosTexto' },
    { label: 'Disciplina', key: 'disciplinaNome' },
    { label: 'Semestre', key: 'semestreNome' },
    { label: 'Professores', key: 'professoresTexto' },
  ];

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setTurmas([]);
        setError("Você ainda não está logado. A tela está pronta, mas os dados só serão carregados após login.");
        return;
      }

      const response = await api.get('/turmas');
      const turmasApi = response.data || [];

      const turmasFormatadas = turmasApi.map((turma) => ({
        ...turma,
        cursosTexto: turma.cursos?.map((c) => c.nome).join(", ") || "-",
        disciplinaNome: turma.disciplina?.nome || "-",
        semestreNome: turma.semestre?.nome || "-",
        professoresTexto: turma.professores?.map((p) => p.username).join(", ") || "-"
      }));

      setTurmas(turmasFormatadas);
    } catch (err) {
      console.error("Erro ao buscar turmas:", err);
      setError("Não foi possível carregar a lista de turmas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (turma) => {
    router.push(`/turmas/cadastro?id=${turma.id}`);
  };

  const handleDelete = async (turma) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir a turma ${turma.nome}?`);

    if (!confirmacao) return;

    try {
      await api.delete(`/turmas/${turma.id}`);

      setTurmas((prev) => prev.filter((t) => t.id !== turma.id));

      alert("Turma excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir turma:", err);
      alert(err.message || "Erro ao tentar excluir turma.");
    }
  };

  return (
    <PageLayout
      title="Gestão de Turmas"
      subtitle="Lista de turmas cadastradas no sistema"
      topRightAction={
        <Button href="/turmas/cadastro" className="btn-secondary">
          Nova Turma
        </Button>
      }
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Carregando turmas...
        </div>
      ) : (
        <Table
          data={turmas}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}