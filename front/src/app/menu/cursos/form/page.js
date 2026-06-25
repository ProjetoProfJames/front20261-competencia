'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import Button from '@/app/framework/components/Button';
import Container from '@/app/framework/components/Layouts/Container';
import FormInput from '@/app/framework/components/FormInput';
import StatusMessage from '@/app/framework/StatusMessage';
import { atualizarCurso, buscarCursoPorId, criarCurso } from '@/utils/services/cursoService';
import { listarUsuarios } from '@/utils/services/userService';

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

function CursoFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [nome, setNome] = useState('');
  const [coordenadorId, setCoordenadorId] = useState('');
  const [professorIds, setProfessorIds] = useState([]);
  const [coordenadores, setCoordenadores] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregarDados() {
    try {
      setErro('');
      setCarregando(true);
      const usuarios = await listarUsuarios();
      const listaUsuarios = Array.isArray(usuarios) ? usuarios : [];

      setCoordenadores(listaUsuarios.filter((usuario) => usuario.profile === 'COORDENADOR'));
      setProfessores(listaUsuarios.filter((usuario) => usuario.profile === 'PROFESSOR'));

      if (id) {
        const curso = await buscarCursoPorId(id);
        setNome(curso.nome || '');
        setCoordenadorId(String(curso.coordenador?.id || ''));
        setProfessorIds(Array.isArray(curso.professores) ? curso.professores.map((professor) => String(professor.id)) : []);
      }
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar os dados do curso');
    } finally {
      setCarregando(false);
    }
  }

  async function salvarCurso(event) {
    event.preventDefault();
    setErro('');

    if (!nome.trim() || !coordenadorId || professorIds.length === 0) {
      setErro('Preencha nome, coordenador e pelo menos um professor.');
      return;
    }

    const curso = {
      nome: nome.trim(),
      coordenadorId: Number(coordenadorId),
      professorIds: professorIds.map(Number)
    };

    try {
      setSalvando(true);

      if (id) {
        await atualizarCurso(id, curso);
      } else {
        await criarCurso(curso);
      }

      router.push('/menu/cursos');
    } catch (error) {
      setErro(error.message || 'Não foi possível salvar o curso');
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RotaProtegida roles={['ADMIN']}>
      <main style={formStyles.main}>
        <Container>
          <form style={formStyles.card} onSubmit={salvarCurso}>
            <div style={formStyles.header}>
              <p style={formStyles.eyebrow}>Cursos</p>
              <h1 style={formStyles.title}>{id ? 'Editar Curso' : 'Novo Curso'}</h1>
              <p style={formStyles.description}>Informe o nome do curso, selecione o coordenador responsável e vincule os professores.</p>
            </div>

            {carregando ? (
              <p style={formStyles.loadingCard}>Carregando dados...</p>
            ) : (
              <>
                <FormInput
                  type="form-group"
                  label="Nome"
                  name="nome"
                  placeholder="Ex: Sistemas de Informação"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                />

                <CampoFormulario label="Coordenador">
                  <select style={formStyles.control} value={coordenadorId} onChange={(event) => setCoordenadorId(event.target.value)}>
                    <option value="">Selecione um coordenador</option>
                    {coordenadores.map((coordenador) => (
                      <option key={coordenador.id} value={coordenador.id}>
                        {coordenador.username} ({coordenador.email})
                      </option>
                    ))}
                  </select>
                </CampoFormulario>

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
                  <Button variant="secondary" onClick={() => router.push('/menu/cursos')}>Cancelar</Button>
                </div>
              </>
            )}
          </form>
        </Container>
      </main>
    </RotaProtegida>
  );
}

export default function CursoFormPage() {
  return (
    <Suspense fallback={<main style={formStyles.loadingCard}>Carregando...</main>}>
      <CursoFormContent />
    </Suspense>
  );
}
