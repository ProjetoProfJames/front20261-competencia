'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { createUser, deleteUser, getStoredAuth, getUsers, updateUser } from "@/lib/api";

const emptyUser = {
  username: "",
  email: "",
  password: "",
  profile: "ADMIN",
};

export default function UsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth] = useState(getStoredAuth);
  const profile = auth?.user?.profile;

  useEffect(() => {
    if (!auth) {
      router.replace("/login");
      return;
    }

    if (!["ADMIN", "PROFESSOR"].includes(profile)) {
      router.replace("/");
      return;
    }

    loadUsers();
  }, [auth, profile, router]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || "Não foi possível carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyUser);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.username || !form.email || (!editingId && !form.password) || form.password.length < 6) {
      setError("Preencha todos os campos com senha mínima de 6 caracteres.");
      return;
    }

    try {
      if (editingId) {
        const payload = {
          username: form.username,
          password: form.password || undefined,
          profile: form.profile,
        };
        await updateUser(editingId, payload);
        setMessage("Usuário atualizado com sucesso.");
      } else {
        await createUser({ ...form, profile: form.profile });
        setMessage("Usuário cadastrado com sucesso.");
      }

      resetForm();
      loadUsers();
    } catch (err) {
      setError(err.message || "Não foi possível salvar o usuário.");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setForm({ username: user.username, email: user.email, password: "", profile: user.profile });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja remover este usuário?")) {
      return;
    }

    try {
      await deleteUser(id);
      setMessage("Usuário removido.");
      loadUsers();
    } catch (err) {
      setError(err.message || "Não foi possível remover o usuário.");
    }
  };

  return (
    <AppShell>
      <section className="card">
        <div className="section-header">
          <div>
            <h2>Usuários</h2>
            <p>Cadastre e edite os usuários do sistema.</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Nome
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            E-mail
            <input name="email" type="email" value={form.email} onChange={handleChange} required disabled={Boolean(editingId)} />
          </label>
          <label>
            Senha
            <input name="password" type="password" value={form.password} onChange={handleChange} required={!editingId} />
          </label>
          <label>
            Perfil
            <select name="profile" value={form.profile} onChange={handleChange}>
              <option value="ADMIN">ADMIN</option>
              <option value="COORDENADOR">COORDENADOR</option>
              <option value="PROFESSOR">PROFESSOR</option>
              <option value="ALUNO">ALUNO</option>
              <option value="AVALIADOR_EXTERNO">AVALIADOR_EXTERNO</option>
            </select>
          </label>
          <div className="actions-row">
            <button type="submit" className="primary-button">{editingId ? "Salvar" : "Cadastrar"}</button>
            <button type="button" className="ghost-button" onClick={resetForm}>Limpar</button>
          </div>
        </form>

        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {loading ? <p>Carregando...</p> : null}

        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
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
                  <button type="button" className="ghost-button" onClick={() => handleEdit(user)}>
                    Editar
                  </button>
                  <button type="button" className="ghost-button" onClick={() => handleDelete(user.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
