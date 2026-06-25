"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import CursoSection from "./CursoSection";
import PeriodoLetivoSection from "./PeriodoLetivoSection";
import TurmaSection from "./TurmaSection";

const cursoInicial = {
  id: "",
  nome: "",
  coordenadorId: "",
  professorIds: [],
};

const semestreInicial = {
  id: "",
  nome: "",
  dataInicio: "",
  dataFim: "",
};

const turmaInicial = {
  id: "",
  nome: "",
  cursoIds: [],
  disciplinaId: "",
  semestreId: "",
  professorIds: [],
};

function toNumberList(values) {
  return values.map(Number).filter(Boolean);
}

export default function CrudAcademico() {
  const [activeSection, setActiveSection] = useState("cursos");
  const [cursos, setCursos] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursoForm, setCursoForm] = useState(cursoInicial);
  const [semestreForm, setSemestreForm] = useState(semestreInicial);
  const [turmaForm, setTurmaForm] = useState(turmaInicial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [feedback, setFeedback] = useState("");
  const [erro, setErro] = useState("");

  const professores = useMemo(
    () => usuarios.filter((usuario) => usuario.profile === "PROFESSOR"),
    [usuarios],
  );

  const coordenadores = useMemo(
    () => usuarios.filter((usuario) => usuario.profile === "COORDENADOR"),
    [usuarios],
  );

  const disciplinasDisponiveis = useMemo(() => {
    if (!turmaForm.cursoIds.length) {
      return disciplinas;
    }

    return disciplinas.filter((disciplina) => turmaForm.cursoIds.includes(String(disciplina.cursoId)));
  }, [disciplinas, turmaForm.cursoIds]);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const [listaCursos, listaSemestres, listaTurmas, listaUsuarios, listaDisciplinas] = await Promise.all([
        api.get("/cursos"),
        api.get("/semestres"),
        api.get("/turmas"),
        api.get("/users"),
        api.get("/disciplinas"),
      ]);

      setCursos(listaCursos || []);
      setSemestres(listaSemestres || []);
      setTurmas(listaTurmas || []);
      setUsuarios(listaUsuarios || []);
      setDisciplinas(listaDisciplinas || []);
    } catch (error) {
      setErro(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function salvarCurso(event) {
    event.preventDefault();
    setSaving("curso");
    setErro("");
    setFeedback("");

    const payload = {
      nome: cursoForm.nome.trim(),
      coordenadorId: Number(cursoForm.coordenadorId),
      professorIds: toNumberList(cursoForm.professorIds),
    };

    try {
      if (cursoForm.id) {
        await api.put(`/cursos/${cursoForm.id}`, payload);
        setFeedback("Curso atualizado.");
      } else {
        await api.post("/cursos", payload);
        setFeedback("Curso cadastrado.");
      }

      setCursoForm(cursoInicial);
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSaving("");
    }
  }

  async function salvarSemestre(event) {
    event.preventDefault();
    setSaving("semestre");
    setErro("");
    setFeedback("");

    const payload = {
      nome: semestreForm.nome.trim(),
      dataInicio: semestreForm.dataInicio,
      dataFim: semestreForm.dataFim,
    };

    try {
      if (semestreForm.id) {
        await api.put(`/semestres/${semestreForm.id}`, payload);
        setFeedback("Periodo letivo atualizado.");
      } else {
        await api.post("/semestres", payload);
        setFeedback("Periodo letivo cadastrado.");
      }

      setSemestreForm(semestreInicial);
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSaving("");
    }
  }

  async function salvarTurma(event) {
    event.preventDefault();
    setSaving("turma");
    setErro("");
    setFeedback("");

    const payload = {
      nome: turmaForm.nome.trim(),
      cursoIds: toNumberList(turmaForm.cursoIds),
      disciplinaId: Number(turmaForm.disciplinaId),
      semestreId: Number(turmaForm.semestreId),
      professorIds: toNumberList(turmaForm.professorIds),
    };

    try {
      if (turmaForm.id) {
        await api.put(`/turmas/${turmaForm.id}`, payload);
        setFeedback("Turma atualizada.");
      } else {
        await api.post("/turmas", payload);
        setFeedback("Turma cadastrada.");
      }

      setTurmaForm(turmaInicial);
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSaving("");
    }
  }

  async function excluir(endpoint, id, label) {
    if (!confirm(`Deseja excluir ${label}?`)) {
      return;
    }

    setSaving(label);
    setErro("");
    setFeedback("");

    try {
      await api.delete(`${endpoint}/${id}`);
      setFeedback(`${label} excluido.`);
      await carregarDados();
    } catch (error) {
      setErro(error.message);
    } finally {
      setSaving("");
    }
  }

  function editarCurso(curso) {
    setActiveSection("cursos");
    setCursoForm({
      id: curso.id,
      nome: curso.nome || "",
      coordenadorId: curso.coordenador?.id ? String(curso.coordenador.id) : "",
      professorIds: curso.professores?.map((professor) => String(professor.id)) || [],
    });
  }

  function editarSemestre(semestre) {
    setActiveSection("semestres");
    setSemestreForm({
      id: semestre.id,
      nome: semestre.nome || "",
      dataInicio: semestre.dataInicio || "",
      dataFim: semestre.dataFim || "",
    });
  }

  function editarTurma(turma) {
    setActiveSection("turmas");
    setTurmaForm({
      id: turma.id,
      nome: turma.nome || "",
      cursoIds: turma.cursos?.map((curso) => String(curso.id)) || [],
      disciplinaId: turma.disciplina?.id ? String(turma.disciplina.id) : "",
      semestreId: turma.semestre?.id ? String(turma.semestre.id) : "",
      professorIds: turma.professores?.map((professor) => String(professor.id)) || [],
    });
  }

  if (loading) {
    return <p className="status-message">Carregando dados academicos...</p>;
  }

  return (
    <section className="academic-page">
      <div className="page-heading">
        <div>
          <h1>Cursos, periodos letivos e turmas</h1>
        </div>
        <button type="button" className="secondary-button" onClick={carregarDados}>
          Atualizar
        </button>
      </div>

      {erro && <p className="alert-error">{erro}</p>}
      {feedback && <p className="alert-success">{feedback}</p>}

      <nav className="task-nav" aria-label="Navegacao da Task 2">
        <button
          type="button"
          className={activeSection === "cursos" ? "task-nav-button active" : "task-nav-button"}
          onClick={() => setActiveSection("cursos")}
        >
          Cursos
          <span>{cursos.length}</span>
        </button>
        <button
          type="button"
          className={activeSection === "semestres" ? "task-nav-button active" : "task-nav-button"}
          onClick={() => setActiveSection("semestres")}
        >
          Periodos letivos
          <span>{semestres.length}</span>
        </button>
        <button
          type="button"
          className={activeSection === "turmas" ? "task-nav-button active" : "task-nav-button"}
          onClick={() => setActiveSection("turmas")}
        >
          Turmas
          <span>{turmas.length}</span>
        </button>
      </nav>

      <div className="entity-stack">
        {activeSection === "cursos" && (
          <CursoSection
            coordenadores={coordenadores}
            cursoForm={cursoForm}
            cursos={cursos}
            professores={professores}
            saving={saving}
            setCursoForm={setCursoForm}
            onCancel={() => setCursoForm(cursoInicial)}
            onDelete={(curso) => excluir("/cursos", curso.id, "curso")}
            onEdit={editarCurso}
            onSubmit={salvarCurso}
          />
        )}

        {activeSection === "semestres" && (
          <PeriodoLetivoSection
            saving={saving}
            semestreForm={semestreForm}
            semestres={semestres}
            setSemestreForm={setSemestreForm}
            onCancel={() => setSemestreForm(semestreInicial)}
            onDelete={(semestre) => excluir("/semestres", semestre.id, "periodo")}
            onEdit={editarSemestre}
            onSubmit={salvarSemestre}
          />
        )}

        {activeSection === "turmas" && (
          <TurmaSection
            cursos={cursos}
            disciplinasDisponiveis={disciplinasDisponiveis}
            professores={professores}
            saving={saving}
            semestres={semestres}
            setTurmaForm={setTurmaForm}
            turmaForm={turmaForm}
            turmas={turmas}
            onCancel={() => setTurmaForm(turmaInicial)}
            onDelete={(turma) => excluir("/turmas", turma.id, "turma")}
            onEdit={editarTurma}
            onSubmit={salvarTurma}
          />
        )}
      </div>
    </section>
  );
}