'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { listarUsuarios, obterUsuarioPorId, criarUsuario, atualizarUsuario, deletarUsuario } from '@/utils/api';

export default function UsuariosPage() {
    const [usuarios, setUsuarios] = useState([]);
    const [modo, setModo] = useState('listar');
    const [idEdicao, setIdEdicao] = useState(null);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profile, setProfile] = useState('');
    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function carregarUsuarios() {
        const dados = await listarUsuarios();
        if (dados) setUsuarios(dados);
    }

    async function handleExcluir(id) {
        if (confirm('Deseja realmente excluir este usuário?')) {
            const sucesso = await deletarUsuario(id);
            if (sucesso) carregarUsuarios();
        }
    }

    async function handleEditar(id) {
        const usuario = await obterUsuarioPorId(id);
        if (usuario) {
            setIdEdicao(id);
            setUsername(usuario.username);
            setEmail(usuario.email);
            setPassword('');
            setProfile(usuario.profile || '');
            setModo('editar');
        }
    }

    function handleCriar() {
        setIdEdicao(null);
        setUsername('');
        setEmail('');
        setPassword('');
        setProfile('');
        setModo('criar');
    }

    function limparFormulario() {
        setIdEdicao(null);
        setUsername('');
        setEmail('');
        setPassword('');
        setProfile('');
        setModo('listar');
    }

    const formularioUsuario = (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <label>Username:</label><br />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>Email:</label><br />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>Senha:</label><br />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <label>Perfil:</label><br />
                <select value={profile} onChange={(e) => setProfile(e.target.value)} required>
                    <option value="">Selecione um perfil</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="COORDENADOR">COORDENADOR</option>
                    <option value="ALUNO">ALUNO</option>
                    <option value="PROFESSOR">PROFESSOR</option>
                    <option value="AVALIADOR_EXTERNO">AVALIADOR_EXTERNO</option>
                </select>
            </div>
            <button type="submit">{modo === 'editar' ? 'Atualizar' : 'Criar'}</button>
            {modo !== 'listar' && (
                <button type="button" onClick={limparFormulario} style={{ marginLeft: '10px' }}>
                    Cancelar
                </button>
            )}
        </form>
    );

    async function handleSubmit(e) {
        e.preventDefault();
        if (!username || !email) {
            alert('Preencha os campos obrigatórios.');
            return;
        }

        const dadosUsuario = { username, email, profile };
        if (password) dadosUsuario.password = password;
        if (idEdicao) {
            const sucesso = await atualizarUsuario(idEdicao, dadosUsuario);
            if (sucesso) {
                carregarUsuarios();
                limparFormulario();
            }
        } else {
            const sucesso = await criarUsuario(dadosUsuario);
            if (sucesso) {
                carregarUsuarios();
                limparFormulario();
            }
        }
    }

    if (modo === 'editar' || modo === 'criar') {
        return (
            <div style={{ padding: '20px', maxWidth: '50%', margin: '0 auto' }}>
                <h1>{modo === 'editar' ? 'Editar Usuário' : 'Criar Usuário'}</h1>
                {formularioUsuario}
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '50%', margin: '0 auto' }}>
            <h1>Usuários</h1>
            <Button onClick={handleCriar}>Criar Usuário</Button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Perfis</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.username}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.profile}</td>
                            <td>
                                <button onClick={() => handleEditar(usuario.id)} style={{ marginRight: '10px' }}>Editar</button>
                                <button onClick={() => handleExcluir(usuario.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
