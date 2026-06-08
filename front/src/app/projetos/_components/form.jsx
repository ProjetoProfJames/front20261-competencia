"use client";

import { useState } from "react";
import FormInput from "@/components/FormInput";
import Popup from "./popup";
import styles from "../projetos.module.css";

export default function Form({ typeForm, onSave }) {
    
    const [project, setProject] = useState({
        nome: "",
        descricao: "",
        turmaId: 0,
        semestreId: 0,
        professorOrientadorId: 0,
        integranteIds: [],
        localId: 0,
        horarioInicio: "",
        horarioFim: ""
    });

    const [assessment, setAssessment] = useState({
        nota: 0,
        comentario: ""
    });

    const [member, setMember] = useState({
        alunoId: 0
    });

    const handleFieldChange = (entity) => (e) => {
        const { name, value } = e.target;
        
        const processedValue = (name === "nota" || name === "alunoId") ? Number(value) : value;

        switch (entity) {
            case "project":
                setProject((prev) => ({ ...prev, [name]: processedValue }));
                break;
            case "assessment":
                setAssessment((prev) => ({ ...prev, [name]: processedValue }));
                break;
            case "member":
                setMember((prev) => ({ ...prev, [name]: processedValue }));
                break;
            default: 
                break;
        }
    };  

    const handleSelectField = (field, selectedId) => {
        setProject((prev) => {
            if (field === 'integranteIds') {
                const exists = prev.integranteIds.includes(selectedId);
                return {
                    ...prev,
                    integranteIds: exists
                        ? prev.integranteIds.filter(id => id !== selectedId)
                        : [...prev.integranteIds, selectedId]
                };
            } else {
                return {
                    ...prev,
                    [field]: selectedId
                };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        switch (typeForm) {
            case "project": 
                onSave && onSave(project);
                break;
            case "assessment":
                onSave && onSave(assessment);
                break;
            case "member":
                onSave && onSave(member);
                break;
            default: 
                break;
        }
    };

    return (
        <>
            {typeForm === "project" && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <FormInput
                        label="Nome:"
                        type="text"
                        name="nome"
                        value={project.nome}
                        onChange={handleFieldChange("project")}
                    />
                    
                    <FormInput
                        label="Descrição:"
                        type="text"
                        name="descricao"
                        value={project.descricao}
                        onChange={handleFieldChange("project")}
                    />
                    
                    <div className={styles.selectorGroup}>
                        <p>Semestre ID: {project.semestreId}</p>
                        <Popup 
                            campo="semestreId" 
                            onSelect={(id) => handleSelectField("semestreId", id)} 
                        />
                    </div>
                    
                    <div className={styles.selectorGroup}>
                        <p>Professor Orientador ID: {project.professorOrientadorId}</p>
                        <Popup 
                            campo="professorOrientadorId" 
                            onSelect={(id) => handleSelectField("professorOrientadorId", id)} 
                        />
                    </div>

                    <div className={styles.selectorGroup}>
                        <p>Integrantes ID: {project.integranteIds.join(", ")}</p>
                        <Popup 
                            campo="integranteIds" 
                            onSelect={(id) => handleSelectField("integranteIds", id)} 
                        />
                    </div>

                    <div className={styles.selectorGroup}>
                        <p>Local ID: {project.localId}</p>
                        <Popup 
                            campo="localId" 
                            onSelect={(id) => handleSelectField("localId", id)} 
                        />
                    </div>

                    <FormInput
                        label="Horário Inicio:"
                        type="datetime-local"
                        name="horarioInicio"
                        value={project.horarioInicio}
                        onChange={handleFieldChange("project")}
                    />

                    <FormInput
                        label="Horário Fim:"
                        type="datetime-local"
                        name="horarioFim"
                        value={project.horarioFim}
                        onChange={handleFieldChange("project")}
                    />

                    <button className={styles.button} type="submit">
                        Cadastrar Projeto
                    </button>
                </form>
            )}

            {typeForm === "assessment" && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <FormInput
                        label="Nota: "
                        type="number"
                        name="nota"
                        value={assessment.nota}
                        onChange={handleFieldChange("assessment")}
                    />
                    <FormInput
                        label="Comentário: "
                        type="text"
                        name="comentario"
                        value={assessment.comentario}
                        onChange={handleFieldChange("assessment")}
                    />

                    <button className={styles.button} type="submit">
                        Cadastrar Avaliação
                    </button>
                </form>
            )}

            {typeForm === "member" && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <FormInput
                        label="ID do Aluno: "
                        type="number"
                        name="alunoId"
                        value={member.alunoId}
                        onChange={handleFieldChange("member")}
                    />

                    <button className={styles.button} type="submit">
                        Adicionar Integrante
                    </button>
                </form>
            )}
        </>
    );
}
