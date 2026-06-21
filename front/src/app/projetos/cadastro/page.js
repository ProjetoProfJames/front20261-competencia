'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

function CadastroProjetoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projetoId = searchParams.get("id");
  const isEditing = Boolean(projetoId);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    turmaId: "",
    professorOrientadorId: "",
    integranteIds: [],
    localId: "",
    horarioInicio: "",
    horarioFim: "",
  });

  const [turmas, setTurmas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const turmaSelecionada = turmas.find((turma) => turma.id === Number(form.turmaId));
  const alunos = turmaSelecionada?.alunos || [];
  const professores = turmaSelecionada?.professores || [];

  useEffect(() => {
    carregarDados();
  }, [projetoId]);

  const formatarDataInput = (data) => {
    if (!data) return "";
    const date = new Date(data);
    const offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
  };

  const carregarDados = async () => {
    try {
      const [turmasResponse, locaisResponse] = await Promise.all([
        api.get("/turmas"),
        api.get("/locais"),
      ]);

      const turmasApi = turmasResponse.data || [];
      setTurmas(turmasApi);
      setLocais(locaisResponse.data || []);

      if (isEditing) {
        const projetoResponse = await api.get(`/projetos/${projetoId}`);
        const projeto = projetoResponse.data;

        setForm({
          nome: projeto?.nome || "",
          descricao: projeto?.descricao || "",
          turmaId: projeto?.turma?.id ? String(projeto.turma.id) : "",
          professorOrientadorId: projeto?.professorOrientador?.id
            ? String(projeto.professorOrientador.id)
            : "",
          integranteIds: projeto?.integrantes?.map((aluno) => aluno.id) || [],
          localId: projeto?.local?.id ? String(projeto.local.id) : "",
          horarioInicio: formatarDataInput(projeto?.horarioInicio),
          horarioFim: formatarDataInput(projeto?.horarioFim),
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados do projeto:", err);
      setGeneralError("Nao foi possivel carregar os dados do projeto.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "turmaId"
        ? { professorOrientadorId: "", integranteIds: [] }
        : {}),
    }));
  };

  const handleAlunoChange = (alunoId) => {
    setForm((prev) => {
      const id = Number(alunoId);
      const jaSelecionado = prev.integranteIds.includes(id);

      return {
        ...prev,
        integranteIds: jaSelecionado
          ? prev.integranteIds.filter((item) => item !== id)
          : [...prev.integranteIds, id],
      };
    });
  };

  const handleSubmit = async () => {
    setGeneralError("");

    if (!form.nome.trim()) {
      setGeneralError("Informe o nome do projeto.");
      return;
    }

    if (!form.descricao.trim()) {
      setGeneralError("Informe a descricao do projeto.");
      return;
    }

    if (!form.turmaId || !form.professorOrientadorId || !form.localId) {
      setGeneralError("Preencha turma, professor orientador e local.");
      return;
    }

    if (form.integranteIds.length < 3 || form.integranteIds.length > 7) {
      setGeneralError("O projeto deve ter entre 3 e 7 alunos.");
      return;
    }

    if (!form.horarioInicio || !form.horarioFim) {
      setGeneralError("Informe o horario de inicio e fim.");
      return;
    }

    if (new Date(form.horarioInicio) >= new Date(form.horarioFim)) {
      setGeneralError("O horario de inicio deve ser anterior ao horario de fim.");
      return;
    }

    if (!turmaSelecionada?.semestre?.id) {
      setGeneralError("A turma selecionada nao possui semestre vinculado.");
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim(),
      turmaId: Number(form.turmaId),
      semestreId: turmaSelecionada.semestre.id,
      professorOrientadorId: Number(form.professorOrientadorId),
      integranteIds: form.integranteIds,
      localId: Number(form.localId),
      horarioInicio: new Date(form.horarioInicio).toISOString(),
      horarioFim: new Date(form.horarioFim).toISOString(),
    };

    setIsLoading(true);

    try {
      if (isEditing) {
        await api.put(`/projetos/${projetoId}`, payload);
        alert("Projeto atualizado com sucesso!");
      } else {
        await api.post("/projetos", payload);
        alert("Projeto cadastrado com sucesso!");
      }

      router.push("/projetos");
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
      setGeneralError(err.message || "Erro ao tentar salvar projeto.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <main className="main">
        <section className="card">
          <p>Carregando dados do projeto...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>{isEditing ? "Editar Projeto" : "Cadastrar Projeto"}</h1>
        </header>

        {generalError && (
          <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>
            {generalError}
          </p>
        )}

        <div className="form-group">
          <FormInput
            label="Nome"
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            maxLength={160}
          />
        </div>

        <div className="form-group">
          <FormInput
            label="Descricao"
            type="text"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            maxLength={2000}
          />
        </div>

        <div className="form-group">
          <label>Turma</label>
          <select name="turmaId" value={form.turmaId} onChange={handleChange}>
            <option value="">Selecione uma turma</option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.nome} - {turma.semestre?.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Professor Orientador</label>
          <select
            name="professorOrientadorId"
            value={form.professorOrientadorId}
            onChange={handleChange}
            disabled={!form.turmaId}
          >
            <option value="">
              {form.turmaId ? "Selecione um professor" : "Selecione uma turma primeiro"}
            </option>
            {professores.map((professor) => (
              <option key={professor.id} value={professor.id}>
                {professor.username} - {professor.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Alunos do Projeto</label>

          {!form.turmaId ? (
            <p>Selecione uma turma primeiro.</p>
          ) : alunos.length === 0 ? (
            <p>Nenhum aluno vinculado a esta turma.</p>
          ) : (
            alunos.map((aluno) => (
              <label key={aluno.id} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={form.integranteIds.includes(aluno.id)}
                  onChange={() => handleAlunoChange(aluno.id)}
                />
                {" "}
                {aluno.username} - {aluno.email}
              </label>
            ))
          )}
        </div>

        <div className="form-group">
          <label>Local da Apresentacao</label>
          <select name="localId" value={form.localId} onChange={handleChange}>
            <option value="">Selecione um local</option>
            {locais.map((local) => (
              <option key={local.id} value={local.id}>
                {local.nome || local.numero}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <FormInput
            label="Horario de Inicio"
            type="datetime-local"
            name="horarioInicio"
            value={form.horarioInicio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <FormInput
            label="Horario de Fim"
            type="datetime-local"
            name="horarioFim"
            value={form.horarioFim}
            onChange={handleChange}
          />
        </div>

        <div className="actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <Button type="button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>

          <Button type="button" onClick={() => router.push("/projetos")} className="btn-danger">
            Voltar
          </Button>
        </div>
      </section>
    </main>
  );
}

export default function CadastroProjetoPage() {
  return (
    <Suspense
      fallback={
        <main className="main">
          <section className="card">
            <p>Carregando dados do projeto...</p>
          </section>
        </main>
      }
    >
      <CadastroProjetoContent />
    </Suspense>
  );
}
