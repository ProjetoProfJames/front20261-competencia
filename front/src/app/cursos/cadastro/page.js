'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

function CadastroCursoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cursoId = searchParams.get("id");
  const isEditing = Boolean(cursoId);

  const [curso, setCurso] = useState({
    nome: "",
    coordenadorId: "",
    professorIds: []
  });

  const [usuarios, setUsuarios] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const coordenadores = usuarios.filter((u) => u.profile === "COORDENADOR");
  const professores = usuarios.filter((u) => u.profile === "PROFESSOR");

  useEffect(() => {
    carregarDados();
  }, [cursoId]);

  const carregarDados = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      if (!token) {
        setGeneralError("Você ainda não está logado. O formulário está pronto, mas os dados só serão carregados após login.");
        return;
      }

      const usuariosResponse = await api.get("/users");
      setUsuarios(usuariosResponse.data || []);

      if (isEditing) {
        const cursoResponse = await api.get(`/cursos/${cursoId}`);
        const data = cursoResponse.data;

        setCurso({
          nome: data.nome || "",
          coordenadorId: data.coordenador?.id ? String(data.coordenador.id) : "",
          professorIds: data.professores?.map((p) => String(p.id)) || []
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setGeneralError("Não foi possível carregar os dados do curso.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCurso((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (e) => {
    const values = Array.from(e.target.selectedOptions).map((option) => option.value);

    setCurso((prev) => ({
      ...prev,
      professorIds: values
    }));
  };

  const handleSubmit = async () => {
    setGeneralError("");
    setIsLoading(true);

    if (!curso.nome.trim()) {
      setGeneralError("Informe o nome do curso.");
      setIsLoading(false);
      return;
    }

    if (curso.nome.length > 120) {
      setGeneralError("O nome do curso deve ter no máximo 120 caracteres.");
      setIsLoading(false);
      return;
    }

    if (!curso.coordenadorId) {
      setGeneralError("Selecione um coordenador.");
      setIsLoading(false);
      return;
    }

    if (curso.professorIds.length === 0) {
      setGeneralError("Selecione pelo menos um professor.");
      setIsLoading(false);
      return;
    }

    const payload = {
      nome: curso.nome,
      coordenadorId: Number(curso.coordenadorId),
      professorIds: curso.professorIds.map(Number)
    };

    try {
      if (isEditing) {
        await api.put(`/cursos/${cursoId}`, payload);
        alert("Curso atualizado com sucesso!");
      } else {
        await api.post("/cursos", payload);
        alert("Curso cadastrado com sucesso!");
      }

      router.back();
    } catch (err) {
      console.error("Erro ao salvar curso:", err);
      setGeneralError(err.message || "Erro ao tentar salvar curso.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <main className="main">
        <section className="card">
          <p>Carregando dados do curso...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>{isEditing ? "Editar Curso" : "Cadastrar Curso"}</h1>
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
            value={curso.nome}
            onChange={handleChange}
          />
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Coordenador</label>
          <select
            name="coordenadorId"
            value={curso.coordenadorId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione um coordenador</option>

            {coordenadores.map((coordenador) => (
              <option key={coordenador.id} value={coordenador.id}>
                {coordenador.username} - {coordenador.email}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Professores</label>
          <select
            multiple
            value={curso.professorIds}
            onChange={handleMultiSelect}
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

export default function CadastroCursoPage() {
  return (
    <Suspense
      fallback={
        <main className="main">
          <section className="card">
            <p>Carregando dados do curso...</p>
          </section>
        </main>
      }
    >
      <CadastroCursoContent />
    </Suspense>
  );
}
