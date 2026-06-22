'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import EmptyState from '@/app/framework/EmptyState';
import StatusMessage from '@/app/framework/StatusMessage';
import { listarPeriodosLetivos, removerPeriodoLetivo } from '@/utils/services/periodoLetivoService';

function formatarData(data) {
  if (!data) {
    return '-';
  }

  return data.split('-').reverse().join('/');
}

export default function PeriodosLetivosPage() {
  const router = useRouter();
  const [periodos, setPeriodos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregarPeriodos() {
    try {
      setErro('');
      setCarregando(true);
      const data = await listarPeriodosLetivos();
      setPeriodos(Array.isArray(data) ? data : []);
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os períodos letivos');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirPeriodo(id) {
    const confirmar = confirm('Deseja excluir este período letivo?');

    if (!confirmar) {
      return;
    }

    try {
      setErro('');
      await removerPeriodoLetivo(id);
      await carregarPeriodos();
    } catch (error) {
      setErro(error.message || 'Não foi possível excluir o período letivo');
    }
  }

  useEffect(() => {
    carregarPeriodos();
  }, []);

  return (
    <RotaProtegida roles={['ADMIN']}>
      <main className="page-container">
        <div className="page-header">
          <div className="page-title">
            <span>Cadastro</span>
            <h1>Períodos Letivos</h1>
            <p>Gerencie o nome e as datas de início e fim dos períodos letivos.</p>
          </div>

          <button onClick={() => router.push('/menu/periodos-letivos/form')}>Novo Período</button>
        </div>

        <StatusMessage>{erro}</StatusMessage>

        {carregando ? (
          <div className="table-card loading-text">Carregando períodos...</div>
        ) : periodos.length === 0 ? (
          <EmptyState title="Nenhum período cadastrado" description="Clique em Novo Período para criar o primeiro registro." />
        ) : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Data de início</th>
                  <th>Data de fim</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {periodos.map((periodo) => (
                  <tr key={periodo.id}>
                    <td>{periodo.nome}</td>
                    <td>{formatarData(periodo.dataInicio)}</td>
                    <td>{formatarData(periodo.dataFim)}</td>
                    <td className="actions-cell">
                      <button className="secondary-button" onClick={() => router.push(`/menu/periodos-letivos/form?id=${periodo.id}`)}>
                        Editar
                      </button>
                      <button className="danger-button" onClick={() => excluirPeriodo(periodo.id)}>
                        Excluir
                      </button>
                    </td>
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
