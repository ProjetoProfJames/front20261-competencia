'use client';

import { useState, useEffect } from 'react';
import { listarSemestres, obterSemestrePorId, criarSemestre, atualizarSemestre, deletarSemestre } from '@/utils/api';
import DataTable from '@/components/Table';
import ActionButtons from '@/components/Button/ActionButtons';
import FormButtons from '@/components/Button/FormButtons';
import PageHeader from '@/components/PageHeader';

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

    const colunas = [
        { label: 'ID', render: (semestre) => semestre.id },
        { label: 'Nome', render: (semestre) => semestre.nome },
        { label: 'Data Início', render: (semestre) => semestre.dataInicio },
        { label: 'Data Fim', render: (semestre) => semestre.dataFim },
    ];

    if (modo === 'listar') {
        return (
            <div style={{ padding: '20px' }}>
                <PageHeader
                    titulo="Gestão de Períodos Letivos (Semestres)"
                    labelBotao="Novo Período"
                    onNovo={() => setModo('cadastrar')}
                />
                <DataTable
                    colunas={colunas}
                    dados={semestres}
                    renderAcoes={(semestre) => (
                        <ActionButtons
                            onEditar={() => handleEditar(semestre.id)}
                            onExcluir={() => handleExcluir(semestre.id)}
                        />
                    )}
                />
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
                <FormButtons onCancelar={limparFormulario} />
            </form>
        </div>
    );
}
