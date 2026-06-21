'use client';
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";

export default function SemestresPage() {
  const [semestres, setSemestres] = useState([]);
  const [form, setForm] = useState({ id: null, nome: "", dataInicio: "", dataFim: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSemestres = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/semestres", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const resBody = await response.json();
        setSemestres(resBody.data || resBody || []);
      }
    } catch (err) {
      setError("Erro ao buscar semestres do servidor.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchSemestres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.nome || !form.dataInicio || !form.dataFim) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = form.id ? `/api/semestres/${form.id}` : "/api/semestres";
      const method = form.id ? "PUT" : "POST";

      const payload = {
        nome: form.nome,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim
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
        setSuccessMessage("Semestre salvo com sucesso!");
        setForm({ id: null, nome: "", dataInicio: "", dataFim: "" });
        fetchSemestres();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json();
        setError(resBody.message || "Erro ao salvar o registro no servidor.");
      }
    } catch (err) {
      setError("Falha na comunicação com o servidor.");
    }
  };

  const handleEditar = (semestre) => {
    setForm({
      id: semestre.id,
      nome: semestre.nome || "",
      dataInicio: semestre.dataInicio || "",
      dataFim: semestre.dataFim || ""
    });
  };

  const handleExcluir = async (semestre) => {
    setError("");
    setSuccessMessage("");

    const confirmacao = window.confirm(`Deseja realmente excluir o semestre ${semestre.nome}?`);
    if (!confirmacao) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/semestres/${semestre.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        setSuccessMessage("Registro excluído com sucesso!");
        fetchSemestres();
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        const resBody = await response.json();
        setError(resBody.message || "Não é possível excluir: registro possui vínculos ativos.");
      }
    } catch (err) {
      setError("Erro ao excluir registro.");
    }
  };

  return (
    <div className="container container-flex-layout" style={{ maxWidth: "1000px", width: "100%" }}>
      <h1>Gerenciamento de Períodos Letivos (Semestres)</h1>
      
      <form onSubmit={handleSalvar} className="card form-full-width">
        <h2>{form.id ? "Editar Semestre" : "Novo Semestre"}</h2>
        {error && <div className="alert-message error-box">{error}</div>}
        {successMessage && <div className="alert-message success-box">{successMessage}</div>}
        
        <FormInput label="Nome (ex: 2026/1)" type="text" name="nome" value={form.nome} onChange={handleChange} />
        <FormInput label="Data de Início" type="date" name="dataInicio" value={form.dataInicio} onChange={handleChange} />
        <FormInput label="Data de Fim" type="date" name="dataFim" value={form.dataFim} onChange={handleChange} />
        
        <Button type="submit">Salvar</Button>
      </form>

      <div className="table-scroll-container" style={{ maxHeight: "400px" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Início</th>
              <th>Fim</th>
              <th style={{ width: "200px" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {semestres.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nome}</td>
                <td>{s.dataInicio}</td>
                <td>{s.dataFim}</td>
                <td>
                  <div className="actions-cell">
                    <button onClick={() => handleEditar(s)} className="btn-action edit">Editar</button>
                    <button onClick={() => handleExcluir(s)} className="btn-action delete">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}