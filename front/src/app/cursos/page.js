'use client';

import React, { useState } from 'react';

export default function CadastroCursos() {
  const [nomeCurso, setNomeCurso] = useState('');
  const [codigoCurso, setCodigoCurso] = useState('');

 const handleSalvar = (e) => {
    e.preventDefault();
    if (!nomeCurso || !codigoCurso) {
      alert('Erro: Por favor, preencha todos os campos!');
      return;
    }
    alert(`Curso ${nomeCurso} cadastrado com sucesso! (Aguardando integração com o backend)`);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '500px' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Gestão de Cursos</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Task 2 - CRUD de Cursos, Períodos Letivos e Turmas</p>

      <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Nome do Curso:</label>
          <input 
            type="text" 
            placeholder="Ex: Análise e Desenvolvimento de Sistemas" 
            value={nomeCurso}
            onChange={(e) => setNomeCurso(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Código do Curso:</label>
          <input 
            type="text" 
            placeholder="Ex: TADS" 
            value={codigoCurso}
            onChange={(e) => setCodigoCurso(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>

        <button 
          type="submit" 
          style={{ padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
        >
          Salvar Curso
        </button>
      </form>
    </div>
  );
}