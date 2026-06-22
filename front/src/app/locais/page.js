"use client";
import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function Locais() {
  const [locais, setLocais] = useState([]);
  const [numero, setNumero] = useState("");
  const [error, setError] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");

  const carregarLocais = async () => {
    try {
      const json = await api.get("/api/locais");
      setLocais(json.data || []);
    } catch (err) {
      setError(err.message || "Falha ao buscar locais");
    }
  };

  useEffect(() => {
    carregarLocais();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setError("");
    setMsgSucesso("");

    if (!numero) {
      setError("O número do local é obrigatório");
      return;
    }

    try {
      await api.post("/api/locais", { numero });

      setMsgSucesso("Local cadastrado com sucesso!");
      setNumero("");
      carregarLocais();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Locais de Apresentação</h2>
      <p>Gerencie os espaços físicos disponíveis para as bancas dos projetos.</p>

      <form onSubmit={handleCadastrar} className="login-form" style={{ margin: "2rem 0", maxWidth: "100%" }}>
        <h3>Novo Local</h3>
        {error && <p className="error-message">{error}</p>}
        {msgSucesso && <p style={{ color: "green", textAlign: "center", fontWeight: "bold" }}>{msgSucesso}</p>}
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Número do Local (Ex: Auditório A ou Sala 204)"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
          />
          <button type="submit" style={{ padding: "0.8rem 2rem" }}>Salvar</button>
        </div>
      </form>

      <h3>Locais Disponíveis</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
          </tr>
        </thead>
        <tbody>
          {locais.map((local) => (
            <tr key={local.id}>
              <td>{local.id}</td>
              <td><strong>{local.numero}</strong></td>
            </tr>
          ))}
          {locais.length === 0 && (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>Nenhum local cadastrado ainda.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
