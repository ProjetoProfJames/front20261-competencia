'use client';

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import Table from "@/components/Table";
import Button from "@/components/Button";
import RecordActions from "@/components/RecordActions";
import { useSession } from "@/hooks/useSession";
import { disciplinaService } from "@/services/disciplinaService";

export default function DisciplinasPage() {
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
        const data = await disciplinaService.list(token);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Falha ao carregar as disciplinas");
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
        item?.cursoNome,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(term);
    });
  }, [items, search]);

  const canManage = user?.profile === "ADMIN";

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <section>
        <h1>Disciplinas</h1>

        <label>
          <span>Pesquisar</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome ou curso"
          />
        </label>

        {canManage ? (
          <p>
            <Button type="button" onClick={() => window.location.assign("/disciplinas/novo")}>
              Nova disciplina
            </Button>
          </p>
        ) : null}

        {error ? <p>{error}</p> : null}

        <Table
          headers={["ID", "Nome", "Curso", "Ações"]}
          isEmpty={filteredItems.length === 0}
          emptyMessage="Nenhuma disciplina encontrada"
        >
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.cursoNome || "-"}</td>
              <td>
                {canManage ? (
                  <RecordActions
                    canEdit
                    canDelete
                    onEdit={() => window.location.assign(`/disciplinas/${item.id}`)}
                    onDelete={async () => {
                      if (!confirm("Deseja excluir esta disciplina?")) {
                        return;
                      }

                      try {
                        await disciplinaService.remove(item.id, token);
                        const data = await disciplinaService.list(token);
                        setItems(Array.isArray(data) ? data : []);
                      } catch (err) {
                        setError(err.message || "Falha ao excluir a disciplina");
                      }
                    }}
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