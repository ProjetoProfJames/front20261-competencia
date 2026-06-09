'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Menu from '@/components/Menu';
import { updateUser, getUsers } from '@/services/userService';

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();

  const [loggedUser, setLoggedUser] = useState(null);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    profile: 'ALUNO',
  });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setLoggedUser(parsed);

      if (parsed.profile === 'ADMIN' || parsed.profile === 'PROFESSOR') {
        loadUser();
      } else {
        setEmail(parsed.email);
        setForm({
          username: parsed.username,
          email: parsed.email,
          password: '',
          profile: parsed.profile,
        });
      }
    }
  }, []);

  async function loadUser() {
    try {
      const response = await getUsers();
      const user = response.data.find((u) => u.id == id);
      if (user) {
        setEmail(user.email);
        setForm({
          username: user.username,
          email: user.email,
          password: '',
          profile: user.profile,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit() {
    try {
      const isAdmin = loggedUser?.profile === 'ADMIN';

      if (form.password && form.password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
      }

      if (form.password && form.password.length > 120) {
        alert('A senha deve ter no máximo 120 caracteres.');
        return;
      }

      const payload = isAdmin
        ? {
            username: form.username,
            password: form.password || undefined,
            profile: form.profile,
          }
        : {
            password: form.password,
          };

      await updateUser(id, payload);
      alert('Usuário atualizado');
      router.push('/users');
    } catch (error) {
      console.error(error);
    }
  }

  const isAdmin = loggedUser?.profile === 'ADMIN';

  return (
    <div className='page-wrapper'>
      <Menu />
      <div className='page-content'>
        <div className='form-card'>
          <h1>Editar Usuário</h1>

          {isAdmin ? (
            <>
              <div className='form-group'>
                <label>Nome</label>
                <input
                  placeholder='Nome'
                  name='username'
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              <div className='form-group'>
                <label>Email</label>
                <input
                  placeholder='Email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div className='form-group'>
                <label>Nova Senha <span style={{ color: '#999', fontSize: '12px' }}>(mínimo 6 caracteres)</span></label>
                <input
                  placeholder='Nova Senha'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                />
                <label className='login-checkbox' style={{ marginTop: '8px' }}>
                  <input
                    type='checkbox'
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  Mostrar senha
                </label>
              </div>

              <div className='form-group'>
                <label>Perfil</label>
                <select name='profile' value={form.profile} onChange={handleChange}>
                  <option value='ADMIN'>ADMIN</option>
                  <option value='COORDENADOR'>COORDENADOR</option>
                  <option value='PROFESSOR'>PROFESSOR</option>
                  <option value='ALUNO'>ALUNO</option>
                  <option value='AVALIADOR_EXTERNO'>AVALIADOR_EXTERNO</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className='email-display'>
                Email: {email}
              </div>

              <div className='form-group'>
                <label>Nova Senha <span style={{ color: '#999', fontSize: '12px' }}>(mínimo 6 caracteres)</span></label>
                <input
                  placeholder='Nova Senha'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                />
                <label className='login-checkbox' style={{ marginTop: '8px' }}>
                  <input
                    type='checkbox'
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  Mostrar senha
                </label>
              </div>
            </>
          )}

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