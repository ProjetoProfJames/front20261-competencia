'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

function CadastroTurmaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const turmaId = searchParams.get("id");
  const isEditing = Boolean(turmaId);

  const [turma, setTurma] = useState({
    nome: "",
    cursoIds: [],
    disciplinaId: "",
    semestreId: "",
    professorIds: []
  });

  const [cursos, setCursos] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const professores = usuarios.filter((u) => u.profile === "PROFESSOR");
  const disciplinasFiltradas = turma.cursoIds.length > 0
    ? disciplinas.filter((disciplina) => turma.cursoIds.includes(String(disciplina.cursoId)))
    : disciplinas;

  useEffect(() => {
    carregarDados();
  }, [turmaId]);

  const carregarDados = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setGeneralError(
          "Você ainda não está logado. O formulário está pronto, mas os dados só serão carregados após login."
        );
        return;
      }

      const [
        cursosResponse,
        disciplinasResponse,
        semestresResponse,
        usuariosResponse
      ] = await Promise.all([
        api.get("/cursos"),
        api.get("/disciplinas"),
        api.get("/semestres"),
        api.get("/users")
      ]);

      setCursos(cursosResponse.data || []);
      setDisciplinas(disciplinasResponse.data || []);
      setSemestres(semestresResponse.data || []);
      setUsuarios(usuariosResponse.data || []);

      if (isEditing) {
        const turmaResponse = await api.get(`/turmas/${turmaId}`);
        const data = turmaResponse.data;

        setTurma({
          nome: data.nome || "",
          cursoIds: data.cursos?.map((c) => String(c.id)) || [],
          disciplinaId: data.disciplina?.id ? String(data.disciplina.id) : "",
          semestreId: data.semestre?.id ? String(data.semestre.id) : "",
          professorIds: data.professores?.map((p) => String(p.id)) || []
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setGeneralError("Não foi possível carregar os dados da turma.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTurma((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCursosChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((option) => option.value);
    const disciplinaSelecionada = disciplinas.find(
      (disciplina) => String(disciplina.id) === String(turma.disciplinaId)
    );
    const manterDisciplina = disciplinaSelecionada
      ? values.includes(String(disciplinaSelecionada.cursoId))
      : true;

    setTurma((prev) => ({
      ...prev,
      cursoIds: values,
      disciplinaId: manterDisciplina ? prev.disciplinaId : ""
    }));
  };

  const handleProfessoresChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((option) => option.value);

    setTurma((prev) => ({
      ...prev,
      professorIds: values
    }));
  };

  const handleSubmit = async () => {
    setGeneralError("");
    setIsLoading(true);

    if (!turma.nome.trim()) {
      setGeneralError("Informe o nome da turma.");
      setIsLoading(false);
      return;
    }

    if (turma.nome.length > 120) {
      setGeneralError("O nome da turma deve ter no máximo 120 caracteres.");
      setIsLoading(false);
      return;
    }

    if (turma.cursoIds.length === 0) {
      setGeneralError("Selecione pelo menos um curso.");
      setIsLoading(false);
      return;
    }

    if (!turma.disciplinaId) {
      setGeneralError("Selecione uma disciplina.");
      setIsLoading(false);
      return;
    }

    const disciplinaSelecionada = disciplinas.find(
      (disciplina) => String(disciplina.id) === String(turma.disciplinaId)
    );

    if (disciplinaSelecionada && !turma.cursoIds.includes(String(disciplinaSelecionada.cursoId))) {
      setGeneralError("A disciplina selecionada precisa pertencer a um dos cursos selecionados.");
      setIsLoading(false);
      return;
    }

    if (!turma.semestreId) {
      setGeneralError("Selecione um semestre.");
      setIsLoading(false);
      return;
    }

    if (turma.professorIds.length === 0) {
      setGeneralError("Selecione pelo menos um professor.");
      setIsLoading(false);
      return;
    }

    const payload = {
      nome: turma.nome,
      cursoIds: turma.cursoIds.map(Number),
      disciplinaId: Number(turma.disciplinaId),
      semestreId: Number(turma.semestreId),
      professorIds: turma.professorIds.map(Number)
    };

    try {
      if (isEditing) {
        await api.put(`/turmas/${turmaId}`, payload);
        alert("Turma atualizada com sucesso!");
      } else {
        await api.post("/turmas", payload);
        alert("Turma cadastrada com sucesso!");
      }

      router.back();
    } catch (err) {
      console.error("Erro ao salvar turma:", err);
      setGeneralError(err.message || "Erro ao tentar salvar turma.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <main className="main">
        <section className="card">
          <p>Carregando dados da turma...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>{isEditing ? "Editar Turma" : "Cadastrar Turma"}</h1>
        </header>

        {generalError && (
          <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {generalError}
          </p>
        )}

        <div className="form-group">
          <FormInput
            label="Nome"
            type="text"
            name="nome"
            value={turma.nome}
            onChange={handleChange}
          />
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Cursos</label>
          <select
            multiple
            value={turma.cursoIds}
            onChange={handleCursosChange}
            className="form-select"
            style={{ minHeight: '100px' }}
          >
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
          </select>

          <small>Segure Ctrl para selecionar mais de um curso.</small>
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Disciplina</label>
          <select
            name="disciplinaId"
            value={turma.disciplinaId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione uma disciplina</option>

            {disciplinasFiltradas.map((disciplina) => (
              <option key={disciplina.id} value={disciplina.id}>
                {disciplina.nome}
              </option>
            ))}
          </select>

          {turma.cursoIds.length > 0 && disciplinasFiltradas.length === 0 && (
            <small>Nenhuma disciplina encontrada para os cursos selecionados.</small>
          )}
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Semestre</label>
          <select
            name="semestreId"
            value={turma.semestreId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione um semestre</option>

            {semestres.map((semestre) => (
              <option key={semestre.id} value={semestre.id}>
                {semestre.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Professores</label>
          <select
            multiple
            value={turma.professorIds}
            onChange={handleProfessoresChange}
            className="form-select"
            style={{ minHeight: '120px' }}
          >
            {professores.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.username} - {professor.email}
              </option>
            ))}
          </select>

          <small>Segure Ctrl para selecionar mais de um professor.</small>
        </div>

        <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Button type="button" onClick={handleSubmit}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>

          <Button type="button" onClick={() => router.back()} className="btn-danger">
            Voltar
          </Button>
        </div>
      </section>
    </main>
  );
}

export default function CadastroTurmaPage() {
  return (
    <Suspense
      fallback={
        <main className="main">
          <section className="card">
            <p>Carregando dados da turma...</p>
          </section>
        </main>
      }
    >
      <CadastroTurmaContent />
    </Suspense>
  );
}
