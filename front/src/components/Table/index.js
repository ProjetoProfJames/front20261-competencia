'use client';
import { useState } from 'react';
import Button from '@/components/Button';

export default function Table({ data = [], columns = [], onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;

    try {
      const regex = new RegExp(searchTerm, 'i');
      return Object.values(row).some(value => regex.test(String(value)));
    } catch (e) {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  return (
    <div className="table-wrapper">
      
      <div className="input-group">
        <input
          type="text"
          placeholder="Buscar usando texto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.label}</th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{ textAlign: 'center' }}>Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {row[col.key]}
                    </td>
                  ))}

                  {(onEdit || onDelete) && (
                    <td className="table-actions">
                      {onEdit && (
                        <Button type="button" onClick={() => onEdit(row)} className="btn-secondary">
                          Editar
                        </Button>
                      )}
                      {onDelete && (

                        <Button type="button" onClick={() => onDelete(row)} className="btn-danger">
                          Excluir
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
