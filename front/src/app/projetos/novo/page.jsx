"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../services/api";
import styles from "../projetos.module.css";

export default function NovoProjeto() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    turmaId: "",
    semestreId: "",
    professorOrientadorId: "",
    integranteIds: "",
    localId: "",
    horarioInicio: "",
    horarioFim: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatarDataParaBackend = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const alunosArray = formData.integranteIds
      .split(",")
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id));

    if (alunosArray.length < 3 || alunosArray.length > 7) {
      setError("O grupo deve possuir entre 3 e 7 alunos componentes.");
      return;
    }

    const payload = {
      nome: formData.nome,
      descricao: formData.descricao,
      turmaId: Number(formData.turmaId),
      semestreId: Number(formData.semestreId),
      professorOrientadorId: Number(formData.professorOrientadorId),
      integranteIds: alunosArray,
      localId: Number(formData.localId),
      horarioInicio: formatarDataParaBackend(formData.horarioInicio),
      horarioFim: formatarDataParaBackend(formData.horarioFim)
    };

    try {
      await api.post("/api/projetos", payload);
      setSuccess("Grupo de projeto cadastrado com sucesso!");
      setTimeout(() => {
        router.push("/projetos");
      }, 1500);
    } catch (err) {
      setError(err.message || "Erro ao cadastrar projeto. Verifique os dados.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Cadastrar Grupo de Projeto</h2>
      
      {error && <p style={{ color: "#dc2626", fontWeight: "bold", marginBottom: "15px" }}>{error}</p>}
      {success && <p style={{ color: "#16a34a", fontWeight: "bold", marginBottom: "15px" }}>{success}</p>}

      <div className={styles.section}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Nome do Projeto:</label>
            <input type="text" name="nome" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Descrição:</label>
            <input type="text" name="descricao" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Turma (ID):</label>
              <input type="number" name="turmaId" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Semestre (ID):</label>
              <input type="number" name="semestreId" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Professor Orientador (ID):</label>
            <input type="number" name="professorOrientadorId" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Alunos (IDs separados por vírgula. Ex: 1, 2, 3):</label>
            <input type="text" name="integranteIds" required onChange={handleChange} placeholder="Mínimo 3, Máximo 7" style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Local de Apresentação (ID):</label>
            <input type="number" name="localId" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Horário de Início:</label>
              <input type="datetime-local" name="horarioInicio" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Horário de Fim:</label>
              <input type="datetime-local" name="horarioFim" required onChange={handleChange} style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }} />
            </div>
          </div>

          <div className={styles.actions} style={{ marginTop: "12px" }}>
            <button type="submit" className={`${styles.button} ${styles.successButton}`}>
              Salvar Grupo
            </button>
            <button 
              type="button" 
              className={`${styles.button} ${styles.dangerButton}`} 
              onClick={() => router.push("/projetos")}
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}