'use client';

import { useState, useEffect } from 'react';
import { listarCursos, obterCursoPorId, criarCurso, atualizarCurso, deletarCurso } from '@/utils/api';
import DataTable from '@/components/Table';
import ActionButtons from '@/components/Button/ActionButtons';
import FormButtons from '@/components/Button/FormButtons';
import PageHeader from '@/components/PageHeader';

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

    const colunas = [
        { label: 'ID', render: (curso) => curso.id },
        { label: 'Nome', render: (curso) => curso.nome },
        { label: 'Coordenador', render: (curso) => curso.coordenador?.username || 'Não atribuído' },
    ];

    if (modo === 'listar') {
        return (
            <div style={{ padding: '20px' }}>
                <PageHeader
                    titulo="Gestão de Cursos"
                    labelBotao="Novo Curso"
                    onNovo={() => setModo('cadastrar')}
                />
                <DataTable
                    colunas={colunas}
                    dados={cursos}
                    renderAcoes={(curso) => (
                        <ActionButtons
                            onEditar={() => handleEditar(curso.id)}
                            onExcluir={() => handleExcluir(curso.id)}
                        />
                    )}
                />
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
                <FormButtons onCancelar={limparFormulario} />
            </form>
        </div>
    );
}
