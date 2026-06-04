'use client';
import { useState, useEffect } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Table from "@/components/Table";

export default function LocaisPage() {
  const [locais, setLocais] = useState([]);
  const [form, setForm] = useState({ id: "", nome: "", descricao: "" });
  const [isEditing, setIsEditing] = useState(false);

  const fetchLocais = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/locais", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setLocais(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLocais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `http://localhost:8080/api/locais/${form.id}` : "http://localhost:8080/api/locais";

    try {
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nome: form.nome, descricao: form.descricao }),
      });
      setForm({ id: "", nome: "", descricao: "" });
      setIsEditing(false);
      fetchLocais();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (local) => {
    setForm(local);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/api/locais/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      fetchLocais();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Locais de Apresentação</h1>
      <form onSubmit={handleSubmit}>
        <FormInput label="Nome do Local" type="text" name="nome" value={form.nome} onChange={handleChange} />
        <FormInput label="Descrição" type="text" name="descricao" value={form.descricao} onChange={handleChange} />
        <Button type="submit">{isEditing ? "Atualizar" : "Salvar"}</Button>
      </form>

      <Table 
        headers={["ID", "Nome", "Descrição"]} 
        data={locais.map(l => ({ id: l.id, nome: l.nome, descricao: l.descricao }))} 
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