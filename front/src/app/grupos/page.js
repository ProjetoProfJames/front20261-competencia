"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Button";

export default function TelaListagemGrupos() {
  const [listaDeGrupos, setListaDeGrupos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);

  const obterTokenAutenticacao = () => {
    return localStorage.getItem("API-KEY") || "";
  };

  const carregarDadosDoBackend = async () => {
    try {
      const token = obterTokenAutenticacao();
      const resposta = await fetch("http://localhost:8080/api/grupos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setListaDeGrupos(dados);
      } else {
        console.error("Erro ao buscar dados do servidor externo.");
      }
    } catch (erro) {
      console.error("Falha na conexao com a API:", erro);
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
      const token = obterTokenAutenticacao();
      const resposta = await fetch(`http://localhost:8080/api/grupos/${idGrupo}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (resposta.ok) {
        carregarDadosDoBackend();
      } else {
        const mensagemErro = await resposta.text();
        alert(mensagemErro || "Nao foi possivel remover o registro.");
      }
    } catch (erro) {
      alert("Erro ao tentar conectar com o servidor.");
    }
  };

  const dadosFiltrados = listaDeGrupos.filter((item) => {
    const texto = termoPesquisa.toLowerCase();
    return (
      item.componentes?.toLowerCase().includes(texto) ||
      item.professor?.toLowerCase().includes(texto) ||
      item.turma?.toLowerCase().includes(texto) ||
      item.curso?.toLowerCase().includes(texto)
    );
  });

  const formatarDataExibicao = (dataString) => {
    if (!dataString) return "N/D";
    const partes = dataString.split("-");
    if (partes.length !== 3) return dataString;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Gerenciamento de Grupos</h2>
      
      <div style={{ marginBottom: "25px", display: "flex", gap: "15px" }}>
        <input
          type="text"
          placeholder="Buscar por alunos, orientador, turma ou curso..."
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
              <th>Curso / Turma</th>
              <th>Professor Orientador</th>
              <th>Componentes do Grupo</th>
              <th>Data, Local e Horario</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.map((item) => (
              <tr key={item.id}>
                <td>{item.curso} ({item.turma})</td>
                <td>{item.professor}</td>
                <td>{item.componentes}</td>
                <td>
                  {formatarDataExibicao(item.dataApresentacao)} no {item.local} [{item.horarioInicio} - {item.horarioFim}]
                </td>
                <td>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link href={`/grupos/editar?id=${item.id}`}>
                      <button style={{ color: "blue", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                        Editar
                      </button>
                    </Link>
                    <button onClick={() => executarExclusaoGrupo(item.id)} style={{ color: "red", cursor: "pointer", background: "none", border: "none", textDecoration: "underline" }}>
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}