'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

import { login } from "@/utils/api";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = async () => {
    setError("");


    const resultado = await login(user.email, user.password);

    if (resultado && resultado.accessToken) {

      router.push('/menu');
    } else {

      setError("E-mail ou senha inválidos.");
    }
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
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

      <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
      <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />

      <Button type="submit" onClick={authenticate}>Login</Button>
      <Button type="button" onClick={() => console.log("Redirecionar para cadastro")}>Cadastrar</Button>
      <Button type="button" onClick={loadBootstrap}>Carregar Bootstrap</Button>
    </div>
  );
}