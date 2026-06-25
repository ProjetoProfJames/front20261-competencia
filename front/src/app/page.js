"use client";

import { useEffect, useState } from "react";
import CrudAcademico from "@/components/CrudAcademico";
import { api } from "@/services/api";

const loginInicial = {
  email: "",
  password: "",
};

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [login, setLogin] = useState(loginInicial);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
  }, []);

  async function autenticar(event) {
    event.preventDefault();
    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      const dados = await api.login(login.email, login.password);
      localStorage.setItem("accessToken", dados.accessToken);
      localStorage.setItem("usuario", JSON.stringify(dados.user));
      setUsuario(dados.user);
      setLogin(loginInicial);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function carregarBootstrap() {
    setLoading(true);
    setErro("");
    setMensagem("");

    try {
      await api.bootstrap();
      setMensagem("Dados iniciais carregados.");
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }

  function sair() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  if (!usuario) {
    return (
      <main className="login-screen">
        <form className="login-box" onSubmit={autenticar}>
          <div>
            <p className="eyebrow">PIE Manager</p>
            <h1>Entrar</h1>
          </div>

          {erro && <p className="alert-error">{erro}</p>}
          {mensagem && <p className="alert-success">{mensagem}</p>}

          <label>
            Email
            <input
              type="email"
              value={login.email}
              onChange={(event) => setLogin({ ...login, email: event.target.value })}
              placeholder="admin@unisales.br"
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={login.password}
              onChange={(event) => setLogin({ ...login, password: event.target.value })}
              placeholder="admin@123"
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar no sistema"}
          </button>
          <button type="button" className="secondary-button" onClick={carregarBootstrap} disabled={loading}>
            Carregar bootstrap
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">PIE Manager</p>
          <strong>{usuario.username || usuario.email}</strong>
          <span>{usuario.profile}</span>
        </div>
        <button type="button" className="secondary-button" onClick={sair}>
          Sair
        </button>
      </header>
      <CrudAcademico />
    </main>
  );
}
