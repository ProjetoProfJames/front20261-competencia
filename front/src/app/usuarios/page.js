"use client";
import { useEffect, useState } from "react";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  // Função para buscar os usuários do backend
  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Falha ao buscar usuários");

      const json = await res.json();
      // O backend do professor joga a lista dentro de json.data
      setUsuarios(json.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Função para cadastrar um novo usuário/aluno
  const handleCadastrar = async (e) => {
    e.preventDefault();
    setError("");
    setMsgSucesso("");

    if (!nome || !email || !senha) {
      setError("Preencha todos os campos para cadastrar");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, email, senha, profile: "ALUNO" }),
      });

      if (!res.ok) throw new Error("Erro ao salvar o usuário");

      setMsgSucesso("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      setSenha("");
      carregarUsuarios(); // Atualiza a tabela na hora
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      <p>Cadastre novos alunos e gerencie os acessos do sistema.</p>

      {/* Formulário de Cadastro */}
      <form onSubmit={handleCadastrar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>Novo Usuário</h3>
        {error && <p className="error-message">{error}</p>}
        {msgSucesso && <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>{msgSucesso}</p>}
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <button type="submit" style={{ padding: "0.8rem 2rem" }}>Salvar</button>
        </div>
      </form>

      {/* Tabela de Listagem */}
      <h3>Usuários Cadastrados</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nome || user.username}</td>
              <td>{user.email}</td>
              <td>
                <span style={{
                  background: user.profile === "ADMIN" ? "#ffcccb" : "#e2f0cb",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontWeight: "bold"
                }}>
                  {user.profile}
                </span>
              </td>
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>Nenhum usuário encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}