'use client';

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import Table from "@/components/Table";
import Button from "@/components/Button";
import RecordActions from "@/components/RecordActions";
import { useSession } from "@/hooks/useSession";
import { semestreService } from "@/services/semestreService";

export default function SemestresPage() {
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
        const data = await semestreService.list(token);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Falha ao carregar os períodos");
      }
    }

    load();
  }, [loading, token]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((item) =>
      String(item?.nome || "").toLowerCase().includes(term)
    );
  }, [items, search]);

  const canManage = user?.profile === "ADMIN";

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <section>
        <h1>Períodos Letivos</h1>

        <label>
          <span>Pesquisar</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome do período"
          />
        </label>

        {canManage ? (
          <p>
            <Button type="button" onClick={() => window.location.assign("/semestres/novo")}>
              Novo período
            </Button>
          </p>
        ) : null}

        {error ? <p>{error}</p> : null}

        <Table
          headers={["ID", "Nome", "Início", "Fim", "Ações"]}
          isEmpty={filteredItems.length === 0}
          emptyMessage="Nenhum período encontrado"
        >
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.dataInicio}</td>
              <td>{item.dataFim}</td>
              <td>
                {canManage ? (
                  <RecordActions
                    canEdit
                    canDelete
                    onEdit={() => window.location.assign(`/semestres/${item.id}`)}
                    onDelete={async () => {
                      if (!confirm("Deseja excluir este período?")) {
                        return;
                      }

                      try {
                        await semestreService.remove(item.id, token);
                        const data = await semestreService.list(token);
                        setItems(Array.isArray(data) ? data : []);
                      } catch (err) {
                        setError(err.message || "Falha ao excluir o período");
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
