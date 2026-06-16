'use client';

import { useEffect, useState } from "react";
import Table from "@/components/Table";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LocaisPage() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    numero: ""
  });

  const fetchLocais = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:8080/api/locais", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((apiResponse) => {
        if (apiResponse && apiResponse.data) {
          setLocais(apiResponse.data);
        } else {
          setLocais(apiResponse);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocais();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (local) => {
    setEditingId(local.id);
    setFormData({
      numero: local.numero || ""
    });
    setIsFormOpen(true);
  };

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({ numero: "" });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId 
      ? `http://localhost:8080/api/locais/${editingId}` 
      : "http://localhost:8080/api/locais";

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
        alert(editingId ? "Local atualizado com sucesso!" : "Local criado com sucesso!");
        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ numero: "" });
        fetchLocais();
      })
      .catch((error) => {
        console.error("Erro no submit:", error);
        alert("Erro ao processar a requisição.");
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este local?")) return;

    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/locais/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir local.");
        }
        return response.json();
      })
      .then(() => {
        alert("Local excluído com sucesso!");
        fetchLocais();
      })
      .catch((error) => {
        console.error("Erro na exclusão:", error);
        alert("Erro ao excluir local.");
      });
  };

  const columns = [
    { header: "Identificação do Local", accessor: "numero" },
    { header: "Cadastrado por", accessor: "createdBy" },
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
        <h1 style={{ color: '#333', margin: 0 }}>Gestão de Locais</h1>
        
        <Button type="button" onClick={handleToggleForm}>
          {isFormOpen ? "Voltar para Lista" : "+ Novo Local"}
        </Button>
      </div>
      
      {isFormOpen ? (
        <div style={{ backgroundColor: "#f9f9f9", padding: "20px", marginTop: "20px", border: "1px solid #ddd", borderRadius: "5px" }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>
            {editingId ? "Editar Local" : "Cadastrar Novo Local"}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "400px" }}>
            <FormInput label="Identificação do Local (Ex: Sala 204)" type="text" name="numero" value={formData.numero} onChange={handleInputChange} />

            <Button type="submit">{editingId ? "Atualizar Local" : "Salvar Local"}</Button>
          </form>
        </div>
      ) : (
        loading ? (
          <p>Carregando locais...</p>
        ) : (
          <Table columns={columns} data={locais} />
        )
      )}
    </div>
  );
}