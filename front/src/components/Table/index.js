export default function Table({ columns = [], rows = [], renderRow, emptyMessage = "Nenhum registro encontrado.", loading = false }) {
	return (
		<div className="table-shell">
			<div className="table-scroll">
				<table className="data-table">
					<thead>
						<tr>
							{columns.map((column) => (
								<th key={column}>{column}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={Math.max(columns.length, 1)}>Carregando...</td>
							</tr>
						) : rows.length === 0 ? (
							<tr>
								<td colSpan={Math.max(columns.length, 1)}>{emptyMessage}</td>
							</tr>
						) : (
							rows.map((row, index) => renderRow(row, index))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

