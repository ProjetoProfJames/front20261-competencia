export default function PeriodoLetivoSection({
  saving,
  semestreForm,
  semestres,
  setSemestreForm,
  onCancel,
  onDelete,
  onEdit,
  onSubmit,
}) {
  return (
    <section className="entity-panel">
      <div className="panel-heading">
        <h2>Periodos letivos</h2>
        <span>{semestres.length} registros</span>
      </div>

      <form className="entity-form compact-form" onSubmit={onSubmit}>
        <label>
          Nome
          <input
            type="text"
            value={semestreForm.nome}
            onChange={(event) => setSemestreForm({ ...semestreForm, nome: event.target.value })}
            maxLength={120}
            placeholder="2026/1"
            required
          />
        </label>

        <label>
          Inicio
          <input
            type="date"
            value={semestreForm.dataInicio}
            onChange={(event) => setSemestreForm({ ...semestreForm, dataInicio: event.target.value })}
            required
          />
        </label>

        <label>
          Fim
          <input
            type="date"
            value={semestreForm.dataFim}
            onChange={(event) => setSemestreForm({ ...semestreForm, dataFim: event.target.value })}
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={saving === "semestre"}>
            {semestreForm.id ? "Salvar periodo" : "Cadastrar periodo"}
          </button>
          {semestreForm.id && (
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
              <th>Periodo</th>
              <th>Inicio</th>
              <th>Fim</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {semestres.map((semestre) => (
              <tr key={semestre.id}>
                <td>{semestre.nome}</td>
                <td>{semestre.dataInicio}</td>
                <td>{semestre.dataFim}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => onEdit(semestre)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => onDelete(semestre)}>
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
