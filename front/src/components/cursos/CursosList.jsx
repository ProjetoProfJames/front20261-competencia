'use client';

import React, { useEffect, useState } from 'react';
import { cursosService } from '../../services/cursosService';

export default function CursosList() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarCursos = async () => {
    try {
      const dados = await cursosService.listar();
      
      setCursos(dados || []);
    } catch (error) {
      console.log('Backend offline, exibindo interface estática:', error);
      setCursos([]); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await cursosService.excluir(id);
        alert('Curso excluído com sucesso!');
        carregarCursos(); 
      } catch (error) {
        alert('Erro ao excluir curso.');
      }
    }
  };

  if (loading) return <p>Carregando cursos...</p>;

  return (
    <div className="listagem-dados">
      <h2>Cursos Cadastrados</h2>
      {cursos.length === 0 ? (
        <p>Nenhum curso cadastrado ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome do Curso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.codigo}</td>
                <td>{curso.nome}</td>
                <td>
                  <button className="btn-edit">Editar</button>
                  <button className="btn-del" onClick={() => handleExcluir(curso.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}