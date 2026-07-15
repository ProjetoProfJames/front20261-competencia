'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LocaisPage() {
  const [locais, setLocais] = useState([]);
  const [form, setForm] = useState({ id: null, numero: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [userRole, setUserRole] = useState("ALUNO");

  const fetchLocais = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/locais", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const resBody = await response.json();
        if (resBody && resBody.data && Array.isArray(resBody.data)) {
          setLocais(resBody.data);
        } else if (Array.isArray(resBody)) {
          setLocais(resBody);
        } else {
          setLocais([]);
        }
      }
    } catch (err) {
      setError("Erro ao buscar locais do servidor.");
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
    fetchLocais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (userRole === "ALUNO" || userRole === "PROFESSOR") {
      setError("Permissão negada: Professores e Alunos não têm permissão para cadastrar ou modificar locais de apresentação.");
      return;
    }

    if (!form.numero) {
      setError("Por favor, preencha o campo Número do Local.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `http://localhost:8080/api/locais/${form.id}` : "http://localhost:8080/api/locais";
      const method = form.id ? "PUT" : "POST";

      const payload = {
        numero: form.numero
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
        setSuccessMessage("Local salvo com sucesso!");
        setForm({ id: null, numero: "" });
        fetchLocais();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json().catch(() => ({}));
        setError(resBody.message || "Erro ao salvar o registro no servidor.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (local) => {
    setError("");
    
    if (userRole === "ALUNO" || userRole === "PROFESSOR") {
      setError("Permissão negada: Você não possui permissão de edição nesta tela.");
      return;
    }

    if (userRole !== "ADMIN" && userRole !== "COORDENADOR" && local.createdBy && local.createdBy !== currentUserEmail) {
      setError("Permissão negada: Você só pode editar registros que você mesmo inseriu.");
      return;
    }

    setForm({
      id: local.id,
      numero: local.numero || ""
    });
  };

  const handleExcluir = async (local) => {
    setError("");
    setSuccessMessage("");

    if (userRole === "ALUNO" || userRole === "PROFESSOR") {
      setError("Permissão negada: Você não possui permissão de exclusão nesta tela.");
      return;
    }

    if (userRole !== "ADMIN" && userRole !== "COORDENADOR" && local.createdBy && local.createdBy !== currentUserEmail) {
      setError("Permissão negada: Você só pode excluir registros que você mesmo inseriu.");
      return;
    }

    const nomeExibicao = local.numero || `ID ${local.id}`;
    const confirmacao = window.confirm(`Deseja realmente excluir o local ${nomeExibicao}?`);
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/locais/${local.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        setSuccessMessage("Registro excluído com sucesso!");
        fetchLocais();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json().catch(() => ({}));
        setError(resBody.message || "Não é possível excluir: registro possui vínculos ativos.");
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container container-flex-layout" style={{ maxWidth: "1000px", width: "100%" }}>
      <h1>Gerenciamento de Locais de Apresentação</h1>
      
      {userRole !== "ALUNO" && userRole !== "PROFESSOR" && (
        <form onSubmit={handleSalvar} className="card form-full-width" style={{ minHeight: "365px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2>{form.id ? "Editar Local" : "Novo Local"}</h2>
          {error && <div className="alert-message error-box">{error}</div>}
          {successMessage && <div className="alert-message success-box">{successMessage}</div>}
          
          <FormInput label="Número ou Identificação do Local (ex: Sala 102 - Bloco A)" type="text" name="numero" value={form.numero} onChange={handleChange} />
          
          <Button type="submit">Salvar</Button>
        </form>
      )}

      {(userRole === "ALUNO" || userRole === "PROFESSOR") && (
        <div className="alert-message error-box" style={{ marginBottom: "1rem", width: "100%", maxWidth: "1000px" }}>
          Permissão negada: Professores e Alunos não têm permissão para cadastrar, editar ou excluir locais de apresentação.
        </div>
      )}

      <div className="table-scroll-container" style={{ maxHeight: "315px", overflowY: "auto", width: "100%" }}>
        <table className="data-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: "80px" }}>ID</th>
              <th>Local / Número</th>
              {userRole !== "ALUNO" && userRole !== "PROFESSOR" && <th style={{ width: "200px" }}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {locais.map((l) => {
              const nomeTabela = l.numero || "Não informado";
              const podeModificar = userRole === "ADMIN" || userRole === "COORDENADOR" || !l.createdBy || l.createdBy === currentUserEmail;

              return (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{nomeTabela}</td>
                  {userRole !== "ALUNO" && userRole !== "PROFESSOR" && (
                    <td>
                      <div className="actions-cell">
                        {podeModificar && (
                          <>
                            <button onClick={() => handleEditar(l)} className="btn-action edit">Editar</button>
                            <button onClick={() => handleExcluir(l)} className="btn-action delete">Excluir</button>
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