"use client";

import { useState, useEffect } from "react";
import FormInput from "@/components/FormInput";
import styles from "../avaliacoes.module.css";

export default function Form({ onSave, initialData = null }) {
    const [assessment, setAssessment] = useState({
        projetoId: 0,
        avaliadorId: 0,
        nota: 0,
        comentario: ""
    });

    useEffect(() => {
        if (initialData) {
            setAssessment({
                projetoId: initialData.projetoId ?? 0,
                avaliadorId: initialData.avaliadorId ?? 0,
                nota: initialData.nota ?? 0,
                comentario: initialData.comentario ?? ""
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const processedValue = (name === "projetoId" || name === "avaliadorId" || name === "nota") 
            ? Number(value) 
            : value;

        setAssessment((prev) => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSave) {
            onSave(assessment);
        }
        if (!initialData) {
            setAssessment({ projetoId: 0, avaliadorId: 0, nota: 0, comentario: "" });
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <FormInput
                label="ID do Projeto:"
                type="number"
                name="projetoId"
                value={assessment.projetoId}
                onChange={handleChange}
                disabled={!!initialData}
            />
            
            <FormInput
                label="ID do Avaliador:"
                type="number"
                name="avaliadorId"
                value={assessment.avaliadorId}
                onChange={handleChange}
            />

            <FormInput
                label="Nota:"
                type="number"
                name="nota"
                value={assessment.nota}
                onChange={handleChange}
            />

            <FormInput
                label="Comentário:"
                type="text"
                name="comentario"
                value={assessment.comentario}
                onChange={handleChange}
            />

            <button className={styles.button} type="submit">
                {initialData ? "Salvar Alterações" : "Cadastrar Avaliação"}
            </button>
        </form>
    );
}
