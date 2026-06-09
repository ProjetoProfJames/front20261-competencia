'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const authenticate = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        router.push('/dashboard');
      } else {
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      alert('Erro ao conectar com servidor');
    }
  };

  const loadBootstrap = () => {
    fetch('http://localhost:8080/api/public/bootstrap', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => console.log('Bootstrap carregado:', data))
      .catch(console.error);
  };

  return (
    <div className='login-wrapper'>
      <div className='login-decoration' />
      <div className='login-decoration2' />

      <div className='login-card'>
        <h1>Faça o seu login</h1>
        <p className='login-subtitle'>PIE Manager — Gestão de Projetos Integradores</p>

        <FormInput
          label='Seu e-mail*'
          type='email'
          name='email'
          value={user.email}
          onChange={handleChange}
        />

        <FormInput
          label='Sua senha*'
          type={showPassword ? 'text' : 'password'}
          name='password'
          value={user.password}
          onChange={handleChange}
        />

        <label className='login-checkbox'>
          <input
            type='checkbox'
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Mostrar senha
        </label>

        <Button type='button' onClick={authenticate}>
          ENTRAR
        </Button>

        <div className='login-footer'>
          <p>Precisa de acesso? <a href='#' onClick={loadBootstrap}>Carregar Bootstrap</a></p>
        </div>
      </div>
    </div>
  );
}