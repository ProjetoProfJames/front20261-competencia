export function getNomeUsuario(usuario) {
  return usuario?.username || usuario?.nome || usuario?.name || usuario?.email || "Sem nome";
}

export function getCursoTurma(turma) {
  if (Array.isArray(turma?.cursos) && turma.cursos.length > 0) {
    return turma.cursos.map((curso) => curso.nome).join(", ");
  }

  return turma?.curso?.nome || turma?.cursoNome || turma?.nome || "Curso não informado";
}

export function getPeriodoTurma(turma) {
  return turma?.semestre?.nome || turma?.periodoLetivo?.nome || turma?.periodo || "Período não informado";
}

export function getSemestreIdTurma(turma) {
  return turma?.semestre?.id || turma?.semestreId || turma?.periodoLetivo?.id || null;
}

export function getNomeTurma(turma) {
  return `${turma?.cursoFormatado || "Curso não informado"} - ${
    turma?.periodoFormatado || "Período não informado"
  }`;
}

export function normalizarTurma(turma) {
  return {
    ...turma,
    id: Number(turma.id),
    cursoFormatado: getCursoTurma(turma),
    periodoFormatado: getPeriodoTurma(turma),
    semestreId: getSemestreIdTurma(turma),
    professores: Array.isArray(turma.professores) ? turma.professores : [],
    alunos: Array.isArray(turma.alunos) ? turma.alunos : [],
  };
}