"use client";
import { useState } from "react";
import FormInput from "@/components/FormInput";

export default function AvaliacaoProjeto({ projetoId }) {
  const [nota, setNota] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chamada para a API enviando a nota
    console.log(`Nota ${nota} atribuída ao projeto ${projetoId}`);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Avaliar Projeto Integrador</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Nota do Projeto (0 a 10)"
          type="number"
          name="nota"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          min="0"
          max="10"
          step="0.1"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Salvar Avaliação
        </button>
      </form>
    </div>
  );
}
