'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import StatusMessage from '@/app/framework/StatusMessage';
import { listarCursos } from '@/utils/services/cursoService';
import { listarDisciplinas } from '@/utils/services/disciplinaService';
import { listarPeriodosLetivos } from '@/utils/services/periodoLetivoService';
import { atualizarTurma, buscarTurmaPorId, criarTurma } from '@/utils/services/turmaService';
import { listarUsuarios } from '@/utils/services/userService';

function idsSelecionados(options) {
  return Array.from(options, (option) => option.value);
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
      <main className="form-page">
        <form className="form-card" onSubmit={salvarTurma}>
          <div className="form-title">
            <span>Turmas</span>
            <h1>{id ? 'Editar Turma' : 'Nova Turma'}</h1>
          </div>

          {carregando ? (
            <p className="loading-text">Carregando dados...</p>
          ) : (
            <>
              <label>Nome</label>
              <input value={nome} onChange={(event) => setNome(event.target.value)} maxLength="120" />

              <label>Cursos</label>
              <select multiple value={cursoIds} onChange={(event) => setCursoIds(idsSelecionados(event.target.selectedOptions))}>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>{curso.nome}</option>
                ))}
              </select>
              <small className="field-help">Segure Ctrl ou Command para selecionar mais de um curso.</small>

              <label>Disciplina</label>
              <select value={disciplinaId} onChange={(event) => setDisciplinaId(event.target.value)}>
                <option value="">Selecione uma disciplina</option>
                {disciplinasFiltradas.map((disciplina) => (
                  <option key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome} {disciplina.cursoNome ? `- ${disciplina.cursoNome}` : ''}
                  </option>
                ))}
              </select>

              <label>Período Letivo</label>
              <select value={semestreId} onChange={(event) => setSemestreId(event.target.value)}>
                <option value="">Selecione um período</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>{periodo.nome}</option>
                ))}
              </select>

              <label>Professores</label>
              <select multiple value={professorIds} onChange={(event) => setProfessorIds(idsSelecionados(event.target.selectedOptions))}>
                {professores.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.username} ({professor.email})
                  </option>
                ))}
              </select>
              <small className="field-help">Segure Ctrl ou Command para selecionar mais de um professor.</small>

              <StatusMessage>{erro}</StatusMessage>

              <div className="form-actions">
                <button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
                <button type="button" className="secondary-button" onClick={() => router.push('/menu/turmas')}>Cancelar</button>
              </div>
            </>
          )}
        </form>
      </main>
    </RotaProtegida>
  );
}

export default function TurmaFormPage() {
  return (
    <Suspense fallback={<main className="loading-page">Carregando...</main>}>
      <TurmaFormContent />
    </Suspense>
  );
}
