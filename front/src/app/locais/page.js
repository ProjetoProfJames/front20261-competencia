'use client'
import api from '@/utils/api';
import auth from '@/utils/auth';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';

export default function LocalPage() {
    const [lista, setLista] = useState([])
    const [mensagem, setMensagem] = useState('')
    const [loading, setLoading] = useState(true)
    const [excluindo, setExcluindo] = useState(null)

    const carregarLocais = async () => {
        try {
            setLoading(true);
            const res = await api.get('/locais');
            setLista(res)
        } catch (error) {
            setMensagem(error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const user = auth.protectPage(['ADMIN', 'COORDENADOR']);

        if (user) {
            carregarLocais();
        }
    }, [])

    const excluirLocal = async (id) => {
        if (!confirm('Deseja excluir este local?')) {
            return;
        }

        try {
            setExcluindo(id);
            await api.del(`/locais/${id}`);
            setMensagem('Local excluido com sucesso');
            carregarLocais();
        } catch (error) {
            setMensagem(error.message);
        } finally {
            setExcluindo(null);
        }
    }

    return (
        <>
            <h1>Locais de Apresentacao</h1>
            {mensagem && <p>{mensagem}</p>}
            <div>
                <Button onClick={() => { location.href = '/locais/new' }}>Novo</Button>
            </div>
            {loading && <p>Carregando...</p>}
            {!loading && <table>
                <thead>
                    <tr>
                        <th>numero</th>
                        <th>acoes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        lista.map((local) => {
                            return (
                                <tr key={local.id}>
                                    <td>{local.numero}</td>
                                    <td>
                                        <Button onClick={() => location.href = `/locais/${local.id}`}>Editar</Button>
                                        <Button onClick={() => excluirLocal(local.id)} disabled={excluindo === local.id}>{excluindo === local.id ? 'Excluindo...' : 'Excluir'}</Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {lista.length === 0 && <tr><td colSpan="2">Nenhum local cadastrado</td></tr>}
                </tbody>
            </table>}
        </>
    )
}
