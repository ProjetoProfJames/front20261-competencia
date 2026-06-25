'use client';

import { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import { api } from '@/services/api';

export default function GruposPage() {
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingGrupo, setEditingGrupo] = useState(null);
  const [formData, setFormData] = useState({ nome: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Projeto', key: 'nome' },
    { label: 'Turma', key: 'turma' },
    { label: 'Semestre', key: 'semestre' },
    { label: 'Professor Orientador', key: 'professor' },
    { label: 'Alunos', key: 'alunos' },
    { label: 'Local', key: 'local' },
    { label: 'Horário', key: 'horario' },
  ];

  useEffect(() => {
    carregarGrupos();
  }, []);

  const formatarData = (data) => {
    if (!data) return "";
    return new Date(data).toLocaleString("pt-BR");
  };

  const carregarGrupos = async () => {
    try {
      const response = await api.get('/projetos');
      const projetos = response.data || [];

      const rows = projetos.map((p) => ({
        id: p.id,
        nome: p.nome,
        turma: p.turma?.nome || "",
        semestre: p.semestre?.nome || "",
        professor: p.professorOrientador?.username || "",
        alunos: p.integrantes?.map((a) => a.username).join(", ") || "",
        local: p.local?.nome || p.local?.numero || "",
        horario: p.horarioInicio && p.horarioFim ? `${formatarData(p.horarioInicio)} até ${formatarData(p.horarioFim)}` : "Não definido",
      }));

      setGrupos(rows);
    } catch (err) {
      console.error("Erro ao buscar grupos:", err);
      setError("Não foi possível carregar a lista de grupos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (grupo) => {
    setEditingGrupo(grupo);
    setFormData({ nome: grupo.nome });
  };

  const handleUpdate = async () => {
    if (!formData.nome.trim()) {
      alert("O nome do projeto não pode ficar vazio.");
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/projetos/${editingGrupo.id}`, { nome: formData.nome });
      
      setGrupos((prev) => 
        prev.map(g => g.id === editingGrupo.id ? { ...g, nome: formData.nome } : g)
      );
      
      alert("Grupo atualizado com sucesso!");
      setEditingGrupo(null);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao tentar atualizar grupo.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (grupo) => {
    const confirmacao = window.confirm(`Deseja excluir o grupo de projeto "${grupo.nome}"?`);
    if (confirmacao) {
      try {
        await api.delete(`/projetos/${grupo.id}`);
        setGrupos((prev) => prev.filter((g) => g.id !== grupo.id));
        alert("Grupo excluído com sucesso!");
      } catch (err) {
        console.error("Erro ao excluir grupo:", err);
        alert(err.message || "Erro ao tentar excluir grupo.");
      }
    }
  };

  return (
    <PageLayout
      title="Gestão de Grupos"
      subtitle="Grupos de projeto cadastrados"
      topRightAction={<Button href="/grupos/cadastro" className="btn-secondary">Novo Grupo de Projeto</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {error && <p className="error-message">{error}</p>}

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>Carregando grupos de projeto...</div>
      ) : (
        <Table
          data={grupos}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {editingGrupo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Editar Grupo</h2>
            
            <div className="form-group">
              <FormInput 
                label="Nome do Projeto" 
                type="text" 
                value={formData.nome} 
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })} 
              />
            </div>

            <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button onClick={handleUpdate}>
                {isUpdating ? "Salvando..." : "Salvar"}
              </Button>
              <Button onClick={() => setEditingGrupo(null)} className="btn-danger">
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}