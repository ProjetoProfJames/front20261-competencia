'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/PageLayout';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { api } from '@/services/api';

export default function DisciplinasPage() {
  const router = useRouter();

  const [disciplinas, setDisciplinas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [deletingDisciplina, setDeletingDisciplina] = useState(null);

  const columns = [
    { label: 'ID', key: 'id' },
    { label: 'Nome', key: 'nome' },
    { label: 'Curso', key: 'cursoNome' },
  ];

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      const response = await api.get('/disciplinas');
      const data = response.data?.data || response.data || [];
      const formatadas = data.map((d) => ({
        ...d,
        cursoNome: d.cursoNome || "Sem curso"
      }));
      setDisciplinas(formatadas);
    } catch (err) {
      setError("Não foi possível carregar as disciplinas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDisciplina) return;
    try {
      await api.delete(`/disciplinas/${deletingDisciplina.id}`);
      setDisciplinas((prev) => prev.filter((d) => d.id !== deletingDisciplina.id));
      alert("Disciplina excluída com sucesso!");
      setDeletingDisciplina(null);
    } catch (err) {
      alert("Erro ao excluir. Verifique se a disciplina não está sendo usada.");
    }
  };

  return (
    <PageLayout
      title="Gestão de Disciplinas"
      topRightAction={<Button href="/disciplina/cadastro" className="btn-secondary">Nova Disciplina</Button>}
      bottomLeftAction={<Button href="/menu">Voltar</Button>}
    >
      {isLoading ? <p>Carregando...</p> : (
        <Table 
          data={disciplinas} 
          columns={columns} 
          onEdit={(d) => router.push(`/disciplina/cadastro?id=${d.id}`)} 
          onDelete={(d) => setDeletingDisciplina(d)} 
        />
      )}

      {deletingDisciplina && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Deseja realmente excluir a disciplina <strong>{deletingDisciplina.nome}</strong>?</p>
            <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Button onClick={handleDelete} className="btn-danger">Confirmar</Button>
              <Button onClick={() => setDeletingDisciplina(null)} className="btn-secondary">Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}