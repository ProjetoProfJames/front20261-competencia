import { grupoService } from "@/utils/projeto/api";

export async function salvarGrupo({
  newGrupo,
  editingGrupo,
  getTurma,
  fecharModalGrupo,
  carregarDados,
}) {
  try {
    const turmaSelecionadaSave = getTurma(newGrupo.turmaId);

    if (!turmaSelecionadaSave) {
      alert("Turma selecionada não encontrada.");
      return;
    }

    const professoresDaTurmaSave = turmaSelecionadaSave.professores || [];
    const alunosDaTurmaSave = turmaSelecionadaSave.alunos || [];

    const professorPertenceTurma = professoresDaTurmaSave.some(
      (professor) => Number(professor.id) === Number(newGrupo.professorId)
    );

    if (!professorPertenceTurma) {
      alert("O professor selecionado não pertence à turma escolhida.");
      return;
    }

    const alunosInvalidos = newGrupo.alunos.filter(
      (alunoId) =>
        !alunosDaTurmaSave.some((aluno) => Number(aluno.id) === Number(alunoId))
    );

    if (alunosInvalidos.length > 0) {
      alert("Um ou mais alunos selecionados não pertencem à turma escolhida.");
      return;
    }

    const payload = {
      ...newGrupo,
      id: editingGrupo?.id,
      semestreId: turmaSelecionadaSave.semestreId,
    };

    await grupoService.save(payload);

    fecharModalGrupo();
    await carregarDados();
  } catch (error) {
    console.error(error);
    alert(error.message || "Erro ao salvar grupo.");
  }
}

export function validarSubmitGrupo({ form, turmaSelecionada, handleSave }) {
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

  handleSave({
    ...form,
    turmaId: Number(form.turmaId),
    professorId: Number(form.professorId),
    localId: Number(form.localId),
    semestreId: turmaSelecionada?.semestreId,
    alunos: form.alunos.map(Number),
  });
}

export async function excluirGrupo({
  id,
  grupos,
  carregarDados,
}) {
  const grupo = grupos.find((g) => Number(g.id) === Number(id));

  if (grupo?.nota !== undefined && grupo?.nota !== null) {
    alert("Não é possível excluir grupo já avaliado!");
    return;
  }

  if (confirm("Excluir este grupo?")) {
    try {
      await grupoService.delete(id);
      await carregarDados();
    } catch (error) {
      alert(error.message || "Erro ao excluir grupo.");
    }
  }
}