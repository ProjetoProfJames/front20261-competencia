"use client";

import { useState } from "react";
import "../styles/grupos.css";

import GrupoList from "@/components/grupos/GruposList";
import GrupoForm from "@/components/grupos/GruposForm";

import { criarProjeto, atualizarProjeto } from "@/app/services/gruposService";

export default function GruposPage() {
  const [view, setView] = useState("lista");
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);

  function handleNovo() {
    setGrupoSelecionado(null);
    setView("form");
  }

  function handleEditar(grupo) {
    setGrupoSelecionado(grupo);
    setView("form");
  }

  function handleVoltar() {
    setGrupoSelecionado(null);
    setView("lista");
  }

  async function handleSalvar(formData) {
    try {
      if (grupoSelecionado) {
        await atualizarProjeto(grupoSelecionado.id, formData);
      } else {
        await criarProjeto(formData);
      }
      handleVoltar();
    } catch (err) {
      console.error(err);
      alert(err.message || "Erro ao salvar projeto.");
    }
  }

  if (view === "form") {
    return (
      <GrupoForm
        grupo={grupoSelecionado}
        onSalvar={handleSalvar}
        onVoltar={handleVoltar}
      />
    );
  }

  return <GrupoList onNovo={handleNovo} onEditar={handleEditar} />;
}