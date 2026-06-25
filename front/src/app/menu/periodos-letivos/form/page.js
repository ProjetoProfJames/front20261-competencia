'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import Button from '@/app/framework/components/Button';
import Container from '@/app/framework/components/Layouts/Container';
import FormInput from '@/app/framework/components/FormInput';
import StatusMessage from '@/app/framework/StatusMessage';
import { atualizarPeriodoLetivo, buscarPeriodoLetivoPorId, criarPeriodoLetivo } from '@/utils/services/periodoLetivoService';

const formStyles = {
  main: {
    padding: 'var(--spacing-lg) 0'
  },
  card: {
    maxWidth: '780px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(72, 32, 233, 0.08)',
    padding: 'var(--spacing-lg)'
  },
  header: {
    marginBottom: 'var(--spacing-lg)',
    paddingBottom: 'var(--spacing-md)',
    borderBottom: '1px solid rgba(72, 32, 233, 0.1)'
  },
  eyebrow: {
    color: 'var(--secondary-color)',
    fontSize: '0.85rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 'var(--spacing-sm)'
  },
  title: {
    color: 'var(--primary-color)',
    fontSize: '2rem',
    marginBottom: 'var(--spacing-sm)'
  },
  description: {
    color: '#4a5568',
    lineHeight: 1.6
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
    marginBottom: 'var(--spacing-md)'
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-color)'
  },
  control: {
    width: '100%',
    padding: 'var(--spacing-md)',
    fontSize: '14px',
    border: '1px solid #cccccc',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: '#ffffff',
    outline: 'none'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'var(--spacing-md)'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 'var(--spacing-sm)',
    flexWrap: 'wrap',
    marginTop: 'var(--spacing-lg)'
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid rgba(239, 100, 87, 0.25)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-md)',
    marginTop: 'var(--spacing-md)'
  },
  loadingCard: {
    color: '#4a5568',
    textAlign: 'center',
    padding: 'var(--spacing-lg)'
  }
};

function CampoFormulario({ label, children }) {
  return (
    <div style={formStyles.fieldGroup}>
      <label style={formStyles.label}>{label}</label>
      {children}
    </div>
  );
}

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
      <main style={formStyles.main}>
        <Container>
          <form style={formStyles.card} onSubmit={salvarPeriodo}>
            <div style={formStyles.header}>
              <p style={formStyles.eyebrow}>Períodos Letivos</p>
              <h1 style={formStyles.title}>{id ? 'Editar Período Letivo' : 'Novo Período Letivo'}</h1>
              <p style={formStyles.description}>Defina o nome e o intervalo de datas do período letivo.</p>
            </div>

            {carregando ? (
              <p style={formStyles.loadingCard}>Carregando dados...</p>
            ) : (
              <>
                <FormInput
                  type="form-group"
                  label="Nome"
                  name="nome"
                  placeholder="Ex: 2026/1"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />

                <div style={formStyles.grid}>
                  <CampoFormulario label="Data de início">
                    <input type="date" style={formStyles.control} value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} />
                  </CampoFormulario>

                  <CampoFormulario label="Data de fim">
                    <input type="date" style={formStyles.control} value={dataFim} onChange={(event) => setDataFim(event.target.value)} />
                  </CampoFormulario>
                </div>

                {erro && (
                  <div style={formStyles.errorBox}>
                    <StatusMessage>{erro}</StatusMessage>
                  </div>
                )}

                <div style={formStyles.actions}>
                  <Button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
                  <Button variant="secondary" onClick={() => router.push('/menu/periodos-letivos')}>Cancelar</Button>
                </div>
              </>
            )}
          </form>
        </Container>
      </main>
    </RotaProtegida>
  );
}

export default function PeriodoLetivoFormPage() {
  return (
    <Suspense fallback={<main style={formStyles.loadingCard}>Carregando...</main>}>
      <PeriodoLetivoFormContent />
    </Suspense>
  );
}
