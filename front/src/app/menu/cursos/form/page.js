'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import StatusMessage from '@/app/framework/StatusMessage';
import { atualizarCurso, buscarCursoPorId, criarCurso } from '@/utils/services/cursoService';
import { listarUsuarios } from '@/utils/services/userService';

function idsSelecionados(options) {
  return Array.from(options, (option) => option.value);
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
      <main className="form-page">
        <form className="form-card" onSubmit={salvarCurso}>
          <div className="form-title">
            <span>Cursos</span>
            <h1>{id ? 'Editar Curso' : 'Novo Curso'}</h1>
          </div>

          {carregando ? (
            <p className="loading-text">Carregando dados...</p>
          ) : (
            <>
              <label>Nome</label>
              <input value={nome} onChange={(event) => setNome(event.target.value)} maxLength="120" />

              <label>Coordenador</label>
              <select value={coordenadorId} onChange={(event) => setCoordenadorId(event.target.value)}>
                <option value="">Selecione um coordenador</option>
                {coordenadores.map((coordenador) => (
                  <option key={coordenador.id} value={coordenador.id}>
                    {coordenador.username} ({coordenador.email})
                  </option>
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
                <button type="button" className="secondary-button" onClick={() => router.push('/menu/cursos')}>Cancelar</button>
              </div>
            </>
          )}
        </form>
      </main>
    </RotaProtegida>
  );
}

export default function CursoFormPage() {
  return (
    <Suspense fallback={<main className="loading-page">Carregando...</main>}>
      <CursoFormContent />
    </Suspense>
  );
}
