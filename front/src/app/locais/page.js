'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
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

    function handleCriar() {
        setIdEdicao(null);
        setNumero('');
        setModo('criar');
    }

    function limparFormulario() {
        setIdEdicao(null);
        setNumero('');
        setModo('listar');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!numero) {
            alert('Preencha o campo obrigatório.');
            return;
        }

        const dadosLocal = { numero };
        
        if (idEdicao) {
            const sucesso = await atualizarLocal(idEdicao, dadosLocal);
            if (sucesso) {
                carregarLocais();
                limparFormulario();
            }
        } else {
            const sucesso = await criarLocal(dadosLocal);
            if (sucesso) {
                carregarLocais();
                limparFormulario();
            }
        }
    }

    const formularioLocal = (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <label>Número do Local:</label><br />
                <input 
                    type="text" 
                    value={numero} 
                    onChange={(e) => setNumero(e.target.value)} 
                    required 
                />
            </div>
            <button type="submit">{modo === 'editar' ? 'Atualizar' : 'Criar'}</button>
            {modo !== 'listar' && (
                <button type="button" onClick={limparFormulario} style={{ marginLeft: '10px' }}>
                    Cancelar
                </button>
            )}
        </form>
    );

    if (modo === 'editar' || modo === 'criar') {
        return (
            <div style={{ padding: '20px', maxWidth: '50%', margin: '0 auto' }}>
                <h1>{modo === 'editar' ? 'Editar Local' : 'Criar Local'}</h1>
                {formularioLocal}
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '50%', margin: '0 auto' }}>
            <h1>Locais</h1>
            <Button onClick={handleCriar}>Criar Local</Button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {locais.map((local) => (
                        <tr key={local.id}>
                            <td>{local.id}</td>
                            <td>{local.numero}</td>
                            <td>
                                <button onClick={() => handleEditar(local.id)} style={{ marginRight: '10px' }}>Editar</button>
                                <button onClick={() => handleExcluir(local.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}