import { names, selectedValues, userName } from "./utils";

export default function CursoSection({
  coordenadores,
  cursoForm,
  cursos,
  professores,
  saving,
  setCursoForm,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
}) {
  return (
    <section className="entity-panel">
      <div className="panel-heading">
        <h2>Cursos</h2>
        <span>{cursos.length} registros</span>
      </div>

      <form className="entity-form" onSubmit={onSubmit}>
        <label>
          Nome do curso
          <input
            type="text"
            value={cursoForm.nome}
            onChange={(event) => setCursoForm({ ...cursoForm, nome: event.target.value })}
            maxLength={120}
            required
          />
        </label>

        <label>
          Coordenador
          <select
            value={cursoForm.coordenadorId}
            onChange={(event) => setCursoForm({ ...cursoForm, coordenadorId: event.target.value })}
            required
          >
            <option value="">Selecione</option>
            {coordenadores.map((coordenador) => (
              <option key={coordenador.id} value={coordenador.id}>
                {userName(coordenador)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Professores
          <select
            multiple
            value={cursoForm.professorIds}
            onChange={(event) => setCursoForm({ ...cursoForm, professorIds: selectedValues(event) })}
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
          <button type="submit" disabled={saving === "curso"}>
            {cursoForm.id ? "Salvar curso" : "Cadastrar curso"}
          </button>
          {cursoForm.id && (
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
              <th>Curso</th>
              <th>Coordenador</th>
              <th>Professores</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td>{curso.nome}</td>
                <td>{userName(curso.coordenador)}</td>
                <td>{names(curso.professores, "username")}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => onEdit(curso)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => onDelete(curso)}>
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
