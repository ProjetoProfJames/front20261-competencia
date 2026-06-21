export default function Table({
  headers,
  children,
  emptyMessage = "Sem registros",
  isEmpty = false,
}) {
  return (
    <table border="1" cellPadding="8" cellSpacing="0">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isEmpty ? (
          <tr>
            <td colSpan={headers.length}>{emptyMessage}</td>
          </tr>
        ) : (
          children
        )}
      </tbody>
    </table>
  );
}
