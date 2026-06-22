"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/utils/api";

function TelaAvaliacaoConteudo() {
  const navegador = useRouter();
  const params = useSearchParams();
  const projetoId = params.get("id");

  const [projeto, setProjeto] = useState(null);
  const [listaAvaliacoes, setListaAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [nota, setNota] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregarDados = async () => {
    if (!projetoId) return;
    try {
      const dadosProjeto = await API.get(`/projetos/${projetoId}`);
      setProjeto(dadosProjeto);
      setListaAvaliacoes(dadosProjeto.avaliacoes || []);
    } catch (erro) {
      console.error("Erro ao carregar projeto:", erro.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [projetoId]);

  const enviarAvaliacao = async (evento) => {
    evento.preventDefault();

    const notaNum = parseFloat(nota);
    if (isNaN(notaNum) || notaNum < 0 || notaNum > 10) {
      alert("A nota deve ser um valor entre 0 e 10.");
      return;
    }

    setEnviando(true);
    try {
      await API.post(`/projetos/${projetoId}/avaliacoes`, {
        nota: notaNum,
        comentario: comentario.trim(),
      });
      alert("Avaliação registrada com sucesso!");
      setNota("");
      setComentario("");
      carregarDados();
    } catch (erro) {
      alert(`Erro ao salvar avaliação: ${erro.message}`);
    } finally {
      setEnviando(false);
    }
  };

  const excluirAvaliacao = async (avaliacaoId) => {
    if (!confirm("Confirma a exclusão desta avaliação?")) return;
    try {
      await API.del(`/projetos/${projetoId}/avaliacoes/${avaliacaoId}`);
      carregarDados();
    } catch (erro) {
      alert(erro.message || "Não foi possível excluir a avaliação.");
    }
  };

  if (carregando) return <div style={{ padding: "30px" }}>Carregando...</div>;
  if (!projeto) return <div style={{ padding: "30px" }}>Projeto não encontrado.</div>;

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Avaliar Grupo de Trabalho</h2>

    
      <div style={{ marginBottom: "20px", marginTop: "10px" }}>
        <p style={{ margin: "4px 0" }}><strong>Projeto:</strong> {projeto.nome}</p>
        <p style={{ margin: "4px 0" }}><strong>Turma:</strong> {projeto.turma?.nome}</p>
        <p style={{ margin: "4px 0" }}><strong>Orientador:</strong> {projeto.professorOrientador?.username}</p>
        <p style={{ margin: "4px 0" }}><strong>Integrantes:</strong> {projeto.integrantes?.map((i) => i.username).join(", ")}</p>
      </div>

     
      <form onSubmit={enviarAvaliacao} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Nota (0 a 10):</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            required
            placeholder="Ex: 8.5"
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", width: "150px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Comentário:</label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
            maxLength={2000}
            rows={4}
            placeholder="Descreva sua avaliação..."
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            type="submit"
            disabled={enviando}
            style={{ padding: "12px 20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            {enviando ? "Salvando..." : "Confirmar Avaliação"}
          </button>
          <button
            type="button"
            onClick={() => navegador.push("/grupos")}
            style={{ padding: "12px 20px", backgroundColor: "#ccc", color: "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Cancelar
          </button>
        </div>
      </form>

     
      <h3 style={{ marginTop: "35px" }}>Avaliações Registradas</h3>
      {listaAvaliacoes.length === 0 ? (
        <p style={{ color: "#777" }}>Nenhuma avaliação registrada ainda.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Avaliador</th>
              <th>Nota</th>
              <th>Comentário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaAvaliacoes.map((av) => (
              <tr key={av.id}>
                <td>{av.avaliador?.username}</td>
                <td style={{ textAlign: "center" }}>{av.nota}</td>
                <td>{av.comentario}</td>
                <td>
                  <button
                    onClick={() => excluirAvaliacao(av.id)}
                    style={{ color: "red", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function TelaAvaliacao() {
  return (
    <Suspense fallback={<div style={{ padding: "30px" }}>Carregando...</div>}>
      <TelaAvaliacaoConteudo />
    </Suspense>
  );
}