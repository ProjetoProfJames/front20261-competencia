'use client'
import styles from './header.module.css';
import Button from '@/app/framework/components/Button';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removerToken, verificarToken } from '@/utils/api/Auth';
import { obterToken } from '@/utils/api/Auth';
import Row from '../Layouts/Row';

export default function Header() {
    const router = useRouter();
    const [estaAutenticado, setEstaAutenticado] = useState(false);
    
    useEffect(() => {
        setEstaAutenticado(verificarToken())
    }, []);

    function handleLogout(){
        removerToken()
        setEstaAutenticado(false)
        router.push('/login')
    }

    function botoeMenu() {
        const paginas = ['users', 'turmas', 'projetos', 'locais', 'cursos', 'avaliacoes']
        return( paginas.map( pagina => (
            <Button key={pagina} type={'azul'} onClick={() => router.push(`/menu/${pagina}`)}>{pagina}</Button>
        )))
    }

    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.mainContent}>
                    <h1>Sistema de Cadastro de Projetos</h1>
                </div>
                {estaAutenticado ? (
                    <div>
                        <Row align={'center'} justify={'evenly'}>
                            {botoeMenu()}
                            <Button type={'laranja'} onClick={() => router.push(`/menu`)}>Menu</Button>
                        </Row>
                    </div>
                ) : (
                    <></>
                )}
                {estaAutenticado ? (
                    <div>
                        <Button type={'vermelho'} onClick={() => handleLogout()}>Log-out</Button>
                    </div>
                ) : (
                    <div>
                        <Button type={'azul'} onClick={() => router.push('/login')}>Login</Button>
                    </div>
                )}
            </header>
        </div>
    );
}