'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, validateSession, getSession, saveSession } from '@/lib/api';
import Menu from '@/components/Menu';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import styles from '../crud.module.css';

export default function MeuPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [form, setForm] = useState({ cursoId: '', semestreId: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    validateSession().then(session => {
      if (!active) return;
      if (!session) { router.replace('/login'); return; }
      setUser(session.user);
      // pré-preencher se já tiver dados salvos
      if (session.user.cursoId) setForm(f => ({ ...f, cursoId: String(session.user.cursoId) }));
      if (session.user.semestreId) setForm(f => ({ ...f, semestreId: String(session.user.semestreId) }));
    });
    return () => { active = false; };
  }, [router]);

  const loadOptions = useCallback(async () => {
    try {
      const [c, s] = await Promise.all([api.get('/cursos'), api.get('/semestres')]);
      setCursos(c);
      setSemestres(s);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) loadOptions(); }, [user, loadOptions]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.cursoId) e.cursoId = 'Selecione seu curso';
    if (!form.semestreId) e.semestreId = 'Selecione o período letivo atual';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      // Atualiza o perfil do usuário com curso e semestre via endpoint de update
      const updated = await api.put(`/users/${user.id}`, {
        cursoId: Number(form.cursoId),
        semestreId: Number(form.semestreId),
      });
      // Atualiza a sessão local com os novos dados
      const session = getSession();
      saveSession(session.token, { ...session.user, ...updated });
      setUser(u => ({ ...u, ...updated }));
      setToast('Perfil atualizado com sucesso!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setErrors({ _: err.message || 'Não foi possível salvar.' });
    } finally {
      setSaving(false);
    }
  }

  const cursoOpts = cursos.map(c => ({ value: c.id, label: c.nome }));
  const semestreOpts = semestres.map(s => ({ value: s.id, label: s.nome }));

  const isAluno = user?.profile === 'ALUNO';

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Meu Perfil</h1>
            <p className={styles.pageSub}>
              {isAluno
                ? 'Declare seu curso e o período letivo em que você está atualmente'
                : 'Informações da sua conta'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}><span className={styles.spinner} /></div>
        ) : (
          <div style={{ maxWidth: 480 }}>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Nome</span>
                <span className={styles.infoValue}>{user?.username}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>E-mail</span>
                <span className={styles.infoValue}>{user?.email}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Matrícula</span>
                <span className={styles.infoValue}>{user?.matricula || '—'}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Perfil</span>
                <span className={styles.badge}>{user?.profile}</span>
              </div>
            </div>

            {isAluno && (
              <div style={{ marginTop: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
                  Vínculo acadêmico
                </h2>
                <div className={styles.formGrid}>
                  <FormInput
                    label="Meu Curso"
                    type="select"
                    name="cursoId"
                    value={form.cursoId}
                    onChange={handleChange}
                    required
                    options={cursoOpts}
                    error={errors.cursoId}
                  />
                  <FormInput
                    label="Período Letivo Atual"
                    type="select"
                    name="semestreId"
                    value={form.semestreId}
                    onChange={handleChange}
                    required
                    options={semestreOpts}
                    error={errors.semestreId}
                  />
                </div>
                {errors._ && <div className={styles.formError}>{errors._}</div>}
                <div style={{ marginTop: 8 }}>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar vínculo'}
                  </Button>
                </div>
              </div>
            )}

            {toast && <div className={styles.toast}>{toast}</div>}
          </div>
        )}
      </main>
    </div>
  );
}
