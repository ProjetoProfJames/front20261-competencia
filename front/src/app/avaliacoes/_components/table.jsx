'use client';

import styles from "../avaliacoes.module.css";

export default function Table({ data, loading, error, onEdit, onDelete }) {
    
    if (loading) return <p className={styles.message}>Carregando avaliações...</p>;
    if (error) return <p className={`${styles.message} ${styles.error}`}>{error}</p>;
    if (!data || data.length === 0) return <p className={styles.message}>Nenhuma avaliação encontrada.</p>;

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID Avaliação</th>
                    <th>ID Projeto</th>
                    <th>ID Avaliador</th>
                    <th>Nota</th>
                    <th>Comentário</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.projetoId ?? item.projeto?.id ?? 'N/A'}</td>
                        <td>{item.avaliadorId ?? 'N/A'}</td>
                        <td>{item.nota}</td>
                        <td>{item.comentario || 'Sem comentário'}</td>
                        <td>
                            <button className={styles.button} onClick={() => onEdit(item)}>
                                Editar
                            </button>
                            <button className={`${styles.button} ${styles.dangerButton}`} onClick={() => onDelete(item.id)}>
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
