'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api';

export default function CoordenadoresPage() {
  const [coordenadores, setCoordenadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'username' },
    { label: 'E-mail', key: 'email' },
    { label: 'Perfil', key: 'profile' },
  ];

  useEffect(() => {
    carregarCoordenadores();
  }, []);

  const carregarCoordenadores = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      const apenasCoordenadores = (response.data || []).filter(u => u.profile === 'COORDENADOR');
      setCoordenadores(apenasCoordenadores);
    } catch (err) {
      console.error("Erro ao buscar coordenadores:", err);
      setError("Não foi possível carregar a lista de coordenadores.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => alert(`Editando coordenador: ${user.username}`);

  const handleDelete = async (user) => {
    if (window.confirm(`Excluir coordenador ${user.username}?`)) {
      try {
        await api.delete(`/users/${user.id}`);
        setCoordenadores(prev => prev.filter(p => p.id !== user.id));
      } catch (err) { alert("Erro ao excluir."); }
    }
  };

  return (
    <PageLayout
      title="Gestão de Coordenadores"
      subtitle="Lista de coordenadores cadastrados"
      topRightAction={<Button href="/cadastro" className="btn-secondary">Novo Coordenador</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}
      {isLoading ? <div>Carregando...</div> : <Table data={coordenadores} columns={columns} onEdit={handleEdit} onDelete={handleDelete} />}
    </PageLayout>
  );
}