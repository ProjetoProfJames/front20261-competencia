"use client";

import { useEffect, useState } from "react";
import "../styles/avaliacoes.css";

import AvaliacaoList from "@/components/avaliacoes/AvaliacaoList";
import AvaliacaoForm from "@/components/avaliacoes/AvaliacaoForm";

import {
    listarAvaliacoes,
    criarAvaliacao,
    atualizarAvaliacao,
    deletarAvaliacao,
    listarAvaliadores,
} from "@/app/services/avaliacoesService";

import { listarProjetos } from "@/app/services/gruposService";

export default function AvaliacoesPage() {
    const [modo, setModo] = useState("list");
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [projetos, setProjetos] = useState([]);
    const [avaliadores, setAvaliadores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(null);

    async function carregar() {
        try {
            setLoading(true);

            const [resAvaliacoes, resProjetos, resAvaliadores] = await Promise.all([
                listarAvaliacoes(),
                listarProjetos(),
                listarAvaliadores(),
            ]);

            setAvaliacoes(resAvaliacoes?.data ?? []);
            setProjetos(resProjetos?.data ?? resProjetos ?? []);
            setAvaliadores(resAvaliadores ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    function novo() {
        setEditando(null);
        setModo("form");
    }

    function editar(avaliacao) {
        setEditando(avaliacao);
        setModo("form");
    }

    function voltar() {
        setModo("list");
        setEditando(null);
    }

    async function salvar(data) {
        try {
            if (editando) {
                await atualizarAvaliacao(editando.id, data);
            } else {
                await criarAvaliacao(data);
            }

            await carregar();
            voltar();
        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    }
    
    async function excluir(id) {
        if (!confirm("Deseja excluir esta avaliação?")) return;

        try {
            await deletarAvaliacao(id);
            await carregar();
        } catch (err) {
            alert(err.message);
            console.error(err);
        }
    }

    return (
        <div className="avaliacao-container">
            {modo === "list" && (
                <AvaliacaoList
                    avaliacoes={avaliacoes}
                    loading={loading}
                    onNovo={novo}
                    onEditar={editar}
                    onExcluir={excluir}
                />
            )}

            {modo === "form" && (
                <AvaliacaoForm
                    avaliacao={editando}
                    onVoltar={voltar}
                    onSalvar={salvar}
                    projetos={projetos}
                    avaliadores={avaliadores}
                />
            )}
        </div>
    );
}