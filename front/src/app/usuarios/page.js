'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, validateSession, canDo, PROFILES, PROFILE_LABELS } from '@/lib/api';
import Menu from '@/components/Menu';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import styles from '../crud.module.css';

const empty = { username: '', email: '', password: '', profile: '' };

export default function UsuariosPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;
    validateSession().then(session => {
      if (!active) return;
      if (!session) { router.replace('/login'); return; }
      setUser(session.user);
    });
    return () => { active = false; };
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    try { setData(await api.get('/users')); } catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function openCreate() { setForm(empty); setErrors({}); setModal('create'); }
  function openEdit(row) {
    setForm({ username: row.username, email: row.email, password: '', profile: row.profile });
    setErrors({});
    setModal({ type: 'edit', id: row.id });
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = 'Nome é obrigatório';
    if (modal === 'create') {
      if (!form.email.trim()) e.email = 'E-mail é obrigatório';
      if (!form.password || form.password.length < 6) e.password = 'Senha mínima 6 caracteres';
    }
    if (!form.profile) e.profile = 'Perfil é obrigatório';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/users', form);
        showToast('Usuário criado com sucesso!');
      } else {
        const body = { username: form.username, profile: form.profile };
        if (form.password) body.password = form.password;
        await api.put(`/users/${modal.id}`, body);
        showToast('Usuário atualizado!');
      }
      setModal(null);
      load();
    } catch (err) { setErrors({ _: err.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete(row) {
    if (!confirm(`Excluir "${row.username}"?`)) return;
    try { await api.delete(`/users/${row.id}`); showToast('Usuário excluído.'); load(); }
    catch (err) { alert(err.message); }
  }

  const profileOpts = PROFILES.map(p => ({ value: p, label: PROFILE_LABELS[p] }));

  const columns = [
    { key: 'username', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'profile', label: 'Perfil', render: v => PROFILE_LABELS[v] || v },
  ];

  const isAdmin = canDo(user, 'manageUsers');

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Usuários</h1>
            <p className={styles.pageSub}>Gerenciamento de contas do sistema</p>
          </div>
          {isAdmin && <Button onClick={openCreate}>+ Novo Usuário</Button>}
        </div>

        {loading ? <div className={styles.loading}><span className={styles.spinner} /></div> : (
          <Table
            columns={columns}
            data={data}
            onEdit={openEdit}
            onDelete={handleDelete}
            canEdit={isAdmin}
            canDelete={isAdmin}
          />
        )}

        {modal && (
          <Modal title={modal === 'create' ? 'Novo Usuário' : 'Editar Usuário'} onClose={() => setModal(null)}>
            <div className={styles.formGrid}>
              <FormInput label="Nome" name="username" value={form.username} onChange={handleChange} required error={errors.username} />
              {modal === 'create' && (
                <FormInput label="E-mail" type="email" name="email" value={form.email} onChange={handleChange} required error={errors.email} />
              )}
              <FormInput label={modal === 'create' ? 'Senha' : 'Nova Senha (opcional)'} type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} />
              <FormInput label="Perfil" type="select" name="profile" value={form.profile} onChange={handleChange} required options={profileOpts} error={errors.profile} />
            </div>
            {errors._ && <div className={styles.formError}>{errors._}</div>}
            <div className={styles.formActions}>
              <Button variant="secondary" onClick={() => setModal(null)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </Modal>
        )}

        {toast && <div className={styles.toast}>{toast}</div>}
      </main>
    </div>
  );
}
