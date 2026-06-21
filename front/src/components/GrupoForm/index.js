"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";
import FormInput from "../../components/FormInput";
import {
  listarTurmas,
  obterTurmaPorId,
  listarProfessores,
  listarLocais,
  listarGrupos,
} from "../../utils/api";

import "./styles.css";

export default function GrupoForm({ initialData = null, onSaved }) {
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [locais, setLocais] = useState([]);
  const [alunosTurma, setAlunosTurma] = useState([]);

  const [form, setForm] = useState({
    turmaId: initialData?.turmaId || "",
    cursoPeriodo: initialData?.cursoPeriodo || "",
    orientador: initialData?.orientador || "",
    alunos: initialData?.alunos || [],
    localId: initialData?.localId || "",
    inicio: initialData?.inicio || "",
    fim: initialData?.fim || "",
  });

  useEffect(() => {
    async function load() {
      const t = await listarTurmas();
      if (t) setTurmas(t);
      const p = await listarProfessores();
      if (p) setProfessores(p);
      const l = await listarLocais();
      if (l) setLocais(l);
      if (form.turmaId) {
        const detalhe = await obterTurmaPorId(form.turmaId);
        if (detalhe && detalhe.alunos) setAlunosTurma(detalhe.alunos);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadAlunos() {
      if (form.turmaId) {
        const detalhe = await obterTurmaPorId(form.turmaId);
        if (detalhe && detalhe.alunos) setAlunosTurma(detalhe.alunos);
      } else {
        setAlunosTurma([]);
      }
    }

    loadAlunos();
  }, [form.turmaId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function toggleAluno(alunoId) {
    setForm((s) => {
      const exists = s.alunos.includes(alunoId);
      const alunos = exists ? s.alunos.filter((a) => a !== alunoId) : [...s.alunos, alunoId];
      return { ...s, alunos };
    });
  }

  async function validate() {
    if (!form.turmaId) return "Selecione uma turma";
    if (!form.orientador) return "Informe o orientador";
    if (form.alunos.length < 3 || form.alunos.length > 7) return "O grupo deve ter entre 3 e 7 alunos";

    // Verificar se alunos pertencem a outro grupo na mesma turma
    const grupos = await listarGrupos();
    if (grupos) {
      for (const alunoId of form.alunos) {
        const conflict = grupos.find((g) => g.turmaId === form.turmaId && g.id !== initialData?.id && g.alunos?.includes(alunoId));
        if (conflict) return `Aluno já pertence a outro grupo (ID grupo ${conflict.id})`;
      }
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = await validate();
    if (err) {
      alert(err);
      return;
    }

    if (onSaved) onSaved(form);
  }

  return (
    <form className="grupo-form" onSubmit={handleSubmit}>
      <div className="row">
        <label>Turma</label>
        <select name="turmaId" value={form.turmaId} onChange={handleChange}>
          <option value="">-- selecione --</option>
          {turmas && turmas.map((t) => (
            <option key={t.id} value={t.id}>{t.curso} - {t.periodo}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <label>Orientador (Professor)</label>
        <select name="orientador" value={form.orientador} onChange={handleChange}>
          <option value="">-- selecione --</option>
          {professores && professores.map((p) => (
            <option key={p.id} value={p.id}>{p.nome || p.username}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <label>Alunos (3-7)</label>
        <div className="alunos-list">
          {alunosTurma && alunosTurma.length ? (
            alunosTurma.map((a) => (
              <label key={a.id} className="aluno-item">
                <input type="checkbox" checked={form.alunos.includes(a.id)} onChange={() => toggleAluno(a.id)} /> {a.nome || a.username}
              </label>
            ))
          ) : (
            <div>Nenhum aluno disponível para esta turma</div>
          )}
        </div>
      </div>

      <div className="row">
        <label>Local da apresentação</label>
        <select name="localId" value={form.localId} onChange={handleChange}>
          <option value="">-- selecione --</option>
          {locais && locais.map((l) => (
            <option key={l.id} value={l.id}>{l.nome}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <FormInput label="Início" type="datetime-local" name="inicio" value={form.inicio} onChange={handleChange} />
        <FormInput label="Fim" type="datetime-local" name="fim" value={form.fim} onChange={handleChange} />
      </div>

      <div className="actions">
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
