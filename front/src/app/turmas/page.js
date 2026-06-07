'use client';

import { useState, useEffect } from 'react';
import { listarTurmas, obterTurmaPorId, criarTurma, atualizarTurma, deletarTurma } from '@/utils/api';

export default function TurmasPage() {
    const [turmas, setTurmas] = useState([]);
    const [modo, setModo] = useState('listar');
    const [idEdicao, setIdEdicao] = useState(null);

    const [nome, setNome] = useState('');
    const [cursoIds, setCursoIds] = useState('');
    const [disciplinaId, setDisciplinaId] = useState('');
    const [semestreId, setSemestreId] = useState('');
    const [professorIds, setProfessorIds] = useState('');

    useEffect(() => {
        carregarTurmas();
    }, []);

    async function carregarTurmas() {
        const dados = await listarTurmas();
        if (dados) setTurmas(dados);
    }

    async function handleExcluir(id) {
        if (confirm('Deseja realmente excluir esta turma?')) {
            const sucesso = await deletarTurma(id);
            if (sucesso) carregarTurmas();
        }
    }

    async function handleEditar(id) {
        const turma = await obterTurmaPorId(id);
        if (turma) {
            setIdEdicao(id);
            setNome(turma.nome);
            setCursoIds(turma.cursos?.map(c => c.id).join(',') || '');
            setDisciplinaId(turma.disciplina?.id || '');
            setSemestreId(turma.semestre?.id || '');
            setProfessorIds(turma.professores?.map(p => p.id).join(',') || '');
            setModo('editar');
        }
    }

    function limparFormulario() {
        setIdEdicao(null);
        setNome('');
        setCursoIds('');
        setDisciplinaId('');
        setSemestreId('');
        setProfessorIds('');
        setModo('listar');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!nome || !cursoIds || !disciplinaId || !semestreId) {
            alert('Preencha os campos obrigatórios.');
            return;
        }

        const payload = {
            nome,
            cursoIds: cursoIds.split(',').map(id => Number(id.trim())),
            disciplinaId: Number(disciplinaId),
            semestreId: Number(semestreId),
            professorIds: professorIds ? professorIds.split(',').map(id => Number(id.trim())) : []
        };

        let resultado;
        if (modo === 'editar') {
            resultado = await atualizarTurma(idEdicao, payload);
        } else {
            resultado = await criarTurma(payload);
        }

        if (resultado) {
            limparFormulario();
            carregarTurmas();
        }
    }

    if (modo === 'listar') {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Gestão de Turmas</h2>
                <button onClick={() => setModo('cadastrar')} style={{ marginBottom: '20px', padding: '8px' }}>
                    Nova Turma
                </button>
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Cursos</th>
                            <th>Período (Semestre)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turmas.map(turma => (
                            <tr key={turma.id}>
                                <td>{turma.id}</td>
                                <td>{turma.nome}</td>
                                <td>{turma.cursos?.map(c => c.nome).join(', ') || 'Nenhum'}</td>
                                <td>{turma.semestre?.nome || 'Não definido'}</td>
                                <td>
                                    <button onClick={() => handleEditar(turma.id)} style={{ marginRight: '10px' }}>Editar</button>
                                    <button onClick={() => handleExcluir(turma.id)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '500px' }}>
            <h2>{modo === 'editar' ? 'Editar Turma' : 'Cadastrar Turma'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>
                    Nome da Turma: *
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    IDs dos Cursos (separados por vírgula): *
                    <input type="text" value={cursoIds} onChange={e => setCursoIds(e.target.value)} placeholder="Ex: 1, 2" style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    ID da Disciplina: *
                    <input type="number" value={disciplinaId} onChange={e => setDisciplinaId(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    ID do Período (Semestre): *
                    <input type="number" value={semestreId} onChange={e => setSemestreId(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    IDs dos Professores (separados por vírgula):
                    <input type="text" value={professorIds} onChange={e => setProfessorIds(e.target.value)} placeholder="Ex: 4, 5" style={{ width: '100%', padding: '8px' }} />
                </label>
                <div>
                    <button type="submit" style={{ marginRight: '10px', padding: '8px 15px' }}>Salvar</button>
                    <button type="button" onClick={limparFormulario} style={{ padding: '8px 15px' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}