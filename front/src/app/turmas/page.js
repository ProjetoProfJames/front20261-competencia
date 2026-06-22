'use client';

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import Table from "@/components/Table";
import Button from "@/components/Button";
import RecordActions from "@/components/RecordActions";
import { useSession } from "@/hooks/useSession";
import { turmaService } from "@/services/turmaService";
import { joinNames } from "@/lib/display";

export default function TurmasPage() {
  const { loading, token, user, logout } = useSession();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(term);
    });
  }, [items, search]);

  const canCreate = user?.profile === "PROFESSOR";
  const canEdit = user?.profile === "PROFESSOR";
  const canDelete = user?.profile === "PROFESSOR" || user?.profile === "ADMIN";

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
            placeholder="Nome, curso, disciplina, período ou professor"
          />
        </label>

        {canCreate ? (
          <p>
            <Button type="button" onClick={() => window.location.assign("/turmas/novo")}>
              Nova turma
            </Button>
          </p>
        ) : null}

        {error ? <p>{error}</p> : null}

        <Table
          headers={["ID", "Nome", "Cursos", "Disciplina", "Período", "Professores", "Alunos", "Ações"]}
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
              <td>{joinNames(item.alunos)}</td>
              <td>
                {canEdit || canDelete ? (
                  <RecordActions
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onEdit={canEdit ? () => window.location.assign(`/turmas/${item.id}`) : undefined}
                    onDelete={canDelete ? async () => {
                      if (!confirm("Deseja excluir esta turma?")) {
                        return;
                      }

                      try {
                        await turmaService.remove(item.id, token);
                        const data = await turmaService.list(token);
                        setItems(Array.isArray(data) ? data : []);
                      } catch (err) {
                        setError(err.message || "Falha ao excluir a turma");
                      }
                    } : undefined}
                  />
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
