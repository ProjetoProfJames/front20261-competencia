'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import Table from "@/components/Table";
import Button from "@/components/Button";
import RecordActions from "@/components/RecordActions";
import { useSession } from "@/hooks/useSession";
import { turmaService } from "@/services/turmaService";
import { joinNames } from "@/lib/display";

export default function TurmasPage() {
  const router = useRouter();
  const { loading, token, user, logout } = useSession();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyActionId, setBusyActionId] = useState(null);

  useEffect(() => {
    if (loading || !token) {
      return;
    }

    async function load() {
      try {
        const data = await turmaService.list(token);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Falha ao carregar as turmas");
      }
    }

    load();
  }, [loading, token]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((item) => {
      const text = [
        item?.nome,
        joinNames(item?.cursos),
        item?.disciplina?.nome,
        item?.semestre?.nome,
        ...(item?.professores || []).map((professor) => professor?.username || professor?.email),
        ...(item?.alunos || []).map((aluno) => aluno?.username || aluno?.email),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(term);
    });
  }, [items, search]);

  const canManage = user?.profile === "PROFESSOR" || user?.profile === "ADMIN";

  const refresh = async () => {
    const data = await turmaService.list(token);
    setItems(Array.isArray(data) ? data : []);
  };

  const handleGenerateMatriculas = async (id) => {
    try {
      setBusyActionId(id);
      setError("");
      await turmaService.gerarMatriculas(id, token);
      await refresh();
    } catch (err) {
      setError(err.message || "Falha ao gerar matrículas");
    } finally {
      setBusyActionId(null);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <section>
        <h1>Turmas</h1>

        <label>
          <span>Pesquisar</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome, curso, disciplina, período, professor ou aluno"
          />
        </label>

        {canManage ? (
          <p>
            <Button type="button" onClick={() => router.push("/turmas/novo")}>
              Nova turma
            </Button>
          </p>
        ) : null}

        {error ? <p>{error}</p> : null}

        <Table
          headers={["ID", "Nome", "Cursos", "Disciplina", "Semestre", "Professores", "Alunos", "Ações"]}
          isEmpty={filteredItems.length === 0}
          emptyMessage="Nenhuma turma encontrada"
        >
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{joinNames(item.cursos)}</td>
              <td>{item.disciplina?.nome || "-"}</td>
              <td>{item.semestre?.nome || "-"}</td>
              <td>{joinNames(item.professores)}</td>
              <td>{Array.isArray(item.alunos) ? item.alunos.length : 0}</td>
              <td>
                {canManage ? (
                  <div>
                    <RecordActions
                      canEdit
                      canDelete
                      onEdit={() => router.push(`/turmas/${item.id}`)}
                      onDelete={async () => {
                        if (!confirm("Deseja excluir esta turma?")) {
                          return;
                        }

                        try {
                          setBusyActionId(item.id);
                          setError("");
                          await turmaService.remove(item.id, token);
                          await refresh();
                        } catch (err) {
                          setError(err.message || "Falha ao excluir a turma");
                        } finally {
                          setBusyActionId(null);
                        }
                      }}
                    />
                    {" "}
                    <Button type="button" onClick={() => router.push(`/turmas/${item.id}/alunos`)}>
                      Alunos
                    </Button>
                    {" "}
                    <Button
                      type="button"
                      onClick={() => handleGenerateMatriculas(item.id)}
                      disabled={busyActionId === item.id}
                    >
                      {busyActionId === item.id ? "Processando..." : "Matrículas"}
                    </Button>
                  </div>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </Table>
      </section>
    </AppShell>
  );
}
