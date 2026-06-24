'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  api, validateSession, getSession, saveSession, clearSession,
  CURSOS_DISPONIVEIS, PERIODOS, HORARIOS, HORARIOS_VISITA,
  TIPO_CADASTRO, TIPO_CADASTRO_LABELS, TIPO_TO_PROFILE,
} from '@/lib/api';
import Menu from '@/components/Menu';
import styles from './meu-cadastro.module.css';

const CODIGO_COORDENADOR = 'UniSalesPIE';

export default function MeuCadastroPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [tipoCadastro, setTipoCadastro] = useState('');
  const [tipoError, setTipoError] = useState('');
  const [locais, setLocais] = useState([]);
  // ocupacao: array de { local, mesa, horario }  — vem do backend
  const [ocupacao, setOcupacao] = useState([]);

  const [form, setForm] = useState({
    curso: '', periodo: '',
    professor: '', turma: '', projeto: '',
    localApresentacao: '', mesaApresentacao: '', horarioApresentacao: '',
    areaEstudo: '', periodosAula: '', turmasAula: '',
    codigoVerificacao: '', cursosCoordenados: [],
    comoFicouSabendo: '', horariosVisita: [],
  });
  const [extraErrors, setExtraErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const [conta, setConta] = useState({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [contaErrors, setContaErrors] = useState({});
  const [contaSaving, setContaSaving] = useState(false);
  const [contaToast, setContaToast] = useState('');

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
      const u = session.user;
      setUser(u);
      const profileToTipo = {
        ALUNO: 'ALUNO', PROFESSOR: 'PROFESSOR',
        COORDENADOR: 'COORDENADOR', AVALIADOR_EXTERNO: 'VISITANTE',
      };
      const tipoResolvido = u.tipoCadastro || profileToTipo[u.profile] || '';
      setTipoCadastro(tipoResolvido);
      setIsFirstAccess(!tipoResolvido);
      setForm(f => ({
        ...f,
        curso: u.curso || '',
        periodo: u.periodo ? String(u.periodo) : '',
        projeto: u.projeto || '',
        localApresentacao: u.localApresentacao || '',
        mesaApresentacao: u.mesaApresentacao || '',
        horarioApresentacao: u.horarioApresentacao || '',
      }));
      setConta(c => ({ ...c, email: u.email || '' }));
      try {
        const ls = await api.get('/locais');
        setLocais(ls);
      } catch {}
      await loadOcupacao();
    });
    return () => { active = false; };
  }, [router, loadOcupacao]);

  function setF(name, value) {
    setForm(f => ({ ...f, [name]: value }));
    setExtraErrors(e => ({ ...e, [name]: '' }));
  }

  // ── Lógica de ocupação ────────────────────────────────
  // Verifica se uma mesa está ocupada no horário selecionado
  // (por OUTRO usuário — ignora a própria seleção atual do user)
  function isMesaOcupadaPorOutro(localNome, mesa) {
    if (!form.horarioApresentacao) return false;
    return ocupacao.some(
      o => o.local === localNome &&
           String(o.mesa) === String(mesa) &&
           o.horario === form.horarioApresentacao &&
           // exclui a própria seleção já salva do usuário
           !(user?.localApresentacao === localNome &&
             String(user?.mesaApresentacao) === String(mesa) &&
             user?.horarioApresentacao === form.horarioApresentacao)
    );
  }

  function isMinhaMesa(localNome, mesa) {
    return form.localApresentacao === localNome &&
           String(form.mesaApresentacao) === String(mesa);
  }

  function selectMesa(localNome, mesa) {
    if (isMinhaMesa(localNome, mesa)) {
      // desmarcar
      setF('localApresentacao', '');
      setF('mesaApresentacao', '');
    } else {
      setF('localApresentacao', localNome);
      setF('mesaApresentacao', String(mesa));
    }
  }

  // ── Salvar informações ────────────────────────────────
  async function handleSave() {
    if (!tipoCadastro) { setTipoError('Selecione o tipo de usuário'); return; }
    const e = {};
    if (tipoCadastro === 'ALUNO') {
      if (!form.curso) e.curso = 'Selecione seu curso';
      if (!form.periodo) e.periodo = 'Selecione o período';
      // valida conflito de mesa em tempo real com backend
      if (form.localApresentacao && form.mesaApresentacao && form.horarioApresentacao) {
        const fresh = await api.get('/users/ocupacao').catch(() => []);
        const conflito = fresh.some(
          o => o.local === form.localApresentacao &&
               String(o.mesa) === String(form.mesaApresentacao) &&
               o.horario === form.horarioApresentacao &&
               !(user?.localApresentacao === form.localApresentacao &&
                 String(user?.mesaApresentacao) === String(form.mesaApresentacao) &&
                 user?.horarioApresentacao === form.horarioApresentacao)
        );
        if (conflito) {
          e.mesaApresentacao = `A mesa ${form.mesaApresentacao} já foi reservada por outro aluno nesse horário. Escolha outra.`;
          setOcupacao(fresh); // atualiza o estado visual
        }
      }
    }
    if (tipoCadastro === 'COORDENADOR' && form.codigoVerificacao !== CODIGO_COORDENADOR)
      e.codigoVerificacao = 'Código de verificação incorreto';
    if (Object.keys(e).length) { setExtraErrors(e); return; }

    setSaving(true);
    try {
      const profile = TIPO_TO_PROFILE[tipoCadastro];
      const body = { profile };
      if (tipoCadastro === 'ALUNO') {
        body.curso = form.curso;
        body.periodo = Number(form.periodo);
        body.projeto = form.projeto;
        body.horarioApresentacao = form.horarioApresentacao || null;
        body.localApresentacao = form.localApresentacao || null;
        body.mesaApresentacao = form.mesaApresentacao || null;
      }
      const updated = await api.put(`/users/${user.id}`, body);
      const session = getSession();
      const merged = { ...session.user, ...updated, tipoCadastro };
      saveSession(session.token, merged);
      setUser(merged);
      setToast('Informações salvas!');
      setTimeout(() => setToast(''), 2500);
      await loadOcupacao(); // recarrega ocupação para refletir mudança
      if (isFirstAccess) {
        setIsFirstAccess(false);
        setTimeout(() => router.push('/dashboard'), 1200);
      }
    } catch (err) {
      setExtraErrors({ _: err.message || 'Não foi possível salvar.' });
    } finally {
      setSaving(false);
    }
  }

  // ── Dados da conta ────────────────────────────────────
  async function handleSaveConta() {
    const e = {};
    if (!conta.email.trim()) e.email = 'E-mail é obrigatório';
    else if (!/^\S+@\S+\.\S+$/.test(conta.email)) e.email = 'E-mail inválido';
    if (conta.newPassword || conta.confirmPassword) {
      if (!conta.currentPassword) e.currentPassword = 'Informe a senha atual';
      if (conta.newPassword.length < 6) e.newPassword = 'Mínimo 6 caracteres';
      if (conta.newPassword !== conta.confirmPassword) e.confirmPassword = 'As senhas não coincidem';
    }
    if (Object.keys(e).length) { setContaErrors(e); return; }
    setContaSaving(true);
    try {
      const body = { email: conta.email };
      if (conta.newPassword) body.password = conta.newPassword;
      const updated = await api.put(`/users/${user.id}`, body);
      const session = getSession();
      const merged = { ...session.user, ...updated, tipoCadastro: session.user.tipoCadastro };
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

  async function handleDeleteAccount() {
    if (!confirm('Tem certeza? Esta ação é irreversível.')) return;
    if (!confirm('Confirma a exclusão definitiva da sua conta?')) return;
    try { await api.delete(`/users/${user.id}`); clearSession(); router.replace('/login'); }
    catch (err) { alert(err.message || 'Não foi possível excluir.'); }
  }

  if (!user) return null;

  // ── Render formulário por tipo ────────────────────────
  const renderExtraForm = () => {
    if (!tipoCadastro) return null;

    if (tipoCadastro === 'ALUNO') return (
      <div className={styles.extraForm}>
        <p className={styles.extraFormTitle}>Informações do Aluno</p>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Curso</label>
          <div className={styles.cursoGrid}>
            {CURSOS_DISPONIVEIS.map(c => (
              <button key={c} type="button"
                className={`${styles.pill} ${form.curso === c ? styles.pillSelected : ''}`}
                onClick={() => setF('curso', c)}>{c}</button>
            ))}
          </div>
          {extraErrors.curso && <span className={styles.fieldError}>{extraErrors.curso}</span>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Período</label>
          <div className={styles.periodoGrid}>
            {PERIODOS.map(p => (
              <button key={p} type="button"
                className={`${styles.periodoBtn} ${form.periodo === String(p) ? styles.periodoBtnSelected : ''}`}
                onClick={() => setF('periodo', String(p))}>{p}º</button>
            ))}
          </div>
          {extraErrors.periodo && <span className={styles.fieldError}>{extraErrors.periodo}</span>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Professor orientador</label>
          <input className={styles.input} value={form.professor || ''}
            onChange={e => setF('professor', e.target.value)}
            placeholder="Nome do professor orientador" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Turma</label>
          <input className={styles.input} value={form.turma || ''}
            onChange={e => setF('turma', e.target.value)} placeholder="Ex: ADS-2025-1A" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Nome do projeto</label>
          <input className={styles.input} value={form.projeto || ''}
            onChange={e => setF('projeto', e.target.value)}
            placeholder="Título do projeto a apresentar" />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Horário desejado para apresentação</label>
          <p className={styles.hintText}>Selecione o horário primeiro para ver a disponibilidade das mesas.</p>
          <div className={styles.horarioGrid}>
            {HORARIOS.map(h => (
              <button key={h} type="button"
                className={`${styles.pill} ${form.horarioApresentacao === h ? styles.pillSelected : ''}`}
                onClick={() => {
                  setF('horarioApresentacao', h);
                  // Limpa seleção de mesa ao trocar horário
                  setF('localApresentacao', '');
                  setF('mesaApresentacao', '');
                  loadOcupacao(); // atualiza ocupação ao trocar horário
                }}>{h}</button>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Onde gostaria de apresentar? Selecione uma mesa</label>
          {!form.horarioApresentacao ? (
            <p className={styles.hintText}>⬆ Selecione um horário acima para ver as mesas disponíveis.</p>
          ) : locais.length === 0 ? (
            <p className={styles.hintText}>Aguardando o coordenador cadastrar os locais.</p>
          ) : (
            <>
              <div className={styles.mesasLegenda} style={{ marginBottom: 12 }}>
                <span className={styles.legendaItem}><span className={`${styles.legendaDot} ${styles.legendaLivre}`}/> Disponível</span>
                <span className={styles.legendaItem}><span className={`${styles.legendaDot} ${styles.legendaOcupada}`}/> Ocupada</span>
                <span className={styles.legendaItem}><span className={`${styles.legendaDot} ${styles.legendaMinha}`}/> Minha seleção</span>
              </div>
              {locais.map(local => {
                const totalMesas = local.totalMesas || 30;
                const nome = local.nome || local.numero || `Local ${local.id}`;
                return (
                  <div key={local.id} className={styles.localBlockMini}>
                    <p className={styles.localNomeMini}>{nome}</p>
                    <div className={styles.mesasGrid}>
                      {Array.from({ length: totalMesas }, (_, i) => i + 1).map(mesa => {
                        const ocupada = isMesaOcupadaPorOutro(nome, mesa);
                        const minha = isMinhaMesa(nome, mesa);
                        return (
                          <button key={mesa} type="button"
                            className={`${styles.mesaBtn}
                              ${ocupada ? styles.mesaOcupada : ''}
                              ${minha ? styles.mesaMinha : ''}
                            `}
                            onClick={() => !ocupada && selectMesa(nome, mesa)}
                            disabled={ocupada}
                            title={ocupada ? 'Ocupada neste horário' :
                                   minha ? 'Sua seleção (clique para desmarcar)' :
                                   `Mesa ${mesa} — disponível`}>
                            {mesa}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {extraErrors.mesaApresentacao && (
            <div className={styles.errorBox} style={{ marginTop: 8 }}>{extraErrors.mesaApresentacao}</div>
          )}
          {form.localApresentacao && (
            <p className={styles.selectionInfo}>
              ✅ Mesa {form.mesaApresentacao} — {form.localApresentacao} — {form.horarioApresentacao}
            </p>
          )}
        </div>
      </div>
    );

    if (tipoCadastro === 'PROFESSOR') return (
      <div className={styles.extraForm}>
        <p className={styles.extraFormTitle}>Informações do Professor</p>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Área(s) de estudo que leciona</label>
          <input className={styles.input} value={form.areaEstudo || ''}
            onChange={e => setF('areaEstudo', e.target.value)}
            placeholder="Ex: Engenharia de Software, Banco de Dados" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Períodos para os quais dá aula</label>
          <input className={styles.input} value={form.periodosAula || ''}
            onChange={e => setF('periodosAula', e.target.value)}
            placeholder="Ex: 3º, 4º, 5º período" />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Turmas que leciona</label>
          <input className={styles.input} value={form.turmasAula || ''}
            onChange={e => setF('turmasAula', e.target.value)}
            placeholder="Ex: ADS-2025-1A, SI-2025-2B" />
        </div>
      </div>
    );

    if (tipoCadastro === 'COORDENADOR') return (
      <div className={styles.extraForm}>
        <p className={styles.extraFormTitle}>Verificação de Coordenador</p>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Código de verificação</label>
          <input className={`${styles.input} ${extraErrors.codigoVerificacao ? styles.inputError : ''}`}
            type="password" value={form.codigoVerificacao || ''}
            onChange={e => setF('codigoVerificacao', e.target.value)}
            placeholder="Código fornecido pela instituição" />
          {extraErrors.codigoVerificacao && <span className={styles.fieldError}>{extraErrors.codigoVerificacao}</span>}
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Cursos sob sua coordenação</label>
          <div className={styles.cursoGrid}>
            {CURSOS_DISPONIVEIS.map(c => {
              const sel = (form.cursosCoordenados || []).includes(c);
              return (
                <button key={c} type="button"
                  className={`${styles.pill} ${sel ? styles.pillSelected : ''}`}
                  onClick={() => {
                    const arr = form.cursosCoordenados || [];
                    setF('cursosCoordenados', sel ? arr.filter(x => x !== c) : [...arr, c]);
                  }}>{c}</button>
              );
            })}
          </div>
        </div>
      </div>
    );

    if (tipoCadastro === 'VISITANTE') return (
      <div className={styles.extraForm}>
        <p className={styles.extraFormTitle}>Informações do Visitante</p>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Como ficou sabendo do evento?</label>
          <input className={styles.input} value={form.comoFicouSabendo || ''}
            onChange={e => setF('comoFicouSabendo', e.target.value)}
            placeholder="Ex: redes sociais, indicação de amigo..." />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Pretensão de horário de visita (pode marcar mais de um)</label>
          <div className={styles.horarioGrid}>
            {HORARIOS_VISITA.map(h => {
              const sel = (form.horariosVisita || []).includes(h);
              return (
                <button key={h} type="button"
                  className={`${styles.pill} ${sel ? styles.pillSelected : ''}`}
                  onClick={() => {
                    const arr = form.horariosVisita || [];
                    setF('horariosVisita', sel ? arr.filter(x => x !== h) : [...arr, h]);
                  }}>{h}</button>
              );
            })}
          </div>
        </div>
      </div>
    );
    return null;
  };

  // ── Layout ────────────────────────────────────────────
  const content = (
    <div className={isFirstAccess ? styles.firstAccessWrap : styles.editWrap}>
      {isFirstAccess && (
        <div className={styles.header}>
          <div className={styles.logoMark}>⬡</div>
          <h1 className={styles.title}>Quase lá!</h1>
          <p className={styles.sub}>Olá, {user.username}. Conte-nos um pouco mais sobre você.</p>
        </div>
      )}

      <section className={styles.section}>
        {!isFirstAccess && <h2 className={styles.sectionTitle}>Tipo de Usuário</h2>}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>{isFirstAccess ? 'Você é...' : 'Tipo de cadastro'}</label>
          <div className={styles.tipoGrid}>
            {TIPO_CADASTRO.map(t => (
              <button key={t} type="button"
                className={`${styles.tipoBtn} ${tipoCadastro === t ? styles.tipoBtnSelected : ''}`}
                onClick={() => { setTipoCadastro(t); setTipoError(''); }}>
                <span className={styles.tipoIcon}>
                  {t === 'ALUNO' ? '🎓' : t === 'PROFESSOR' ? '👨‍🏫' : t === 'COORDENADOR' ? '🏛️' : '👤'}
                </span>
                <span>{TIPO_CADASTRO_LABELS[t]}</span>
              </button>
            ))}
          </div>
          {tipoError && <span className={styles.fieldError}>{tipoError}</span>}
        </div>

        {renderExtraForm()}

        {extraErrors._ && <div className={styles.errorBox}>{extraErrors._}</div>}

        <div className={styles.sectionActions}>
          {isFirstAccess && (
            <button className={styles.skipBtn} type="button" onClick={() => router.push('/dashboard')}>
              Pular por agora
            </button>
          )}
          <button className={styles.saveBtn} type="button" onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : isFirstAccess ? 'Salvar e continuar →' : 'Salvar informações'}
          </button>
        </div>
        {toast && <div className={styles.toast}>{toast}</div>}
      </section>

      {!isFirstAccess && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Dados da Conta</h2>
          <div className={styles.formGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>E-mail</label>
              <input type="email" value={conta.email}
                onChange={e => setConta(c => ({ ...c, email: e.target.value }))}
                className={`${styles.input} ${contaErrors.email ? styles.inputError : ''}`}
                placeholder="seu@email.com" />
              {contaErrors.email && <span className={styles.fieldError}>{contaErrors.email}</span>}
            </div>
            <p className={styles.passwordHint}>Deixe em branco para não alterar a senha.</p>
            {[['currentPassword','Senha atual','current-password'],
              ['newPassword','Nova senha','new-password'],
              ['confirmPassword','Confirmar nova senha','new-password']].map(([name, label, ac]) => (
              <div key={name} className={styles.fieldGroup}>
                <label className={styles.label}>{label}</label>
                <input type="password" value={conta[name]}
                  onChange={e => setConta(c => ({ ...c, [name]: e.target.value }))}
                  className={`${styles.input} ${contaErrors[name] ? styles.inputError : ''}`}
                  placeholder="••••••••" autoComplete={ac} />
                {contaErrors[name] && <span className={styles.fieldError}>{contaErrors[name]}</span>}
              </div>
            ))}
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

      {!isFirstAccess && (
        <section className={`${styles.section} ${styles.dangerSection}`}>
          <h2 className={styles.sectionTitleDanger}>Zona de Perigo</h2>
          <p className={styles.dangerText}>A exclusão da conta é permanente e não pode ser desfeita.</p>
          <button className={styles.deleteAccountBtn} type="button" onClick={handleDeleteAccount}>
            🗑 Excluir minha conta
          </button>
        </section>
      )}
    </div>
  );

  if (isFirstAccess) return <div className={styles.fullPage}>{content}</div>;
  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Meu Cadastro</h1>
          <p className={styles.pageSub}>Gerencie seu tipo de usuário, informações e dados da conta</p>
        </div>
        {content}
      </main>
    </div>
  );
}
