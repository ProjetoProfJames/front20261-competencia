'use client'
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import api from "@/utils/api";
import auth from "@/utils/auth";
import { useEffect, useState } from "react";

export default function LocalNewPage() {
    const [local, setLocal] = useState({ numero: "" })
    const [mensagem, setMensagem] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        auth.protectPage(['ADMIN', 'COORDENADOR']);
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocal((prevLocal) => ({ ...prevLocal, [name]: value }));
    }

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
            await api.post('/locais', local);
            alert('Local criado com sucesso');
            location.href = '/locais';
        } catch (error) {
            setMensagem(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <section className="content-panel">
            <h1>Novo Local</h1>
            {mensagem && <p className="mensagem">{mensagem}</p>}
            <div className="form-grid">
                <FormInput label="Numero" type="text" name="numero" value={local.numero} onChange={handleChange}></FormInput>
                <Button type="button" onClick={handleSubmit} disabled={loading}>{loading ? 'Salvando...' : 'Criar Local'}</Button>
            </div>
            </section>
        </div>
    )
}
