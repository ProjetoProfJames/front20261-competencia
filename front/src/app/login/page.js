'use client';
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const extractedName = form.email.split('@')[0];

      const response = await fetch("/api/auth/login", {
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
    <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <form onSubmit={handleLogin} className="card" style={{ margin: "0", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        <FormInput label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} />

        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}