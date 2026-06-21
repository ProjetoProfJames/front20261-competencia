'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

function CadastroAvaliacaoProjetoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projetoId = searchParams.get("projetoId");

  const [projeto, setProjeto] = useState(null);
  const [form, setForm] = useState({
    nota: "",
    comentario: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userProfile, setUserProfile] = useState("");

  const podeAvaliar = ["ADMIN", "PROFESSOR", "AVALIADOR_EXTERNO"].includes(userProfile);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserProfile(localStorage.getItem("userProfile") || "");
    }

    carregarProjeto();
  }, [projetoId]);

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleString("pt-BR");
  };

  const carregarProjeto = async () => {
    setGeneralError("");

    if (!projetoId) {
      setGeneralError("Projeto nao informado.");
      setIsLoadingData(false);
      return;
    }

    try {
      const response = await api.get(`/projetos/${projetoId}`);
      setProjeto(response.data);
    } catch (err) {
      console.error("Erro ao carregar projeto:", err);
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
    }));
  };

  const handleSubmit = async () => {
    setGeneralError("");

    const nota = Number(form.nota);

    if (!projetoId) {
      setGeneralError("Projeto nao informado.");
      return;
    }

    if (!podeAvaliar) {
      setGeneralError("Apenas admin, professor ou avaliador externo pode avaliar projetos.");
      return;
    }

    if (form.nota === "" || Number.isNaN(nota)) {
      setGeneralError("Informe uma nota valida.");
      return;
    }

    if (nota < 0 || nota > 10) {
      setGeneralError("A nota deve estar entre 0 e 10.");
      return;
    }

    if (!form.comentario.trim()) {
      setGeneralError("Informe um comentario sobre o projeto.");
      return;
    }

    const payload = {
      nota,
      comentario: form.comentario.trim(),
    };

    setIsLoading(true);

    try {
      await api.post(`/projetos/${projetoId}/avaliacoes`, payload);
      alert("Avaliacao cadastrada com sucesso!");
      router.push("/avaliacao-projetos");
    } catch (err) {
      console.error("Erro ao cadastrar avaliacao:", err);
      setGeneralError(err.message || "Erro ao tentar cadastrar avaliacao.");
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
          <h1>Avaliar Projeto Integrador</h1>
        </header>

        {generalError && (
          <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>
            {generalError}
          </p>
        )}

        {!podeAvaliar && (
          <p className="error-message" style={{ color: "red", marginBottom: "10px" }}>
            Apenas admin, professor ou avaliador externo pode avaliar projetos.
          </p>
        )}

        {projeto && (
          <div className="form-group">
            <p><strong>Projeto:</strong> {projeto.nome}</p>
            <p><strong>Turma:</strong> {projeto.turma?.nome || "-"}</p>
            <p><strong>Semestre:</strong> {projeto.semestre?.nome || "-"}</p>
            <p><strong>Professor:</strong> {projeto.professorOrientador?.username || "-"}</p>
            <p><strong>Alunos:</strong> {projeto.integrantes?.map((aluno) => aluno.username).join(", ") || "-"}</p>
            <p><strong>Apresentacao:</strong> {formatarData(projeto.horarioInicio)} ate {formatarData(projeto.horarioFim)}</p>
          </div>
        )}

        <div className="form-group">
          <FormInput
            label="Nota de 0 a 10"
            type="number"
            name="nota"
            value={form.nota}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
          />
        </div>

        <div className="form-group">
          <FormInput
            label="Comentario"
            type="text"
            name="comentario"
            value={form.comentario}
            onChange={handleChange}
            maxLength={2000}
          />
        </div>

        <div className="actions" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <Button type="button" onClick={handleSubmit} disabled={isLoading || !podeAvaliar}>
            {isLoading ? "Salvando..." : "Salvar Avaliacao"}
          </Button>

          <Button type="button" onClick={() => router.push("/avaliacao-projetos")} className="btn-danger">
            Voltar
          </Button>
        </div>
      </section>
    </main>
  );
}

export default function CadastroAvaliacaoProjetoPage() {
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
      <CadastroAvaliacaoProjetoContent />
    </Suspense>
  );
}
