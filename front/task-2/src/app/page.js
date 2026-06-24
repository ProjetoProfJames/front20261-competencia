'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateSession } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    let active = true;
    validateSession().then(session => {
      if (!active) return;
      router.replace(session ? '/dashboard' : '/login');
    });
    return () => { active = false; };
  }, [router]);
  return null;
}
