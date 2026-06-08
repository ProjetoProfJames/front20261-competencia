"use client";

import { useState, useEffect, use } from "react";
import Form from "../../_components/form";
import Table from "../../_components/table";
import { api } from "@/services/api";
import styles from "../../projetos.module.css";

export default function MembersPage({ params }) {

    const { id: projectId } = use(params);

    const [memberList, setMemberList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const log = (message, exception) => {
        console.error(message, exception);
        setError(message);
    };

    async function fetchMembers() {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/api/projetos/${projectId}/integrantes`);
            
            if (response && response.data) setMemberList(response.data);
            else setMemberList([]);
        } catch (err) {
            log("Não foi possível carregar os integrantes: ", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (projectId) {
            fetchMembers();
        }
    }, [projectId]);

    const handleCreateMember = async (newMember) => {
        try {
            const payload = {
                alunoId: Number(newMember.alunoId)
            };

            await api.post(`/api/projetos/${projectId}/integrantes`, payload);
            alert("Integrante adicionado com sucesso!");
            fetchMembers();
        } catch (err) {
            log("Erro ao adicionar integrante: ", err);
            alert("Não foi possível adicionar o integrante.");
        }
    };

    const handleJoinProject = async () => {
        try {
            await api.post(`/api/projetos/${projectId}/integrantes/me`);
            alert("Você entrou no projeto com sucesso!");
            fetchMembers();
        } catch (err) {
            log("Erro ao entrar no projeto: ", err);
            alert("Não foi possível entrar no projeto.");
        }
    };

    const handleLeaveProject = async () => {
        if (!confirm("Tem certeza que deseja sair deste projeto?")) return;
        
        try {
            await api.delete(`/api/projetos/${projectId}/integrantes/me`);
            alert("Você saiu do projeto.");
            fetchMembers();
        } catch (err) {
            log("Erro ao sair do projeto: ", err);
            alert("Não foi possível sair do projeto.");
        }
    };

    const handleRemoveMember = async (alunoId) => {
        if (!confirm("Deseja remover este integrante do projeto?")) return;

        try {
            await api.delete(`/api/projetos/${projectId}/integrantes/${alunoId}`);
            alert("Integrante removido com sucesso!");
            fetchMembers();
        } catch (err) {
            log("Erro ao remover integrante: ", err);
            alert("Não foi possível remover o integrante.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Integrantes do Projeto #{projectId}</h1>

            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.successButton}`} onClick={handleJoinProject}>
                    Quero me juntar a este projeto
                </button>
                <button className={`${styles.button} ${styles.dangerButton}`} onClick={handleLeaveProject}>
                    Sair do projeto
                </button>
            </div>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>Adicionar Outro Aluno</h3>
                <Form typeForm="member" onSave={handleCreateMember} />
            </section>

            <section className={styles.section}>
                <Table 
                    typeTable="member"
                    data={memberList}
                    loading={loading} 
                    error={error} 
                    onDelete={handleRemoveMember}
                    onUpdate={null}
                />
            </section>
        </div>
    );
}
