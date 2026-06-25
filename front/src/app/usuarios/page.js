'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profile: "ALUNO"
  });

  const fetchUsuarios = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:8080/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((apiResponse) => {
        if (apiResponse && apiResponse.data) {
          setUsuarios(apiResponse.data);
        } else {
          setUsuarios(apiResponse);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (user) => {
    setEditingId(user.id);
    setFormData({
      username: user.username || "",
      email: user.email || "",
      password: "",
      profile: user.profile || "ALUNO"
    });
    setIsFormOpen(true);
  };

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ username: "", email: "", password: "", profile: "ALUNO" });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:8080/api/users/${editingId}` 
      : "http://localhost:8080/api/users";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na requisição.");
        }
        return response.json();
      })
      .then(() => {
        alert(editingId ? "Usuário atualizado com sucesso!" : "Usuário criado com sucesso!");
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ username: "", email: "", password: "", profile: "ALUNO" });
        fetchUsuarios();
      })
      .catch((error) => {
        console.error("Erro no submit:", error);
        alert("Erro ao processar a requisição.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir usuário.");
        }
        return response.json();
      })
      .then(() => {
        alert("Usuário excluído com sucesso!");
        fetchUsuarios();
      })
      .catch((error) => {
        console.error("Erro na exclusão:", error);
        alert("Erro ao excluir usuário.");
      });
  };

  const columns = [
    { header: "Nome de Usuário", accessor: "username" },
    { header: "E-mail", accessor: "email" },
    { header: "Perfil", accessor: "profile" },
    { 
      header: "Ações", 
      render: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="button" onClick={() => handleEditClick(row)}>Editar</Button>
          <Button type="button" onClick={() => handleDelete(row.id)}>Excluir</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <h1 style={{ color: '#333', margin: 0 }}>Gestão de Usuários</h1>
        
        <Button type="button" onClick={handleToggleForm}>
          {isFormOpen ? "Voltar para Lista" : "+ Novo Usuário"}
        </Button>
      </div>
      
      {isFormOpen ? (
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", marginTop: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>
            {editingId ? "Editar Usuário" : "Cadastrar Novo Usuário"}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
            <FormInput label="Nome de Usuário" type="text" name="username" value={formData.username} onChange={handleInputChange} />
            <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} />
            <FormInput label="Senha" type="password" name="password" value={formData.password} onChange={handleInputChange} />
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Perfil</label>
              <select 
                name="profile" 
                value={formData.profile} 
                onChange={handleInputChange} 
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "16px" }}
              >
                <option value="ADMIN">Admin</option>
                <option value="COORDENADOR">Coordenador</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ALUNO">Aluno</option>
                <option value="AVALIADOR_EXTERNO">Avaliador Externo</option>
              </select>
            </div>

            <Button type="submit">{editingId ? "Atualizar Usuário" : "Salvar Usuário"}</Button>
          </form>
        </div>
      ) : (
        loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <Table columns={columns} data={usuarios} />
        )
      )}
    </div>
  );
}