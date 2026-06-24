'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, saveSession, getSession, TIPO_CADASTRO, TIPO_CADASTRO_LABELS, TIPO_TO_PROFILE } from '@/lib/api';
import styles from '../login/login.module.css';

const CODIGO_COORDENADOR = 'UniSalesPIE';

const TIPO_ICONS = {
  ALUNO: '🎓',
  PROFESSOR: '👨‍🏫',
  COORDENADOR: '🏛️',
  VISITANTE: '👤',
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '', email: '', matricula: '', password: '', confirmPassword: '',
    tipoCadastro: '', codigoVerificacao: '',
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
    setGlobalError('');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'matricula') {
      setField(name, value.replace(/\D/g, '').slice(0, 10));
    } else {
      setField(name, value);
    }
  }

  function validate() {
    const e = {};
    if (!form.tipoCadastro) e.tipoCadastro = 'Selecione o tipo de usuário';
    if (!form.username.trim()) e.username = 'Nome é obrigatório';
    if (!form.email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'E-mail inválido';
    if (form.matricula && !/^\d{10}$/.test(form.matricula))
      e.matricula = 'Matrícula deve ter exatamente 10 dígitos';
    if (!form.password) e.password = 'Senha é obrigatória';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'As senhas não coincidem';
    if (form.tipoCadastro === 'COORDENADOR' && form.codigoVerificacao !== CODIGO_COORDENADOR)
      e.codigoVerificacao = 'Código de verificação incorreto';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const profile = TIPO_TO_PROFILE[form.tipoCadastro];
      const body = {
        username: form.username,
        email: form.email,
        password: form.password,
        profile,
      };
      if (form.matricula) body.matricula = form.matricula;

      const data = await api.post('/auth/register', body);

      // Salva sessão com tipo de cadastro já definido
      const userWithTipo = { ...data.user, tipoCadastro: form.tipoCadastro };
      saveSession(data.accessToken, userWithTipo);

      // Redireciona para completar o perfil específico
      router.push('/meu-cadastro');
    } catch (err) {
      setGlobalError(err.message || 'Não foi possível criar a conta. Verifique se o backend está rodando em http://localhost:8080');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Lado esquerdo - branding */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.logoMark}>⬡</div>
          <h1 className={styles.heading}>PIE Manager</h1>
          <p className={styles.sub}>Gestão de Projetos Integradores de Extensão</p>
        </div>
      </div>

      {/* Formulário */}
      <div className={styles.right}>
        <form className={styles.card} onSubmit={handleSubmit} noValidate>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Criar conta</h2>
            <p className={styles.cardSub}>Cadastre-se para acessar o sistema</p>
          </div>

          <div className={styles.fields}>

            {/* Tipo de usuário */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Você é...</label>
              <div className={styles.tipoGrid}>
                {TIPO_CADASTRO.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`${styles.tipoBtn} ${form.tipoCadastro === t ? styles.tipoBtnSelected : ''}`}
                    onClick={() => setField('tipoCadastro', t)}
                  >
                    <span className={styles.tipoIcon}>{TIPO_ICONS[t]}</span>
                    <span>{TIPO_CADASTRO_LABELS[t]}</span>
                  </button>
                ))}
              </div>
              {errors.tipoCadastro && <span className={styles.fieldError}>{errors.tipoCadastro}</span>}
            </div>

            {/* Código de coordenador — só aparece se selecionado */}
            {form.tipoCadastro === 'COORDENADOR' && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Código de verificação institucional</label>
                <input
                  type="password"
                  name="codigoVerificacao"
                  value={form.codigoVerificacao}
                  onChange={handleChange}
                  placeholder="Código fornecido pela instituição"
                  className={`${styles.input} ${errors.codigoVerificacao ? styles.inputError : ''}`}
                  autoComplete="off"
                />
                {errors.codigoVerificacao
                  ? <span className={styles.fieldError}>{errors.codigoVerificacao}</span>
                  : <span className={styles.fieldHint}>Informe o código para confirmar seu acesso como coordenador</span>
                }
              </div>
            )}

            {/* Nome */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nome completo</label>
              <input
                type="text" name="username" value={form.username}
                onChange={handleChange} placeholder="Seu nome completo"
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                autoComplete="name"
              />
              {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
            </div>

            {/* E-mail */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="seu@email.com"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                autoComplete="email"
              />
              {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
            </div>

            {/* Matrícula — só para alunos e professores */}
            {(form.tipoCadastro === 'ALUNO' || form.tipoCadastro === 'PROFESSOR') && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Matrícula <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(opcional — 10 dígitos)</span>
                </label>
                <input
                  type="text" name="matricula" value={form.matricula}
                  onChange={handleChange} placeholder="0000000000"
                  className={`${styles.input} ${errors.matricula ? styles.inputError : ''}`}
                  inputMode="numeric" maxLength={10}
                />
                {errors.matricula
                  ? <span className={styles.fieldError}>{errors.matricula}</span>
                  : <span className={styles.fieldHint}>{form.matricula.length}/10 dígitos</span>
                }
              </div>
            )}

            {/* Senha */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Senha</label>
              <input
                type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="••••••••"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                autoComplete="new-password"
              />
              {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
            </div>

            {/* Confirmar senha */}
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirmar senha</label>
              <input
                type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} placeholder="••••••••"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
            </div>

          </div>

          {globalError && <div className={styles.errorBox}>{globalError}</div>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : null}
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className={styles.switchLink}>
            Já tem uma conta? <Link href="/login">Entrar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
