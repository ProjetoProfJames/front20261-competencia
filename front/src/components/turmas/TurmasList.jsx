'use client';

import React, { useEffect, useState } from 'react';
import { turmasService } from '../../services/turmasService';

export default function TurmasList() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarTurmas = async () => {
    try {
      const dados = await turmasService.listar();
      setTurmas(dados);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
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
              <th>Turma</th>
              <th>Curso</th>
              <th>Período</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((t) => (
              <tr key={t.id}>
                <td>{t.nome}</td>
                <td>{t.cursoNome || t.cursoId}</td>
                <td>{t.periodoNome || t.periodoId}</td>
                <td>
                  <button className="btn-edit">Editar</button>
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