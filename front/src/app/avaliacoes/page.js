'use client';

import { useState, useEffect } from "react";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

export default function AvaliacaoProjeto() {
  const [projetos, setProjetos] = useState([]);
  const [projetoId, setProjetoId] = useState("");
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const fetchProjetos = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8080/api/projetos", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const extractedData = Array.isArray(data) ? data : data?.content || data?.data || [];
          setProjetos(extractedData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjetos();
  }, []);

  const notaNumero = Number(nota);
  const isFormValid =
    projetoId !== "" &&
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
      setErro("Selecione um projeto, informe uma nota entre 0 e 10 e um comentário válido.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/api/projetos/${projetoId}/avaliacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nota: Number(nota),
          comentario: comentario.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar avaliação. Verifique as permissões do seu perfil.");
      }

      setMensagem("Avaliação salva com sucesso!");
      setNota("");
      setComentario("");
      setProjetoId("");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ alignItems: "center", justifyContent: "flex-start" }}>
      <h1 className="title" style={{ marginBottom: "20px" }}>Avaliar Projeto Integrador</h1>

      <form onSubmit={handleSubmit} className="card" style={{ width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "15px", textAlign: "left" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Projeto / Grupo</label>
          <select
            value={projetoId}
            onChange={(e) => setProjetoId(e.target.value)}
            required
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", backgroundColor: "white" }}
          >
            <option value="">Selecione o projeto que deseja avaliar...</option>
            {projetos.map(p => (
              <option key={p.id} value={p.id}>
                {p.turma?.nome} - Orientador: {p.professorOrientador?.nome || p.professorOrientador?.username}
              </option>
            ))}
          </select>
        </div>

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

        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{ fontSize: "14px", fontWeight: "bold", color: "var(--text-color)" }}>Comentário</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={5}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", outline: "none", resize: "vertical" }}
            placeholder="Escreva sua avaliação detalhada..."
            required
          />
        </div>

        {erro && <p style={{ color: "red", fontWeight: "bold", margin: 0 }}>{erro}</p>}
        {mensagem && <p style={{ color: "green", fontWeight: "bold", margin: 0 }}>{mensagem}</p>}

        <Button type="submit" disabled={!isFormValid || loading} style={{ marginTop: "10px", opacity: (!isFormValid || loading) ? 0.6 : 1 }}>
          {loading ? "A Salvar..." : "Salvar Avaliação"}
        </Button>
      </form>
    </div>
  );
}