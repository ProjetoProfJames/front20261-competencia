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

    console.log("Enviando credenciais para o banco...", user);

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
        console.log("Resposta bruta da API:", apiResponse);

        if (apiResponse && apiResponse.data && apiResponse.data.accessToken) {
          const token = apiResponse.data.accessToken;
          const user = apiResponse.data.user;
          
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          
          console.log("Token JWT armazenado com sucesso!");
          alert("Login realizado com sucesso!");
          router.push("/");
        } else {
          throw new Error("Estrutura de resposta inesperada do servidor.");
        }
      })
      .catch((error) => {
        console.error("Erro na autenticação:", error);
        alert(error.message || "Erro ao conectar com o servidor do backend.");
      });
  };

  const loadBootstrap = () => {
    fetch("http://localhost:8080/api/public/bootstrap", { method: "POST" })
      .then((response) => response.json())
      .then((data) => console.log("Bootstrap carregado:", data))
      .catch((error) => console.error("Erro ao carregar Bootstrap:", error));
  };

  return (
    <div>
      <h1>Login</h1>
      <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
      <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
      
      <Button type="button" onClick={authenticate}>Login</Button>
      <Button type="button" onClick={() => console.log("Redirecionar para cadastro")}>Cadastrar</Button>
      <Button type="button" onClick={loadBootstrap}>Carregar Bootstrap</Button>
    </div>
  );
}