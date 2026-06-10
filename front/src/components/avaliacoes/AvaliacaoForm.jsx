"use client";

import { useState } from "react";

export default function AvaliacaoForm({
  avaliacao,
  onVoltar,
  onSalvar,
  projetos = [],
  avaliadores = [],
}) {
  const [formData, setFormData] = useState({
    projetoId: avaliacao?.projeto?.id || "",
    avaliadorId: avaliacao?.avaliador?.id || "",
    nota: avaliacao?.nota || "",
    comentario: avaliacao?.comentario || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSalvar({
      projetoId: Number(formData.projetoId),
      avaliadorId: Number(formData.avaliadorId),
      nota: Number(formData.nota),
      comentario: formData.comentario,
    });
  }

  return (
    <div className="avaliacao-form-container">
      <h1>{avaliacao ? "Editar Avaliação" : "Nova Avaliação"}</h1>

      <form onSubmit={handleSubmit} className="avaliacao-form">
        <select
          name="projetoId"
          value={formData.projetoId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um projeto</option>
          {projetos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        <select
          name="avaliadorId"
          value={formData.avaliadorId}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um avaliador</option>
          {avaliadores.map((a) => (
            <option key={a.id} value={a.id}>
              {a.username}
            </option>
          ))}
        </select>

        <div className="nota-wrapper">
          <input
            name="nota"
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="Nota"
            value={formData.nota}
            onChange={handleChange}
            required
          />
          <span className="nota-hint">0 – 10</span>
        </div>

        <textarea
          name="comentario"
          placeholder="Comentário"
          value={formData.comentario}
          onChange={handleChange}
          required
        />

        <div className="form-actions">
          <button type="button" onClick={onVoltar}>
            Voltar
          </button>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}