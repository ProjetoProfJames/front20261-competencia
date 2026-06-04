'use client';
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ id: "", nome: "", email: "", senha: "", tipo: "ALUNO" });
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/usuarios", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `http://localhost:8080/api/usuarios/${form.id}` : "http://localhost:8080/api/usuarios";

    const bodyData = isEditing 
      ? { nome: form.nome, email: form.email, tipo: form.tipo }
      : { nome: form.nome, email: form.email, senha: form.senha, tipo: form.tipo };

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bodyData),
      });
      setForm({ id: "", nome: "", email: "", senha: "", tipo: "ALUNO" });
      setIsEditing(false);
      fetchUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (usuario) => {
    setForm({ id: usuario.id, nome: usuario.nome, email: usuario.email, senha: "", tipo: usuario.tipo });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Gerenciamento de Usuários</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Nome" type="text" name="nome" value={form.nome} onChange={handleChange} />
        <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
        {!isEditing && <FormInput label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} />}
        <div>
          <label>Tipo de Usuário</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} style={{ display: "block", margin: "0.5rem 0" }}>
            <option value="ALUNO">Aluno</option>
            <option value="PROFESSOR">Professor</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
        <Button type="submit">{isEditing ? "Atualizar" : "Salvar"}</Button>
      </form>

      <Table 
        headers={["ID", "Nome", "Email", "Tipo"]} 
        data={usuarios.map(u => ({ id: u.id, nome: u.nome, email: u.email, tipo: u.tipo }))} 
        actions={(item) => (
          <>
            <Button type="button" onClick={() => handleEdit(item)}>Editar</Button>
            <Button type="button" onClick={() => handleDelete(item.id)}>Remover</Button>
          </>
        )}
      />
    </div>
  );
}