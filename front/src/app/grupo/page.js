"use client";

import { useMemo, useState } from "react";
import FormInput from "@/components/FormInput";

const MIN_ALUNOS = 3;
const MAX_ALUNOS = 7;

export default function CadastroGrupo() {
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [alunosSelecionados, setAlunosSelecionados] = useState(["", "", ""]);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [descricao, setDescricao] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [professorOrientadorId, setProfessorOrientadorId] = useState("");
  const [localId, setLocalId] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");

  const alunosValidos = useMemo(() => {
    return Array.from(
      new Set(alunosSelecionados.map((id) => id.trim()).filter(Boolean)),
    );
  }, [alunosSelecionados]);

  const isFormValid =
    nomeGrupo.trim() !== "" &&
    descricao.trim() !== "" &&
    turmaId !== "" &&
    semestreId !== "" &&
    professorOrientadorId !== "" &&
    localId !== "" &&
    horarioInicio !== "" &&
    horarioFim !== "" &&
    alunosValidos.length >= MIN_ALUNOS &&
    alunosValidos.length <= MAX_ALUNOS;

  const atualizarAluno = (index, value) => {
    setAlunosSelecionados((prev) =>
      prev.map((item, i) => (i === index ? value : item)),
    );
  };

  const adicionarAluno = () => {
    if (alunosSelecionados.length >= MAX_ALUNOS) return;
    setAlunosSelecionados((prev) => [...prev, ""]);
  };

  const removerAluno = (index) => {
    if (alunosSelecionados.length <= MIN_ALUNOS) return;
    setAlunosSelecionados((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!isFormValid) {
      setErro(
        `Informe um nome e selecione entre ${MIN_ALUNOS} e ${MAX_ALUNOS} alunos.`,
      );
      return;
    }

    const payload = {
      nome: nomeGrupo.trim(),
      descricao: descricao.trim(),
      turmaId: Number(turmaId),
      semestreId: Number(semestreId),
      professorOrientadorId: Number(professorOrientadorId),
      integranteIds: alunosValidos.map((id) => Number(id)),
      localId: Number(localId),
      horarioInicio: new Date(horarioInicio).toISOString(),
      horarioFim: new Date(horarioFim).toISOString()
    };

    console.log("Enviando projeto:", payload);

    try {
      const response = await fetch("/api/projetos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSucesso("Projeto criado com sucesso!");
    } catch (err) {
      setErro(`Erro ao criar projeto: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4 p-6">
      <h2 className="text-2xl font-bold">Cadastro de Grupo</h2>

      <FormInput
        label="Nome do Grupo"
        type="text"
        value={nomeGrupo}
        onChange={(e) => setNomeGrupo(e.target.value)}
        required
      />

      <FormInput
        label="Descrição"
        type="text"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
      />

      <FormInput
        label="ID da Turma"
        type="number"
        value={turmaId}
        onChange={(e) => setTurmaId(e.target.value)}
        min="1"
        required
      />

      <FormInput
        label="ID do Semestre"
        type="number"
        value={semestreId}
        onChange={(e) => setSemestreId(e.target.value)}
        min="1"
        required
      />

      <FormInput
        label="ID do Professor Orientador"
        type="number"
        value={professorOrientadorId}
        onChange={(e) => setProfessorOrientadorId(e.target.value)}
        min="1"
        required
      />

      <FormInput
        label="ID do Local"
        type="number"
        value={localId}
        onChange={(e) => setLocalId(e.target.value)}
        min="1"
        required
      />

      <FormInput
        label="Horário de Início"
        type="datetime-local"
        value={horarioInicio}
        onChange={(e) => setHorarioInicio(e.target.value)}
        required
      />

      <FormInput
        label="Horário de Fim"
        type="datetime-local"
        value={horarioFim}
        onChange={(e) => setHorarioFim(e.target.value)}
        required
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Alunos selecionados: {alunosValidos.length} (mín. {MIN_ALUNOS}, máx.{" "}
            {MAX_ALUNOS})
          </span>

          <button
            type="button"
            onClick={adicionarAluno}
            disabled={alunosSelecionados.length >= MAX_ALUNOS}
            className="rounded bg-gray-200 px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Adicionar aluno
          </button>
        </div>

        <div className="space-y-2">
          {alunosSelecionados.map((alunoId, index) => (
            <div key={index} className="flex gap-2">
              <FormInput
                label={`ID do aluno ${index + 1}`}
                type="number"
                value={alunoId}
                onChange={(e) => atualizarAluno(index, e.target.value)}
                min="1"
                required
              />
              <button
                type="button"
                onClick={() => removerAluno(index)}
                disabled={alunosSelecionados.length <= MIN_ALUNOS}
                className="mt-8 rounded bg-red-500 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}
      {sucesso && <p className="text-sm text-green-600">{sucesso}</p>}

      <button
        type="submit"
        disabled={!isFormValid}
        className={`rounded px-4 py-2 text-white ${
          isFormValid
            ? "bg-blue-600 hover:bg-blue-700"
            : "cursor-not-allowed bg-gray-400"
        }`}
      >
        Cadastrar Grupo
      </button>
    </form>
  );
}
