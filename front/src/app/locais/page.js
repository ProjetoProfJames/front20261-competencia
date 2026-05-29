'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { api } from '@/services/api';

export default function LocaisPage() {
  const [locais, setLocais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingLocal, setEditingLocal] = useState(null);
  const [editNumero, setEditNumero] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome do Local', key: 'numero' }
  ];

  useEffect(() => {
    carregarLocais();
  }, []);

  const carregarLocais = async () => {
    try {
      const response = await api.get('/locais');
      setLocais(response.data || []); 
    } catch (err) {
      console.error("Erro ao buscar locais:", err);
      setError("Não foi possível carregar a lista de locais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (local) => {
    const confirmacao = window.confirm(`Deseja excluir o local "${local.numero}"?`);
    if (confirmacao) {
      try {
        await api.delete(`/locais/${local.id}`);
        setLocais((prev) => prev.filter(l => l.id !== local.id));
        alert("Local excluído com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert(err.data?.message || "Erro ao tentar excluir. Verifique se o local não está em uso.");
      }
    }
  };

  const handleEditClick = (local) => {
    setEditingLocal(local);
    setEditNumero(local.numero);
  };

  const handleUpdate = async () => {
    if (!editNumero.trim()) {
      alert("O número do local não pode ficar vazio.");
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/locais/${editingLocal.id}`, { numero: editNumero });
      setLocais((prev) => 
        prev.map(l => l.id === editingLocal.id ? { ...l, numero: editNumero } : l)
      );
      alert("Local atualizado com sucesso!");
      setEditingLocal(null); 
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert(err.data?.message || "Erro ao atualizar local.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <PageLayout
      title="Gestão de Locais"
      subtitle="Locais disponíveis para a apresentação de projetos"
      topRightAction={<Button href="/locais/cadastro" className="btn-secondary">Novo Local</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Carregando locais...</div>
      ) : (
        <Table 
          data={locais} 
          columns={columns} 
          onEdit={handleEditClick} 
          onDelete={handleDelete} 
        />
      )}

      {editingLocal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Editar Local</h2>
            
            <div className="form-group">
              <FormInput 
                label="Número/Nome" 
                type="text" 
                name="editNumero" 
                value={editNumero} 
                onChange={(e) => setEditNumero(e.target.value)} 
                maxLength={40}
              />
            </div>

            <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button type="button" onClick={handleUpdate} className="btn-secondary">
                {isUpdating ? "Salvando..." : "Salvar"}
              </Button>
              <Button type="button" onClick={() => setEditingLocal(null)} className="btn-danger">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}