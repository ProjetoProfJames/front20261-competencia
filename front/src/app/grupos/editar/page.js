"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

function FormularioEdicaoGrupo() {
  const navegador = useRouter();
  const parametros = useSearchParams();
  const idGrupo = parametros.get("id");

  const [campoCurso, setCampoCurso] = useState("");
  const [campoTurma, setCampoTurma] = useState("");
  const [campoProfessor, setCampoProfessor] = useState("");
  const [campoComponentes, setCampoComponentes] = useState("");
  const [campoLocal, setCampoLocal] = useState("");
  const [campoData, setCampoData] = useState("");
  const [horaAbertura, setHoraAbertura] = useState("");
  const [horaEncerramento, setHoraEncerramento] = useState("");

  useEffect(() => {
    const buscarGrupoParaEdicao = async () => {
      if (!idGrupo) return;
      try {
        const token = localStorage.getItem("token") || "";
        const resposta = await fetch(`http://localhost:8080/api/grupos/${idGrupo}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (resposta.ok) {
          const grupo = await resposta.json();
          setCampoCurso(grupo.curso || "");
          setCampoTurma(grupo.turma || "");
          setCampoProfessor(grupo.professor || "");
          setCampoComponentes(grupo.componentes || "");
          setCampoLocal(grupo.local || "");
          setCampoData(grupo.dataApresentacao || "");
          setHoraAbertura(grupo.horarioInicio || "");
          setHoraEncerramento(grupo.horarioFim || "");
        }
      } catch (erro) {
        console.error("Falha ao coletar dados para edicao:", erro);
      }
    };

    buscarGrupoParaEdicao();
  }, [idGrupo]);

  const processarFormulario = async (evento) => {
    evento.preventDefault();

    const integrantes = campoComponentes.split(",").map(nome => nome.trim()).filter(Boolean);

    if (integrantes.length < 3 || integrantes.length > 7) {
      alert("Alerta: O grupo precisa ter de 3 a 7 alunos.");
      return;
    }

    const payload = {
      id: Number(idGrupo),
      curso: campoCurso,
      turma: campoTurma,
      professor: campoProfessor,
      componentes: campoComponentes,
      local: campoLocal,
      dataApresentacao: campoData,
      horarioInicio: horaAbertura,
      horarioFim: horaEncerramento
    };

    try {
      const token = localStorage.getItem("token") || "";
      const resposta = await fetch(`http://localhost:8080/api/grupos/${idGrupo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (resposta.ok) {
        navegador.push("/grupos");
      } else {
        const mensagemErro = await resposta.text();
        alert(mensagemErro || "Nao foi possivel atualizar o registro.");
      }
    } catch (erro) {
      alert("Erro na comunicacao com o servidor backend.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px" }}>
      <h2>Modificar Informacoes do Grupo</h2>
      
      <form onSubmit={processarFormulario} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <FormInput label="Nome do Curso" value={campoCurso} onChange={(e) => setCampoCurso(e.target.value)} required />
        <FormInput label="Identificador da Turma" value={campoTurma} onChange={(e) => setCampoTurma(e.target.value)} required />
        <FormInput label="Professor Orientador" value={campoProfessor} onChange={(e) => setCampoProfessor(e.target.value)} required />
        
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px" }}>Integrantes (separados por virgula):</label>
          <textarea 
            value={campoComponentes} 
            onChange={(e) => setCampoComponentes(e.target.value)} 
            required 
            style={{ padding: "10px", minHeight: "80px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <FormInput label="Local da Apresentacao" value={campoLocal} onChange={(e) => setCampoLocal(e.target.value)} required />
        
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>Data da Apresentacao:</label>
          <input type="date" value={campoData} onChange={(e) => setCampoData(e.target.value)} required style={{ padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }} />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <label>Horario Inicial:</label>
            <input type="time" value={horaAbertura} onChange={(e) => setHoraAbertura(e.target.value)} required style={{ width: "100%", padding: "10px", marginTop: "5px" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Horario Final:</label>
            <input type="time" value={horaEncerramento} onChange={(e) => setHoraEncerramento(e.target.value)} required style={{ width: "100%", padding: "10px", marginTop: "5px" }} />
          </div>
        </div>
        
        <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
          <Button type="submit">Salvar Alteracoes</Button>
          <button type="button" onClick={() => navegador.push("/grupos")} style={{ padding: "10px 20px", borderRadius: "4px", border: "1px solid #ccc", background: "#f5f5f5", cursor: "pointer" }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TelaEditarGrupo() {
  return (
    <Suspense fallback={<div>Carregando formulario...</div>}>
      <FormularioEdicaoGrupo />
    </Suspense>
  );
}