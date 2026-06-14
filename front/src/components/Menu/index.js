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
    <nav style={{
      backgroundColor: 'rgb(221, 91, 49)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    }}>
      <span style={{ color: '#fff', fontWeight: '600', fontSize: '16px' }}>
        Bem-vindo, {user?.username}
      </span>

      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '24px',
        margin: 0,
        padding: 0,
      }}>
        <li>
          <Link href='/dashboard' style={{ color: '#fff', fontWeight: '500' }}>
            Dashboard
          </Link>
        </li>

        {(user?.profile === 'ADMIN' ||
          user?.profile === 'PROFESSOR') && (
          <li>
            <Link href='/users' style={{ color: '#fff', fontWeight: '500' }}>
              Usuários
            </Link>
          </li>
        )}

        {(user?.profile === 'ADMIN' ||
          user?.profile === 'COORDENADOR') && (
          <li>
            <Link href='/locais' style={{ color: '#fff', fontWeight: '500' }}>
              Locais
            </Link>
          </li>
        )}

        {(user?.profile === 'ADMIN' ||
          user?.profile === 'COORDENADOR') && (
          <li>
            <Link href='/cursos' style={{ color: '#fff', fontWeight: '500' }}>
              Cursos
            </Link>
          </li>
        )}

        {(user?.profile === 'ADMIN' ||
          user?.profile === 'COORDENADOR') && (
          <li>
            <Link href='/turmas' style={{ color: '#fff', fontWeight: '500' }}>
              Turmas
            </Link>
          </li>
        )}

        {(user?.profile === 'ADMIN' ||
          user?.profile === 'COORDENADOR') && (
          <li>
            <Link href='/semestre' style={{ color: '#fff', fontWeight: '500' }}>
              Período Letivo
            </Link>
          </li>
        )}
      </ul>

      <button
        onClick={logout}
        style={{
          backgroundColor: 'transparent',
          color: '#fff',
          border: '2px solid #fff',
          borderRadius: '6px',
          padding: '6px 16px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#fff';
          e.target.style.color = 'rgb(221, 91, 49)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#fff';
        }}
      >
        Logout
      </button>
    </nav>
  );
}