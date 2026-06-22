"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [bootstrapMessage, setBootstrapMessage] = useState('');
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      const json = await api.post('/api/auth/login', { email, password });

      if (!json || !json.data) {
        throw new Error('Credenciais inválidas. Verifique os dados inseridos.');
      }
      
      const token = json.data.accessToken;
      const user = json.data.user;
      
      if (user && !user.nome) {
        user.nome = user.username; 
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBootstrap = async () => {
    setError('');
    setBootstrapMessage('');
    setBootstrapLoading(true);

    try {
      await api.post('/api/public/bootstrap');
      setBootstrapMessage('Base de dados carregada com sucesso.');
    } catch (err) {
      setError(err.message || 'Não foi possível carregar a base de dados.');
    } finally {
      setBootstrapLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Acesso ao Sistema</h2>
        {error && <p className="error-message">{error}</p>}
        {bootstrapMessage && <p className="success-message">{bootstrapMessage}</p>}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Entrar</button>
        <button type="button" onClick={handleBootstrap} disabled={bootstrapLoading}>
          {bootstrapLoading ? 'Carregando base...' : 'Carregar base de dados'}
        </button>
      </form>
    </div>
  );
}
