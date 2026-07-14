"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Menu from "@/components/Menu";
import { fetchUsers, removeUser } from "@/services/usersApi";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [sessionUser, setSessionUser] = useState(null);

  const reloadUsers = async () => {
    try {
      const { data } = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Deseja excluir este usuário?")) return;
    try {
      await removeUser(id);
      reloadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    setSessionUser(parsed);
    reloadUsers();
  }, []);

  const isAdmin = sessionUser?.profile === "ADMIN";

  return (
    <div className="page-wrapper">
      <Menu />
      <div className="page-content">
        <div className="page-header">
          <h1>Usuários</h1>
          {isAdmin && (
            <Link href="/users/create" className="link-btn">
              + Novo Usuário
            </Link>
          )}
        </div>

        <div className="table-wrapper">
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
                    <div className="td-actions">
                      {(isAdmin || sessionUser?.id == user.id) && (
                        <Link href={`/users/${user.id}`} className="btn-edit">
                          Editar
                        </Link>
                      )}
                      {isAdmin && (
                        <button className="btn btn-danger" onClick={() => onDelete(user.id)}>
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
};

export default UsersPage;
