'use client';

import { useState } from "react";
import FormInput from "@/components/FormInput";
import Popup from "./_components/popup";

export default function ProjetosPage() {

    const [projetos, setProjetos] = useState({
        nome: "",
        descricao: "",
        turmaId: 0,
        semestreId: 0,
        professorOrientadorId: 0,
        integranteIds: [],
        localId: 0,
        horarioInicio: new Date(),
        horarioFim: new Date()
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjetos((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectField = (campo, idSelecionado) => {
        setProjetos((prev) => {
            if (campo === 'integranteIds') {
                const exists = prev.integranteIds.includes(idSelecionado);
                return {
                    ...prev,
                    integranteIds: exists
                        ? prev.integranteIds.filter(id => id !== idSelecionado)
                        : [...prev.integranteIds, idSelecionado]
                }
            }
            else return {
                ...prev,
                [campo]: idSelecionado
            }
        });
    };

    return (
        <>
            <div>
                <h1>Projetos Page</h1>
                <form onSubmit={(e) => e.preventDefault()}>
                    
                    <FormInput
                        label="Nome:"
                        type="text"
                        name="nome"
                        value={projetos.nome}
                        onChange={handleChange}
                    />
                    
                    <FormInput
                        label="Descrição:"
                        type="text"
                        name="descricao"
                        value={projetos.descricao}
                        onChange={handleChange}
                    />
                    
                    <div>
                        <p>Semestre ID: {projetos.semestreId}</p>
                        <Popup 
                            campo="semestreId" 
                            onSelect={(id) => handleSelectField("semestreId", id)} 
                        />
                    </div>
                    
                    <div>
                        <p>Professor Orientador ID: {projetos.professorOrientadorId}</p>
                        <Popup 
                            campo="professorOrientadorId" 
                            onSelect={(id) => handleSelectField("professorOrientadorId", id)} 
                        />
                    </div>

                    <div>
                        <p>Integrantes ID: {projetos.integranteIds}</p>
                        <Popup 
                            campo="integranteIds" 
                            onSelect={(id) => handleSelectField("integranteIds", id)} 
                        />
                    </div>

                    <div>
                        <p>Local ID: {projetos.localId}</p>
                        <Popup 
                            campo="localId" 
                            onSelect={(id) => handleSelectField("localId", id)} 
                        />
                    </div>

                    <FormInput
                        label="Horário Inicio:"
                        type="datetime-local"
                        name="horarioInicio"
                        value={projetos.horarioInicio}
                        onChange={handleChange}
                    />

                    <FormInput
                        label="Horário Fim:"
                        type="datetime-local"
                        name="horarioFim"
                        value={projetos.horarioFim}
                        onChange={handleChange}
                    />
                </form>
            </div>
        </>
    );
}