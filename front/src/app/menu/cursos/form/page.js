"use client";
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusMessage from "@/app/framework/StatusMessage";
import { atualizarCurso, buscarCursoPorId, criarCurso } from "@/utils/services/cursoService";

function CursoFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [nome, setNome] = useState("");
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(Boolean(id));
  const [salvando, setSalvando] = useState(false);

  async function carregarCurso() {
    if (!id) {
      return;
    }

    try {
      const curso = await buscarCursoPorId(id);
      setNome(curso.nome || "");
      setCodigo(curso.codigo || "");
      setDescricao(curso.descricao || "");
    } catch {
      setErro("Não foi possível carregar o curso");
    } finally {
      setCarregando(false);
    }
  }

  async function salvarCurso(event) {
    event.preventDefault();
    setErro("");

    if (!nome.trim() || !codigo.trim()) {
      setErro("Nome e código são obrigatórios");
      return;
    }

    const curso = {
      nome: nome.trim(),
      codigo: codigo.trim(),
      descricao: descricao.trim()
    };

    try {
      setSalvando(true);

      if (id) {
        await atualizarCurso(id, curso);
      } else {
        await criarCurso(curso);
      }

      router.push("/menu/cursos");
    } catch {
      setErro("Não foi possível salvar o curso");
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarCurso();
  }, []);

  return (<RotaProtegida roles={['ADMIN']}> 
      <main className="form-page">
        <form className="form-card" onSubmit={salvarCurso}>
          <div className="form-title">
            <span>Cursos</span>
            <h1>{id ? "Editar Curso" : "Novo Curso"}</h1>
          </div>

          {carregando ? (
            <p className="loading-text">Carregando dados...</p>
          ) : (
            <>
              <label>Nome</label>
              <input value={nome} onChange={(event) => setNome(event.target.value)} maxLength="120" />

              <label>Código</label>
              <input value={codigo} onChange={(event) => setCodigo(event.target.value)} maxLength="30" />

              <label>Descrição</label>
              <textarea value={descricao} onChange={(event) => setDescricao(event.target.value)} maxLength="255" />

              <StatusMessage>{erro}</StatusMessage>

              <div className="form-actions">
                <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
                <button type="button" className="secondary-button" onClick={() => router.push("/menu/cursos")}>Cancelar</button>
              </div>
            </>
          )}
        </form>
      </main>
    </RotaProtegida>
  );
}

export default function CursoFormPage() {
  return (
    <Suspense fallback={<main className="loading-page">Carregando...</main>}>
      <CursoFormContent />
    </Suspense>
  );
}
