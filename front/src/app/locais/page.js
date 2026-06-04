'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function LocaisPage() {
  const [locais, setLocais] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", bloco: "", capacidade: "" });
  const [error, setError] = useState("");

  const fetchLocais = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/locais", {
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
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchLocais();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nome || !form.bloco || !form.capacidade) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/locais/${form.id}` : "/api/locais";
      const method = form.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: form.nome,
          bloco: form.bloco,
          capacidade: parseInt(form.capacidade)
        })
      });

      if (response.ok) {
        setForm({ id: null, nome: "", bloco: "", capacidade: "" });
        fetchLocais();
      } else {
        setError("Erro ao salvar o registro no servidor.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (local) => {
    setForm({ id: local.id, nome: local.nome, bloco: local.bloco, capacidade: local.capacidade });
  };

  const handleExcluir = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/locais/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        fetchLocais();
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container">
      <h1>Gerenciamento de Locais de Apresentação</h1>
      <form onSubmit={handleSalvar} className="card" style={{ maxWidth: "100%", margin: "1rem 0" }}>
        <h2>{form.id ? "Editar Local" : "Novo Local"}</h2>
        {error && <div className="error-message">{error}</div>}
        <FormInput label="Nome do Local" type="text" name="nome" value={form.nome} onChange={handleChange} />
        <FormInput label="Bloco" type="text" name="bloco" value={form.bloco} onChange={handleChange} />
        <FormInput label="Capacidade" type="number" name="capacidade" value={form.capacidade} onChange={handleChange} />
        <Button type="submit">{form.id ? "Atualizar" : "Salvar"}</Button>
      </form>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2rem", background: "#fff", border: "1px solid #e2e8f0" }}>
        <thead>
          <tr style={{ background: "#f1f5f9", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
            <th style={{ padding: "0.75rem" }}>ID</th>
            <th style={{ padding: "0.75rem" }}>Nome</th>
            <th style={{ padding: "0.75rem" }}>Bloco</th>
            <th style={{ padding: "0.75rem" }}>Capacidade</th>
            <th style={{ padding: "0.75rem" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {locais.map((l) => (
            <tr key={l.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "0.75rem" }}>{l.id}</td>
              <td style={{ padding: "0.75rem" }}>{l.nome}</td>
              <td style={{ padding: "0.75rem" }}>{l.bloco}</td>
              <td style={{ padding: "0.75rem" }}>{l.capacidade}</td>
              <td style={{ padding: "0.75rem" }}>
                <button onClick={() => handleEditar(l)} style={{ marginRight: "0.5rem", background: "none", border: "none", color: "#0284c7", cursor: "pointer", fontWeight: "500" }}>Editar</button>
                <button onClick={() => handleExcluir(l.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: "500" }}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}