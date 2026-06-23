'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", email: "", senha: "", confirmarSenha: "", tipo: "ALUNO" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [userRole, setUserRole] = useState("ALUNO");

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
    const savedRole = localStorage.getItem("user_profile");
    
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      if (payload && payload.sub) {
        setCurrentUserEmail(payload.sub);
      }
    } catch (e) {
      setCurrentUserEmail("");
    }

    if (savedRole) setUserRole(savedRole);
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

    if (!form.nome || !form.email || (!form.id && (!form.senha || !form.confirmarSenha))) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!form.id && form.senha.length < 6) {
      setError("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    if (!form.id && form.senha !== form.confirmarSenha) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    if (userRole === "ALUNO") {
      setError("Permissão negada: Alunos não podem inserir ou modificar registros.");
      return;
    }

    if (!form.id) {
      if (userRole === "COORDENADOR" && form.tipo !== "PROFESSOR" && form.tipo !== "ALUNO") {
        setError("Permissão negada: Coordenadores só podem inserir novos Professores ou Alunos.");
        return;
      }
      if (userRole === "PROFESSOR" && form.tipo !== "ALUNO") {
        setError("Permissão negada: Professores só podem inserir novos Alunos.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/users/${form.id}` : "/api/users";
      const method = form.id ? "PUT" : "POST";

      const payload = {
        name: form.nome,
        username: form.nome,
        email: form.email,
        profile: form.tipo,
        tipo: form.tipo,
        ...(form.id ? {} : { password: form.senha })
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
        setForm({ id: null, nome: "", email: "", senha: "", confirmarSenha: "", tipo: "ALUNO" });
        fetchUsuarios();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Erro retornado pelo servidor ao salvar o registro.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (usuario) => {
    setError("");
    
    if (userRole === "ALUNO") {
      setError("Permissão negada: Alunos não possuem permissão de edição.");
      return;
    }

    if (userRole !== "ADMIN" && usuario.createdBy && usuario.createdBy !== currentUserEmail) {
      setError("Permissão negada: Você só pode editar registros que você mesmo inseriu.");
      return;
    }

    setForm({ 
      id: usuario.id, 
      nome: usuario.username || usuario.name || "", 
      email: usuario.email || "", 
      senha: "", 
      confirmarSenha: "",
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

    if (userRole === "ALUNO") {
      setError("Permissão negada: Alunos não possuem permissão de exclusão.");
      return;
    }

    if (userRole !== "ADMIN" && usuario.createdBy && usuario.createdBy !== currentUserEmail) {
      setError("Permissão negada: Você só pode excluir registros que você mesmo inseriu.");
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
        setError("O servidor negou a exclusão deste registro.");
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container container-flex-layout">
      <h1>Gerenciamento de Usuários</h1>
      
      {userRole !== "ALUNO" && (
        <form onSubmit={handleSalvar} className="card form-full-width">
          <h2>{form.id ? "Editar Usuário" : "Novo Usuário"}</h2>
          {error && <div className="alert-message error-box">{error}</div>}
          {successMessage && <div className="alert-message success-box">{successMessage}</div>}
          <FormInput label="Nome" type="text" name="nome" value={form.nome} onChange={handleChange} />
          <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
          {!form.id && (
            <>
              <FormInput label="Senha" type="password" name="senha" value={form.senha} onChange={handleChange} />
              <FormInput label="Confirmar Senha" type="password" name="confirmarSenha" value={form.confirmarSenha} onChange={handleChange} />
            </>
          )}
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
      )}

      {userRole === "ALUNO" && error && <div className="alert-message error-box" style={{ marginBottom: "1rem" }}>{error}</div>}

      <div className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              {userRole !== "ALUNO" && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const emailTabela = u.email || "";
              const nomeTabela = u.username || u.name || "Não informado";
              const podeModificar = userRole === "ADMIN" || !u.createdBy || u.createdBy === currentUserEmail;

              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{nomeTabela}</td>
                  <td>{emailTabela}</td>
                  <td>{u.profile || u.tipo}</td>
                  {userRole !== "ALUNO" && (
                    <td>
                      <div className="actions-cell">
                        {podeModificar && (
                          <>
                            <button onClick={() => handleEditar(u)} className="btn-action edit">Editar</button>
                            <button onClick={() => handleExcluir(u)} className="btn-action delete">Excluir</button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}