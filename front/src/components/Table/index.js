export default function DataTable({ colunas, dados, renderAcoes }) {
    return (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    {colunas.map(col => <th key={col.label}>{col.label}</th>)}
                    {renderAcoes && <th>Ações</th>}
                </tr>
            </thead>
            <tbody>
                {dados.map(item => (
                    <tr key={item.id}>
                        {colunas.map(col => <td key={col.label}>{col.render(item)}</td>)}
                        {renderAcoes && <td>{renderAcoes(item)}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
