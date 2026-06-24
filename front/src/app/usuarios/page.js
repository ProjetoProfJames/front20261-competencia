'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api, validateSession, CURSOS_DISPONIVEIS } from '@/lib/api';
import Menu from '@/components/Menu';
import styles from '../crud.module.css';

export default function UsuariosPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [coordenadores, setCoordenadores] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunosPorCurso, setAlunosPorCurso] = useState({});
  const [visitantes, setVisitantes] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const all = await api.get('/users');
      setCoordenadores(all.filter(u => u.profile === 'COORDENADOR'));
      setProfessores(all.filter(u => u.profile === 'PROFESSOR'));
      setVisitantes(all.filter(u => u.profile === 'AVALIADOR_EXTERNO'));

      const alunos = all.filter(u => u.profile === 'ALUNO');
      const byCurso = {};
      alunos.forEach(a => {
        const curso = a.curso || 'Sem curso declarado';
        if (!byCurso[curso]) byCurso[curso] = [];
        byCurso[curso].push(a);
      });
      setAlunosPorCurso(byCurso);
    } catch {
      setCoordenadores([]); setProfessores([]);
      setAlunosPorCurso({}); setVisitantes([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (user) load(); }, [user, load]);

  if (!user) return null;

  const cursosOrdenados = [
    ...CURSOS_DISPONIVEIS.filter(c => alunosPorCurso[c]),
    ...(alunosPorCurso['Sem curso declarado'] ? ['Sem curso declarado'] : []),
  ];
  const totalAlunos = Object.values(alunosPorCurso).reduce((a, arr) => a + arr.length, 0);

  const SectionHeader = ({ icon, title, count }) => (
    <h2 className={styles.userTableTitle}>
      <span>{icon}</span> {title}
      <span className={styles.userTableCount}>{count}</span>
    </h2>
  );

  return (
    <div className={styles.layout}>
      <Menu user={user} />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Participantes</h1>
            <p className={styles.pageSub}>Todos os usuários inscritos no evento</p>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}><span className={styles.spinner} /></div>
        ) : (
          <div className={styles.userTablesWrap}>

            {/* ── Coordenadores ── */}
            {coordenadores.length > 0 && (
              <section className={styles.userTableSection}>
                <SectionHeader icon="🏛️" title="Coordenadores" count={coordenadores.length} />
                <div className={styles.userTable}>
                  <div className={`${styles.userTableHeader} ${styles.colProf}`}>
                    <span>Nome</span><span>E-mail</span><span>Matrícula</span>
                  </div>
                  {coordenadores.map(c => (
                    <div key={c.id} className={`${styles.userTableRow} ${styles.colProf}`}>
                      <span className={styles.userNameCell}>{c.username}</span>
                      <span className={styles.userEmailCell}>{c.email}</span>
                      <span className={styles.userMatriculaCell}>{c.matricula || '—'}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Professores ── */}
            <section className={styles.userTableSection}>
              <SectionHeader icon="👨‍🏫" title="Professores" count={professores.length} />
              {professores.length === 0 ? (
                <p className={styles.emptyMsg}>Nenhum professor cadastrado ainda.</p>
              ) : (
                <div className={styles.userTable}>
                  <div className={`${styles.userTableHeader} ${styles.colProf}`}>
                    <span>Nome</span><span>E-mail</span><span>Matrícula</span>
                  </div>
                  {professores.map(p => (
                    <div key={p.id} className={`${styles.userTableRow} ${styles.colProf}`}>
                      <span className={styles.userNameCell}>{p.username}</span>
                      <span className={styles.userEmailCell}>{p.email}</span>
                      <span className={styles.userMatriculaCell}>{p.matricula || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Alunos por Curso ── */}
            <section className={styles.userTableSection}>
              <SectionHeader icon="🎓" title="Alunos por Curso" count={totalAlunos} />
              {totalAlunos === 0 ? (
                <p className={styles.emptyMsg}>Nenhum aluno cadastrado ainda.</p>
              ) : (
                <div className={styles.cursoSections}>
                  {cursosOrdenados.map(curso => (
                    <div key={curso} className={styles.cursoSection}>
                      <div className={styles.cursoSectionHeader}>
                        <span className={styles.cursoSectionNome}>{curso}</span>
                        <span className={styles.userTableCount}>{alunosPorCurso[curso].length}</span>
                      </div>
                      <div className={styles.userTable}>
                        <div className={`${styles.userTableHeader} ${styles.colAluno}`}>
                          <span>Nome</span><span>Projeto</span>
                          <span>Horário</span><span>Local / Mesa</span>
                        </div>
                        {alunosPorCurso[curso].map(a => (
                          <div key={a.id} className={`${styles.userTableRow} ${styles.colAluno}`}>
                            <span className={styles.userNameCell}>{a.username}</span>
                            <span className={styles.userProjetoCell}>{a.projeto || '—'}</span>
                            <span className={styles.userHorarioCell}>{a.horarioApresentacao || '—'}</span>
                            <span className={styles.userLocalCell}>
                              {a.localApresentacao
                                ? `${a.localApresentacao} · Mesa ${a.mesaApresentacao}`
                                : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Visitantes ── */}
            <section className={styles.userTableSection}>
              <SectionHeader icon="👤" title="Visitantes" count={visitantes.length} />
              {visitantes.length === 0 ? (
                <p className={styles.emptyMsg}>Nenhum visitante cadastrado ainda.</p>
              ) : (
                <div className={styles.userTable}>
                  <div className={`${styles.userTableHeader} ${styles.colVisitante}`}>
                    <span>Nome</span><span>E-mail</span>
                  </div>
                  {visitantes.map(v => (
                    <div key={v.id} className={`${styles.userTableRow} ${styles.colVisitante}`}>
                      <span className={styles.userNameCell}>{v.username}</span>
                      <span className={styles.userEmailCell}>{v.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}
      </main>
    </div>
  );
}
