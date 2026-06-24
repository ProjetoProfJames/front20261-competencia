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

const empty = { nome: '', cursoIds: [], disciplinaId: '', semestreId: '', professorIds: [] };

export default function TurmasPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [professores, setProfessores] = useState([]);
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
      const [turmas, cs, discs, sems, us] = await Promise.all([
        api.get('/turmas'),
        api.get('/cursos').catch(() => []),
        api.get('/disciplinas').catch(() => []),
        api.get('/semestres').catch(() => []),
        api.get('/users').catch(() => []),
      ]);
      setData(turmas);
      setCursos(cs);
      setDisciplinas(discs);
      setSemestres(sems);
      setProfessores(us.filter(u => u.profile === 'PROFESSOR'));
    } catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function openCreate() { setForm(empty); setErrors({}); setModal('create'); }
  function openEdit(row) {
    setForm({
      nome: row.nome,
      cursoIds: (row.cursos || []).map(c => c.id),
      disciplinaId: row.disciplina?.id?.toString() || '',
      semestreId: row.semestre?.id?.toString() || '',
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
    if (!form.cursoIds.length) e.cursoIds = 'Selecione ao menos um curso';
    if (!form.disciplinaId) e.disciplinaId = 'Disciplina é obrigatória';
    if (!form.semestreId) e.semestreId = 'Semestre é obrigatório';
    if (!form.professorIds.length) e.professorIds = 'Selecione ao menos um professor';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const body = {
        nome: form.nome,
        cursoIds: form.cursoIds,
        disciplinaId: Number(form.disciplinaId),
        semestreId: Number(form.semestreId),
        professorIds: form.professorIds,
      };
      if (modal === 'create') { await api.post('/turmas', body); showToast('Turma criada!'); }
      else { await api.put(`/turmas/${modal.id}`, body); showToast('Turma atualizada!'); }
      setModal(null);
      load();
    } catch (err) { setErrors({ _: err.message }); }
    finally { setSaving(false); }
  }

  async function handleDelete(row) {
    if (!confirm(`Excluir turma "${row.nome}"?`)) return;
    try { await api.delete(`/turmas/${row.id}`); showToast('Turma excluída.'); load(); }
    catch (err) { alert(err.message); }
  }

  const canManage = canDo(user, 'manageTurmas');

  const cursoOpts = cursos.map(c => ({ value: c.id, label: c.nome }));
  const discOpts = disciplinas.map(d => ({ value: d.id, label: d.nome }));
  const semOpts = semestres.map(s => ({ value: s.id, label: s.nome }));
  const profOpts = professores.map(p => ({ value: p.id, label: p.username }));

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'semestre', label: 'Semestre', render: v => v?.nome || '—' },
    { key: 'disciplina', label: 'Disciplina', render: v => v?.nome || '—' },
    { key: 'cursos', label: 'Cursos', render: v => (
      <div className={styles.tagList}>
        {(v || []).map(c => <span key={c.id} className={styles.tag}>{c.nome}</span>)}
      </div>
    )},
    { key: 'alunos', label: 'Alunos', render: v => <span className={styles.badge}>{(v || []).length}</span> },
  ];

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Turmas</h1>
            <p className={styles.pageSub}>Turmas e grupos de alunos</p>
          </div>
          {canManage && <Button onClick={openCreate}>+ Nova Turma</Button>}
        </div>

        {loading ? <div className={styles.loading}><span className={styles.spinner} /></div> : (
          <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} canEdit={canManage} canDelete={canManage} />
        )}

        {modal && (
          <Modal title={modal === 'create' ? 'Nova Turma' : 'Editar Turma'} onClose={() => setModal(null)}>
            <div className={styles.formGrid}>
              <FormInput label="Nome da Turma" name="nome" value={form.nome} onChange={handleChange} required error={errors.nome} />
              <div>
                <FormInput label="Cursos" type="select" name="cursoIds" value={form.cursoIds.map(String)} onChange={handleChange} options={cursoOpts} multiple error={errors.cursoIds} />
                <p className={styles.multiSelectHint}>Segure Ctrl/Cmd para selecionar múltiplos</p>
              </div>
              <FormInput label="Disciplina" type="select" name="disciplinaId" value={form.disciplinaId} onChange={handleChange} required options={discOpts} error={errors.disciplinaId} />
              <FormInput label="Semestre" type="select" name="semestreId" value={form.semestreId} onChange={handleChange} required options={semOpts} error={errors.semestreId} />
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
