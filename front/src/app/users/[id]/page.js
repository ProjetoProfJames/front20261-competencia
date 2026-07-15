'use client'

import { useEffect, useState } from 'react';
import FormInput from '@/components/FormInput';
import Button from '@/components/Button';
import api from "@/utils/api"
import auth from '@/utils/auth';
import { useParams } from 'next/navigation';

export default function UserEditPage() {
    const [user, setUser] = useState({ username: '', email: '', password: '', profile: '' });
    const [userLogado, setUserLogado] = useState(null);
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const params = useParams();

    useEffect(() => {
        const loggedUser = auth.protectPage(['ADMIN', 'PROFESSOR', 'COORDENADOR', 'ALUNO', 'AVALIADOR_EXTERNO']);

        if (!loggedUser) {
            return;
        }

        setUserLogado(loggedUser);

        const loadUser = async () => {
            try {
                setCarregando(true);
                const tempUser = await api.get(`/users/${params.id}`);
                if (loggedUser.profile !== 'ADMIN' && loggedUser.id !== tempUser.id) {
                    location.href = '/nao-autorizado';
                    return;
                }
                setUser({ ...tempUser, password: '' })
            } catch (error) {
                setMensagem(error.message);
            } finally {
                setCarregando(false);
            }
        }
        loadUser()
    }, [params.id])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const validar = () => {
        if (!user.username || !user.profile) {
            setMensagem('Preencha username e perfil');
            return false;
        }

        if (user.password && user.password.length < 6) {
            setMensagem('A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        return true;
    }

    const handleSubmit = async () => {
        if (!validar()) {
            return;
        }

        const userUpdate = {
            username: user.username
        }

        if (userLogado?.profile === 'ADMIN') {
            userUpdate.profile = user.profile;
        }

        if (user.password) {
            userUpdate.password = user.password;
        }

        try {
            setLoading(true);
            setMensagem('');
            const res = await api.put(`/users/${params.id}`, userUpdate)

            if (userLogado && userLogado.id === res.id) {
                localStorage.setItem('USER', JSON.stringify(res));
            }

            alert('Usuario atualizado com sucesso');
            location.href = '/users';
        } catch (error) {
            setMensagem(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1>Editar Usuario</h1>
            {mensagem && <p>{mensagem}</p>}
            {carregando && <p>Carregando...</p>}
            {!carregando && <div>
                <p>Email: {user.email}</p>
                <FormInput label="Nome" type="text" name="username" value={user.username} onChange={handleChange} required></FormInput>
                <FormInput label="Senha" type="password" name="password" value={user.password} onChange={handleChange}></FormInput>
                <select name="profile" value={user.profile} onChange={handleChange} disabled={userLogado?.profile !== 'ADMIN'}>
                    <option value="">Selecione o perfil</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="COORDENADOR">COORDENADOR</option>
                    <option value="PROFESSOR">PROFESSOR</option>
                    <option value="ALUNO">ALUNO</option>
                    <option value="AVALIADOR_EXTERNO">AVALIADOR_EXTERNO</option>
                </select>
                <Button type="button" onClick={handleSubmit} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Usuario'}</Button>
                <Button type="button" onClick={() => location.href = '/users'}>Voltar</Button>
            </div>}
        </>
    );
}
