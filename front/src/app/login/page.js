'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = () => {
    if (!user.email || !user.password) {
      alert("Por favor, preencha o e-mail e a senha.");
      return;
    }

    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("E-mail ou senha inválidos.");
        }
        return response.json();
      })
      .then((apiResponse) => {
        if (apiResponse && apiResponse.data && apiResponse.data.accessToken) {
          const token = apiResponse.data.accessToken;
          const userData = apiResponse.data.user;
          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));
          
          alert("Login realizado com sucesso!");
          router.push("/");
        } else {
          throw new Error("Estrutura de resposta inesperada do servidor.");
        }
      })
      .catch((error) => {
        alert(error.message || "Erro ao conectar com o servidor do backend.");
      });
  };

  return (
    <div className="container">
      <div className="card" style={{ width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "20px", padding: "40px 30px" }}>
        <h1 className="title" style={{ fontSize: "2rem", marginBottom: "10px", textAlign: "center" }}>Login</h1>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
          <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
        </div>
        
        <Button type="button" onClick={authenticate} style={{ marginTop: "10px" }}>Entrar no Sistema</Button>
      </div>
    </div>
  );
}