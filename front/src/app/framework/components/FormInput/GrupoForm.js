"use client";

import { useState, useEffect } from 'react';
import Button from '../Button/Button';

export default function GrupoForm({ initialData, turmas, professores, alunos, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: '',
    turmaId: turmas[0]?.id || 1,
    professorId: professores[0]?.id || 1,
    alunos: [],
    localApresentacao: '',
    horarioInicio: '',
    horarioFim: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        alunos: Array.isArray(initialData.alunos) ? initialData.alunos : [],
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.alunos.length < 3 || form.alunos.length > 7) {
      alert('O grupo deve ter entre 3 e 7 alunos.');
      return;
    }

    if (form.horarioInicio && form.horarioFim && new Date(form.horarioInicio) >= new Date(form.horarioFim)) {
      alert('O horário de início deve ser anterior ao horário de fim.');
      return;
    }

    onSave(form);
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
            onChange={(e) => setForm({ ...form, turmaId: Number(e.target.value) })}
          >
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>{t.curso} - {t.periodo}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Professor Orientador</label>
          <select
            className="form-input"
            value={form.professorId}
            onChange={(e) => setForm({ ...form, professorId: Number(e.target.value) })}
          >
            {professores.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Alunos componentes do grupo</label>
        <select
          multiple
          className="form-input"
          value={form.alunos}
          onChange={(e) =>
            setForm({
              ...form,
              alunos: Array.from(e.target.selectedOptions, (option) => Number(option.value)),
            })
          }
        >
          {alunos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nome} ({a.matricula})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Local de Apresentação</label>
        <input
          className="form-input"
          value={form.localApresentacao}
          onChange={(e) => setForm({ ...form, localApresentacao: e.target.value })}
          placeholder="Auditório, Sala 305, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Horário de Início</label>
          <input
            type="datetime-local"
            className="form-input"
            value={form.horarioInicio}
            onChange={(e) => setForm({ ...form, horarioInicio: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Horário de Fim</label>
          <input
            type="datetime-local"
            className="form-input"
            value={form.horarioFim}
            onChange={(e) => setForm({ ...form, horarioFim: e.target.value })}
          />
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="success">Salvar Grupo</Button>
        <Button type="button" variant="danger" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}