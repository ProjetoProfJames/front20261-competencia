'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import FormInput from '@/components/FormInput';

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const authenticate = async () => {
    try {
      const response = await fetch(
        'http://localhost:8080/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user.email,
            password: user.password,
          }),
        }
      );

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        localStorage.setItem(
          'token',
          data.data.accessToken
        );

        localStorage.setItem(
          'user',
          JSON.stringify(data.data.user)
        );

        alert('Login realizado com sucesso');

        router.push('/dashboard');
      } else {
        alert('Usuário ou senha inválidos');
      }

    } catch (error) {
      console.error(error);

      alert('Erro ao conectar com servidor');
    }
  };

  const loadBootstrap = () => {
    fetch(
      'http://localhost:8080/api/public/bootstrap',
      {
        method: 'POST',
      }
    )
      .then((response) => response.json())
      .then((data) =>
        console.log('Bootstrap carregado:', data)
      )
      .catch((error) =>
        console.error(
          'Erro ao carregar bootstrap:',
          error
        )
      );
  };

  return (
    <div>
      <h1>Login</h1>

      <FormInput
        label='Email'
        type='email'
        name='email'
        value={user.email}
        onChange={handleChange}
      />

      <FormInput
        label='Senha'
        type='password'
        name='password'
        value={user.password}
        onChange={handleChange}
      />

      <Button
        type='button'
        onClick={authenticate}
      >
        Login
      </Button>

      <Button
        type='button'
        onClick={loadBootstrap}
      >
        Carregar Bootstrap
      </Button>
    </div>
  );
}