'use client';

import React, { useState, useEffect } from 'react';
import cursosService from '../../services/cursosService';

export default function CursosForm() {
  const [idEdicao, setIdEdicao] = useState(null);
  const [nomeCurso, setNomeCurso] = useState('');
  const [codigoCurso, setCodigoCurso] = useState('');

  useEffect(() => {
    const carregarParaEdicao = (e) => {
      const curso = e.detail;
      setIdEdicao(curso.id);
      setNomeCurso(curso.nome);
      setCodigoCurso(curso.codigo || curso.sigla || '');
    };

    window.addEventListener('editarCurso', carregarParaEdicao);
    return () => window.removeEventListener('editarCurso', carregarParaEdicao);
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    
    if (!nomeCurso || !codigoCurso) {
      alert("Preencha todos os campos!");
      return;
    }

 const dadosParaJava = {
  nome: nomeCurso,
  coordenadorId: 2, 
  professorIds: [3] 
};
    try {
      if (idEdicao) {
        await cursosService.atualizar(idEdicao, dadosParaJava);
        alert("Curso atualizado com sucesso!");
      } else {
        await cursosService.salvar(dadosParaJava);
        alert("Curso salvo com sucesso!");
      }
      
      setIdEdicao(null);
      setNomeCurso('');
      setCodigoCurso('');
      window.location.reload(); 
    } catch (error) {
      alert("Erro ao processar.");
    }
  };

  const cancelarEdicao = () => {
    setIdEdicao(null);
    setNomeCurso('');
    setCodigoCurso('');
  };

  return (
    <form onSubmit={handleSalvar} className="form-cadastro">
      <h2>{idEdicao ? 'Editar Curso' : 'Cadastrar Curso'}</h2>
      <div className="input-field">
        <label>Nome do Curso:</label>
        <input 
          type="text" 
          value={nomeCurso} 
          onChange={(e) => setNomeCurso(e.target.value)} 
        />
      </div>
      <div className="input-field">
        <label>Código do Curso:</label>
        <input 
          type="text" 
          value={codigoCurso} 
          onChange={(e) => setCodigoCurso(e.target.value)} 
        />
      </div>
      
      <button type="submit">{idEdicao ? 'Atualizar' : 'Salvar Curso'}</button>
      
      {idEdicao && (
        <button type="button" onClick={cancelarEdicao} style={{ marginLeft: '10px', backgroundColor: 'gray', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cancelar
        </button>
      )}
    </form>
  );
}