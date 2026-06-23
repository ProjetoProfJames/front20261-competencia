"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/utils/api";

export default function TelaCadastroGrupo() {
  const navegador = useRouter();

  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaProfessores, setListaProfessores] = useState([]);
  const [listaLocais, setListaLocais] = useState([]);
  const [listaAlunos, setListaAlunos] = useState([]);
  const [listaSemestres, setListaSemestres] = useState([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [semestreSelecionado, setSemestreSelecionado] = useState("");
  const [alunosSelecionados, setAlunosSelecionados] = useState([]);
  const [campoNome, setCampoNome] = useState("");
  const [campoDescricao, setCampoDescricao] = useState("");
  const [campoData, setCampoData] = useState("");
  const [horaAbertura, setHoraAbertura] = useState("");
  const [horaEncerramento, setHoraEncerramento] = useState("");

  useEffect(() => {
    async function carregarDadosDosColegas() {
      const resultados = await Promise.allSettled([
        API.get("/turmas"),
        API.get("/locais"),
        API.get("/users"),
        API.get("/semestres"),
      ]);

      const [resTurmas, resLocais, resUsers, resSemestres] = resultados;

      if (resTurmas.status === "fulfilled") {
        setListaTurmas(Array.isArray(resTurmas.value) ? resTurmas.value : []);
      }
      if (resLocais.status === "fulfilled") {
        setListaLocais(Array.isArray(resLocais.value) ? resLocais.value : []);
      }
      if (resUsers.status === "fulfilled") {
        const users = Array.isArray(resUsers.value) ? resUsers.value : [];
        setListaProfessores(users.filter((u) => u.profile === "PROFESSOR"));
        setListaAlunos(users.filter((u) => u.profile === "ALUNO"));
      }
      if (resSemestres.status === "fulfilled") {
        setListaSemestres(Array.isArray(resSemestres.value) ? resSemestres.value : []);
      }
    }

    carregarDadosDosColegas();
  }, []);

  const lidarComSelecaoAluno = (idAluno) => {
    if (alunosSelecionados.includes(idAluno)) {
      setAlunosSelecionados(alunosSelecionados.filter((id) => id !== idAluno));
    } else {
      setAlunosSelecionados([...alunosSelecionados, idAluno]);
    }
  };

  
  const montarInstant = (data, hora) => {
  return `${data}T${hora}:00Z`;
};

  const processarFormulario = async (evento) => {
    evento.preventDefault();

    if (alunosSelecionados.length < 3 || alunosSelecionados.length > 7) {
      alert(` O grupo possui atualmente ${alunosSelecionados.length} aluno(s). Deve conter entre 3 e 7 integrantes.`);
      return;
    }

    const payload = {
      nome: campoNome,
      descricao: campoDescricao,
      turmaId: Number(turmaSelecionada),
      semestreId: Number(semestreSelecionado),
      professorOrientadorId: Number(professorSelecionado), 
      integranteIds: alunosSelecionados.map(Number),      
      localId: Number(localSelecionado),
      horarioInicio: montarInstant(campoData, horaAbertura),  
      horarioFim: montarInstant(campoData, horaEncerramento),  
    };

    try {
      await API.post("/projetos", payload); 
      alert("Grupo de Trabalho registrado com sucesso!");
      navegador.push("/grupos");
    } catch (erro) {
      alert(`Erro ao salvar: ${erro.message}`);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Registrar Novo Grupo de Projeto</h2>

      <form onSubmit={processarFormulario} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>

       
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Nome do Projeto:</label>
          <input
            type="text"
            value={campoNome}
            onChange={(e) => setCampoNome(e.target.value)}
            required
            maxLength={160}
            placeholder="Ex: Sistema de Gestão Escolar"
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Descrição:</label>
          <textarea
            value={campoDescricao}
            onChange={(e) => setCampoDescricao(e.target.value)}
            required
            maxLength={2000}
            rows={3}
            placeholder="Descreva o projeto..."
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Semestre:</label>
          <select
            value={semestreSelecionado}
            onChange={(e) => setSemestreSelecionado(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Selecione o Semestre...</option>
            {listaSemestres.map((s) => (
              <option key={s.id} value={s.id}>{s.nome || s.descricao || `Semestre ${s.id}`}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Turma / Curso:</label>
          <select
            value={turmaSelecionada}
            onChange={(e) => setTurmaSelecionada(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Selecione a Turma...</option>
            {listaTurmas.map((t) => (
              <option key={t.id} value={t.id}>{t.nome || `${t.curso} - ${t.identificador}`}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Professor Orientador:</label>
          <select
            value={professorSelecionado}
            onChange={(e) => setProfessorSelecionado(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Selecione o Orientador...</option>
            {listaProfessores.map((p) => (
              <option key={p.id} value={p.id}>{p.username}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>
            Integrantes do Grupo (Mínimo 3 - Máximo 7):
          </label>
          <div style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            maxHeight: "150px",
            overflowY: "auto",
            backgroundColor: "#fff"
          }}>
            {listaAlunos.length === 0 ? (
              <p style={{ color: "#777", margin: 0, fontSize: "14px" }}>Nenhum aluno cadastrado no sistema ainda.</p>
            ) : (
              listaAlunos.map((aluno) => (
                <label key={aluno.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={alunosSelecionados.includes(aluno.id)}
                    onChange={() => lidarComSelecaoAluno(aluno.id)}
                  />
                  {aluno.username}
                </label>
              ))
            )}
          </div>
          <small style={{ marginTop: "5px", color: "#666" }}>
            Selecionados: <strong>{alunosSelecionados.length}</strong> de 7 permitidos.
          </small>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Local da Apresentação:</label>
          <select
            value={localSelecionado}
            onChange={(e) => setLocalSelecionado(e.target.value)}
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Selecione o Local Reservado...</option>
            {listaLocais.map((l) => (
              <option key={l.id} value={l.id}>{l.numero}</option>
            ))}
          </select>
        </div>

        {/* Data */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontWeight: "bold" }}>Data da Apresentação:</label>
          <input
            type="date"
            value={campoData}
            onChange={(e) => setCampoData(e.target.value)}
            required
            style={{ padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold" }}>Horário Inicial:</label>
            <input
              type="time"
              value={horaAbertura}
              onChange={(e) => setHoraAbertura(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontWeight: "bold" }}>Horário Final:</label>
            <input
              type="time"
              value={horaEncerramento}
              onChange={(e) => setHoraEncerramento(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <button
            type="submit"
            style={{ padding: "12px 20px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
          >
            Confirmar Cadastro
          </button>
          <button
            type="button"
            onClick={() => navegador.push("/grupos")}
            style={{ padding: "12px 20px", backgroundColor: "#ccc", color: "#333", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}