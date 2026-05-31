'use client';

import { useState, useEffect } from "react";
import Table from "./_components/table";
import Form from "./form";
import { api } from "./api";

export default function ProjetosPage() {
    const [listaProjetos, setListaProjetos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    async function buscarProjetos() {
        try {
            setCarregando(true);
            const queryParams = {
                turmaId: 0,
                semestreId: 0,
                localId: 0
            };
            const resposta = await api.get('/projetos', queryParams);

            if (resposta && resposta.data) {
                setListaProjetos(resposta.data);
            } else {
                setListaProjetos([]);
            }
        } catch (err) {
            console.error("Erro ao carregar dados:", err);
            setErro("Não foi possível carregar os dados do servidor.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarProjetos();
    }, []);

    const handleCriarProjeto = async (novoProjeto) => {
        try {
            const payload = {
                ...novoProjeto,
                horarioInicio: novoProjeto.horarioInicio ? new Date(novoProjeto.horarioInicio).toISOString() : null,
                horarioFim: novoProjeto.horarioFim ? new Date(novoProjeto.horarioFim).toISOString() : null
            };

            const resposta = await api.post('/projetos', payload);

            console.log(`Resposta do servidor () => ${resposta}`);
            alert("Projeto cadastrado com sucesso!");
            buscarProjetos();
            
        } catch (err) {
            console.error("Erro ao cadastrar projeto:", err);
            alert("Não foi possível cadastrar o projeto.");
        }
    };

    return (
        <>
            <div style={{ padding: '20px' }}>
                <h1>Projetos Page</h1>
                
                <section>
                    <Form aoSalvar={handleCriarProjeto} />
                </section>

                <section style={{ marginTop: '20px' }}>
                    <Table 
                        dados={listaProjetos} 
                        carregando={carregando} 
                        erro={erro} 
                    />
                </section>
            </div>
        </>
    );
}