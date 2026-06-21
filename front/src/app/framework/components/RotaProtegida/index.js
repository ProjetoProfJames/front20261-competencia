'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verificarToken, obterRole } from '@/utils/api/Auth';

export default function RotaProtegida({ children, roles }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tokenValido = verificarToken();

    if (!tokenValido) {
      router.push('/login');
      return;
    }

    if (roles && roles.length > 0) {
      const roleUsuario = obterRole();

      if (!roleUsuario || !roles.includes(roleUsuario)) {
        router.push('/nao-autorizado');
        return;
      }
    }

    setAutorizado(true);
    setCarregando(false);
  }, [router, roles]);

  if (carregando || !autorizado) {
    return null;
  }

  return children;
}
