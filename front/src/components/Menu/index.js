'use client'
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import auth from "@/utils/auth";

export default function Menu() {
    const [user, setUser] = useState(null);
    const [path, setPath] = useState('');

    useEffect(() => {
        setPath(location.pathname);

        if (location.pathname === '/login') {
            return;
        }

        const loggedUser = auth.protectPage();

        if (loggedUser) {
            setUser(loggedUser);
        }
    }, []);

    const links = [
        { label: 'Home', href: '/home', profiles: ['ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO', 'AVALIADOR_EXTERNO'] },
        { label: 'Usuarios', href: '/users', profiles: ['ADMIN', 'PROFESSOR'] },
        { label: 'Locais', href: '/locais', profiles: ['ADMIN', 'COORDENADOR'] },
    ];

    if (path === '/login' || !user) {
        return null;
    }

    return (
        <div>
            <p>Usuario: {user.username}</p>
            {
                links.map((link) => {
                    if (link.profiles.includes(user.profile)) {
                        return <a key={link.href} href={link.href}>{link.label} </a>
                    }
                    return null;
                })
            }
            <Button type="button" onClick={auth.logout}>Logout</Button>
        </div>
    )
}
