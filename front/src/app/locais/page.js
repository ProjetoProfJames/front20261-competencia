'use client';
import { useState, useEffect } from 'react';
import { listarLocais, obterLocalPorId, criarLocal, atualizarLocal, deletarLocal } from '@/utils/api';

export default function LocaisPage() {
    const [locais, setLocais] = useState([]);
    const [modo, setModo] = useState('listar');
    const [idEdicao, setIdEdicao] = useState(null);

    const [numero, setNumero] = useState('');
    useEffect(() => {
        carregarLocais();
    }, []);

    async function carregarLocais() {
        const dados = await listarLocais();
        if (dados) setLocais(dados);
    }
    async function handleExcluir(id) {
        if (confirm('Deseja realmente excluir este local?')) {
            const sucesso = await deletarLocal(id);
            if (sucesso) carregarLocais();
        }
    }

    async function handleEditar(id) {
        const local = await obterLocalPorId(id);
        if (local) {
            setIdEdicao(id);
            setNumero(local.numero);
            setModo('editar');
        }
    }

    function limparFormulario() {
        setIdEdicao(null);
        setNumero('');
        setModo('listar');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (modo === 'editar') {
            const sucesso = await atualizarLocal(idEdicao, { numero });
            if (sucesso) {
                carregarLocais();
                limparFormulario();
            }
        } else {
            const sucesso = await criarLocal({ numero });
            if (sucesso) {
                carregarLocais();
                limparFormulario();
            }
        }
    }
        return (
        <div style={{ padding: '20px', maxWidth: '50%', margin: '0 auto' }}>
            <h1>Locais</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Número do local"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                />
                <button type="submit">{modo === 'editar' ? 'Atualizar' : 'Criar'}</button>
                {modo === 'editar' && <button type="button" onClick={limparFormulario}>Cancelar</button>}
            </form> 
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {locais.map(local => (
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td>{local.numero}</td>
                            <td>
                                <button onClick={() => handleEditar(local.id)}>Editar</button>
                                <button onClick={() => handleDeletar(local.id)}>Deletar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}