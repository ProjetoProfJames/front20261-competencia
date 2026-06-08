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
    setForm({ ...form, [name]: value });
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
    <div className='page-wrapper'>
      <Menu />
      <div className='page-content'>
        <div className='form-card'>
          <h1>Novo Usuário</h1>

          <div className='form-group'>
            <label>Nome</label>
            <input
              placeholder='Nome'
              name='username'
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Email</label>
            <input
              placeholder='Email'
              name='email'
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Senha</label>
            <input
              placeholder='Senha'
              type='password'
              name='password'
              onChange={handleChange}
            />
          </div>

          <div className='form-group'>
            <label>Perfil</label>
            <select name='profile' onChange={handleChange}>
              <option value='ADMIN'>ADMIN</option>
              <option value='COORDENADOR'>COORDENADOR</option>
              <option value='PROFESSOR'>PROFESSOR</option>
              <option value='ALUNO'>ALUNO</option>
              <option value='AVALIADOR_EXTERNO'>AVALIADOR_EXTERNO</option>
            </select>
          </div>

          <div className='form-actions'>
            <button className='btn btn-primary' onClick={handleSubmit}>
              Salvar
            </button>
            <button className='btn btn-outline' onClick={() => router.push('/users')}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}