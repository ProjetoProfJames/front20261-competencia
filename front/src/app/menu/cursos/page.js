'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import EmptyState from '@/app/framework/EmptyState';
import StatusMessage from '@/app/framework/StatusMessage';
import { listarCursos, removerCurso } from '@/utils/services/cursoService';

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

  return (
    <RotaProtegida roles={['ADMIN']}>
      <main className="page-container">
        <div className="page-header">
          <div className="page-title">
            <span>Cadastro</span>
            <h1>Cursos</h1>
            <p>Gerencie nome, coordenador e professores vinculados aos cursos.</p>
          </div>

          <button onClick={() => router.push('/menu/cursos/form')}>Novo Curso</button>
        </div>

        <StatusMessage>{erro}</StatusMessage>

        {carregando ? (
          <div className="table-card loading-text">Carregando cursos...</div>
        ) : cursos.length === 0 ? (
          <EmptyState title="Nenhum curso cadastrado" description="Clique em Novo Curso para criar o primeiro registro." />
        ) : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Coordenador</th>
                  <th>Professores</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {cursos.map((curso) => (
                  <tr key={curso.id}>
                    <td>{curso.nome}</td>
                    <td>{curso.coordenador?.username || curso.coordenador?.email || '-'}</td>
                    <td>{nomesUsuarios(curso.professores)}</td>
                    <td className="actions-cell">
                      <button className="secondary-button" onClick={() => router.push(`/menu/cursos/form?id=${curso.id}`)}>
                        Editar
                      </button>
                      <button className="danger-button" onClick={() => excluirCurso(curso.id)}>
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
