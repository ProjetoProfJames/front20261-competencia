"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './global.css';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [montado, setMontado] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMontado(true);
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      if (pathname !== '/login' && pathname !== '/cadastro') {
        router.push('/login');
      }
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isPublicRoute = pathname === '/login' || pathname === '/cadastro';

  return (
    <html lang="pt-BR">
      <body>
        {montado && user && !isPublicRoute ? (
          <div className="layout-wrapper">
            <header className="main-menu">
              <div className="user-info">
                <span>Usuário: {user.nome}</span>
                <button onClick={handleLogout}>Sair</button>
              </div>
              <nav>
                <ul className="nav-links">
                  <li><Link href="/">Início</Link></li>
                  <li><Link href="/usuarios">Usuários</Link></li>
                  <li><Link href="/locais">Locais</Link></li> {/* <-- Adicionado aqui! */}
                </ul>
              </nav>
            </header>
            <main className="main-content">{children}</main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}