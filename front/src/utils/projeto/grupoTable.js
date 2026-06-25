import Button from "@/app/framework/components/Button";

export const columns = [
  { label: "Grupo", key: "grupo" },
  { label: "Turma", key: "turma" },
  { label: "Orientador", key: "orientador" },
  { label: "Componentes", key: "componentes" },
  { label: "Apresentação", key: "apresentacao" },
  { label: "Nota", key: "nota" },
  { label: "Ações", key: "acoes" },
];

export function montarTableData({
  grupos,
  getTurma,
  getProfessor,
  getAlunosPorIds,
  getNomeUsuario,
  abrirModalEditarGrupo,
  setGrupoParaAvaliar,
  setNotaAvaliacao,
  handleDelete,
}) {
  return grupos.map((grupo) => {
    const turma = getTurma(grupo.turmaId);
    const professor = getProfessor(grupo.professorId);
    const alunosGrupo = getAlunosPorIds(grupo.alunos || []);

    return {
      id: grupo.id,
      grupo: grupo.nome,
      turma: turma ? `${turma.cursoFormatado} - ${turma.periodoFormatado}` : "-",
      orientador: getNomeUsuario(professor),
      componentes: alunosGrupo.length > 0
        ? alunosGrupo.map((aluno) => getNomeUsuario(aluno)).join(", ")
        : "-",
      apresentacao: (
        <>
          {grupo.localApresentacao || "-"}
          <br />
          {grupo.horarioInicio ? new Date(grupo.horarioInicio).toLocaleString("pt-BR") : ""}
          {grupo.horarioFim ? ` - ${new Date(grupo.horarioFim).toLocaleString("pt-BR")}` : ""}
        </>
      ),
      nota: grupo.nota !== undefined && grupo.nota !== null ? `${grupo.nota}/10` : "-",
      acoes: (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => abrirModalEditarGrupo(grupo)}
          >
            Editar
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setGrupoParaAvaliar(grupo);
              setNotaAvaliacao(grupo.nota || "");
            }}
          >
            Avaliar
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={() => handleDelete(grupo.id)}
          >
            Excluir
          </Button>
        </div>
      ),
    };
  });
}