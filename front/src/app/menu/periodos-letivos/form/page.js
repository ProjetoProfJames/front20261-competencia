'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import StatusMessage from '@/app/framework/StatusMessage';
import { atualizarPeriodoLetivo, buscarPeriodoLetivoPorId, criarPeriodoLetivo } from '@/utils/services/periodoLetivoService';

function PeriodoLetivoFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(Boolean(id));
  const [salvando, setSalvando] = useState(false);

  async function carregarPeriodo() {
    if (!id) {
      return;
    }

    try {
      setErro('');
      const periodo = await buscarPeriodoLetivoPorId(id);
      setNome(periodo.nome || '');
      setDataInicio(periodo.dataInicio || '');
      setDataFim(periodo.dataFim || '');
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar o período letivo');
    } finally {
      setCarregando(false);
    }
  }

  async function salvarPeriodo(event) {
    event.preventDefault();
    setErro('');

    if (!nome.trim() || !dataInicio || !dataFim) {
      setErro('Preencha nome, data de início e data de fim.');
      return;
    }

    if (dataFim < dataInicio) {
      setErro('A data final deve ser maior ou igual à data inicial.');
      return;
    }

    const periodoLetivo = {
      nome: nome.trim(),
      dataInicio,
      dataFim
    };

    try {
      setSalvando(true);

      if (id) {
        await atualizarPeriodoLetivo(id, periodoLetivo);
      } else {
        await criarPeriodoLetivo(periodoLetivo);
      }

      router.push('/menu/periodos-letivos');
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar o período letivo');
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarPeriodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RotaProtegida roles={['ADMIN']}>
      <main className="form-page">
        <form className="form-card" onSubmit={salvarPeriodo}>
          <div className="form-title">
            <span>Períodos Letivos</span>
            <h1>{id ? 'Editar Período Letivo' : 'Novo Período Letivo'}</h1>
          </div>

          {carregando ? (
            <p className="loading-text">Carregando dados...</p>
          ) : (
            <>
              <label>Nome</label>
              <input value={nome} onChange={(event) => setNome(event.target.value)} maxLength="120" />

              <label>Data de início</label>
              <input type="date" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} />

              <label>Data de fim</label>
              <input type="date" value={dataFim} onChange={(event) => setDataFim(event.target.value)} />

              <StatusMessage>{erro}</StatusMessage>

              <div className="form-actions">
                <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                <button type="button" className="secondary-button" onClick={() => router.push('/menu/periodos-letivos')}>Cancelar</button>
              </div>
            </>
          )}
        </form>
      </main>
    </RotaProtegida>
  );
}

export default function PeriodoLetivoFormPage() {
  return (
    <Suspense fallback={<main className="loading-page">Carregando...</main>}>
      <PeriodoLetivoFormContent />
    </Suspense>
  );
}
