"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError('');

    if (!nome || !email || !senha) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!res.ok) {
        throw new Error('Erro ao cadastrar. Verifique os dados.');
      }

      alert('Cadastro realizado com sucesso! Faça seu login.');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleCadastro} className="login-form">
        <h2>Novo Cadastro</h2>
        {error && <p className="error-message">{error}</p>}
        <div>
          <label>Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button type="submit">Cadastrar</button>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/login" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>
            Já tem conta? Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}