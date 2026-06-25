import { names, selectedValues, userName } from "./utils";

export default function TurmaSection({
  cursos,
  disciplinasDisponiveis,
  professores,
  saving,
  semestres,
  setTurmaForm,
  turmaForm,
  turmas,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
}) {
  return (
    <section className="entity-panel">
      <div className="panel-heading">
        <h2>Turmas</h2>
        <span>{turmas.length} registros</span>
      </div>

      <form className="entity-form turma-form" onSubmit={onSubmit}>
        <label>
          Nome da turma
          <input
            type="text"
            value={turmaForm.nome}
            onChange={(event) => setTurmaForm({ ...turmaForm, nome: event.target.value })}
            maxLength={120}
            required
          />
        </label>

        <label>
          Cursos
          <select
            multiple
            value={turmaForm.cursoIds}
            onChange={(event) =>
              setTurmaForm({ ...turmaForm, cursoIds: selectedValues(event), disciplinaId: "" })
            }
            required
          >
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Disciplina
          <select
            value={turmaForm.disciplinaId}
            onChange={(event) => setTurmaForm({ ...turmaForm, disciplinaId: event.target.value })}
            required
          >
            <option value="">Selecione</option>
            {disciplinasDisponiveis.map((disciplina) => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.nome} ({disciplina.cursoNome})
              </option>
            ))}
          </select>
        </label>

        <label>
          Periodo letivo
          <select
            value={turmaForm.semestreId}
            onChange={(event) => setTurmaForm({ ...turmaForm, semestreId: event.target.value })}
            required
          >
            <option value="">Selecione</option>
            {semestres.map((semestre) => (
              <option key={semestre.id} value={semestre.id}>
                {semestre.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Professores
          <select
            multiple
            value={turmaForm.professorIds}
            onChange={(event) => setTurmaForm({ ...turmaForm, professorIds: selectedValues(event) })}
            required
          >
            {professores.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {userName(professor)}
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button type="submit" disabled={saving === "turma"}>
            {turmaForm.id ? "Salvar turma" : "Cadastrar turma"}
          </button>
          {turmaForm.id && (
            <button type="button" className="secondary-button" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Turma</th>
              <th>Cursos</th>
              <th>Disciplina</th>
              <th>Periodo</th>
              <th>Professores</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((turma) => (
              <tr key={turma.id}>
                <td>{turma.nome}</td>
                <td>{names(turma.cursos)}</td>
                <td>{turma.disciplina?.nome || "-"}</td>
                <td>{turma.semestre?.nome || "-"}</td>
                <td>{names(turma.professores, "username")}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => onEdit(turma)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => onDelete(turma)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
