'use client';

import { useEffect, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';

import Menu from '@/components/Menu';

import {
  updateUser,
  getUsers,
} from '@/services/userService';

export default function EditUserPage() {

  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    username: '',
    email: '',
    profile: 'ALUNO',
  });

  async function loadUser() {

    try {

      const response = await getUsers();

      const user = response.data.find(
        (u) => u.id == id
      );

      if (user) {
        setForm({
          username: user.username,
          email: user.email,
          profile: user.profile,
        });
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  function handleChange(e) {

    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  async function handleSubmit() {

    try {

      await updateUser(
        id,
        form
      );

      alert('Usuário atualizado');

      router.push('/users');

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>

      <Menu />

      <h1>Editar Usuário</h1>

      <input
        placeholder='Nome'
        name='username'
        value={form.username}
        onChange={handleChange}
      />

      <input
        placeholder='Email'
        name='email'
        value={form.email}
        onChange={handleChange}
      />

      <select
        name='profile'
        value={form.profile}
        onChange={handleChange}
      >

        <option value='ADMIN'>
          ADMIN
        </option>

        <option value='COORDENADOR'>
          COORDENADOR
        </option>

        <option value='PROFESSOR'>
          PROFESSOR
        </option>

        <option value='ALUNO'>
          ALUNO
        </option>

      </select>

      <button onClick={handleSubmit}>
        Salvar
      </button>

    </div>
  );
}