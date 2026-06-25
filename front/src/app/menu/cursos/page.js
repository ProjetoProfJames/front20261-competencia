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
import { listarCursos, removerCurso } from '@/utils/services/cursoService';

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

function nomesUsuarios(usuarios = []) {
  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    return '-';
  }

  return usuarios.map((usuario) => usuario.username || usuario.email || `ID ${usuario.id}`).join(', ');
}

export default function CursosPage() {
  const router = useRouter();
  const [cursos, setCursos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregarCursos() {
    try {
      setErro('');
      setCarregando(true);
      const data = await listarCursos();
      setCursos(Array.isArray(data) ? data : []);
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os cursos');
    } finally {
      setCarregando(false);
    }
  }

  async function excluirCurso(id) {
    const confirmar = confirm('Deseja excluir este curso?');

    if (!confirmar) {
      return;
    }

    try {
      setErro('');
      await removerCurso(id);
      await carregarCursos();
    } catch (error) {
      setErro(error.message || 'Não foi possível excluir o curso');
    }
  }

  useEffect(() => {
    carregarCursos();
  }, []);

  const colunas = [
    { label: 'Nome', key: 'nome' },
    { label: 'Coordenador', key: 'coordenador' },
    { label: 'Professores', key: 'professores' },
    { label: 'Ações', key: 'acoes' }
  ];

  const dadosTabela = cursos.map((curso) => ({
    id: curso.id,
    nome: curso.nome,
    coordenador: curso.coordenador?.username || curso.coordenador?.email || '-',
    professores: nomesUsuarios(curso.professores),
    acoes: (
      <div style={pageStyles.actions}>
        <Button variant="secondary" onClick={() => router.push(`/menu/cursos/form?id=${curso.id}`)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => excluirCurso(curso.id)}>
          Excluir
        </Button>
      </div>
    )
  }));

  return (
    <RotaProtegida roles={['ADMIN']}>
      <main style={pageStyles.main}>
        <Container>
          <section style={pageStyles.headerCard}>
            <Row align="center">
              <Col>
                <p style={pageStyles.eyebrow}>Cadastro</p>
                <h1 style={pageStyles.title}>Cursos</h1>
                <p style={pageStyles.description}>Gerencie nome, coordenador e professores vinculados aos cursos.</p>
              </Col>
              <Col>
                <div style={pageStyles.headerAction}>
                  <Button onClick={() => router.push('/menu/cursos/form')}>+ Novo Curso</Button>
                </div>
              </Col>
            </Row>
          </section>

          {erro && (
            <div style={pageStyles.errorBox}>
              <StatusMessage>{erro}</StatusMessage>
            </div>
          )}

          {carregando ? (
            <div style={pageStyles.stateCard}>Carregando cursos...</div>
          ) : cursos.length === 0 ? (
            <div style={pageStyles.stateCard}>
              <h2 style={pageStyles.stateTitle}>Nenhum curso cadastrado</h2>
              <p>Clique em Novo Curso para criar o primeiro registro.</p>
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
