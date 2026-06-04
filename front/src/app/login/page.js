'use client';
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = async () => {
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha inválidos");
      }

      const resBody = await response.json();
      
      if (resBody && resBody.success && resBody.data) {
        const authData = resBody.data;
        localStorage.setItem("token", authData.accessToken);
        localStorage.setItem("userData", JSON.stringify(authData.user));
        
        window.location.href = "/";
      } else {
        throw new Error("Falha na estrutura de resposta da autenticação.");
      }
    } catch (err) {
      setError("Não foi possível conectar ao servidor de autenticação.");
    }
  };

  return (
    <div className="card">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
      <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
      <Button type="button" onClick={authenticate}>Login</Button>
    </div>
  );
}