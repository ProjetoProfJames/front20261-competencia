'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { clearSession, canDo } from '@/lib/api';
import styles from './Menu.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞', always: true },
  { href: '/usuarios',  label: 'Usuários',  icon: '👤', action: 'viewUsers' },
  { href: '/locais',    label: 'Locais',    icon: '📍', always: true },
  { href: '/cursos',    label: 'Cursos',    icon: '🎓', always: true },
  { href: '/semestres', label: 'Semestres', icon: '📅', always: true },
  { href: '/turmas',    label: 'Turmas',    icon: '🏫', always: true },
];

export default function Menu({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  const visible = navItems.filter(item => item.always || canDo(user, item.action));

  // Informações de curso/período salvas na sessão
  const cursoInfo = user?.curso
    ? `${user.curso}${user.periodo ? ` · ${user.periodo}º período` : ''}`
    : null;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⬡</span>
          {!collapsed && <span className={styles.brandText}>PIE Manager</span>}
        </div>
        <button className={styles.toggle} onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expandir' : 'Recolher'}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className={styles.nav}>
        {visible.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
          </a>
        ))}
      </nav>

      <div className={styles.bottom}>
        {!collapsed && (
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.username}</div>
            <div className={styles.userProfile}>{user?.profile}</div>
            {cursoInfo && (
              <div className={styles.userCurso} title={cursoInfo}>{cursoInfo}</div>
            )}
          </div>
        )}

        {/* Botão Meu cadastro */}
        <a
          href="/meu-cadastro"
          className={`${styles.cadastroBtn} ${pathname === '/meu-cadastro' ? styles.active : ''}`}
          title="Meu cadastro"
        >
          <span className={styles.navIcon}>✏️</span>
          {!collapsed && <span>Meu cadastro</span>}
        </a>

        <button className={styles.logoutBtn} onClick={handleLogout} title="Sair">
          <span>⏻</span>
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
