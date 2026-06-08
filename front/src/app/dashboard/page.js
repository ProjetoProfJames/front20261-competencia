'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Menu from '@/components/Menu';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, []);

  return (
    <div className='page-wrapper'>
      <Menu />
      <div className='page-content'>
        <h1>Dashboard</h1>
        <p style={{ marginTop: '8px', color: '#666' }}>
          Sistema de Gestão de Projetos Integradores
        </p>
      </div>
    </div>
  );
}