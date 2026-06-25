'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import { api } from "@/services/api";

export default function CadastroDisciplinaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const disciplinaId = searchParams.get("id");
  const isEditing = Boolean(disciplinaId);

  const [disciplina, setDisciplina] = useState({
    nome: "",
    cursoId: ""
  });

  const [cursos, setCursos] = useState([]);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [disciplinaId]);

  const carregarDados = async () => {
    try {
      const cursosResponse = await api.get("/cursos");
      setCursos(cursosResponse.data || []);

      if (isEditing) {
        const discResponse = await api.get(`/disciplinas/${disciplinaId}`);
        const data = discResponse.data;

        setDisciplina({
          nome: data.nome || "",
          cursoId: data.curso?.id ? String(data.curso.id) : ""
        });
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setGeneralError("Não foi possível carregar os dados.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDisciplina((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setGeneralError("");
    setIsLoading(true);

    if (!disciplina.nome.trim()) {
      setGeneralError("Informe o nome da disciplina.");
      setIsLoading(false);
      return;
    }

    if (!disciplina.cursoId) {
      setGeneralError("Selecione um curso para esta disciplina.");
      setIsLoading(false);
      return;
    }

    const payload = {
      nome: disciplina.nome,
      cursoId: Number(disciplina.cursoId)
    };

    try {
      if (isEditing) {
        await api.put(`/disciplinas/${disciplinaId}`, payload);
        alert("Disciplina atualizada com sucesso!");
      } else {
        await api.post("/disciplinas", payload);
        alert("Disciplina cadastrada com sucesso!");
      }
      router.back();
    } catch (err) {
      console.error("Erro ao salvar disciplina:", err);
      setGeneralError(err.response?.data?.message || "Erro ao salvar disciplina.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return <main className="main"><section className="card"><p>Carregando...</p></section></main>;
  }

  return (
    <main className="main">
      <section className="card">
        <header>
          <h1>{isEditing ? "Editar Disciplina" : "Cadastrar Disciplina"}</h1>
        </header>

        {generalError && <p className="error-message" style={{ color: 'red' }}>{generalError}</p>}

        <div className="form-group">
          <FormInput
            label="Nome da Disciplina"
            type="text"
            name="nome"
            value={disciplina.nome}
            onChange={handleChange}
          />
        </div>

        <div className="input-group" style={{ marginTop: '10px' }}>
          <label>Curso</label>
          <select
            name="cursoId"
            value={disciplina.cursoId}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Selecione um curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
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