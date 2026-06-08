'use client';

import { useState, useEffect } from 'react';
import { listarCursos, obterCursoPorId, criarCurso, atualizarCurso, deletarCurso } from '@/utils/api';

export default function CursosPage() {
    const [cursos, setCursos] = useState([]);
    const [modo, setModo] = useState('listar');
    const [idEdicao, setIdEdicao] = useState(null);
    
    const [nome, setNome] = useState('');
    const [coordenadorId, setCoordenadorId] = useState('');
    const [professorIds, setProfessorIds] = useState('');

    useEffect(() => {
        carregarCursos();
    }, []);

    async function carregarCursos() {
        const dados = await listarCursos();
        if (dados) setCursos(dados);
    }

    async function handleExcluir(id) {
        if (confirm('Deseja realmente excluir este curso?')) {
            const sucesso = await deletarCurso(id);
            if (sucesso) carregarCursos();
        }
    }

    async function handleEditar(id) {
        const curso = await obterCursoPorId(id);
        if (curso) {
            setIdEdicao(id);
            setNome(curso.nome);
            setCoordenadorId(curso.coordenador?.id || '');
            setProfessorIds(curso.professores?.map(p => p.id).join(',') || '');
            setModo('editar');
        }
    }

    function limparFormulario() {
        setIdEdicao(null);
        setNome('');
        setCoordenadorId('');
        setProfessorIds('');
        setModo('listar');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!nome || !coordenadorId) {
            alert('Preencha os campos obrigatórios.');
            return;
        }

        const payload = {
            nome,
            coordenadorId: Number(coordenadorId),
            professorIds: professorIds ? professorIds.split(',').map(id => Number(id.trim())) : []
        };

        let resultado;
        if (modo === 'editar') {
            resultado = await atualizarCurso(idEdicao, payload);
        } else {
            resultado = await criarCurso(payload);
        }

        if (resultado) {
            limparFormulario();
            carregarCursos();
        }
    }

    if (modo === 'listar') {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Gestão de Cursos</h2>
                <button onClick={() => setModo('cadastrar')} style={{ marginBottom: '20px', padding: '8px' }}>
                    Novo Curso
                </button>
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Coordenador</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cursos.map(curso => (
                            <tr key={curso.id}>
                                <td>{curso.id}</td>
                                <td>{curso.nome}</td>
                                <td>{curso.coordenador?.username || 'Não atribuído'}</td>
                                <td>
                                    <button onClick={() => handleEditar(curso.id)} style={{ marginRight: '10px' }}>Editar</button>
                                    <button onClick={() => handleExcluir(curso.id)}>Excluir</button>
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
            <h2>{modo === 'editar' ? 'Editar Curso' : 'Cadastrar Curso'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>
                    Nome do Curso: *
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    ID do Coordenador: *
                    <input type="number" value={coordenadorId} onChange={e => setCoordenadorId(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    IDs dos Professores (separados por vírgula):
                    <input type="text" value={professorIds} onChange={e => setProfessorIds(e.target.value)} placeholder="Ex: 1, 2, 3" style={{ width: '100%', padding: '8px' }} />
                </label>
                <div>
                    <button type="submit" style={{ marginRight: '10px', padding: '8px 15px' }}>Salvar</button>
                    <button type="button" onClick={limparFormulario} style={{ padding: '8px 15px' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}