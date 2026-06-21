'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api';

export default function AvaliadoresPage() {
  const [avaliadores, setAvaliadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'username' },
    { label: 'E-mail', key: 'email' },
    { label: 'Perfil', key: 'profile' },
  ];

  useEffect(() => {
    carregarAvaliadores();
  }, []);

  const carregarAvaliadores = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      // Ajuste o termo 'AVALIADOR_EXTERNO' se o valor no banco for diferente
      const apenasAvaliadores = (response.data || []).filter(u => u.profile === 'AVALIADOR_EXTERNO');
      setAvaliadores(apenasAvaliadores);
    } catch (err) {
      console.error("Erro ao buscar avaliadores:", err);
      setError("Não foi possível carregar a lista de avaliadores externos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => alert(`Editando avaliador: ${user.username}`);

  const handleDelete = async (user) => {
    if (window.confirm(`Excluir avaliador ${user.username}?`)) {
      try {
        await api.delete(`/users/${user.id}`);
        setAvaliadores(prev => prev.filter(p => p.id !== user.id));
      } catch (err) { alert("Erro ao excluir."); }
    }
  };

  return (
    <PageLayout
      title="Gestão de Avaliadores"
      subtitle="Lista de avaliadores externos cadastrados"
      topRightAction={<Button href="/cadastro" className="btn-secondary">Novo Avaliador</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}
      {isLoading ? <div>Carregando...</div> : <Table data={avaliadores} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />}
    </PageLayout>
  );
}