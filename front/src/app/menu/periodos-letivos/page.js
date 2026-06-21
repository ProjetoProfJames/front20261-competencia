"use client";
import RotaProtegida from '@/app/framework/components/RotaProtegida';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmptyState from "@/app/framework/EmptyState"
import StatusMessage from "@/app/framework/StatusMessage";
import { listarPeriodosLetivos, removerPeriodoLetivo } from "@/utils/services/periodoLetivoService";

export default function PeriodosLetivosPage() {
  const router = useRouter();
  const [periodos, setPeriodos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  async function carregarPeriodos() {
    try {
      setCarregando(true);
      const data = await listarPeriodosLetivos();
      setPeriodos(Array.isArray(data) ? data : []);
    } catch {
      setErro("Não foi possível carregar os períodos letivos");
    } finally {
      setCarregando(false);
    }
  }

  async function excluirPeriodo(id) {
    const confirmar = confirm("Deseja excluir este período letivo?");

    if (!confirmar) {
      return;
    }

    try {
      await removerPeriodoLetivo(id);
      await carregarPeriodos();
    } catch {
      setErro("Não foi possível excluir o período letivo");
    }
  }

  useEffect(() => {
    carregarPeriodos();
  }, []);

  return ( <RotaProtegida roles={'ADMIN'}>
    <main className="page-container">
        <div className="page-header">
          <div className="page-title">
            <span>Cadastro</span>
            <h1>Períodos Letivos</h1>
            <p>Gerencie ano, semestre, datas e status dos períodos.</p>
          </div>

          <button onClick={() => router.push("/menu/periodos-letivos/form")}>Novo Período</button>
        </div>

        <StatusMessage>{erro}</StatusMessage>

        {carregando ? (
          <div className="table-card loading-text">Carregando períodos...</div>
        ) : periodos.length === 0 ? (
          <EmptyState title="Nenhum período cadastrado" description="Clique em Novo Período para criar o primeiro registro." />
        ) : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ano</th>
                  <th>Semestre</th>
                  <th>Início</th>
                  <th>Fim</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {periodos.map((periodo) => (
                  <tr key={periodo.id}>
                    <td>{periodo.nome}</td>
                    <td>{periodo.ano}</td>
                    <td>{periodo.semestre}</td>
                    <td>{periodo.dataInicio}</td>
                    <td>{periodo.dataFim}</td>
                    <td>{periodo.ativo ? "Ativo" : "Inativo"}</td>
                    <td className="actions-cell">
                      <button className="secondary-button" onClick={() => router.push(`/menu/periodos-letivos/form?id=${periodo.id}`)}>
                        Editar
                      </button>
                      <button className="danger-button" onClick={() => excluirPeriodo(periodo.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </RotaProtegida>
  );
}
