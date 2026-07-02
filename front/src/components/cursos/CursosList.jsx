'use client';

import React, { useEffect, useState } from 'react';
import cursosService from '../../services/cursosService';

export default function CursosList() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarCursos = async () => {
    try {
      const dados = await cursosService.listar();
      setCursos(Array.isArray(dados) ? dados : []);
    } catch (error) {
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
        carregarCursos(); 
      } catch (error) {}
    }
  };

  const handleEditar = (curso) => {
    window.dispatchEvent(new CustomEvent('editarCurso', { detail: curso }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <td>{curso.codigo || curso.sigla || `Nº ${curso.id}`}</td>
                <td>{curso.nome}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditar(curso)}>Editar</button>
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