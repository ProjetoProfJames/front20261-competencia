'use client';

import React, { useEffect, useState } from 'react';
import turmasService from '../../services/turmasService';

export default function TurmasList({ aoClicarEmEditar }) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarTurmas = async () => {
    try {
      const dados = await turmasService.listar();
      setTurmas(Array.isArray(dados) ? dados : (dados?.data || []));
    } catch (error) {
      console.log('Erro ao buscar turmas:', error);
      setTurmas([]); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        await turmasService.excluir(id);
        alert('Turma excluída com sucesso!');
        carregarTurmas();
      } catch (error) {
        alert('Erro ao excluir turma.');
      }
    }
  };
const handleMatricular = async (turmaId) => {
    const alunoId = prompt("Digite o ID do Aluno que deseja matricular nesta turma:");
    
    if (!alunoId) return;

    try {
      await turmasService.adicionarAluno(turmaId, alunoId);
      alert('Aluno matriculado com sucesso!');
      carregarTurmas();
    } catch (error) {
      alert('Erro ao matricular aluno. Verifique se o ID existe.');
    }
  };
  if (loading) return <p>Carregando turmas...</p>;

  return (
    <div className="listagem-dados">
      <h2>Turmas Cadastradas</h2>
      {turmas.length === 0 ? (
        <p>Nenhuma turma cadastrada ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Curso</th>
              <th>Período</th>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((t) => (
              <tr key={t.id}>
                <td>{t.nome}</td>
                <td>{t.cursos && t.cursos.length > 0 ? t.cursos[0].nome : 'Não informado'}</td>
                <td>{t.semestre?.nome || 'Não informado'}</td>
                <td>{t.disciplina?.nome || 'Não informado'}</td>
                <td>{t.professores && t.professores.length > 0 ? t.professores[0].username : 'Não informado'}</td>
                
  <td>
                  <button 
                    className="btn-add" 
                    onClick={() => handleMatricular(t.id)}
                    style={{ backgroundColor: '#28a745', color: 'white', marginRight: '5px', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    + Aluno
                  </button>
                  <button className="btn-edit" onClick={() => aoClicarEmEditar && aoClicarEmEditar(t)}>Editar</button>
                  <button className="btn-del" onClick={() => handleExcluir(t.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}