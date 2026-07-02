'use client';

import React, { useState, useEffect } from 'react';
import turmasService from '../../services/turmasService';
import cursosService from '../../services/cursosService';
import periodosService from '../../services/periodosService';

export default function TurmasForm({ turmaEditando, limparEdicao }) {
  const [nomeTurma, setNomeTurma] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [periodoId, setPeriodoId] = useState('');
  const [disciplinaId, setDisciplinaId] = useState(''); 
  const [professorId, setProfessorId] = useState(''); 

  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    const carregarDadosAuxiliares = async () => {
      try {
        const dadosCursos = await cursosService.listar();
        setCursos(Array.isArray(dadosCursos) ? dadosCursos : (dadosCursos?.data || []));
        
        const dadosPeriodos = await periodosService.listar();
        setPeriodos(Array.isArray(dadosPeriodos) ? dadosPeriodos : (dadosPeriodos?.data || []));
      } catch (e) {
        setCursos([]);
        setPeriodos([]);
      }
    };
    carregarDadosAuxiliares();
  }, []);

  useEffect(() => {
    if (turmaEditando) {
      setNomeTurma(turmaEditando.nome || '');
      setCursoId(turmaEditando.cursos?.length > 0 ? turmaEditando.cursos[0].id : '');
      setPeriodoId(turmaEditando.semestre?.id || '');
      setDisciplinaId(turmaEditando.disciplina?.id || '');
      setProfessorId(turmaEditando.professores?.length > 0 ? turmaEditando.professores[0].id : '');
    } else {
      setNomeTurma('');
      setCursoId('');
      setPeriodoId('');
      setDisciplinaId('');
      setProfessorId('');
    }
  }, [turmaEditando]);

  const handleSalvar = async (e) => {
    e.preventDefault();

    if (!nomeTurma || !cursoId || !periodoId || !disciplinaId || !professorId) {
      alert("Erro: Preencha todos os campos!");
      return;
    }

    const dadosParaJava = {
      nome: nomeTurma,
      cursoIds: [parseInt(cursoId)],
      semestreId: parseInt(periodoId),
      disciplinaId: parseInt(disciplinaId),
      professorIds: [parseInt(professorId)]
    };

    try {
      if (turmaEditando) {
        await turmasService.atualizar(turmaEditando.id, dadosParaJava);
        alert('Turma atualizada com sucesso!');
      } else {
        console.log("Dados que estou enviando para o Java:", dadosParaJava);
        await turmasService.salvar(dadosParaJava);
        alert('Turma salva com sucesso!');
      }
      window.location.reload();
    } catch (error) {
      alert('Erro ao processar turma. Olhe o F12!');
    }
  };

  return (
    <form onSubmit={handleSalvar} className="form-cadastro">
      <h2>{turmaEditando ? `Editar Turma` : `Cadastrar Turma`}</h2>
      
      <div className="input-field">
        <label>Nome da Turma:</label>
        <input type="text" value={nomeTurma} onChange={e => setNomeTurma(e.target.value)} required />
      </div>

      <div className="input-field">
        <label>Curso:</label>
        <select value={cursoId} onChange={e => setCursoId(e.target.value)} required>
          <option value="">Selecione um Curso</option>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>
      </div>

      <div className="input-field">
        <label>Período (Semestre):</label>
        <select value={periodoId} onChange={e => setPeriodoId(e.target.value)} required>
          <option value="">Selecione um Período</option>
          {periodos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
      </div>

      <div className="input-field">
        <label>ID da Disciplina:</label>
        <input type="number" value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)} required />
      </div>

      <div className="input-field">
        <label>ID do Professor:</label>
        <input type="number" value={professorId} onChange={e => setProfessorId(e.target.value)} required />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit">{turmaEditando ? 'Atualizar Turma' : 'Salvar Turma'}</button>
        {turmaEditando && (
          <button type="button" onClick={limparEdicao} style={{ backgroundColor: '#6c757d', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar Edição
          </button>
        )}
      </div>
    </form>
  );
}