'use client';

import { useState, useEffect } from "react";
import Table from "./_components/table";
import Form from "./_components/form";
import { api } from "@/services/api";
import styles from "./projetos.module.css";

export default function ProjectPage() {

    const [projectList, setProjectList] = useState([] || {});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const log = (message, exception) => {
        console.log(message, exception);
        setError(message);
    }

    async function fetchProjects() {

        try {

            setLoading(true);
            setError(null); 

            const queryParams = {
                turmaId: 0,
                semestreId: 0,
                localId: 0
            };

            const response = await api.get('/api/projetos', queryParams);

            if (response && response.data) setProjectList([response.data]);
            else setProjectList([]);

        } catch (err) {
            log("Não foi possível carregar os dados: ", err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchProjectById(id) {

        try {

            setLoading(true);
            setError(null); 

            const response = await api.get(`/api/projetos/${id}`);

            if (response && response.data) setProjectList([response.data]);
            else setProjectList([]);

        } catch (err) {
            log("Não foi possível carregar os dados: ", err);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => fetchProjects(), []);

    const handleCreateProject = async (newProject) => {

        try {

            const payload = {
                ...newProject,
                horarioInicio: newProject.horarioInicio ? new Date(newProject.horarioInicio).toISOString() : null,
                horarioFim: newProject.horarioFim ? new Date(newProject.horarioFim).toISOString() : null
            };

            const response = await api.post('/api/projetos', payload);

            console.log(`Resposta do servidor () => ${response}`);
            alert("Projeto cadastrado com sucesso!");
            fetchProjects();
            
        } catch (err) {
            log("Não foi possível cadastrar o projeto: ", err);
        } finally {
            setLoading(false);
        }

    };

    const handleUpdateProject = async (id, project) => {

        try {

            const payload = {
                ...project,
                horarioInicio: project.horarioInicio ? new Date(project.horarioInicio).toISOString() : null,
                horarioFim: project.horarioFim ? new Date(project.horarioFim).toISOString() : null
            };

            const response = await api.put(`/api/projetos/${id}`, payload);
            console.log(`Resposta do servidor () => ${response}`);
            alert("Projeto atualizado com sucesso!");
            fetchProjects();
            
        } catch (err) {
            log("Não foi possível atualizar o projeto: ", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (id) => {

        try {

            const response = await api.delete(`/api/projetos/${id}`);
            console.log(`Resposta do servidor () => ${response}`);
            alert("Projeto deletado com sucesso!");
            fetchProjects();

        } catch (err) {
            log("Não foi possível deletar o projeto: ", err);
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>Projetos</h1>
                
                <section className={styles.section}>
                    <Form typeForm="project" onSave={handleCreateProject} />
                </section>

                <section className={styles.section}>
                    <Table 
                        typeTable={"project"}
                        data={projectList} 
                        loading={loading} 
                        error={error} 
                        onUpdate={handleUpdateProject}
                        onDelete={handleDeleteProject}
                    />
                </section>
            </div>
        </>
    );
}
