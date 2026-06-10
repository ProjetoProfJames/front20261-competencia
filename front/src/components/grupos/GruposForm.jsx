"use client";

import { useEffect, useState } from "react";
import { listarTurmas, listarLocais } from "@/app/services/gruposService";

export default function GrupoForm({ grupo, onSalvar, onVoltar }) {
  const [turmas, setTurmas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [formData, setFormData] = useState({
    nome: grupo?.nome || "",
    descricao: grupo?.descricao || "",
    turmaId: grupo?.turma?.id || "",
    semestreId: grupo?.semestre?.id || "",
    semestreNome: grupo?.semestre?.nome || "",
    professorOrientadorId: grupo?.professorOrientador?.id || "",
    localId: grupo?.local?.id || "",
    horarioInicio: grupo?.horarioInicio
      ? toDatetimeLocal(grupo.horarioInicio)
      : "",
    horarioFim: grupo?.horarioFim
      ? toDatetimeLocal(grupo.horarioFim)
      : "",
    integranteIds: grupo?.integrantes?.map((i) => i.id) || [],
  });

  // Converte ISO string para o formato aceito pelo input datetime-local
  function toDatetimeLocal(isoString) {
    return new Date(isoString).toISOString().slice(0, 16);
  }

  useEffect(() => {
    async function carregar() {
      try {
        const [resTurmas, resLocais] = await Promise.all([
          listarTurmas(),
          listarLocais(),
        ]);
        setTurmas(resTurmas);
        setLocais(resLocais);

        // Se estiver editando, popula professores e alunos da turma atual
        if (grupo?.turma?.id) {
          const turma = resTurmas.find((t) => t.id === grupo.turma.id);
          if (turma) {
            setProfessores(turma.professores || []);
            setAlunos(turma.alunos || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Ao trocar de turma, atualiza semestre, professores e alunos automaticamente
  function handleTurmaChange(e) {
    const turmaId = Number(e.target.value);
    const turma = turmas.find((t) => t.id === turmaId);

    setFormData((prev) => ({
      ...prev,
      turmaId: turmaId || "",
      semestreId: turma?.semestre?.id || "",
      semestreNome: turma?.semestre?.nome || "",
      professorOrientadorId: "",
      integranteIds: [],
    }));

    setProfessores(turma?.professores || []);
    setAlunos(turma?.alunos || []);
  }

  function handleIntegrantesChange(e) {
    const selecionados = Array.from(e.target.selectedOptions).map((o) =>
      Number(o.value)
    );
    setFormData((prev) => ({ ...prev, integranteIds: selecionados }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formData.integranteIds.length < 3 || formData.integranteIds.length > 7) {
      alert("Selecione entre 3 e 7 integrantes.");
      return;
    }

    onSalvar({
      nome: formData.nome,
      descricao: formData.descricao,
      turmaId: Number(formData.turmaId),
      semestreId: Number(formData.semestreId),
      professorOrientadorId: Number(formData.professorOrientadorId),
      localId: Number(formData.localId),
      horarioInicio: new Date(formData.horarioInicio).toISOString(),
      horarioFim: new Date(formData.horarioFim).toISOString(),
      integranteIds: formData.integranteIds,
    });
  }

  if (carregando) {
    return <div className="grupo-form-container"><p>Carregando...</p></div>;
  }

  return (
    <div className="grupo-form-container">
      <div className="grupo-form-header">
        <h1>{grupo ? "Editar Projeto" : "Novo Projeto"}</h1>
      </div>

      <form className="grupo-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome do Projeto</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="descricao"
            rows="4"
            value={formData.descricao}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Turma</label>
            <select
              name="turmaId"
              value={formData.turmaId}
              onChange={handleTurmaChange}
              required
            >
              <option value="">Selecione</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Semestre</label>
            <input
              type="text"
              value={formData.semestreNome || "Selecione uma turma"}
              readOnly
              style={{ background: "#f3f4f6", cursor: "not-allowed" }}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Professor Orientador</label>
            <select
              name="professorOrientadorId"
              value={formData.professorOrientadorId}
              onChange={handleChange}
              required
              disabled={!formData.turmaId}
            >
              <option value="">Selecione</option>
              {professores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Local</label>
            <select
              name="localId"
              value={formData.localId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {locais.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.numero}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>
            Integrantes{" "}
            <span style={{ color: "#6b7280", fontSize: 12 }}>
              (selecione entre 3 e 7 — use Ctrl/Cmd para múltiplos)
            </span>
          </label>
          <select
            multiple
            value={formData.integranteIds.map(String)}
            onChange={handleIntegrantesChange}
            disabled={!formData.turmaId}
            size={Math.max(4, alunos.length)}
            required
          >
            {alunos.length === 0 ? (
              <option disabled>Selecione uma turma primeiro</option>
            ) : (
              alunos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.username}
                </option>
              ))
            )}
          </select>
          <small style={{ color: "#6b7280" }}>
            {formData.integranteIds.length} selecionado(s)
          </small>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Horário Início</label>
            <input
              type="datetime-local"
              name="horarioInicio"
              value={formData.horarioInicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Horário Fim</label>
            <input
              type="datetime-local"
              name="horarioFim"
              value={formData.horarioFim}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onVoltar}>
            Voltar
          </button>
          <button type="submit">Salvar Projeto</button>
        </div>
      </form>
    </div>
  );
}