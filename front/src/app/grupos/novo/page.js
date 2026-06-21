"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

export default function TelaCadastroGrupo() {
  const navegador = useRouter();
  
  // 📥 Listas que vêm das Tasks dos seus colegas
  const [listaTurmas, setListaTurmas] = useState([]);
  const [listaProfessores, setListaProfessores] = useState([]);
  const [listaLocais, setListaLocais] = useState([]);
  const [listaAlunos, setListaAlunos] = useState([]); // CRUD da Task 1

  // 📝 Estados para guardar o que o usuário selecionar no formulário
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [alunosSelecionados, setAlunosSelecionados] = useState([]); // Array de IDs dos alunos marcados
  const [campoData, setCampoData] = useState("");
  const [horaAbertura, setHoraAbertura] = useState("");
  const [horaEncerramento, setHoraEncerramento] = useState("");

  // 🔄 Busca os dados das outras Tasks assim que a tela abre
  useEffect(() => {
    async function carregarDadosDosColegas() {
      try {
        // Executa todas as buscas em paralelo para carregar de forma otimizada
        const [turmas, professores, locais, alunos] = await Promise.all([
          API.buscarTurmas().catch(() => []),
          API.buscarProfessores().catch(() => []),
          API.buscarLocais().catch(() => []),
          API.buscarAlunos().catch(() => [])
        ]);
        
        setListaTurmas(turmas);
        setListaProfessores(professores);
        setListaLocais(locais);
        setListaAlunos(alunos);
      } catch (erro) {
        console.error("Erro ao integrar dados das outras Tasks:", erro);
      }
    }
    carregarDadosDosColegas();
  }, []);

  // Gerencia o marcar/desmarcar dos checkboxes de alunos
  const lidarComSelecaoAluno = (idAluno) => {
    if (alunosSelecionados.includes(idAluno)) {
      setAlunosSelecionados(alunosSelecionados.filter(id => id !== idAluno));
    } else {
      setAlunosSelecionados([...alunosSelecionados, idAluno]);
    }
  };

  const processarFormulario = async (evento) => {
    evento.preventDefault();

    // Regra de Negócio da Task 3: Validar limite de alunos por grupo (Mínimo 3, Máximo 7)
    if (alunosSelecionados.length < 3 || alunosSelecionados.length > 7) {
      alert(`Aviso da Task 3: O grupo possui atualmente ${alunosSelecionados.length} aluno(s). Deve conter entre 3 e 7 integrantes.`);
      return;
    }

    const payload = {
      turmaId: turmaSelecionada,
      professorId: professorSelecionado,
      localId: localSelecionado,
      alunosIds: alunosSelecionados, // IDs enviados para o relacionamento no backend
      dataApresentacao: campoData,
      horarioInicio: horaAbertura,
      horarioFim: horaEncerramento
    };

    try {
      // Envia os dados autenticados com o Bearer Token JWT configurado na API
      await API.cadastrar(payload);
      alert("Grupo de Trabalho registrado com sucesso!");
      navegador.push("/grupos");
    } catch (erro) {
      alert(`Erro ao salvar: ${erro.message}`);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Registrar Novo Grupo de Trabalho (Task 3)</h2>
      
      <form onSubmit={processarFormulario} style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
        
        {/* Seletor de Turma/Curso (Task 2 dos colegas) */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ marginBottom: "5px", fontWeight: "bold" }}>Turma / Curso:</label>
          <select 
            value={turmaSelecionada} 
            onChange={(e) => setTurmaSelecionada(e.target.value)} 
            required
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Selecione a Turma Criada pelos Colegas...</option>
            {listaTurmas.map((t) => (
              <option key={t.id} value={t.id}>{t.nome || `${t.curso} - ${t.identificador}`}</option>
            ))}
          </select>
        </div>

        {/* Seletor de Professor Orientador (Task 1 dos colegas) */}
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
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>

        {/* Seleção de Integrantes por Checkbox (CRUD Alunos - Task 1 dos colegas) */}
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
                  {aluno.nome}
                </label>
              ))
            )}
          </div>
          <small style={{ marginTop: "5px", color: "#666" }}>
            Selecionados: <strong>{alunosSelecionados.length}</strong> de 7 permitidos.
          </small>
        </div>

        {/* Seletor de Local (Task 2 dos colegas) */}
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
              <option key={l.id} value={l.id}>{l.nome || l.descricao}</option>
            ))}
          </select>
        </div>
        
        {/* Data da Apresentação */}
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

        {/* Horários */}
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
        
        {/* Botões Nativos do HTML (Evita a dependência de componentes Button com erro) */}
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