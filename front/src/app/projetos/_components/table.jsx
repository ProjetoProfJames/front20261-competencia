'use client';

import styles from "../projetos.module.css";

export default function Table({ typeTable = "project", data, loading, error, onUpdate, onDelete }) {
    
    if (loading) {
        return <p className={styles.message}>Carregando dados da API...</p>;
    }

    if (error) {
        return <p className={`${styles.message} ${styles.error}`}>{error}</p>;
    }
    
    if (!data || data.length === 0) {
        return <p className={styles.message}>Nenhum registro encontrado.</p>;
    }

    return (
        <table className={styles.table}>
            <thead>
                {typeTable === "project" && (
                    <tr>
                        <th>Nome</th>
                        <th>Id Turma</th>
                        <th>Id Semestre</th>
                        <th>Id Local</th>
                        {(onUpdate || onDelete) && <th>Ações</th>}
                    </tr>
                )}
                
                {typeTable === "assessment" && (
                    <tr>
                        <th>Nota</th>
                        <th>Comentário</th>
                        {(onUpdate || onDelete) && <th>Ações</th>}
                    </tr>
                )}

                {typeTable === "member" && (
                    <tr>
                        <th>ID do Aluno</th>
                        <th>Nome</th>
                        {(onUpdate || onDelete) && <th>Ações</th>}
                    </tr>
                )}
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.id}>
                        {typeTable === "project" && (
                            <>
                                <td>{item.nome}</td>
                                <td>{item.turma?.id ?? 'N/A'}</td>
                                <td>{item.semestre?.id ?? 'N/A'}</td>
                                <td>{item.local?.id ?? 'N/A'}</td>
                            </>
                        )}
                        
                        {typeTable === "assessment" && (
                            <>
                                <td>{item.nota}</td>
                                <td>{item.comentario || 'Sem comentário'}</td>
                            </>
                        )}

                        {typeTable === "member" && (
                            <>
                                <td>{item.alunoId || item.id}</td>
                                <td>{item.nome || `Aluno #${item.alunoId || item.id}`}</td>
                            </>
                        )}
                        
                        {(onUpdate || onDelete) && (
                            <td>
                                <div className={styles.tableActions}>
                                {onUpdate && (
                                    <button className={styles.button} onClick={() => onUpdate(item.id, item)}>
                                        Editar
                                    </button>
                                )}
                                {onDelete && (
                                    <button className={`${styles.button} ${styles.dangerButton}`} onClick={() => onDelete(item.id)}>
                                        Excluir
                                    </button>
                                )}
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
