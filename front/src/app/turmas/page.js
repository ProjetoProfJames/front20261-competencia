'use client';

import { useState, useEffect } from 'react';
import { listarTurmas, obterTurmaPorId, criarTurma, atualizarTurma, deletarTurma } from '@/utils/api';
import DataTable from '@/components/Table';
import ActionButtons from '@/components/Button/ActionButtons';
import FormButtons from '@/components/Button/FormButtons';
import PageHeader from '@/components/PageHeader';

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

    const colunas = [
        { label: 'ID', render: (turma) => turma.id },
        { label: 'Nome', render: (turma) => turma.nome },
        { label: 'Cursos', render: (turma) => turma.cursos?.map(c => c.nome).join(', ') || 'Nenhum' },
        { label: 'Período (Semestre)', render: (turma) => turma.semestre?.nome || 'Não definido' },
    ];

    if (modo === 'listar') {
        return (
            <div style={{ padding: '20px' }}>
                <PageHeader
                    titulo="Gestão de Turmas"
                    labelBotao="Nova Turma"
                    onNovo={() => setModo('cadastrar')}
                />
                <DataTable
                    colunas={colunas}
                    dados={turmas}
                    renderAcoes={(turma) => (
                        <ActionButtons
                            onEditar={() => handleEditar(turma.id)}
                            onExcluir={() => handleExcluir(turma.id)}
                        />
                    )}
                />
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
                <FormButtons onCancelar={limparFormulario} />
            </form>
        </div>
    );
}
