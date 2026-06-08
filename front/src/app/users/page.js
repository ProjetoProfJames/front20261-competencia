'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Menu from '@/components/Menu';
import { getUsers, deleteUser } from '@/services/userService';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null);

  async function loadUsers() {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja excluir este usuário?')) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setLoggedUser(parsed);
      loadUsers();
    }
  }, []);

  const isAdmin = loggedUser?.profile === 'ADMIN';

  return (
    <div className='page-wrapper'>
      <Menu />
      <div className='page-content'>
        <div className='page-header'>
          <h1>Usuários</h1>
          {isAdmin && (
            <Link href='/users/create' className='link-btn'>
              + Novo Usuário
            </Link>
          )}
        </div>

        <div className='table-wrapper'>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.profile}</td>
                  <td>
                    <div className='td-actions'>
                      {(isAdmin || loggedUser?.id == user.id) && (
                        <Link href={`/users/${user.id}`} className='btn-edit'>
                          Editar
                        </Link>
                      )}
                      {isAdmin && (
                        <button className='btn btn-danger' onClick={() => handleDelete(user.id)}>
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}