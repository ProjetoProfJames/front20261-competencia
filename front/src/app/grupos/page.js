"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import API from "@/utils/api";

export default function TelaListagemGrupos() {
  const [listaDeGrupos, setListaDeGrupos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregarDadosDoBackend = async () => {
    try {
      const dados = await API.get("/projetos");
      setListaDeGrupos(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.warn("Nenhuns dados de grupos foram encontrados no servidor.");
      setListaDeGrupos([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDadosDoBackend();
  }, []);

  const executarExclusaoGrupo = async (idGrupo) => {
    if (!confirm("Confirma a remocao definitiva deste grupo?")) return;
    try {
      await API.del(`/projetos/${idGrupo}`);
      carregarDadosDoBackend();
    } catch (erro) {
      alert(erro.message || "Nao foi possivel remover o registro.");
    }
  };

  const dadosFiltrados = listaDeGrupos.filter((item) => {
    const texto = termoPesquisa.toLowerCase();
    return (
      item.nome?.toLowerCase().includes(texto) ||
      item.professorOrientador?.username?.toLowerCase().includes(texto) ||
      item.turma?.nome?.toLowerCase().includes(texto) ||
      item.integrantes?.some((i) => i.username?.toLowerCase().includes(texto))
    );
  });

  const formatarInstant = (instant) => {
    if (!instant) return "N/D";
    return new Date(instant).toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Gerenciamento de Grupos</h2>

      <div style={{ marginBottom: "25px", display: "flex", gap: "15px" }}>
        <input
          type="text"
          placeholder="Buscar por nome, orientador, turma ou integrante..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          style={{ padding: "10px", width: "350px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <Link href="/grupos/novo">
          <Button>Adicionar Novo Grupo</Button>
        </Link>
      </div>

      {carregando ? (
        <div>Carregando registros...</div>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nome do Projeto</th>
              <th>Turma</th>
              <th>Professor Orientador</th>
              <th>Integrantes</th>
              <th>Local e Horário</th>
              <th>Avaliações</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#777" }}>
                  Nenhum grupo encontrado.
                </td>
              </tr>
            ) : (
              dadosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.turma?.nome}</td>
                  <td>{item.professorOrientador?.username}</td>
                  <td>{item.integrantes?.map((i) => i.username).join(", ")}</td>
                    <td>
                        {item.local?.nome}<br />
                        {formatarInstant(item.horarioInicio)} - {formatarInstant(item.horarioFim)}
                      </td>
                      <td>
                        {item.avaliacoes && item.avaliacoes.length > 0 ? (
                          item.avaliacoes.map((av) => (
                            <div key={av.id}>
                              <strong>{av.avaliador?.username}:</strong> {av.nota}
                            </div>
                          ))
                        ) : (
                          <span style={{ color: "#777" }}>Sem avaliações</span>
                        )}
                      </td>
                      <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Link href={`/grupos/editar?id=${item.id}`}>
                        <button style={{ color: "blue", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                          Editar
                        </button>
                      </Link>
                      
                      <Link href={`/grupos/avaliacoes?id=${item.id}`}>
                        <button style={{ color: "#b8860b", cursor: "pointer", background: "none", border: "none", textDecoration: "underline", fontWeight: "bold" }}>
                          Avaliar
                        </button>
                      </Link>
                      <button onClick={() => executarExclusaoGrupo(item.id)} style={{ color: "red", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}