'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, validateSession, canDo } from '@/lib/api';
import Menu from '@/components/Menu';
import Table from '@/components/Table';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import styles from '../crud.module.css';

const empty = { nome: '', dataInicio: '', dataFim: '' };

export default function SemestresPage() {
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
    try { setData(await api.get('/semestres')); } catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function openCreate() { setForm(empty); setErrors({}); setModal('create'); }
  function openEdit(row) {
    setForm({ nome: row.nome, dataInicio: row.dataInicio || '', dataFim: row.dataFim || '' });
    setErrors({});
    setModal({ type: 'edit', id: row.id });
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    if (!form.dataInicio) e.dataInicio = 'Data de início é obrigatória';
    if (!form.dataFim) e.dataFim = 'Data de fim é obrigatória';
    if (form.dataInicio && form.dataFim && form.dataFim <= form.dataInicio) e.dataFim = 'Data fim deve ser após início';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (modal === 'create') { await api.post('/semestres', form); showToast('Semestre criado!'); }
      else { await api.put(`/semestres/${modal.id}`, form); showToast('Semestre atualizado!'); }
      setModal(null);
      load();
    } catch (err) { setErrors({ _: err.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete(row) {
    if (!confirm(`Excluir semestre "${row.nome}"?`)) return;
    try { await api.delete(`/semestres/${row.id}`); showToast('Semestre excluído.'); load(); }
    catch (err) { alert(err.message); }
  }

  const canManage = canDo(user, 'manageSemestres');

  function fmtDate(v) {
    if (!v) return '—';
    const [y, m, d] = v.split('-');
    return `${d}/${m}/${y}`;
  }

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'dataInicio', label: 'Início', render: fmtDate },
    { key: 'dataFim', label: 'Fim', render: fmtDate },
  ];

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Períodos Letivos</h1>
            <p className={styles.pageSub}>Semestres e períodos acadêmicos</p>
          </div>
          {canManage && <Button onClick={openCreate}>+ Novo Semestre</Button>}
        </div>

        {loading ? <div className={styles.loading}><span className={styles.spinner} /></div> : (
          <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} canEdit={canManage} canDelete={canManage} />
        )}

        {modal && (
          <Modal title={modal === 'create' ? 'Novo Semestre' : 'Editar Semestre'} onClose={() => setModal(null)}>
            <div className={styles.formGrid}>
              <FormInput label="Nome" name="nome" value={form.nome} onChange={handleChange} required error={errors.nome} placeholder="Ex: 2025.1" />
              <div className={styles.formRow}>
                <FormInput label="Data de Início" type="date" name="dataInicio" value={form.dataInicio} onChange={handleChange} required error={errors.dataInicio} />
                <FormInput label="Data de Fim" type="date" name="dataFim" value={form.dataFim} onChange={handleChange} required error={errors.dataFim} />
              </div>
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
