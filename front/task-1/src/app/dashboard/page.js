'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateSession, canDo } from '@/lib/api';
import Menu from '@/components/Menu';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    validateSession().then(session => {
      if (!active) return;
      if (!session) { router.replace('/login'); return; }
      setUser(session.user);
    });
    return () => { active = false; };
  }, [router]);

  if (!user) return null;

  const cards = [
    { label: 'Usuários', icon: '👤', href: '/usuarios', show: canDo(user, 'viewUsers') },
    { label: 'Locais', icon: '📍', href: '/locais', show: true },
    { label: 'Cursos', icon: '🎓', href: '/cursos', show: true },
    { label: 'Semestres', icon: '📅', href: '/semestres', show: true },
    { label: 'Turmas', icon: '🏫', href: '/turmas', show: true },
  ].filter(c => c.show);

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bem-vindo, <span>{user.username}</span></h1>
          <p className={styles.sub}>Selecione um módulo para começar</p>
        </div>
        <div className={styles.grid}>
          {cards.map(card => (
            <a key={card.href} href={card.href} className={styles.card}>
              <span className={styles.cardIcon}>{card.icon}</span>
              <span className={styles.cardLabel}>{card.label}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
