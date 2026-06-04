
'use client';

export default function Table({ headers, data, actions }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ccc' }}>
          {headers.map((header, index) => (
            <th key={index} style={{ padding: '10px', textAlign: 'left' }}>{header}</th>
          ))}
          {actions && <th style={{ padding: '10px', textAlign: 'left' }}>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length + (actions ? 1 : 0)} style={{ padding: '10px', textAlign: 'center' }}>
              Nenhum registro encontrado.
            </td>
          </tr>
        ) : (
          data.map((item, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: '1px solid #eee' }}>
              {Object.keys(item).map((key, colIndex) => (
                <td key={colIndex} style={{ padding: '10px' }}>{item[key]}</td>
              ))}
              {actions && (
                <td style={{ padding: '10px' }}>
                  {actions(item)}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}