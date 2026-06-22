"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../services/api";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const router = useRouter();

  const carregarUsuarios = async () => {
    try {
      const json = await api.get("/api/users");
      setUsuarios(json.data || []);
    } catch (err) {
      setError(err.message || "Falha ao buscar usuários");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    carregarUsuarios();
  }, [router]);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setError("");
    setMsgSucesso("");

    if (!username || !email || !password) {
      setError("Preencha todos os campos para cadastrar");
      return;
    }

    try {
      await api.post("/api/users", { username, email, password, profile: "ALUNO" });

      setMsgSucesso("Usuário cadastrado com sucesso!");
      setUsername("");
      setEmail("");
      setPassword("");
      carregarUsuarios();
    } catch (err) {
      setError(err.message || "Erro ao salvar o usuário");
    }
  };

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      <p>Cadastre novos alunos e gerencie os acessos do sistema.</p>

      <form onSubmit={handleCadastrar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>Novo Usuário</h3>
        {error && <p className="error-message">{error}</p>}
        {msgSucesso && <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>{msgSucesso}</p>}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Nome Completo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <button type="submit" style={{ padding: "0.8rem 2rem" }}>Salvar</button>
        </div>
      </form>

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