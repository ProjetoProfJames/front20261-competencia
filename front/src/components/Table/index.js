export default function Table({ columns, data }) {
  if (!data || data.length === 0) {
    return <p style={{ marginTop: "20px", color: "#666" }}>Nenhum registro encontrado.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", fontFamily: "sans-serif" }}>
      <thead>
        <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
          {columns.map((col, index) => (
            <th key={index} style={{ padding: "12px", textAlign: "left", color: "#333" }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} style={{ borderBottom: "1px solid #ddd" }}>
            {columns.map((col, colIndex) => (
              <td key={colIndex} style={{ padding: "12px", color: "#555" }}>
                {col.render ? col.render(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}