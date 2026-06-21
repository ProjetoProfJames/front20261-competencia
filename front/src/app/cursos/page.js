'use client';

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import Table from "@/components/Table";
import Button from "@/components/Button";
import RecordActions from "@/components/RecordActions";
import { useSession } from "@/hooks/useSession";
import { cursoService } from "@/services/cursoService";
import { joinNames } from "@/lib/display";

export default function CursosPage() {
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
        const data = await cursoService.list(token);
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Falha ao carregar os cursos");
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
        item?.coordenador?.username,
        item?.coordenador?.email,
        ...(item?.professores || []).map((professor) => professor?.username || professor?.email),
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
        <h1>Cursos</h1>

        <label>
          <span>Pesquisar</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nome, coordenador ou professor"
          />
        </label>

        {canManage ? (
          <p>
            <Button type="button" onClick={() => window.location.assign("/cursos/novo")}>
              Novo curso
            </Button>
          </p>
        ) : null}

        {error ? <p>{error}</p> : null}

        <Table
          headers={["ID", "Nome", "Coordenador", "Professores", "Ações"]}
          isEmpty={filteredItems.length === 0}
          emptyMessage="Nenhum curso encontrado"
        >
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nome}</td>
              <td>{item.coordenador ? `${item.coordenador.username} - ${item.coordenador.email}` : "-"}</td>
              <td>{joinNames(item.professores)}</td>
              <td>
                {canManage ? (
                  <RecordActions
                    canEdit
                    canDelete
                    onEdit={() => window.location.assign(`/cursos/${item.id}`)}
                    onDelete={async () => {
                      if (!confirm("Deseja excluir este curso?")) {
                        return;
                      }

                      try {
                        await cursoService.remove(item.id, token);
                        const data = await cursoService.list(token);
                        setItems(Array.isArray(data) ? data : []);
                      } catch (err) {
                        setError(err.message || "Falha ao excluir o curso");
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
