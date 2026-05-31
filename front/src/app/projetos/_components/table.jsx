'use client';

export default function Table({ dados, carregando, erro }) {
    
    if (carregando) {
        return <p style={{ padding: '10px' }}>Carregando dados da API...</p>;
    }
    
    if (erro) {
        return <p style={{ padding: '10px', color: 'red' }}>{erro}</p>;
    }
    
    if (!dados || dados.length === 0) {
        return <p style={{ padding: '10px' }}>Nenhum registro encontrado.</p>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Id Turma</th>
                    <th>Id Semestre</th>
                    <th>Id Local</th>
                </tr>
            </thead>
            <tbody>
                {dados.map((item) => (
                    <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{item.turma?.id ?? 'N/A'}</td>
                        <td>{item.semestre?.id ?? 'N/A'}</td>
                        <td>{item.local?.id ?? 'N/A'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}