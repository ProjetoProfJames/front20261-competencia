'use client';

import React, { useState } from 'react';
import { cursosService } from '../../services/cursosService';

export default function CursosForm() {
  const [nomeCurso, setNomeCurso] = useState('');
  const [codigoCurso, setCodigoCurso] = useState('');

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    if (!nomeCurso || !codigoCurso) {
      alert('Erro: Por favor, preencha todos os campos!');
      return;
    }

    try {
      const novoCurso = {
        nome: nomeCurso,
        codigo: codigoCurso
      };

      await cursosService.salvar(novoCurso);
      alert(`Curso "${nomeCurso}" salvo com sucesso no banco!`);
      
      
      setNomeCurso('');
      setCodigoCurso('');
      
      window.location.reload();
    } catch (error) {
      alert('Erro ao salvar o curso no servidor.');
    }
  };

  return (
    <form onSubmit={handleSalvar} className="form-cadastro">
      <h2>Cadastrar / Editar Curso</h2>
      <div className="input-field">
        <label>Nome do Curso:</label>
        <input 
          type="text" 
          value={nomeCurso} 
          onChange={(e) => setNomeCurso(e.target.value)} 
          placeholder="Ex: Análise e Desenvolvimento de Sistemas"
        />
      </div>
      <div className="input-field">
        <label>Código do Curso:</label>
        <input 
          type="text" 
          value={codigoCurso} 
          onChange={(e) => setCodigoCurso(e.target.value)} 
          placeholder="Ex: TADS"
        />
      </div>
      <button type="submit">Salvar Curso</button>
    </form>
  );
}