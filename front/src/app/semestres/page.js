'use client';

import { useState, useEffect } from 'react';
import { listarSemestres, obterSemestrePorId, criarSemestre, atualizarSemestre, deletarSemestre } from '@/utils/api';

export default function SemestresPage() {
    const [semestres, setSemestres] = useState([]);
    const [modo, setModo] = useState('listar');
    const [idEdicao, setIdEdicao] = useState(null);

    const [nome, setNome] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    useEffect(() => {
        carregarSemestres();
    }, []);

    async function carregarSemestres() {
        const dados = await listarSemestres();
        if (dados) setSemestres(dados);
    }

    async function handleExcluir(id) {
        if (confirm('Deseja realmente excluir este período letivo?')) {
            const sucesso = await deletarSemestre(id);
            if (sucesso) carregarSemestres();
        }
    }

    async function handleEditar(id) {
        const semestre = await obterSemestrePorId(id);
        if (semestre) {
            setIdEdicao(id);
            setNome(semestre.nome);
            setDataInicio(semestre.dataInicio);
            setDataFim(semestre.dataFim);
            setModo('editar');
        }
    }

    function limparFormulario() {
        setIdEdicao(null);
        setNome('');
        setDataInicio('');
        setDataFim('');
        setModo('listar');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!nome || !dataInicio || !dataFim) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        const payload = { nome, dataInicio, dataFim };

        let resultado;
        if (modo === 'editar') {
            resultado = await atualizarSemestre(idEdicao, payload);
        } else {
            resultado = await criarSemestre(payload);
        }

        if (resultado) {
            limparFormulario();
            carregarSemestres();
        }
    }

    if (modo === 'listar') {
        return (
            <div style={{ padding: '20px' }}>
                <h2>Gestão de Períodos Letivos (Semestres)</h2>
                <button onClick={() => setModo('cadastrar')} style={{ marginBottom: '20px', padding: '8px' }}>
                    Novo Período
                </button>
                <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Data Início</th>
                            <th>Data Fim</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {semestres.map(semestre => (
                            <tr key={semestre.id}>
                                <td>{semestre.id}</td>
                                <td>{semestre.nome}</td>
                                <td>{semestre.dataInicio}</td>
                                <td>{semestre.dataFim}</td>
                                <td>
                                    <button onClick={() => handleEditar(semestre.id)} style={{ marginRight: '10px' }}>Editar</button>
                                    <button onClick={() => handleExcluir(semestre.id)}>Excluir</button>
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
            <h2>{modo === 'editar' ? 'Editar Período' : 'Cadastrar Período'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>
                    Nome do Período: *
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: 2026/1" style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    Data de Início: *
                    <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </label>
                <label>
                    Data de Fim: *
                    <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} style={{ width: '100%', padding: '8px' }} />
                </label>
                <div>
                    <button type="submit" style={{ marginRight: '10px', padding: '8px 15px' }}>Salvar</button>
                    <button type="button" onClick={limparFormulario} style={{ padding: '8px 15px' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}