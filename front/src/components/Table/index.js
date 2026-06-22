
export default function Table({ headers = [], isEmpty = false, emptyMessage = "Nenhum registro encontrado", children }) {
  return (
    <table>
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