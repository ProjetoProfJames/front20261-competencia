'use client';

import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = async () => {
    try {
const response = await fetch("http://localhost:8080/api/auth/login", {        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciais inválidas. Verifique seu e-mail e senha.");
      }

     const data = await response.json();

console.log("OBJETO RECEBIDO DO JAVA:", data);

const token = data.data?.accessToken || data.token || data.accessToken;
if (token) {
  localStorage.setItem("token", token);
  alert("Login realizado com sucesso!");
  window.location.href = "/cursos"; 
} else {
  alert("Login efetuado, mas o servidor não enviou o token!");
}

    } catch (error) {
      console.error("Erro na autenticação:", error);
      alert(error.message);
    }
  };

  const loadBootstrap = () => {
  fetch("http://localhost:8080/api/public/bootstrap", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro no servidor ao rodar o Bootstrap.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Bootstrap carregado:", data);
      alert("Bootstrap carregado com sucesso! Os usuários padrão foram criados.");
    })
    .catch((error) => {
      console.error("Erro ao carregar Bootstrap:", error);
      alert("Erro ao rodar o Bootstrap. Como alternativa, você pode rodar esse método diretamente pelo Swagger!");
    });
};

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        
        <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
        <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
        
        <Button type="button" onClick={authenticate}>Entrar</Button>
        
        <div className="login-actions">
          <Button type="button" onClick={() => console.log("Redirecionar para cadastro")}>Cadastrar</Button>
          <Button type="button" onClick={loadBootstrap}>Carregar Bootstrap</Button>
        </div>
      </div>
    </div>
  );
}