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

  const authenticate = async () => {
    if (!user.email || !user.password) {
      alert('Preencha o email e a senha.')
      return
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password }),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        alert(data.message || 'Email ou senha inválidos.')
        return
      }
  
      localStorage.setItem('token', data.data.accessToken)
      localStorage.setItem('user', JSON.stringify(data.data.user))
  
      window.location.href = '/projetos'
    } catch (e) {
      alert('Erro ao conectar com o servidor.')
    }
  }

  const loadBootstrap = () => {
    fetch('http://localhost:8080/api/public/bootstrap', { method: 'POST' })
      .then((response) => response.json())
      .then((data) => alert(data.message || 'Bootstrap executado!'))
      .catch(() => alert('Erro ao executar bootstrap.'))
  }

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
