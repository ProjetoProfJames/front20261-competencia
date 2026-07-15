'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LoginPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('API-KEY')) {
      location.href = '/home';
    }
  }, []);

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

  const authenticate = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!validar()) {
      return;
    }

    setLoading(true);
    setMensagem('');

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });

      const obj = await res.json();

      if (!res.ok) {
        throw new Error(obj.message || 'Email ou senha invalido');
      }

      localStorage.setItem('API-KEY', obj.data.accessToken);
      localStorage.setItem('USER', JSON.stringify(obj.data.user));
      location.href = '/home';
    } catch (error) {
      setMensagem(error.message || 'Nao foi possivel conectar ao backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {mensagem && <p>{mensagem}</p>}
      <form onSubmit={authenticate}>
        <FormInput label="Email" type="email" name="email" value={user.email} onChange={handleChange} required />
        <FormInput label="Senha" type="password" name="password" value={user.password} onChange={handleChange} required />
        <Button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
      </form>
    </div>
  );
}
