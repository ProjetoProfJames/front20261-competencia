'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", email: "", senha: "", confirmarSenha: "", tipo: "ALUNO" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userRole, setUserRole] = useState("ALUNO");

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/users", {
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

    if (savedRole === "ALUNO" || savedRole === "AVALIADOR_EXTERNO" || savedRole === "COORDENADOR") {
      window.location.href = "/";
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      if (payload) {
        const roleExtraida = payload.profile || payload.role || payload.roles || savedRole || "ALUNO";
        const finalRole = Array.isArray(roleExtraida) ? roleExtraida[0] : roleExtraida;
        setUserRole(finalRole);
      }
    } catch (e) {
      setUserRole("ALUNO");
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

    if (userRole !== "ADMIN") {
      setError("Permissão negada: Seu perfil não pode inserir ou modificar registros.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `http://localhost:8080/api/users/${form.id}` : "http://localhost:8080/api/users";
      const method = form.id ? "PUT" : "POST";

      const payload = form.id
        ? { username: form.nome, profile: form.tipo }
        : { username: form.nome, email: form.email, profile: form.tipo, password: form.senha };

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

    if (userRole !== "ADMIN") {
      setError("Permissão negada: Seu perfil não possui permissão de edição.");
      return;
    }

    setForm({ 
      id: usuario.id, 
      nome: usuario.username || "", 
      email: usuario.email || "", 
      senha: "", 
      confirmarSenha: "",
      tipo: usuario.profile || "ALUNO" 
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

    if (userRole !== "ADMIN") {
      setError("Permissão negada: Seu perfil não possui permissão de exclusão.");
      return;
    }

    const nomeExibicao = usuario.username || emailAlvo;
    const confirmacao = window.confirm(`Deseja realmente excluir o usuário ${nomeExibicao}?`);
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/users/${usuario.id}`, {
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
      
      {userRole === "ADMIN" && (
        <form onSubmit={handleSalvar} className="card form-full-width">
          <h2>{form.id ? "Editar Usuário" : "Novo Usuário"}</h2>
          {error && <div className="alert-message error-box">{error}</div>}
          {successMessage && <div className="alert-message success-box">{successMessage}</div>}
          <FormInput label="Nome" type="text" name="nome" value={form.nome} onChange={handleChange} />
          <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} disabled={!!form.id} />
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
              <option value="AVALIADOR_EXTERNO">Avaliador Externo</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <Button type="submit">{form.id ? "Atualizar" : "Salvar"}</Button>
        </form>
      )}

      {userRole !== "ADMIN" && (
        <div className="alert-message error-box">
          Você pode visualizar os usuários cadastrados, mas apenas o Administrador pode cadastrar, editar ou excluir registros.
        </div>
      )}

      <div className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              {userRole === "ADMIN" && <th>Ações</th>}
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
                  <td>{u.profile}</td>
                  {userRole === "ADMIN" && (
                    <td>
                      <div className="actions-cell">
                        <button onClick={() => handleEditar(u)} className="btn-action edit">Editar</button>
                        <button onClick={() => handleExcluir(u)} className="btn-action delete">Excluir</button>
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