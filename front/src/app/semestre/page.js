'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api';

export default function SemestresPage() {
  const router = useRouter();

  const [semestres, setSemestres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'nome' },
    { label: 'Data de início', key: 'dataInicio' },
    { label: 'Data de fim', key: 'dataFim' },
  ];

  useEffect(() => {
    carregarSemestres();
  }, []);

  const carregarSemestres = async () => {
    try {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('token')
          : null;

      if (!token) {
        setSemestres([]);
        setError(
          'Você ainda não está logado. Os dados serão carregados após o login.'
        );
        return;
      }

      const response = await api.get('/semestres');
      setSemestres(response.data || []);
    } catch (err) {
      console.error('Erro ao buscar semestres:', err);
      setError('Não foi possível carregar a lista de semestres.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (semestre) => {
    router.push(`/semestre/cadastro?id=${semestre.id}`);
  };

  const handleDelete = async (semestre) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o semestre ${semestre.nome}?`
    );

    if (!confirmacao) return;

    try {
      await api.delete(`/semestres/${semestre.id}`);

      setSemestres((prev) =>
        prev.filter((item) => item.id !== semestre.id)
      );

      alert('Semestre excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir semestre:', err);
      alert(err.message || 'Erro ao tentar excluir semestre.');
    }
  };

  return (
    <PageLayout
      title="Gestão de Semestres"
      subtitle="Lista de semestres cadastrados no sistema"
      topRightAction={
        <Button href="/semestre/cadastro" className="btn-secondary">
          Novo Semestre
        </Button>
      }
      bottomLeftAction={
        <Button href="/menu">
          Voltar
        </Button>
      }
    >
      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Carregando semestres...
        </div>
      ) : (
        <Table
          data={semestres}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </PageLayout>
  );
}