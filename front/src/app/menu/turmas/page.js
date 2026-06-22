'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import EmptyState from '@/app/framework/EmptyState';
import StatusMessage from '@/app/framework/StatusMessage';
import { obterRole } from '@/utils/api/Auth';
import { listarTurmas, removerTurma } from '@/utils/services/turmaService';

function nomesItens(itens = []) {
  if (!Array.isArray(itens) || itens.length === 0) {
    return '-';
  }

  return itens.map((item) => item.nome || item.username || item.email || `ID ${item.id}`).join(', ');
}

export default function TurmasPage() {
  const router = useRouter();
  const [turmas, setTurmas] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [ehAdmin, setEhAdmin] = useState(false);

  async function carregarTurmas() {
    try {
      setErro('');
      setCarregando(true);
      const data = await listarTurmas();
      setTurmas(Array.isArray(data) ? data : []);
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar as turmas');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirTurma(id) {
    const confirmar = confirm('Deseja excluir esta turma?');

    if (!confirmar) {
      return;
    }

    try {
      setErro('');
      await removerTurma(id);
      await carregarTurmas();
    } catch (error) {
      setErro(error.message || 'Não foi possível excluir a turma');
    }
  }

  useEffect(() => {
    setEhAdmin(obterRole() === 'ADMIN');
    carregarTurmas();
  }, []);

  return (
    <RotaProtegida roles={['ADMIN', 'ALUNO', 'PROFESSOR', 'COORDENADOR']}>
      <main className="page-container">
        <div className="page-header">
          <div className="page-title">
            <span>Cadastro</span>
            <h1>Turmas</h1>
            <p>Gerencie nome, cursos, disciplina, período letivo e professores da turma.</p>
          </div>

          {ehAdmin && <button onClick={() => router.push('/menu/turmas/form')}>Nova Turma</button>}
        </div>

        <StatusMessage>{erro}</StatusMessage>

        {carregando ? (
          <div className="table-card loading-text">Carregando turmas...</div>
        ) : turmas.length === 0 ? (
          <EmptyState title="Nenhuma turma cadastrada" description="Clique em Nova Turma para criar o primeiro registro." />
        ) : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cursos</th>
                  <th>Disciplina</th>
                  <th>Período Letivo</th>
                  <th>Professores</th>
                  {ehAdmin && <th>Ações</th>}
                </tr>
              </thead>

              <tbody>
                {turmas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.nome}</td>
                    <td>{nomesItens(turma.cursos)}</td>
                    <td>{turma.disciplina?.nome || '-'}</td>
                    <td>{turma.semestre?.nome || '-'}</td>
                    <td>{nomesItens(turma.professores)}</td>
                    {ehAdmin && (
                      <td className="actions-cell">
                        <button className="secondary-button" onClick={() => router.push(`/menu/turmas/form?id=${turma.id}`)}>
                          Editar
                        </button>
                        <button className="danger-button" onClick={() => excluirTurma(turma.id)}>
                          Excluir
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </RotaProtegida>
  );
}
