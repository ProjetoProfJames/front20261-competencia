"use client";
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatusMessage from "@/app/framework/StatusMessage";
import { atualizarPeriodoLetivo, buscarPeriodoLetivoPorId, criarPeriodoLetivo } from "@/utils/services/periodoLetivoService";

function PeriodoLetivoFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [nome, setNome] = useState("");
  const [ano, setAno] = useState("");
  const [semestre, setSemestre] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(Boolean(id));
  const [salvando, setSalvando] = useState(false);

  async function carregarPeriodo() {
    if (!id) {
      return;
    }

    try {
      const periodo = await buscarPeriodoLetivoPorId(id);
      setNome(periodo.nome || "");
      setAno(periodo.ano || "");
      setSemestre(periodo.semestre || "");
      setDataInicio(periodo.dataInicio || "");
      setDataFim(periodo.dataFim || "");
      setAtivo(periodo.ativo ?? true);
    } catch {
      setErro("Não foi possível carregar o período letivo");
    } finally {
      setCarregando(false);
    }
  }

  async function salvarPeriodo(event) {
    event.preventDefault();
    setErro("");

    if (!nome.trim() || !ano || !semestre || !dataInicio || !dataFim) {
      setErro("Preencha todos os campos obrigatórios");
      return;
    }

    if (Number(dataFim.replaceAll("-", "")) < Number(dataInicio.replaceAll("-", ""))) {
      setErro("A data final deve ser maior ou igual à data inicial");
      return;
    }

    const periodoLetivo = {
      nome: nome.trim(),
      ano: Number(ano),
      semestre: Number(semestre),
      dataInicio,
      dataFim,
      ativo
    };

    try {
      setSalvando(true);

      if (id) {
        await atualizarPeriodoLetivo(id, periodoLetivo);
      } else {
        await criarPeriodoLetivo(periodoLetivo);
      }

      router.push("/menu/periodos-letivos");
    } catch {
      setErro("Não foi possível salvar o período letivo");
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    carregarPeriodo();
  }, []);

  return ( <RotaProtegida roles={'ADMIN'}>
  
      <main className="form-page">
        <form className="form-card" onSubmit={salvarPeriodo}>
          <div className="form-title">
            <span>Períodos Letivos</span>
            <h1>{id ? "Editar Período Letivo" : "Novo Período Letivo"}</h1>
          </div>

          {carregando ? (
            <p className="loading-text">Carregando dados...</p>
          ) : (
            <>
              <label>Nome</label>
              <input value={nome} onChange={(event) => setNome(event.target.value)} maxLength="120" />

              <label>Ano</label>
              <input type="number" min="2000" max="2100" value={ano} onChange={(event) => setAno(event.target.value)} />

              <label>Semestre</label>
              <select value={semestre} onChange={(event) => setSemestre(event.target.value)}>
                <option value="">Selecione</option>
                <option value="1">1º Semestre</option>
                <option value="2">2º Semestre</option>
              </select>

              <label>Data de início</label>
              <input type="date" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} />

              <label>Data de fim</label>
              <input type="date" value={dataFim} onChange={(event) => setDataFim(event.target.value)} />

              <label>Status</label>
              <select value={ativo ? "true" : "false"} onChange={(event) => setAtivo(event.target.value === "true")}>
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>

              <StatusMessage>{erro}</StatusMessage>

              <div className="form-actions">
                <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
                <button type="button" className="secondary-button" onClick={() => router.push("/menu/periodos-letivos")}>Cancelar</button>
              </div>
            </>
          )}
        </form>
      </main>
     </RotaProtegida>
  );
}

export default function PeriodoLetivoFormPage() {
  return (
    <Suspense fallback={<main className="loading-page">Carregando...</main>}>
      <PeriodoLetivoFormContent />
    </Suspense>
  );
}
