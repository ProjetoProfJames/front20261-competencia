'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { validateSession, CURSOS_DISPONIVEIS } from '@/lib/api';
import Menu from '@/components/Menu';
import styles from '../crud.module.css';

export default function CursosPage() {
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

  const meuCurso = user?.curso || null;

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Cursos</h1>
            <p className={styles.pageSub}>Cursos disponíveis na instituição</p>
          </div>
        </div>

        <div className={styles.cursoListGrid}>
          {CURSOS_DISPONIVEIS.map(curso => (
            <div
              key={curso}
              className={`${styles.cursoCard} ${meuCurso === curso ? styles.cursoCardMine : ''}`}
            >
              <span className={styles.cursoCardIcon}>🎓</span>
              <span className={styles.cursoCardName}>{curso}</span>
              {meuCurso === curso && <span className={styles.cursoCardBadge}>Meu curso</span>}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
