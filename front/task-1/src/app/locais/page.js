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

export default function LocaisPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ numero: '' });
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
    try { setData(await api.get('/locais')); } catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function openCreate() { setForm({ numero: '' }); setErrors({}); setModal('create'); }
  function openEdit(row) { setForm({ numero: row.numero }); setErrors({}); setModal({ type: 'edit', id: row.id }); }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.numero.trim()) e.numero = 'Número/identificação é obrigatório';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/locais', form);
        showToast('Local criado!');
      } else {
        await api.put(`/locais/${modal.id}`, form);
        showToast('Local atualizado!');
      }
      setModal(null);
      load();
    } catch (err) { setErrors({ _: err.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete(row) {
    if (!confirm(`Excluir local "${row.numero}"?`)) return;
    try { await api.delete(`/locais/${row.id}`); showToast('Local excluído.'); load(); }
    catch (err) { alert(err.message); }
  }

  const canManage = canDo(user, 'manageLocais');

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'numero', label: 'Identificação do Local' },
    { key: 'createdBy', label: 'Criado por' },
  ];

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Locais</h1>
            <p className={styles.pageSub}>Locais de apresentação dos projetos</p>
          </div>
          {canManage && <Button onClick={openCreate}>+ Novo Local</Button>}
        </div>

        {loading ? <div className={styles.loading}><span className={styles.spinner} /></div> : (
          <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} canEdit={canManage} canDelete={canManage} />
        )}

        {modal && (
          <Modal title={modal === 'create' ? 'Novo Local' : 'Editar Local'} onClose={() => setModal(null)}>
            <div className={styles.formGrid}>
              <FormInput label="Identificação (número/nome)" name="numero" value={form.numero} onChange={handleChange} required error={errors.numero} placeholder="Ex: Estande 01, Sala A" />
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
