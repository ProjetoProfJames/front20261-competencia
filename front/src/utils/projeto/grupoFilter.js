export function filtrarGrupos({
  grupos,
  search,
  getTurma,
  getProfessor,
  getAlunosPorIds,
  getNomeUsuario,
}) {
  return grupos.filter((grupo) => {
    const turma = getTurma(grupo.turmaId);
    const professor = getProfessor(grupo.professorId);
    const alunosGrupo = getAlunosPorIds(grupo.alunos || []);
    const termo = search.trim().toLowerCase();

    if (!termo) return true;

    const campos = [
      grupo.nome,
      turma?.cursoFormatado,
      turma?.periodoFormatado,
      getNomeUsuario(professor),
      grupo.localApresentacao,
      grupo.horarioInicio,
      grupo.horarioFim,
      ...alunosGrupo.map((aluno) => getNomeUsuario(aluno)),
    ];

    return campos.some((valor) =>
      String(valor || "").toLowerCase().includes(termo)
    );
  });
}