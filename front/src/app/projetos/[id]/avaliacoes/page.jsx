"use client";

import { useState, useEffect, use } from "react";
import Form from "../../_components/form";
import Table from "../../_components/table";
import { api } from "@/services/api";
import styles from "../../projetos.module.css";

export default function AssessmentPage({ params }) {
    const { id: projectId } = use(params);

    const [assessmentList, setAssessmentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const log = (message, exception) => {
        console.log(message, exception);
        setError(message);
    }

    async function fetchAssessments() {
        try {
            setLoading(true);
            setError(null);
            
            const response = await api.get(`/api/projetos/${projectId}/avaliacoes`);
            
            if (response && response.data) setAssessmentList(response.data);
            else setAssessmentList([]);

        } catch (err) {
            log("Não foi possível carregar os dados: ", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (projectId) {
            fetchAssessments();
        }
    }, [projectId]);

    const handleCreateAssessment = async (newAssessment) => {
        try {
            const payload = {
                nota: Number(newAssessment.nota),
                comentario: newAssessment.comentario
            };

            const response = await api.post(`/api/projetos/${projectId}/avaliacoes`, payload);

            console.log(`Resposta do servidor =>`, response);
            alert("Avaliação cadastrada com sucesso!");
            
            fetchAssessments();
            
        } catch (err) {
            log("Não foi possível cadastrar os dados: ", err);
        }
    };

    const handleUpdateAssessment = async (assessmentId, updatedData) => {
        try {
            setError(null);
            
            const payload = {
                nota: Number(updatedData.nota),
                comentario: updatedData.comentario
            };

            const response = await api.put(`/api/projetos/${projectId}/avaliacoes/${assessmentId}`, payload);

            console.log(`Resposta do servidor (PUT) =>`, response);
            alert("Avaliação atualizada com sucesso!");
            
            fetchAssessments();
            
        } catch (err) {
            log("Não foi possível atualizar os dados: ", err);
            alert("Erro ao atualizar a avaliação.");
        }
    };

    const handleDeleteAssessment = async (assessmentId) => {
        if (!confirm("Tem certeza que deseja excluir esta avaliação?")) return;

        try {
            setError(null);

            const response = await api.delete(`/api/projetos/${projectId}/avaliacoes/${assessmentId}`);

            console.log(`Resposta do servidor (DELETE) =>`, response);
            alert("Avaliação deletada com sucesso!");
            
            fetchAssessments();
            
        } catch (err) {
            log("Não foi possível deletar os dados: ", err);
            alert("Erro ao deletar a avaliação.");
        }
    };

    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Avaliações do Projeto #{projectId}</h1>

                <section className={styles.section}>
                    <Form typeForm="assessment" onSave={handleCreateAssessment} />
                </section>

                <section className={styles.section}>
                    <Table 
                        typeTable="assessment"
                        data={assessmentList}
                        loading={loading} 
                        error={error} 
                        onUpdate={handleUpdateAssessment}
                        onDelete={handleDeleteAssessment}
                    />
                </section>
            </div>
        </>
    );
}
