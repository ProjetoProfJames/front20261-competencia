'use client';
import { useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const validar = () => {
    if (!user.email || !user.password) {
      setMensagem('Preencha email e senha');
      return false;
    }

    if (!user.email.includes('@')) {
      setMensagem('Informe um email valido');
      return false;
    }

    return true;
  }

  const authenticate = () => {
    if (!validar()) {
      return;
    }

    setLoading(true);
    setMensagem('');

    fetch("http://localhost:8080/api/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Email ou senha invalido');
    }).then((obj) => {
      localStorage.setItem('API-KEY', obj.data.accessToken);
      localStorage.setItem('USER', JSON.stringify(obj.data.user));
      location.href = '/home';
    }).catch((error) => {
      setMensagem(error.message);
    }).finally(() => {
      setLoading(false);
    })
  };

  return (
    <div className="login-page">
      <div className="auth-panel">
      <h1>Login</h1>
      {mensagem && <p className="mensagem">{mensagem}</p>}
      <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} />
      <FormInput label="Password" type="password" name="password" value={user.password} onChange={handleChange} />
      <Button type="button" onClick={authenticate} disabled={loading}>{loading ? 'Entrando...' : 'Login'}</Button>
      </div>
    </div>
  );
}
