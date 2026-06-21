'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api'; 

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Usuário', key: 'username' },
    { label: 'E-mail', key: 'email' },
    { label: 'Perfil', key: 'profile' },
  ];

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const response = await api.get('/users');
      const todosUsuarios = response.data || [];
      
      const apenasAlunos = todosUsuarios.filter(u => u.profile === 'ALUNO');
      
      setAlunos(apenasAlunos);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Não foi possível carregar a lista de alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    console.log("Aluno para editar:", user);
    alert(`Vamos editar o aluno: ${user.username}`);
  };

  const handleDelete = async (user) => {
    const confirmacao = window.confirm(`Tem certeza que deseja excluir o aluno ${user.username}?`);
    
    if (confirmacao) {
      try {
        await api.delete(`/users/${user.id}`);
        setAlunos((prev) => prev.filter(a => a.id !== user.id));
        alert("Aluno excluído com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert(err.response?.data?.message || "Erro ao tentar excluir.");
      }
    }
  };

  return (
    <PageLayout
      title="Gestão de Alunos"
      subtitle="Lista de alunos cadastrados no sistema"
      topRightAction={<Button href="/cadastro" className="btn-secondary">Novo Aluno</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Carregando alunos...</div>
      ) : (
        <Table 
          data={alunos} 
          columns={columns} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      )}
    </PageLayout>
  );
}