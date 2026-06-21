'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api';

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'username' },
    { label: 'E-mail', key: 'email' },
    { label: 'Perfil', key: 'profile' },
  ];

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      const todosUsuarios = response.data || [];
      
      const apenasProfessores = todosUsuarios.filter(u => u.profile === 'PROFESSOR');
      
      setProfessores(apenasProfessores);
    } catch (err) {
      console.error("Erro ao buscar professores:", err);
      setError("Não foi possível carregar a lista de professores.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    console.log("Professor para editar:", user);
    alert(`Vamos editar o professor: ${user.username}`);
  };

  const handleDelete = async (user) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o professor ${user.username}?`);
    
    if (confirmacao) {
      try {
        await api.delete(`/users/${user.id}`);
        setProfessores((prev) => prev.filter(p => p.id !== user.id));
        alert("Professor excluído com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert(err.response?.data?.message || "Erro ao tentar excluir.");
      }
    }
  };

  return (
    <PageLayout
      title="Gestão de Professores"
      subtitle="Corpo docente cadastrado no sistema"
      topRightAction={<Button href="/cadastro" className="btn-secondary">Novo Professor</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Carregando professores...</div>
      ) : (
        <Table 
          data={professores} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </PageLayout>
  );
}