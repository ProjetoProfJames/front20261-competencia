'use client';

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; 
import { logout, getUsername } from '@/utils/api';

import Button from "@/components/Button";

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
                <Link href="/menu" className="hover:underline font-medium">
                    Menu Principal
                </Link>
                <Link href="/semestres" className="hover:underline opacity-80 hover:opacity-100">
                    Semestres
                </Link>
                <Link href="/turmas" className="hover:underline opacity-80 hover:opacity-100">
                    Turmas
                </Link>
            </nav>

            <div className="flex items-center gap-4">
                {/* Exibe o nome do usuário se ele existir */}
                {username && <p className="text-sm font-medium bg-gray-700 px-3 py-1 rounded">{username}</p>}
                
                {/* O botão de logout chamando a sua api */}
                <Button type="button" onClick={() => logout(router)}>Logout</Button>
            </div>
        </header>
    );
}