'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { login } from "@/utils/api";


export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: ""});
  const [error, setError] = useState("");

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    padding: '20px',
    paddingTop: '60px'
  };

  const formBoxStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    gap: '15px',
    display: 'flex',
    flexDirection: 'column'
  };

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const authenticate = async () => {
    setError("");

    const resultado = await login(user.email, user.password);

    if (resultado && resultado.accessToken) {
      router.push("/menu");
      return;
    }

    setError("E-mail ou senha inválidos.");
  };

  const loadBootstrap = () => {
    fetch("http://localhost:8080/api/public/bootstrap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => console.log("Bootstrap carregado:", data))
      .catch((requestError) =>
        console.error("Erro ao carregar Bootstrap:", requestError)
      );
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <h1>Login</h1>

          <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
          <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />

        <Button type="button" onClick={authenticate}>Login</Button>
        <Button type="button" onClick={loadBootstrap}>Carregar Bootstrap</Button>
      </div>
    </div>
  );
}