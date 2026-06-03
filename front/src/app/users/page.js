'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Menu from '@/components/Menu';

import { getUsers, deleteUser } from '@/services/userService';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  async function loadUsers() {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <Menu />

      <h1>Usuários</h1>

      <Link href='/users/create'>
        Novo Usuário
      </Link>

      <table border='1'>
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
                <Link href={`/users/${user.id}`}>
                  Editar
                </Link>

                <button onClick={() => handleDelete(user.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}