"use client";

import { useState, useEffect } from "react";
import Form from "./_components/form";
import Table from "./_components/table";
import { api } from "../api";
import styles from "./avaliacoes.module.css";

export default function AssessmentPage() {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [editingAssessment, setEditingAssessment] = useState(null);

    const [filterProjetoId, setFilterProjetoId] = useState("");
    const [filterAvaliadorId, setFilterAvaliadorId] = useState("");

    async function fetchAssessments() {
        try {
            setLoading(true);
            setError(null);

            const queryParams = {};
            if (filterProjetoId) queryParams.projetoId = Number(filterProjetoId);
            if (filterAvaliadorId) queryParams.avaliadorId = Number(filterAvaliadorId);

            const response = await api.get("/api/avaliacoes", { params: queryParams });
            
            if (response && response.data) setAssessments(Array.isArray(response.data) ? response.data : [response.data]);
            else setAssessments([]);

        } catch (err) {
            console.error("Erro ao buscar avaliações:", err);
            setError("Não foi possível carregar as avaliações.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchAssessmentById(id) {
        try {
            setLoading(true);
            const response = await api.get(`/api/avaliacoes/${id}`);
            if (response && response.data) {
                setAssessments([response.data]);
            }
        } catch (err) {
            console.error("Erro ao buscar avaliação por ID:", err);
            setError("Avaliação não encontrada.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAssessments();
    }, []);

    const handleSaveAssessment = async (formData) => {
        try {
            if (editingAssessment) {
                const payload = {
                    avaliadorId: formData.avaliadorId,
                    nota: formData.nota,
                    comentario: formData.comentario
                };
                await api.put(`/api/avaliacoes/${editingAssessment.id}`, payload);
                alert("Avaliação atualizada com sucesso!");
                setEditingAssessment(null);
            } else {
                await api.post("/api/avaliacoes", formData);
                alert("Avaliação cadastrada com sucesso!");
            }
            fetchAssessments();
        } catch (err) {
            console.error("Erro ao salvar avaliação:", err);
            alert("Não foi possível salvar a avaliação.");
        }
    };

    const handleDeleteAssessment = async (id) => {
        if (!confirm("Deseja realmente excluir esta avaliação?")) return;
        try {
            await api.delete(`/api/avaliacoes/${id}`);
            alert("Avaliação excluída com sucesso!");
            fetchAssessments();
        } catch (err) {
            console.error("Erro ao deletar avaliação:", err);
            alert("Erro ao remover a avaliação.");
        }
    };

    const handleEditSelect = (assessment) => {
        setEditingAssessment(assessment);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gerenciamento de Avaliações</h1>

            <section className={`${styles.section} ${styles.filters}`}>
                <div className={styles.field}>
                    <label>Filtrar por Projeto ID:</label>
                    <input type="number" value={filterProjetoId} onChange={(e) => setFilterProjetoId(e.target.value)} />
                </div>
                <div className={styles.field}>
                    <label>Filtrar por Avaliador ID:</label>
                    <input type="number" value={filterAvaliadorId} onChange={(e) => setFilterAvaliadorId(e.target.value)} />
                </div>
                <button className={styles.button} onClick={fetchAssessments}>Buscar</button>
            </section>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>{editingAssessment ? `Editando Avaliação #${editingAssessment.id}` : "Nova Avaliação"}</h3>
                <Form onSave={handleSaveAssessment} initialData={editingAssessment} />
                {editingAssessment && (
                    <button className={`${styles.button} ${styles.secondaryButton}`} onClick={() => setEditingAssessment(null)}>
                        Cancelar Edição
                    </button>
                )}
            </section>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Listagem de Avaliações</h3>
                <Table 
                    data={assessments}
                    loading={loading}
                    error={error}
                    onEdit={handleEditSelect}
                    onDelete={handleDeleteAssessment}
                />
            </section>
        </div>
    );
}
