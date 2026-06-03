'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import Menu from '@/components/Menu';

import { createUser } from '@/services/userService';

export default function CreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    profile: 'ALUNO',
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit() {
    try {
      await createUser(form);

      router.push('/users');

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Menu />

      <h1>Novo Usuário</h1>

      <input
        placeholder='Nome'
        name='username'
        onChange={handleChange}
      />

      <input
        placeholder='Email'
        name='email'
        onChange={handleChange}
      />

      <input
        placeholder='Senha'
        type='password'
        name='password'
        onChange={handleChange}
      />

      <select
        name='profile'
        onChange={handleChange}
      >
        <option value='ADMIN'>ADMIN</option>
        <option value='COORDENADOR'>COORDENADOR</option>
        <option value='PROFESSOR'>PROFESSOR</option>
        <option value='ALUNO'>ALUNO</option>
      </select>

      <button onClick={handleSubmit}>
        Salvar
      </button>
    </div>
  );
}