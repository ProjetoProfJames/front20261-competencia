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

const empty = { nome: '', coordenadorId: '', professorIds: [] };

export default function CursosPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
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
    try {
      const [cursos, us] = await Promise.all([api.get('/cursos'), api.get('/users').catch(() => [])]);
      setData(cursos);
      setUsers(us);
    } catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function openCreate() { setForm(empty); setErrors({}); setModal('create'); }
  function openEdit(row) {
    setForm({
      nome: row.nome,
      coordenadorId: row.coordenador?.id?.toString() || '',
      professorIds: (row.professores || []).map(p => p.id),
    });
    setErrors({});
    setModal({ type: 'edit', id: row.id });
  }

  function handleChange(e) {
    const { name, value, options, multiple } = e.target;
    if (multiple) {
      const selected = Array.from(options).filter(o => o.selected).map(o => Number(o.value));
      setForm(f => ({ ...f, [name]: selected }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setErrors(err => ({ ...err, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório';
    if (!form.coordenadorId) e.coordenadorId = 'Coordenador é obrigatório';
    if (!form.professorIds.length) e.professorIds = 'Selecione ao menos um professor';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const body = { nome: form.nome, coordenadorId: Number(form.coordenadorId), professorIds: form.professorIds };
      if (modal === 'create') { await api.post('/cursos', body); showToast('Curso criado!'); }
      else { await api.put(`/cursos/${modal.id}`, body); showToast('Curso atualizado!'); }
      setModal(null);
      load();
    } catch (err) { setErrors({ _: err.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete(row) {
    if (!confirm(`Excluir curso "${row.nome}"?`)) return;
    try { await api.delete(`/cursos/${row.id}`); showToast('Curso excluído.'); load(); }
    catch (err) { alert(err.message); }
  }

  const canManage = canDo(user, 'manageCursos');

  const coordOpts = users.filter(u => u.profile === 'COORDENADOR').map(u => ({ value: u.id, label: u.username }));
  const profOpts = users.filter(u => u.profile === 'PROFESSOR').map(u => ({ value: u.id, label: u.username }));

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'coordenador', label: 'Coordenador', render: v => v?.username || '—' },
    { key: 'professores', label: 'Professores', render: v => (
      <div className={styles.tagList}>
        {(v || []).map(p => <span key={p.id} className={styles.tag}>{p.username}</span>)}
      </div>
    )},
  ];

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Cursos</h1>
            <p className={styles.pageSub}>Cursos vinculados ao sistema</p>
          </div>
          {canManage && <Button onClick={openCreate}>+ Novo Curso</Button>}
        </div>

        {loading ? <div className={styles.loading}><span className={styles.spinner} /></div> : (
          <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} canEdit={canManage} canDelete={canManage} />
        )}

        {modal && (
          <Modal title={modal === 'create' ? 'Novo Curso' : 'Editar Curso'} onClose={() => setModal(null)}>
            <div className={styles.formGrid}>
              <FormInput label="Nome do Curso" name="nome" value={form.nome} onChange={handleChange} required error={errors.nome} />
              <FormInput label="Coordenador" type="select" name="coordenadorId" value={form.coordenadorId} onChange={handleChange} required options={coordOpts} error={errors.coordenadorId} />
              <div>
                <FormInput label="Professores" type="select" name="professorIds" value={form.professorIds.map(String)} onChange={handleChange} options={profOpts} multiple error={errors.professorIds} />
                <p className={styles.multiSelectHint}>Segure Ctrl/Cmd para selecionar múltiplos</p>
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
