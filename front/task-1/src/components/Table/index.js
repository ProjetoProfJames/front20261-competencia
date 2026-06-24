'use client';
import styles from './Table.module.css';

export default function Table({ columns, data, onEdit, onDelete, canEdit, canDelete }) {
  if (!data || data.length === 0) {
    return <div className={styles.empty}>Nenhum registro encontrado.</div>;
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className={styles.th}>{col.label}</th>
            ))}
            {(canEdit || canDelete) && <th className={styles.th}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className={styles.tr}>
              {columns.map(col => (
                <td key={col.key} className={styles.td}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
              {(canEdit || canDelete) && (
                <td className={styles.td}>
                  <div className={styles.actions}>
                    {canEdit && (
                      <button className={styles.editBtn} onClick={() => onEdit(row)} title="Editar">✏️</button>
                    )}
                    {canDelete && (
                      <button className={styles.deleteBtn} onClick={() => onDelete(row)} title="Excluir">🗑️</button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
