'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, saveSession } from '@/lib/api';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post('/auth/login', form);
      saveSession(data.accessToken, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.logoMark}>⬡</div>
          <h1 className={styles.heading}>PIE Manager</h1>
          <p className={styles.sub}>Gestão de Projetos Integradores de Extensão</p>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.card} onSubmit={handleSubmit}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Entrar</h2>
            <p className={styles.cardSub}>Acesse com suas credenciais</p>
          </div>

          <div className={styles.fields}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className={styles.input}
                autoComplete="email"
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Senha</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={styles.input}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : null}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className={styles.switchLink}>
            Não tem uma conta?{''}
            <Link href="/register">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
