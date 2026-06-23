"use client";

import { useState, useEffect } from "react";
import Button from "../Button/Button";

export default function GrupoForm({
  initialData,
  turmas,
  professores,
  alunos,
  locais,
  onSave,
  onClose,
}) {
  const [form, setForm] = useState({
    nome: "",
    turmaId: "",
    professorId: "",
    alunos: [],
    localId: "",
    localApresentacao: "",
    horarioInicio: "",
    horarioFim: "",
  });

  function getNomeUsuario(usuario) {
    return usuario?.username || usuario?.nome || usuario?.name || usuario?.email || "Sem nome";
  }

  function getNomeTurma(turma) {
    return `${turma?.cursoFormatado || "Curso não informado"} - ${
      turma?.periodoFormatado || "Período não informado"
    }`;
  }

  const turmaSelecionada = turmas.find(
    (t) => Number(t.id) === Number(form.turmaId)
  );

  const professoresDaTurma = Array.isArray(turmaSelecionada?.professores)
    ? turmaSelecionada.professores
    : [];

  const alunosDaTurma = Array.isArray(turmaSelecionada?.alunos)
    ? turmaSelecionada.alunos
    : [];

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        turmaId: initialData.turmaId || "",
        professorId: initialData.professorId || "",
        alunos: Array.isArray(initialData.alunos) ? initialData.alunos : [],
        localId: initialData.localId || "",
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      turmaId: prev.turmaId || turmas[0]?.id || "",
      localId: prev.localId || locais[0]?.id || "",
    }));
  }, [initialData, turmas, locais]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.turmaId) {
      alert("Selecione uma turma.");
      return;
    }

    if (!form.professorId) {
      alert("Selecione um professor orientador.");
      return;
    }

    if (!form.localId) {
      alert("Selecione um local de apresentação.");
      return;
    }

    if (form.alunos.length < 3 || form.alunos.length > 7) {
      alert("O grupo deve ter entre 3 e 7 alunos.");
      return;
    }

    if (!form.horarioInicio || !form.horarioFim) {
      alert("Informe o horário de início e fim.");
      return;
    }

    if (new Date(form.horarioInicio) >= new Date(form.horarioFim)) {
      alert("O horário de início deve ser anterior ao horário de fim.");
      return;
    }

    onSave({
      ...form,
      turmaId: Number(form.turmaId),
      professorId: Number(form.professorId),
      localId: Number(form.localId),
      semestreId: turmaSelecionada?.semestreId,
      alunos: form.alunos.map(Number),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Nome do Grupo</label>
        <input
          className="form-input"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Turma</label>
          <select
            className="form-input"
            value={form.turmaId}
            onChange={(e) =>
              setForm({
                ...form,
                turmaId: e.target.value,
                professorId: "",
                alunos: [],
              })
            }
            required
          >
            <option value="">Selecione uma turma</option>

            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {getNomeTurma(t)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Professor Orientador</label>
          <select
            className="form-input"
            value={form.professorId}
            onChange={(e) => setForm({ ...form, professorId: e.target.value })}
            required
          >
            <option value="">Selecione um professor</option>

            {professoresDaTurma.map((p) => (
              <option key={p.id} value={p.id}>
                {getNomeUsuario(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Alunos componentes do grupo</label>
        <select
          multiple
          className="form-input"
          value={form.alunos.map(String)}
          onChange={(e) =>
            setForm({
              ...form,
              alunos: Array.from(e.target.selectedOptions, (option) =>
                Number(option.value)
              ),
            })
          }
        >
          {alunosDaTurma.map((a) => (
            <option key={a.id} value={a.id}>
              {getNomeUsuario(a)}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Local de Apresentação</label>
        <select
          className="form-input"
          value={form.localId}
          onChange={(e) => {
            const localSelecionado = locais.find(
              (local) => Number(local.id) === Number(e.target.value)
            );

            setForm({
              ...form,
              localId: e.target.value,
              localApresentacao: localSelecionado?.numero || "",
            });
          }}
          required
        >
          <option value="">Selecione um local</option>

          {locais.map((local) => (
            <option key={local.id} value={local.id}>
              {local.numero}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Horário de Início</label>
          <input
            type="datetime-local"
            className="form-input"
            value={form.horarioInicio}
            onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Horário de Fim</label>
          <input
            type="datetime-local"
            className="form-input"
            value={form.horarioFim}
            onChange={(e) => setForm({ ...form, horarioFim: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="success">
          Salvar Grupo
        </Button>

        <Button type="button" variant="danger" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}