"use client";
import { useEffect, useState } from "react";

export default function Locais() {
  const [locais, setLocais] = useState([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [error, setError] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  // Busca os locais cadastrados no backend
  const carregarLocais = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/locais", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Falha ao buscar locais");
      const json = await res.json();
      setLocais(json.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    carregarLocais();
  }, []);

  // Cadastra um novo local (Ex: Auditório, Laboratório 3)
  const handleCadastrar = async (e) => {
    e.preventDefault();
    setError("");
    setMsgSucesso("");

    if (!nome) {
      setError("O nome do local é obrigatório");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/locais", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, descricao }),
      });

      if (!res.ok) throw new Error("Erro ao salvar o local");

      setMsgSucesso("Local cadastrado com sucesso!");
      setNome("");
      setDescricao("");
      carregarLocais(); // Atualiza a tabela na hora
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Locais de Apresentação</h2>
      <p>Gerencie os espaços físicos disponíveis para as bancas dos projetos.</p>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleCadastrar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>Novo Local</h3>
        {error && <p className="error-message">{error}</p>}
        {msgSucesso && <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>{msgSucesso}</p>}
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Nome do Local (Ex: Auditório A)"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <input
            type="text"
            placeholder="Descrição / Bloco (Ex: Bloco B, 2º Andar)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ flex: 2, minWidth: "200px" }}
          />
          <button type="submit" style={{ padding: "0.8rem 2rem" }}>Salvar</button>
        </div>
      </form>

      {/* Tabela de Listagem */}
      <h3>Locais Disponíveis</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do Local</th>
            <th>Descrição / Bloco</th>
          </tr>
        </thead>
        <tbody>
          {locais.map((local) => (
            <tr key={local.id}>
              <td>{local.id}</td>
              <td><strong>{local.nome}</strong></td>
              <td>{local.descricao || "Sem descrição"}</td>
            </tr>
          ))}
          {locais.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>Nenhum local cadastrado ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}