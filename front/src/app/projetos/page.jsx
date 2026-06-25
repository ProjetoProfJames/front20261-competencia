"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../services/api";
import styles from "./projetos.module.css";

export default function ProjectList() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({ turmaId: "", semestreId: "", localId: "" });
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setError("");
      const data = await api.get("/api/projetos", { params: filters });
      setProjects(data || []);
    } catch (err) {
      setError(err.message || "Erro ao buscar projetos.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir o projeto?")) return;
    try {
      setError("");
      await api.delete(`/api/projetos/${id}`);
      fetchProjects();
    } catch (err) {
      setError(err.message || "Erro ao deletar projeto.");
    }
  };

  const newProject = () => {
    router.push("/projetos/novo");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Listagem de Projetos (Grupos)</h2>
      
      {error && <p style={{ color: "#dc2626", fontWeight: "bold", marginBottom: "15px" }}>{error}</p>}
      
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Filtros de Busca</h3>
        <div className={styles.form} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Buscar por Turma (ID):</label>
            <input 
              type="number" 
              value={filters.turmaId}
              onChange={e => setFilters({...filters, turmaId: e.target.value})} 
              style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Buscar por Semestre (ID):</label>
            <input 
              type="number" 
              value={filters.semestreId}
              onChange={e => setFilters({...filters, semestreId: e.target.value})} 
              style={{ width: "100%", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px" }}
            />
          </div>
        </div>

        <div className={styles.actions} style={{ marginTop: "16px", marginBottom: "0" }}>
          <button className={styles.button} onClick={fetchProjects}>
            Buscar
          </button>
          <button className={`${styles.button} ${styles.successButton}`} onClick={newProject}>
            Novo Projeto
          </button>
        </div>
      </div>

      <div className={styles.section} style={{ padding: "0", overflowX: "auto" }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome / Descrição</th>
              <th>Orientador (ID)</th>
              <th>Integrantes (IDs)</th>
              <th>Local (ID)</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                  Nenhum projeto encontrado.
                </td>
              </tr>
            ) : (
              projects.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <strong>{p.nome}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>{p.descricao}</small>
                  </td>
                  <td>{p.professorOrientadorId}</td>
                  <td>{p.integranteIds?.join(", ") || "Sem integrantes"}</td>
                  <td>{p.localId}</td>
                  <td style={{ textAlign: "center" }}>
                    <button 
                      className={`${styles.button} ${styles.dangerButton}`} 
                      onClick={() => handleDelete(p.id)}
                      style={{ padding: "6px 12px", fontSize: "14px" }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}