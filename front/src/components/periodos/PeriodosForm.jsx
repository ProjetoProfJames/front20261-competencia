'use client';

import React, { useState } from 'react';
import { periodosService } from '../../services/periodosService';

export default function PeriodosForm() {
  const [ano, setAno] = useState('');
  const [semestre, setSemestre] = useState('1');

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!ano) {
      alert('Erro: Preencha o ano do período letivo!');
      return;
    }

    try {
      const novoPeriodo = { ano: parseInt(ano), semestre: parseInt(semestre) };
      await periodosService.salvar(novoPeriodo);
      alert(`Período ${ano}/${semestre} salvo com sucesso!`);
      setAno('');
      window.location.reload();
    } catch (error) {
      alert('Erro ao salvar o período.');
    }
  };

  return (
    <form onSubmit={handleSalvar} className="form-cadastro">
      <h2>Cadastrar / Editar Período Letivo</h2>
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
      <button type="submit">Salvar Período</button>
    </form>
  );
}