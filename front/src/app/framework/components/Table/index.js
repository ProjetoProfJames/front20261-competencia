import styles from './Table.module.css'

export default function Table({ columns, data }) {
    return (
        <div className={styles.tableResponsive}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, rowIndex) => (
                        <tr key={item.id || rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex}>
                                    {item[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}