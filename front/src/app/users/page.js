'use client'
import api from '@/utils/api';
import auth from '@/utils/auth';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';

export default function UserPage() {
    const [lista, setLista] = useState([])
    const [userLogado, setUserLogado] = useState(null)
    const [mensagem, setMensagem] = useState('')
    const [loading, setLoading] = useState(true)
    const [excluindo, setExcluindo] = useState(null)

    const carregarUsuarios = async () => {
        try {
            setLoading(true);
            const res = await api.get('/users');
            setLista(res)
        } catch (error) {
            setMensagem(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const user = auth.protectPage(['ADMIN', 'PROFESSOR']);

        if (user) {
            setUserLogado(user);
            carregarUsuarios();
        }
    }, [])

    const excluirUsuario = async (id) => {
        if (!confirm('Deseja excluir este usuario?')) {
            return;
        }

        try {
            setExcluindo(id);
            await api.del(`/users/${id}`);
            setMensagem('Usuario excluido com sucesso');
            carregarUsuarios();
        } catch (error) {
            setMensagem(error.message);
        } finally {
            setExcluindo(null);
        }
    }

    return (
        <div className="page-content">
            <section className="content-panel">
            <h1>Usuarios</h1>
            {mensagem && <p className="mensagem">{mensagem}</p>}
            <div className="page-actions">
                {userLogado?.profile === 'ADMIN' && <Button onClick={() => { location.href = '/users/new' }}>+ Adicionar</Button>}
            </div>
            {loading && <p className="mensagem">Carregando...</p>}
            {!loading && <table className="tabela-simples">
                <thead>
                    <tr>
                        <th>username</th>
                        <th>email</th>
                        <th>profile</th>
                        <th>acoes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lista.map((user) => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.profile}</td>
                                    <td className="acoes">
                                        <Button onClick={() => location.href = `/users/${user.id}`}>Editar</Button>
                                        {userLogado?.profile === 'ADMIN' && <Button onClick={() => excluirUsuario(user.id)} disabled={excluindo === user.id}>{excluindo === user.id ? 'Excluindo...' : 'Excluir'}</Button>}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>}
            </section>
        </div>
    )
}
