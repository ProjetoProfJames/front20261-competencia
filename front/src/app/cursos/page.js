'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api';

export default function CursosPage() {
  const router = useRouter();

  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'nome' },
    { label: 'Coordenador', key: 'coordenadorNome' },
    { label: 'Professores', key: 'professoresTexto' },
  ];

  useEffect(() => {
    carregarCursos();
  }, []);

  const carregarCursos = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setCursos([]);
        setError("Você ainda não está logado. A tela está pronta, mas os dados só serão carregados após login.");
        return;
      }

      const response = await api.get('/cursos');
      const cursosApi = response.data || [];

      const cursosFormatados = cursosApi.map((curso) => ({
        ...curso,
        coordenadorNome: curso.coordenador?.username || "-",
        professoresTexto: curso.professores?.map((p) => p.username).join(", ") || "-"
      }));

      setCursos(cursosFormatados);
    } catch (err) {
      console.error("Erro ao buscar cursos:", err);
      setError("Não foi possível carregar a lista de cursos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (curso) => {
    router.push(`/cursos/cadastro?id=${curso.id}`);
  };

  const handleDelete = async (curso) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o curso ${curso.nome}?`);

    if (!confirmacao) return;

    try {
      await api.delete(`/cursos/${curso.id}`);
      setCursos((prev) => prev.filter((c) => c.id !== curso.id));
      alert("Curso excluído com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir curso:", err);
      alert(err.message || "Erro ao tentar excluir curso.");
    }
  };

  return (
    <PageLayout
      title="Gestão de Cursos"
      subtitle="Lista de cursos cadastrados no sistema"
      topRightAction={
        <Button href="/cursos/cadastro" className="btn-secondary">
          Novo Curso
        </Button>
      }
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Carregando cursos...
        </div>
      ) : (
        <Table
          data={cursos}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}