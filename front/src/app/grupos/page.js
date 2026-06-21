"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../../components/Button";
import {
  listarGrupos,
  listarTurmas,
  listarProfessores,
  deletarGrupo,
} from "../../utils/api";

export default function GruposPage() {
  const [grupos, setGrupos] = useState([]);
  const [filtroAluno, setFiltroAluno] = useState("");
  const [filtroProfessor, setFiltroProfessor] = useState("");
  const [filtroTurma, setFiltroTurma] = useState("");
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);

  useEffect(() => {
    async function load() {
      const g = await listarGrupos();
      if (g) setGrupos(g);
      const t = await listarTurmas();
      if (t) setTurmas(t);
      const p = await listarProfessores();
      if (p) setProfessores(p);
    }

    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Confirma exclusão do grupo?')) return;
    const res = await deletarGrupo(id);
    if (res) {
      setGrupos((s) => s.filter((g) => g.id !== id));
    } else {
      alert('Não foi possível excluir. Verifique se existe projeto vinculado ou erro do servidor.');
    }
  }

  const filtered = grupos.filter((g) => {
    if (filtroTurma && g.turmaId !== filtroTurma) return false;
    if (filtroProfessor && String(g.orientador) !== String(filtroProfessor)) return false;
    if (filtroAluno) {
      const q = filtroAluno.toLowerCase();
      const match = (g.alunos || []).some((a) => (a.nome || a.username || "").toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div>
      <h1>Grupos de Projeto</h1>
      <div style={{ marginBottom: 12 }}>
        <Link href="/grupos/new"><Button type="button">Novo Grupo</Button></Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Pesquisar por aluno" value={filtroAluno} onChange={(e) => setFiltroAluno(e.target.value)} />
        <select value={filtroProfessor} onChange={(e) => setFiltroProfessor(e.target.value)}>
          <option value="">Todos professores</option>
          {professores && professores.map((p) => <option key={p.id} value={p.id}>{p.nome || p.username}</option>)}
        </select>
        <select value={filtroTurma} onChange={(e) => setFiltroTurma(e.target.value)}>
          <option value="">Todas turmas</option>
          {turmas && turmas.map((t) => <option key={t.id} value={t.id}>{t.curso} - {t.periodo}</option>)}
        </select>
      </div>

      <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Turma</th>
            <th>Orientador</th>
            <th>Alunos</th>
            <th>Local / Horário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.turma?.curso || g.turmaNome || g.turmaId} - {g.turma?.periodo || ''}</td>
              <td>{g.orientadorNome || g.orientador}</td>
              <td>{(g.alunos || []).map((a) => a.nome || a.username).join(', ')}</td>
              <td>{g.localNome || ''} {g.inicio ? ` - ${g.inicio}` : ''}</td>
              <td>
                <Link href={`/grupos/${g.id}`}><Button type="button">Editar</Button></Link>
                <Button type="button" onClick={() => handleDelete(g.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
