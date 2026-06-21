"use client";

import { useState } from 'react';
import Modal from './Modal';
import Button from '../Button/Button';

export default function AvaliacaoModal({ grupo, onSave, onClose }) {
  const [nota, setNota] = useState(grupo.nota || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      alert("A nota deve estar entre 0 e 10!");
      return;
    }
    onSave(grupo.id, notaNum);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Avaliação do Projeto">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
            <strong>Grupo:</strong> {grupo.nome}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Nota Final (0 a 10)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            className="form-input"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            required
          />
        </div>

        <div className="form-actions">
          <Button type="submit" variant="success">Salvar Avaliação</Button>
          <Button type="button" variant="danger" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </Modal>
  );
}