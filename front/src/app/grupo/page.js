"use client";

import { useEffect, useMemo, useState } from "react";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";

const MIN_ALUNOS = 3;
const MAX_ALUNOS = 7;

export default function CadastroGrupo() {
  const [loading, setLoading] = useState(true);

  const [turmas, setTurmas] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [alunosLista, setAlunosLista] = useState([]);
  const [locais, setLocais] = useState([]);

  const [nomeGrupo, setNomeGrupo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [semestreId, setSemestreId] = useState("");
  const [professorOrientadorId, setProfessorOrientadorId] = useState("");
  const [localId, setLocalId] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [alunosSelecionados, setAlunosSelecionados] = useState(["", "", ""]);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const [resTurmas, resSemestres, resUsuarios, resLocais] =
          await Promise.all([
            fetch("http://localhost:8080/api/turmas", { headers }),
            fetch("http://localhost:8080/api/semestres", { headers }),
            fetch("http://localhost:8080/api/users", { headers }),
            fetch("http://localhost:8080/api/locais", { headers }),
          ]);

        const extrairDados = async (res) => {
          if (!res.ok) return [];
          const json = await res.json();
          return Array.isArray(json) ? json : json.content || json.data || [];
        };

        setTurmas(await extrairDados(resTurmas));
        setSemestres(await extrairDados(resSemestres));
        setLocais(await extrairDados(resLocais));

        const usuariosData = await extrairDados(resUsuarios);
        setProfessores(
          usuariosData.filter(
            (u) =>
              u.profile === "PROFESSOR" ||
              u.perfil === "PROFESSOR" ||
              u.role === "PROFESSOR",
          ),
        );
        setAlunosLista(
          usuariosData.filter(
            (u) =>
              u.profile === "ALUNO" ||
              u.perfil === "ALUNO" ||
              u.role === "ALUNO",
          ),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const alunosValidos = useMemo(() => {
    return Array.from(
      new Set(
        alunosSelecionados.map((id) => id.toString().trim()).filter(Boolean),
      ),
    );
  }, [alunosSelecionados]);

  const isFormValid =
    nomeGrupo.trim() !== "" &&
    descricao.trim() !== "" &&
    turmaId !== "" &&
    semestreId !== "" &&
    professorOrientadorId !== "" &&
    localId !== "" &&
    horarioInicio !== "" &&
    horarioFim !== "" &&
    alunosValidos.length >= MIN_ALUNOS &&
    alunosValidos.length <= MAX_ALUNOS;

  const atualizarAluno = (index, value) => {
    setAlunosSelecionados((prev) =>
      prev.map((item, i) => (i === index ? value : item)),
    );
  };

  const adicionarAluno = () => {
    if (alunosSelecionados.length >= MAX_ALUNOS) return;
    setAlunosSelecionados((prev) => [...prev, ""]);
  };

  const removerAluno = (index) => {
    if (alunosSelecionados.length <= MIN_ALUNOS) return;
    setAlunosSelecionados((prev) => prev.filter((_, i) => i !== index));
  };

  const getAlunosDisponiveis = (currentIndex) => {
    return alunosLista.filter((aluno) => {
      return !alunosSelecionados.some(
        (id, i) => i !== currentIndex && id === aluno.id.toString(),
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    const token = localStorage.getItem("token");

    if (!isFormValid) {
      setErro(
        `Informe um nome e selecione entre ${MIN_ALUNOS} e ${MAX_ALUNOS} alunos únicos.`,
      );
      return;
    }

    const payload = {
      nome: nomeGrupo.trim(),
      descricao: descricao.trim(),
      turmaId: Number(turmaId),
      semestreId: Number(semestreId),
      professorOrientadorId: Number(professorOrientadorId),
      integranteIds: alunosValidos.map((id) => Number(id)),
      localId: Number(localId),
      horarioInicio: new Date(horarioInicio).toISOString(),
      horarioFim: new Date(horarioFim).toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8080/api/projetos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || errorData.error || "Falha ao salvar o grupo.";
        throw new Error(errorMessage);
      }

      setSucesso("Projeto/Grupo criado com sucesso!");
      setNomeGrupo("");
      setDescricao("");
      setTurmaId("");
      setSemestreId("");
      setProfessorOrientadorId("");
      setLocalId("");
      setHorarioInicio("");
      setHorarioFim("");
      setAlunosSelecionados(["", "", ""]);
    } catch (err) {
      setErro(err.message);
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Carregando dados estruturais...</p>
      </div>
    );

  const selectStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
    backgroundColor: "white",
    width: "100%",
  };
  const labelStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "var(--text-color)",
  };
  const colStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    flex: 1,
  };

  return (
    <div
      className="container"
      style={{ alignItems: "center", paddingBottom: "40px" }}
    >
      <h1 className="title" style={{ marginBottom: "20px" }}>
        Cadastro de Grupo
      </h1>

      <form
        onSubmit={handleSubmit}
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          textAlign: "left",
          width: "100%",
          maxWidth: "700px",
        }}
      >
        <FormInput
          label="Nome do Grupo"
          type="text"
          value={nomeGrupo}
          onChange={(e) => setNomeGrupo(e.target.value)}
          required
        />
        <FormInput
          label="Descrição"
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={colStyle}>
            <label style={labelStyle}>Turma</label>
            <select
              style={selectStyle}
              value={turmaId}
              onChange={(e) => setTurmaId(e.target.value)}
              required
            >
              <option value="">Selecione uma turma...</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={colStyle}>
            <label style={labelStyle}>Semestre</label>
            <select
              style={selectStyle}
              value={semestreId}
              onChange={(e) => setSemestreId(e.target.value)}
              required
            >
              <option value="">Selecione um semestre...</option>
              {semestres.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={colStyle}>
            <label style={labelStyle}>Professor Orientador</label>
            <select
              style={selectStyle}
              value={professorOrientadorId}
              onChange={(e) => setProfessorOrientadorId(e.target.value)}
              required
            >
              <option value="">Selecione um professor...</option>
              {professores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome || p.username || p.email}
                </option>
              ))}
            </select>
          </div>

          <div style={colStyle}>
            <label style={labelStyle}>Local</label>
            <select
              style={selectStyle}
              value={localId}
              onChange={(e) => setLocalId(e.target.value)}
              required
            >
              <option value="">Selecione um local...</option>
              {locais.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.numero}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={colStyle}>
            <FormInput
              label="Horário de Início"
              type="datetime-local"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              required
            />
          </div>
          <div style={colStyle}>
            <FormInput
              label="Horário de Fim"
              type="datetime-local"
              value={horarioFim}
              onChange={(e) => setHorarioFim(e.target.value)}
              required
            />
          </div>
        </div>

        <hr style={{ margin: "10px 0", borderTop: "1px solid #ccc" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label style={labelStyle}>
              Alunos selecionados: {alunosValidos.length} (mín. {MIN_ALUNOS},
              máx. {MAX_ALUNOS})
            </label>
            <Button
              type="button"
              onClick={adicionarAluno}
              disabled={alunosSelecionados.length >= MAX_ALUNOS}
            >
              + Adicionar Aluno
            </Button>
          </div>

          {alunosSelecionados.map((alunoId, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
            >
              <div style={colStyle}>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#666",
                  }}
                >
                  Aluno {index + 1}
                </label>
                <select
                  style={selectStyle}
                  value={alunoId}
                  onChange={(e) => atualizarAluno(index, e.target.value)}
                  required
                >
                  <option value="">Selecione o aluno...</option>
                  {getAlunosDisponiveis(index).map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nome || a.username || a.email}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                variant="danger"
                onClick={() => removerAluno(index)}
                disabled={alunosSelecionados.length <= MIN_ALUNOS}
                style={{ height: "38px" }}
              >
                Remover
              </Button>
            </div>
          ))}
        </div>

        {erro && (
          <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
            {erro}
          </p>
        )}
        {sucesso && (
          <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
            {sucesso}
          </p>
        )}

        <div style={{ marginTop: "15px" }}>
          <Button
            type="submit"
            disabled={!isFormValid}
            style={{ width: "100%", opacity: isFormValid ? 1 : 0.6 }}
          >
            Cadastrar Grupo
          </Button>
        </div>
      </form>
    </div>
  );
}
