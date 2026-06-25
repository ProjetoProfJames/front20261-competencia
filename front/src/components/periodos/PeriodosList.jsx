'use client';

import React, { useEffect, useState } from 'react';
import { periodosService } from '../../services/periodosService';

export default function PeriodosList() {
  const [periodos, setPeriodos] = useState([]);
  const [loading, setLoading] = useState(true);

 const carregarPeriodos = async () => {
  try {
    const dados = await periodosService.listar();
    setPeriodos(dados || []);
  } catch (error) {
    console.log('Backend offline, exibindo interface de períodos estática:', error);
    setPeriodos([]); 
  } finally {
    setLoading(false); 
  }
};

  useEffect(() => {
    carregarPeriodos();
  }, []);

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este período?')) {
      try {
        await periodosService.excluir(id);
        alert('Período excluído com sucesso!');
        carregarPeriodos();
      } catch (error) {
        alert('Erro ao excluir período.');
      }
    }
  };

  if (loading) return <p>Carregando períodos...</p>;

  return (
    <div className="listagem-dados">
      <h2>Períodos Letivos</h2>
      {periodos.length === 0 ? (
        <p>Nenhum período cadastrado ainda.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Período</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {periodos.map((p) => (
              <tr key={p.id}>
                <td>{p.ano}/{p.semestre}</td>
                <td>
                  <button className="btn-edit">Editar</button>
                  <button className="btn-del" onClick={() => handleExcluir(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}