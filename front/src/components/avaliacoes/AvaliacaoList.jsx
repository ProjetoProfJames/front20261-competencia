"use client";

export default function AvaliacaoList({
  avaliacoes = [],
  onNovo,
  onEditar,
  loading,
}) {
  return (
    <div className="avaliacao-list">
      <div className="avaliacao-header">
        <h1>Avaliações</h1>
        <button onClick={onNovo}>Nova Avaliação</button>
      </div>

      {loading ? (
        <p>Carregando avaliações...</p>
      ) : avaliacoes.length === 0 ? (
        <p>Nenhuma avaliação encontrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Nota</th>
              <th>Comentário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map((a) => (
              <tr key={a.id}>
                <td>{a.projeto?.nome || "-"}</td>
                <td>{a.nota}</td>
                <td>{a.comentario || "-"}</td>
                <td>
                  <button onClick={() => onEditar(a)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}