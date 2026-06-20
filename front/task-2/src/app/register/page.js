'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, saveSession } from '@/lib/api';
import styles from '../login/login.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '', email: '', matricula: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'matricula') {
      // aceita só dígitos, máximo 10
      setForm(f => ({ ...f, matricula: value.replace(/\D/g, '').slice(0, 10) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(err => ({ ...err, [name]: '' }));
    setGlobalError('');
  }

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = 'Nome é obrigatório';
    if (!form.email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'E-mail inválido';
    if (form.matricula && !/^\d{10}$/.test(form.matricula))
      e.matricula = 'Matrícula deve ter exatamente 10 dígitos';
    if (!form.password) e.password = 'Senha é obrigatória';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'As senhas não coincidem';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const body = {
        username: form.username,
        email: form.email,
        password: form.password,
      };
      if (form.matricula) body.matricula = form.matricula;
      const data = await api.post('/auth/register', body);
      saveSession(data.accessToken, data.user);
      // Alunos novos são direcionados para declarar curso e período
      router.push('/meu-cadastro');
    } catch (err) {
      setGlobalError(err.message || 'Não foi possível criar a conta.');
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
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Criar conta</h2>
            <p className={styles.cardSub}>Cadastre-se para acessar o sistema</p>
          </div>

          <div className={styles.fields}>
            {/* Nome */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nome de usuário</label>
              <input type="text" name="username" value={form.username}
                onChange={handleChange} placeholder="Seu nome completo"
                className={`${styles.input}${errors.username ? ' ' + styles.inputError : ''}`}
                autoComplete="name" />
              {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
            </div>

            {/* E-mail */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>E-mail</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="seu@email.com"
                className={`${styles.input}${errors.email ? ' ' + styles.inputError : ''}`}
                autoComplete="email" />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            {/* Matrícula */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Matrícula <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(opcional — 10 dígitos)</span>
              </label>
              <input type="text" name="matricula" value={form.matricula}
                onChange={handleChange} placeholder="0000000000"
                className={`${styles.input}${errors.matricula ? ' ' + styles.inputError : ''}`}
                inputMode="numeric" maxLength={10} />
              {errors.matricula
                ? <span className={styles.fieldError}>{errors.matricula}</span>
                : <span className={styles.fieldHint}>{form.matricula.length}/10 dígitos</span>}
            </div>

            {/* Senha */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Senha</label>
              <input type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••"
                className={`${styles.input}${errors.password ? ' ' + styles.inputError : ''}`}
                autoComplete="new-password" />
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            {/* Confirmar senha */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirmar senha</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} placeholder="••••••••"
                className={`${styles.input}${errors.confirmPassword ? ' ' + styles.inputError : ''}`}
                autoComplete="new-password" />
              {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
            </div>
          </div>

          {globalError && <div className={styles.errorBox}>{globalError}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : null}
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text3)', textAlign: 'center' }}>
            Já tem uma conta?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
