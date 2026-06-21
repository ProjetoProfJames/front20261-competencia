'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

export default function CadastroGrupoPage() {
  const router = useRouter();

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
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    carregarOpcoes();
  }, []);

  const carregarOpcoes = async () => {
    try {
      const [turmasResponse, locaisResponse] = await Promise.all([
        api.get("/turmas"),
        api.get("/locais"),
      ]);

      setTurmas(turmasResponse.data || []);
      setLocais(locaisResponse.data || []);
    } catch (err) {
      console.error("Erro ao carregar opções:", err);
      setGeneralError("Não foi possível carregar turmas, locais e usuários.");
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const turmaSelecionada = turmas.find((t) => t.id === Number(form.turmaId));
  const alunos = turmaSelecionada?.alunos || [];
  const professores = turmaSelecionada?.professores || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleRegister = async () => {
    setGeneralError("");

    if (!form.nome || !form.descricao || !form.turmaId || !form.professorOrientadorId || !form.localId) {
      setGeneralError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (form.integranteIds.length < 3 || form.integranteIds.length > 7) {
      setGeneralError("O grupo de projeto deve ter entre 3 e 7 alunos.");
      return;
    }

    if (!form.horarioInicio || !form.horarioFim) {
      setGeneralError("Informe o horário de início e fim.");
      return;
    }

    if (new Date(form.horarioInicio) >= new Date(form.horarioFim)) {
      setGeneralError("O horário de início deve ser anterior ao horário de fim.");
      return;
    }

    if (!turmaSelecionada?.semestre?.id) {
      setGeneralError("A turma selecionada não possui semestre vinculado.");
      return;
    }

    const payload = {
      nome: form.nome,
      descricao: form.descricao,
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
      await api.post("/projetos", payload);

      alert("Grupo de projeto cadastrado com sucesso!");
      router.push("/grupos");
    } catch (err) {
      console.error("Erro ao cadastrar grupo:", err);
      setGeneralError(err.message || "Erro ao tentar cadastrar grupo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>Cadastrar Grupo de Projeto</h1>
        </header>

        {generalError && (
          <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>
            {generalError}
          </p>
        )}

        {isLoadingOptions ? (
          <p>Carregando opções...</p>
        ) : (
          <>
            <div className="form-group">
              <FormInput
                label="Nome do Grupo de Projeto"
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                maxLength={160}
              />
            </div>

            <div className="form-group">
              <FormInput
                label="Descrição"
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
              <label>Alunos do Grupo de Projeto</label>

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
              <label>Local da Apresentação</label>
              <select name="localId" value={form.localId} onChange={handleChange}>
                <option value="">Selecione um local</option>
                {locais.map((local) => (
                  <option key={local.id} value={local.id}>
                    {local.numero}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <FormInput
                label="Horário de Início"
                type="datetime-local"
                name="horarioInicio"
                value={form.horarioInicio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <FormInput
                label="Horário de Fim"
                type="datetime-local"
                name="horarioFim"
                value={form.horarioFim}
                onChange={handleChange}
              />
            </div>

            <div className="actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <Button type="button" onClick={handleRegister}>
                {isLoading ? "Cadastrando..." : "Confirmar Cadastro"}
              </Button>
              <Button href="/grupos">Voltar</Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
