'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", email: "", senha: "", tipo: "ALUNO" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const resBody = await response.json();
        if (resBody && resBody.data && Array.isArray(resBody.data)) {
          setUsuarios(resBody.data);
        } else if (Array.isArray(resBody)) {
          setUsuarios(resBody);
        } else {
          setUsuarios([]);
        }
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
    setSuccessMessage("");

    if (!form.nome || !form.email || (!form.id && !form.senha)) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!form.id && form.senha.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/users/${form.id}` : "/api/users";
      const method = form.id ? "PUT" : "POST";

      const payload = form.id 
        ? {
            name: form.nome,
            username: form.nome,
            email: form.email,
            profile: form.tipo
          }
        : {
            name: form.nome,
            username: form.nome,
            email: form.email,
            password: form.senha,
            profile: form.tipo
          };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSuccessMessage("Registro salvo com sucesso!");
        setForm({ id: null, nome: "", email: "", senha: "", tipo: "ALUNO" });
        fetchUsuarios();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setError("Erro ao salvar o registro no servidor.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (usuario) => {
    setForm({ 
      id: usuario.id, 
      nome: usuario.username || usuario.name || "", 
      email: usuario.email || "", 
      senha: "", 
      tipo: usuario.profile || usuario.tipo || "ALUNO" 
    });
  };

  const handleExcluir = async (usuario) => {
    setError("");
    setSuccessMessage("");

    const emailAlvo = usuario.email || "";

    if (emailAlvo === "admin@unisales.br") {
      setError("Segurança do Sistema: Não é permitido excluir o usuário Administrador master.");
      return;
    }

    const nomeExibicao = usuario.username || emailAlvo;
    const confirmacao = window.confirm(`Deseja realmente excluir o usuário ${nomeExibicao}?`);
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/users/${usuario.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccessMessage("Registro excluído com sucesso!");
        fetchUsuarios();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        setError("Erro ao excluir o registro no servidor.");
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container container-flex-layout">
      <h1>Gerenciamento de Usuários</h1>
      
      <form onSubmit={handleSalvar} className="card form-full-width">
        <h2>{form.id ? "Editar Usuário" : "Novo Usuário"}</h2>
        {error && <div className="alert-message error-box">{error}</div>}
        {successMessage && <div className="alert-message success-box">{successMessage}</div>}
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

      <div className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const emailTabela = u.email || "";
              const nomeTabela = u.username || "Não informado";

              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{nomeTabela}</td>
                  <td>{emailTabela}</td>
                  <td>{u.profile || u.tipo}</td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleEditar(u)} className="btn-action edit">Editar</button>
                      <button onClick={() => handleExcluir(u)} className="btn-action delete">Excluir</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}