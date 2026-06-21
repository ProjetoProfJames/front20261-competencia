"use client";
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusMessage from "@/app/framework/StatusMessage";
import { listarCursos } from "@/utils/services/cursoService";
import { listarPeriodosLetivos } from "@/utils/services/periodoLetivoService";
import { atualizarTurma, buscarTurmaPorId, criarTurma } from "@/utils/services/turmaService";

function TurmaFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [nome, setNome] = useState("");
  const [cursoId, setCursoId] = useState("");
  const [periodoLetivoId, setPeriodoLetivoId] = useState("");
  const [turno, setTurno] = useState("");
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregarDados() {
    try {
      const cursosData = await listarCursos();
      const periodosData = await listarPeriodosLetivos();

      setCursos(Array.isArray(cursosData) ? cursosData : []);
      setPeriodos(Array.isArray(periodosData) ? periodosData : []);

      if (id) {
        const turma = await buscarTurmaPorId(id);
        setNome(turma.nome || "");
        setCursoId(String(turma.cursoId || turma.curso?.id || ""));
        setPeriodoLetivoId(String(turma.periodoLetivoId || turma.periodoLetivo?.id || ""));
        setTurno(turma.turno || "");
      }
    } catch {
      setErro("Não foi possível carregar os dados da turma");
    } finally {
      setCarregando(false);
    }
  }

  async function salvarTurma(event) {
    event.preventDefault();
    setErro("");

    if (!nome.trim() || !cursoId || !periodoLetivoId || !turno) {
      setErro("Preencha todos os campos obrigatórios");
      return;
    }

    const turma = {
      nome: nome.trim(),
      cursoId: Number(cursoId),
      periodoLetivoId: Number(periodoLetivoId),
      turno
    };

    try {
      setSalvando(true);

      if (id) {
        await atualizarTurma(id, turma);
      } else {
        await criarTurma(turma);
      }

      router.push("/menu/turmas");
    } catch {
      setErro("Não foi possível salvar a turma");
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (<RotaProtegida roles={['ADMIN','ALUNO','PROFESSOR','COORDENADOR']}>

      <main className="form-page">
        <form className="form-card" onSubmit={salvarTurma}>
          <div className="form-title">
            <span>Turmas</span>
            <h1>{id ? "Editar Turma" : "Nova Turma"}</h1>
          </div>

          {carregando ? (
            <p className="loading-text">Carregando dados...</p>
          ) : (
            <>
              <label>Nome</label>
              <input value={nome} onChange={(event) => setNome(event.target.value)} maxLength="120" />

              <label>Curso</label>
              <select value={cursoId} onChange={(event) => setCursoId(event.target.value)}>
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>{curso.nome}</option>
                ))}
              </select>

              <label>Período Letivo</label>
              <select value={periodoLetivoId} onChange={(event) => setPeriodoLetivoId(event.target.value)}>
                <option value="">Selecione um período</option>
                {periodos.map((periodo) => (
                  <option key={periodo.id} value={periodo.id}>{periodo.nome}</option>
                ))}
              </select>

              <label>Turno</label>
              <select value={turno} onChange={(event) => setTurno(event.target.value)}>
                <option value="">Selecione</option>
                <option value="MATUTINO">Matutino</option>
                <option value="VESPERTINO">Vespertino</option>
                <option value="NOTURNO">Noturno</option>
                <option value="INTEGRAL">Integral</option>
              </select>

              <StatusMessage>{erro}</StatusMessage>

              <div className="form-actions">
                <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
                <button type="button" className="secondary-button" onClick={() => router.push("/menu/turmas")}>Cancelar</button>
              </div>
            </>
          )}
        </form>
      </main>
     </RotaProtegida>
  );
}

export default function TurmaFormPage() {
  return (
    <Suspense fallback={<main className="loading-page">Carregando...</main>}>
      <TurmaFormContent />
    </Suspense>
  );
}
