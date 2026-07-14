"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

const LOGIN_ENDPOINT = "http://localhost:8080/api/auth/login";
const BOOTSTRAP_ENDPOINT = "http://localhost:8080/api/public/bootstrap";

const LoginPage = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [revealPassword, setRevealPassword] = useState(false);
  const [bootstrapStatus, setBootstrapStatus] = useState({ state: "idle", message: "" });

  const onFieldChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const signIn = async () => {
    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      const payload = await res.json();

      if (!res.ok) {
        alert("Usuário ou senha inválidos");
        return;
      }

      localStorage.setItem("token", payload.data.accessToken);
      localStorage.setItem("user", JSON.stringify(payload.data.user));
      router.push("/dashboard");
    } catch (err) {
      alert("Erro ao conectar com servidor");
    }
  };

  const runBootstrap = () => {
    setBootstrapStatus({ state: "loading", message: "" });

    fetch(BOOTSTRAP_ENDPOINT, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        console.log("Bootstrap carregado:", data);
        setBootstrapStatus({ state: "success", message: "Bootstrap carregado com sucesso." });
      })
      .catch((err) => {
        console.error(err);
        setBootstrapStatus({ state: "error", message: "Falha ao carregar o bootstrap." });
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-decoration" />
      <div className="login-decoration2" />

      <div className="login-stack">
        <div className="login-card">
          <h1>Faça o seu login</h1>
          <p className="login-subtitle">PIE Manager — Gestão de Projetos Integradores</p>

          <FormInput
            label="Seu e-mail*"
            type="email"
            name="email"
            value={credentials.email}
            onChange={onFieldChange}
          />

          <FormInput
            label="Sua senha*"
            type={revealPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={onFieldChange}
          />

          <label className="login-checkbox">
            <input
              type="checkbox"
              checked={revealPassword}
              onChange={() => setRevealPassword(!revealPassword)}
            />
            Mostrar senha
          </label>

          <Button type="button" onClick={signIn}>
            ENTRAR
          </Button>
        </div>

        <div className="bootstrap-panel">
          <div className="bootstrap-panel-title">⚠ Configuração inicial</div>
          <p className="bootstrap-panel-desc">
            Ainda não existem dados na base? Carregue o bootstrap para popular o sistema
            com os registros iniciais.
          </p>

          <Button
            type="button"
            variant="warning"
            onClick={runBootstrap}
            disabled={bootstrapStatus.state === "loading"}
          >
            {bootstrapStatus.state === "loading" ? "Carregando..." : "Carregar Bootstrap"}
          </Button>

          {bootstrapStatus.message && (
            <p className={`bootstrap-panel-status ${bootstrapStatus.state}`}>
              {bootstrapStatus.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
