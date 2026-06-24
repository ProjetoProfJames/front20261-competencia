'use client';

import React, { useEffect, useState } from 'react';
import { turmasService } from '../../services/turmasService';
import { cursosService } from '../../services/cursosService';
import { periodosService } from '../../services/periodosService';

export default function TurmasForm() {
  const [nomeTurma, setNomeTurma] = useState('');
  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState('');
  
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    const buscarDadosFiltros = async () => {
      try {
        // Buscando os dados de forma segura individualmente para não quebrar o Promise.all
        const listaCursos = await cursosService.listar().catch(() => []);
        const listaPeriodos = await periodosService.listar().catch(() => []);
        
        setCursos(listaCursos || []);
        setPeriodos(listaPeriodos || []);
      } catch (e) {
        console.log('Backend offline, os seletores do formulário iniciarão vazios.');
        setCursos([]);
        setPeriodos([]);
      }
    };
    buscarDadosFiltros();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (!nomeTurma || !cursoSelecionado || !periodoSelecionado) {
      alert('Erro: Preencha todos os campos da turma!');
      return;
    }

    try {
      const novaTurma = {
        nome: nomeTurma,
        cursoId: cursoSelecionado,
        periodoId: periodoSelecionado
      };
      await turmasService.salvar(novaTurma);
      alert(`Turma ${nomeTurma} salva com sucesso!`);
      setNomeTurma('');
      window.location.reload();
    } catch (error) {
      alert('Erro ao salvar turma.');
    }
  };

  return (
    <form onSubmit={handleSalvar} className="form-cadastro">
      <h2>Cadastrar / Editar Turma</h2>
      <div className="input-field">
        <label>Nome da Turma:</label>
        <input 
          type="text" 
          value={nomeTurma} 
          onChange={(e) => setNomeTurma(e.target.value)} 
          placeholder="Ex: TADS - Noite"
        />
      </div>
      <div className="input-field">
        <label>Curso:</label>
        <select value={cursoSelecionado} onChange={(e) => setCursoSelecionado(e.target.value)}>
          <option value="">Selecione um Curso</option>
          {cursos.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>
      <div className="input-field">
        <label>Período Letivo:</label>
        <select value={periodoSelecionado} onChange={(e) => setPeriodoSelecionado(e.target.value)}>
          <option value="">Selecione um Período</option>
          {periodos.map(p => (
            <option key={p.id} value={p.id}>{p.ano}/{p.semestre}</option>
          ))}
        </select>
      </div>
      <button type="submit">Salvar Turma</button>
    </form>
  );
}