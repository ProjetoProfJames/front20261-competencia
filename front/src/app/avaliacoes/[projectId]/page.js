"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";

export default function AvaliacaoProjeto({ projetoId }) {
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const notaNumero = Number(nota);
  const isFormValid =
    nota !== "" &&
    !Number.isNaN(notaNumero) &&
    notaNumero >= 0 &&
    notaNumero <= 10 &&
    comentario.trim().length >= 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!isFormValid) {
      setErro(
        "Informe uma nota entre 0 e 10 e um comentário com pelo menos 3 caracteres.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/projetos/${projetoId}/avaliacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nota: Number(nota),
          comentario: comentario.trim(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao salvar avaliação");
      }

      setMensagem("Avaliação salva com sucesso.");
      setNota("");
      setComentario("");
    } catch (err) {
      setErro(err.message || "Erro inesperado ao salvar avaliação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-8">
      <h2 className="mb-4 text-2xl font-bold">Avaliar Projeto Integrador</h2>

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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Comentário</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={5}
            className="rounded border border-gray-300 p-3 outline-none focus:border-blue-500"
            placeholder="Escreva sua avaliação..."
            required
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}
        {mensagem && <p className="text-sm text-green-600">{mensagem}</p>}

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`rounded px-4 py-2 text-white ${
            !isFormValid || loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Salvando..." : "Salvar Avaliação"}
        </button>
      </form>
    </div>
  );
}
