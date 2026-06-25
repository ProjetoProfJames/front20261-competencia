'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import Button from '@/app/framework/components/Button';
import Container from '@/app/framework/components/Layouts/Container';
import Row from '@/app/framework/components/Layouts/Row';
import Col from '@/app/framework/components/Layouts/Col';
import Table from '@/app/framework/components/Table';
import StatusMessage from '@/app/framework/StatusMessage';
import { obterRole } from '@/utils/api/Auth';
import { listarTurmas, removerTurma } from '@/utils/services/turmaService';

const pageStyles = {
  main: {
    padding: 'var(--spacing-lg) 0'
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(72, 32, 233, 0.08)',
    padding: 'var(--spacing-lg)',
    marginBottom: 'var(--spacing-lg)'
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
    lineHeight: 1.6,
    maxWidth: '720px'
  },
  headerAction: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%'
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(72, 32, 233, 0.08)',
    padding: 'var(--spacing-md)'
  },
  stateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(72, 32, 233, 0.08)',
    padding: 'var(--spacing-lg)',
    textAlign: 'center',
    color: '#4a5568'
  },
  stateTitle: {
    color: 'var(--primary-color)',
    marginBottom: 'var(--spacing-sm)'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    flexWrap: 'wrap'
  },
  errorBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid rgba(239, 100, 87, 0.25)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-lg)'
  }
};

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

  const colunas = [
    { label: 'Nome', key: 'nome' },
    { label: 'Cursos', key: 'cursos' },
    { label: 'Disciplina', key: 'disciplina' },
    { label: 'Período Letivo', key: 'periodoLetivo' },
    { label: 'Professores', key: 'professores' },
    ...(ehAdmin ? [{ label: 'Ações', key: 'acoes' }] : [])
  ];

  const dadosTabela = turmas.map((turma) => ({
    id: turma.id,
    nome: turma.nome,
    cursos: nomesItens(turma.cursos),
    disciplina: turma.disciplina?.nome || '-',
    periodoLetivo: turma.semestre?.nome || '-',
    professores: nomesItens(turma.professores),
    ...(ehAdmin ? {
      acoes: (
        <div style={pageStyles.actions}>
          <Button variant="secondary" onClick={() => router.push(`/menu/turmas/form?id=${turma.id}`)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => excluirTurma(turma.id)}>
            Excluir
          </Button>
        </div>
      )
    } : {})
  }));

  return (
    <RotaProtegida roles={['ADMIN', 'ALUNO', 'PROFESSOR', 'COORDENADOR']}>
      <main style={pageStyles.main}>
        <Container>
          <section style={pageStyles.headerCard}>
            <Row align="center">
              <Col>
                <p style={pageStyles.eyebrow}>Cadastro</p>
                <h1 style={pageStyles.title}>Turmas</h1>
                <p style={pageStyles.description}>Gerencie nome, cursos, disciplina, período letivo e professores da turma.</p>
              </Col>
              {ehAdmin && (
                <Col>
                  <div style={pageStyles.headerAction}>
                    <Button onClick={() => router.push('/menu/turmas/form')}>+ Nova Turma</Button>
                  </div>
                </Col>
              )}
            </Row>
          </section>

          {erro && (
            <div style={pageStyles.errorBox}>
              <StatusMessage>{erro}</StatusMessage>
            </div>
          )}

          {carregando ? (
            <div style={pageStyles.stateCard}>Carregando turmas...</div>
          ) : turmas.length === 0 ? (
            <div style={pageStyles.stateCard}>
              <h2 style={pageStyles.stateTitle}>Nenhuma turma cadastrada</h2>
              <p>Clique em Nova Turma para criar o primeiro registro.</p>
            </div>
          ) : (
            <div style={pageStyles.tableCard}>
              <Table columns={colunas} data={dadosTabela} />
            </div>
          )}
        </Container>
      </main>
    </RotaProtegida>
  );
}
