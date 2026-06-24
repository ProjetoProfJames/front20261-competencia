'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, validateSession, canDo } from '@/lib/api';
import Menu from '@/components/Menu';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import FormInput from '@/components/FormInput';
import styles from '../crud.module.css';

const HORARIOS = ['19:00 – 20:00','20:00 – 21:00','21:00 – 22:00'];

export default function LocaisPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [locais, setLocais] = useState([]);
  // ocupacao: array de { local, mesa, horario } — fonte de verdade no backend
  const [ocupacao, setOcupacao] = useState([]);
  const [loading, setLoading] = useState(true);
  const [horarioFiltro, setHorarioFiltro] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nome: '', totalMesas: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const loadOcupacao = useCallback(async () => {
    try {
      const data = await api.get('/users/ocupacao');
      setOcupacao(Array.isArray(data) ? data : []);
    } catch { setOcupacao([]); }
  }, []);

  useEffect(() => {
    let active = true;
    validateSession().then(async session => {
      if (!active) return;
      if (!session) { router.replace('/login'); return; }
      setUser(session.user);
      if (session.user.horarioApresentacao) {
        setHorarioFiltro(session.user.horarioApresentacao);
      }
    });
    return () => { active = false; };
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ls] = await Promise.all([api.get('/locais'), loadOcupacao()]);
      setLocais(ls);
    } catch { setLocais([]); }
    finally { setLoading(false); }
  }, [loadOcupacao]);

  useEffect(() => { if (user) load(); }, [user, load]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  function openCreate() { setForm({ nome: '', totalMesas: '' }); setErrors({}); setModal('create'); }
  function openEdit(local) {
    setForm({ nome: local.nome || local.numero || '', totalMesas: String(local.totalMesas || 30) });
    setErrors({});
    setModal({ type: 'edit', id: local.id });
  }
  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  }
  function validate() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Nome do local é obrigatório';
    if (!form.totalMesas || isNaN(form.totalMesas) || Number(form.totalMesas) < 1)
      e.totalMesas = 'Informe a quantidade de mesas (mínimo 1)';
    return e;
  }
  async function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const body = { numero: form.nome, totalMesas: Number(form.totalMesas) };
      if (modal === 'create') { await api.post('/locais', body); showToast('Local adicionado!'); }
      else { await api.put(`/locais/${modal.id}`, body); showToast('Local atualizado!'); }
      setModal(null); load();
    } catch (err) { setErrors({ _: err.message }); }
    finally { setSaving(false); }
  }
  async function handleDelete(local) {
    if (!confirm(`Excluir "${local.nome || local.numero}"?`)) return;
    try { await api.delete(`/locais/${local.id}`); showToast('Local excluído.'); load(); }
    catch (err) { alert(err.message); }
  }

  // Dado um local e mesa, retorna se está ocupada no horário filtrado (ou em qualquer horário se sem filtro)
  function getMesaStatus(localNome, mesa) {
    const mesaStr = String(mesa);
    if (horarioFiltro) {
      const oc = ocupacao.find(
        o => o.local === localNome && String(o.mesa) === mesaStr && o.horario === horarioFiltro
      );
      if (!oc) return 'livre';
      if (oc && user?.localApresentacao === localNome &&
          String(user?.mesaApresentacao) === mesaStr &&
          user?.horarioApresentacao === horarioFiltro) return 'minha';
      return 'ocupada';
    }
    // sem filtro: verifica qualquer horário
    const hasAny = ocupacao.some(o => o.local === localNome && String(o.mesa) === mesaStr);
    if (!hasAny) return 'livre';
    // verifica se algum deles é do usuário atual
    const hasMine = ocupacao.some(
      o => o.local === localNome && String(o.mesa) === mesaStr &&
           user?.localApresentacao === localNome &&
           String(user?.mesaApresentacao) === mesaStr
    );
    return hasMine ? 'minha' : 'ocupada';
  }

  const isCoord = canDo(user, 'addLocais');

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Locais de Apresentação</h1>
            <p className={styles.pageSub}>Visualize a disponibilidade de mesas por horário</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => { loadOcupacao(); showToast('Atualizado!'); }}>↻ Atualizar</Button>
            {isCoord && <Button onClick={openCreate}>+ Novo Local</Button>}
          </div>
        </div>

        {/* Filtro de horário */}
        <div className={styles.horarioFiltroWrap}>
          <span className={styles.horarioFiltroLabel}>Filtrar por horário:</span>
          <div className={styles.horarioFiltroGrid}>
            <button
              className={`${styles.horarioFiltroBtn} ${!horarioFiltro ? styles.horarioFiltroBtnActive : ''}`}
              onClick={() => setHorarioFiltro('')}>Todos</button>
            {HORARIOS.map(h => (
              <button key={h}
                className={`${styles.horarioFiltroBtn} ${horarioFiltro === h ? styles.horarioFiltroBtnActive : ''}`}
                onClick={() => setHorarioFiltro(h)}>{h}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}><span className={styles.spinner} /></div>
        ) : locais.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum local cadastrado ainda.</p>
            {isCoord && <p>Clique em "+ Novo Local" para adicionar.</p>}
          </div>
        ) : (
          <div className={styles.locaisContainer}>
            {locais.map(local => {
              const totalMesas = local.totalMesas || 30;
              const nome = local.nome || local.numero || `Local ${local.id}`;
              return (
                <div key={local.id} className={styles.localBlock}>
                  <div className={styles.localHeader}>
                    <div>
                      <h2 className={styles.localNome}>{nome}</h2>
                      <p className={styles.localInfo}>{totalMesas} mesas
                        {horarioFiltro && (
                          <span style={{ marginLeft: 8, color: 'var(--accent2)', fontSize: 12 }}>
                            · {horarioFiltro}
                          </span>
                        )}
                      </p>
                    </div>
                    {isCoord && (
                      <div className={styles.localActions}>
                        <button className={styles.editBtn} onClick={() => openEdit(local)} title="Editar">✏️</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(local)} title="Excluir">🗑</button>
                      </div>
                    )}
                  </div>

                  <div className={styles.mesasGrid}>
                    {Array.from({ length: totalMesas }, (_, i) => i + 1).map(mesa => {
                      const status = getMesaStatus(nome, mesa);
                      return (
                        <div key={mesa}
                          className={`${styles.mesaBtn}
                            ${status === 'ocupada' ? styles.mesaOcupada : ''}
                            ${status === 'minha'   ? styles.mesaMinha   : ''}
                          `}
                          title={
                            status === 'ocupada' ? `Ocupada${horarioFiltro ? ` (${horarioFiltro})` : ''}` :
                            status === 'minha'   ? 'Sua mesa' :
                            `Mesa ${mesa} — disponível`
                          }
                        >
                          {mesa}
                        </div>
                      );
                    })}
                  </div>

                  <div className={styles.mesasLegenda}>
                    <span className={styles.legendaItem}><span className={`${styles.legendaDot} ${styles.legendaLivre}`}/> Disponível</span>
                    <span className={styles.legendaItem}><span className={`${styles.legendaDot} ${styles.legendaOcupada}`}/> Ocupada</span>
                    <span className={styles.legendaItem}><span className={`${styles.legendaDot} ${styles.legendaMinha}`}/> Minha seleção</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {modal && (
          <Modal title={modal === 'create' ? 'Novo Local de Apresentação' : 'Editar Local'}
            onClose={() => setModal(null)}>
            <div className={styles.formGrid}>
              <FormInput label="Nome do local" name="nome" value={form.nome}
                onChange={handleChange} required error={errors.nome}
                placeholder="Ex: Salesianinho – Pátio Externo" />
              <FormInput label="Quantidade de mesas" name="totalMesas" value={form.totalMesas}
                onChange={handleChange} required error={errors.totalMesas} placeholder="Ex: 30" />
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
