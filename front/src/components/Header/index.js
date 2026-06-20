'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { logout, getUsername } from '@/utils/api';

import Button from "@/components/Button";
import OptionLink from "@/components/OptionLink";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const user = getUsername();
        if (user) {
            setUsername(user);
        }

        const token = localStorage.getItem('JWT');
        if (!token) {
            router.push('/login');
        }
    }, [pathname, router]);

    return (
        <header>
            <nav>
                <OptionLink href="menu" label="Menu" />
                <OptionLink href="semestres" label="Semestres" />
                <OptionLink href="cursos" label="Cursos" />
                <OptionLink href="turmas" label="Turmas" />
                <OptionLink href="locais" label="Locais" />
                <OptionLink href="usuarios" label="Usuários" />
            </nav>

            <div className="flex items-center gap-4">
               
                {username && <p className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{username}</p>}

                <Button type="button" onClick={() => logout(router)}>Logout</Button>
            </div>
        </header>
    );
}