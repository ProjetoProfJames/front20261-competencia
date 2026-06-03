'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Menu from '@/components/Menu';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <div>
      <Menu />

      <h1>Dashboard</h1>

      <p>
        Sistema de Gestão de Projetos Integradores
      </p>
    </div>
  );
}