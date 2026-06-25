"use client";

import { useState, useEffect } from "react";
import { api } from "../../services/api";
import styles from "./avaliacoes.module.css";
export default function AssessmentPage() {
  const [message, setMessage] = useState({ texto: "", tipo: "" });
  const [formData, setFormData] = useState({
    projetoId: "",
    avaliadorId: "",
    nota: "",
    comentario: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvaliar = async (e) => {
    e.preventDefault();
    setMessage({ texto: "", tipo: "" });

    const payload = {
      projetoId: Number(formData.projetoId),
      avaliadorId: Number(formData.avaliadorId),
      nota: Number(formData.nota),
      comentario: formData.comentario
    };

    if (payload.nota < 0 || payload.nota > 10) {
      setMessage({ texto: "A nota deve ser entre 0 e 10.", tipo: "erro" });
      return;
    }

    try {
      await api.post("/api/avaliacoes", payload);
      setMessage({ texto: "Avaliação registrada com sucesso!", tipo: "sucesso" });
      setFormData({ ...formData, nota: "", comentario: "" });
    } catch (err) {
      setMessage({ texto: err.message || "Erro ao registrar avaliação.", tipo: "erro" });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Avaliação de Projeto Integrador</h2>
      
      {message.texto && (
        <div style={{
          padding: "12px",
          borderRadius: "6px",
          marginBottom: "16px",
          fontWeight: "600",
          backgroundColor: message.tipo === "erro" ? "#fef2f2" : "#f0fdf4",
          color: message.tipo === "erro" ? "#dc2626" : "#16a34a",
          border: `1px solid ${message.tipo === "erro" ? "#fee2e2" : "#bbf7d0"}`
        }}>
          {message.texto}
        </div>
      )}
      
      <div className={styles.section}>
        <form onSubmit={handleAvaliar} className={styles.form}>
          
          {/* Grid para ID do Projeto e ID do Avaliador ficarem lado a lado */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className={styles.field}>
              <label>ID do Projeto:</label>
              <input 
                type="number" 
                name="projetoId" 
                required 
                value={formData.projetoId} 
                onChange={handleChange} 
              />
            </div>

            <div className={styles.field}>
              <label>ID do Avaliador:</label>
              <input 
                type="number" 
                name="avaliadorId" 
                required 
                value={formData.avaliadorId} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Nota (0 a 10):</label>
            <input 
              type="number" 
              name="nota" 
              min="0" 
              max="10" 
              step="0.1" 
              required 
              value={formData.nota} 
              onChange={handleChange} 
            />
          </div>

          <div className={styles.field}>
            <label>Comentário / Feedback:</label>
            <input 
              type="text" 
              name="comentario" 
              required 
              value={formData.comentario} 
              onChange={handleChange} 
            />
          </div>

          <div style={{ marginTop: "10px" }}>
            <button type="submit" className={`${styles.button} ${styles.successButton}`}>
              Submeter Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}