'use client'

import { useEffect, useState } from 'react';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import api from "@/utils/api"
import auth from '@/utils/auth';
import { useParams } from 'next/navigation';

export default function LocalEditPage() {
    const [local, setLocal] = useState({ numero: '' });
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const params = useParams();

    useEffect(() => {
        const user = auth.protectPage(['ADMIN', 'COORDENADOR']);

        if (!user) {
            return;
        }

        const loadLocal = async () => {
            try {
                setCarregando(true);
                const tempLocal = await api.get(`/locais/${params.id}`);
                setLocal({ ...tempLocal })
            } catch (error) {
                setMensagem(error.message);
            } finally {
                setCarregando(false);
            }
        }
        loadLocal()
    }, [params.id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocal((prevLocal) => ({ ...prevLocal, [name]: value }));
    };

    const validar = () => {
        if (!local.numero) {
            setMensagem('Preencha o numero do local');
            return false;
        }

        return true;
    }

    const handleSubmit = async () => {
        if (!validar()) {
            return;
        }

        try {
            setLoading(true);
            setMensagem('');
            await api.put(`/locais/${params.id}`, { numero: local.numero })
            alert('Local atualizado com sucesso');
            location.href = '/locais';
        } catch (error) {
            setMensagem(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1>Editar Local</h1>
            {mensagem && <p>{mensagem}</p>}
            {carregando && <p>Carregando...</p>}
            {!carregando && <div>
                <FormInput label="Numero" type="text" name="numero" value={local.numero} onChange={handleChange} required></FormInput>
                <Button type="button" onClick={handleSubmit} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Local'}</Button>
                <Button type="button" onClick={() => location.href = '/locais'}>Voltar</Button>
            </div>}
        </>
    );
}
