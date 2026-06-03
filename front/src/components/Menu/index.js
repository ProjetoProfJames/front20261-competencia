'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Menu() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    router.push('/login');
  };

  return (
    <nav>
      <h2>
        Bem-vindo {user?.username}
      </h2>

      <ul>
        <li>
          <Link href='/dashboard'>
            Dashboard
          </Link>
        </li>

        {user?.profile === 'ADMIN' && (
          <li>
            <Link href='/users'>
              Usuários
            </Link>
          </li>
        )}

        {(user?.profile === 'ADMIN' ||
          user?.profile === 'COORDENADOR') && (
          <li>
            <Link href='/locais'>
              Locais
            </Link>
          </li>
        )}
      </ul>

      <button onClick={logout}>
        Logout
      </button>
    </nav>
  );
}