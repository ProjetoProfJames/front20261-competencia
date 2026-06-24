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

const empty = { nome: '', cursoId: '', semestreId: '', professorId: '', disciplinaId: '' };

export default function TurmasPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
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
      const [turmas, cs, ss, users, discs] = await Promise.all([
        api.get('/turmas'),
        api.get('/cursos'),
        api.get('/semestres'),
        api.get('/users').catch(() => []),
        api.get('/disciplinas').catch(() => []),
      ]);
      setData(turmas);
      setCursos(cs);
      setSemestres(ss);
      setProfessores(users.filter(u => u.profile === 'PROFESSOR'));
      setDisciplinas(discs);
    } catch { setData([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function openCreate() { setForm(empty); setErrors({}); setModal('create'); }
  function openEdit(row) {
    setForm({
      nome: row.nome || '',
      cursoId: row.curso?.id?.toString() || '',
      semestreId: row.semestre?.id?.toString() || '',
      professorId: row.professor?.id?.toString() || '',
      disciplinaId: row.disciplina?.id?.toString() || '',
    });
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
    if (!form.cursoId) e.cursoId = 'Selecione o curso';
    if (!form.semestreId) e.semestreId = 'Selecione o período letivo';
    if (!form.professorId) e.professorId = 'Selecione o professor';
    return e;
  }

  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const body = {
        nome: form.nome,
        cursoId: Number(form.cursoId),
        semestreId: Number(form.semestreId),
        professorId: Number(form.professorId),
      };
      if (form.disciplinaId) body.disciplinaId = Number(form.disciplinaId);

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

  const columns = [
    { key: 'nome', label: 'Turma' },
    { key: 'curso', label: 'Curso', render: v => v?.nome || '—' },
    { key: 'semestre', label: 'Período Letivo', render: v => v?.nome || '—' },
    { key: 'professor', label: 'Professor', render: v => v?.username || '—' },
    { key: 'disciplina', label: 'Disciplina', render: v => v?.nome || '—' },
  ];

  const cursoOpts = cursos.map(c => ({ value: c.id, label: c.nome }));
  const semestreOpts = semestres.map(s => ({ value: s.id, label: s.nome }));
  const profOpts = professores.map(p => ({ value: p.id, label: p.username }));
  const discOpts = disciplinas.map(d => ({ value: d.id, label: d.nome }));

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Turmas</h1>
            <p className={styles.pageSub}>Turmas vinculadas a cursos e períodos letivos</p>
          </div>
          {canManage && <Button onClick={openCreate}>+ Nova Turma</Button>}
        </div>

        {loading ? <div className={styles.loading}><span className={styles.spinner} /></div> : (
          <Table columns={columns} data={data} onEdit={openEdit} onDelete={handleDelete} canEdit={canManage} canDelete={canManage} />
        )}

        {modal && (
          <Modal title={modal === 'create' ? 'Nova Turma' : 'Editar Turma'} onClose={() => setModal(null)}>
            <div className={styles.formGrid}>
              <FormInput label="Nome da Turma" name="nome" value={form.nome} onChange={handleChange} required error={errors.nome} placeholder="Ex: ADS-2025-1A" />
              <FormInput label="Curso" type="select" name="cursoId" value={form.cursoId} onChange={handleChange} required options={cursoOpts} error={errors.cursoId} />
              <FormInput label="Período Letivo" type="select" name="semestreId" value={form.semestreId} onChange={handleChange} required options={semestreOpts} error={errors.semestreId} />
              <FormInput label="Professor Responsável" type="select" name="professorId" value={form.professorId} onChange={handleChange} required options={profOpts} error={errors.professorId} />
              {discOpts.length > 0 && (
                <FormInput label="Disciplina (opcional)" type="select" name="disciplinaId" value={form.disciplinaId} onChange={handleChange} options={discOpts} error={errors.disciplinaId} />
              )}
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
