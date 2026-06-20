'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, validateSession, getSession, saveSession } from '@/lib/api';
import Menu from '@/components/Menu';
import styles from './meu-cadastro.module.css';

const CURSOS = [
  'Biomedicina','Ciências Biológicas','Enfermagem','Farmácia','Fisioterapia',
  'Nutrição','Psicologia','Arquitetura e Urbanismo','Engenharia Civil',
  'Engenharia de Software','Engenharia de Produção','Sistemas de Informação',
  'Administração','Ciências Contábeis','Direito','Educação Física','Filosofia',
  'Serviço Social',
];
const PERIODOS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function MeuCadastroPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isFirstAccess, setIsFirstAccess] = useState(false);

  // Formulário de vínculo acadêmico
  const [vinculo, setVinculo] = useState({ curso: '', periodo: '' });
  const [vinculoErrors, setVinculoErrors] = useState({});
  const [vinculoSaving, setVinculoSaving] = useState(false);
  const [vinculoToast, setVinculoToast] = useState('');

  // Formulário de dados da conta
  const [conta, setConta] = useState({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [contaErrors, setContaErrors] = useState({});
  const [contaSaving, setContaSaving] = useState(false);
  const [contaToast, setContaToast] = useState('');

  useEffect(() => {
    let active = true;
    validateSession().then(session => {
      if (!active) return;
      if (!session) { router.replace('/login'); return; }
      setUser(session.user);
      // Pré-preenche com o que já estava salvo
      setVinculo({
        curso: session.user.curso || '',
        periodo: session.user.periodo ? String(session.user.periodo) : '',
      });
      setConta(c => ({ ...c, email: session.user.email || '' }));
      // Detecta primeiro acesso: veio do register sem curso declarado
      setIsFirstAccess(!session.user.curso);
    });
    return () => { active = false; };
  }, [router]);

  // ── Vínculo acadêmico ────────────────────────────────
  function selectCurso(curso) {
    setVinculo(v => ({ ...v, curso }));
    setVinculoErrors(e => ({ ...e, curso: '' }));
  }
  function selectPeriodo(periodo) {
    setVinculo(v => ({ ...v, periodo: String(periodo) }));
    setVinculoErrors(e => ({ ...e, periodo: '' }));
  }

  function validateVinculo() {
    const e = {};
    if (!vinculo.curso) e.curso = 'Selecione seu curso';
    if (!vinculo.periodo) e.periodo = 'Selecione seu período';
    return e;
  }

  async function handleSaveVinculo() {
    const e = validateVinculo();
    if (Object.keys(e).length) { setVinculoErrors(e); return; }
    setVinculoSaving(true);
    try {
      const session = getSession();
      const updated = { ...session.user, curso: vinculo.curso, periodo: Number(vinculo.periodo) };
      saveSession(session.token, updated);
      setUser(updated);
      setVinculoToast('Vínculo salvo!');
      setTimeout(() => setVinculoToast(''), 2500);
      if (isFirstAccess) {
        setTimeout(() => router.push('/dashboard'), 1200);
      }
    } finally {
      setVinculoSaving(false);
    }
  }

  // ── Dados da conta ───────────────────────────────────
  function handleContaChange(e) {
    setConta(c => ({ ...c, [e.target.name]: e.target.value }));
    setContaErrors(err => ({ ...err, [e.target.name]: '' }));
  }

  function validateConta() {
    const e = {};
    if (!conta.email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/^\S+@\S+\.\S+$/.test(conta.email)) e.email = 'E-mail inválido';
    if (conta.newPassword || conta.confirmPassword) {
      if (!conta.currentPassword) e.currentPassword = 'Informe a senha atual para alterá-la';
      if (conta.newPassword.length < 6) e.newPassword = 'Mínimo 6 caracteres';
      if (conta.newPassword !== conta.confirmPassword) e.confirmPassword = 'As senhas não coincidem';
    }
    return e;
  }

  async function handleSaveConta() {
    const e = validateConta();
    if (Object.keys(e).length) { setContaErrors(e); return; }
    setContaSaving(true);
    try {
      const body = { email: conta.email };
      if (conta.newPassword) {
        body.currentPassword = conta.currentPassword;
        body.password = conta.newPassword;
      }
      const updated = await api.put(`/users/${user.id}`, body);
      const session = getSession();
      const merged = { ...session.user, ...updated, curso: session.user.curso, periodo: session.user.periodo };
      saveSession(session.token, merged);
      setUser(merged);
      setConta(c => ({ ...c, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setContaToast('Dados atualizados!');
      setTimeout(() => setContaToast(''), 2500);
    } catch (err) {
      setContaErrors({ _: err.message || 'Não foi possível salvar.' });
    } finally {
      setContaSaving(false);
    }
  }

  if (!user) return null;

  // ── Render ───────────────────────────────────────────
  const pageContent = (
    <div className={isFirstAccess ? styles.firstAccessWrap : styles.editWrap}>
      {/* Cabeçalho no primeiro acesso */}
      {isFirstAccess && (
        <div className={styles.header}>
          <div className={styles.logoMark}>⬡</div>
          <h1 className={styles.title}>Quase lá!</h1>
          <p className={styles.sub}>
            Olá, {user.username}. Precisamos de mais uma informação antes de começar.
          </p>
        </div>
      )}

      {/* Seção: Vínculo Acadêmico */}
      <section className={styles.section}>
        {!isFirstAccess && <h2 className={styles.sectionTitle}>Vínculo Acadêmico</h2>}

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            {isFirstAccess ? 'Em qual curso você está matriculado?' : 'Meu Curso'}
          </label>
          <div className={styles.cursoGrid}>
            {CURSOS.map(curso => (
              <button
                key={curso}
                type="button"
                className={`${styles.cursoBtn} ${vinculo.curso === curso ? styles.cursoBtnSelected : ''}`}
                onClick={() => selectCurso(curso)}
              >
                {curso}
              </button>
            ))}
          </div>
          {vinculoErrors.curso && <span className={styles.fieldError}>{vinculoErrors.curso}</span>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            {isFirstAccess ? 'Qual é o seu período atual?' : 'Período Atual'}
          </label>
          <div className={styles.periodoGrid}>
            {PERIODOS.map(p => (
              <button
                key={p}
                type="button"
                className={`${styles.periodoBtn} ${vinculo.periodo === String(p) ? styles.periodoBtnSelected : ''}`}
                onClick={() => selectPeriodo(p)}
              >
                {p}º
              </button>
            ))}
          </div>
          {vinculoErrors.periodo && <span className={styles.fieldError}>{vinculoErrors.periodo}</span>}
        </div>

        <div className={styles.sectionActions}>
          {isFirstAccess && (
            <button className={styles.skipBtn} type="button" onClick={() => router.push('/dashboard')}>
              Pular por agora
            </button>
          )}
          <button className={styles.saveBtn} type="button" onClick={handleSaveVinculo} disabled={vinculoSaving}>
            {vinculoSaving ? 'Salvando...' : isFirstAccess ? 'Salvar e continuar →' : 'Salvar vínculo'}
          </button>
        </div>
        {vinculoToast && <div className={styles.toast}>{vinculoToast}</div>}
      </section>

      {/* Seção: Dados da Conta — só aparece fora do primeiro acesso */}
      {!isFirstAccess && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Dados da Conta</h2>

          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>E-mail</label>
              <input
                type="email"
                name="email"
                value={conta.email}
                onChange={handleContaChange}
                className={`${styles.input} ${contaErrors.email ? styles.inputError : ''}`}
                placeholder="seu@email.com"
              />
              {contaErrors.email && <span className={styles.fieldError}>{contaErrors.email}</span>}
            </div>

            <p className={styles.passwordHint}>
              Deixe os campos abaixo em branco para não alterar a senha.
            </p>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Senha atual</label>
              <input
                type="password"
                name="currentPassword"
                value={conta.currentPassword}
                onChange={handleContaChange}
                className={`${styles.input} ${contaErrors.currentPassword ? styles.inputError : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {contaErrors.currentPassword && <span className={styles.fieldError}>{contaErrors.currentPassword}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nova senha</label>
              <input
                type="password"
                name="newPassword"
                value={conta.newPassword}
                onChange={handleContaChange}
                className={`${styles.input} ${contaErrors.newPassword ? styles.inputError : ''}`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {contaErrors.newPassword && <span className={styles.fieldError}>{contaErrors.newPassword}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirmar nova senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={conta.confirmPassword}
                onChange={handleContaChange}
                className={`${styles.input} ${contaErrors.confirmPassword ? styles.inputError : ''}`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {contaErrors.confirmPassword && <span className={styles.fieldError}>{contaErrors.confirmPassword}</span>}
            </div>
          </div>

          {contaErrors._ && <div className={styles.errorBox}>{contaErrors._}</div>}

          <div className={styles.sectionActions}>
            <button className={styles.saveBtn} type="button" onClick={handleSaveConta} disabled={contaSaving}>
              {contaSaving ? 'Salvando...' : 'Salvar dados'}
            </button>
          </div>
          {contaToast && <div className={styles.toast}>{contaToast}</div>}
        </section>
      )}
    </div>
  );

  // Primeiro acesso: tela cheia sem menu
  if (isFirstAccess) {
    return <div className={styles.fullPage}>{pageContent}</div>;
  }

  // Acesso normal: dentro do layout com menu
  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Meu Cadastro</h1>
          <p className={styles.pageSub}>Gerencie seu vínculo acadêmico e dados da conta</p>
        </div>
        {pageContent}
      </main>
    </div>
  );
}
