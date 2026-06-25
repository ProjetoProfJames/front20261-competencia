'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import Button from '@/app/framework/components/Button';
import Container from '@/app/framework/components/Layouts/Container';
import FormInput from '@/app/framework/components/FormInput';
import StatusMessage from '@/app/framework/StatusMessage';
import { listarCursos } from '@/utils/services/cursoService';
import { listarDisciplinas } from '@/utils/services/disciplinaService';
import { listarPeriodosLetivos } from '@/utils/services/periodoLetivoService';
import { atualizarTurma, buscarTurmaPorId, criarTurma } from '@/utils/services/turmaService';
import { listarUsuarios } from '@/utils/services/userService';

const formStyles = {
  main: {
    padding: 'var(--spacing-lg) 0'
  },
  card: {
    maxWidth: '840px',
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
  multiSelect: {
    width: '100%',
    minHeight: '140px',
    padding: 'var(--spacing-md)',
    fontSize: '14px',
    border: '1px solid #cccccc',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: '#ffffff',
    outline: 'none'
  },
  help: {
    color: '#718096',
    fontSize: '0.85rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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

function idsSelecionados(options) {
  return Array.from(options, (option) => option.value);
}

function CampoFormulario({ label, help, children }) {
  return (
    <div style={formStyles.fieldGroup}>
      <label style={formStyles.label}>{label}</label>
      {children}
      {help && <small style={formStyles.help}>{help}</small>}
    </div>
  );
}

function TurmaFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [nome, setNome] = useState('');
  const [cursoIds, setCursoIds] = useState([]);
  const [disciplinaId, setDisciplinaId] = useState('');
  const [semestreId, setSemestreId] = useState('');
  const [professorIds, setProfessorIds] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const disciplinasFiltradas = useMemo(() => {
    if (cursoIds.length === 0) {
      return disciplinas;
    }

    const ids = cursoIds.map(Number);
    return disciplinas.filter((disciplina) => ids.includes(Number(disciplina.cursoId)));
  }, [cursoIds, disciplinas]);

  async function carregarDados() {
    try {
      setErro('');
      setCarregando(true);

      const [cursosData, periodosData, disciplinasData, usuariosData] = await Promise.all([
        listarCursos(),
        listarPeriodosLetivos(),
        listarDisciplinas(),
        listarUsuarios()
      ]);

      setCursos(Array.isArray(cursosData) ? cursosData : []);
      setPeriodos(Array.isArray(periodosData) ? periodosData : []);
      setDisciplinas(Array.isArray(disciplinasData) ? disciplinasData : []);
      setProfessores(Array.isArray(usuariosData) ? usuariosData.filter((usuario) => usuario.profile === 'PROFESSOR') : []);

      if (id) {
        const turma = await buscarTurmaPorId(id);
        setNome(turma.nome || '');
        setCursoIds(Array.isArray(turma.cursos) ? turma.cursos.map((curso) => String(curso.id)) : []);
        setDisciplinaId(String(turma.disciplina?.id || ''));
        setSemestreId(String(turma.semestre?.id || ''));
        setProfessorIds(Array.isArray(turma.professores) ? turma.professores.map((professor) => String(professor.id)) : []);
      }
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os dados da turma');
    } finally {
      setCarregando(false);
    }
  }

  async function salvarTurma(event) {
    event.preventDefault();
    setErro('');

    if (!nome.trim() || cursoIds.length === 0 || !disciplinaId || !semestreId || professorIds.length === 0) {
      setErro('Preencha nome, curso, disciplina, período letivo e pelo menos um professor.');
      return;
    }

    const turma = {
      nome: nome.trim(),
      cursoIds: cursoIds.map(Number),
      disciplinaId: Number(disciplinaId),
      semestreId: Number(semestreId),
      professorIds: professorIds.map(Number)
    };

    try {
      setSalvando(true);

      if (id) {
        await atualizarTurma(id, turma);
      } else {
        await criarTurma(turma);
      }

      router.push('/menu/turmas');
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar a turma');
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (disciplinaId && disciplinasFiltradas.length > 0) {
      const disciplinaSelecionadaExiste = disciplinasFiltradas.some((disciplina) => String(disciplina.id) === disciplinaId);
      if (!disciplinaSelecionadaExiste) {
        setDisciplinaId('');
      }
    }
  }, [cursoIds, disciplinaId, disciplinasFiltradas]);

  return (
    <RotaProtegida roles={['ADMIN']}>
      <main style={formStyles.main}>
        <Container>
          <form style={formStyles.card} onSubmit={salvarTurma}>
            <div style={formStyles.header}>
              <p style={formStyles.eyebrow}>Turmas</p>
              <h1 style={formStyles.title}>{id ? 'Editar Turma' : 'Nova Turma'}</h1>
              <p style={formStyles.description}>Monte a turma vinculando curso, disciplina, período letivo e professores responsáveis.</p>
            </div>

            {carregando ? (
              <p style={formStyles.loadingCard}>Carregando dados...</p>
            ) : (
              <>
                <FormInput
                  type="form-group"
                  label="Nome"
                  name="nome"
                  placeholder="Ex: Turma A"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />

                <CampoFormulario label="Cursos" help="Segure Ctrl ou Command para selecionar mais de um curso.">
                  <select multiple style={formStyles.multiSelect} value={cursoIds} onChange={(event) => setCursoIds(idsSelecionados(event.target.selectedOptions))}>
                    {cursos.map((curso) => (
                      <option key={curso.id} value={curso.id}>{curso.nome}</option>
                    ))}
                  </select>
                </CampoFormulario>

                <div style={formStyles.grid}>
                  <CampoFormulario label="Disciplina">
                    <select style={formStyles.control} value={disciplinaId} onChange={(event) => setDisciplinaId(event.target.value)}>
                      <option value="">Selecione uma disciplina</option>
                      {disciplinasFiltradas.map((disciplina) => (
                        <option key={disciplina.id} value={disciplina.id}>
                          {disciplina.nome} {disciplina.cursoNome ? `- ${disciplina.cursoNome}` : ''}
                        </option>
                      ))}
                    </select>
                  </CampoFormulario>

                  <CampoFormulario label="Período Letivo">
                    <select style={formStyles.control} value={semestreId} onChange={(event) => setSemestreId(event.target.value)}>
                      <option value="">Selecione um período</option>
                      {periodos.map((periodo) => (
                        <option key={periodo.id} value={periodo.id}>{periodo.nome}</option>
                      ))}
                    </select>
                  </CampoFormulario>
                </div>

                <CampoFormulario label="Professores" help="Segure Ctrl ou Command para selecionar mais de um professor.">
                  <select multiple style={formStyles.multiSelect} value={professorIds} onChange={(event) => setProfessorIds(idsSelecionados(event.target.selectedOptions))}>
                    {professores.map((professor) => (
                      <option key={professor.id} value={professor.id}>
                        {professor.username} ({professor.email})
                      </option>
                    ))}
                  </select>
                </CampoFormulario>

                {erro && (
                  <div style={formStyles.errorBox}>
                    <StatusMessage>{erro}</StatusMessage>
                  </div>
                )}

                <div style={formStyles.actions}>
                  <Button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
                  <Button variant="secondary" onClick={() => router.push('/menu/turmas')}>Cancelar</Button>
                </div>
              </>
            )}
          </form>
        </Container>
      </main>
    </RotaProtegida>
  );
}

export default function TurmaFormPage() {
  return (
    <Suspense fallback={<main style={formStyles.loadingCard}>Carregando...</main>}>
      <TurmaFormContent />
    </Suspense>
  );
}
