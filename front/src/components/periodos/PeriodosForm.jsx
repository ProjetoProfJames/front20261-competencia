'use client';

import React, { useState, useEffect } from 'react';
import periodosService from '../../services/periodosService';

export default function PeriodosForm({ periodoEditando, limparEdicao }) {
  const [ano, setAno] = useState('');
  const [semestre, setSemestre] = useState('1');

  useEffect(() => {
    if (periodoEditando && periodoEditando.nome) {
      const partes = periodoEditando.nome.split('/');
      if (partes.length === 2) {
        setAno(partes[0]);
        setSemestre(partes[1]);
      }
    } else {
      setAno('');
      setSemestre('1');
    }
  }, [periodoEditando]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!ano) {
      alert('Erro: Preencha o ano do período letivo!');
      return;
    }

    const nomeFormatado = `${ano}/${semestre}`;
    const dataInicio = semestre === '1' ? `${ano}-02-01` : `${ano}-08-01`;
    const dataFim = semestre === '1' ? `${ano}-07-15` : `${ano}-12-15`;

    const dadosParaJava = { 
      nome: nomeFormatado, 
      dataInicio: dataInicio, 
      dataFim: dataFim 
    };

    try {
      if (periodoEditando) {
        await periodosService.atualizar(periodoEditando.id, dadosParaJava);
        alert(`Período ${nomeFormatado} atualizado com sucesso!`);
      } else {
        await periodosService.salvar(dadosParaJava);
        alert(`Período ${nomeFormatado} salvo com sucesso!`);
      }
      
      window.location.reload(); 
    } catch (error) {
      alert('Erro ao processar o período.');
    }
  };

  return (
    <form onSubmit={handleSalvar} className="form-cadastro">
      <h2>{periodoEditando ? `Editar Período` : `Cadastrar Período Letivo`}</h2>
      <div className="input-field">
        <label>Ano:</label>
        <input 
          type="number" 
          value={ano} 
          onChange={(e) => setAno(e.target.value)} 
          placeholder="Ex: 2026"
        />
      </div>
      <div className="input-field">
        <label>Semestre:</label>
        <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
          <option value="1">1º Semestre</option>
          <option value="2">2º Semestre</option>
        </select>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit">{periodoEditando ? 'Atualizar Período' : 'Salvar Período'}</button>
        {periodoEditando && (
          <button type="button" onClick={limparEdicao} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar Edição
          </button>
        )}
      </div>
    </form>
  );
}