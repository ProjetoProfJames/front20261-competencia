'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/public/bootstrap", { method: "POST" }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoadBootstrap = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    try {
      const response = await fetch("http://localhost:8080/api/public/bootstrap", { method: "POST" });
      if (response.ok) {
        setInfo("Dados iniciais carregados. Utilize admin@unisales.br para acessar.");
      } else {
        setError("Não foi possível carregar os dados iniciais.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!form.email || !form.senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await fetch("http://localhost:8080/api/public/bootstrap", { method: "POST" }).catch(() => {});

      const extractedName = form.email.split('@')[0];

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: extractedName,
          email: form.email,
          password: form.senha
        })
      });

      const resBody = await response.json();

      if (response.ok) {
        const token = resBody.accessToken || resBody.data?.accessToken;
        const username = resBody.user?.username || resBody.data?.user?.username || extractedName;
        const profile = resBody.user?.profile || resBody.data?.user?.profile || "ALUNO";

        localStorage.setItem("token", token);
        localStorage.setItem("user_display_name", username);
        localStorage.setItem("user_profile", profile);
        window.location.href = "/"; 
      } else {
        setError(resBody.message || "Credenciais inválidas.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-card">
        <div className="login-eyebrow">Acesso ao sistema</div>
        <h1 className="login-title">Bem-vindo</h1>
        <p className="login-subtitle">Preencha as informações de login para acessar o PIE Manager.</p>

        {error && <div className="error-message">{error}</div>}
        {info && <div className="info-message">{info}</div>}

        <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        <FormInput label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} />

        <Button type="submit">Entrar</Button>

        <div className="login-footer">
          Problemas de conexão? <a onClick={handleLoadBootstrap} className="login-footer-link">Carregar Bootstrap</a>
        </div>
      </form>
    </div>
  );
}