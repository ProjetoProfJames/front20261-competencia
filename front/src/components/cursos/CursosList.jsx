'use client';

import React from 'react';

export default function CursosList() {
  // Simulação de dados fictícios enquanto não conecta o service
  const cursosFake = [
    { id: 1, nome: 'Análise e Desenvolvimento de Sistemas', codigo: 'TADS' },
    { id: 2, nome: 'Sistemas de Informação', codigo: 'SI' }
  ];

  return (
    <div className="listagem-dados">
      <h2>Cursos Cadastrados</h2>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome do Curso</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursosFake.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.codigo}</td>
              <td>{curso.nome}</td>
              <td>
                <button className="btn-edit">Editar</button>
                <button className="btn-del">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}