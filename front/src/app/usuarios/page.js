'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", email: "", senha: "", tipo: "ALUNO" });
  const [error, setError] = useState("");

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/usuarios", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (err) {
      setError("Erro ao buscar usuários do servidor.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nome || !form.email || (!form.id && !form.senha)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/usuarios/${form.id}` : "/api/usuarios";
      const method = form.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha || undefined,
          tipo: form.tipo
        })
      });

      if (response.ok) {
        setForm({ id: null, nome: "", email: "", senha: "", tipo: "ALUNO" });
        fetchUsuarios();
      } else {
        setError("Erro ao salvar o registro no servidor.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (usuario) => {
    setForm({ id: usuario.id, nome: usuario.nome, email: usuario.email, senha: "", tipo: usuario.tipo });
  };

  const handleExcluir = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchUsuarios();
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container">
      <h1>Gerenciamento de Usuários</h1>
      <form onSubmit={handleSalvar} className="card" style={{ maxWidth: "100%", margin: "1rem 0" }}>
        <h2>{form.id ? "Editar Usuário" : "Novo Usuário"}</h2>
        {error && <div className="error-message">{error}</div>}
        <FormInput label="Nome" type="text" name="nome" value={form.nome} onChange={handleChange} />
        <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        {!form.id && <FormInput label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} />}
        <div className="form-group">
          <label>Tipo de Usuário</label>
          <select className="input-field" name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
            <option value="COORDENADOR">Coordenador</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <Button type="submit">{form.id ? "Atualizar" : "Salvar"}</Button>
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem", background: "#fff", border: "1px solid #e2e8f0" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
            <th style={{ padding: "0.75rem" }}>ID</th>
            <th style={{ padding: "0.75rem" }}>Nome</th>
            <th style={{ padding: "0.75rem" }}>Email</th>
            <th style={{ padding: "0.75rem" }}>Tipo</th>
            <th style={{ padding: "0.75rem" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "0.75rem" }}>{u.id}</td>
              <td style={{ padding: "0.75rem" }}>{u.nome}</td>
              <td style={{ padding: "0.75rem" }}>{u.email}</td>
              <td style={{ padding: "0.75rem" }}>{u.tipo}</td>
              <td style={{ padding: "0.75rem" }}>
                <button onClick={() => handleEditar(u)} style={{ marginRight: "0.5rem", background: "none", border: "none", color: "#0284c7", cursor: "pointer", fontWeight: "500" }}>Editar</button>
                <button onClick={() => handleExcluir(u.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "500" }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}