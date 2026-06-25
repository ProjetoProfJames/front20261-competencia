
function getCellValue(column, row) {
  const value = column.render ? column.render(row) : row[column.key];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return value;
}

export default function Table({
  columns = [],
  rows = [],
  emptyMessage = "Nenhum registro encontrado.",
  renderActions,
  getRowKey,
}) {
  const hasActions = Boolean(renderActions);

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {hasActions && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td className="empty-cell" colSpan={columns.length + (hasActions ? 1 : 0)}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row, index) => (
            <tr key={getRowKey ? getRowKey(row) : row.id || index}>
              {columns.map((column) => (
                <td key={column.key}>{getCellValue(column, row)}</td>
              ))}
              {hasActions && <td>{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
