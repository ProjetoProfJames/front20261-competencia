'use client';
import { useState } from "react";
import  Button  from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = () => {
    // Lógica de autenticação aqui
    console.log("Autenticando usuário:", user);
  };

    const loadBootstrap = () => {
        fetch("http://localhost:8080/api/public/bootstrap")
            .then((response) => response.json())
            .then((data) => console.log("Bootstrap carregado:", data))
            .catch((error) => console.error("Erro ao carregar Bootstrap:", error));
    };

  return (
    <div>
      <h1>Login</h1>
      <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
      <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
      <Button type="submit" onClick={authenticate}>Login</Button>
      <Button type="button" onClick={() => console.log("Redirecionar para cadastro")}>Cadastrar</Button>
      <Button type="button" onClick={loadBootstrap}>Carregar Bootstrap</Button>
    </div>
  );
}
