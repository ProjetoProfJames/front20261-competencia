'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { api } from '@/services/api';

export default function AlunosPage() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'username' },
    { label: 'E-mail', key: 'email' },
  ];

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const response = await api.get('/users');
      const apenasAlunos = (response.data || []).filter(u => u.profile === 'ALUNO');
      setAlunos(apenasAlunos);
    } catch (err) {
      setError("Não foi possível carregar a lista de alunos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Excluir o aluno "${user.username}"?`)) {
      try {
        await api.delete(`/users/${user.id}`);
        setAlunos(prev => prev.filter(a => a.id !== user.id));
      } catch (err) { alert("Erro ao excluir."); }
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await api.put(`/users/${editingUser.id}`, { 
        username: editUsername, 
        email: editEmail 
      });
      setAlunos(prev => prev.map(a => 
        a.id === editingUser.id ? { ...a, username: editUsername, email: editEmail } : a
      ));
      alert("Aluno atualizado!");
      setEditingUser(null);
    } catch (err) { alert("Erro ao atualizar."); }
    finally { setIsUpdating(false); }
  };

  return (
    <PageLayout
      title="Gestão de Alunos"
      subtitle="Lista de alunos cadastrados no sistema"
      topRightAction={<Button href="/cadastro?perfil=ALUNO">Novo Aluno</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? <div>Carregando...</div> : (
        <Table data={alunos} columns={columns} onEdit={handleEditClick} onDelete={handleDelete} />
      )}

      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Editar Aluno</h2>
            <FormInput label="Nome" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} />
            <FormInput label="E-mail" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            
            <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button onClick={handleUpdate}>{isUpdating ? "Salvando..." : "Salvar"}</Button>
              <Button onClick={() => setEditingUser(null)} className="btn-danger">Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}